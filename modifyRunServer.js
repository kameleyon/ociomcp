import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const indexTsPath = path.join(__dirname, 'src', 'index.ts');
let content = fs.readFileSync(indexTsPath, 'utf8');

// Find the runServer function
const runServerRegex = /async function runServer\(\) \{[\s\S]+?console\.error\("Server connected successfully"\);(\s+)(\}\s+catch\s+\(error\)\s+\{)/;

const updated = content.replace(
  runServerRegex,
  'async function runServer() {\n  try {\n    console.error("Initializing OptimusCode MCP server...");\n    \n    // Initialize the session state manager\n    await sessionStateManager.initialize();\n    \n    // Use our custom FilteredStdioServerTransport\n    const transport = new FilteredStdioServerTransport();\n    \n    console.error("Connecting server...");\n    await server.connect(transport);\n    console.error("Server connected successfully");\n    \n    // Set up post-boot activation after the server has fully started\n    setupPostBootActivation();\n    console.error("Post-boot tool activation scheduled");\n$1$2'
);

// Save the file
fs.writeFileSync(indexTsPath, updated);

console.log('Successfully updated runServer function in index.ts');
