// Auto-generated safe fallback for code-splitter

export function activate() {
    console.log("[TOOL] code-splitter activated (passive mode)");
}

export function onFileWrite() { /* no-op */ }
export function onSessionStart() { /* no-op */ }
export function onCommand() { /* no-op */ }
import { z } from 'zod';
import * as fs from 'fs/promises';
import * as path from 'path';

// Define schemas for CodeSplitter tool
export const AnalyzeFileSchema = z.object({
  path: z.string(),
  maxLines: z.number().optional(),
});

export const SplitFileSchema = z.object({
  path: z.string(),
  maxLines: z.number().optional(),
  strategy: z.enum(['components', 'functions', 'classes', 'auto']).default('auto'),
});

export const AnalyzeProjectSchema = z.object({
  directory: z.string(),
  maxLines: z.number().optional(),
  recursive: z.boolean().optional(),
  extensions: z.array(z.string()).optional(),
});

// Default maximum lines per file
const DEFAULT_MAX_LINES = 500;

// File extensions to analyze by default
const DEFAULT_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx', '.vue', '.svelte', '.css', '.scss', '.less', '.html'];

/**
 * Analyzes a file to determine if it exceeds the maximum number of lines
 */
export async function handleAnalyzeFile(args: any) {
  if (args && typeof args === 'object' && 'path' in args && typeof args.path === 'string') {
    const { path: filePath } = args;
    const maxLines = args.maxLines || DEFAULT_MAX_LINES;
    
    try {
      // Read the file
      const content = await fs.readFile(filePath, 'utf8');
      
      // Count the number of lines
      const lines = content.split('\n');
      const lineCount = lines.length;
      
      // Check if the file exceeds the maximum number of lines
      const exceedsMaxLines = lineCount > maxLines;
      
      // If the file exceeds the maximum number of lines, analyze it to suggest splitting points
      let splittingPoints = [];
      if (exceedsMaxLines) {
        splittingPoints = analyzeSplittingPoints(content, filePath);
      }
      
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            path: filePath,
            lineCount,
            maxLines,
            exceedsMaxLines,
            splittingPoints: exceedsMaxLines ? splittingPoints : [],
            message: exceedsMaxLines
              ? `File exceeds maximum line count (${lineCount} > ${maxLines}). Consider splitting the file.`
              : `File is within maximum line count (${lineCount} <= ${maxLines}).`
          }, null, 2)
        }],
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            path: filePath,
            error: String(error),
            message: `Failed to analyze file: ${filePath}`
          }, null, 2)
        }],
        isError: true,
      };
    }
  }
  
  return {
    content: [{ type: "text", text: "Error: Invalid arguments for analyze_file" }],
    isError: true,
  };
}

/**
 * Splits a file into multiple files based on the specified strategy
 */
export async function handleSplitFile(args: any) {
  if (args && typeof args === 'object' && 'path' in args && typeof args.path === 'string') {
    const { path: filePath } = args;
    const maxLines = args.maxLines || DEFAULT_MAX_LINES;
    const strategy = args.strategy || 'auto';
    
    try {
      // Read the file
      const content = await fs.readFile(filePath, 'utf8');
      
      // Count the number of lines
      const lines = content.split('\n');
      const lineCount = lines.length;
      
      // Check if the file exceeds the maximum number of lines
      if (lineCount <= maxLines) {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              path: filePath,
              lineCount,
              maxLines,
              message: `File is already within maximum line count (${lineCount} <= ${maxLines}). No splitting needed.`
            }, null, 2)
          }],
        };
      }
      
      // Determine the appropriate splitting strategy
      const actualStrategy = strategy === 'auto' ? determineSplittingStrategy(filePath) : strategy;
      
      // Split the file based on the strategy
      const result = await splitFileByStrategy(filePath, content, actualStrategy, maxLines);
      
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            path: filePath,
            lineCount,
            maxLines,
            strategy: actualStrategy,
            result,
            message: `File has been split into multiple files using the ${actualStrategy} strategy.`
          }, null, 2)
        }],
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            path: filePath,
            error: String(error),
            message: `Failed to split file: ${filePath}`
          }, null, 2)
        }],
        isError: true,
      };
    }
  }
  
  return {
    content: [{ type: "text", text: "Error: Invalid arguments for split_file" }],
    isError: true,
  };
}

/**
 * Analyzes a project directory to find files that exceed the maximum number of lines
 */
export async function handleAnalyzeProject(args: any) {
  if (args && typeof args === 'object' && 'directory' in args && typeof args.directory === 'string') {
    const { directory } = args;
    const maxLines = args.maxLines || DEFAULT_MAX_LINES;
    const recursive = args.recursive !== false; // Default to true
    const extensions = args.extensions || DEFAULT_EXTENSIONS;
    
    try {
      // Get all files in the directory
      const files = await getFilesInDirectory(directory, recursive, extensions);
      
      // Analyze each file
      const results = await Promise.all(
        files.map(async (filePath) => {
          try {
            // Read the file
            const content = await fs.readFile(filePath, 'utf8');
            
            // Count the number of lines
            const lines = content.split('\n');
            const lineCount = lines.length;
            
            // Check if the file exceeds the maximum number of lines
            const exceedsMaxLines = lineCount > maxLines;
            
            return {
              path: filePath,
              lineCount,
              exceedsMaxLines,
            };
          } catch (error) {
            return {
              path: filePath,
              error: String(error),
              message: `Failed to analyze file: ${filePath}`
            };
          }
        })
      );
      
      // Filter results to only include files that exceed the maximum number of lines
      const exceedingFiles = results.filter((result) => result.exceedsMaxLines);
      
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            directory,
            maxLines,
            totalFiles: results.length,
            exceedingFiles: exceedingFiles.length,
            files: exceedingFiles,
            message: exceedingFiles.length > 0
              ? `Found ${exceedingFiles.length} files that exceed the maximum line count (${maxLines}).`
              : `All files are within the maximum line count (${maxLines}).`
          }, null, 2)
        }],
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            directory,
            error: String(error),
            message: `Failed to analyze project directory: ${directory}`
          }, null, 2)
        }],
        isError: true,
      };
    }
  }
  
  return {
    content: [{ type: "text", text: "Error: Invalid arguments for analyze_project" }],
    isError: true,
  };
}

/**
 * Analyzes a file to suggest splitting points
 */
function analyzeSplittingPoints(content: string, filePath: string): any[] {
  const extension = path.extname(filePath).toLowerCase();
  const splittingPoints = [];
  
  // Determine the type of file
  if (['.js', '.jsx', '.ts', '.tsx'].includes(extension)) {
    // JavaScript/TypeScript file
    
    // Look for component definitions (React, Vue, etc.)
    const componentMatches = content.match(/(?:export\s+(?:default\s+)?)?(?:class|function|const|let|var)\s+([A-Z][A-Za-z0-9_]*)\s*(?:extends\s+React\.Component|\(props|\=\s*\(props|\=\s*function|\=\s*\(\)|\{)/g) || [];
    
    componentMatches.forEach((match) => {
      const lineNumber = getLineNumber(content, match);
      splittingPoints.push({
        type: 'component',
        name: match.match(/([A-Z][A-Za-z0-9_]*)/)?.[1] || 'Unknown',
        lineNumber,
        suggestion: `Consider moving this component to a separate file.`
      });
    });
    
    // Look for function definitions
    const functionMatches = content.match(/(?:export\s+(?:default\s+)?)?function\s+([a-zA-Z][A-Za-z0-9_]*)\s*\(/g) || [];
    
    functionMatches.forEach((match) => {
      const lineNumber = getLineNumber(content, match);
      splittingPoints.push({
        type: 'function',
        name: match.match(/function\s+([a-zA-Z][A-Za-z0-9_]*)/)?.[1] || 'Unknown',
        lineNumber,
        suggestion: `Consider moving this function to a utility file.`
      });
    });
    
    // Look for class definitions
    const classMatches = content.match(/(?:export\s+(?:default\s+)?)?class\s+([A-Za-z][A-Za-z0-9_]*)/g) || [];
    
    classMatches.forEach((match) => {
      const lineNumber = getLineNumber(content, match);
      splittingPoints.push({
        type: 'class',
        name: match.match(/class\s+([A-Za-z][A-Za-z0-9_]*)/)?.[1] || 'Unknown',
        lineNumber,
        suggestion: `Consider moving this class to a separate file.`
      });
    });
  } else if (['.vue', '.svelte'].includes(extension)) {
    // Vue/Svelte file
    
    // Look for script, template, and style sections
    const scriptMatch = content.match(/<script[^>]*>([\s\S]*?)<\/script>/);
    const templateMatch = content.match(/<template[^>]*>([\s\S]*?)<\/template>/);
    const styleMatch = content.match(/<style[^>]*>([\s\S]*?)<\/style>/);
    
    if (scriptMatch) {
      const scriptContent = scriptMatch[1];
      const scriptLineNumber = getLineNumber(content, scriptMatch[0]);
      
      // Look for component imports
      const importMatches = scriptContent.match(/import\s+([A-Za-z][A-Za-z0-9_]*)\s+from/g) || [];
      
      importMatches.forEach((match) => {
        const lineNumber = scriptLineNumber + getLineNumber(scriptContent, match);
        splittingPoints.push({
          type: 'import',
          name: match.match(/import\s+([A-Za-z][A-Za-z0-9_]*)/)?.[1] || 'Unknown',
          lineNumber,
          suggestion: `Consider creating a separate component for this import.`
        });
      });
      
      // Look for methods
      const methodMatches = scriptContent.match(/(?:methods|computed|watch):\s*{[\s\S]*?}/g) || [];
      
      methodMatches.forEach((match) => {
        const lineNumber = scriptLineNumber + getLineNumber(scriptContent, match);
        splittingPoints.push({
          type: 'methods',
          name: match.match(/(?:methods|computed|watch)/)?.[0] || 'Unknown',
          lineNumber,
          suggestion: `Consider moving complex methods to a separate utility file.`
        });
      });
    }
    
    if (templateMatch && templateMatch[1].length > 1000) {
      const templateLineNumber = getLineNumber(content, templateMatch[0]);
      splittingPoints.push({
        type: 'template',
        name: 'Template',
        lineNumber: templateLineNumber,
        suggestion: `Consider breaking down the template into smaller components.`
      });
    }
    
    if (styleMatch && styleMatch[1].length > 1000) {
      const styleLineNumber = getLineNumber(content, styleMatch[0]);
      splittingPoints.push({
        type: 'style',
        name: 'Style',
        lineNumber: styleLineNumber,
        suggestion: `Consider moving styles to a separate CSS file or using a CSS-in-JS solution.`
      });
    }
  } else if (['.css', '.scss', '.less'].includes(extension)) {
    // CSS file
    
    // Look for top-level selectors
    const selectorMatches = content.match(/[a-zA-Z0-9_\-.#][^{]*\{[\s\S]*?\}/g) || [];
    
    let currentLine = 0;
    let currentSelector = '';
    let selectorStartLine = 0;
    let selectorLines = 0;
    
    selectorMatches.forEach((match) => {
      const lineNumber = getLineNumber(content, match);
      const lines = match.split('\n').length;
      
      if (lines > 50) {
        splittingPoints.push({
          type: 'selector',
          name: match.trim().split('{')[0].trim(),
          lineNumber,
          suggestion: `Consider breaking down this large CSS selector into smaller, more focused selectors.`
        });
      }
      
      currentLine = lineNumber + lines;
    });
    
    // Look for media queries
    const mediaQueryMatches = content.match(/@media[^{]*\{[\s\S]*?\}/g) || [];
    
    mediaQueryMatches.forEach((match) => {
      const lineNumber = getLineNumber(content, match);
      const lines = match.split('\n').length;
      
      if (lines > 100) {
        splittingPoints.push({
          type: 'media-query',
          name: match.trim().split('{')[0].trim(),
          lineNumber,
          suggestion: `Consider moving this large media query to a separate file.`
        });
      }
    });
  } else if (['.html'].includes(extension)) {
    // HTML file
    
    // Look for large sections
    const sectionMatches = content.match(/<(?:div|section|article|main|header|footer|nav)[^>]*>[\s\S]*?<\/(?:div|section|article|main|header|footer|nav)>/g) || [];
    
    sectionMatches.forEach((match) => {
      const lineNumber = getLineNumber(content, match);
      const lines = match.split('\n').length;
      
      if (lines > 100) {
        const idMatch = match.match(/id=["']([^"']*)["']/);
        const classMatch = match.match(/class=["']([^"']*)["']/);
        const name = idMatch ? `#${idMatch[1]}` : classMatch ? `.${classMatch[1].split(' ')[0]}` : 'Section';
        
        splittingPoints.push({
          type: 'section',
          name,
          lineNumber,
          suggestion: `Consider breaking down this large HTML section into smaller components or includes.`
        });
      }
    });
    
    // Look for script tags
    const scriptMatches = content.match(/<script[^>]*>[\s\S]*?<\/script>/g) || [];
    
    scriptMatches.forEach((match) => {
      const lineNumber = getLineNumber(content, match);
      const lines = match.split('\n').length;
      
      if (lines > 50) {
        splittingPoints.push({
          type: 'script',
          name: 'Script',
          lineNumber,
          suggestion: `Consider moving this script to a separate JavaScript file.`
        });
      }
    });
    
    // Look for style tags
    const styleMatches = content.match(/<style[^>]*>[\s\S]*?<\/style>/g) || [];
    
    styleMatches.forEach((match) => {
      const lineNumber = getLineNumber(content, match);
      const lines = match.split('\n').length;
      
      if (lines > 50) {
        splittingPoints.push({
          type: 'style',
          name: 'Style',
          lineNumber,
          suggestion: `Consider moving these styles to a separate CSS file.`
        });
      }
    });
  }
  
  return splittingPoints;
}

/**
 * Determines the appropriate splitting strategy based on the file extension
 */
function determineSplittingStrategy(filePath: string): string {
  const extension = path.extname(filePath).toLowerCase();
  
  if (['.jsx', '.tsx'].includes(extension)) {
    return 'components';
  } else if (['.js', '.ts'].includes(extension)) {
    return 'functions';
  } else if (['.vue', '.svelte'].includes(extension)) {
    return 'components';
  } else {
    return 'functions';
  }
}

/**
 * Splits a file based on the specified strategy
 */
async function splitFileByStrategy(filePath: string, content: string, strategy: string, maxLines: number): Promise<any> {
  const extension = path.extname(filePath);
  const baseName = path.basename(filePath, extension);
  const dirName = path.dirname(filePath);
  
  // Create a directory to store the split files
  const splitDirName = path.join(dirName, `${baseName}-split`);
  await fs.mkdir(splitDirName, { recursive: true });
  
  // Create an index file that will import and re-export all the split files
  let indexContent = '';
  const createdFiles = [];
  
  if (strategy === 'components') {
    // Split by components
    const componentMatches = content.match(/(?:export\s+(?:default\s+)?)?(?:class|function|const|let|var)\s+([A-Z][A-Za-z0-9_]*)\s*(?:extends\s+React\.Component|\(props|\=\s*\(props|\=\s*function|\=\s*\(\)|\{)[\s\S]*?(?:export\s+default\s+\1|export\s+{\s*\1\s*}|export\s+{\s*\1\s+as\s+default\s*}|export\s+default|};?|}\)?;?)/g) || [];
    
    // Extract imports and other top-level code
    const importMatches = content.match(/import\s+.*?;/g) || [];
    const imports = importMatches.join('\n');
    
    // Add imports to the index file
    indexContent += `${imports}\n\n`;
    
    // Process each component
    for (let i = 0; i < componentMatches.length; i++) {
      const componentMatch = componentMatches[i];
      const componentNameMatch = componentMatch.match(/(?:class|function|const|let|var)\s+([A-Z][A-Za-z0-9_]*)/);
      
      if (componentNameMatch) {
        const componentName = componentNameMatch[1];
        const componentFileName = `${componentName}${extension}`;
        const componentFilePath = path.join(splitDirName, componentFileName);
        
        // Create the component file
        const componentFileContent = `${imports}\n\n${componentMatch}`;
        await fs.writeFile(componentFilePath, componentFileContent);
        
        // Add the component to the index file
        indexContent += `export { default as ${componentName} } from './${baseName}-split/${componentName}';\n`;
        
        createdFiles.push({
          name: componentName,
          path: componentFilePath,
          lines: componentFileContent.split('\n').length
        });
      }
    }
    
    // Create the index file
    const indexFilePath = path.join(dirName, `${baseName}.index${extension}`);
    await fs.writeFile(indexFilePath, indexContent);
    
    createdFiles.push({
      name: `${baseName}.index`,
      path: indexFilePath,
      lines: indexContent.split('\n').length
    });
    
    return {
      strategy: 'components',
      originalFile: filePath,
      indexFile: indexFilePath,
      splitDirectory: splitDirName,
      createdFiles
    };
  } else if (strategy === 'functions') {
    // Split by functions
    const functionMatches = content.match(/(?:export\s+(?:default\s+)?)?function\s+([a-zA-Z][A-Za-z0-9_]*)\s*\([\s\S]*?(?:return\s+[^;]*;\s*}\s*$|}\s*$)/gm) || [];
    const arrowFunctionMatches = content.match(/(?:export\s+(?:default\s+)?)?(?:const|let|var)\s+([a-zA-Z][A-Za-z0-9_]*)\s*=\s*(?:\([^)]*\)|[a-zA-Z][A-Za-z0-9_]*)\s*=>\s*(?:{[\s\S]*?}|[^;]*;)/g) || [];
    
    // Extract imports and other top-level code
    const importMatches = content.match(/import\s+.*?;/g) || [];
    const imports = importMatches.join('\n');
    
    // Add imports to the index file
    indexContent += `${imports}\n\n`;
    
    // Process each function
    const allFunctions = [...functionMatches, ...arrowFunctionMatches];
    for (let i = 0; i < allFunctions.length; i++) {
      const functionMatch = allFunctions[i];
      const functionNameMatch = functionMatch.match(/(?:function|const|let|var)\s+([a-zA-Z][A-Za-z0-9_]*)/);
      
      if (functionNameMatch) {
        const functionName = functionNameMatch[1];
        const functionFileName = `${functionName}${extension}`;
        const functionFilePath = path.join(splitDirName, functionFileName);
        
        // Create the function file
        const functionFileContent = `${imports}\n\n${functionMatch}\n\nexport default ${functionName};`;
        await fs.writeFile(functionFilePath, functionFileContent);
        
        // Add the function to the index file
        indexContent += `export { default as ${functionName} } from './${baseName}-split/${functionName}';\n`;
        
        createdFiles.push({
          name: functionName,
          path: functionFilePath,
          lines: functionFileContent.split('\n').length
        });
      }
    }
    
    // Create the index file
    const indexFilePath = path.join(dirName, `${baseName}.index${extension}`);
    await fs.writeFile(indexFilePath, indexContent);
    
    createdFiles.push({
      name: `${baseName}.index`,
      path: indexFilePath,
      lines: indexContent.split('\n').length
    });
    
    return {
      strategy: 'functions',
      originalFile: filePath,
      indexFile: indexFilePath,
      splitDirectory: splitDirName,
      createdFiles
    };
  } else if (strategy === 'classes') {
    // Split by classes
    const classMatches = content.match(/(?:export\s+(?:default\s+)?)?class\s+([A-Za-z][A-Za-z0-9_]*)[^{]*{[\s\S]*?}/g) || [];
    
    // Extract imports and other top-level code
    const importMatches = content.match(/import\s+.*?;/g) || [];
    const imports = importMatches.join('\n');
    
    // Add imports to the index file
    indexContent += `${imports}\n\n`;
    
    // Process each class
    for (let i = 0; i < classMatches.length; i++) {
      const classMatch = classMatches[i];
      const classNameMatch = classMatch.match(/class\s+([A-Za-z][A-Za-z0-9_]*)/);
      
      if (classNameMatch) {
        const className = classNameMatch[1];
        const classFileName = `${className}${extension}`;
        const classFilePath = path.join(splitDirName, classFileName);
        
        // Create the class file
        const classFileContent = `${imports}\n\n${classMatch}\n\nexport default ${className};`;
        await fs.writeFile(classFilePath, classFileContent);
        
        // Add the class to the index file
        indexContent += `export { default as ${className} } from './${baseName}-split/${className}';\n`;
        
        createdFiles.push({
          name: className,
          path: classFilePath,
          lines: classFileContent.split('\n').length
        });
      }
    }
    
    // Create the index file
    const indexFilePath = path.join(dirName, `${baseName}.index${extension}`);
    await fs.writeFile(indexFilePath, indexContent);
    
    createdFiles.push({
      name: `${baseName}.index`,
      path: indexFilePath,
      lines: indexContent.split('\n').length
    });
    
    return {
      strategy: 'classes',
      originalFile: filePath,
      indexFile: indexFilePath,
      splitDirectory: splitDirName,
      createdFiles
    };
  }
  
  // If no specific strategy was applied, split the file into chunks
  const lines = content.split('\n');
  const chunks = [];
  
  for (let i = 0; i < lines.length; i += maxLines) {
    chunks.push(lines.slice(i, i + maxLines).join('\n'));
  }
  
  // Create a file for each chunk
  for (let i = 0; i < chunks.length; i++) {
    const chunkFileName = `${baseName}.part${i + 1}${extension}`;
    const chunkFilePath = path.join(splitDirName, chunkFileName);
    
    await fs.writeFile(chunkFilePath, chunks[i]);
    
    createdFiles.push({
      name: chunkFileName,
      path: chunkFilePath,
      lines: chunks[i].split('\n').length
    });
  }
  
  return {
    strategy: 'chunks',
    originalFile: filePath,
    splitDirectory: splitDirName,
    createdFiles
  };
}

/**
 * Gets the line number of a substring within a string
 */
function getLineNumber(content: string, substring: string): number {
  const index = content.indexOf(substring);
  if (index === -1) return -1;
  
  return content.substring(0, index).split('\n').length;
}

/**
 * Gets all files in a directory
 */
async function getFilesInDirectory(directory: string, recursive: boolean, extensions: string[]): Promise<string[]> {
  const files: string[] = [];
  
  try {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    
    for (const entry of entries) {
      const entryPath = path.join(directory, entry.name);
      
      if (entry.isDirectory() && recursive) {
        const subFiles = await getFilesInDirectory(entryPath, recursive, extensions);
        files.push(...subFiles);
      } else if (entry.isFile() && extensions.includes(path.extname(entry.name).toLowerCase())) {
        files.push(entryPath);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${directory}: ${error}`);
  }
  
  return files;
}

