/**
 * DebugAssist Tool
 * 
 * Helps identify and fix bugs in code
 * Provides interactive debugging assistance
 * Implements with runtime analysis and error pattern recognition
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { z } from 'zod';

// Define schemas for DebugAssist tool
export const AnalyzeErrorSchema = z.object({
  errorMessage: z.string(),
  errorStack: z.string().optional(),
  errorType: z.string().optional(),
  filePath: z.string().optional(),
  lineNumber: z.number().optional(),
  columnNumber: z.number().optional(),
  codeContext: z.string().optional(),
  language: z.string().optional(),
  framework: z.string().optional(),
});

export const GenerateFixSchema = z.object({
  errorAnalysis: z.any(),
  filePath: z.string(),
  applyFix: z.boolean().default(false),
  generateMultipleOptions: z.boolean().default(false),
});

export const ExplainErrorSchema = z.object({
  errorMessage: z.string(),
  errorStack: z.string().optional(),
  errorType: z.string().optional(),
  language: z.string().optional(),
  framework: z.string().optional(),
  detailLevel: z.enum(['basic', 'intermediate', 'advanced']).default('intermediate'),
});

export const CreateDebuggerConfigSchema = z.object({
  language: z.string(),
  framework: z.string().optional(),
  projectPath: z.string(),
  debugTool: z.enum(['vscode', 'chrome', 'firefox', 'node', 'jest', 'mocha']).default('vscode'),
  configPath: z.string().optional(),
});

// Types for error analysis
interface ErrorAnalysis {
  errorType: string;
  errorCategory: 'syntax' | 'runtime' | 'logical' | 'type' | 'dependency' | 'unknown';
  rootCause: string;
  affectedFile?: string;
  lineNumber?: number;
  columnNumber?: number;
  codeSnippet?: string;
  suggestedFixes: SuggestedFix[];
  relatedPatterns: string[];
  confidence: number;
}

interface SuggestedFix {
  description: string;
  code: string;
  replacementType: 'inline' | 'function' | 'file';
  startLine?: number;
  endLine?: number;
  confidence: number;
}

interface DebuggerConfig {
  type: string;
  name: string;
  request: string;
  configurations: any[];
}

/**
 * Analyze an error message and stack trace
 */
export async function handleAnalyzeError(args: any) {
  try {
    const options = args as z.infer<typeof AnalyzeErrorSchema>;
    
    // Parse error message and stack trace
    const analysis = analyzeError(options);
    
    // If file path is provided, read the file to get more context
    if (options.filePath) {
      try {
        const fileContent = await fs.readFile(options.filePath, 'utf-8');
        const lines = fileContent.split('\n');
        
        // Get code context around the error
        if (options.lineNumber) {
          const startLine = Math.max(0, options.lineNumber - 5);
          const endLine = Math.min(lines.length, options.lineNumber + 5);
          const codeContext = lines.slice(startLine, endLine).join('\n');
          
          // Enhance analysis with code context
          analysis.codeSnippet = codeContext;
          
          // Refine analysis based on code context
          refineAnalysisWithCodeContext(analysis, codeContext, options.language);
        }
      } catch (error) {
        console.error(`Error reading file ${options.filePath}:`, error);
      }
    }
    
    return {
      content: [{
        type: "text",
        text: formatErrorAnalysis(analysis)
      }],
      data: analysis,
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error analyzing error: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Generate a fix for an error
 */
export async function handleGenerateFix(args: any) {
  try {
    const options = args as z.infer<typeof GenerateFixSchema>;
    
    // Check if file exists
    try {
      await fs.access(options.filePath);
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error: File ${options.filePath} does not exist` }],
        isError: true,
      };
    }
    
    // Read file content
    const fileContent = await fs.readFile(options.filePath, 'utf-8');
    
    // Generate fixes
    const fixes = generateFixes(options.errorAnalysis, fileContent, options.filePath, options.generateMultipleOptions);
    
    // Apply fix if requested
    if (options.applyFix && fixes.length > 0) {
      const fixedContent = applyFix(fileContent, fixes[0]);
      
      try {
        await fs.writeFile(options.filePath, fixedContent);
      } catch (error) {
        return {
          content: [{ type: "text", text: `Error applying fix to ${options.filePath}: ${error}` }],
          isError: true,
        };
      }
      
      return {
        content: [{
          type: "text",
          text: `Fix applied to ${options.filePath}:\n\n${formatFix(fixes[0])}\n\nThe file has been updated.`
        }],
        data: { fixes, appliedFix: fixes[0] },
      };
    }
    
    // Return fixes without applying
    return {
      content: [{
        type: "text",
        text: options.generateMultipleOptions
          ? `Generated ${fixes.length} potential fixes for ${options.filePath}:\n\n${fixes.map((fix, index) => `Option ${index + 1}:\n${formatFix(fix)}`).join('\n\n')}`
          : `Generated fix for ${options.filePath}:\n\n${formatFix(fixes[0])}`
      }],
      data: { fixes },
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error generating fix: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Explain an error in plain language
 */
export async function handleExplainError(args: any) {
  try {
    const options = args as z.infer<typeof ExplainErrorSchema>;
    
    // Generate explanation
    const explanation = explainError(options.errorMessage, options.errorStack, options.errorType, options.language, options.framework, options.detailLevel);
    
    return {
      content: [{
        type: "text",
        text: explanation
      }],
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error explaining error: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Create a debugger configuration
 */
export async function handleCreateDebuggerConfig(args: any) {
  try {
    const options = args as z.infer<typeof CreateDebuggerConfigSchema>;
    
    // Check if project path exists
    try {
      await fs.access(options.projectPath);
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error: Project path ${options.projectPath} does not exist` }],
        isError: true,
      };
    }
    
    // Generate debugger configuration
    const config = generateDebuggerConfig(options);
    
    // Write configuration to file if path is provided
    if (options.configPath) {
      try {
        await fs.mkdir(path.dirname(options.configPath), { recursive: true });
        await fs.writeFile(options.configPath, JSON.stringify(config, null, 2));
      } catch (error) {
        return {
          content: [{ type: "text", text: `Error writing debugger configuration to ${options.configPath}: ${error}` }],
          isError: true,
        };
      }
      
      return {
        content: [{
          type: "text",
          text: `Debugger configuration for ${options.language} created and saved to ${options.configPath}`
        }],
        data: config,
      };
    }
    
    // Return configuration without writing to file
    return {
      content: [{
        type: "text",
        text: `Generated debugger configuration for ${options.language}:\n\n${JSON.stringify(config, null, 2)}`
      }],
      data: config,
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error creating debugger configuration: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Analyze an error message and stack trace
 */
function analyzeError(options: z.infer<typeof AnalyzeErrorSchema>): ErrorAnalysis {
  const { errorMessage, errorStack, errorType, language } = options;
  
  // Default error analysis
  const analysis: ErrorAnalysis = {
    errorType: errorType || 'Unknown Error',
    errorCategory: 'unknown',
    rootCause: 'Unknown',
    affectedFile: options.filePath,
    lineNumber: options.lineNumber,
    columnNumber: options.columnNumber,
    codeSnippet: options.codeContext,
    suggestedFixes: [],
    relatedPatterns: [],
    confidence: 0.5,
  };
  
  // Parse error message to determine type and category
  if (errorMessage.includes('SyntaxError') || errorMessage.includes('syntax error')) {
    analysis.errorType = 'Syntax Error';
    analysis.errorCategory = 'syntax';
    analysis.confidence = 0.9;
    
    // Common syntax errors
    if (errorMessage.includes('Unexpected token')) {
      const match = errorMessage.match(/Unexpected token '(.+?)'/);
      const token = match ? match[1] : 'unknown';
      analysis.rootCause = `Unexpected token '${token}' found in code`;
      analysis.relatedPatterns = ['Missing closing bracket/parenthesis', 'Typo in code', 'Invalid syntax'];
      
      analysis.suggestedFixes.push({
        description: `Check for missing closing brackets or parentheses before '${token}'`,
        code: `// Look for unbalanced brackets or parentheses\n// Example: if (condition { ... }\n// Should be: if (condition) { ... }`,
        replacementType: 'inline',
        confidence: 0.8,
      });
    } else if (errorMessage.includes('Unexpected end of input')) {
      analysis.rootCause = 'Unexpected end of input - likely missing closing bracket, brace, or parenthesis';
      analysis.relatedPatterns = ['Unclosed string', 'Unclosed bracket/brace/parenthesis', 'Incomplete code block'];
      
      analysis.suggestedFixes.push({
        description: 'Check for unclosed brackets, braces, or parentheses',
        code: `// Check for unclosed brackets, braces, or parentheses\n// Example: function example() { console.log("Hello world";\n// Should be: function example() { console.log("Hello world"); }`,
        replacementType: 'inline',
        confidence: 0.8,
      });
    }
  } else if (errorMessage.includes('TypeError') || errorMessage.includes('type error')) {
    analysis.errorType = 'Type Error';
    analysis.errorCategory = 'runtime';
    analysis.confidence = 0.85;
    
    // Common type errors
    if (errorMessage.includes('is not a function')) {
      const match = errorMessage.match(/(.+?) is not a function/);
      const func = match ? match[1] : 'unknown';
      analysis.rootCause = `Attempted to call '${func}' as a function, but it's not a function`;
      analysis.relatedPatterns = ['Typo in function name', 'Function not defined', 'Variable holding unexpected type'];
      
      analysis.suggestedFixes.push({
        description: `Check if '${func}' is defined and is actually a function`,
        code: `// Check if ${func} is defined and is a function\nif (typeof ${func} === 'function') {\n  ${func}();\n} else {\n  console.error('${func} is not a function');\n}`,
        replacementType: 'inline',
        confidence: 0.7,
      });
    } else if (errorMessage.includes('Cannot read property') || errorMessage.includes('Cannot read properties')) {
      const propMatch = errorMessage.match(/property '(.+?)' of/);
      const prop = propMatch ? propMatch[1] : 'unknown';
      const objMatch = errorMessage.match(/of (undefined|null)/);
      const obj = objMatch ? objMatch[1] : 'undefined';
      
      analysis.rootCause = `Attempted to access property '${prop}' of ${obj}`;
      analysis.relatedPatterns = ['Null/undefined object access', 'Missing initialization', 'Race condition'];
      
      analysis.suggestedFixes.push({
        description: `Add null/undefined check before accessing '${prop}'`,
        code: `// Add null/undefined check\nif (object && object.${prop}) {\n  // Access object.${prop} safely\n}`,
        replacementType: 'inline',
        confidence: 0.9,
      });
      
      if (language === 'javascript' || language === 'typescript') {
        analysis.suggestedFixes.push({
          description: `Use optional chaining for '${prop}'`,
          code: `// Use optional chaining\nconst value = object?.${prop};\n// Instead of: const value = object.${prop};`,
          replacementType: 'inline',
          confidence: 0.9,
        });
      }
    }
  } else if (errorMessage.includes('ReferenceError') || errorMessage.includes('is not defined')) {
    analysis.errorType = 'Reference Error';
    analysis.errorCategory = 'runtime';
    analysis.confidence = 0.9;
    
    const match = errorMessage.match(/(.+?) is not defined/);
    const variable = match ? match[1] : 'unknown';
    
    analysis.rootCause = `Variable '${variable}' is used but not defined`;
    analysis.relatedPatterns = ['Typo in variable name', 'Missing import/require', 'Variable out of scope'];
    
    analysis.suggestedFixes.push({
      description: `Check if '${variable}' is properly defined or imported`,
      code: `// Check for typos in the variable name\n// Make sure the variable is defined before use\n// If it's from a module, check the import statement`,
      replacementType: 'inline',
      confidence: 0.7,
    });
    
    if (language === 'javascript' || language === 'typescript') {
      analysis.suggestedFixes.push({
        description: `Import '${variable}' if it's from a module`,
        code: `import { ${variable} } from './module';\n// or\nconst ${variable} = require('./module').${variable};`,
        replacementType: 'inline',
        confidence: 0.6,
      });
    }
  }
  
  // Parse stack trace if available
  if (errorStack) {
    const stackLines = errorStack.split('\n');
    
    // Extract file, line, and column information from the first relevant stack frame
    for (const line of stackLines) {
      // Skip library code or irrelevant lines
      if (line.includes('node_modules') || line.includes('internal/') || !line.trim()) {
        continue;
      }
      
      // Extract file path, line number, and column number
      const fileMatch = line.match(/\((.+?):(\d+):(\d+)\)/) || line.match(/at (.+?):(\d+):(\d+)/);
      if (fileMatch) {
        analysis.affectedFile = analysis.affectedFile || fileMatch[1];
        analysis.lineNumber = analysis.lineNumber || parseInt(fileMatch[2], 10);
        analysis.columnNumber = analysis.columnNumber || parseInt(fileMatch[3], 10);
        break;
      }
    }
  }
  
  return analysis;
}

/**
 * Refine analysis with code context
 */
function refineAnalysisWithCodeContext(analysis: ErrorAnalysis, codeContext: string, language?: string): void {
  // Enhance analysis based on code context
  if (analysis.errorCategory === 'syntax') {
    // Look for unbalanced brackets, braces, or parentheses
    const openBrackets = (codeContext.match(/\(/g) || []).length;
    const closeBrackets = (codeContext.match(/\)/g) || []).length;
    const openBraces = (codeContext.match(/\{/g) || []).length;
    const closeBraces = (codeContext.match(/\}/g) || []).length;
    const openSquareBrackets = (codeContext.match(/\[/g) || []).length;
    const closeSquareBrackets = (codeContext.match(/\]/g) || []).length;
    
    if (openBrackets !== closeBrackets) {
      analysis.relatedPatterns.push('Unbalanced parentheses');
      analysis.suggestedFixes.push({
        description: `Add ${openBrackets > closeBrackets ? 'closing' : 'opening'} parenthesis`,
        code: openBrackets > closeBrackets ? 'Add ")" to balance parentheses' : 'Add "(" to balance parentheses',
        replacementType: 'inline',
        confidence: 0.8,
      });
    }
    
    if (openBraces !== closeBraces) {
      analysis.relatedPatterns.push('Unbalanced braces');
      analysis.suggestedFixes.push({
        description: `Add ${openBraces > closeBraces ? 'closing' : 'opening'} brace`,
        code: openBraces > closeBraces ? 'Add "}" to balance braces' : 'Add "{" to balance braces',
        replacementType: 'inline',
        confidence: 0.8,
      });
    }
    
    if (openSquareBrackets !== closeSquareBrackets) {
      analysis.relatedPatterns.push('Unbalanced square brackets');
      analysis.suggestedFixes.push({
        description: `Add ${openSquareBrackets > closeSquareBrackets ? 'closing' : 'opening'} square bracket`,
        code: openSquareBrackets > closeSquareBrackets ? 'Add "]" to balance square brackets' : 'Add "[" to balance square brackets',
        replacementType: 'inline',
        confidence: 0.8,
      });
    }
  } else if (analysis.errorCategory === 'runtime') {
    // Look for common runtime error patterns
    if (analysis.errorType === 'Type Error' && analysis.rootCause.includes('not a function')) {
      // Check for common typos in function names
      const functionMatch = analysis.rootCause.match(/Attempted to call '(.+?)' as a function/);
      if (functionMatch) {
        const funcName = functionMatch[1];
        
        // Look for similar function names in the code context
        const similarFunctions = findSimilarFunctionNames(funcName, codeContext);
        if (similarFunctions.length > 0) {
          analysis.suggestedFixes.push({
            description: `You might have meant to call ${similarFunctions[0]} instead of ${funcName}`,
            code: `// Replace:\n${funcName}()\n\n// With:\n${similarFunctions[0]}()`,
            replacementType: 'inline',
            confidence: 0.7,
          });
        }
      }
    }
  }
}

/**
 * Find similar function names in code
 */
function findSimilarFunctionNames(funcName: string, codeContext: string): string[] {
  const similarFunctions: string[] = [];
  
  // Simple implementation: look for words that are similar to the function name
  const words = codeContext.match(/\b\w+\b/g) || [];
  
  for (const word of words) {
    // Skip if the word is too short
    if (word.length < 3) continue;
    
    // Skip if the word is not similar enough
    if (word === funcName) continue;
    
    // Calculate similarity (simple implementation)
    const similarity = calculateSimilarity(funcName, word);
    
    if (similarity > 0.7) {
      similarFunctions.push(word);
    }
  }
  
  return similarFunctions;
}

/**
 * Calculate similarity between two strings (simple implementation)
 */
function calculateSimilarity(str1: string, str2: string): number {
  // Simple implementation: calculate the ratio of matching characters
  const len1 = str1.length;
  const len2 = str2.length;
  
  // If the lengths are too different, they're not similar
  if (Math.abs(len1 - len2) > Math.min(len1, len2) * 0.5) {
    return 0;
  }
  
  // Count matching characters
  let matches = 0;
  for (let i = 0; i < Math.min(len1, len2); i++) {
    if (str1[i] === str2[i]) {
      matches++;
    }
  }
  
  return matches / Math.max(len1, len2);
}

/**
 * Generate fixes for an error
 */
function generateFixes(errorAnalysis: ErrorAnalysis, fileContent: string, filePath: string, generateMultipleOptions: boolean): SuggestedFix[] {
  // Start with the suggested fixes from the analysis
  const fixes = [...errorAnalysis.suggestedFixes];
  
  // If we need to generate multiple options and don't have enough, add more
  if (generateMultipleOptions && fixes.length < 2) {
    // Generate alternative fixes based on the error category
    switch (errorAnalysis.errorCategory) {
      case 'syntax':
        // For syntax errors, suggest checking the documentation
        fixes.push({
          description: 'Check the language syntax documentation',
          code: `// Refer to the ${errorAnalysis.errorType} documentation\n// ${getDocumentationUrl(errorAnalysis.errorType)}`,
          replacementType: 'inline',
          confidence: 0.5,
        });
        break;
      
      case 'runtime':
        // For runtime errors, suggest adding debug logging
        fixes.push({
          description: 'Add debug logging to trace the issue',
          code: `// Add debug logging\nconsole.log('Debug:', { /* Add relevant variables here */ });\n// Then check the values at runtime`,
          replacementType: 'inline',
          confidence: 0.6,
        });
        break;
      
      case 'logical':
        // For logical errors, suggest reviewing the algorithm
        fixes.push({
          description: 'Review the algorithm logic',
          code: `// Review the algorithm logic\n// Consider edge cases and unexpected inputs\n// Add assertions to verify assumptions`,
          replacementType: 'inline',
          confidence: 0.5,
        });
        break;
    }
  }
  
  // If we have line number information, try to generate more specific fixes
  if (errorAnalysis.lineNumber && errorAnalysis.lineNumber > 0) {
    const lines = fileContent.split('\n');
    const errorLine = errorAnalysis.lineNumber - 1; // 0-based index
    
    if (errorLine < lines.length) {
      const line = lines[errorLine];
      
      // Generate a fix based on the specific line
      const specificFix = generateSpecificFix(line, errorAnalysis);
      if (specificFix) {
        fixes.push(specificFix);
      }
    }
  }
  
  return fixes;
}

/**
 * Generate a specific fix for a line of code
 */
function generateSpecificFix(line: string, errorAnalysis: ErrorAnalysis): SuggestedFix | null {
  // Generate a fix based on the error type and the specific line
  switch (errorAnalysis.errorCategory) {
    case 'syntax':
      // For syntax errors, try to fix the syntax
      if (line.includes('{') && !line.includes('}')) {
        return {
          description: 'Add missing closing brace',
          code: `${line}\n}`,
          replacementType: 'inline',
          startLine: errorAnalysis.lineNumber,
          endLine: errorAnalysis.lineNumber,
          confidence: 0.7,
        };
      } else if (line.includes('(') && !line.includes(')')) {
        return {
          description: 'Add missing closing parenthesis',
          code: `${line})`,
          replacementType: 'inline',
          startLine: errorAnalysis.lineNumber,
          endLine: errorAnalysis.lineNumber,
          confidence: 0.7,
        };
      } else if (line.includes('[') && !line.includes(']')) {
        return {
          description: 'Add missing closing bracket',
          code: `${line}]`,
          replacementType: 'inline',
          startLine: errorAnalysis.lineNumber,
          endLine: errorAnalysis.lineNumber,
          confidence: 0.7,
        };
      }
      break;
    
    case 'runtime':
      // For runtime errors, try to add error handling
      if (errorAnalysis.errorType === 'Type Error' && errorAnalysis.rootCause.includes('null') || errorAnalysis.rootCause.includes('undefined')) {
        // Extract the property being accessed
        const propMatch = errorAnalysis.rootCause.match(/property '(.+?)' of/);
        if (propMatch) {
          const prop = propMatch[1];
          
          // Look for the object being accessed
          const objMatch = line.match(new RegExp(`(\\w+)\\.${prop}`));
          if (objMatch) {
            const obj = objMatch[1];
            return {
              description: `Add null/undefined check for ${obj}`,
              code: `if (${obj} && ${obj}.${prop}) {\n  ${line}\n}`,
              replacementType: 'inline',
              startLine: errorAnalysis.lineNumber,
              endLine: errorAnalysis.lineNumber,
              confidence: 0.8,
            };
          }
        }
      }
      break;
  }
  
  return null;
}

/**
 * Apply a fix to file content
 */
function applyFix(fileContent: string, fix: SuggestedFix): string {
  const lines = fileContent.split('\n');
  
  if (fix.startLine && fix.endLine) {
    // Replace specific lines
    const startIndex = fix.startLine - 1; // 0-based index
    const endIndex = fix.endLine - 1; // 0-based index
    
    // Replace the lines with the fix
    const beforeLines = lines.slice(0, startIndex);
    const afterLines = lines.slice(endIndex + 1);
    const fixLines = fix.code.split('\n');
    
    return [...beforeLines, ...fixLines, ...afterLines].join('\n');
  } else {
    // Without specific line information, we can't apply the fix automatically
    // Just append the fix as a comment at the end of the file
    return `${fileContent}\n\n// Suggested fix:\n// ${fix.description}\n${fix.code.split('\n').map(line => `// ${line}`).join('\n')}`;
  }
}

/**
 * Format an error analysis for display
 */
function formatErrorAnalysis(analysis: ErrorAnalysis): string {
  let result = `Error Analysis\n\n`;
  
  result += `Error Type: ${analysis.errorType}\n`;
  result += `Category: ${analysis.errorCategory}\n`;
  result += `Root Cause: ${analysis.rootCause}\n`;
  
  if (analysis.affectedFile) {
    result += `Affected File: ${analysis.affectedFile}\n`;
  }
  
  if (analysis.lineNumber) {
    result += `Line: ${analysis.lineNumber}`;
    if (analysis.columnNumber) {
      result += `, Column: ${analysis.columnNumber}`;
    }
    result += `\n`;
  }
  
  if (analysis.codeSnippet) {
    result += `\nCode Context:\n\`\`\`\n${analysis.codeSnippet}\n\`\`\`\n`;
  }
  
  if (analysis.relatedPatterns.length > 0) {
    result += `\nRelated Patterns:\n`;
    analysis.relatedPatterns.forEach(pattern => {
      result += `- ${pattern}\n`;
    });
  }
  
  if (analysis.suggestedFixes.length > 0) {
    result += `\nSuggested Fixes:\n`;
    analysis.suggestedFixes.forEach((fix, index) => {
      result += `${index + 1}. ${fix.description} (Confidence: ${Math.round(fix.confidence * 100)}%)\n`;
      result += `\`\`\`\n${fix.code}\n\`\`\`\n`;
    });
  }
  
  return result;
}

/**
 * Format a fix for display
 */
function formatFix(fix: SuggestedFix): string {
  let result = `${fix.description} (Confidence: ${Math.round(fix.confidence * 100)}%)\n`;
  
  if (fix.startLine && fix.endLine) {
    result += `Lines ${fix.startLine}-${fix.endLine}\n`;
  }
  
  result += `\`\`\`\n${fix.code}\n\`\`\``;
  
  return result;
}

/**
 * Explain an error in plain language
 */
function explainError(errorMessage: string, errorStack?: string, errorType?: string, language?: string, framework?: string, detailLevel: 'basic' | 'intermediate' | 'advanced' = 'intermediate'): string {
  let explanation = '';
  
  // Determine error type if not provided
  if (!errorType) {
    if (errorMessage.includes('SyntaxError')) {
      errorType = 'SyntaxError';
    } else if (errorMessage.includes('TypeError')) {
      errorType = 'TypeError';
    } else if (errorMessage.includes('ReferenceError')) {
      errorType = 'ReferenceError';
    } else if (errorMessage.includes('RangeError')) {
      errorType = 'RangeError';
    } else {
      errorType = 'Unknown Error';
    }
  }
  
  // Basic explanation based on error type
  switch (errorType) {
    case 'SyntaxError':
      explanation = `A syntax error means there's a mistake in your code that violates the language's grammar rules. The code cannot be parsed or executed because it doesn't follow the correct syntax.`;
      
      if (errorMessage.includes('Unexpected token')) {
        const match = errorMessage.match(/Unexpected token '(.+?)'/);
        const token = match ? match[1] : 'unknown';
        explanation += `\n\nIn this case, the parser found a token '${token}' that it wasn't expecting at that position in the code. This often happens when you have mismatched brackets, missing commas, or other syntax issues.`;
      } else if (errorMessage.includes('Unexpected end of input')) {
        explanation += `\n\nIn this case, the parser reached the end of the file while still expecting more code. This typically happens when you have unclosed brackets, parentheses, or quotes.`;
      }
      break;
    
    case 'TypeError':
      explanation = `A type error occurs when an operation is performed on a value of the wrong type. For example, trying to call something that is not a function, or accessing a property of undefined.`;
      
      if (errorMessage.includes('is not a function')) {
        const match = errorMessage.match(/(.+?) is not a function/);
        const func = match ? match[1] : 'unknown';
        explanation += `\n\nIn this case, the code is trying to call '${func}' as if it were a function, but it's not a function. Check if the name is spelled correctly or if the variable actually contains a function.`;
      } else if (errorMessage.includes('Cannot read property') || errorMessage.includes('Cannot read properties')) {
        const propMatch = errorMessage.match(/property '(.+?)' of/);
        const prop = propMatch ? propMatch[1] : 'unknown';
        const objMatch = errorMessage.match(/of (undefined|null)/);
        const obj = objMatch ? objMatch[1] : 'undefined';
        
        explanation += `\n\nIn this case, the code is trying to access the property '${prop}' of a ${obj} value. This happens when you try to access a property of an object that doesn't exist or hasn't been initialized yet.`;
      }
      break;
    
    case 'ReferenceError':
      explanation = `A reference error occurs when you try to use a variable that doesn't exist or hasn't been declared.`;
      
      const match = errorMessage.match(/(.+?) is not defined/);
      const variable = match ? match[1] : 'unknown';
      
      explanation += `\n\nIn this case, the code is trying to use the variable '${variable}', but it hasn't been defined. Check if the variable name is spelled correctly or if it needs to be declared first.`;
      break;
    
    case 'RangeError':
      explanation = `A range error occurs when a value is not in the set or range of allowed values.`;
      
      if (errorMessage.includes('Maximum call stack size exceeded')) {
        explanation += `\n\nIn this case, you have a recursive function that's calling itself too many times, causing a stack overflow. This often happens when a recursive function doesn't have a proper base case to stop the recursion.`;
      }
      break;
    
    default:
      explanation = `An error occurred in your code. The specific type of error is not recognized, but the error message might provide more details.`;
  }
  
  // Add more detailed explanation based on detail level
  if (detailLevel === 'intermediate' || detailLevel === 'advanced') {
    explanation += `\n\n### How to Debug This Error\n\n`;
    
    switch (errorType) {
      case 'SyntaxError':
        explanation += `1. Look at the line number and column in the error message.\n`;
        explanation += `2. Check for mismatched brackets, parentheses, or quotes.\n`;
        explanation += `3. Verify that all statements are properly terminated (e.g., with semicolons in languages that require them).\n`;
        explanation += `4. Look for typos in keywords or operators.\n`;
        
        if (detailLevel === 'advanced') {
          explanation += `\n### Advanced Debugging\n\n`;
          explanation += `- Use a linter or code formatter to help identify syntax issues.\n`;
          explanation += `- Try commenting out sections of code to isolate the problem.\n`;
          explanation += `- If using a transpiler (like Babel or TypeScript), check the transpiled output for clues.\n`;
        }
        break;
      
      case 'TypeError':
        explanation += `1. Check the type of the variable that's causing the error (e.g., using typeof in JavaScript).\n`;
        explanation += `2. Make sure objects are initialized before accessing their properties.\n`;
        explanation += `3. Verify that functions are defined and spelled correctly before calling them.\n`;
        
        if (detailLevel === 'advanced') {
          explanation += `\n### Advanced Debugging\n\n`;
          explanation += `- Add null/undefined checks before accessing properties (e.g., obj && obj.prop).\n`;
          explanation += `- Use optional chaining if available in your language (e.g., obj?.prop).\n`;
          explanation += `- Consider using type assertions or type guards in typed languages.\n`;
        }
        break;
      
      case 'ReferenceError':
        explanation += `1. Check if the variable is declared before use.\n`;
        explanation += `2. Verify the spelling of the variable name.\n`;
        explanation += `3. Make sure the variable is in scope where it's being used.\n`;
        
        if (detailLevel === 'advanced') {
          explanation += `\n### Advanced Debugging\n\n`;
          explanation += `- Check if the variable needs to be imported from another module.\n`;
          explanation += `- Be aware of hoisting behavior in languages like JavaScript.\n`;
          explanation += `- Look for scope issues with closures or block-scoped variables.\n`;
        }
        break;
    }
  }
  
  // Add language-specific advice if available
  if (language) {
    explanation += `\n\n### ${language.charAt(0).toUpperCase() + language.slice(1)}-Specific Advice\n\n`;
    
    switch (language.toLowerCase()) {
      case 'javascript':
        explanation += `- Use console.log() to debug variable values.\n`;
        explanation += `- Check the browser console or Node.js output for detailed error messages.\n`;
        explanation += `- Consider using the debugger statement or browser developer tools to set breakpoints.\n`;
        break;
      
      case 'typescript':
        explanation += `- Check your type definitions and interfaces.\n`;
        explanation += `- Use the TypeScript compiler (tsc) to catch type errors before runtime.\n`;
        explanation += `- Consider using strictNullChecks to prevent null/undefined errors.\n`;
        break;
      
      case 'python':
        explanation += `- Use print() statements to debug variable values.\n`;
        explanation += `- Try using the pdb debugger (import pdb; pdb.set_trace()).\n`;
        explanation += `- Check indentation, as it's syntactically significant in Python.\n`;
        break;
    }
  }
  
  // Add framework-specific advice if available
  if (framework) {
    explanation += `\n\n### ${framework.charAt(0).toUpperCase() + framework.slice(1)}-Specific Advice\n\n`;
    
    switch (framework.toLowerCase()) {
      case 'react':
        explanation += `- Check component lifecycle methods and hooks.\n`;
        explanation += `- Verify that you're not using hooks conditionally.\n`;
        explanation += `- Use React DevTools to inspect component state and props.\n`;
        break;
      
      case 'angular':
        explanation += `- Check for proper dependency injection.\n`;
        explanation += `- Verify template syntax and binding expressions.\n`;
        explanation += `- Use Angular DevTools to debug components and services.\n`;
        break;
      
      case 'vue':
        explanation += `- Check component lifecycle hooks.\n`;
        explanation += `- Verify template syntax and directives.\n`;
        explanation += `- Use Vue DevTools to inspect component state and props.\n`;
        break;
    }
  }
  
  return explanation;
}

/**
 * Generate a debugger configuration
 */
function generateDebuggerConfig(options: z.infer<typeof CreateDebuggerConfigSchema>): DebuggerConfig {
  const { language, framework, projectPath, debugTool } = options;
  
  // Base configuration
  const config: DebuggerConfig = {
    type: debugTool,
    name: `Debug ${language}${framework ? ` (${framework})` : ''}`,
    request: 'launch',
    configurations: [],
  };
  
  // Add configurations based on language and debug tool
  switch (debugTool) {
    case 'vscode':
      switch (language.toLowerCase()) {
        case 'javascript':
        case 'typescript':
          config.configurations.push({
            type: 'node',
            request: 'launch',
            name: 'Launch Program',
            program: '${workspaceFolder}/index.js',
            skipFiles: ['<node_internals>/**'],
            outFiles: framework === 'typescript' ? ['${workspaceFolder}/dist/**/*.js'] : undefined,
          });
          
          if (framework === 'react' || framework === 'vue' || framework === 'angular') {
            config.configurations.push({
              type: 'chrome',
              request: 'launch',
              name: 'Launch Chrome',
              url: 'http://localhost:3000',
              webRoot: '${workspaceFolder}',
            });
          }
          break;
        
        case 'python':
          config.configurations.push({
            type: 'python',
            request: 'launch',
            name: 'Python: Current File',
            program: '${file}',
            console: 'integratedTerminal',
          });
          
          config.configurations.push({
            type: 'python',
            request: 'launch',
            name: 'Python: Main File',
            program: '${workspaceFolder}/main.py',
            console: 'integratedTerminal',
          });
          break;
        
        case 'java':
          config.configurations.push({
            type: 'java',
            request: 'launch',
            name: 'Java: Current File',
            mainClass: '${file}',
          });
          break;
        
        case 'csharp':
        case 'c#':
          config.configurations.push({
            type: 'coreclr',
            request: 'launch',
            name: '.NET Core Launch',
            program: '${workspaceFolder}/bin/Debug/netcoreapp3.1/app.dll',
            args: [],
            cwd: '${workspaceFolder}',
            stopAtEntry: false,
            console: 'internalConsole',
          });
          break;
      }
      break;
    
    case 'chrome':
      config.configurations.push({
        type: 'chrome',
        request: 'launch',
        name: 'Launch Chrome',
        url: 'http://localhost:3000',
        webRoot: '${workspaceFolder}',
        sourceMaps: true,
        sourceMapPathOverrides: {
          'webpack:///src/*': '${workspaceFolder}/src/*',
        },
      });
      break;
    
    case 'firefox':
      config.configurations.push({
        type: 'firefox',
        request: 'launch',
        name: 'Launch Firefox',
        url: 'http://localhost:3000',
        webRoot: '${workspaceFolder}',
        pathMappings: [
          {
            url: 'webpack:///src/',
            path: '${workspaceFolder}/src/',
          },
        ],
      });
      break;
    
    case 'node':
      config.configurations.push({
        type: 'node',
        request: 'launch',
        name: 'Launch Program',
        program: '${workspaceFolder}/index.js',
        skipFiles: ['<node_internals>/**'],
      });
      
      config.configurations.push({
        type: 'node',
        request: 'attach',
        name: 'Attach to Process',
        processId: '${command:PickProcess}',
        skipFiles: ['<node_internals>/**'],
      });
      break;
    
    case 'jest':
      config.configurations.push({
        type: 'node',
        request: 'launch',
        name: 'Jest: Current File',
        program: '${workspaceFolder}/node_modules/.bin/jest',
        args: ['${fileBasenameNoExtension}', '--config', 'jest.config.js'],
        console: 'integratedTerminal',
        disableOptimisticBPs: true,
      });
      break;
    
    case 'mocha':
      config.configurations.push({
        type: 'node',
        request: 'launch',
        name: 'Mocha: Current File',
        program: '${workspaceFolder}/node_modules/mocha/bin/_mocha',
        args: ['${file}', '--timeout', '999999', '--colors'],
        console: 'integratedTerminal',
      });
      break;
  }
  
  return config;
}

/**
 * Get documentation URL for an error type
 */
function getDocumentationUrl(errorType: string): string {
  switch (errorType) {
    case 'SyntaxError':
      return 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SyntaxError';
    case 'TypeError':
      return 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError';
    case 'ReferenceError':
      return 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ReferenceError';
    case 'RangeError':
      return 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError';
    default:
      return 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error';
  }
}
