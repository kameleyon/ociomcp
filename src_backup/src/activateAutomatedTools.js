/**
 * Tool Activation Script for OptimusCode MCP
 * 
 * This script provides a simple interface to activate and deactivate tools 
 * according to the configuration in tools-config.json.
 */

import path from 'path';
import fs from 'fs';
import { toolActivator } from '../lib/tool-activator.js';

/**
 * Activate all configured tools
 */
export function activateAllTools() {
  console.log('Activating all configured tools...');
  const results = toolActivator.activateAllTools();
  
  // Count successes and failures
  let successCount = 0;
  let failureCount = 0;
  
  for (const [toolName, status] of results.entries()) {
    if (status.active) {
      successCount++;
    } else {
      failureCount++;
      console.error(`Failed to activate ${toolName}: ${status.error || 'Unknown error'}`);
    }
  }
  
  console.log(`Tool activation complete: ${successCount} succeeded, ${failureCount} failed`);
  return {
    success: successCount,
    failure: failureCount,
    details: Object.fromEntries(results)
  };
}

/**
 * Deactivate all tools
 */
export function deactivateAllTools() {
  console.log('Deactivating all tools...');
  const results = toolActivator.deactivateAllTools();
  
  console.log(`Deactivated ${results.size} tools`);
  return {
    count: results.size,
    details: Object.fromEntries(results)
  };
}

/**
 * Get activation status of all tools
 */
export function getToolsStatus() {
  const status = toolActivator.getActivationStatus();
  return {
    activeCount: Array.from(status.values()).filter(s => s.active).length,
    inactiveCount: Array.from(status.values()).filter(s => !s.active).length,
    details: Object.fromEntries(status)
  };
}

/**
 * Check if MCP tools are properly initialized
 */
export function checkMcpToolsInitialization() {
  try {
    // Initialize if not initialized yet
    if (toolActivator.getActiveTools().length === 0) {
      toolActivator.initialize();
    }
    
    return {
      initialized: true,
      message: 'MCP tools are properly initialized'
    };
  } catch (error) {
    return {
      initialized: false,
      message: `Failed to initialize MCP tools: ${error}`
    };
  }
}

/**
 * Command handler for activating tools
 */
export function handleActivateToolsCommand(args) {
  if (!args || args.length === 0 || args[0] === 'all') {
    return activateAllTools();
  }
  
  // Activate specific tools
  const results = {};
  for (const toolName of args) {
    results[toolName] = toolActivator.activateTool(toolName);
  }
  
  return {
    count: args.length,
    details: results
  };
}

/**
 * Command handler for deactivating tools
 */
export function handleDeactivateToolsCommand(args) {
  if (!args || args.length === 0 || args[0] === 'all') {
    return deactivateAllTools();
  }
  
  // Deactivate specific tools
  const results = {};
  for (const toolName of args) {
    results[toolName] = toolActivator.deactivateTool(toolName);
  }
  
  return {
    count: args.length,
    details: results
  };
}

/**
 * Main command handler
 */
export function handleToolsCommand(command, args) {
  switch (command) {
    case 'activate':
      return handleActivateToolsCommand(args);
    case 'deactivate':
      return handleDeactivateToolsCommand(args);
    case 'status':
      return getToolsStatus();
    case 'check':
      return checkMcpToolsInitialization();
    default:
      return {
        error: `Unknown command: ${command}`,
        availableCommands: ['activate', 'deactivate', 'status', 'check']
      };
  }
}

// If this script is run directly, activate all tools
if (import.meta.url === `file://${process.argv[1]}`) {
  activateAllTools();
}