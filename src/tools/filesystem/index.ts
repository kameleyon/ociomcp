// Auto-generated safe fallback for index

export function activate() {
    console.log("[TOOL] index activated (passive mode)");
}

// Define global state types
declare global {
  var fileOperations: Array<{
    operation: string;
    path: string;
    timestamp: string;
    success: boolean;
  }>;
  var fileWatchers: Record<string, {
    path: string;
    pattern: string;
    callback: (path: string) => void;
  }>;
}

/**
 * Handles file write events for the filesystem index.
 * Logs the event and dispatches to relevant sub-handlers if needed.
 */
export function onFileWrite(event: any) {
  console.log(`[Filesystem] File write event detected: ${event.path}`);
  try {
    // Track file operations
    if (!globalThis.fileOperations) {
      globalThis.fileOperations = [];
    }
    globalThis.fileOperations.push({
      operation: 'write',
      path: event.path,
      timestamp: new Date().toISOString(),
      success: true
    });
    // Optionally dispatch to sub-handlers or watchers
    if (globalThis.fileWatchers) {
      Object.values(globalThis.fileWatchers).forEach(watcher => {
        const { path: watchPath, pattern, callback } = watcher;
        if (event.path.startsWith(watchPath) ||
            (pattern && new RegExp(pattern).test(event.path))) {
          try {
            callback(event.path);
            console.log(`[Filesystem] Executed file watcher callback for ${event.path}`);
          } catch (watcherError: unknown) {
            const errorMessage = watcherError instanceof Error ? watcherError.message : String(watcherError);
            console.error(`[Filesystem] Error in file watcher callback: ${errorMessage}`);
          }
        }
      });
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[Filesystem] Error handling file write: ${errorMessage}`);
  }
}

/**
 * Initializes or resets filesystem index state at the start of a session.
 */
export function onSessionStart(session: any) {
  console.log(`[Filesystem] New session started: ${session.id}`);
  try {
    session.filesystemState = {
      initialized: true,
      timestamp: new Date().toISOString(),
      operations: [],
      watchers: {},
      projectRoot: process.cwd()
    };
    if (!globalThis.fileOperations) globalThis.fileOperations = [];
    if (!globalThis.fileWatchers) globalThis.fileWatchers = {};
    // Set up default file watchers
    const defaultWatchers = [
      {
        id: 'typescript-watcher',
        path: 'src',
        pattern: '\\.(ts|tsx)$',
        callback: (path: string) => {
          console.log(`[Filesystem] TypeScript file changed: ${path}`);
        }
      },
      {
        id: 'javascript-watcher',
        path: 'src',
        pattern: '\\.(js|jsx)$',
        callback: (path: string) => {
          console.log(`[Filesystem] JavaScript file changed: ${path}`);
        }
      },
      {
        id: 'package-watcher',
        path: '',
        pattern: '(package\\.json|package-lock\\.json|yarn\\.lock)$',
        callback: (path: string) => {
          console.log(`[Filesystem] Package file changed: ${path}`);
        }
      }
    ];
    defaultWatchers.forEach(watcher => {
      globalThis.fileWatchers[watcher.id] = {
        path: watcher.path,
        pattern: watcher.pattern,
        callback: watcher.callback
      };
      session.filesystemState.watchers[watcher.id] = {
        path: watcher.path,
        pattern: watcher.pattern
      };
    });
    console.log(`[Filesystem] Initialized ${defaultWatchers.length} file watchers`);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[Filesystem] Error initializing session: ${errorMessage}`);
  }
}

/**
 * Handles filesystem index commands.
 * Dispatches commands to the appropriate sub-handler based on the command name.
 */
export function onCommand(command: any) {
  console.log(`[Filesystem] Command executed: ${command.name}`);
  try {
    const handlers = require('./handlers.js');
    switch (command.name) {
      case 'search_files':
        return handlers.handleSearchFiles({
          path: command.path || '.',
          regex: command.regex || '.*',
          filePattern: command.filePattern
        });
      case 'apply_diff':
        return handlers.handleApplyDiff({
          path: command.path,
          diff: command.diff
        });
      case 'format_code':
        return handlers.handleFormatCode({
          path: command.path,
          language: command.language,
          options: command.options || {}
        });
      case 'fix_imports':
        return handlers.handleFixImports({
          path: command.path,
          options: command.options || {}
        });
      case 'fix_typescript_errors':
        return handlers.handleFixTypeScriptErrors({
          path: command.path,
          options: command.options || {}
        });
      case 'add_file_watcher':
        if (!globalThis.fileWatchers) {
          globalThis.fileWatchers = {};
        }
        const watcherId = command.id || `watcher-${Date.now()}`;
        globalThis.fileWatchers[watcherId] = {
          path: command.path || '.',
          pattern: command.pattern || '.*',
          callback: (path: string) => {
            console.log(`[Filesystem] File watcher ${watcherId} triggered for ${path}`);
          }
        };
        return {
          watcherId,
          message: `File watcher added for ${command.path || '.'} with pattern ${command.pattern || '.*'}`
        };
      case 'remove_file_watcher':
        if (globalThis.fileWatchers && command.id && globalThis.fileWatchers[command.id]) {
          delete globalThis.fileWatchers[command.id];
          return {
            message: `File watcher ${command.id} removed`
          };
        } else {
          return {
            error: `File watcher ${command.id} not found`
          };
        }
      case 'get_file_operations':
        return {
          operations: globalThis.fileOperations || []
        };
      default:
        console.log(`[Filesystem] Unknown command: ${command.name}`);
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[Filesystem] Error executing command: ${errorMessage}`);
    return { error: errorMessage };
  }
}
/**
 * Filesystem Module
 * Exports all filesystem components
 */

// Export types
export * from './types.js';

// Export filesystem functions
export * from './filesystem.js';

// Export search functions
export { searchFiles, searchCode } from './search.js';
export { applyDiff as applyBlockEdit } from './search.js';

// Export diff applier functions
export * from './diff-applier.js';

// Export code formatter functions
export * from './code-formatter.js';

// Export markdown tool functions
export * from './markdown-tool.js';

// Export dependency tool functions
export * from './dependency-tool.js';

// Export git tool functions
export * from './git-tool.js';

// Export import fixer functions
export * from './import-fixer.js';

// Export TypeScript error fixer functions
export * from './typescript-error-fixer.js';

// Export handlers
export * from './handlers.js';
