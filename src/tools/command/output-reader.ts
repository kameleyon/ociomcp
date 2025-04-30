// Auto-generated safe fallback for output-reader

export function activate() {
    console.log("[TOOL] output-reader activated (passive mode)");
}

export function onFileWrite(filePath: string, content: string) {
  console.log(`[Output Reader] File written: ${filePath}`);
  
  // Check if the file is a log file
  if (filePath.endsWith('.log') ||
      filePath.includes('logs/') ||
      filePath.includes('/logs/')) {
    console.log(`[Output Reader] Detected log file: ${filePath}`);
    return {
      detected: true,
      filePath,
      type: 'log'
    };
  }
  
  // Check for output files
  if (filePath.endsWith('.out') ||
      filePath.endsWith('.err') ||
      filePath.endsWith('.stdout') ||
      filePath.endsWith('.stderr')) {
    console.log(`[Output Reader] Detected output file: ${filePath}`);
    return {
      detected: true,
      filePath,
      type: 'output'
    };
  }
  
  return { detected: false };
}

export function onSessionStart(context: any) {
  console.log('[Output Reader] Session started');
  
  // Log active processes
  const processes = getMonitoredProcesses();
  console.log(`[Output Reader] Found ${processes.length} active monitored processes`);
  
  // Clear old processes that might have been left over
  for (const process of processes) {
    // If process has been running for more than 24 hours, stop monitoring it
    if (process.runningTime > 24 * 60 * 60 * 1000) {
      console.log(`[Output Reader] Stopping monitoring for stale process: ${process.pid}`);
      stopMonitoring(process.pid);
    }
  }
  
  return {
    initialized: true,
    activeProcesses: processes.length
  };
}

export function onCommand(command: string, args: any[]) {
  console.log(`[Output Reader] Command received: ${command}`);
  
  try {
    if (command === 'output.start') {
      console.log('[Output Reader] Starting output monitoring');
      if (args && args.length > 0) {
        const options = typeof args[0] === 'string'
          ? { command: args[0] }
          : args[0];
        
        try {
          const result = startMonitoring(
            options.command,
            options.args,
            options.cwd,
            options.shell,
            options.env,
            options.outputLimit
          );
          
          return {
            action: 'start',
            pid: result.pid,
            command: result.command
          };
        } catch (error) {
          console.error(`[Output Reader] Error starting monitoring: ${error}`);
          return { action: 'start', error: String(error) };
        }
      }
    } else if (command === 'output.stop') {
      console.log('[Output Reader] Stopping output monitoring');
      if (args && args.length > 0) {
        const pid = typeof args[0] === 'number' ? args[0] : args[0].pid;
        
        try {
          const result = stopMonitoring(pid);
          return { action: 'stop', pid, success: result };
        } catch (error) {
          console.error(`[Output Reader] Error stopping monitoring: ${error}`);
          return { action: 'stop', error: String(error) };
        }
      }
    } else if (command === 'output.get') {
      console.log('[Output Reader] Getting output');
      if (args && args.length > 0) {
        const pid = typeof args[0] === 'number' ? args[0] : args[0].pid;
        const lines = args[0].lines;
        const tail = args[0].tail !== false; // Default to true
        
        try {
          const result = getOutput(pid, lines, tail);
          return {
            action: 'get',
            pid,
            exists: result.exists,
            stdout: result.stdout,
            stderr: result.stderr
          };
        } catch (error) {
          console.error(`[Output Reader] Error getting output: ${error}`);
          return { action: 'get', error: String(error) };
        }
      }
    } else if (command === 'output.clear') {
      console.log('[Output Reader] Clearing output');
      if (args && args.length > 0) {
        const pid = typeof args[0] === 'number' ? args[0] : args[0].pid;
        
        try {
          const result = clearOutput(pid);
          return { action: 'clear', pid, success: result };
        } catch (error) {
          console.error(`[Output Reader] Error clearing output: ${error}`);
          return { action: 'clear', error: String(error) };
        }
      }
    } else if (command === 'output.list') {
      console.log('[Output Reader] Listing monitored processes');
      
      try {
        const processes = getMonitoredProcesses();
        return {
          action: 'list',
          processes,
          count: processes.length
        };
      } catch (error) {
        console.error(`[Output Reader] Error listing processes: ${error}`);
        return { action: 'list', error: String(error) };
      }
    }
  } catch (error) {
    console.error(`[Output Reader] Error processing command: ${error}`);
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

