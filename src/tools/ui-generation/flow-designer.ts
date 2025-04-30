// Auto-generated safe fallback for flow-designer

export function activate() {
    console.log("[TOOL] flow-designer activated (passive mode)");
}

export function onFileWrite(filePath: string, content: string) {
  console.log(`[TOOL] Flow designer processing file: ${filePath}`);
  
  // Check if the file is a flow designer file
  const isFlowFile = filePath.includes('flow') || 
                     filePath.endsWith('.flow.json') || 
                     filePath.endsWith('.flow.ts') || 
                     filePath.endsWith('.flow.js');
  
  if (isFlowFile) {
    console.log(`[TOOL] Detected change in flow designer file: ${filePath}`);
    // In a real implementation, we might analyze the flow file and provide suggestions
    analyzeFlowFile(filePath, content);
  }
}

export function onSessionStart(sessionId: string) {
  console.log(`[TOOL] Flow designer initialized for session: ${sessionId}`);
  
  // Check for existing flow designer files in the project
  setTimeout(() => {
    console.log('[TOOL] Checking for existing flow designer files...');
    checkExistingFlowFiles();
  }, 3000); // Delay to ensure project files are loaded
}

export function onCommand(command: string, args: any[]) {
  if (command === 'generate-flow') {
    console.log('[TOOL] Generating flow...');
    
    const options = args[0];
    const outputPath = args[1];
    
    return generateFlow(options, outputPath);
  } else if (command === 'update-flow') {
    console.log('[TOOL] Updating flow...');
    
    const options = args[0];
    const outputPath = args[1];
    
    return updateFlow(options, outputPath);
  } else if (command === 'validate-flow') {
    console.log('[TOOL] Validating flow options...');
    
    const options = args[0];
    
    return validateFlowOptions(options);
  } else if (command === 'list-flow-templates') {
    console.log('[TOOL] Listing flow templates...');
    
    return listFlowTemplates();
  }
  
  return null;
}

/**
 * Analyzes a flow file and provides suggestions
 */
function analyzeFlowFile(filePath: string, content: string): void {
  console.log(`[TOOL] Analyzing flow file: ${filePath}`);
  
  try {
    // Parse the flow file if it's JSON
    if (filePath.endsWith('.json')) {
      const flowData = JSON.parse(content);
      
      // Check for common issues
      if (!flowData.nodes || flowData.nodes.length === 0) {
        console.log('[TOOL] Warning: Flow has no nodes');
      }
      
      if (!flowData.edges || flowData.edges.length === 0) {
        console.log('[TOOL] Warning: Flow has no edges');
      }
      
      // Check for disconnected nodes
      if (flowData.nodes && flowData.edges) {
        const connectedNodeIds = new Set<string>();
        
        flowData.edges.forEach((edge: any) => {
          if (edge.source) connectedNodeIds.add(edge.source);
          if (edge.target) connectedNodeIds.add(edge.target);
        });
        
        const disconnectedNodes = flowData.nodes.filter((node: any) => 
          !connectedNodeIds.has(node.id)
        );
        
        if (disconnectedNodes.length > 0) {
          console.log(`[TOOL] Warning: Found ${disconnectedNodes.length} disconnected nodes`);
        }
      }
    }
  } catch (error) {
    console.error(`[TOOL] Error analyzing flow file: ${error}`);
  }
}

/**
 * Checks for existing flow designer files in the project
 */
function checkExistingFlowFiles(): void {
  console.log('[TOOL] Checking for existing flow designer files...');
  
  // This is a placeholder - in a real implementation, this would scan the filesystem
  // For now, we'll just log a message
  console.log('[TOOL] Recommendation: Use the "generate-flow" command to create a new flow');
  console.log('[TOOL] Common flow designer tasks:');
  console.log('- Creating a new flow');
  console.log('- Updating an existing flow');
  console.log('- Validating flow options');
  console.log('- Listing available flow templates');
}

/**
 * Lists available flow templates
 */
async function listFlowTemplates(): Promise<any> {
  console.log('[TOOL] Listing available flow templates...');
  
  // This is a placeholder - in a real implementation, this would return actual templates
  return {
    success: true,
    templates: [
      {
        id: 'form-wizard',
        name: 'Form Wizard',
        description: 'A multi-step form wizard with validation'
      },
      {
        id: 'checkout-flow',
        name: 'Checkout Flow',
        description: 'An e-commerce checkout flow with cart, shipping, and payment steps'
      },
      {
        id: 'user-onboarding',
        name: 'User Onboarding',
        description: 'A user onboarding flow with registration, profile setup, and preferences'
      },
      {
        id: 'decision-tree',
        name: 'Decision Tree',
        description: 'A decision tree flow with conditional branching'
      }
    ]
  };
}
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
