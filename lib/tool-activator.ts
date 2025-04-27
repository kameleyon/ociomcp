import { getTool, initializeConfiguredTools } from './configured-tools';
import { loadToolsConfig } from './tools-config';

/**
 * Tool activation status
 */
type ToolActivationStatus = {
  toolName: string;
  active: boolean;
  error?: string;
  timestamp: number;
};

/**
 * Class responsible for activating and deactivating tools
 */
export class ToolActivator {
  private activeTools: Map<string, ToolActivationStatus> = new Map();
  private activationTimers: Map<string, NodeJS.Timeout> = new Map();
  private isInitialized = false;

  /**
   * Initialize the activator
   */
  initialize(): void {
    if (this.isInitialized) {
      return;
    }

    console.log('Initializing tool activator...');
    initializeConfiguredTools();
    this.isInitialized = true;
  }

  /**
   * Activate a specific tool
   * @param toolName Name of the tool to activate
   * @returns Activation status
   */
  activateTool(toolName: string): ToolActivationStatus {
    if (!this.isInitialized) {
      this.initialize();
    }

    const tool = getTool(toolName);
    if (!tool) {
      const status: ToolActivationStatus = {
        toolName,
        active: false,
        error: `Tool ${toolName} is not available or not enabled in configuration`,
        timestamp: Date.now()
      };
      this.activeTools.set(toolName, status);
      return status;
    }

    try {
      // Call the tool's activate method if it has one
      if (typeof (tool as any).activate === 'function') {
        (tool as any).activate();
      }

      const status: ToolActivationStatus = {
        toolName,
        active: true,
        timestamp: Date.now()
      };
      this.activeTools.set(toolName, status);

      // Some tools may have an auto-deactivation feature
      if (typeof (tool as any).getDeactivationTimeout === 'function') {
        const timeout = (tool as any).getDeactivationTimeout();
        if (timeout && timeout > 0) {
          this.scheduleDeactivation(toolName, timeout);
        }
      }

      console.log(`Tool ${toolName} activated successfully`);
      return status;
    } catch (error) {
      const status: ToolActivationStatus = {
        toolName,
        active: false,
        error: `Failed to activate tool ${toolName}: ${error}`,
        timestamp: Date.now()
      };
      this.activeTools.set(toolName, status);
      console.error(status.error);
      return status;
    }
  }

  /**
   * Deactivate a specific tool
   * @param toolName Name of the tool to deactivate
   * @returns Deactivation status
   */
  deactivateTool(toolName: string): ToolActivationStatus {
    const tool = getTool(toolName);
    if (!tool) {
      const status: ToolActivationStatus = {
        toolName,
        active: false,
        timestamp: Date.now()
      };
      this.activeTools.set(toolName, status);
      return status;
    }

    try {
      // Call the tool's deactivate method if it has one
      if (typeof (tool as any).deactivate === 'function') {
        (tool as any).deactivate();
      }

      // Clear any scheduled deactivation
      if (this.activationTimers.has(toolName)) {
        clearTimeout(this.activationTimers.get(toolName)!);
        this.activationTimers.delete(toolName);
      }

      const status: ToolActivationStatus = {
        toolName,
        active: false,
        timestamp: Date.now()
      };
      this.activeTools.set(toolName, status);
      console.log(`Tool ${toolName} deactivated successfully`);
      return status;
    } catch (error) {
      const status: ToolActivationStatus = {
        toolName,
        active: false,
        error: `Error during deactivation of ${toolName}: ${error}`,
        timestamp: Date.now()
      };
      this.activeTools.set(toolName, status);
      console.error(status.error);
      return status;
    }
  }

  /**
   * Schedule automatic deactivation of a tool
   */
  private scheduleDeactivation(toolName: string, timeoutMs: number): void {
    // Clear any existing timer
    if (this.activationTimers.has(toolName)) {
      clearTimeout(this.activationTimers.get(toolName)!);
    }

    // Set new timer
    const timer = setTimeout(() => {
      console.log(`Auto-deactivating tool ${toolName} after timeout`);
      this.deactivateTool(toolName);
    }, timeoutMs);

    this.activationTimers.set(toolName, timer);
  }

  /**
   * Activate all enabled tools
   * @returns Map of activation statuses
   */
  activateAllTools(): Map<string, ToolActivationStatus> {
    if (!this.isInitialized) {
      this.initialize();
    }

    const config = loadToolsConfig();
    const results = new Map<string, ToolActivationStatus>();

    console.log('Activating all enabled tools...');
    for (const [toolName, toolConfig] of Object.entries(config.tools)) {
      if (toolConfig.enabled) {
        const status = this.activateTool(toolName);
        results.set(toolName, status);
      }
    }

    return results;
  }

  /**
   * Deactivate all currently active tools
   * @returns Map of deactivation statuses
   */
  deactivateAllTools(): Map<string, ToolActivationStatus> {
    const results = new Map<string, ToolActivationStatus>();

    console.log('Deactivating all active tools...');
    for (const [toolName, status] of this.activeTools.entries()) {
      if (status.active) {
        const newStatus = this.deactivateTool(toolName);
        results.set(toolName, newStatus);
      }
    }

    return results;
  }

  /**
   * Get activation status of all tools
   * @returns Map of tool activation statuses
   */
  getActivationStatus(): Map<string, ToolActivationStatus> {
    return new Map(this.activeTools);
  }

  /**
   * Check if a specific tool is active
   * @param toolName Name of the tool to check
   * @returns True if the tool is active
   */
  isToolActive(toolName: string): boolean {
    return this.activeTools.get(toolName)?.active || false;
  }

  /**
   * Get a list of all currently active tools
   * @returns Array of active tool names
   */
  getActiveTools(): string[] {
    return Array.from(this.activeTools.entries())
      .filter(([_, status]) => status.active)
      .map(([name, _]) => name);
  }
}

// Export a singleton instance
export const toolActivator = new ToolActivator();

// Convenience function to activate all tools
export function activateAllTools(): Map<string, ToolActivationStatus> {
  return toolActivator.activateAllTools();
}

// Convenience function to deactivate all tools
export function deactivateAllTools(): Map<string, ToolActivationStatus> {
  return toolActivator.deactivateAllTools();
}
