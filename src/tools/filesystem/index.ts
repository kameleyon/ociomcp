// Auto-generated safe fallback for index

export function activate() {
    console.log("[TOOL] index activated (passive mode)");
}

export function onFileWrite() { /* no-op */ }
export function onSessionStart() { /* no-op */ }
export function onCommand() { /* no-op */ }
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

