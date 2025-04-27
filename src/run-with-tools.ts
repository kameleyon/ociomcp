/**
 * Wrapper for OptimusCode MCP server that activates all tools on startup
 */
import './index.js';
import { activateAllTools } from './activateAutomatedTools.js';

// Initialize and activate all configured tools
console.error("Activating configured tools...");

try {
  const activationResult = activateAllTools();
  console.error(`Tools activation complete: ${activationResult.success} succeeded, ${activationResult.failure} failed`);
} catch (error) {
  console.error(`Error activating tools: ${error}`);
}

// Main process continues from index.js with tools activated
