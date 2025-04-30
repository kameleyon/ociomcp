/**
 * Base class for all automated tools in OptimusCode MCP
 * Automated tools are always active and perform operations automatically
 */
export class BaseAutomatedTool {
  constructor(name, description) {
    this.name = name;
    this.description = description;
    this.isActive = true;
  }

  /**
   * Enable the tool
   * @returns {BaseAutomatedTool} this instance for chaining
   */
  enable() {
    this.isActive = true;
    return this;
  }

  /**
   * Disable the tool
   * @returns {BaseAutomatedTool} this instance for chaining
   */
  disable() {
    this.isActive = false;
    return this;
  }

  /**
   * Check if the tool is currently active
   * @returns {boolean} true if active, false otherwise
   */
  isEnabled() {
    return this.isActive;
  }

  /**
   * Process method to be implemented by subclasses
   * This is called automatically by the system
   * @param {Object} context - The context object containing conversation and project state
   */
  process(context) {
    throw new Error(`${this.name}: process() method not implemented`);
  }
}
