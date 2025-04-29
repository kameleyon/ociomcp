// Auto-generated safe fallback for index

export function activate() {
    console.log("[TOOL] index activated (passive mode)");
}

export function onFileWrite(event: any) {
  console.log(`[Command] File write event detected: ${event.path}`);
  
  try {
    // Check if the file is a command-related configuration file
    if (event.path.includes('command') || event.path.endsWith('.cmd') || event.path.endsWith('.sh')) {
      // Import command manager to handle command file changes
      const { CommandManager } = require('./command-manager');
      
      // Register or update command if it's a command file
      if (event.path.endsWith('.cmd') || event.path.endsWith('.sh')) {
        CommandManager.getInstance().registerCommandFile(event.path);
        console.log(`[Command] Registered command file: ${event.path}`);
      }
      
      // Update environment variables if it's an env file
      if (event.path.endsWith('.env')) {
        const { loadEnvironmentVariables } = require('./env-manager');
        loadEnvironmentVariables(event.path);
        console.log(`[Command] Updated environment variables from: ${event.path}`);
      }
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[Command] Error handling file write event: ${errorMessage}`);
  }
}

export function onSessionStart(session: any) {
  console.log(`[Command] New session started: ${session.id}`);
  
  try {
    // Initialize command manager for the session
    const { CommandManager } = require('./command-manager');
    const manager = CommandManager.getInstance();
    
    // Create session-specific command state
    session.commandState = {
      initialized: true,
      timestamp: new Date().toISOString(),
      activeProcesses: [],
      commandHistory: [],
      environmentVariables: { ...process.env }
    };
    
    // Register session with command manager
    manager.registerSession(session.id, session.commandState);
    
    // Initialize command executors
    const { initializeCommandExecutors } = require('./cmd-executor');
    initializeCommandExecutors(session.id);
    
    console.log(`[Command] Command tools initialized for session: ${session.id}`);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[Command] Error initializing session: ${errorMessage}`);
  }
}

export function onCommand(command: any) {
  console.log(`[Command] Command executed: ${command.name}`);
  
  try {
    // Import handlers based on command type
    switch (command.name) {
      case 'execute_command':
        // Execute a CLI command
        const { handleExecuteCommand } = require('./handlers');
        return handleExecuteCommand({
          command: command.command,
          cwd: command.cwd || process.cwd(),
          sessionId: command.sessionId
        });
        
      case 'kill_process':
        // Kill a running process
        const { handleKillProcess } = require('./handlers');
        return handleKillProcess({
          pid: command.pid,
          sessionId: command.sessionId
        });
        
      case 'list_processes':
        // List running processes
        const { handleListProcesses } = require('./handlers');
        return handleListProcesses({
          sessionId: command.sessionId
        });
        
      case 'launch_browser':
        // Launch a browser
        const { handleLaunchBrowser } = require('./handlers');
        return handleLaunchBrowser({
          url: command.url,
          options: command.options || {}
        });
        
      case 'set_env_var':
        // Set environment variable
        const { handleSetEnvironmentVariable } = require('./handlers');
        return handleSetEnvironmentVariable({
          name: command.name,
          value: command.value,
          sessionId: command.sessionId
        });
        
      default:
        // Check if this is a registered custom command
        const { CommandManager } = require('./command-manager');
        const manager = CommandManager.getInstance();
        
        if (manager.hasCommand(command.name)) {
          return manager.executeCommand(command.name, command.args || {});
        }
        
        console.log(`[Command] Unknown command: ${command.name}`);
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[Command] Error executing command: ${errorMessage}`);
    return { error: errorMessage };
  }
}
/**
 * Command Module Index
 * 
 * Exports all command-related functionality
 */

// Export command manager
export * from './command-manager';

// Export command handlers
export * from './handlers';

// Export command types
export * from './types';

// Export command executors
export * from './cmd-executor';
export * from './output-reader';
export * from './session-killer';
export * from './session-lister';
export * from './process-lister';
export * from './process-killer';
export * from './browser-launcher';
export * from './env-manager';

