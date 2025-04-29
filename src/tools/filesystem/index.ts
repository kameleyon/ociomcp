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

export function onFileWrite(event: any) {
  console.log(`[Filesystem] File write event detected: ${event.path}`);
  
  try {
    // Track file operations
    if (!globalThis.fileOperations) {
      globalThis.fileOperations = [];
    }
    
    // Record the file operation
    globalThis.fileOperations.push({
      operation: 'write',
      path: event.path,
      timestamp: new Date().toISOString(),
      success: true
    });
    
    // Check if there are any file watchers for this path
    if (globalThis.fileWatchers) {
      Object.values(globalThis.fileWatchers).forEach(watcher => {
        // Check if the path matches the watcher pattern
        const { path: watchPath, pattern, callback } = watcher;
        
        if (event.path.startsWith(watchPath) ||
            (pattern && new RegExp(pattern).test(event.path))) {
          // Execute the watcher callback
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
    
    // Check for specific file types that might need special handling
    const extension = event.path.split('.').pop()?.toLowerCase();
    
    // Handle TypeScript files
    if (extension === 'ts' || extension === 'tsx') {
      // Import TypeScript error fixer
      const { checkTypeScriptFile } = require('./typescript-error-fixer.js');
      
      // Check for TypeScript errors
      checkTypeScriptFile(event.path)
        .then((result: any) => {
          if (result.errors && result.errors.length > 0) {
            console.log(`[Filesystem] TypeScript errors detected in ${event.path}: ${result.errors.length} errors`);
          }
        })
        .catch((error: any) => {
          console.error(`[Filesystem] Error checking TypeScript file: ${error.message}`);
        });
    }
    
    // Handle JavaScript files
    if (extension === 'js' || extension === 'jsx') {
      // Import import fixer
      const { checkImports } = require('./import-fixer.js');
      
      // Check for import issues
      checkImports(event.path)
        .then((result: any) => {
          if (result.issues && result.issues.length > 0) {
            console.log(`[Filesystem] Import issues detected in ${event.path}: ${result.issues.length} issues`);
          }
        })
        .catch((error: any) => {
          console.error(`[Filesystem] Error checking imports: ${error.message}`);
        });
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[Filesystem] Error handling file write: ${errorMessage}`);
  }
}

export function onSessionStart(session: any) {
  console.log(`[Filesystem] New session started: ${session.id}`);
  
  try {
    // Initialize filesystem state for the session
    session.filesystemState = {
      initialized: true,
      timestamp: new Date().toISOString(),
      operations: [],
      watchers: {},
      projectRoot: process.cwd()
    };
    
    // Initialize global state if not already initialized
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
          // In a real implementation, this would check for TypeScript errors
        }
      },
      {
        id: 'javascript-watcher',
        path: 'src',
        pattern: '\\.(js|jsx)$',
        callback: (path: string) => {
          console.log(`[Filesystem] JavaScript file changed: ${path}`);
          // In a real implementation, this would check for import issues
        }
      },
      {
        id: 'package-watcher',
        path: '',
        pattern: '(package\\.json|package-lock\\.json|yarn\\.lock)$',
        callback: (path: string) => {
          console.log(`[Filesystem] Package file changed: ${path}`);
          // In a real implementation, this would check for dependency issues
        }
      }
    ];
    
    // Register default watchers
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

export function onCommand(command: any) {
  console.log(`[Filesystem] Command executed: ${command.name}`);
  
  try {
    // Import handlers based on command
    const handlers = require('./handlers.js');
    
    // Handle filesystem-related commands
    switch (command.name) {
      case 'search_files':
        // Search files
        return handlers.handleSearchFiles({
          path: command.path || '.',
          regex: command.regex || '.*',
          filePattern: command.filePattern
        });
        
      case 'apply_diff':
        // Apply diff
        return handlers.handleApplyDiff({
          path: command.path,
          diff: command.diff
        });
        
      case 'format_code':
        // Format code
        return handlers.handleFormatCode({
          path: command.path,
          language: command.language,
          options: command.options || {}
        });
        
      case 'fix_imports':
        // Fix imports
        return handlers.handleFixImports({
          path: command.path,
          options: command.options || {}
        });
        
      case 'fix_typescript_errors':
        // Fix TypeScript errors
        return handlers.handleFixTypeScriptErrors({
          path: command.path,
          options: command.options || {}
        });
        
      case 'add_file_watcher':
        // Add file watcher
        if (!globalThis.fileWatchers) {
          globalThis.fileWatchers = {};
        }
        
        const watcherId = command.id || `watcher-${Date.now()}`;
        globalThis.fileWatchers[watcherId] = {
          path: command.path || '.',
          pattern: command.pattern || '.*',
          callback: (path: string) => {
            console.log(`[Filesystem] File watcher ${watcherId} triggered for ${path}`);
            // In a real implementation, this would execute a custom callback
          }
        };
        
        return {
          watcherId,
          message: `File watcher added for ${command.path || '.'} with pattern ${command.pattern || '.*'}`
        };
        
      case 'remove_file_watcher':
        // Remove file watcher
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
        // Get file operations history
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

