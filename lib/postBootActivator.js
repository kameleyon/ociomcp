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
// Utility to load a config file
const loadConfigFile = (filePath) => {
    try {
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(content);
        }
    }
    catch (error) {
        console.error(`[POST-BOOT ACTIVATOR] Error loading config file ${filePath}:`, error);
    }
    return null;
};
// Merge tool configs from multiple sources
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
    if (ocioConfig && ocioConfig.mcp && ocioConfig.mcp.tools) {
        Object.entries(ocioConfig.mcp.tools).forEach(([toolName, toolConfig]) => {
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
            }
            else if (!mergedTools[toolName]) {
                // Add new tool
                mergedTools[toolName] = {
                    enabled: toolConfig.autoMode === true,
                    settings: toolConfig.preferences || {}
                };
            }
        });
    }
    return mergedTools;
};
// Try to dynamically import a tool module
const importToolModule = async (toolName) => {
    try {
        const modulePath = path.join(process.cwd(), 'tools', toolName);
        return await import(modulePath);
    }
    catch (error) {
        throw new Error(`Failed to import tool module: ${error}`);
    }
};
// Activate a single tool
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
        }
        else {
            console.log(`⚠️ No activate() found — fallback passive mode enabled.`);
            return {
                toolName,
                status: 'Fallback',
                message: 'No activate() function found; fallback passive mode started'
            };
        }
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`❌ Activation failed - Error: ${errorMessage}`);
        return {
            toolName,
            status: 'Failed',
            message: `Activation failed: ${errorMessage}`
        };
    }
};
// Generate a summary table of activation results
const generateSummaryTable = (results) => {
    const header = 'Tool Name         | Status';
    const separator = '------------------|----------------';
    const rows = results.map(result => {
        const paddedName = result.toolName.padEnd(18);
        return `${paddedName} | ${result.status}`;
    });
    return [header, separator, ...rows].join('\n');
};
// Main activation function
export const activateTools = async () => {
    console.log('[POST-BOOT ACTIVATOR] Starting tool activation...');
    // Load merged configuration
    const toolsConfig = mergeToolConfigs();
    // Collect activation results
    const results = [];
    // Activate each enabled tool
    for (const [toolName, toolConfig] of Object.entries(toolsConfig)) {
        if (toolConfig.enabled) {
            const result = await activateTool(toolName, toolConfig.settings);
            results.push(result);
        }
    }
    // Print summary table
    console.log('[POST-BOOT ACTIVATOR] Activation Summary:');
    console.log(generateSummaryTable(results));
    return results;
};
// Function to trigger activation after server boot
export const setupPostBootActivation = () => {
    // Use setTimeout to ensure this runs after server is fully started
    // This postpones execution until the next event loop iteration
    setTimeout(() => {
        activateTools().catch(error => {
            console.error('[POST-BOOT ACTIVATOR] Error during tool activation:', error);
        });
    }, 0);
};
// Export a function that can be called to manually trigger activation
export const manuallyTriggerActivation = async () => {
    return await activateTools();
};
//# sourceMappingURL=postBootActivator.js.map