import fs from 'fs';
import path from 'path';

/**
 * Interface for tool configuration
 */
interface ToolConfig {
  enabled: boolean;
  settings: Record<string, any>;
}

/**
 * Interface for the entire tools configuration file
 */
interface ToolsConfig {
  tools: Record<string, ToolConfig>;
}

/**
 * Loads tool configuration from the config file
 */
export function loadToolsConfig(): ToolsConfig {
  try {
    const configPath = path.join(process.cwd(), 'tools-config.json');
    const configFile = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(configFile) as ToolsConfig;
  } catch (error) {
    console.error('Error loading tools configuration:', error);
    // Return default empty config if file cannot be read
    return { tools: {} };
  }
}

/**
 * Gets configuration for a specific tool
 * @param toolName Name of the tool to get configuration for
 */
export function getToolConfig(toolName: string): ToolConfig | null {
  const config = loadToolsConfig();
  return config.tools[toolName] || null;
}

/**
 * Checks if a tool is enabled
 * @param toolName Name of the tool to check
 */
export function isToolEnabled(toolName: string): boolean {
  const toolConfig = getToolConfig(toolName);
  return toolConfig?.enabled || false;
}

/**
 * Gets settings for a specific tool
 * @param toolName Name of the tool to get settings for
 */
export function getToolSettings(toolName: string): Record<string, any> | null {
  const toolConfig = getToolConfig(toolName);
  return toolConfig?.settings || null;
}

/**
 * Applies tool configuration to a specific tool instance
 * @param toolName Name of the tool
 * @param toolInstance Instance of the tool to configure
 */
export function applyToolConfig<T>(toolName: string, toolInstance: T): T {
  const settings = getToolSettings(toolName);
  if (settings && toolInstance) {
    // Apply settings to the tool instance
    return { ...toolInstance, ...settings };
  }
  return toolInstance;
}

/**
 * Gets all enabled tools with their settings
 */
export function getEnabledTools(): { name: string; settings: Record<string, any> }[] {
  const config = loadToolsConfig();
  const enabledTools = Object.entries(config.tools)
    .filter(([_, toolConfig]) => toolConfig.enabled)
    .map(([toolName, toolConfig]) => ({
      name: toolName,
      settings: toolConfig.settings || {}
    }));
  return enabledTools;
}
