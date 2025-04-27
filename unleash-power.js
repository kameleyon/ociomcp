#!/usr/bin/env node
/**
 * Command-line utility to unleash OptimusCode MCP power
 * 
 * This script activates all configured tools and updates settings 
 * for full power operation mode.
 */

import { activateAllTools } from './src/activateAutomatedTools.js';
import fs from 'fs';
import path from 'path';

console.log('🚀 Unleashing OptimusCode MCP Power!');
console.log('======================================');

// Check if tools-config.json exists
const configPath = path.join(process.cwd(), 'tools-config.json');
if (!fs.existsSync(configPath)) {
  console.error('Error: tools-config.json not found. Please run setup first.');
  process.exit(1);
}

// Load the config
console.log('📂 Loading tool configuration...');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Enable all tools
console.log('⚙️ Enabling all tools...');
let toolCount = 0;
for (const toolName in config.tools) {
  config.tools[toolName].enabled = true;
  toolCount++;
}

// Save the updated config
console.log('💾 Saving updated configuration...');
fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');

// Activate all tools
console.log('🔌 Activating all tools...');
try {
  const activationResult = activateAllTools();
  console.log(`✅ Tools activated: ${activationResult.success} succeeded, ${activationResult.failure} failed`);
} catch (error) {
  console.error(`❌ Error activating tools: ${error}`);
  process.exit(1);
}

console.log('');
console.log('✨✨✨ OptimusCode MCP POWER UNLEASHED! ✨✨✨');
console.log('All tools are now fully enabled and activated!');
console.log('');
