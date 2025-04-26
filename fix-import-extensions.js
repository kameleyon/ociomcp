/**
 * Script to fix import statements in JavaScript files by adding .js extensions
 * This fixes errors like: Cannot find module '...' imported from '...'
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a log file
const logStream = fs.createWriteStream('fix-imports-log.txt', { flags: 'w' });

// Helper function to log to both console and file
function log(message) {
  console.log(message);
  logStream.write(message + '\n');
}

// Helper function to log errors
function logError(message) {
  console.error(message);
  logStream.write('[ERROR] ' + message + '\n');
}

// Regular expression to match import statements without .js extension
// This regex looks for import statements that don't end with .js, .jsx, .ts, .tsx, .json, .css, etc.
const importExportRegex = /\b(?:import|export)\s+[^'"]*from\s+['"]([^'"]+)['"]/g;

// Function to check if a path should have .js extension added
function shouldAddJsExtension(importPath) {
  // Don't add .js to paths that:
  // 1. Already have a file extension
  // 2. Are absolute paths (start with /)
  // 3. Are package imports (don't start with . or ..)
  // 4. Already end with .js
  
  if (importPath.startsWith('/')) return false;
  if (!importPath.startsWith('.')) return false;
  
  const hasExtension = path.extname(importPath) !== '';
  if (hasExtension) return false;
  
  return true;
}

// Stats tracking
let totalFiles = 0;
let modifiedFiles = 0;
let errorFiles = 0;
let fixedImports = 0;

// Function to process a single file
function processFile(filePath) {
  log(`Processing: ${filePath}`);
  totalFiles++;
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    let fileFixCount = 0;
    
    let newContent = content.replace(importExportRegex, (match, importPath) => {
      if (shouldAddJsExtension(importPath)) {
        modified = true;
        fileFixCount++;
        log(`  Found import/export without .js extension: '${importPath}' in ${filePath}`);
        return match.replace(`'${importPath}'`, `'${importPath}.js'`).replace(`"${importPath}"`, `"${importPath}.js"`);
      }
      return match;
    });
    
    if (modified) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      log(`  Fixed ${fileFixCount} imports in: ${filePath}`);
      modifiedFiles++;
      fixedImports += fileFixCount;
    }
  } catch (error) {
    logError(`  Error processing ${filePath}: ${error.message}`);
    errorFiles++;
  }
}

// Function to recursively scan directory for JavaScript files
function scanDirectory(directory) {
  try {
    const files = fs.readdirSync(directory);
    
    for (const file of files) {
      const filePath = path.join(directory, file);
      
      try {
        const stats = fs.statSync(filePath);
        
        if (stats.isDirectory()) {
          scanDirectory(filePath);
        } else if (file.endsWith('.js')) {
          processFile(filePath);
        }
      } catch (error) {
        logError(`Error accessing ${filePath}: ${error.message}`);
      }
    }
  } catch (error) {
    logError(`Error reading directory ${directory}: ${error.message}`);
  }
}

// Main function
function main() {
  // Allow directory to be specified as a CLI argument, default to 'dist'
  const targetDir = process.argv[2]
    ? path.resolve(process.cwd(), process.argv[2])
    : path.join(__dirname, 'dist');
  log(`Starting to scan directory: ${targetDir}`);
  
  try {
    scanDirectory(targetDir);

    // Log summary
    const summary = [
      '\n----- Summary -----',
      `Total files processed: ${totalFiles}`,
      `Files modified: ${modifiedFiles}`,
      `Total imports fixed: ${fixedImports}`,
      `Files with errors: ${errorFiles}`,
      modifiedFiles === 0
        ? 'No files were modified. No matching imports found or no .js files present.'
        : 'Finished processing all files.'
    ].join('\n');
    log(summary);
    // Also print summary to console for visibility
    console.log(summary);
  } catch (error) {
    logError(`Fatal error: ${error.message}`);
  } finally {
    logStream.end();
  }
}

// Run the script
main();
