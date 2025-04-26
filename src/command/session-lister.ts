/**
 * Session Lister
 * 
 * Lists all active terminal sessions
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { z } from 'zod';
import { getActiveProcesses } from './cmd-executor';
import { getMonitoredProcesses } from './output-reader';

const execAsync = promisify(exec);

/**
 * Schema for SessionLister
 */
export const ListSessionsSchema = z.object({
  filter: z.string().optional(),
  limit: z.number().optional().default(100),
  sortBy: z.enum(['pid', 'command', 'startTime', 'runningTime']).optional().default('startTime'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

/**
 * Session information
 */
interface SessionInfo {
  pid: number;
  command: string;
  startTime: Date;
  runningTime: number;
  user?: string;
  memory?: number;
  cpu?: number;
  monitored: boolean;
}

/**
 * Get system processes
 * 
 * @returns Array of system processes
 */
async function getSystemProcesses(): Promise<Array<{
  pid: number;
  command: string;
  user: string;
  memory: number;
  cpu: number;
}>> {
  try {
    let command: string;
    
    if (process.platform === 'win32') {
      // On Windows, use wmic
      command = 'wmic process get ProcessId,CommandLine,WorkingSetSize /format:csv';
    } else {
      // On Unix-like systems, use ps
      command = 'ps -eo pid,user,pcpu,pmem,command --sort=-pcpu';
    }
    
    const { stdout } = await execAsync(command);
    
    // Parse the output
    if (process.platform === 'win32') {
      // Parse Windows output
      const lines = stdout.trim().split('\n');
      
      // Skip the header line
      const processes = lines.slice(1).map(line => {
        const parts = line.split(',');
        
        // Skip if we don't have enough parts
        if (parts.length < 3) {
          return null;
        }
        
        const pid = parseInt(parts[1], 10);
        const memory = parseInt(parts[2], 10) / 1024; // Convert to KB
        const command = parts[3] || '';
        
        return {
          pid,
          command,
          user: 'N/A',
          memory,
          cpu: 0,
        };
      }).filter(Boolean) as Array<{
        pid: number;
        command: string;
        user: string;
        memory: number;
        cpu: number;
      }>;
      
      return processes;
    } else {
      // Parse Unix-like output
      const lines = stdout.trim().split('\n');
      
      // Skip the header line
      const processes = lines.slice(1).map(line => {
        const parts = line.trim().split(/\s+/);
        
        // Skip if we don't have enough parts
        if (parts.length < 5) {
          return null;
        }
        
        const pid = parseInt(parts[0], 10);
        const user = parts[1];
        const cpu = parseFloat(parts[2]);
        const memory = parseFloat(parts[3]);
        const command = parts.slice(4).join(' ');
        
        return {
          pid,
          command,
          user,
          memory,
          cpu,
        };
      }).filter(Boolean) as Array<{
        pid: number;
        command: string;
        user: string;
        memory: number;
        cpu: number;
      }>;
      
      return processes;
    }
  } catch (error) {
    return [];
  }
}

/**
 * List all sessions
 * 
 * @param filter Filter string
 * @param limit Maximum number of sessions to return
 * @param sortBy Field to sort by
 * @param sortOrder Sort order
 * @returns Array of session information
 */
export async function listSessions(
  filter?: string,
  limit: number = 100,
  sortBy: 'pid' | 'command' | 'startTime' | 'runningTime' = 'startTime',
  sortOrder: 'asc' | 'desc' = 'desc',
): Promise<SessionInfo[]> {
  try {
    // Get all active processes
    const activeProcesses = getActiveProcesses();
    const monitoredProcesses = getMonitoredProcesses();
    const systemProcesses = await getSystemProcesses();
    
    // Create a map of PIDs to system process info
    const systemProcessMap = new Map(
      systemProcesses.map(process => [process.pid, process])
    );
    
    // Create a set of monitored PIDs
    const monitoredPids = new Set(monitoredProcesses.map(process => process.pid));
    
    // Combine all processes
    const now = new Date();
    const allSessions: SessionInfo[] = [
      // Add active processes
      ...activeProcesses.map(process => {
        const systemProcess = systemProcessMap.get(process.pid);
        
        return {
          pid: process.pid,
          command: process.command,
          startTime: process.startTime,
          runningTime: now.getTime() - process.startTime.getTime(),
          user: systemProcess?.user,
          memory: systemProcess?.memory,
          cpu: systemProcess?.cpu,
          monitored: monitoredPids.has(process.pid),
        };
      }),
      
      // Add monitored processes that aren't already included
      ...monitoredProcesses
        .filter(process => !activeProcesses.some(active => active.pid === process.pid))
        .map(process => {
          const systemProcess = systemProcessMap.get(process.pid);
          
          return {
            pid: process.pid,
            command: process.command,
            startTime: process.startTime,
            runningTime: now.getTime() - process.startTime.getTime(),
            user: systemProcess?.user,
            memory: systemProcess?.memory,
            cpu: systemProcess?.cpu,
            monitored: true,
          };
        }),
    ];
    
    // Filter sessions
    let filteredSessions = allSessions;
    
    if (filter) {
      const regex = new RegExp(filter, 'i');
      
      filteredSessions = filteredSessions.filter(session =>
        regex.test(session.command) ||
        regex.test(session.pid.toString()) ||
        (session.user && regex.test(session.user))
      );
    }
    
    // Sort sessions
    filteredSessions.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'pid':
          comparison = a.pid - b.pid;
          break;
        
        case 'command':
          comparison = a.command.localeCompare(b.command);
          break;
        
        case 'startTime':
          comparison = a.startTime.getTime() - b.startTime.getTime();
          break;
        
        case 'runningTime':
          comparison = a.runningTime - b.runningTime;
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    // Limit the number of sessions
    return filteredSessions.slice(0, limit);
  } catch (error) {
    return [];
  }
}

/**
 * Format running time
 * 
 * @param ms Running time in milliseconds
 * @returns Formatted running time
 */
function formatRunningTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}

/**
 * Format memory
 * 
 * @param kb Memory in kilobytes
 * @returns Formatted memory
 */
function formatMemory(kb?: number): string {
  if (kb === undefined) {
    return 'N/A';
  }
  
  if (kb < 1024) {
    return `${kb.toFixed(2)} KB`;
  } else if (kb < 1024 * 1024) {
    return `${(kb / 1024).toFixed(2)} MB`;
  } else {
    return `${(kb / (1024 * 1024)).toFixed(2)} GB`;
  }
}

/**
 * Handle list_sessions command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleListSessions(args: any) {
  try {
    const { filter, limit, sortBy, sortOrder } = args;
    const sessions = await listSessions(filter, limit, sortBy, sortOrder);
    
    if (sessions.length === 0) {
      return {
        content: [{ type: "text", text: "No active sessions found" }],
        isError: false,
      };
    }
    
    return {
      content: [
        { type: "text", text: `Active Sessions (${sessions.length}):` },
        {
          type: "table",
          headers: ["PID", "Command", "Start Time", "Running Time", "User", "Memory", "CPU", "Monitored"],
          rows: sessions.map(session => [
            session.pid.toString(),
            session.command,
            session.startTime.toISOString(),
            formatRunningTime(session.runningTime),
            session.user || 'N/A',
            formatMemory(session.memory),
            session.cpu !== undefined ? `${session.cpu.toFixed(1)}%` : 'N/A',
            session.monitored ? 'Yes' : 'No',
          ]),
        },
      ],
      isError: false,
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error listing sessions: ${error}` }],
      isError: true,
    };
  }
}
