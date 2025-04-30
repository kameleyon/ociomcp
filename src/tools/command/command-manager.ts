// Auto-generated safe fallback for command-manager

export function activate() {
    console.log("[TOOL] command-manager activated (passive mode)");
}

export function onFileWrite(filePath: string, content: string) {
  console.log(`[Command Manager] File written: ${filePath}`);
  
  // Check if the file is a command-related configuration file
  if (filePath.endsWith('package.json') ||
      filePath.endsWith('tsconfig.json') ||
      filePath.endsWith('.npmrc') ||
      filePath.endsWith('.yarnrc')) {
    console.log(`[Command Manager] Detected configuration file change: ${filePath}`);
    return {
      detected: true,
      filePath,
      type: 'config'
    };
  }
  
  // Check for script files
  const extension = filePath.substring(filePath.lastIndexOf('.')).toLowerCase();
  const scriptExtensions = ['.sh', '.bat', '.cmd', '.ps1'];
  
  if (scriptExtensions.includes(extension)) {
    console.log(`[Command Manager] Detected script file: ${filePath}`);
    return {
      detected: true,
      filePath,
      type: 'script'
    };
  }
  
  return { detected: false };
}

export function onSessionStart(context: any) {
  console.log('[Command Manager] Session started');
  
  // Initialize the command manager
  const manager = commandManager;
  
  // Log system information
  const osType = platform();
  // Use platform to determine shell instead of accessing private property
  const shell = osType === 'win32' ? 'cmd.exe' : '/bin/bash';
  
  console.log(`[Command Manager] OS: ${osType}, Default Shell: ${shell}`);
  
  // List active sessions
  const sessions = manager.listSessions();
  if (sessions.length > 0) {
    console.log(`[Command Manager] Found ${sessions.length} existing terminal sessions`);
  }
  
  try {
    // Check for running processes
    manager.listProcesses().then(processes => {
      console.log(`[Command Manager] Found ${processes.length} running processes`);
    }).catch(error => {
      console.error(`[Command Manager] Error listing processes: ${error}`);
    });
  } catch (error) {
    console.error(`[Command Manager] Error during initialization: ${error}`);
  }
  
  return {
    initialized: true,
    osType,
    shell,
    activeSessions: sessions.length
  };
}

export function onCommand(command: string, args: any[]) {
  console.log(`[Command Manager] Command received: ${command}`);
  
  try {
    if (command === 'terminal.execute') {
      console.log('[Command Manager] Executing command in terminal');
      if (args && args.length > 0) {
        const cmd = typeof args[0] === 'string' ? args[0] : args[0].command;
        const cwd = args[0].cwd || process.cwd();
        const timeout = args[0].timeout;
        
        // Execute the command
        commandManager.executeCommand(cmd, cwd, timeout).then(result => {
          console.log(`[Command Manager] Command executed with session ID: ${result.sessionId}`);
        }).catch(error => {
          console.error(`[Command Manager] Error executing command: ${error}`);
        });
        
        return {
          action: 'execute',
          command: cmd,
          cwd,
          timeout
        };
      }
    } else if (command === 'terminal.read') {
      console.log('[Command Manager] Reading terminal output');
      if (args && args.length > 0) {
        const sessionId = typeof args[0] === 'string' ? args[0] : args[0].sessionId;
        
        try {
          const output = commandManager.readOutput(sessionId);
          return {
            action: 'read',
            sessionId,
            output: output.output,
            isRunning: output.isRunning,
            exitCode: output.exitCode
          };
        } catch (error) {
          console.error(`[Command Manager] Error reading output: ${error}`);
          return { action: 'read', error: String(error) };
        }
      }
    } else if (command === 'terminal.terminate') {
      console.log('[Command Manager] Terminating terminal session');
      if (args && args.length > 0) {
        const sessionId = typeof args[0] === 'string' ? args[0] : args[0].sessionId;
        
        try {
          const result = commandManager.forceTerminate(sessionId);
          return { action: 'terminate', sessionId, success: result };
        } catch (error) {
          console.error(`[Command Manager] Error terminating session: ${error}`);
          return { action: 'terminate', error: String(error) };
        }
      }
    } else if (command === 'terminal.list') {
      console.log('[Command Manager] Listing terminal sessions');
      
      try {
        const sessions = commandManager.listSessions();
        return { action: 'list', sessions };
      } catch (error) {
        console.error(`[Command Manager] Error listing sessions: ${error}`);
        return { action: 'list', error: String(error) };
      }
    } else if (command === 'process.list') {
      console.log('[Command Manager] Listing processes');
      
      try {
        // This is async, so we can't return the result directly
        commandManager.listProcesses().then(processes => {
          console.log(`[Command Manager] Found ${processes.length} processes`);
        }).catch(error => {
          console.error(`[Command Manager] Error listing processes: ${error}`);
        });
        
        return { action: 'listProcesses', started: true };
      } catch (error) {
        console.error(`[Command Manager] Error listing processes: ${error}`);
        return { action: 'listProcesses', error: String(error) };
      }
    } else if (command === 'process.kill') {
      console.log('[Command Manager] Killing process');
      if (args && args.length > 0) {
        const pid = typeof args[0] === 'number' ? args[0] : args[0].pid;
        const signal = args[0].signal;
        
        try {
          // This is async, so we can't return the result directly
          commandManager.killProcess(pid, signal).then(result => {
            console.log(`[Command Manager] Process ${pid} killed: ${result}`);
          }).catch(error => {
            console.error(`[Command Manager] Error killing process: ${error}`);
          });
          
          return { action: 'killProcess', pid, signal, started: true };
        } catch (error) {
          console.error(`[Command Manager] Error killing process: ${error}`);
          return { action: 'killProcess', error: String(error) };
        }
      }
    }
  } catch (error) {
    console.error(`[Command Manager] Error processing command: ${error}`);
    return { action: 'error', error: String(error) };
  }
  
  return { action: 'unknown' };
}
/**
 * Command Manager
 * Manages command execution and terminal sessions
 */

import { spawn, ChildProcess, exec } from 'child_process';
import { platform } from 'os';
import { v4 as uuidv4 } from 'uuid';
import { TerminalSession, CommandResult, ProcessInfo } from './types.js';

/**
 * Command Manager class
 * Manages command execution and terminal sessions
 */
export class CommandManager {
  /**
   * Map of session IDs to terminal sessions
   */
  private sessions: Map<string, {
    process: ChildProcess;
    session: TerminalSession;
    output: string;
    outputCursor: number;
  }> = new Map();

  /**
   * Default shell for the current platform
   */
  private defaultShell: string;

  /**
   * Constructor
   */
  constructor() {
    // Determine default shell based on platform
    if (platform() === 'win32') {
      this.defaultShell = 'cmd.exe';
    } else {
      this.defaultShell = '/bin/bash';
    }
  }

  /**
   * Execute a command
   * 
   * @param command Command to execute
   * @param cwd Working directory for the command
   * @param timeoutMs Timeout in milliseconds
   * @returns Command execution result
   */
  async executeCommand(command: string, cwd?: string, timeoutMs?: number): Promise<CommandResult> {
    // Generate a unique session ID
    const sessionId = uuidv4();

    // Create a new terminal session
    const session: TerminalSession = {
      id: sessionId,
      command,
      cwd: cwd || process.cwd(),
      startTime: new Date(),
      isRunning: true,
    };

    // Determine shell arguments based on platform
    let shellArgs: string[];
    if (platform() === 'win32') {
      shellArgs = ['/c', command];
    } else {
      shellArgs = ['-c', command];
    }

    // Spawn the process
    const childProcess = spawn(this.defaultShell, shellArgs, {
      cwd: session.cwd,
      shell: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    // Initialize output buffer
    let output = '';

    // Collect stdout
    childProcess.stdout?.on('data', (data) => {
      output += data.toString();
    });

    // Collect stderr
    childProcess.stderr?.on('data', (data) => {
      output += data.toString();
    });

    // Handle process exit
    childProcess.on('exit', (code) => {
      if (this.sessions.has(sessionId)) {
        const sessionData = this.sessions.get(sessionId)!;
        sessionData.session.isRunning = false;
        sessionData.session.exitCode = code !== null ? code : undefined;
      }
    });

    // Store the session
    this.sessions.set(sessionId, {
      process: childProcess,
      session,
      output,
      outputCursor: 0,
    });

    // If timeout is specified, wait for the process to complete or timeout
    if (timeoutMs) {
      try {
        await this.waitForProcessWithTimeout(childProcess, timeoutMs);
        
        // Get the updated session data
        const sessionData = this.sessions.get(sessionId);
        if (sessionData) {
          return {
            output: sessionData.output,
            exitCode: sessionData.session.exitCode || null,
            sessionId,
            isRunning: sessionData.session.isRunning,
          };
        }
      } catch (error) {
        // Timeout occurred, but the process continues running in the background
        return {
          output,
          exitCode: null,
          sessionId,
          isRunning: true,
        };
      }
    }

    // Return the initial result
    return {
      output,
      exitCode: null,
      sessionId,
      isRunning: true,
    };
  }

  /**
   * Read output from a terminal session
   * 
   * @param sessionId Session ID of the terminal session
   * @returns New output from the terminal session
   */
  readOutput(sessionId: string): { output: string; isRunning: boolean; exitCode: number | null } {
    // Check if the session exists
    if (!this.sessions.has(sessionId)) {
      throw new Error(`Terminal session with ID '${sessionId}' not found`);
    }

    // Get the session data
    const sessionData = this.sessions.get(sessionId)!;

    // Get the new output since the last read
    const newOutput = sessionData.output.substring(sessionData.outputCursor);
    
    // Update the output cursor
    sessionData.outputCursor = sessionData.output.length;

    // Return the new output and session status
    return {
      output: newOutput,
      isRunning: sessionData.session.isRunning,
      exitCode: sessionData.session.exitCode !== undefined ? sessionData.session.exitCode : null,
    };
  }

  /**
   * Force terminate a terminal session
   * 
   * @param sessionId Session ID of the terminal session to terminate
   * @returns Whether the termination was successful
   */
  forceTerminate(sessionId: string): boolean {
    // Check if the session exists
    if (!this.sessions.has(sessionId)) {
      throw new Error(`Terminal session with ID '${sessionId}' not found`);
    }

    // Get the session data
    const sessionData = this.sessions.get(sessionId)!;

    // Check if the process is still running
    if (!sessionData.session.isRunning) {
      return true; // Already terminated
    }

    // Kill the process
    try {
      sessionData.process.kill('SIGKILL');
      sessionData.session.isRunning = false;
      sessionData.session.exitCode = -1; // Forced termination
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * List all active terminal sessions
   * 
   * @returns List of active terminal sessions
   */
  listSessions(): TerminalSession[] {
    return Array.from(this.sessions.values()).map(sessionData => sessionData.session);
  }

  /**
   * List all running processes
   * 
   * @returns List of running processes
   */
  async listProcesses(): Promise<ProcessInfo[]> {
    return new Promise((resolve, reject) => {
      // Command to list processes depends on the platform
      let command: string;
      if (platform() === 'win32') {
        command = 'tasklist /fo csv /nh';
      } else {
        command = 'ps -eo pid,pcpu,pmem,user,start,comm';
      }

      // Execute the command
      exec(command, (error, stdout) => {
        if (error) {
          reject(error);
          return;
        }

        // Parse the output
        const processes: ProcessInfo[] = [];
        const lines = stdout.trim().split('\n');

        if (platform() === 'win32') {
          // Parse Windows tasklist output
          for (const line of lines) {
            try {
              // Parse CSV format
              const parts = line.split('","');
              if (parts.length >= 5) {
                const name = parts[0].replace('"', '');
                const pid = parseInt(parts[1].replace('"', ''), 10);
                const memUsage = parseFloat(parts[4].replace('"', '').replace(' K', '')) / 1024;
                
                processes.push({
                  pid,
                  command: name,
                  cpu: 0, // Not available in tasklist
                  memory: memUsage,
                  user: 'N/A', // Not available in tasklist
                  startTime: new Date(),
                });
              }
            } catch (e) {
              // Skip lines that can't be parsed
            }
          }
        } else {
          // Parse Unix ps output
          for (const line of lines) {
            try {
              const parts = line.trim().split(/\s+/);
              if (parts.length >= 6) {
                const pid = parseInt(parts[0], 10);
                const cpu = parseFloat(parts[1]);
                const mem = parseFloat(parts[2]);
                const user = parts[3];
                const startTime = new Date(); // Parse from parts[4] if needed
                const command = parts.slice(5).join(' ');
                
                processes.push({
                  pid,
                  command,
                  cpu,
                  memory: mem,
                  user,
                  startTime,
                });
              }
            } catch (e) {
              // Skip lines that can't be parsed
            }
          }
        }

        resolve(processes);
      });
    });
  }

  /**
   * Kill a process
   * 
   * @param pid Process ID to kill
   * @param signal Signal to send to the process
   * @returns Whether the process was killed successfully
   */
  async killProcess(pid: number, signal?: string): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        // Use different commands based on platform
        let command: string;
        if (platform() === 'win32') {
          command = `taskkill /F /PID ${pid}`;
        } else {
          command = `kill ${signal ? `-${signal}` : ''} ${pid}`;
        }

        // Execute the command
        exec(command, (error) => {
          resolve(!error);
        });
      } catch (error) {
        resolve(false);
      }
    });
  }

  /**
   * Wait for a process to complete with a timeout
   * 
   * @param process Child process to wait for
   * @param timeoutMs Timeout in milliseconds
   * @returns Promise that resolves when the process completes or rejects on timeout
   */
  private waitForProcessWithTimeout(process: ChildProcess, timeoutMs: number): Promise<void> {
    return new Promise((resolve, reject) => {
      // Set up a timeout
      const timeout = setTimeout(() => {
        reject(new Error('Process timed out'));
      }, timeoutMs);

      // Wait for the process to exit
      process.on('exit', () => {
        clearTimeout(timeout);
        resolve();
      });
    });
  }
}

// Create a singleton instance
export const commandManager = new CommandManager();
