import { z } from 'zod';
import * as fs from 'fs/promises';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

// Promisify exec
const execAsync = promisify(exec);

// Define schemas for CodeFixer tool
export const FixCodeSchema = z.object({
  path: z.string(),
  content: z.string().optional(),
  language: z.string().optional(),
  fixTypes: z.array(z.enum([
    'syntax',
    'formatting',
    'imports',
    'unused',
    'security',
    'performance',
    'accessibility',
    'all'
  ])).optional(),
});

export const AnalyzeCodeSchema = z.object({
  path: z.string(),
  content: z.string().optional(),
  language: z.string().optional(),
});

export const FixProjectSchema = z.object({
  directory: z.string(),
  recursive: z.boolean().optional(),
  extensions: z.array(z.string()).optional(),
  fixTypes: z.array(z.enum([
    'syntax',
    'formatting',
    'imports',
    'unused',
    'security',
    'performance',
    'accessibility',
    'all'
  ])).optional(),
});

// Default file extensions to analyze
const DEFAULT_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx', '.vue', '.svelte', '.css', '.scss', '.less', '.html', '.json'];

// Type for replacement function
type ReplacementFunction = (match: string, ...args: string[]) => string;

// Common code issues and fixes by language
const codeFixers: Record<string, Array<{ pattern: RegExp; replacement: string | ReplacementFunction; description: string; type: string }>> = {
  javascript: [
    {
      pattern: /([a-zA-Z0-9_$]+)\s*=\s*([a-zA-Z0-9_$]+)\s*==\s*([a-zA-Z0-9_$]+)/g,
      replacement: '$1 = $2 === $3',
      description: 'Replace == with === for strict equality comparison',
      type: 'syntax'
    },
    {
      pattern: /([a-zA-Z0-9_$]+)\s*=\s*([a-zA-Z0-9_$]+)\s*!=\s*([a-zA-Z0-9_$]+)/g,
      replacement: '$1 = $2 !== $3',
      description: 'Replace != with !== for strict inequality comparison',
      type: 'syntax'
    },
    {
      pattern: /console\.log\([^)]*\);?/g,
      replacement: '// $&',
      description: 'Comment out console.log statements',
      type: 'unused'
    },
    {
      pattern: /\/\/ *TODO:?/g,
      replacement: '// TODO:',
      description: 'Standardize TODO comments',
      type: 'formatting'
    },
    {
      pattern: /function\s*\(\s*\)\s*{\s*return\s+([^;]+);?\s*}/g,
      replacement: '() => $1',
      description: 'Convert simple functions to arrow functions',
      type: 'formatting'
    },
    {
      pattern: /new Array\(\)/g,
      replacement: '[]',
      description: 'Use array literal instead of constructor',
      type: 'performance'
    },
    {
      pattern: /new Object\(\)/g,
      replacement: '{}',
      description: 'Use object literal instead of constructor',
      type: 'performance'
    },
    {
      pattern: /document\.getElementById\('([^']+)'\)\.addEventListener\('click',\s*function\s*\(\s*\)\s*{\s*([^}]+)\s*}\);/g,
      replacement: "document.getElementById('$1').addEventListener('click', () => {\n  $2\n});",
      description: 'Convert anonymous functions to arrow functions in event listeners',
      type: 'formatting'
    },
    {
      pattern: /([a-zA-Z0-9_$]+)\.forEach\(function\s*\(([a-zA-Z0-9_$]+)\)\s*{\s*([^}]+)\s*}\);/g,
      replacement: '$1.forEach(($2) => {\n  $3\n});',
      description: 'Convert anonymous functions to arrow functions in forEach',
      type: 'formatting'
    },
    {
      pattern: /([a-zA-Z0-9_$]+)\.map\(function\s*\(([a-zA-Z0-9_$]+)\)\s*{\s*([^}]+)\s*}\);/g,
      replacement: '$1.map(($2) => {\n  $3\n});',
      description: 'Convert anonymous functions to arrow functions in map',
      type: 'formatting'
    },
    {
      pattern: /var\s+([a-zA-Z0-9_$]+)\s*=/g,
      replacement: 'const $1 =',
      description: 'Replace var with const for variable declarations',
      type: 'syntax'
    },
    {
      pattern: /([a-zA-Z0-9_$]+)\.indexOf\(([^)]+)\)\s*!==?\s*-1/g,
      replacement: '$1.includes($2)',
      description: 'Use includes() instead of indexOf() !== -1',
      type: 'syntax'
    },
    {
      pattern: /([a-zA-Z0-9_$]+)\.indexOf\(([^)]+)\)\s*===?\s*-1/g,
      replacement: '!$1.includes($2)',
      description: 'Use !includes() instead of indexOf() === -1',
      type: 'syntax'
    },
    {
      pattern: /for\s*\(\s*var\s+i\s*=\s*0;\s*i\s*<\s*([a-zA-Z0-9_$]+)\.length;\s*i\+\+\)\s*{/g,
      replacement: 'for (let i = 0; i < $1.length; i++) {',
      description: 'Replace var with let in for loops',
      type: 'syntax'
    },
    {
      pattern: /for\s*\(\s*var\s+i\s*=\s*0;\s*i\s*<\s*([a-zA-Z0-9_$]+)\.length;\s*i\+\+\)\s*{\s*([^}]+)\s*}/g,
      replacement: 'for (const item of $1) {\n  $2\n}',
      description: 'Convert for loops to for...of loops',
      type: 'syntax'
    },
  ],
  typescript: [
    {
      pattern: /([a-zA-Z0-9_$]+)\s*=\s*([a-zA-Z0-9_$]+)\s*==\s*([a-zA-Z0-9_$]+)/g,
      replacement: '$1 = $2 === $3',
      description: 'Replace == with === for strict equality comparison',
      type: 'syntax'
    },
    {
      pattern: /([a-zA-Z0-9_$]+)\s*=\s*([a-zA-Z0-9_$]+)\s*!=\s*([a-zA-Z0-9_$]+)/g,
      replacement: '$1 = $2 !== $3',
      description: 'Replace != with !== for strict inequality comparison',
      type: 'syntax'
    },
    {
      pattern: /console\.log\([^)]*\);?/g,
      replacement: '// $&',
      description: 'Comment out console.log statements',
      type: 'unused'
    },
    {
      pattern: /\/\/ *TODO:?/g,
      replacement: '// TODO:',
      description: 'Standardize TODO comments',
      type: 'formatting'
    },
    {
      pattern: /function\s*\(\s*\)\s*{\s*return\s+([^;]+);?\s*}/g,
      replacement: '() => $1',
      description: 'Convert simple functions to arrow functions',
      type: 'formatting'
    },
    {
      pattern: /new Array\(\)/g,
      replacement: '[]',
      description: 'Use array literal instead of constructor',
      type: 'performance'
    },
    {
      pattern: /new Object\(\)/g,
      replacement: '{}',
      description: 'Use object literal instead of constructor',
      type: 'performance'
    },
    {
      pattern: /([a-zA-Z0-9_$]+)\.forEach\(function\s*\(([a-zA-Z0-9_$]+)\)\s*{\s*([^}]+)\s*}\);/g,
      replacement: '$1.forEach(($2) => {\n  $3\n});',
      description: 'Convert anonymous functions to arrow functions in forEach',
      type: 'formatting'
    },
    {
      pattern: /([a-zA-Z0-9_$]+)\.map\(function\s*\(([a-zA-Z0-9_$]+)\)\s*{\s*([^}]+)\s*}\);/g,
      replacement: '$1.map(($2) => {\n  $3\n});',
      description: 'Convert anonymous functions to arrow functions in map',
      type: 'formatting'
    },
    {
      pattern: /var\s+([a-zA-Z0-9_$]+)\s*=/g,
      replacement: 'const $1 =',
      description: 'Replace var with const for variable declarations',
      type: 'syntax'
    },
    {
      pattern: /([a-zA-Z0-9_$]+)\.indexOf\(([^)]+)\)\s*!==?\s*-1/g,
      replacement: '$1.includes($2)',
      description: 'Use includes() instead of indexOf() !== -1',
      type: 'syntax'
    },
    {
      pattern: /([a-zA-Z0-9_$]+)\.indexOf\(([^)]+)\)\s*===?\s*-1/g,
      replacement: '!$1.includes($2)',
      description: 'Use !includes() instead of indexOf() === -1',
      type: 'syntax'
    },
    {
      pattern: /for\s*\(\s*var\s+i\s*=\s*0;\s*i\s*<\s*([a-zA-Z0-9_$]+)\.length;\s*i\+\+\)\s*{/g,
      replacement: 'for (let i = 0; i < $1.length; i++) {',
      description: 'Replace var with let in for loops',
      type: 'syntax'
    },
    {
      pattern: /for\s*\(\s*var\s+i\s*=\s*0;\s*i\s*<\s*([a-zA-Z0-9_$]+)\.length;\s*i\+\+\)\s*{\s*([^}]+)\s*}/g,
      replacement: 'for (const item of $1) {\n  $2\n}',
      description: 'Convert for loops to for...of loops',
      type: 'syntax'
    },
    {
      pattern: /interface\s+([A-Za-z][A-Za-z0-9_]*)\s*{\s*([^}]*?)\s*}/g,
      replacement: (match: string, name: string, content: string) => {
        // Check if the interface has optional properties
        if (content.includes('?:')) {
          return match;
        }
        // Convert to type alias with Readonly
        return `type ${name} = Readonly<{\n  ${content}\n}>;`;
      },
      description: 'Convert interfaces to readonly type aliases for immutability',
      type: 'syntax'
    },
    {
      pattern: /([a-zA-Z0-9_$]+):\s*Array<([^>]+)>/g,
      replacement: '$1: $2[]',
      description: 'Use array shorthand notation instead of generic Array type',
      type: 'syntax'
    },
    {
      pattern: /([a-zA-Z0-9_$]+):\s*any/g,
      replacement: '$1: unknown',
      description: 'Replace any with unknown for better type safety',
      type: 'syntax'
    },
  ],
  css: [
    {
      pattern: /([a-zA-Z0-9_\-]+)\s*:\s*([^;]+);/g,
      replacement: '$1: $2;',
      description: 'Standardize spacing around colons in CSS properties',
      type: 'formatting'
    },
    {
      pattern: /\s*!important/g,
      replacement: ' !important',
      description: 'Standardize spacing before !important',
      type: 'formatting'
    },
    {
      pattern: /rgb\((\d+),\s*(\d+),\s*(\d+)\)/g,
      replacement: (match: string, r: string, g: string, b: string) => {
        // Convert RGB to hexadecimal
        const hex = `#${Number(r).toString(16).padStart(2, '0')}${Number(g).toString(16).padStart(2, '0')}${Number(b).toString(16).padStart(2, '0')}`;
        return hex;
      },
      description: 'Convert RGB colors to hexadecimal',
      type: 'formatting'
    },
    {
      pattern: /margin-top:\s*(\d+)px;\s*margin-right:\s*(\d+)px;\s*margin-bottom:\s*(\d+)px;\s*margin-left:\s*(\d+)px;/g,
      replacement: 'margin: $1px $2px $3px $4px;',
      description: 'Combine margin properties into shorthand',
      type: 'formatting'
    },
    {
      pattern: /padding-top:\s*(\d+)px;\s*padding-right:\s*(\d+)px;\s*padding-bottom:\s*(\d+)px;\s*padding-left:\s*(\d+)px;/g,
      replacement: 'padding: $1px $2px $3px $4px;',
      description: 'Combine padding properties into shorthand',
      type: 'formatting'
    },
    {
      pattern: /border-width:\s*(\d+)px;\s*border-style:\s*([a-zA-Z]+);\s*border-color:\s*([#a-zA-Z0-9]+);/g,
      replacement: 'border: $1px $2 $3;',
      description: 'Combine border properties into shorthand',
      type: 'formatting'
    },
  ],
  html: [
    {
      pattern: /<img([^>]*)>/g,
      replacement: (match: string, attributes: string) => {
        if (attributes.includes('alt=')) {
          return match;
        }
        return `<img${attributes} alt="">`;
      },
      description: 'Add alt attribute to img tags for accessibility',
      type: 'accessibility'
    },
    {
      pattern: /<a([^>]*)>/g,
      replacement: (match: string, attributes: string) => {
        if (attributes.includes('href=') && !attributes.includes('rel=')) {
          return `<a${attributes} rel="noopener noreferrer">`;
        }
        return match;
      },
      description: 'Add rel="noopener noreferrer" to external links for security',
      type: 'security'
    },
    {
      pattern: /<button([^>]*)>/g,
      replacement: (match: string, attributes: string) => {
        if (!attributes.includes('type=')) {
          return `<button${attributes} type="button">`;
        }
        return match;
      },
      description: 'Add type attribute to button tags',
      type: 'syntax'
    },
    {
      pattern: /<div([^>]*)>\s*<\/div>/g,
      replacement: '',
      description: 'Remove empty div tags',
      type: 'unused'
    },
    {
      pattern: /<!--[\s\S]*?-->/g,
      replacement: '',
      description: 'Remove HTML comments',
      type: 'unused'
    },
  ],
  json: [
    {
      pattern: /,\s*}/g,
      replacement: ' }',
      description: 'Remove trailing commas in JSON objects',
      type: 'syntax'
    },
    {
      pattern: /,\s*]/g,
      replacement: ' ]',
      description: 'Remove trailing commas in JSON arrays',
      type: 'syntax'
    },
  ],
};

/**
 * Fixes code issues in a file
 */
export async function handleFixCode(args: any) {
  if (args && typeof args === 'object' && ('path' in args || 'content' in args)) {
    try {
      // Get the file content
      let content: string;
      let filePath: string = '';
      
      if ('path' in args && typeof args.path === 'string') {
        filePath = args.path;
        content = await fs.readFile(filePath, 'utf8');
      } else if ('content' in args && typeof args.content === 'string') {
        content = args.content;
      } else {
        return {
          content: [{ type: "text", text: "Error: Either path or content must be provided" }],
          isError: true,
        };
      }
      
      // Determine the language
      let language = args.language;
      if (!language && filePath) {
        language = getLanguageFromExtension(filePath);
      }
      
      if (!language) {
        return {
          content: [{ type: "text", text: "Error: Could not determine language. Please provide a language." }],
          isError: true,
        };
      }
      
      // Get the fix types
      const fixTypes = args.fixTypes || ['all'];
      
      // Fix the code
      const result = fixCode(content, language, fixTypes);
      
      // If a file path was provided, write the fixed code back to the file
      if (filePath) {
        await fs.writeFile(filePath, result.fixedCode);
      }
      
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            language,
            fixTypes,
            fixes: result.fixes,
            fixedCode: result.fixedCode,
            message: `Fixed ${result.fixes.length} issues in the code.`
          }, null, 2)
        }],
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            error: String(error),
            message: `Failed to fix code.`
          }, null, 2)
        }],
        isError: true,
      };
    }
  }
  
  return {
    content: [{ type: "text", text: "Error: Invalid arguments for fix_code" }],
    isError: true,
  };
}

/**
 * Analyzes code for issues
 */
export async function handleAnalyzeCode(args: any) {
  if (args && typeof args === 'object' && ('path' in args || 'content' in args)) {
    try {
      // Get the file content
      let content: string;
      let filePath: string = '';
      
      if ('path' in args && typeof args.path === 'string') {
        filePath = args.path;
        content = await fs.readFile(filePath, 'utf8');
      } else if ('content' in args && typeof args.content === 'string') {
        content = args.content;
      } else {
        return {
          content: [{ type: "text", text: "Error: Either path or content must be provided" }],
          isError: true,
        };
      }
      
      // Determine the language
      let language = args.language;
      if (!language && filePath) {
        language = getLanguageFromExtension(filePath);
      }
      
      if (!language) {
        return {
          content: [{ type: "text", text: "Error: Could not determine language. Please provide a language." }],
          isError: true,
        };
      }
      
      // Analyze the code
      const issues = analyzeCode(content, language);
      
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            language,
            issues,
            message: `Found ${issues.length} issues in the code.`
          }, null, 2)
        }],
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            error: String(error),
            message: `Failed to analyze code.`
          }, null, 2)
        }],
        isError: true,
      };
    }
  }
  
  return {
    content: [{ type: "text", text: "Error: Invalid arguments for analyze_code" }],
    isError: true,
  };
}

/**
 * Fixes code issues in a project directory
 */
export async function handleFixProject(args: any) {
  if (args && typeof args === 'object' && 'directory' in args && typeof args.directory === 'string') {
    try {
      const { directory } = args;
      const recursive = args.recursive !== false; // Default to true
      const extensions = args.extensions || DEFAULT_EXTENSIONS;
      const fixTypes = args.fixTypes || ['all'];
      
      // Get all files in the directory
      const files = await getFilesInDirectory(directory, recursive, extensions);
      
      // Fix each file
      const results = await Promise.all(
        files.map(async (filePath) => {
          try {
            // Read the file
            const content = await fs.readFile(filePath, 'utf8');
            
            // Determine the language
            const language = getLanguageFromExtension(filePath);
            
            if (!language) {
              return {
                path: filePath,
                error: 'Could not determine language',
                message: `Skipped file: ${filePath}`
              };
            }
            
            // Fix the code
            const result = fixCode(content, language, fixTypes);
            
            // Write the fixed code back to the file
            await fs.writeFile(filePath, result.fixedCode);
            
            return {
              path: filePath,
              language,
              fixes: result.fixes,
              message: `Fixed ${result.fixes.length} issues in ${filePath}`
            };
          } catch (error) {
            return {
              path: filePath,
              error: String(error),
              message: `Failed to fix file: ${filePath}`
            };
          }
        })
      );
      
      // Count the total number of fixes
      const totalFixes = results.reduce((total, result) => {
        if ('fixes' in result && Array.isArray(result.fixes)) {
          return total + result.fixes.length;
        }
        return total;
      }, 0);
      
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            directory,
            fixTypes,
            totalFiles: results.length,
            totalFixes,
            results,
            message: `Fixed ${totalFixes} issues in ${results.length} files.`
          }, null, 2)
        }],
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            directory: args.directory,
            error: String(error),
            message: `Failed to fix project directory: ${args.directory}`
          }, null, 2)
        }],
        isError: true,
      };
    }
  }
  
  return {
    content: [{ type: "text", text: "Error: Invalid arguments for fix_project" }],
    isError: true,
  };
}

/**
 * Fixes code issues
 */
function fixCode(content: string, language: string, fixTypes: string[]): { fixedCode: string; fixes: any[] } {
  let fixedCode = content;
  const fixes = [];
  
  // Get the fixers for the language
  const fixers = codeFixers[language] || [];
  
  // Apply each fixer
  for (const fixer of fixers) {
    // Skip if the fix type is not included
    if (!fixTypes.includes('all') && !fixTypes.includes(fixer.type)) {
      continue;
    }
    
    // Apply the fix
    const originalCode = fixedCode;
    
    // Handle both string and function replacements
    if (typeof fixer.replacement === 'string') {
      fixedCode = fixedCode.replace(fixer.pattern, fixer.replacement);
    } else if (typeof fixer.replacement === 'function') {
      fixedCode = fixedCode.replace(fixer.pattern, fixer.replacement as any);
    }
    
    // Check if the code was changed
    if (originalCode !== fixedCode) {
      fixes.push({
        type: fixer.type,
        description: fixer.description,
      });
    }
  }
  
  return { fixedCode, fixes };
}

/**
 * Analyzes code for issues
 */
function analyzeCode(content: string, language: string): any[] {
  const issues = [];
  
  // Get the fixers for the language
  const fixers = codeFixers[language] || [];
  
  // Check for each issue
  for (const fixer of fixers) {
    // Find all matches
    const matches = content.match(fixer.pattern);
    
    if (matches) {
      for (const match of matches) {
        issues.push({
          type: fixer.type,
          description: fixer.description,
          match,
        });
      }
    }
  }
  
  return issues;
}

/**
 * Gets the language from a file extension
 */
function getLanguageFromExtension(filePath: string): string {
  const extension = path.extname(filePath).toLowerCase();
  
  switch (extension) {
    case '.js':
    case '.jsx':
      return 'javascript';
    case '.ts':
    case '.tsx':
      return 'typescript';
    case '.css':
    case '.scss':
    case '.less':
      return 'css';
    case '.html':
    case '.htm':
      return 'html';
    case '.json':
      return 'json';
    case '.vue':
      return 'vue';
    case '.svelte':
      return 'svelte';
    default:
      return '';
  }
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
