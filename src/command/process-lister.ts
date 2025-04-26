/**
 * Process Lister
 * 
 * Lists all running processes on the system
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { z } from 'zod';

const execAsync = promisify(exec);

/**
 * Schema for ProcessLister
 */
export const ListProcessesSchema = z.object({
  filter: z.string().optional(),
  limit: z.number().optional().default(100),
  sortBy: z.enum(['pid', 'command', 'cpu', 'memory']).optional().default('cpu'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

/**
 * Process information
 */
interface ProcessInfo {
  pid: number;
  ppid?: number;
  command: string;
  user?: string;
  memory?: number;
  cpu?: number;
  startTime?: string;
  state?: string;
}

/**
 * List all processes
 * 
 * @param filter Filter string
 * @param limit Maximum number of processes to return
 * @param sortBy Field to sort by
 * @param sortOrder Sort order
 * @returns Array of process information
 */
export async function listProcesses(
  filter?: string,
  limit: number = 100,
  sortBy: 'pid' | 'command' | 'cpu' | 'memory' = 'cpu',
  sortOrder: 'asc' | 'desc' = 'desc',
): Promise<ProcessInfo[]> {
  try {
    let command: string;
    
    if (process.platform === 'win32') {
      // On Windows, use wmic
      command = 'wmic process get ProcessId,ParentProcessId,CommandLine,WorkingSetSize /format:csv';
    } else {
      // On Unix-like systems, use ps
      command = 'ps -eo pid,ppid,user,pcpu,pmem,start,state,command --sort=-pcpu';
    }
    
    const { stdout } = await execAsync(command);
    
    // Parse the output
    let processes: ProcessInfo[] = [];
    
    if (process.platform === 'win32') {
      // Parse Windows output
      const lines = stdout.trim().split('\n');
      
      // Skip the header line
      processes = lines.slice(1).map(line => {
        const parts = line.split(',');
        
        // Skip if we don't have enough parts
        if (parts.length < 4) {
          return null;
        }
        
        const pid = parseInt(parts[1], 10);
        const ppid = parseInt(parts[2], 10);
        const memory = parseInt(parts[3], 10) / 1024; // Convert to KB
        const command = parts[4] || '';
        
        return {
          pid,
          ppid,
          command,
          memory,
        };
      }).filter(Boolean) as ProcessInfo[];
    } else {
      // Parse Unix-like output
      const lines = stdout.trim().split('\n');
      
      // Skip the header line
      processes = lines.slice(1).map(line => {
        const parts = line.trim().split(/\s+/);
        
        // Skip if we don't have enough parts
        if (parts.length < 8) {
          return null;
        }
        
        const pid = parseInt(parts[0], 10);
        const ppid = parseInt(parts[1], 10);
        const user = parts[2];
        const cpu = parseFloat(parts[3]);
        const memory = parseFloat(parts[4]);
        const startTime = parts[5];
        const state = parts[6];
        const command = parts.slice(7).join(' ');
        
        return {
          pid,
          ppid,
          command,
          user,
          memory,
          cpu,
          startTime,
          state,
        };
      }).filter(Boolean) as ProcessInfo[];
    }
    
    // Filter processes
    let filteredProcesses = processes;
    
    if (filter) {
      const regex = new RegExp(filter, 'i');
      
      filteredProcesses = filteredProcesses.filter(process =>
        regex.test(process.command) ||
        regex.test(process.pid.toString()) ||
        (process.user && regex.test(process.user))
      );
    }
    
    // Sort processes
    filteredProcesses.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'pid':
          comparison = a.pid - b.pid;
          break;
        
        case 'command':
          comparison = a.command.localeCompare(b.command);
          break;
        
        case 'cpu':
          comparison = (a.cpu || 0) - (b.cpu || 0);
          break;
        
        case 'memory':
          comparison = (a.memory || 0) - (b.memory || 0);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    // Limit the number of processes
    return filteredProcesses.slice(0, limit);
  } catch (error) {
    return [];
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
 * Handle list_processes command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleListProcesses(args: any) {
  try {
    const { filter, limit, sortBy, sortOrder } = args;
    const processes = await listProcesses(filter, limit, sortBy, sortOrder);
    
    if (processes.length === 0) {
      return {
        content: [{ type: "text", text: "No processes found" }],
        isError: false,
      };
    }
    
    // Determine which columns to include based on available data
    const hasUser = processes.some(process => process.user !== undefined);
    const hasCpu = processes.some(process => process.cpu !== undefined);
    const hasMemory = processes.some(process => process.memory !== undefined);
    const hasStartTime = processes.some(process => process.startTime !== undefined);
    const hasState = processes.some(process => process.state !== undefined);
    
    // Build headers
    const headers = ["PID", "PPID", "Command"];
    
    if (hasUser) {
      headers.push("User");
    }
    
    if (hasCpu) {
      headers.push("CPU %");
    }
    
    if (hasMemory) {
      headers.push("Memory");
    }
    
    if (hasStartTime) {
      headers.push("Start Time");
    }
    
    if (hasState) {
      headers.push("State");
    }
    
    // Build rows
    const rows = processes.map(process => {
      const row = [
        process.pid.toString(),
        process.ppid?.toString() || 'N/A',
        process.command,
      ];
      
      if (hasUser) {
        row.push(process.user || 'N/A');
      }
      
      if (hasCpu) {
        row.push(process.cpu !== undefined ? `${process.cpu.toFixed(1)}%` : 'N/A');
      }
      
      if (hasMemory) {
        row.push(formatMemory(process.memory));
      }
      
      if (hasStartTime) {
        row.push(process.startTime || 'N/A');
      }
      
      if (hasState) {
        row.push(process.state || 'N/A');
      }
      
      return row;
    });
    
    return {
      content: [
        { type: "text", text: `Processes (${processes.length}):` },
        {
          type: "table",
          headers,
          rows,
        },
      ],
      isError: false,
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error listing processes: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Get process tree
 * 
 * @param processes Array of processes
 * @param parentPid Parent process ID
 * @param depth Current depth
 * @returns Process tree
 */
function getProcessTree(processes: ProcessInfo[], parentPid: number, depth: number = 0): string {
  // Find child processes
  const children = processes.filter(process => process.ppid === parentPid);
  
  if (children.length === 0) {
    return '';
  }
  
  let result = '';
  
  // Add each child process
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    const isLast = i === children.length - 1;
    const prefix = depth === 0 ? '' : '  '.repeat(depth - 1) + (isLast ? '└─ ' : '├─ ');
    
    // Add the child process
    result += `${prefix}${child.pid}: ${child.command}\n`;
    
    // Add the child's children
    const childTree = getProcessTree(processes, child.pid, depth + 1);
    
    if (childTree) {
      result += childTree;
    }
  }
  
  return result;
}

/**
 * Handle process_tree command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleProcessTree(args: any) {
  try {
    const { rootPid } = args;
    const processes = await listProcesses();
    
    // If rootPid is specified, only show the tree for that process
    const rootPids = rootPid
      ? [rootPid]
      : processes
          .filter(process => !process.ppid || process.ppid === 0 || !processes.some(p => p.pid === process.ppid))
          .map(process => process.pid);
    
    let tree = '';
    
    for (const pid of rootPids) {
      const rootProcess = processes.find(process => process.pid === pid);
      
      if (rootProcess) {
        tree += `${rootProcess.pid}: ${rootProcess.command}\n`;
        tree += getProcessTree(processes, rootProcess.pid, 1);
      }
    }
    
    return {
      content: [
        { type: "text", text: "Process Tree:" },
        { type: "text", text: tree },
      ],
      isError: false,
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error generating process tree: ${error}` }],
      isError: true,
    };
  }
}
