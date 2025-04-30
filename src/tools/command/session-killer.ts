// Auto-generated safe fallback for session-killer

export function activate() {
    console.log("[TOOL] session-killer activated (passive mode)");
}

export function onFileWrite(filePath: string, content: string) {
  console.log(`[Session Killer] File written: ${filePath}`);
  
  // Check if the file is a session configuration file
  if (filePath.endsWith('sessions.json') ||
      filePath.endsWith('session-config.json')) {
    console.log(`[Session Killer] Detected session configuration file: ${filePath}`);
    return {
      detected: true,
      filePath,
      type: 'session-config'
    };
  }
  
  return { detected: false };
}

export function onSessionStart(context: any) {
  console.log('[Session Killer] Session started');
  
  try {
    // Log platform information
    const platform = process.platform;
    console.log(`[Session Killer] Platform: ${platform}`);
    
    // Get active processes and monitored processes
    const activeProcesses = getActiveProcesses();
    const monitoredProcesses = getMonitoredProcesses();
    
    console.log(`[Session Killer] Found ${activeProcesses.length} active processes and ${monitoredProcesses.length} monitored processes`);
    
    // Check for any stale sessions that might need to be cleaned up
    if (activeProcesses.length > 0 || monitoredProcesses.length > 0) {
      console.log('[Session Killer] Found existing sessions that might need cleanup');
    }
    
    return {
      initialized: true,
      platform,
      activeProcesses: activeProcesses.length,
      monitoredProcesses: monitoredProcesses.length
    };
  } catch (error) {
    console.error(`[Session Killer] Error during initialization: ${error}`);
    try {
      console.error(`Error using API for token counting: ${error}`);
      // Fall back to simple estimation if API call fails
      return {
        initialized: false,
        error: String(error)
      };
    } catch (nestedError) {
      return {
        initialized: false,
        error: 'Multiple errors occurred'
      };
    }
  }
}

export function onCommand(command: string, args: any[]) {
  console.log(`[Session Killer] Command received: ${command}`);
  
  try {
    if (command === 'session.kill') {
      console.log('[Session Killer] Killing session');
      if (args && args.length > 0) {
        const pid = typeof args[0] === 'number' ? args[0] : args[0].pid;
        const force = args[0].force === true;
        const signal = args[0].signal || 'SIGTERM';
        
        try {
          // This is async, so we can't return the result directly
          killSession(pid, force, signal).then(result => {
            console.log(`[Session Killer] Session ${pid} killed: ${result}`);
          }).catch(error => {
            console.error(`[Session Killer] Error killing session: ${error}`);
          });
          
          return {
            action: 'kill',
            pid,
            force,
            signal,
            started: true
          };
        } catch (error) {
          console.error(`[Session Killer] Error killing session: ${error}`);
          return { action: 'kill', error: String(error) };
        }
      }
    } else if (command === 'session.killAll') {
      console.log('[Session Killer] Killing all sessions');
      
      const force = args && args.length > 0 ? args[0].force === true : false;
      const signal = args && args.length > 0 ? args[0].signal || 'SIGTERM' : 'SIGTERM';
      const excludePids = args && args.length > 0 ? args[0].excludePids || [] : [];
      
      try {
        // This is async, so we can't return the result directly
        killAllSessions(force, signal, excludePids).then(count => {
          console.log(`[Session Killer] Killed ${count} sessions`);
        }).catch(error => {
          console.error(`[Session Killer] Error killing all sessions: ${error}`);
        });
        
        return {
          action: 'killAll',
          force,
          signal,
          excludePids,
          started: true
        };
      } catch (error) {
        console.error(`[Session Killer] Error killing all sessions: ${error}`);
        return { action: 'killAll', error: String(error) };
      }
    } else if (command === 'session.killByCommand') {
      console.log('[Session Killer] Killing sessions by command');
      if (args && args.length > 0) {
        const commandPattern = typeof args[0] === 'string' ? args[0] : args[0].command;
        const force = args[0].force === true;
        const signal = args[0].signal || 'SIGTERM';
        
        try {
          // This is async, so we can't return the result directly
          killSessionsByCommand(commandPattern, force, signal).then(count => {
            console.log(`[Session Killer] Killed ${count} sessions matching command: ${commandPattern}`);
          }).catch(error => {
            console.error(`[Session Killer] Error killing sessions by command: ${error}`);
          });
          
          return {
            action: 'killByCommand',
            command: commandPattern,
            force,
            signal,
            started: true
          };
        } catch (error) {
          console.error(`[Session Killer] Error killing sessions by command: ${error}`);
          return { action: 'killByCommand', error: String(error) };
        }
      }
    }
  } catch (error) {
    console.error(`[Session Killer] Error processing command: ${error}`);
    try {
      console.error(`Error using API for token counting: ${error}`);
      // Fall back to simple estimation if API call fails
      return { action: 'error', error: String(error) };
    } catch (nestedError) {
      return { action: 'error', error: 'Multiple errors occurred' };
    }
  }
  
  return { action: 'unknown' };
}
/**
 * Session Killer
 * 
 * Forces termination of running terminal sessions
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { z } from 'zod';
import { getActiveProcesses } from './cmd-executor';
import { getMonitoredProcesses, stopMonitoring } from './output-reader';

const execAsync = promisify(exec);

/**
 * Schema for SessionKiller
 */
export const KillSessionSchema = z.object({
  pid: z.number(),
  force: z.boolean().optional().default(false),
  signal: z.enum(['SIGTERM', 'SIGKILL', 'SIGINT']).optional().default('SIGTERM'),
});

export const KillAllSessionsSchema = z.object({
  force: z.boolean().optional().default(false),
  signal: z.enum(['SIGTERM', 'SIGKILL', 'SIGINT']).optional().default('SIGTERM'),
  excludePids: z.array(z.number()).optional(),
});

export const KillSessionsByCommandSchema = z.object({
  command: z.string(),
  force: z.boolean().optional().default(false),
  signal: z.enum(['SIGTERM', 'SIGKILL', 'SIGINT']).optional().default('SIGTERM'),
});

/**
 * Kill a session by PID
 * 
 * @param pid Process ID
 * @param force Whether to force kill
 * @param signal Signal to send
 * @returns Whether the session was killed
 */
export async function killSession(pid: number, force: boolean = false, signal: NodeJS.Signals = 'SIGTERM'): Promise<boolean> {
  try {
    // Try to kill using the monitored processes first
    const monitoredResult = stopMonitoring(pid);
    
    if (monitoredResult) {
      return true;
    }
    
    // If force is true, use SIGKILL
    const actualSignal = force ? 'SIGKILL' : signal;
    
    // Kill the process
    if (process.platform === 'win32') {
      // On Windows, use taskkill
      const command = force
        ? `taskkill /F /PID ${pid}`
        : `taskkill /PID ${pid}`;
      
      await execAsync(command);
    } else {
      // On Unix-like systems, use kill
      await execAsync(`kill -${actualSignal} ${pid}`);
      
      // If force is true, make sure the process is killed
      if (force) {
        // Wait a bit and check if the process is still running
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        try {
          // Check if the process is still running
          await execAsync(`ps -p ${pid} -o pid=`);
          
          // If we get here, the process is still running, so kill it with SIGKILL
          await execAsync(`kill -SIGKILL ${pid}`);
        } catch (error) {
          // Process is already gone, which is what we want
        }
      }
    }
    
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Kill all sessions
 * 
 * @param force Whether to force kill
 * @param signal Signal to send
 * @param excludePids PIDs to exclude
 * @returns Number of sessions killed
 */
export async function killAllSessions(force: boolean = false, signal: NodeJS.Signals = 'SIGTERM', excludePids: number[] = []): Promise<number> {
  try {
    // Get all active processes
    const activeProcesses = getActiveProcesses();
    const monitoredProcesses = getMonitoredProcesses();
    
    // Combine and deduplicate processes
    const allPids = new Set([
      ...activeProcesses.map(process => process.pid),
      ...monitoredProcesses.map(process => process.pid),
    ]);
    
    // Filter out excluded PIDs
    const pidsToKill = Array.from(allPids).filter(pid => !excludePids.includes(pid));
    
    // Kill each process
    let killedCount = 0;
    
    for (const pid of pidsToKill) {
      const result = await killSession(pid, force, signal);
      
      if (result) {
        killedCount++;
      }
    }
    
    return killedCount;
  } catch (error) {
    return 0;
  }
}

/**
 * Kill sessions by command
 * 
 * @param commandPattern Command pattern to match
 * @param force Whether to force kill
 * @param signal Signal to send
 * @returns Number of sessions killed
 */
export async function killSessionsByCommand(commandPattern: string, force: boolean = false, signal: NodeJS.Signals = 'SIGTERM'): Promise<number> {
  try {
    // Get all active processes
    const activeProcesses = getActiveProcesses();
    const monitoredProcesses = getMonitoredProcesses();
    
    // Create a regex from the command pattern
    const regex = new RegExp(commandPattern);
    
    // Find processes matching the command pattern
    const matchingActivePids = activeProcesses
      .filter(process => regex.test(process.command))
      .map(process => process.pid);
    
    const matchingMonitoredPids = monitoredProcesses
      .filter(process => regex.test(process.command))
      .map(process => process.pid);
    
    // Combine and deduplicate PIDs
    const pidsToKill = Array.from(new Set([...matchingActivePids, ...matchingMonitoredPids]));
    
    // Kill each process
    let killedCount = 0;
    
    for (const pid of pidsToKill) {
      const result = await killSession(pid, force, signal);
      
      if (result) {
        killedCount++;
      }
    }
    
    return killedCount;
  } catch (error) {
    return 0;
  }
}

/**
 * Handle kill_session command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleKillSession(args: any) {
  try {
    const { pid, force, signal } = args;
    const result = await killSession(pid, force, signal);
    
    if (result) {
      return {
        content: [{ type: "text", text: `Session with PID ${pid} killed successfully` }],
        isError: false,
      };
    } else {
      return {
        content: [{ type: "text", text: `Failed to kill session with PID ${pid}` }],
        isError: true,
      };
    }
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error killing session: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Handle kill_all_sessions command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleKillAllSessions(args: any) {
  try {
    const { force, signal, excludePids } = args;
    const killedCount = await killAllSessions(force, signal, excludePids);
    
    return {
      content: [{ type: "text", text: `Killed ${killedCount} sessions` }],
      isError: false,
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error killing sessions: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Handle kill_sessions_by_command command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleKillSessionsByCommand(args: any) {
  try {
    const { command, force, signal } = args;
    const killedCount = await killSessionsByCommand(command, force, signal);
    
    return {
      content: [{ type: "text", text: `Killed ${killedCount} sessions matching command pattern: ${command}` }],
      isError: false,
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error killing sessions: ${error}` }],
      isError: true,
    };
  }
}

