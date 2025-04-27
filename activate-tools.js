#!/usr/bin/env node
/**
 * Command line script to activate OptimusCode MCP tools
 */

import { activateAllTools, deactivateAllTools, getToolsStatus, handleToolsCommand } from './src/activateAutomatedTools.js';

// Process command line arguments
const args = process.argv.slice(2);
const command = args.length > 0 ? args[0] : 'activate';
const commandArgs = args.slice(1);

// Execute the requested command
try {
  const result = handleToolsCommand(command, commandArgs);
  console.log(JSON.stringify(result, null, 2));
  
  if (result.error) {
    process.exit(1);
  }
} catch (error) {
  console.error('Error executing command:', error);
  process.exit(1);
}
