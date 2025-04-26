/**
 * ImportFixer - Automated tool to fix JavaScript imports by adding .js extensions
 * This tools runs automatically when files are changed or on demand
 */

import fs from 'fs';
import path from 'path';
import { logger } from '../../utils/logger.js';

export class ImportFixer {
  constructor() {
    this.enabled = true;
    this.config = {
      directory: './dist', // Default directory to scan
      logFile: 'fix-imports-log.txt', // Default log file
      dryRun: false // Default to actually make changes
    };
    
    logger.info('ImportFixer tool initialized');
  }

  /**
   * Enable the tool
   */
  enable() {
    this.enabled = true;
    logger.info('ImportFixer tool enabled');
  }

  /**
   * Disable the tool
   */
  disable() {
    this.enabled = false;
    logger.info('ImportFixer tool disabled');
  }

  /**
   * Set the directory to scan
   * @param {string} directory - Directory path
   */
  setDirectory(directory) {
    this.config.directory = directory;
  }

  /**
   * Set the log file path
   * @param {string} logFile - Path to log file
   */
  setLogFile(logFile) {
    this.config.logFile = logFile;
  }

  /**
   * Set dry run mode
   * @param {boolean} dryRun - Whether to run in dry run mode
   */
  setDryRun(dryRun) {
    this.config.dryRun = dryRun;
  }

  /**
   * Run the ImportFixer tool
   * @param {Object} options - Override options for this run
   * @returns {Promise<Object>} - Results of the operation
   */
  async run(options = {}) {
    if (!this.enabled) {
      return { success: false, message: 'ImportFixer tool is disabled' };
    }

    // Merge runtime options with config
    const runConfig = {
      ...this.config,
      ...options
    };

    logger.info(`Running ImportFixer on directory: ${runConfig.directory}`);
    
    try {
      // Call the MCP tool implementation from filesystem/import-fixer.js
      // This is a simplified version as the actual execution would call the tool handler
      const result = await this.executeImportFixer(runConfig);
      return result;
    } catch (error) {
      logger.error(`ImportFixer error: ${error.message}`);
      return {
        success: false,
        message: `Failed to fix imports: ${error.message}`
      };
    }
  }

  /**
   * Execute the ImportFixer tool via MCP handler
   * @param {Object} config - Tool configuration
   * @returns {Promise<Object>} - Tool execution results
   */
  async executeImportFixer(config) {
    // In a real implementation, this would call the handleImportFixer function
    // For now, we'd use a mock implementation
    logger.info('Calling ImportFixer MCP handler');
    
    // Import the handler when needed
    try {
      const { handleImportFixer } = await import('../../filesystem/handlers.js');
      return await handleImportFixer(config);
    } catch (error) {
      logger.error(`Error calling ImportFixer handler: ${error.message}`);
      throw error;
    }
  }

  /**
   * Run the ImportFixer automatically on file changes
   * @param {string} filePath - Path of changed file
   * @returns {Promise<void>}
   */
  async onFileChanged(filePath) {
    if (!this.enabled) return;
    
    // Only run on JavaScript files
    if (!filePath.endsWith('.js')) return;
    
    // Get the directory of the changed file
    const directory = path.dirname(filePath);
    
    logger.info(`File changed: ${filePath}, running ImportFixer on ${directory}`);
    
    // Run the fixer on the directory containing the changed file
    await this.run({ directory });
  }
}