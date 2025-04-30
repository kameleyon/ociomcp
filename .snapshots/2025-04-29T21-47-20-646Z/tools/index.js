/**
 * Tools Module Index
 * 
 * Centralizes all tool exports and provides activation functionality
 */

// Import all tool modules
import * as AdvancedFeatures from './advanced-features/index.ts';
import * as ApiDependent from './api-dependent/index.ts';
import * as AutomatedTools from './automated-tools/index.ts';
import * as Command from './command/index.ts';
import * as ContextManagement from './context-management/index.ts';
import * as DatabaseAPI from './database-api/index.ts';
import * as Documentation from './documentation/index.ts';
import * as Filesystem from './filesystem/index.ts';
import * as Persistence from './persistence/index.ts';
import * as ProjectOrganization from './project-organization/index.ts';
import * as ProjectPlanning from './project-planning/index.ts';
import * as TestingQuality from './testing-quality/index.ts';
import * as UIGeneration from './ui-generation/index.ts';

// Export all tools
export {
  AdvancedFeatures,
  ApiDependent,
  AutomatedTools,
  Command,
  ContextManagement,
  DatabaseAPI,
  Documentation,
  Filesystem,
  Persistence,
  ProjectOrganization,
  ProjectPlanning,
  TestingQuality,
  UIGeneration
};

// Create an array of all tool modules for event broadcasting
const allTools = [
  AdvancedFeatures,
  ApiDependent,
  AutomatedTools,
  Command,
  ContextManagement,
  DatabaseAPI,
  Documentation,
  Filesystem,
  Persistence,
  ProjectOrganization,
  ProjectPlanning,
  TestingQuality,
  UIGeneration
];

// Export tool activation function
export const activateTools = async (settings = {}) => {
  console.log('[Tools] Activating all tools...');
  
  const results = {};
  
  for (const toolModule of allTools) {
    if (typeof toolModule.activate === 'function') {
      try {
        const moduleName = Object.keys(toolModule)[0] || 'unknown';
        await toolModule.activate(settings);
        results[moduleName] = 'success';
      } catch (error) {
        const moduleName = Object.keys(toolModule)[0] || 'unknown';
        console.error(`[Tools] Failed to activate ${moduleName}:`, error);
        results[moduleName] = 'failed';
      }
    }
  }
  
  console.log('[Tools] Tool activation results:', results);
  return results;
};

// Export event broadcasting functions
export const broadcastSessionStart = (session) => {
  for (const toolModule of allTools) {
    try {
      if (typeof toolModule.onSessionStart === 'function') {
        toolModule.onSessionStart(session);
      }
    } catch (error) {
      console.warn(`[Tools] Error in onSessionStart for tool: ${error.message}`);
    }
  }
};

export const broadcastFileWrite = (event) => {
  for (const toolModule of allTools) {
    try {
      if (typeof toolModule.onFileWrite === 'function') {
        toolModule.onFileWrite(event);
      }
    } catch (error) {
      console.warn(`[Tools] Error in onFileWrite for tool: ${error.message}`);
    }
  }
};

export const broadcastCommand = (command) => {
  for (const toolModule of allTools) {
    try {
      if (typeof toolModule.onCommand === 'function') {
        toolModule.onCommand(command);
      }
    } catch (error) {
      console.warn(`[Tools] Error in onCommand for tool: ${error.message}`);
    }
  }
};