// Auto-generated safe fallback for types

export function activate() {
    console.log("[TOOL] types activated (passive mode)");
}

export function onFileWrite() { /* no-op */ }
export function onSessionStart() { /* no-op */ }
export function onCommand() { /* no-op */ }
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
