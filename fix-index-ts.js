import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fix the index.ts file
const indexPath = path.join(__dirname, 'src', 'index.ts');
let content = fs.readFileSync(indexPath, 'utf8');

// Find the beginning of the switch statement
const switchStartRegex = /server\.registerTool\(\{[\s\S]*?handler: async \(\{ name, args \}\) => \{[\s\S]*?try \{[\s\S]*?switch \(name\) \{/;
const switchStartMatch = content.match(switchStartRegex);

if (switchStartMatch) {
  // Get the position of the switch statement
  const switchStartPos = switchStartMatch.index + switchStartMatch[0].length;
  
  // Get the content after the switch statement
  const afterSwitch = content.substring(switchStartPos);
  
  // Fix the case statements
  let fixedAfterSwitch = afterSwitch
    // Fix case statements to have proper braces
    .replace(/case "([^"]+)":/g, 'case "$1": {')
    // Fix the end of each case block
    .replace(/return \{[\s\S]*?\};(\s+)(?=case|default)/g, (match, spacing) => `return {\n${match.substring(7, match.length - spacing.length)}\n      }${spacing}`)
    // Fix the default case
    .replace(/default:/g, 'default: {')
    // Fix the end of the switch statement
    .replace(/\}(\s+)\} catch \(error\)/g, '      }\n    }\n  } catch (error)')
    // Fix any remaining issues with nested braces
    .replace(/\}\s+\}\s+\}\s+\}\);/g, '      }\n    }\n  }\n});');
  
  // Reconstruct the file
  const newContent = content.substring(0, switchStartPos) + fixedAfterSwitch;
  
  // Write the fixed content back to the file
  fs.writeFileSync(indexPath, newContent);
  
  console.log('Fixed index.ts file!');
} else {
  console.error('Could not find the switch statement in index.ts');
}