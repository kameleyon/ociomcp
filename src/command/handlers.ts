/**
 * Command Handlers
 * Implements handlers for command execution operations
 */

import { commandManager } from './command-manager.js';

/**
 * Handle execute_command command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleExecuteCommand(args: any) {
  try {
    const { command, cwd, timeout } = args;
    
    // Execute the command
    const result = await commandManager.executeCommand(command, cwd, timeout);
    
    // Prepare the response
    let responseText = result.output;
    
    // Add status information
    if (result.isRunning) {
      responseText += '\n\n[Command is still running in the background. Session ID: ' + result.sessionId + ']';
    } else {
      responseText += '\n\n[Command completed with exit code: ' + result.exitCode + ']';
    }
    
    return {
      content: [{ type: "text", text: responseText }],
      metadata: {
        sessionId: result.sessionId,
        exitCode: result.exitCode,
        isRunning: result.isRunning,
      },
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error executing command: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Handle read_output command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleReadOutput(args: any) {
  try {
    const { sessionId } = args;
    
    // Read the output
    const result = commandManager.readOutput(sessionId);
    
    // Prepare the response
    let responseText = result.output;
    
    // Add status information
    if (result.isRunning) {
      responseText += '\n\n[Command is still running]';
    } else {
      responseText += '\n\n[Command completed with exit code: ' + result.exitCode + ']';
    }
    
    return {
      content: [{ type: "text", text: responseText }],
      metadata: {
        exitCode: result.exitCode,
        isRunning: result.isRunning,
      },
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error reading output: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Handle force_terminate command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleForceTerminate(args: any) {
  try {
    const { sessionId } = args;
    
    // Terminate the session
    const success = commandManager.forceTerminate(sessionId);
    
    if (success) {
      return {
        content: [{ type: "text", text: `Terminal session ${sessionId} terminated successfully` }],
      };
    } else {
      return {
        content: [{ type: "text", text: `Failed to terminate terminal session ${sessionId}` }],
        isError: true,
      };
    }
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error terminating session: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Handle list_sessions command
 * 
 * @returns Command result
 */
export async function handleListSessions() {
  try {
    // List the sessions
    const sessions = commandManager.listSessions();
    
    if (sessions.length === 0) {
      return {
        content: [{ type: "text", text: 'No active terminal sessions' }],
      };
    }
    
    // Format the sessions
    const formattedSessions = sessions.map(session => {
      const status = session.isRunning ? 'RUNNING' : `EXITED (${session.exitCode})`;
      const duration = formatDuration(new Date().getTime() - session.startTime.getTime());
      
      return [
        `Session ID: ${session.id}`,
        `Command: ${session.command}`,
        `Working Directory: ${session.cwd}`,
        `Status: ${status}`,
        `Started: ${session.startTime.toISOString()}`,
        `Duration: ${duration}`,
        '---',
      ].join('\n');
    });
    
    return {
      content: [{ type: "text", text: formattedSessions.join('\n') }],
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error listing sessions: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Handle list_processes command
 * 
 * @returns Command result
 */
export async function handleListProcesses() {
  try {
    // List the processes
    const processes = await commandManager.listProcesses();
    
    // Format the processes
    const formattedProcesses = processes.map(process => {
      return [
        `PID: ${process.pid}`,
        `Command: ${process.command}`,
        `CPU: ${process.cpu.toFixed(1)}%`,
        `Memory: ${process.memory.toFixed(1)}%`,
        `User: ${process.user}`,
        `Started: ${process.startTime.toISOString()}`,
        '---',
      ].join('\n');
    });
    
    return {
      content: [{ type: "text", text: formattedProcesses.join('\n') }],
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error listing processes: ${error}` }],
      isError: true,
    };
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
    const { pid, signal } = args;
    
    // Kill the process
    const success = await commandManager.killProcess(pid, signal);
    
    if (success) {
      return {
        content: [{ type: "text", text: `Process ${pid} killed successfully` }],
      };
    } else {
      return {
        content: [{ type: "text", text: `Failed to kill process ${pid}` }],
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
 * Format duration in human-readable format
 * 
 * @param durationMs Duration in milliseconds
 * @returns Formatted duration string
 */
function formatDuration(durationMs: number): string {
  const seconds = Math.floor(durationMs / 1000) % 60;
  const minutes = Math.floor(durationMs / (1000 * 60)) % 60;
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  
  return `${hours}h ${minutes}m ${seconds}s`;
}