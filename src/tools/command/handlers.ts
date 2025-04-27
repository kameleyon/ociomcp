// Auto-generated safe fallback for handlers

export function activate() {
    console.log("[TOOL] handlers activated (passive mode)");
}

export function onFileWrite() { /* no-op */ }
export function onSessionStart() { /* no-op */ }
export function onCommand() { /* no-op */ }
/**
 * Command Handlers
 * 
 * Exports all command handlers for the System and Command Management tools
 */

import { z } from 'zod';

import { 
  handleExecuteCommand, 
  ExecuteCommandSchema,
  handleKillCommand,
  KillCommandSchema,
  handleListActiveProcesses
} from './cmd-executor';

import {
  handleStartMonitoring,
  StartMonitoringSchema,
  handleStopMonitoring,
  StopMonitoringSchema,
  handleGetOutput,
  GetOutputSchema,
  handleClearOutput,
  ClearOutputSchema,
  handleListMonitoredProcesses
} from './output-reader';

import {
  handleKillSession,
  KillSessionSchema,
  handleKillAllSessions,
  KillAllSessionsSchema,
  handleKillSessionsByCommand,
  KillSessionsByCommandSchema
} from './session-killer';

import {
  handleListSessions,
  ListSessionsSchema
} from './session-lister';

import {
  handleListProcesses,
  ListProcessesSchema,
  handleProcessTree
} from './process-lister';

import {
  handleKillProcess,
  KillProcessSchema,
  handleKillProcessesByName,
  KillProcessesByNameSchema,
  handleFindProcessesByName
} from './process-killer';

import {
  handleOpenInBrowser,
  OpenInBrowserSchema,
  handleOpenFileInBrowser,
  OpenFileInBrowserSchema,
  handleOpenLocalServer,
  OpenLocalServerSchema,
  handleFindAvailablePort
} from './browser-launcher';

import {
  handleCreateEnvFile,
  CreateEnvFileSchema,
  handleLoadEnvFile,
  LoadEnvFileSchema,
  handleGetEnvVariable,
  GetEnvVariableSchema,
  handleSetEnvVariable,
  SetEnvVariableSchema,
  handleGenerateSecret,
  GenerateSecretSchema,
  handleEncryptValue,
  EncryptValueSchema,
  handleDecryptValue,
  DecryptValueSchema
} from './env-manager';

// Command schemas
export const commandSchemas = {
  // CmdExecutor
  execute_command: ExecuteCommandSchema,
  kill_command: KillCommandSchema,
  list_active_processes: z.object({}),

  // OutputReader
  start_monitoring: StartMonitoringSchema,
  stop_monitoring: StopMonitoringSchema,
  get_output: GetOutputSchema,
  clear_output: ClearOutputSchema,
  list_monitored_processes: z.object({}),

  // SessionKiller
  kill_session: KillSessionSchema,
  kill_all_sessions: KillAllSessionsSchema,
  kill_sessions_by_command: KillSessionsByCommandSchema,

  // SessionLister
  list_sessions: ListSessionsSchema,

  // ProcessLister
  list_processes: ListProcessesSchema,
  process_tree: z.object({
    rootPid: z.number().optional()
  }),

  // ProcessKiller
  kill_process: KillProcessSchema,
  kill_processes_by_name: KillProcessesByNameSchema,
  find_processes_by_name: z.object({
    name: z.string()
  }),

  // BrowserLauncher
  open_in_browser: OpenInBrowserSchema,
  open_file_in_browser: OpenFileInBrowserSchema,
  open_local_server: OpenLocalServerSchema,
  find_available_port: z.object({
    startPort: z.number().optional().default(3000),
    endPort: z.number().optional().default(9000)
  }),

  // EnvManager
  create_env_file: CreateEnvFileSchema,
  load_env_file: LoadEnvFileSchema,
  get_env_variable: GetEnvVariableSchema,
  set_env_variable: SetEnvVariableSchema,
  generate_secret: GenerateSecretSchema,
  encrypt_value: EncryptValueSchema,
  decrypt_value: DecryptValueSchema
};

// Command handlers
export const commandHandlers = {
  // CmdExecutor
  execute_command: handleExecuteCommand,
  kill_command: handleKillCommand,
  list_active_processes: handleListActiveProcesses,

  // OutputReader
  start_monitoring: handleStartMonitoring,
  stop_monitoring: handleStopMonitoring,
  get_output: handleGetOutput,
  clear_output: handleClearOutput,
  list_monitored_processes: handleListMonitoredProcesses,

  // SessionKiller
  kill_session: handleKillSession,
  kill_all_sessions: handleKillAllSessions,
  kill_sessions_by_command: handleKillSessionsByCommand,

  // SessionLister
  list_sessions: handleListSessions,

  // ProcessLister
  list_processes: handleListProcesses,
  process_tree: handleProcessTree,

  // ProcessKiller
  kill_process: handleKillProcess,
  kill_processes_by_name: handleKillProcessesByName,
  find_processes_by_name: handleFindProcessesByName,

  // BrowserLauncher
  open_in_browser: handleOpenInBrowser,
  open_file_in_browser: handleOpenFileInBrowser,
  open_local_server: handleOpenLocalServer,
  find_available_port: handleFindAvailablePort,

  // EnvManager
  create_env_file: handleCreateEnvFile,
  load_env_file: handleLoadEnvFile,
  get_env_variable: handleGetEnvVariable,
  set_env_variable: handleSetEnvVariable,
  generate_secret: handleGenerateSecret,
  encrypt_value: handleEncryptValue,
  decrypt_value: handleDecryptValue
};

