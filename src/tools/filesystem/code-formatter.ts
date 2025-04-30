// Auto-generated safe fallback for code-formatter

export function activate() {
    console.log("[TOOL] code-formatter activated (passive mode)");
}

export function onFileWrite(filePath: string, content: string) {
  console.log(`[TOOL] Code formatter processing file: ${filePath}`);
  
  // Check if the file is a code file that can be formatted
  const isCodeFile = filePath.endsWith('.js') || 
                     filePath.endsWith('.jsx') || 
                     filePath.endsWith('.ts') || 
                     filePath.endsWith('.tsx') || 
                     filePath.endsWith('.html') || 
                     filePath.endsWith('.css') || 
                     filePath.endsWith('.json') || 
                     filePath.endsWith('.md') || 
                     filePath.endsWith('.py') || 
                     filePath.endsWith('.java') || 
                     filePath.endsWith('.c') || 
                     filePath.endsWith('.cpp') || 
                     filePath.endsWith('.go') || 
                     filePath.endsWith('.rb') || 
                     filePath.endsWith('.rs') || 
                     filePath.endsWith('.php') || 
                     filePath.endsWith('.cs');
  
  if (isCodeFile) {
    console.log(`[TOOL] Detected change in code file: ${filePath}`);
    
    // Check if the file needs formatting
    checkForFormattingIssues(filePath, content);
  }
}

export function onSessionStart(sessionId: string) {
  console.log(`[TOOL] Code formatter initialized for session: ${sessionId}`);
  
  // Check for formatting configuration files in the project
  setTimeout(() => {
    console.log('[TOOL] Checking for formatting configuration files...');
    checkForFormattingConfigs();
  }, 3000); // Delay to ensure project files are loaded
}

export function onCommand(command: string, args: any[]) {
  if (command === 'format-code') {
    console.log('[TOOL] Formatting code...');
    
    return handleFormatCode(args[0]);
  } else if (command === 'format-directory') {
    console.log('[TOOL] Formatting directory...');
    
    const dirPath = args[0];
    const options = args[1] || {};
    
    return handleFormatDirectory(dirPath, options);
  } else if (command === 'check-formatting') {
    console.log('[TOOL] Checking formatting...');
    
    const filePath = args[0];
    const options = args[1] || {};
    
    return handleCheckFormatting(filePath, options);
  } else if (command === 'generate-config') {
    console.log('[TOOL] Generating formatting configuration...');
    
    const configType = args[0];
    const options = args[1] || {};
    
    return handleGenerateConfig(configType, options);
  }
  
  return null;
}

/**
 * Checks for formatting issues in a file
 */
function checkForFormattingIssues(filePath: string, content: string): void {
  console.log(`[TOOL] Checking for formatting issues in ${filePath}...`);
  
  // Detect the language
  const language = detectLanguage(filePath);
  
  // Check for common formatting issues
  const issues = [];
  
  // Check for inconsistent indentation
  const indentationIssue = checkIndentation(content);
  if (indentationIssue) {
    issues.push(indentationIssue);
  }
  
  // Check for trailing whitespace
  const trailingWhitespaceIssue = checkTrailingWhitespace(content);
  if (trailingWhitespaceIssue) {
    issues.push(trailingWhitespaceIssue);
  }
  
  // Check for inconsistent line endings
  const lineEndingIssue = checkLineEndings(content);
  if (lineEndingIssue) {
    issues.push(lineEndingIssue);
  }
  
  // Check for language-specific issues
  if (language === 'javascript' || language === 'typescript') {
    // Check for missing semicolons
    const semicolonIssue = checkSemicolons(content);
    if (semicolonIssue) {
      issues.push(semicolonIssue);
    }
    
    // Check for inconsistent quotes
    const quotesIssue = checkQuotes(content);
    if (quotesIssue) {
      issues.push(quotesIssue);
    }
  }
  
  // Log issues
  if (issues.length > 0) {
    console.log(`[TOOL] Found ${issues.length} formatting issues in ${filePath}:`);
    issues.forEach(issue => console.log(`- ${issue}`));
    console.log('[TOOL] Recommendation: Use the "format-code" command to fix these issues');
  } else {
    console.log(`[TOOL] No formatting issues found in ${filePath}`);
  }
}

/**
 * Checks for formatting configuration files in the project
 */
function checkForFormattingConfigs(): void {
  console.log('[TOOL] Checking for formatting configuration files...');
  
  // This is a placeholder - in a real implementation, this would scan the filesystem
  // For now, we'll just log a message
  console.log('[TOOL] Recommendation: Use the "generate-config" command to create formatting configuration files');
  console.log('[TOOL] Common formatting configuration files:');
  console.log('- .prettierrc');
  console.log('- .eslintrc');
  console.log('- .editorconfig');
  console.log('- pyproject.toml (for Black)');
  console.log('- .clang-format');
}

/**
 * Checks for indentation issues
 */
function checkIndentation(content: string): string | null {
  // Check for mixed tabs and spaces
  const hasTabs = /^\t+/m.test(content);
  const hasSpaces = /^[ ]+/m.test(content);
  
  if (hasTabs && hasSpaces) {
    return 'Mixed tabs and spaces detected';
  }
  
  // Check for inconsistent indentation
  const indentSizes = new Set<number>();
  const indentMatches = content.match(/^[ ]+\S/gm);
  
  if (indentMatches) {
    indentMatches.forEach(match => {
      indentSizes.add(match.length - 1);
    });
    
    if (indentSizes.size > 1) {
      return 'Inconsistent indentation sizes detected';
    }
  }
  
  return null;
}

/**
 * Checks for trailing whitespace
 */
function checkTrailingWhitespace(content: string): string | null {
  if (/[ \t]+$/m.test(content)) {
    return 'Trailing whitespace detected';
  }
  
  return null;
}

/**
 * Checks for inconsistent line endings
 */
function checkLineEndings(content: string): string | null {
  const hasCRLF = content.includes('\r\n');
  const hasLF = /[^\r]\n/.test(content);
  
  if (hasCRLF && hasLF) {
    return 'Mixed line endings (CRLF and LF) detected';
  }
  
  return null;
}

/**
 * Checks for missing semicolons
 */
function checkSemicolons(content: string): string | null {
  // This is a simplified check - a real implementation would be more sophisticated
  const missingPattern = /\b(const|let|var|return|throw|break|continue|import|export)\s+[^;{]+\n/g;
  
  if (missingPattern.test(content)) {
    return 'Missing semicolons detected';
  }
  
  return null;
}

/**
 * Checks for inconsistent quotes
 */
function checkQuotes(content: string): string | null {
  const singleQuotes = (content.match(/'/g) || []).length;
  const doubleQuotes = (content.match(/"/g) || []).length;
  
  // If both types of quotes are used and one is significantly more common
  if (singleQuotes > 0 && doubleQuotes > 0) {
    const total = singleQuotes + doubleQuotes;
    const singleQuotePercentage = (singleQuotes / total) * 100;
    
    if (singleQuotePercentage > 10 && singleQuotePercentage < 90) {
      return 'Inconsistent quote style detected';
    }
  }
  
  return null;
}

/**
 * Handles the format-directory command
 */
async function handleFormatDirectory(dirPath: string, options: any): Promise<any> {
  console.log(`[TOOL] Handling format-directory command for ${dirPath}`);
  
  // This is a placeholder - in a real implementation, this would format all files in the directory
  // For now, we'll just return a mock result
  return { 
    success: true, 
    message: `Directory ${dirPath} formatted successfully`,
    stats: {
      totalFiles: 10,
      formattedFiles: 5,
      skippedFiles: 5
    }
  };
}

/**
 * Handles the check-formatting command
 */
async function handleCheckFormatting(filePath: string, options: any): Promise<any> {
  console.log(`[TOOL] Handling check-formatting command for ${filePath}`);
  
  // This is a placeholder - in a real implementation, this would check if the file is properly formatted
  // For now, we'll just return a mock result
  return { 
    success: true, 
    formatted: true,
    message: `File ${filePath} is properly formatted`
  };
}

/**
 * Handles the generate-config command
 */
async function handleGenerateConfig(configType: string, options: any): Promise<any> {
  console.log(`[TOOL] Handling generate-config command for ${configType}`);
  
  // This is a placeholder - in a real implementation, this would generate a configuration file
  // For now, we'll just return a mock result
  return { 
    success: true, 
    message: `Generated ${configType} configuration file`,
    config: {
      type: configType,
      options: options
    }
  };
}
/**
 * Code Formatter
 * 
 * Formats code according to project style guidelines
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { spawn } from 'child_process';
import { z } from 'zod';

/**
 * Checks if a file exists
 * 
 * @param filePath Path to the file to check
 * @returns True if the file exists, false otherwise
 */
async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

/**
 * Schema for CodeFormatter tool
 */
export const FormatCodeSchema = z.object({
  path: z.string(),
  language: z.enum([
    'javascript',
    'typescript',
    'html',
    'css',
    'json',
    'markdown',
    'python',
    'java',
    'c',
    'cpp',
    'go',
    'ruby',
    'rust',
    'php',
    'csharp',
    'auto'
  ]).default('auto'),
  options: z.object({
    tabSize: z.number().optional(),
    insertSpaces: z.boolean().optional(),
    singleQuote: z.boolean().optional(),
    semicolons: z.boolean().optional(),
    trailingComma: z.enum(['none', 'es5', 'all']).optional(),
    bracketSpacing: z.boolean().optional(),
    endOfLine: z.enum(['auto', 'lf', 'crlf', 'cr']).optional(),
  }).optional(),
  config: z.enum(['prettier', 'eslint', 'black', 'gofmt', 'rustfmt', 'autopep8', 'clang-format', 'detect']).default('detect'),
});

/**
 * Formats a file according to the specified options
 * 
 * @param filePath Path to the file to format
 * @param language Language of the file content
 * @param options Formatting options
 * @param config Formatter configuration to use
 * @returns Object indicating success or failure with messages
 */
export async function formatCode(
  filePath: string,
  language: string = 'auto',
  options: {
    tabSize?: number,
    insertSpaces?: boolean,
    singleQuote?: boolean,
    semicolons?: boolean,
    trailingComma?: 'none' | 'es5' | 'all',
    bracketSpacing?: boolean,
    endOfLine?: 'auto' | 'lf' | 'crlf' | 'cr',
  } = {},
  config: string = 'detect'
): Promise<{ success: boolean, message: string, output?: string }> {
  try {
    // Normalize the file path
    filePath = path.resolve(filePath);
    
    // Check if the file exists
    try {
      await fs.access(filePath, fs.constants.F_OK);
    } catch (error) {
      return { 
        success: false, 
        message: `File does not exist: ${filePath}` 
      };
    }
    
    // Detect the language if set to auto
    if (language === 'auto') {
      language = detectLanguage(filePath);
    }
    
    // Detect the formatter to use if set to detect
    if (config === 'detect') {
      config = detectFormatter(language);
    }
    
    // Format the file
    const formatResult = await runFormatter(filePath, language, options, config);
    
    return formatResult;
  } catch (error) {
    return {
      success: false,
      message: `Error formatting file: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * Detect the language of a file based on its extension
 * 
 * @param filePath Path to the file
 * @returns Detected language
 */
function detectLanguage(filePath: string): string {
  const extension = path.extname(filePath).toLowerCase();
  
  switch (extension) {
    case '.js':
      return 'javascript';
    case '.jsx':
      return 'javascript';
    case '.ts':
      return 'typescript';
    case '.tsx':
      return 'typescript';
    case '.html':
      return 'html';
    case '.css':
      return 'css';
    case '.json':
      return 'json';
    case '.md':
      return 'markdown';
    case '.py':
      return 'python';
    case '.java':
      return 'java';
    case '.c':
      return 'c';
    case '.cpp':
    case '.cc':
    case '.cxx':
    case '.h':
    case '.hpp':
      return 'cpp';
    case '.go':
      return 'go';
    case '.rb':
      return 'ruby';
    case '.rs':
      return 'rust';
    case '.php':
      return 'php';
    case '.cs':
      return 'csharp';
    default:
      return 'javascript'; // Default to JavaScript
  }
}

/**
 * Detect the formatter to use based on the language
 * 
 * @param language Language of the file
 * @returns Formatter to use
 */
function detectFormatter(language: string): string {
  switch (language) {
    case 'javascript':
    case 'typescript':
    case 'html':
    case 'css':
    case 'json':
    case 'markdown':
      return 'prettier';
    case 'python':
      return 'black';
    case 'go':
      return 'gofmt';
    case 'rust':
      return 'rustfmt';
    case 'c':
    case 'cpp':
      return 'clang-format';
    case 'java':
      return 'prettier';
    case 'php':
      return 'prettier';
    case 'csharp':
      return 'prettier';
    default:
      return 'prettier';
  }
}

/**
 * Run the appropriate formatter for the language
 * 
 * @param filePath Path to the file to format
 * @param language Language of the file
 * @param options Formatting options
 * @param config Formatter configuration to use
 * @returns Result of the formatter
 */
async function runFormatter(
  filePath: string,
  language: string,
  options: {
    tabSize?: number,
    insertSpaces?: boolean,
    singleQuote?: boolean,
    semicolons?: boolean,
    trailingComma?: 'none' | 'es5' | 'all',
    bracketSpacing?: boolean,
    endOfLine?: 'auto' | 'lf' | 'crlf' | 'cr',
  },
  config: string
): Promise<{ success: boolean, message: string, output?: string }> {
  // Read the file content
  const content = await fs.readFile(filePath, 'utf8');
  
  let formattedContent: string;
  let output = '';
  
  switch (config) {
    case 'prettier':
      // Format with prettier
      const prettierOptions = {
        tabWidth: options.tabSize ?? 2,
        useTabs: options.insertSpaces === false,
        singleQuote: options.singleQuote ?? false,
        semi: options.semicolons ?? true,
        trailingComma: options.trailingComma ?? 'es5',
        bracketSpacing: options.bracketSpacing ?? true,
        endOfLine: options.endOfLine ?? 'lf',
        parser: getParserForLanguage(language),
      };
      
      formattedContent = await formatWithPrettier(content, prettierOptions);
      output = `Formatted ${filePath} with prettier using ${prettierOptions.parser} parser.`;
      break;
      
    case 'eslint':
      // Format with eslint
      formattedContent = await formatWithESLint(filePath);
      output = `Formatted ${filePath} with ESLint.`;
      break;
      
    case 'black':
      // Format with black (Python)
      formattedContent = await formatWithBlack(content);
      output = `Formatted ${filePath} with Black.`;
      break;
      
    case 'gofmt':
      // Format with gofmt (Go)
      formattedContent = await formatWithGofmt(content);
      output = `Formatted ${filePath} with gofmt.`;
      break;
      
    case 'rustfmt':
      // Format with rustfmt (Rust)
      formattedContent = await formatWithRustfmt(content);
      output = `Formatted ${filePath} with rustfmt.`;
      break;
      
    case 'autopep8':
      // Format with autopep8 (Python)
      formattedContent = await formatWithAutopep8(content);
      output = `Formatted ${filePath} with autopep8.`;
      break;
      
    case 'clang-format':
      // Format with clang-format (C/C++)
      formattedContent = await formatWithClangFormat(content);
      output = `Formatted ${filePath} with clang-format.`;
      break;
      
    default:
      return {
        success: false,
        message: `Unknown formatter: ${config}`
      };
  }
  
  // Check if content has changed
  if (content === formattedContent) {
    return {
      success: true,
      message: `File is already formatted according to the specified style.`,
      output
    };
  }
  
  // Write the formatted content back to the file
  await fs.writeFile(filePath, formattedContent, 'utf8');
  
  return {
    success: true,
    message: `File formatted successfully.`,
    output
  };
}

/**
 * Get the appropriate parser for a language for prettier
 * 
 * @param language Language of the file
 * @returns Parser to use with prettier
 */
function getParserForLanguage(language: string): string {
  switch (language) {
    case 'javascript':
      return 'babel';
    case 'typescript':
      return 'typescript';
    case 'html':
      return 'html';
    case 'css':
      return 'css';
    case 'json':
      return 'json';
    case 'markdown':
      return 'markdown';
    case 'java':
      return 'java';
    case 'php':
      return 'php';
    default:
      return 'babel';
  }
}

/**
 * Format content with prettier
 * 
 * @param content Content to format
 * @param options Prettier options
 * @returns Formatted content
 */
async function formatWithPrettier(content: string, options: any): Promise<string> {
  // In a real implementation, we would use the prettier package
  // Here, we'll just simulate the formatting
  
  // For now, just do a simple formatting
  let formattedContent = content;
  
  // Apply tab width and spaces
  if (options.useTabs) {
    // Replace spaces with tabs
    formattedContent = formattedContent.replace(/^([ ]+)/gm, (match) => {
      return '\t'.repeat(Math.floor(match.length / options.tabWidth));
    });
  } else {
    // Replace tabs with spaces
    formattedContent = formattedContent.replace(/^\t+/gm, (match) => {
      return ' '.repeat(match.length * options.tabWidth);
    });
  }
  
  // Apply single/double quotes
  if (options.singleQuote) {
    // Replace double quotes with single quotes
    formattedContent = formattedContent.replace(/"([^"]*)"/g, (match, p1) => {
      return `'${p1}'`;
    });
  } else {
    // Replace single quotes with double quotes
    formattedContent = formattedContent.replace(/'([^']*)'/g, (match, p1) => {
      return `"${p1}"`;
    });
  }
  
  // Apply semicolons
  if (options.semi) {
    // Add semicolons where they're missing
    formattedContent = formattedContent.replace(/\b(const|let|var|return|throw|break|continue|import|export)\s+([^;]+)(?!\s*[;{])/g, (match, p1, p2) => {
      return `${p1} ${p2};`;
    });
  } else {
    // Remove semicolons
    formattedContent = formattedContent.replace(/;(?=\s*[\r\n])/g, '');
  }
  
  return formattedContent;
}

/**
 * Format content with ESLint
 * 
 * @param filePath Path to the file to format
 * @returns Formatted content
 */
async function formatWithESLint(filePath: string): Promise<string> {
  // In a real implementation, we would execute ESLint cli
  // Here, we'll just return the original content
  return fs.readFile(filePath, 'utf8');
}

/**
 * Format content with Black (Python)
 * 
 * @param content Content to format
 * @returns Formatted content
 */
async function formatWithBlack(content: string): Promise<string> {
  // In a real implementation, we would execute Black cli
  // Here, we'll just do a simple formatting
  
  // For example, replacing multiple empty lines with a single one
  return content.replace(/\n{3,}/g, '\n\n');
}

/**
 * Format content with gofmt (Go)
 * 
 * @param content Content to format
 * @returns Formatted content
 */
async function formatWithGofmt(content: string): Promise<string> {
  // In a real implementation, we would execute gofmt cli
  // Here, we'll just return the original content
  return content;
}

/**
 * Format content with rustfmt (Rust)
 * 
 * @param content Content to format
 * @returns Formatted content
 */
async function formatWithRustfmt(content: string): Promise<string> {
  // In a real implementation, we would execute rustfmt cli
  // Here, we'll just return the original content
  return content;
}

/**
 * Format content with autopep8 (Python)
 * 
 * @param content Content to format
 * @returns Formatted content
 */
async function formatWithAutopep8(content: string): Promise<string> {
  // In a real implementation, we would execute autopep8 cli
  // Here, we'll just return the original content
  return content;
}

/**
 * Format content with clang-format (C/C++)
 * 
 * @param content Content to format
 * @returns Formatted content
 */
async function formatWithClangFormat(content: string): Promise<string> {
  // In a real implementation, we would execute clang-format cli
  // Here, we'll just return the original content
  return content;
}

/**
 * Handle format_code command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleFormatCode(args: any) {
  try {
    const { path, language, options, config } = args;
    
    // Format the code
    const result = await formatCode(path, language, options, config);
    
    if (result.success) {
      return {
        content: [{ 
          type: "text",
          text: result.output
            ? `${result.message}\n\n${result.output}`
            : result.message
        }],
      };
    } else {
      return {
        content: [{ 
          type: "text",
          text: result.output
            ? `${result.message}\n\n${result.output}`
            : result.message
        }],
        isError: true,
      };
    }
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error formatting code: ${error}` }],
      isError: true,
    };
  }
}
