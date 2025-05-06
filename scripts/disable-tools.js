// Script to disable AutoContinue and ChatInitiator tools
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the configuration file
const configPath = path.join(__dirname, '..', 'ocioconfig.json');

try {
    // Read the current configuration
    const configData = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(configData);
    
    // Disable AutoContinue and ChatInitiator
    if (config.mcp && config.mcp.tools) {
        if (config.mcp.tools.AutoContinue) {
            console.log('Disabling AutoContinue tool...');
            config.mcp.tools.AutoContinue.autoMode = false;
        }
        
        if (config.mcp.tools.ChatInitiator) {
            console.log('Disabling ChatInitiator tool...');
            config.mcp.tools.ChatInitiator.autoMode = false;
        }
    }
    
    // Write the updated configuration back to the file
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
    console.log('Tools successfully disabled in the configuration.');
} catch (error) {
    console.error('Error updating configuration:', error);
    process.exit(1);
}
