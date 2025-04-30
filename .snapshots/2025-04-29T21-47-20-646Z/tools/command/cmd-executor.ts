// Auto-generated safe fallback for cmd-executor

export function activate() {
    console.log("[TOOL] cmd-executor activated (passive mode)");
}

export function onFileWrite() { /* no-op */ }
export function onSessionStart() { /* no-op */ }
export function onCommand() { /* no-op */ }
/**
 * Command Executor
 * 
 * Runs terminal commands with timeout capabilities
 */

import { spawn, ChildProcess } from 'child_process';
import { z } from 'zod';

/**
 * Schema for CmdExecutor
 */
export const ExecuteCommandSchema = z.object({
  command: z.string(),
  args: z.array(z.string()).optional(),
  cwd: z.string().optional(),
  timeout: z.number().optional(),
  shell: z.boolean().optional().default(true),
  env: z.record(z.string()).optional(),
});

export const KillCommandSchema = z.object({
  pid: z.number(),
  signal: z.enum(['SIGTERM', 'SIGKILL', 'SIGINT']).optional().default('SIGTERM'),
});

/**
 * Command execution options
 */
interface CommandOptions {
  command: string;
  args?: string[];
  cwd?: string;
  timeout?: number;
  shell?: boolean;
  env?: Record<string, string>;
}

/**
 * Command execution result
 */
interface CommandResult {
  success: boolean;
  stdout: string;
  stderr: string;
  code: number | null;
  signal: string | null;
  pid: number;
  timedOut: boolean;
  command: string;
}

/**
 * Active process information
 */
interface ActiveProcess {
  pid: number;
  command: string;
  startTime: Date;
  process: ChildProcess;
}

// Store active processes
const activeProcesses: Map<number, ActiveProcess> = new Map();

/**
 * Execute a command with timeout
 * 
 * @param options Command options
 * @returns Promise that resolves with command result
 */
export async function executeCommand(options: CommandOptions): Promise<CommandResult> {
  const { command, args = [], cwd, timeout, shell = true, env } = options;
  
  return new Promise((resolve) => {
    // Prepare environment variables
    const processEnv = { ...process.env, ...env };
    
    // Spawn the process
    const childProcess = spawn(command, args, {
      cwd,
      shell,
      env: processEnv,
    });
    
    // Store the process
    const activeProcess: ActiveProcess = {
      pid: childProcess.pid!,
      command: `${command} ${args.join(' ')}`,
      startTime: new Date(),
      process: childProcess,
    };
    
    activeProcesses.set(childProcess.pid!, activeProcess);
    
    // Initialize result
    let stdout = '';
    let stderr = '';
    let timedOut = false;
    
    // Set up timeout if specified
    let timeoutId: NodeJS.Timeout | undefined;
    
    if (timeout) {
      timeoutId = setTimeout(() => {
        timedOut = true;
        childProcess.kill('SIGTERM');
        
        // If the process doesn't exit within 5 seconds, force kill it
        setTimeout(() => {
          if (activeProcesses.has(childProcess.pid!)) {
            childProcess.kill('SIGKILL');
          }
        }, 5000);
      }, timeout);
    }
    
    // Collect stdout
    childProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    // Collect stderr
    childProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    // Handle process exit
    childProcess.on('close', (code, signal) => {
      // Clear timeout if set
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      // Remove from active processes
      activeProcesses.delete(childProcess.pid!);
      
      // Resolve with result
      resolve({
        success: code === 0 && !timedOut,
        stdout,
        stderr,
        code,
        signal,
        pid: childProcess.pid!,
        timedOut,
        command: `${command} ${args.join(' ')}`,
      });
    });
    
    // Handle process error
    childProcess.on('error', (error) => {
      // Clear timeout if set
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      // Remove from active processes
      activeProcesses.delete(childProcess.pid!);
      
      // Resolve with error
      resolve({
        success: false,
        stdout,
        stderr: `${stderr}\n${error.message}`,
        code: null,
        signal: null,
        pid: childProcess.pid!,
        timedOut,
        command: `${command} ${args.join(' ')}`,
      });
    });
  });
}

/**
 * Kill a running command
 * 
 * @param pid Process ID
 * @param signal Signal to send
 * @returns Whether the process was killed
 */
export function killCommand(pid: number, signal: NodeJS.Signals = 'SIGTERM'): boolean {
  try {
    // Check if the process exists
    if (!activeProcesses.has(pid)) {
      return false;
    }
    
    // Get the process
    const activeProcess = activeProcesses.get(pid)!;
    
    // Kill the process
    activeProcess.process.kill(signal);
    
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Get all active processes
 * 
 * @returns Array of active processes
 */
export function getActiveProcesses(): Array<{
  pid: number;
  command: string;
  startTime: Date;
  runningTime: number;
}> {
  const now = new Date();
  
  return Array.from(activeProcesses.values()).map((process) => ({
    pid: process.pid,
    command: process.command,
    startTime: process.startTime,
    runningTime: now.getTime() - process.startTime.getTime(),
  }));
}

/**
 * Handle execute_command command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleExecuteCommand(args: any) {
  try {
    const result = await executeCommand(args);
    
    return {
      content: [
        { type: "text", text: `Command: ${result.command}` },
        { type: "text", text: `Exit Code: ${result.code !== null ? result.code : 'N/A'}` },
        { type: "text", text: `Signal: ${result.signal || 'None'}` },
        { type: "text", text: `Timed Out: ${result.timedOut}` },
        { type: "text", text: `PID: ${result.pid}` },
        { type: "text", text: `Standard Output:\n${result.stdout || '(empty)'}` },
        { type: "text", text: `Standard Error:\n${result.stderr || '(empty)'}` },
      ],
      isError: !result.success,
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error executing command: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Handle kill_command command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleKillCommand(args: any) {
  try {
    const { pid, signal } = args;
    const result = killCommand(pid, signal);
    
    if (result) {
      return {
        content: [{ type: "text", text: `Process ${pid} killed with signal ${signal}` }],
        isError: false,
      };
    } else {
      return {
        content: [{ type: "text", text: `Process ${pid} not found or could not be killed` }],
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
 * Handle list_active_processes command
 * 
 * @returns Command result
 */
export async function handleListActiveProcesses() {
  try {
    const processes = getActiveProcesses();
    
    if (processes.length === 0) {
      return {
        content: [{ type: "text", text: "No active processes" }],
        isError: false,
      };
    }
    
    return {
      content: [
        { type: "text", text: `Active Processes (${processes.length}):` },
        {
          type: "table",
          headers: ["PID", "Command", "Start Time", "Running Time"],
          rows: processes.map((process) => [
            process.pid.toString(),
            process.command,
            process.startTime.toISOString(),
            `${Math.floor(process.runningTime / 1000)}s`,
          ]),
        },
      ],
      isError: false,
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error listing active processes: ${error}` }],
      isError: true,
    };
  }
}

