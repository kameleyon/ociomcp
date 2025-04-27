// Script to create folders for each tool in the dist/activatedTools directory
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// List of tools to create folders for
const tools = [
  'accessibility',
  'advanced-features',
  'api-dependent',
  'api-integration',
  'automated-tools',
  'command',
  'context',
  'context-management',
  'database-api',
  'dependency-management',
  'documentation',
  'filesystem',
  'functions',
  'hooks',
  'icon-library',
  'interactive-docs',
  'logging',
  'memory',
  'performance',
  'persistence',
  'plugin-system',
  'project-organization',
  'project-planning',
  'refactoring',
  'testing',
  'testing-quality',
  'ui-generation',
  'utils'
];

// Create folders and copy index.js files
for (const tool of tools) {
  const toolDir = path.join('dist', 'activatedTools', tool);
  const sourceIndexPath = path.join('dist', 'tools', tool, 'index.js');
  const destIndexPath = path.join(toolDir, 'index.js');

  // Create the directory if it doesn't exist
  if (!fs.existsSync(toolDir)) {
    console.log(`Creating directory: ${toolDir}`);
    fs.mkdirSync(toolDir, { recursive: true });
  }

  // Copy the index.js file if it exists
  if (fs.existsSync(sourceIndexPath)) {
    console.log(`Copying ${sourceIndexPath} to ${destIndexPath}`);
    fs.copyFileSync(sourceIndexPath, destIndexPath);
  } else {
    console.log(`Warning: ${sourceIndexPath} does not exist`);
    
    // Create a basic index.js file
    console.log(`Creating basic index.js in ${toolDir}`);
    const basicIndexContent = `/**
 * ${tool} Tool
 * 
 * Basic implementation for the ${tool} tool.
 */

/**
 * Activate function for ${tool}
 * Called by the post-boot activator
 * 
 * @param {Object} settings - Tool settings from configuration
 * @returns {Promise<boolean>} - Success status
 */
export async function activate(settings) {
  console.log(\`${tool} activating with settings:\`, settings);
  return true;
}

/**
 * Called when a session starts
 * 
 * @param {Object} session - Session information
 */
export function onSessionStart(session) {
  // Optional implementation
}

/**
 * Called when a file is written
 * 
 * @param {Object} event - File write event details
 */
export function onFileWrite(event) {
  // Optional implementation
}

/**
 * Called when a command is issued
 * 
 * @param {string} command - The command string
 */
export function onCommand(command) {
  // Optional implementation
}
`;
    fs.writeFileSync(destIndexPath, basicIndexContent);
  }
}

console.log('Tool folders created successfully!');