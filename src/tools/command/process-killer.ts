// Auto-generated safe fallback for process-killer

export function activate() {
    console.log("[TOOL] process-killer activated (passive mode)");
}

export function onFileWrite(filePath: string, content: string) {
  console.log(`[Process Killer] File written: ${filePath}`);
  
  // Check if the file is a process-related configuration file
  if (filePath.endsWith('process.json') ||
      filePath.endsWith('processes.json') ||
      filePath.endsWith('pm2.json') ||
      filePath.endsWith('nodemon.json')) {
    console.log(`[Process Killer] Detected process configuration file: ${filePath}`);
    return {
      detected: true,
      filePath,
      type: 'process-config'
    };
  }
  
  // Check for script files that might start processes
  const extension = filePath.substring(filePath.lastIndexOf('.')).toLowerCase();
  const scriptExtensions = ['.sh', '.bat', '.cmd', '.ps1'];
  
  if (scriptExtensions.includes(extension)) {
    console.log(`[Process Killer] Detected script file: ${filePath}`);
    return {
      detected: true,
      filePath,
      type: 'script'
    };
  }
  
  return { detected: false };
}

export function onSessionStart(context: any) {
  console.log('[Process Killer] Session started');
  
  try {
    // Log platform information
    const platform = process.platform;
    console.log(`[Process Killer] Platform: ${platform}`);
    
    // Check for any lingering Node.js processes that might be from previous sessions
    findProcessesByName('node').then(pids => {
      if (pids.length > 0) {
        console.log(`[Process Killer] Found ${pids.length} Node.js processes running`);
      }
    }).catch(error => {
      console.error(`[Process Killer] Error finding Node.js processes: ${error}`);
    });
    
    return {
      initialized: true,
      platform
    };
  } catch (error) {
    console.error(`[Process Killer] Error during initialization: ${error}`);
    return {
      initialized: false,
      error: String(error)
    };
  }
}

export function onCommand(command: string, args: any[]) {
  console.log(`[Process Killer] Command received: ${command}`);
  
  try {
    if (command === 'process.kill') {
      console.log('[Process Killer] Killing process');
      if (args && args.length > 0) {
        const pid = typeof args[0] === 'number' ? args[0] : args[0].pid;
        const force = args[0].force === true;
        const signal = args[0].signal || 'SIGTERM';
        
        try {
          // This is async, so we can't return the result directly
          killProcess(pid, force, signal).then(result => {
            console.log(`[Process Killer] Process ${pid} killed: ${result}`);
          }).catch(error => {
            console.error(`[Process Killer] Error killing process: ${error}`);
          });
          
          return {
            action: 'kill',
            pid,
            force,
            signal,
            started: true
          };
        } catch (error) {
          console.error(`[Process Killer] Error killing process: ${error}`);
          return { action: 'kill', error: String(error) };
        }
      }
    } else if (command === 'process.killByName') {
      console.log('[Process Killer] Killing processes by name');
      if (args && args.length > 0) {
        const name = typeof args[0] === 'string' ? args[0] : args[0].name;
        const force = args[0].force === true;
        const signal = args[0].signal || 'SIGTERM';
        
        try {
          // This is async, so we can't return the result directly
          killProcessesByName(name, force, signal).then(count => {
            console.log(`[Process Killer] Killed ${count} processes matching name: ${name}`);
          }).catch(error => {
            console.error(`[Process Killer] Error killing processes: ${error}`);
          });
          
          return {
            action: 'killByName',
            name,
            force,
            signal,
            started: true
          };
        } catch (error) {
          console.error(`[Process Killer] Error killing processes: ${error}`);
          return { action: 'killByName', error: String(error) };
        }
      }
    } else if (command === 'process.find') {
      console.log('[Process Killer] Finding processes by name');
      if (args && args.length > 0) {
        const name = typeof args[0] === 'string' ? args[0] : args[0].name;
        
        try {
          // This is async, so we can't return the result directly
          findProcessesByName(name).then(pids => {
            console.log(`[Process Killer] Found ${pids.length} processes matching name: ${name}`);
          }).catch(error => {
            console.error(`[Process Killer] Error finding processes: ${error}`);
          });
          
          return {
            action: 'find',
            name,
            started: true
          };
        } catch (error) {
          console.error(`[Process Killer] Error finding processes: ${error}`);
          return { action: 'find', error: String(error) };
        }
      }
    }
  } catch (error) {
    console.error(`[Process Killer] Error processing command: ${error}`);
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
 * Process Killer
 * 
 * Terminates running processes by PID
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { z } from 'zod';

const execAsync = promisify(exec);

/**
 * Schema for ProcessKiller
 */
export const KillProcessSchema = z.object({
  pid: z.number(),
  force: z.boolean().optional().default(false),
  signal: z.enum(['SIGTERM', 'SIGKILL', 'SIGINT']).optional().default('SIGTERM'),
});

export const KillProcessesByNameSchema = z.object({
  name: z.string(),
  force: z.boolean().optional().default(false),
  signal: z.enum(['SIGTERM', 'SIGKILL', 'SIGINT']).optional().default('SIGTERM'),
});

/**
 * Kill a process by PID
 * 
 * @param pid Process ID
 * @param force Whether to force kill
 * @param signal Signal to send
 * @returns Whether the process was killed
 */
export async function killProcess(pid: number, force: boolean = false, signal: NodeJS.Signals = 'SIGTERM'): Promise<boolean> {
  try {
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
 * Find processes by name
 * 
 * @param name Process name
 * @returns Array of process IDs
 */
export async function findProcessesByName(name: string): Promise<number[]> {
  try {
    let command: string;
    
    if (process.platform === 'win32') {
      // On Windows, use wmic
      command = `wmic process where "caption like '%${name}%'" get processid`;
    } else {
      // On Unix-like systems, use pgrep
      command = `pgrep -f "${name}"`;
    }
    
    const { stdout } = await execAsync(command);
    
    // Parse the output
    if (process.platform === 'win32') {
      // Parse Windows output
      const lines = stdout.trim().split('\n');
      
      // Skip the header line
      return lines.slice(1)
        .map(line => parseInt(line.trim(), 10))
        .filter(pid => !isNaN(pid));
    } else {
      // Parse Unix-like output
      return stdout.trim().split('\n')
        .map(line => parseInt(line.trim(), 10))
        .filter(pid => !isNaN(pid));
    }
  } catch (error) {
    return [];
  }
}

/**
 * Kill processes by name
 * 
 * @param name Process name
 * @param force Whether to force kill
 * @param signal Signal to send
 * @returns Number of processes killed
 */
export async function killProcessesByName(name: string, force: boolean = false, signal: NodeJS.Signals = 'SIGTERM'): Promise<number> {
  try {
    // Find processes by name
    const pids = await findProcessesByName(name);
    
    // Kill each process
    let killedCount = 0;
    
    for (const pid of pids) {
      const result = await killProcess(pid, force, signal);
      
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
 * Handle kill_process command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleKillProcess(args: any) {
  try {
    const { pid, force, signal } = args;
    const result = await killProcess(pid, force, signal);
    
    if (result) {
      return {
        content: [{ type: "text", text: `Process with PID ${pid} killed successfully` }],
        isError: false,
      };
    } else {
      return {
        content: [{ type: "text", text: `Failed to kill process with PID ${pid}` }],
        isError: true,
      };
    }
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error killing process: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Handle kill_processes_by_name command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleKillProcessesByName(args: any) {
  try {
    const { name, force, signal } = args;
    const killedCount = await killProcessesByName(name, force, signal);
    
    if (killedCount > 0) {
      return {
        content: [{ type: "text", text: `Killed ${killedCount} processes matching name: ${name}` }],
        isError: false,
      };
    } else {
      return {
        content: [{ type: "text", text: `No processes found matching name: ${name}` }],
        isError: true,
      };
    }
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error killing processes: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Handle find_processes_by_name command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleFindProcessesByName(args: any) {
  try {
    const { name } = args;
    const pids = await findProcessesByName(name);
    
    if (pids.length > 0) {
      return {
        content: [
          { type: "text", text: `Found ${pids.length} processes matching name: ${name}` },
          { type: "text", text: `Process IDs: ${pids.join(', ')}` },
        ],
        isError: false,
      };
    } else {
      return {
        content: [{ type: "text", text: `No processes found matching name: ${name}` }],
        isError: true,
      };
    }
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error finding processes: ${error}` }],
      isError: true,
    };
  }
}

