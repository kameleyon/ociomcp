#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import os from 'os';
import { execSync } from 'child_process';

// Determine the config file path based on the OS
function getConfigPath() {
  const homedir = os.homedir();
  
  switch (process.platform) {
    case 'darwin': // macOS
      return path.join(homedir, 'Library/Application Support/Claude/claude_desktop_config.json');
    case 'win32': // Windows
      return path.join(process.env.APPDATA || path.join(homedir, 'AppData/Roaming'), 'Claude/claude_desktop_config.json');
    case 'linux': // Linux
      return path.join(homedir, '.config/Claude/claude_desktop_config.json');
    default:
      throw new Error(`Unsupported platform: ${process.platform}`);
  }
}

// Main setup function
async function setup() {
  try {
    console.log('Setting up OptimusCode MCP for Claude Desktop...');
    
    // Get the path to the config file
    const configPath = getConfigPath();
    console.log(`Config file path: ${configPath}`);
    
    // Check if the config file exists
    let config = { mcpServers: {} };
    try {
      if (fs.existsSync(configPath)) {
        const configData = fs.readFileSync(configPath, 'utf8');
        config = JSON.parse(configData);
        console.log('Existing Claude config found');
      } else {
        console.log('No existing Claude config found, creating new one');
        // Ensure the directory exists
        fs.mkdirSync(path.dirname(configPath), { recursive: true });
      }
    } catch (error) {
      console.error(`Error reading config file: ${error.message}`);
      console.log('Creating new config file');
    }
    
    // Ensure mcpServers exists
    if (!config.mcpServers) {
      config.mcpServers = {};
    }
    
    // Add our server to the config
    config.mcpServers['optimuscode'] = {
      command: 'npx',
      args: [
        '-y',
        '@optimuscode/mcp'
      ]
    };
    
    // Write the updated config back to the file
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
    console.log('Updated Claude config with OptimusCode MCP server');
    
    console.log('\nSetup complete! Please restart Claude Desktop if it is running.');
    console.log('\nTo use OptimusCode MCP, open Claude Desktop and look for the "optimuscode" server in the MCP servers list.');
    
  } catch (error) {
    console.error(`Setup failed: ${error.message}`);
    process.exit(1);
  }
}

// Run the setup
setup().catch(error => {
  console.error(`Unhandled error: ${error.message}`);
  process.exit(1);
});