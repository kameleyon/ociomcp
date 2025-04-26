import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fix the icon-manager.ts file
const iconManagerPath = path.join(__dirname, 'src', 'ui-generation', 'icon-manager.ts');
let content = fs.readFileSync(iconManagerPath, 'utf8');

// Replace the for loop with Array.from to avoid using Map.entries() iterator
content = content.replace(
  /for \(const entry of iconFiles\.entries\(\)\) {(\s+)const filePath = entry\[0\];(\s+)const content = entry\[1\];/g,
  'Array.from(iconFiles.entries()).forEach(([filePath, content]) => {'
);

// Replace the closing bracket of the for loop
content = content.replace(
  /await fs\.writeFile\(fullPath, content\);(\s+)}/g,
  'await fs.writeFile(fullPath, content);\n        });'
);

// Fix template string issues
content = content.replace(
  /console\.warn\("Invalid SVG for icon " \+ props\.name\);/g,
  'console.warn("Invalid SVG for icon " + props.name);'
);

content = content.replace(
  /return typeof props\.size === 'number' \? props\.size \+ 'px' : props\.size;/g,
  "return typeof props.size === 'number' ? props.size + 'px' : props.size;"
);

fs.writeFileSync(iconManagerPath, content);

// Fix the handlers.ts file if it exists
const handlersPath = path.join(__dirname, 'src', 'ui-generation', 'icon-manager', 'handlers.ts');
if (fs.existsSync(handlersPath)) {
  let handlersContent = fs.readFileSync(handlersPath, 'utf8');
  
  // Replace the for loop with Array.from to avoid using Map.entries() iterator
  handlersContent = handlersContent.replace(
    /for \(const entry of iconFiles\.entries\(\)\) {(\s+)const filePath = entry\[0\];(\s+)const content = entry\[1\];/g,
    'Array.from(iconFiles.entries()).forEach(([filePath, content]) => {'
  );
  
  // Replace the closing bracket of the for loop
  handlersContent = handlersContent.replace(
    /await fs\.writeFile\(fullPath, content\);(\s+)}/g,
    'await fs.writeFile(fullPath, content);\n        });'
  );
  
  fs.writeFileSync(handlersPath, handlersContent);
}

// Update tsconfig.json to use ES2020 target
const tsconfigPath = path.join(__dirname, 'tsconfig.json');
let tsconfigContent = fs.readFileSync(tsconfigPath, 'utf8');
tsconfigContent = tsconfigContent.replace(
  /"target": "ES2020"/,
  '"target": "ES2022"'
);
fs.writeFileSync(tsconfigPath, tsconfigContent);

// Update src/tsconfig.json to use ES2020 target
const srcTsconfigPath = path.join(__dirname, 'src', 'tsconfig.json');
let srcTsconfigContent = fs.readFileSync(srcTsconfigPath, 'utf8');
srcTsconfigContent = srcTsconfigContent.replace(
  /"target": "ES2020"/,
  '"target": "ES2022"'
);
fs.writeFileSync(srcTsconfigPath, srcTsconfigContent);

console.log('TypeScript errors fixed!');