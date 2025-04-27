/**
 * Base class for all automated tools
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
   */
  enable() {
    this.isActive = true;
    return this;
  }

  /**
   * Disable the tool
   */
  disable() {
    this.isActive = false;
    return this;
  }

  /**
   * Check if the tool is active
   * @returns {boolean} - True if active, false otherwise
   */
  isEnabled() {
    return this.isActive;
  }

  /**
   * Process method to be implemented by subclasses
   * @param {Object} context - The context object
   */
  process(context) {
    throw new Error('Method not implemented');
  }
}
