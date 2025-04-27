/**
 * Post-Boot Activation System for Tools
 * 
 * Dynamically imports and activates tools after the server has fully started.
 * - Reads enabled tools from configuration files
 * - Attempts to activate each tool via its module's activate() function
 * - Falls back to passive mode if no activate() function exists
 * - Logs activation status for all tools
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * @typedef {Object} ToolSettings
 * @property {boolean} enabled
 * @property {Object} [settings]
 */

/**
 * @typedef {Object} ToolsConfig
 * @property {Object.<string, ToolSettings>} tools
 */

/**
 * @typedef {Object} ActivationResult
 * @property {string} toolName
 * @property {'Activated'|'Fallback'|'Failed'} status
 * @property {string} [message]
 */

/**
 * Utility to load a config file
 * @param {string} filePath - Path to the config file
 * @returns {Object|null} - Parsed config or null
 */
const loadConfigFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.error(`[POST-BOOT ACTIVATOR] Error loading config file ${filePath}:`, error);
  }
  return null;
};

/**
 * Merge tool configs from multiple sources
 * @returns {Object.<string, ToolSettings>} - Merged tool settings
 */
const mergeToolConfigs = () => {
  const mergedTools = {};
  
  // Load tools-config.json
  const toolsConfigPath = path.join(process.cwd(), 'tools-config.json');
  const toolsConfig = loadConfigFile(toolsConfigPath);
  
  // Load ocioconfig.json
  const ocioConfigPath = path.join(process.cwd(), 'ocioconfig.json');
  const ocioConfig = loadConfigFile(ocioConfigPath);

  // Merge from tools-config.json
  if (toolsConfig && toolsConfig.tools) {
    Object.entries(toolsConfig.tools).forEach(([toolName, settings]) => {
      mergedTools[toolName] = { ...settings };
    });
  }

  // Merge from ocioconfig.json (if it has tools section)
  // Also merge any global settings that might affect tools
  if (ocioConfig) {
    // First check for any global activation settings in ocioconfig
    const globalConfig = ocioConfig.mcp || {};
    
    // Then merge specific tool configs
    if (globalConfig.tools) {
      Object.entries(globalConfig.tools).forEach(([toolName, toolConfig]) => {
      // If the tool is already in mergedTools, only update it if not yet enabled
      if (mergedTools[toolName] && !mergedTools[toolName].enabled) {
        if (toolConfig.autoMode === true) {
          mergedTools[toolName].enabled = true;
        }
        // Merge settings if they exist
        if (toolConfig.preferences) {
          mergedTools[toolName].settings = {
            ...(mergedTools[toolName].settings || {}),
            ...toolConfig.preferences
          };
        }
      } else if (!mergedTools[toolName]) {
        // Add new tool
        mergedTools[toolName] = {
          enabled: toolConfig.autoMode === true,
          settings: toolConfig.preferences || {}
        };
      }
    });
  }
  }
  return mergedTools;
};

/**
 * Try to dynamically import a tool module
 * @param {string} toolName - Name of the tool
 * @returns {Promise<Object>} - Imported module
 */
const importToolModule = async (toolName) => {
  try {
    // Create a file URL that works for Windows
    const modulePath = path.join(process.cwd(), 'tools', toolName, 'index.js');
    const moduleUrl = pathToFileURL(modulePath).href;
    
    return await import(moduleUrl);
  } catch (error) {
    throw new Error(`Failed to import tool module: ${error}`);
  }
};

/**
 * Activate a single tool
 * @param {string} toolName - Name of the tool
 * @param {Object} settings - Tool settings
 * @returns {Promise<ActivationResult>} - Activation result
 */
const activateTool = async (toolName, settings) => {
  console.log(`[POST-BOOT ACTIVATOR] Activating Tool: ${toolName}`);
  
  try {
    const toolModule = await importToolModule(toolName);
    
    if (typeof toolModule.activate === 'function') {
      await toolModule.activate(settings);
      console.log(`✅ Activated successfully.`);
      return {
        toolName,
        status: 'Activated',
        message: 'Activated successfully'
      };
    } else {
      console.log(`⚠️ No activate() found — fallback passive mode enabled.`);
      return {
        toolName,
        status: 'Fallback',
        message: 'No activate() function found; fallback passive mode started'
      };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`❌ Activation failed - Error: ${errorMessage}`);
    return {
      toolName,
      status: 'Failed',
      message: `Activation failed: ${errorMessage}`
    };
  }
};

/**
 * Generate a summary table of activation results
 * @param {ActivationResult[]} results - Activation results
 * @returns {string} - Formatted summary table
 */
const generateSummaryTable = (results) => {
  const header = 'Tool Name         | Status';
  const separator = '------------------|----------------';
  
  const rows = results.map(result => {
    const paddedName = result.toolName.padEnd(18);
    return `${paddedName} | ${result.status}`;
  });
  
  return [header, separator, ...rows].join('\n');
};

/**
 * Main activation function
 * @returns {Promise<ActivationResult[]>} - Activation results
 */
export const activateTools = async () => {
  console.log('[POST-BOOT ACTIVATOR] Starting tool activation...');
  
  try {
    // Load merged configuration
    const toolsConfig = mergeToolConfigs();
    
    // Collect activation results
    const results = [];
    
    // Only try to activate tools that actually exist
    const existingTools = [];
    const toolsDir = path.join(process.cwd(), 'tools');
    
    // Create tools directory if it doesn't exist
    if (!fs.existsSync(toolsDir)) {
      fs.mkdirSync(toolsDir, { recursive: true });
      console.log('[POST-BOOT ACTIVATOR] Created tools directory');
    }
    
    try {
      const toolDirs = fs.readdirSync(toolsDir);
      for (const dir of toolDirs) {
        if (fs.statSync(path.join(toolsDir, dir)).isDirectory()) {
          existingTools.push(dir);
        }
      }
    } catch (err) {
      console.error('[POST-BOOT ACTIVATOR] Error reading tools directory:', err);
    }
    
    console.log(`[POST-BOOT ACTIVATOR] Found ${existingTools.length} tool directories`);
    
    // Activate each enabled tool that actually exists
    for (const [toolName, toolConfig] of Object.entries(toolsConfig)) {
      if (toolConfig.enabled) {
        if (existingTools.includes(toolName)) {
          const result = await activateTool(toolName, toolConfig.settings);
          results.push(result);
        } else {
          // Tool is enabled but doesn't exist
          console.error(`❌ Tool ${toolName} is enabled but not found in the tools directory`);
          results.push({
            toolName,
            status: 'Failed',
            message: 'Tool directory not found'
          });
        }
      }
    }
    
    // Print summary table
    console.log('[POST-BOOT ACTIVATOR] Activation Summary:');
    console.log(generateSummaryTable(results));
    
    // Trigger resource refresh if function exists in global scope
    if (typeof global.refreshResources === 'function') {
      console.log('[POST-BOOT ACTIVATOR] Triggering system resource refresh...');
      try {
        await global.refreshResources();
        console.log('[POST-BOOT ACTIVATOR] Resource refresh complete');
      } catch (error) {
        console.error('[POST-BOOT ACTIVATOR] Error during resource refresh:', error);
      }
    }
    
    return results;
  } catch (error) {
    console.error('[POST-BOOT ACTIVATOR] Error during tool activation:', error);
    return [];
  }
};

/**
 * Function to trigger activation after server boot
 */
export const setupPostBootActivation = () => {
  // Use setTimeout to ensure this runs after server is fully started
  // This postpones execution until the next event loop iteration
  setTimeout(() => {
    activateTools().catch(error => {
      console.error('[POST-BOOT ACTIVATOR] Error during tool activation:', error);
    });
  }, 0);
};

/**
 * Export a function that can be called to manually trigger activation
 * @returns {Promise<ActivationResult[]>} - Activation results
 */
export const manuallyTriggerActivation = async () => {
  return await activateTools();
};
