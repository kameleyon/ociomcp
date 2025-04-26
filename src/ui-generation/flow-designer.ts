/**
 * Flow Designer
 * 
 * Main entry point for the modular flow designer system
 */

import * as fs from 'fs/promises';
import * as path from 'path';

// Import from modular flow designer system
import { 
  FlowDesigner, 
  createFlowDesigner, 
  updateFlowDesigner, 
  GenerateFlowSchema, 
  FlowOptions 
} from './flow-designer/index';

// Re-export types and interfaces for backwards compatibility
export { GenerateFlowSchema, FlowOptions };

/**
 * Generate a flow designer
 * 
 * @param options Flow options
 * @param outputPath Optional output path
 * @returns Promise with result
 */
export async function generateFlow(
  options: unknown, 
  outputPath?: string
): Promise<{ success: boolean; message: string; files?: string[] }> {
  return createFlowDesigner(options, outputPath);
}

/**
 * Update an existing flow designer
 * 
 * @param options Flow options
 * @param outputPath Optional output path
 * @returns Promise with result
 */
export async function updateFlow(
  options: unknown,
  outputPath?: string
): Promise<{ success: boolean; message: string; files?: string[] }> {
  return updateFlowDesigner(options, outputPath);
}

/**
 * Validate flow options
 * 
 * @param options Flow options to validate
 * @returns Validation result
 */
export function validateFlowOptions(
  options: unknown
): { valid: boolean; message?: string } {
  const result = FlowDesigner.validateFlowOptions(options);
  
  if (!result.valid) {
    return {
      valid: false,
      message: result.errors?.join(', ')
    };
  }
  
  return { valid: true };
}

// Default export for backwards compatibility
export default {
  generateFlow,
  updateFlow,
  validateFlowOptions
};