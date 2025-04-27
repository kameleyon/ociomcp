/**
 * Type definitions for activateAutomatedTools.js
 */

/**
 * Result of tool activation
 */
export interface ToolActivationResult {
  success: number;
  failure: number;
  details: Record<string, { active: boolean; error?: string }>;
}

/**
 * Activate all configured tools
 * @returns Tool activation result
 */
export function activateAllTools(): ToolActivationResult;