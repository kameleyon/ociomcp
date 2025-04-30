// Auto-generated safe fallback for utils

export function activate() {
    console.log("[TOOL] utils activated (passive mode)");
}

export function onFileWrite() { /* no-op */ }
export function onSessionStart() { /* no-op */ }
export function onCommand() { /* no-op */ }
/**
 * Utility functions for the IconManager tool
 */

/**
 * Formats a component name to PascalCase
 */
export function formatComponentName(name: string): string {
  return name
    .replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '')
    .replace(/^(.)/, (_, c) => c.toUpperCase());
}

/**
 * Converts a string to kebab-case
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

