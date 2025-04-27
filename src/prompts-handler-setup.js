// Quick script to update the prompts/list handler
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const indexPath = path.join(__dirname, 'index.ts');

try {
  // Read the current content
  let content = fs.readFileSync(indexPath, 'utf8');
  
  // Add the import if it's not there
  if (!content.includes('import { handleListPrompts } from "./prompts-handler.js"')) {
    content = content.replace(
      'import { ComponentStyle } from \'./ui-generation/component-templates.js\';',
      'import { ComponentStyle } from \'./ui-generation/component-templates.js\';\nimport { handleListPrompts } from "./prompts-handler.js";'
    );
  }
  
  // Update the prompts/list handler
  content = content.replace(
    'server.setRequestHandler(ListPromptsRequestSchema, async () => {\n  return {\n    prompts: [],\n  };\n});',
    'server.setRequestHandler(ListPromptsRequestSchema, async () => {\n  return await handleListPrompts();\n});'
  );
  
  // Write the content back
  fs.writeFileSync(indexPath, content, 'utf8');
  console.log('Successfully updated prompts/list handler');
} catch (error) {
  console.error('Error updating prompts/list handler:', error);
}
