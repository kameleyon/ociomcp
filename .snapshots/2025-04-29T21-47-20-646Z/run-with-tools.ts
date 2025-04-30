// Auto-generated safe fallback for content-generator

export function activate() {
    console.log("[TOOL] content-generator activated (passive mode)");
}

export function onFileWrite() { /* no-op */ }
export function onSessionStart() { /* no-op */ }
export function onCommand() { /* no-op */ }

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
