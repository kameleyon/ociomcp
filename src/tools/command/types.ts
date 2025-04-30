// Auto-generated safe fallback for types

export function activate() {
    console.log("[TOOL] types activated (passive mode)");
}

export function onFileWrite(filePath: string, content: string) {
  console.log(`[Command Types] File written: ${filePath}`);
  
  // Check if the file is a type definition file
  if (filePath.endsWith('.d.ts') ||
      filePath.endsWith('types.ts') ||
      filePath.endsWith('interfaces.ts')) {
    console.log(`[Command Types] Detected type definition file: ${filePath}`);
    return {
      detected: true,
      filePath,
      type: 'type-definition'
    };
  }
  
  return { detected: false };
}

export function onSessionStart(context: any) {
  console.log('[Command Types] Session started');
  
  try {
    // Log available types
    console.log('[Command Types] Command type definitions loaded');
    
    // Log schema information
    const schemas = [
      'ExecuteCommandArgsSchema',
      'ReadOutputArgsSchema',
      'ForceTerminateArgsSchema',
      'ListSessionsArgsSchema',
      'ListProcessesArgsSchema',
      'KillProcessArgsSchema'
    ];
    
    console.log(`[Command Types] ${schemas.length} command schemas available`);
    
    // Log interface information
    const interfaces = [
      'TerminalSession',
      'ProcessInfo',
      'CommandResult'
    ];
    
    console.log(`[Command Types] ${interfaces.length} command interfaces available`);
    
    return {
      initialized: true,
      schemas: schemas.length,
      interfaces: interfaces.length
    };
  } catch (error) {
    console.error(`[Command Types] Error during initialization: ${error}`);
    return {
      initialized: false,
      error: String(error)
    };
  }
}

export function onCommand(command: string, args: any[]) {
  console.log(`[Command Types] Command received: ${command}`);
  
  try {
    // Check if the command is related to type validation
    if (command === 'types.validate') {
      console.log('[Command Types] Validating types');
      
      const schema = args && args.length > 0 ? args[0].schema : null;
      const data = args && args.length > 0 ? args[0].data : null;
      
      if (!schema || !data) {
        return {
          action: 'validate',
          valid: false,
          error: 'Missing schema or data'
        };
      }
      
      // Check if the schema exists
      const schemas: Record<string, z.ZodType<any>> = {
        'execute_command': ExecuteCommandArgsSchema,
        'read_output': ReadOutputArgsSchema,
        'force_terminate': ForceTerminateArgsSchema,
        'list_sessions': ListSessionsArgsSchema,
        'list_processes': ListProcessesArgsSchema,
        'kill_process': KillProcessArgsSchema
      };
      
      if (!Object.prototype.hasOwnProperty.call(schemas, schema)) {
        return {
          action: 'validate',
          valid: false,
          error: `Schema not found: ${schema}`
        };
      }
      
      // Validate the data against the schema
      try {
        const validatedData = schemas[schema as keyof typeof schemas].parse(data);
        return {
          action: 'validate',
          valid: true,
          data: validatedData
        };
      } catch (validationError) {
        return {
          action: 'validate',
          valid: false,
          error: String(validationError)
        };
      }
    }
    
    return { action: 'unknown' };
  } catch (error) {
    console.error(`[Command Types] Error processing command: ${error}`);
    return { action: 'error', error: String(error) };
  }
}
/**
 * Command Types
 * Defines the interfaces and types for command execution
 */

import { z } from 'zod';

/**
 * Schema for execute_command arguments
 */
export const ExecuteCommandArgsSchema = z.object({
  command: z.string().describe("Command to execute"),
  cwd: z.string().optional().describe("Working directory for the command"),
  timeout: z.number().optional().describe("Timeout in milliseconds"),
});

/**
 * Schema for read_output arguments
 */
export const ReadOutputArgsSchema = z.object({
  sessionId: z.string().describe("Session ID of the terminal session"),
});

/**
 * Schema for force_terminate arguments
 */
export const ForceTerminateArgsSchema = z.object({
  sessionId: z.string().describe("Session ID of the terminal session to terminate"),
});

/**
 * Schema for list_sessions arguments
 */
export const ListSessionsArgsSchema = z.object({});

/**
 * Schema for list_processes arguments
 */
export const ListProcessesArgsSchema = z.object({});

/**
 * Schema for kill_process arguments
 */
export const KillProcessArgsSchema = z.object({
  pid: z.number().describe("Process ID to kill"),
  signal: z.string().optional().describe("Signal to send to the process"),
});

/**
 * Terminal session interface
 */
export interface TerminalSession {
  id: string;
  command: string;
  cwd: string;
  startTime: Date;
  isRunning: boolean;
  exitCode?: number;
}

/**
 * Process information interface
 */
export interface ProcessInfo {
  pid: number;
  command: string;
  cpu: number;
  memory: number;
  user: string;
  startTime: Date;
}

/**
 * Command execution result interface
 */
export interface CommandResult {
  output: string;
  exitCode: number | null;
  sessionId: string;
  isRunning: boolean;
}
