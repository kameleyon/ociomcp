// Auto-generated safe fallback for import-fixer

export function activate() {
    console.log("[TOOL] import-fixer activated (passive mode)");
}

/**
 * Handles file write events for JavaScript/TypeScript files.
 * If a relevant file changes, triggers import fixing or logging.
 */
export async function onFileWrite(event?: { path: string; content?: string }) {
  if (!event || !event.path) {
    console.warn("[import-fixer] onFileWrite called without event data.");
    return;
  }
  try {
    if (event.path.endsWith('.js') || event.path.endsWith('.ts')) {
      console.log(`[import-fixer] Detected JS/TS file change: ${event.path}`);
      // Optionally trigger import fixing or log the event
      // ... actual logic could go here
    }
  } catch (err) {
    console.error(`[import-fixer] Error during file-triggered import fixing:`, err);
  }
}

/**
 * Initializes or resets import fixer state at the start of a session.
 */
export function onSessionStart(session?: { id?: string }) {
  console.log(`[import-fixer] Session started${session && session.id ? `: ${session.id}` : ""}. Preparing import fixer environment.`);
  // Example: clear temp files, reset state, etc.
  // ... actual reset logic
}

/**
 * Handles import fixer commands.
 * Supports dynamic invocation of import fixing or validation.
 */
export async function onCommand(command?: { name: string; args?: any }) {
  if (!command || !command.name) {
    console.warn("[import-fixer] onCommand called without command data.");
    return;
  }
  switch (command.name) {
    case "fix-imports":
      console.log("[import-fixer] Fixing imports...");
      try {
        await handleImportFixer(command.args);
        console.log("[import-fixer] Import fixing complete.");
      } catch (err) {
        console.error("[import-fixer] Import fixing failed:", err);
      }
      break;
    case "validate-import-fixer-schema":
      console.log("[import-fixer] Validating import fixer schema...");
      try {
        ImportFixerSchema.parse(command.args);
        console.log("[import-fixer] Import fixer schema validation successful.");
      } catch (err) {
        console.error("[import-fixer] Import fixer schema validation failed:", err);
      }
      break;
    default:
      console.warn(`[import-fixer] Unknown command: ${command.name}`);
  }
}
import fs from "fs";
import path from "path";
import { z } from "zod";

// Schema for the ImportFixer tool
export const ImportFixerSchema = z.object({
  directory: z.string().describe("Directory to scan for JavaScript files"),
  logFile: z.string().optional().describe("Optional path to write log file (default: fix-imports-log.txt)"),
  dryRun: z.boolean().optional().default(false).describe("If true, only report changes without modifying files")
});

// Regular expression to match import statements without .js extension
const importExportRegex = /\b(?:import|export)\s+[^'"]*from\s+['"]([^'"]+)['"]/g;

// Function to check if a path should have .js extension added
function shouldAddJsExtension(importPath: string): boolean {
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

interface FixResult {
  totalFiles: number;
  modifiedFiles: number;
  errorFiles: number;
  fixedImports: number;
  errors: { file: string, error: string }[];
  modifiedFilesList: string[];
}

// Function to process a single file
function processFile(
  filePath: string,
  logFn: (message: string) => void,
  dryRun: boolean
): { modified: boolean, fileFixCount: number, error?: string } {
  logFn(`Processing: ${filePath}`);
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    let fileFixCount = 0;
    
    let newContent = content.replace(importExportRegex, (match, importPath) => {
      if (shouldAddJsExtension(importPath)) {
        modified = true;
        fileFixCount++;
        logFn(`  Found import/export without .js extension: '${importPath}' in ${filePath}`);
        return match.replace(`'${importPath}'`, `'${importPath}.js'`).replace(`"${importPath}"`, `"${importPath}.js"`);
      }
      return match;
    });
    
    if (modified && !dryRun) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      logFn(`  Fixed ${fileFixCount} imports in: ${filePath}`);
    }

    return { modified, fileFixCount };
  } catch (error: any) {
    return { modified: false, fileFixCount: 0, error: error.message };
  }
}

// Function to recursively scan directory for JavaScript files
function scanDirectory(
  directory: string,
  logFn: (message: string) => void,
  dryRun: boolean,
  result: FixResult
): void {
  try {
    const files = fs.readdirSync(directory);
    
    for (const file of files) {
      const filePath = path.join(directory, file);
      
      try {
        const stats = fs.statSync(filePath);
        
        if (stats.isDirectory()) {
          scanDirectory(filePath, logFn, dryRun, result);
        } else if (file.endsWith('.js')) {
          result.totalFiles++;
          const processResult = processFile(filePath, logFn, dryRun);
          
          if (processResult.error) {
            logFn(`  Error processing ${filePath}: ${processResult.error}`);
            result.errorFiles++;
            result.errors.push({ file: filePath, error: processResult.error });
          } else if (processResult.modified) {
            result.modifiedFiles++;
            result.fixedImports += processResult.fileFixCount;
            result.modifiedFilesList.push(filePath);
          }
        }
      } catch (error: any) {
        logFn(`Error accessing ${filePath}: ${error.message}`);
        result.errors.push({ file: filePath, error: error.message });
      }
    }
  } catch (error: any) {
    logFn(`Error reading directory ${directory}: ${error.message}`);
    result.errors.push({ file: directory, error: error.message });
  }
}

// Main handler function for the MCP tool
export async function handleImportFixer(args: z.infer<typeof ImportFixerSchema>) {
  const { directory, logFile = "fix-imports-log.txt", dryRun = false } = args;
  
  // Create log functions
  const messages: string[] = [];
  
  const logFn = (message: string) => {
    console.log(message);
    messages.push(message);
  };
  
  const result: FixResult = {
    totalFiles: 0,
    modifiedFiles: 0,
    errorFiles: 0,
    fixedImports: 0,
    errors: [],
    modifiedFilesList: []
  };

  logFn(`Starting to scan directory: ${directory}`);
  logFn(dryRun ? "Dry run mode - no files will be modified" : "Files will be modified");
  
  try {
    scanDirectory(directory, logFn, dryRun, result);

    // Log summary
    const summary = [
      '\n----- Summary -----',
      `Total files processed: ${result.totalFiles}`,
      `Files ${dryRun ? 'that would be' : ''} modified: ${result.modifiedFiles}`,
      `Total imports ${dryRun ? 'that would be' : ''} fixed: ${result.fixedImports}`,
      `Files with errors: ${result.errorFiles}`,
      result.modifiedFiles === 0
        ? 'No files were modified. No matching imports found or no .js files present.'
        : dryRun ? 'Dry run completed. No files were actually modified.' : 'Finished processing all files.'
    ].join('\n');
    
    logFn(summary);
  } catch (error: any) {
    logFn(`Fatal error: ${error.message}`);
    result.errors.push({ file: "general", error: error.message });
  }
  
  // Write log file if specified
  if (logFile) {
    try {
      fs.writeFileSync(logFile, messages.join('\n'), 'utf8');
    } catch (error: any) {
      console.error(`Error writing log file: ${error.message}`);
    }
  }

  return {
    success: result.errorFiles === 0,
    message: `Processed ${result.totalFiles} JavaScript file(s), fixed ${result.fixedImports} import(s) in ${result.modifiedFiles} file(s)`,
    result: {
      totalFiles: result.totalFiles,
      modifiedFiles: result.modifiedFiles,
      fixedImports: result.fixedImports,
      errorFiles: result.errorFiles,
      errors: result.errors,
      modifiedFilesList: result.modifiedFilesList,
      logFile: logFile ? path.resolve(logFile) : null,
      logs: messages
    }
  };
}
