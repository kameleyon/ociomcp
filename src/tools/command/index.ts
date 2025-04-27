// Auto-generated safe fallback for index

export function activate() {
    console.log("[TOOL] index activated (passive mode)");
}

export function onFileWrite() { /* no-op */ }
export function onSessionStart() { /* no-op */ }
export function onCommand() { /* no-op */ }
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

