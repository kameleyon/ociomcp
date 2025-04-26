/**
 * Output Reader
 * 
 * Monitors output from running terminal sessions
 */

import { spawn, ChildProcess } from 'child_process';
import { EventEmitter } from 'events';
import { z } from 'zod';

/**
 * Schema for OutputReader
 */
export const StartMonitoringSchema = z.object({
  command: z.string(),
  args: z.array(z.string()).optional(),
  cwd: z.string().optional(),
  shell: z.boolean().optional().default(true),
  env: z.record(z.string()).optional(),
  outputLimit: z.number().optional().default(10000),
});

export const StopMonitoringSchema = z.object({
  pid: z.number(),
});

export const GetOutputSchema = z.object({
  pid: z.number(),
  lines: z.number().optional(),
  tail: z.boolean().optional().default(true),
});

export const ClearOutputSchema = z.object({
  pid: z.number(),
});

/**
 * Monitored process information
 */
interface MonitoredProcess {
  pid: number;
  command: string;
  startTime: Date;
  process: ChildProcess;
  stdout: string[];
  stderr: string[];
  outputLimit: number;
  emitter: EventEmitter;
}

// Store monitored processes
const monitoredProcesses: Map<number, MonitoredProcess> = new Map();

/**
 * Start monitoring a command
 * 
 * @param command Command to run
 * @param args Command arguments
 * @param cwd Working directory
 * @param shell Whether to run in shell
 * @param env Environment variables
 * @param outputLimit Maximum number of output lines to store
 * @returns Monitored process information
 */
export function startMonitoring(
  command: string,
  args: string[] = [],
  cwd?: string,
  shell: boolean = true,
  env?: Record<string, string>,
  outputLimit: number = 10000,
): { pid: number; command: string } {
  // Prepare environment variables
  const processEnv = { ...process.env, ...env };
  
  // Spawn the process
  const childProcess = spawn(command, args, {
    cwd,
    shell,
    env: processEnv,
  });
  
  // Create event emitter
  const emitter = new EventEmitter();
  
  // Create monitored process
  const monitoredProcess: MonitoredProcess = {
    pid: childProcess.pid!,
    command: `${command} ${args.join(' ')}`,
    startTime: new Date(),
    process: childProcess,
    stdout: [],
    stderr: [],
    outputLimit,
    emitter,
  };
  
  // Store the process
  monitoredProcesses.set(childProcess.pid!, monitoredProcess);
  
  // Handle stdout
  childProcess.stdout.on('data', (data) => {
    const lines = data.toString().split('\n');
    
    // Add lines to stdout
    monitoredProcess.stdout.push(...lines);
    
    // Trim stdout if it exceeds the limit
    if (monitoredProcess.stdout.length > monitoredProcess.outputLimit) {
      monitoredProcess.stdout = monitoredProcess.stdout.slice(-monitoredProcess.outputLimit);
    }
    
    // Emit stdout event
    monitoredProcess.emitter.emit('stdout', lines);
  });
  
  // Handle stderr
  childProcess.stderr.on('data', (data) => {
    const lines = data.toString().split('\n');
    
    // Add lines to stderr
    monitoredProcess.stderr.push(...lines);
    
    // Trim stderr if it exceeds the limit
    if (monitoredProcess.stderr.length > monitoredProcess.outputLimit) {
      monitoredProcess.stderr = monitoredProcess.stderr.slice(-monitoredProcess.outputLimit);
    }
    
    // Emit stderr event
    monitoredProcess.emitter.emit('stderr', lines);
  });
  
  // Handle process exit
  childProcess.on('close', (code, signal) => {
    // Emit exit event
    monitoredProcess.emitter.emit('exit', { code, signal });
    
    // Remove from monitored processes after a delay
    // This allows clients to get the final output
    setTimeout(() => {
      monitoredProcesses.delete(childProcess.pid!);
    }, 60000); // Keep for 1 minute after exit
  });
  
  // Handle process error
  childProcess.on('error', (error) => {
    // Emit error event
    monitoredProcess.emitter.emit('error', error);
  });
  
  return {
    pid: childProcess.pid!,
    command: monitoredProcess.command,
  };
}

/**
 * Stop monitoring a command
 * 
 * @param pid Process ID
 * @returns Whether the process was stopped
 */
export function stopMonitoring(pid: number): boolean {
  try {
    // Check if the process exists
    if (!monitoredProcesses.has(pid)) {
      return false;
    }
    
    // Get the process
    const monitoredProcess = monitoredProcesses.get(pid)!;
    
    // Kill the process
    monitoredProcess.process.kill();
    
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Get output from a monitored command
 * 
 * @param pid Process ID
 * @param lines Number of lines to get
 * @param tail Whether to get the last lines (true) or first lines (false)
 * @returns Output from the command
 */
export function getOutput(pid: number, lines?: number, tail: boolean = true): {
  stdout: string[];
  stderr: string[];
  exists: boolean;
} {
  // Check if the process exists
  if (!monitoredProcesses.has(pid)) {
    return {
      stdout: [],
      stderr: [],
      exists: false,
    };
  }
  
  // Get the process
  const monitoredProcess = monitoredProcesses.get(pid)!;
  
  // Get stdout
  let stdout = monitoredProcess.stdout;
  
  // Get stderr
  let stderr = monitoredProcess.stderr;
  
  // Limit the number of lines if specified
  if (lines !== undefined) {
    if (tail) {
      stdout = stdout.slice(-lines);
      stderr = stderr.slice(-lines);
    } else {
      stdout = stdout.slice(0, lines);
      stderr = stderr.slice(0, lines);
    }
  }
  
  return {
    stdout,
    stderr,
    exists: true,
  };
}

/**
 * Clear output from a monitored command
 * 
 * @param pid Process ID
 * @returns Whether the output was cleared
 */
export function clearOutput(pid: number): boolean {
  // Check if the process exists
  if (!monitoredProcesses.has(pid)) {
    return false;
  }
  
  // Get the process
  const monitoredProcess = monitoredProcesses.get(pid)!;
  
  // Clear stdout and stderr
  monitoredProcess.stdout = [];
  monitoredProcess.stderr = [];
  
  return true;
}

/**
 * Get all monitored processes
 * 
 * @returns Array of monitored processes
 */
export function getMonitoredProcesses(): Array<{
  pid: number;
  command: string;
  startTime: Date;
  runningTime: number;
  stdoutLines: number;
  stderrLines: number;
}> {
  const now = new Date();
  
  return Array.from(monitoredProcesses.values()).map((process) => ({
    pid: process.pid,
    command: process.command,
    startTime: process.startTime,
    runningTime: now.getTime() - process.startTime.getTime(),
    stdoutLines: process.stdout.length,
    stderrLines: process.stderr.length,
  }));
}

/**
 * Subscribe to output events from a monitored command
 * 
 * @param pid Process ID
 * @param onStdout Callback for stdout events
 * @param onStderr Callback for stderr events
 * @param onExit Callback for exit events
 * @param onError Callback for error events
 * @returns Whether the subscription was successful
 */
export function subscribeToOutput(
  pid: number,
  onStdout?: (lines: string[]) => void,
  onStderr?: (lines: string[]) => void,
  onExit?: (result: { code: number | null; signal: string | null }) => void,
  onError?: (error: Error) => void,
): boolean {
  // Check if the process exists
  if (!monitoredProcesses.has(pid)) {
    return false;
  }
  
  // Get the process
  const monitoredProcess = monitoredProcesses.get(pid)!;
  
  // Subscribe to events
  if (onStdout) {
    monitoredProcess.emitter.on('stdout', onStdout);
  }
  
  if (onStderr) {
    monitoredProcess.emitter.on('stderr', onStderr);
  }
  
  if (onExit) {
    monitoredProcess.emitter.on('exit', onExit);
  }
  
  if (onError) {
    monitoredProcess.emitter.on('error', onError);
  }
  
  return true;
}

/**
 * Unsubscribe from output events from a monitored command
 * 
 * @param pid Process ID
 * @param onStdout Callback for stdout events
 * @param onStderr Callback for stderr events
 * @param onExit Callback for exit events
 * @param onError Callback for error events
 * @returns Whether the unsubscription was successful
 */
export function unsubscribeFromOutput(
  pid: number,
  onStdout?: (lines: string[]) => void,
  onStderr?: (lines: string[]) => void,
  onExit?: (result: { code: number | null; signal: string | null }) => void,
  onError?: (error: Error) => void,
): boolean {
  // Check if the process exists
  if (!monitoredProcesses.has(pid)) {
    return false;
  }
  
  // Get the process
  const monitoredProcess = monitoredProcesses.get(pid)!;
  
  // Unsubscribe from events
  if (onStdout) {
    monitoredProcess.emitter.off('stdout', onStdout);
  }
  
  if (onStderr) {
    monitoredProcess.emitter.off('stderr', onStderr);
  }
  
  if (onExit) {
    monitoredProcess.emitter.off('exit', onExit);
  }
  
  if (onError) {
    monitoredProcess.emitter.off('error', onError);
  }
  
  return true;
}

/**
 * Handle start_monitoring command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleStartMonitoring(args: any) {
  try {
    const { command, args: commandArgs, cwd, shell, env, outputLimit } = args;
    const result = startMonitoring(command, commandArgs, cwd, shell, env, outputLimit);
    
    return {
      content: [
        { type: "text", text: `Started monitoring process with PID ${result.pid}` },
        { type: "text", text: `Command: ${result.command}` },
      ],
      isError: false,
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error starting monitoring: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Handle stop_monitoring command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleStopMonitoring(args: any) {
  try {
    const { pid } = args;
    const result = stopMonitoring(pid);
    
    if (result) {
      return {
        content: [{ type: "text", text: `Stopped monitoring process with PID ${pid}` }],
        isError: false,
      };
    } else {
      return {
        content: [{ type: "text", text: `Process with PID ${pid} not found or could not be stopped` }],
        isError: true,
      };
    }
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error stopping monitoring: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Handle get_output command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleGetOutput(args: any) {
  try {
    const { pid, lines, tail } = args;
    const result = getOutput(pid, lines, tail);
    
    if (result.exists) {
      return {
        content: [
          { type: "text", text: `Output from process with PID ${pid}:` },
          { type: "text", text: `Standard Output (${result.stdout.length} lines):` },
          { type: "text", text: result.stdout.join('\n') || '(empty)' },
          { type: "text", text: `Standard Error (${result.stderr.length} lines):` },
          { type: "text", text: result.stderr.join('\n') || '(empty)' },
        ],
        isError: false,
      };
    } else {
      return {
        content: [{ type: "text", text: `Process with PID ${pid} not found` }],
        isError: true,
      };
    }
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error getting output: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Handle clear_output command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleClearOutput(args: any) {
  try {
    const { pid } = args;
    const result = clearOutput(pid);
    
    if (result) {
      return {
        content: [{ type: "text", text: `Cleared output for process with PID ${pid}` }],
        isError: false,
      };
    } else {
      return {
        content: [{ type: "text", text: `Process with PID ${pid} not found` }],
        isError: true,
      };
    }
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error clearing output: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Handle list_monitored_processes command
 * 
 * @returns Command result
 */
export async function handleListMonitoredProcesses() {
  try {
    const processes = getMonitoredProcesses();
    
    if (processes.length === 0) {
      return {
        content: [{ type: "text", text: "No monitored processes" }],
        isError: false,
      };
    }
    
    return {
      content: [
        { type: "text", text: `Monitored Processes (${processes.length}):` },
        {
          type: "table",
          headers: ["PID", "Command", "Start Time", "Running Time", "Stdout Lines", "Stderr Lines"],
          rows: processes.map((process) => [
            process.pid.toString(),
            process.command,
            process.startTime.toISOString(),
            `${Math.floor(process.runningTime / 1000)}s`,
            process.stdoutLines.toString(),
            process.stderrLines.toString(),
          ]),
        },
      ],
      isError: false,
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error listing monitored processes: ${error}` }],
      isError: true,
    };
  }
}
