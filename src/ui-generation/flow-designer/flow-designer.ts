/**
 * Flow Designer Coordinator
 * 
 * Main entry point for the Flow Designer system
 * Coordinates the generation of modular flow components
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { GenerateFlowSchema, FlowOptions } from './schema';
import { formatComponentName, toKebabCase } from './utils';
import { generateReactFlowDesigner } from './react-generator-core';

/**
 * Ensure directory exists
 * 
 * @param dirPath Directory path to create
 */
async function ensureDirectoryExists(dirPath: string): Promise<void> {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    throw new Error(`Failed to create directory ${dirPath}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Write file with directory creation
 * 
 * @param filePath File path to write
 * @param content File content
 */
async function writeFile(filePath: string, content: string): Promise<void> {
  try {
    const dirPath = path.dirname(filePath);
    await ensureDirectoryExists(dirPath);
    await fs.writeFile(filePath, content, 'utf8');
  } catch (error) {
    throw new Error(`Failed to write file ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Validate flow options
 * 
 * @param options Flow options to validate
 * @returns Validation result
 */
export function validateFlowOptions(options: unknown): { 
  valid: boolean; 
  validatedOptions?: FlowOptions; 
  errors?: string[] 
} {
  try {
    const result = GenerateFlowSchema.safeParse(options);
    
    if (!result.success) {
      const formattedErrors = result.error.issues.map(
        issue => `${issue.path.join('.')}: ${issue.message}`
      );
      
      return {
        valid: false,
        errors: formattedErrors
      };
    }
    
    // Additional validation
    const validatedOptions = result.data;
    const errors: string[] = [];
    
    // Check for duplicate step IDs
    const stepIds = validatedOptions.steps.map(step => step.id);
    const uniqueStepIds = new Set(stepIds);
    
    if (uniqueStepIds.size !== stepIds.length) {
      errors.push('Duplicate step IDs found. Each step must have a unique ID.');
    }
    
    // Validate step transitions
    for (const step of validatedOptions.steps) {
      if (step.nextSteps) {
        for (const nextStep of step.nextSteps) {
          if (!stepIds.includes(nextStep.stepId)) {
            errors.push(`Step ${step.id} references non-existent nextStep ${nextStep.stepId}`);
          }
        }
      }
    }
    
    // Check initial and final steps
    const initialSteps = validatedOptions.steps.filter(step => step.isInitial);
    
    if (initialSteps.length === 0) {
      // If no initial step is marked, mark the first step as initial
      validatedOptions.steps[0].isInitial = true;
    } else if (initialSteps.length > 1) {
      errors.push('Multiple initial steps found. Only one step can be marked as initial.');
    }
    
    const finalSteps = validatedOptions.steps.filter(step => step.isFinal);
    
    if (finalSteps.length === 0) {
      // If no final step is marked, mark the last step as final
      validatedOptions.steps[validatedOptions.steps.length - 1].isFinal = true;
    }
    
    if (errors.length > 0) {
      return {
        valid: false,
        errors
      };
    }
    
    return {
      valid: true,
      validatedOptions
    };
  } catch (error) {
    return {
      valid: false,
      errors: [`Invalid flow options: ${error instanceof Error ? error.message : String(error)}`]
    };
  }
}

/**
 * Generate flow designer files based on provided options
 * 
 * @param options Flow options
 * @returns Result with generated files
 */
async function generateFlowDesigner(options: unknown): Promise<{
  success: boolean;
  message: string;
  files?: Array<{ path: string; content: string }>;
}> {
  // Validate options
  const validation = validateFlowOptions(options);
  
  if (!validation.valid || !validation.validatedOptions) {
    return {
      success: false,
      message: `Invalid flow options: ${validation.errors?.join(', ')}`
    };
  }
  
  const validatedOptions = validation.validatedOptions;
  
  try {
    // Generate files based on framework
    switch (validatedOptions.framework) {
      case 'react':
        return generateReactFlowDesigner(validatedOptions);
      case 'vue':
        // TODO: Implement Vue generation
        return {
          success: false,
          message: 'Vue flow generation is not implemented yet'
        };
      case 'angular':
        // TODO: Implement Angular generation
        return {
          success: false,
          message: 'Angular flow generation is not implemented yet'
        };
      case 'svelte':
        // TODO: Implement Svelte generation
        return {
          success: false,
          message: 'Svelte flow generation is not implemented yet'
        };
      case 'solid':
        // TODO: Implement Solid generation
        return {
          success: false,
          message: 'Solid flow generation is not implemented yet'
        };
      case 'html':
        // TODO: Implement HTML generation
        return {
          success: false,
          message: 'HTML flow generation is not implemented yet'
        };
      default:
        return {
          success: false,
          message: `Unsupported framework: ${validatedOptions.framework}`
        };
    }
  } catch (error) {
    return {
      success: false,
      message: `Error generating flow designer: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * Write generated files to disk
 * 
 * @param files Array of { path, content } objects
 * @param basePath Optional base path for all files
 * @returns Result with written files
 */
async function writeFlowDesignerFiles(
  files: Array<{ path: string; content: string }>,
  basePath?: string
): Promise<{
  success: boolean;
  message: string;
  writtenFiles?: string[];
}> {
  try {
    const writtenFiles: string[] = [];
    
    for (const file of files) {
      const filePath = basePath ? path.join(basePath, file.path) : file.path;
      await writeFile(filePath, file.content);
      writtenFiles.push(filePath);
    }
    
    return {
      success: true,
      message: `Successfully wrote ${writtenFiles.length} files`,
      writtenFiles
    };
  } catch (error) {
    return {
      success: false,
      message: `Error writing files: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * Generate and write flow designer
 * 
 * @param options Flow options
 * @param outputPath Optional output path
 * @returns Result of the operation
 */
export async function createFlowDesigner(
  options: unknown,
  outputPath?: string
): Promise<{
  success: boolean;
  message: string;
  files?: string[];
}> {
  try {
    // Generate files
    const generationResult = await generateFlowDesigner(options);
    
    if (!generationResult.success || !generationResult.files) {
      return {
        success: false,
        message: generationResult.message
      };
    }
    
    // Write files
    const writeResult = await writeFlowDesignerFiles(generationResult.files, outputPath);
    
    if (!writeResult.success) {
      return {
        success: false,
        message: writeResult.message
      };
    }
    
    return {
      success: true,
      message: `Successfully created flow designer: ${writeResult.message}`,
      files: writeResult.writtenFiles
    };
  } catch (error) {
    return {
      success: false,
      message: `Error creating flow designer: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * Update existing flow designer
 * 
 * @param options Flow options
 * @param outputPath Optional output path
 * @returns Result of the operation
 */
export async function updateFlowDesigner(
  options: unknown,
  outputPath?: string
): Promise<{
  success: boolean;
  message: string;
  files?: string[];
}> {
  try {
    return await createFlowDesigner(options, outputPath);
  } catch (error) {
    return {
      success: false,
      message: `Error updating flow designer: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * Main export for flow designer system
 */
export default {
  createFlowDesigner,
  updateFlowDesigner,
  generateFlowDesigner,
  validateFlowOptions
};
