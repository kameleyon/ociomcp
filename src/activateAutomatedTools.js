/**
 * Activates all the automated tools for OptimusCode MCP
 * Automated tools are always active and perform operations automatically
 */

// Import logging utility
import { logger } from './utils/logger.js';

/**
 * Activates all automated tools
 * @returns {Object} Object containing all activated tools
 */
export async function activateAutomatedTools() {
  logger.info('Activating automated tools...');
  
  const automatedTools = {};
  
  try {
    // Load all 7 automated tools
    
    // 1. AutoContinue - Monitors context limits and triggers new chat sessions automatically
    const { AutoContinue } = await import('./tools/automated/AutoContinue.js');
    automatedTools.autoContinue = new AutoContinue();
    logger.info('✓ Activated AutoContinue');
    
    // 2. ChatInitiator - Creates new chat sessions while maintaining project context
    const { ChatInitiator } = await import('./tools/automated/ChatInitiator.js');
    automatedTools.chatInitiator = new ChatInitiator();
    logger.info('✓ Activated ChatInitiator');
    
    // 3. ToneAdjuster - Uses natural, casual language with urban touches
    const { ToneAdjuster } = await import('./tools/automated/ToneAdjuster.js');
    automatedTools.toneAdjuster = new ToneAdjuster();
    logger.info('✓ Activated ToneAdjuster');
    
    // 4. PathEnforcer - Ensures all content is written within specified project directories
    const { PathEnforcer } = await import('./tools/automated/PathEnforcer.js');
    automatedTools.pathEnforcer = new PathEnforcer();
    logger.info('✓ Activated PathEnforcer');
    
    // 5. CodeSplitter - Keeps files under 500 lines
    const { CodeSplitter } = await import('./tools/automated/CodeSplitter.js');
    automatedTools.codeSplitter = new CodeSplitter();
    logger.info('✓ Activated CodeSplitter');
    
    // 6. CodeFixer - Automatically fixes common code issues across languages
    const { CodeFixer } = await import('./tools/automated/CodeFixer.js');
    automatedTools.codeFixer = new CodeFixer();
    logger.info('✓ Activated CodeFixer');
    
    // 7. PlanCreator - Creates detailed project plans with phases, steps, and tasks
    const { PlanCreator } = await import('./tools/automated/PlanCreator.js');
    automatedTools.planCreator = new PlanCreator();
    logger.info('✓ Activated PlanCreator');
    
    logger.info('All automated tools successfully activated');
  } catch (error) {
    logger.error(`Error activating automated tools: ${error.message}`);
    logger.error(error.stack);
  }
  
  return automatedTools;
}

/**
 * Deactivate specific automated tools
 * @param {Object} tools - The tools object returned by activateAutomatedTools
 * @param {Array<string>} toolNames - Array of tool names to deactivate
 */
export function deactivateTools(tools, toolNames) {
  if (!tools || !toolNames || !Array.isArray(toolNames)) {
    return;
  }
  
  toolNames.forEach(name => {
    const toolKey = name.charAt(0).toLowerCase() + name.slice(1);
    if (tools[toolKey] && typeof tools[toolKey].disable === 'function') {
      tools[toolKey].disable();
      logger.info(`Deactivated ${name}`);
    }
  });
}

// Export a function to configure all tools at once
export function configureAutomatedTools(tools, config) {
  if (!tools || !config) {
    return;
  }
  
  // Apply configuration to each tool
  Object.entries(config).forEach(([toolName, toolConfig]) => {
    const toolKey = toolName.charAt(0).toLowerCase() + toolName.slice(1);
    
    if (tools[toolKey]) {
      // Apply each configuration option to the tool
      Object.entries(toolConfig).forEach(([option, value]) => {
        const methodName = `set${option.charAt(0).toUpperCase() + option.slice(1)}`;
        
        if (typeof tools[toolKey][methodName] === 'function') {
          tools[toolKey][methodName](value);
          logger.info(`Configured ${toolName}.${option} = ${value}`);
        }
      });
    }
  });
}
