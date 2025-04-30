/**
 * Disable old snapshot tools to ensure we only use the new one
 * from the automated-tools directory
 */

import fs from 'fs';
import path from 'path';

const oldToolPaths = [
  'src/tools/functions/create_snapshot.js',
  'src/tools/tools/functions/create_snapshot.js'
];

async function disableOldTools() {
  console.log('[SNAPSHOT] Disabling old snapshot tools...');
  
  for (const toolPath of oldToolPaths) {
    try {
      // Check if the file exists
      if (fs.existsSync(toolPath)) {
        console.log(`[SNAPSHOT] Found old tool at ${toolPath}`);
        
        // Read the file content
        const content = fs.readFileSync(toolPath, 'utf8');
        
        // Create a backup
        const backupPath = `${toolPath}.bak`;
        fs.writeFileSync(backupPath, content);
        console.log(`[SNAPSHOT] Created backup at ${backupPath}`);
        
        // Replace the content with a disabled version
        const disabledContent = `// DISABLED: This snapshot tool has been replaced by src/tools/automated-tools/snapshot.ts
// Original file backed up at ${path.basename(toolPath)}.bak

export function activate() {
    console.log("[TOOL] ${path.basename(toolPath, '.js')} DISABLED - Using automated-tools/snapshot.ts instead");
}

export function onFileWrite() { /* disabled */ }
export function onSessionStart() { /* disabled */ }
export function onCommand() { /* disabled */ }
`;
        
        fs.writeFileSync(toolPath, disabledContent);
        console.log(`[SNAPSHOT] Disabled tool at ${toolPath}`);
      }
    } catch (err) {
      console.error(`[SNAPSHOT] Error processing ${toolPath}:`, err);
    }
  }
  
  console.log('[SNAPSHOT] Old tools disabled successfully');
}

// Run the function
disableOldTools().catch(err => {
  console.error('[SNAPSHOT] Failed to disable old tools:', err);
});