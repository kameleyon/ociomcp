/**
 * TypeScriptErrorFixer - Automated tool to fix common TypeScript errors
 * This tool runs automatically on compiled files or on demand
 */

import fs from 'fs';
import path from 'path';
import { logger } from '../../utils/logger.js';

export class TypeScriptErrorFixer {
  constructor() {
    this.enabled = true;
    this.config = {
      targetFiles: [], // If empty, runs on all known problematic files
      fixAll: true,    // Fix all known issues by default
      dryRun: false    // Default to actually make changes
    };
    
    logger.info('TypeScriptErrorFixer tool initialized');
  }

  /**
   * Enable the tool
   */
  enable() {
    this.enabled = true;
    logger.info('TypeScriptErrorFixer tool enabled');
  }

  /**
   * Disable the tool
   */
  disable() {
    this.enabled = false;
    logger.info('TypeScriptErrorFixer tool disabled');
  }

  /**
   * Set specific files to fix
   * @param {string[]} files - Array of file paths
   */
  setTargetFiles(files) {
    this.config.targetFiles = Array.isArray(files) ? files : [];
  }

  /**
   * Set whether to fix all issues
   * @param {boolean} fixAll - Whether to fix all issues
   */
  setFixAll(fixAll) {
    this.config.fixAll = fixAll;
  }

  /**
   * Set dry run mode
   * @param {boolean} dryRun - Whether to run in dry run mode
   */
  setDryRun(dryRun) {
    this.config.dryRun = dryRun;
  }

  /**
   * Run the TypeScriptErrorFixer tool
   * @param {Object} options - Override options for this run
   * @returns {Promise<Object>} - Results of the operation
   */
  async run(options = {}) {
    if (!this.enabled) {
      return { success: false, message: 'TypeScriptErrorFixer tool is disabled' };
    }

    // Merge runtime options with config
    const runConfig = {
      ...this.config,
      ...options
    };

    const targetDesc = runConfig.targetFiles.length > 0 
      ? `files: ${runConfig.targetFiles.join(', ')}` 
      : 'all known problematic files';
    
    logger.info(`Running TypeScriptErrorFixer on ${targetDesc}`);
    
    try {
      // Call the MCP tool implementation from filesystem/typescript-error-fixer.js
      // This is a simplified version as the actual execution would call the tool handler
      const result = await this.executeTypeScriptErrorFixer(runConfig);
      return result;
    } catch (error) {
      logger.error(`TypeScriptErrorFixer error: ${error.message}`);
      return {
        success: false,
        message: `Failed to fix TypeScript errors: ${error.message}`
      };
    }
  }

  /**
   * Execute the TypeScriptErrorFixer tool via MCP handler
   * @param {Object} config - Tool configuration
   * @returns {Promise<Object>} - Tool execution results
   */
  async executeTypeScriptErrorFixer(config) {
    // In a real implementation, this would call the handleTypeScriptErrorFixer function
    // For now, we'd use a mock implementation
    logger.info('Calling TypeScriptErrorFixer MCP handler');
    
    // Import the handler when needed
    try {
      const { handleTypeScriptErrorFixer } = await import('../../filesystem/handlers.js');
      return await handleTypeScriptErrorFixer(config);
    } catch (error) {
      logger.error(`Error calling TypeScriptErrorFixer handler: ${error.message}`);
      throw error;
    }
  }

  /**
   * Run the TypeScriptErrorFixer automatically on build/compile events
   * @param {Object} buildResult - Build result object with potentially problematic files
   * @returns {Promise<void>}
   */
  async onBuildComplete(buildResult) {
    if (!this.enabled) return;
    
    // If there are TypeScript errors in the build result, run the fixer
    if (buildResult?.errors?.length > 0) {
      const fileSet = new Set();
      
      // Extract file paths from errors
      buildResult.errors.forEach(error => {
        if (error.file) fileSet.add(error.file);
      });
      
      const filesToFix = Array.from(fileSet);
      
      if (filesToFix.length > 0) {
        logger.info(`Build has TypeScript errors, running fixer on ${filesToFix.length} files`);
        await this.run({ targetFiles: filesToFix });
      }
    }
  }

  /**
   * Run the TypeScriptErrorFixer on a newly created TypeScript file
   * @param {string} filePath - Path to new TypeScript file
   * @returns {Promise<void>}
   */
  async onFileCreated(filePath) {
    if (!this.enabled) return;
    
    // Only run on TypeScript files
    if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) return;
    
    logger.info(`New TypeScript file created: ${filePath}, running fixer`);
    
    // Run the fixer on the new file
    await this.run({ targetFiles: [filePath] });
  }
}