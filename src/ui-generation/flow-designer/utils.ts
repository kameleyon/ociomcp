/**
 * Flow Designer Utilities
 * 
 * Helper functions for the flow designer
 */

/**
 * Format component name to PascalCase
 * 
 * @param name Component name
 * @returns Formatted component name
 */
export function formatComponentName(name: string): string {
  return name
    .split(/[-_\s]+/)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('');
}

/**
 * Convert string to kebab-case
 * 
 * @param str String to convert
 * @returns Kebab-case string
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}