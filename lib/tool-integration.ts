import { isToolEnabled, getToolSettings, applyToolConfig } from './tools-config';

/**
 * Tool integration module
 * 
 * This module provides utilities for automatically applying tool configurations
 * to various modules throughout the application.
 */

/**
 * Type for a tool initialization function
 */
type ToolInitializer<T> = () => T;

/**
 * Initializes a tool with its configuration if enabled
 * 
 * @param toolName Name of the tool in the configuration
 * @param initializer Function that creates the default tool instance
 * @returns Configured tool instance or null if the tool is disabled
 */
export function initTool<T>(toolName: string, initializer: ToolInitializer<T>): T | null {
  if (!isToolEnabled(toolName)) {
    console.log(`Tool ${toolName} is disabled in configuration`);
    return null;
  }
  
  try {
    // Create the default instance
    const defaultInstance = initializer();
    
    // Apply configuration
    const configuredInstance = applyToolConfig(toolName, defaultInstance);
    
    console.log(`Tool ${toolName} initialized with configuration`);
    return configuredInstance;
  } catch (error) {
    console.error(`Failed to initialize tool ${toolName}:`, error);
    return null;
  }
}

/**
 * Tool registry for managing initialized tools
 */
class ToolRegistry {
  private tools: Map<string, any> = new Map();
  
  /**
   * Registers a tool in the registry
   * 
   * @param toolName Name of the tool
   * @param initializer Function that creates the default tool instance
   * @returns The registered tool instance or null if disabled/failed
   */
  register<T>(toolName: string, initializer: ToolInitializer<T>): T | null {
    const tool = initTool(toolName, initializer);
    
    if (tool) {
      this.tools.set(toolName, tool);
    }
    
    return tool;
  }
  
  /**
   * Gets a tool from the registry
   * 
   * @param toolName Name of the tool to retrieve
   * @returns The tool instance or null if not found
   */
  get<T>(toolName: string): T | null {
    return (this.tools.get(toolName) as T) || null;
  }
  
  /**
   * Checks if a tool exists in the registry
   * 
   * @param toolName Name of the tool to check
   * @returns True if the tool exists in the registry
   */
  has(toolName: string): boolean {
    return this.tools.has(toolName);
  }
  
  /**
   * Lists all registered tools
   * 
   * @returns Array of tool names
   */
  listTools(): string[] {
    return Array.from(this.tools.keys());
  }
  
  /**
   * Initializes multiple tools at once
   * 
   * @param toolDefinitions Map of tool names to initializers
   * @returns Object with initialized tools
   */
  registerBulk<T extends Record<string, any>>(toolDefinitions: Record<keyof T, ToolInitializer<any>>): Partial<T> {
    const result: Partial<T> = {} as Partial<T>;
    
    for (const [name, initializer] of Object.entries(toolDefinitions)) {
      const tool = this.register(name, initializer);
      if (tool) {
        (result as any)[name] = tool;
      }
    }
    
    return result;
  }
}

// Export a singleton instance of the registry
export const toolRegistry = new ToolRegistry();

// Helper function to create and register a tool factory
export function createToolFactory<T>(toolName: string, defaultConfig: Partial<T>) {
  return (...args: any[]) => {
    const defaultInstance = {
      ...defaultConfig,
      // Add any instance-specific properties based on args
    } as T;
    
    if (!isToolEnabled(toolName)) {
      return defaultInstance; // Return unconfigured instance if disabled
    }
    
    return applyToolConfig(toolName, defaultInstance);
  };
}