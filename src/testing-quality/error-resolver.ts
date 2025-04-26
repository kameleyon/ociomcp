/**
 * ErrorResolver Tool
 * 
 * Resolves errors in code by providing suggestions and fixes
 * Provides detailed error analysis and resolution strategies
 * Implements with error pattern recognition and solution generation
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { z } from 'zod';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Define schemas for ErrorResolver tool
export const AnalyzeErrorSchema = z.object({
  errorMessage: z.string(),
  errorStack: z.string().optional(),
  language: z.string().default('javascript'),
  framework: z.string().optional(),
  filePath: z.string().optional(),
  lineNumber: z.number().optional(),
  columnNumber: z.number().optional(),
  codeContext: z.string().optional(),
});

export const GenerateSolutionSchema = z.object({
  errorAnalysis: z.any(),
  solutionCount: z.number().min(1).max(5).default(1),
  includeExplanation: z.boolean().default(true),
  includeCode: z.boolean().default(true),
});

export const ApplySolutionSchema = z.object({
  solution: z.any(),
  filePath: z.string(),
  createBackup: z.boolean().default(true),
});

export const SearchErrorDatabaseSchema = z.object({
  query: z.string(),
  language: z.string().optional(),
  framework: z.string().optional(),
  limit: z.number().default(5),
});

// Types for error resolution
interface ErrorAnalysis {
  errorType: string;
  errorCategory: 'syntax' | 'runtime' | 'logical' | 'type' | 'dependency' | 'unknown';
  description: string;
  possibleCauses: string[];
  affectedFile?: string;
  lineNumber?: number;
  columnNumber?: number;
  codeSnippet?: string;
  confidence: number;
}

interface Solution {
  description: string;
  explanation: string;
  code?: string;
  filePath?: string;
  lineStart?: number;
  lineEnd?: number;
  confidence: number;
}

interface ErrorDatabaseEntry {
  errorPattern: string;
  language: string;
  framework?: string;
  description: string;
  solutions: Solution[];
}

/**
 * Analyze an error
 */
export async function handleAnalyzeError(args: any) {
  try {
    const options = args as z.infer<typeof AnalyzeErrorSchema>;
    
    // Analyze error message and stack trace
    const analysis = analyzeError(options);
    
    // If file path is provided, read the file to get more context
    if (options.filePath) {
      try {
        const fileContent = await fs.readFile(options.filePath, 'utf-8');
        
        // Extract code context around the error
        if (options.lineNumber) {
          const lines = fileContent.split('\n');
          const startLine = Math.max(0, options.lineNumber - 5);
          const endLine = Math.min(lines.length, options.lineNumber + 5);
          const codeContext = lines.slice(startLine, endLine).join('\n');
          
          // Update analysis with code context
          analysis.codeSnippet = codeContext;
          analysis.affectedFile = options.filePath;
          analysis.lineNumber = options.lineNumber;
          analysis.columnNumber = options.columnNumber;
          
          // Refine analysis with code context
          refineAnalysisWithCodeContext(analysis, codeContext, options.language);
        }
      } catch (error) {
        console.error(`Error reading file ${options.filePath}:`, error);
      }
    } else if (options.codeContext) {
      // Use provided code context
      analysis.codeSnippet = options.codeContext;
      
      // Refine analysis with code context
      refineAnalysisWithCodeContext(analysis, options.codeContext, options.language);
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
 * Generate solutions for an error
 */
export async function handleGenerateSolution(args: any) {
  try {
    const options = args as z.infer<typeof GenerateSolutionSchema>;
    
    // Generate solutions
    const solutions = generateSolutions(options.errorAnalysis, options.solutionCount);
    
    // Format solutions
    const formattedSolutions = formatSolutions(solutions, options.includeExplanation, options.includeCode);
    
    return {
      content: [{
        type: "text",
        text: formattedSolutions
      }],
      data: solutions,
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error generating solutions: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Apply a solution to a file
 */
export async function handleApplySolution(args: any) {
  try {
    const options = args as z.infer<typeof ApplySolutionSchema>;
    
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
    
    // Create backup if requested
    if (options.createBackup) {
      const backupPath = `${options.filePath}.backup`;
      await fs.writeFile(backupPath, fileContent);
    }
    
    // Apply solution
    const updatedContent = applySolution(fileContent, options.solution);
    
    // Write updated content
    await fs.writeFile(options.filePath, updatedContent);
    
    return {
      content: [{
        type: "text",
        text: `Solution applied to ${options.filePath}. ${options.createBackup ? `Backup created at ${options.filePath}.backup.` : ''}`
      }],
      data: {
        filePath: options.filePath,
        backupCreated: options.createBackup,
      },
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error applying solution: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Search error database
 */
export async function handleSearchErrorDatabase(args: any) {
  try {
    const options = args as z.infer<typeof SearchErrorDatabaseSchema>;
    
    // Search error database
    const results = searchErrorDatabase(options.query, options.language, options.framework, options.limit);
    
    // Format results
    const formattedResults = formatSearchResults(results);
    
    return {
      content: [{
        type: "text",
        text: formattedResults
      }],
      data: results,
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error searching error database: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Analyze an error message and stack trace
 */
function analyzeError(options: z.infer<typeof AnalyzeErrorSchema>): ErrorAnalysis {
  const { errorMessage, errorStack, language } = options;
  
  // Default error analysis
  const analysis: ErrorAnalysis = {
    errorType: 'Unknown Error',
    errorCategory: 'unknown',
    description: 'An unknown error occurred',
    possibleCauses: ['Unknown'],
    confidence: 0.5,
  };
  
  // JavaScript/TypeScript errors
  if (language === 'javascript' || language === 'typescript') {
    // Syntax errors
    if (errorMessage.includes('SyntaxError') || errorMessage.includes('syntax error')) {
      analysis.errorType = 'Syntax Error';
      analysis.errorCategory = 'syntax';
      analysis.confidence = 0.9;
      
      if (errorMessage.includes('Unexpected token')) {
        const match = errorMessage.match(/Unexpected token '(.+?)'/);
        const token = match ? match[1] : 'unknown';
        analysis.description = `Unexpected token '${token}' found in code`;
        analysis.possibleCauses = [
          'Missing closing bracket/parenthesis',
          'Typo in code',
          'Invalid syntax',
        ];
      } else if (errorMessage.includes('Unexpected end of input')) {
        analysis.description = 'Unexpected end of input - likely missing closing bracket, brace, or parenthesis';
        analysis.possibleCauses = [
          'Unclosed string',
          'Unclosed bracket/brace/parenthesis',
          'Incomplete code block',
        ];
      } else if (errorMessage.includes('Invalid or unexpected token')) {
        analysis.description = 'Invalid or unexpected token in code';
        analysis.possibleCauses = [
          'Non-printable characters in code',
          'Invalid escape sequence in string',
          'Mixing single and double quotes',
        ];
      } else {
        analysis.description = 'Syntax error in code';
        analysis.possibleCauses = [
          'Invalid syntax',
          'Typo in code',
          'Missing semicolon or comma',
        ];
      }
    }
    // Type errors
    else if (errorMessage.includes('TypeError') || errorMessage.includes('type error')) {
      analysis.errorType = 'Type Error';
      analysis.errorCategory = 'runtime';
      analysis.confidence = 0.85;
      
      if (errorMessage.includes('is not a function')) {
        const match = errorMessage.match(/(.+?) is not a function/);
        const func = match ? match[1] : 'unknown';
        analysis.description = `Attempted to call '${func}' as a function, but it's not a function`;
        analysis.possibleCauses = [
          'Typo in function name',
          'Function not defined',
          'Variable holding unexpected type',
        ];
      } else if (errorMessage.includes('Cannot read property') || errorMessage.includes('Cannot read properties')) {
        const propMatch = errorMessage.match(/property '(.+?)' of/);
        const prop = propMatch ? propMatch[1] : 'unknown';
        const objMatch = errorMessage.match(/of (undefined|null)/);
        const obj = objMatch ? objMatch[1] : 'undefined';
        
        analysis.description = `Attempted to access property '${prop}' of ${obj}`;
        analysis.possibleCauses = [
          'Null/undefined object access',
          'Missing initialization',
          'Race condition',
        ];
      } else {
        analysis.description = 'Type error in code';
        analysis.possibleCauses = [
          'Incompatible types',
          'Undefined variable',
          'Incorrect function usage',
        ];
      }
    }
    // Reference errors
    else if (errorMessage.includes('ReferenceError') || errorMessage.includes('is not defined')) {
      analysis.errorType = 'Reference Error';
      analysis.errorCategory = 'runtime';
      analysis.confidence = 0.9;
      
      const match = errorMessage.match(/(.+?) is not defined/);
      const variable = match ? match[1] : 'unknown';
      
      analysis.description = `Variable '${variable}' is used but not defined`;
      analysis.possibleCauses = [
        'Typo in variable name',
        'Missing import/require',
        'Variable out of scope',
      ];
    }
    // Range errors
    else if (errorMessage.includes('RangeError')) {
      analysis.errorType = 'Range Error';
      analysis.errorCategory = 'runtime';
      analysis.confidence = 0.85;
      
      if (errorMessage.includes('Maximum call stack size exceeded')) {
        analysis.description = 'Maximum call stack size exceeded - likely an infinite recursion';
        analysis.possibleCauses = [
          'Infinite recursion',
          'Missing base case in recursion',
          'Circular reference',
        ];
      } else {
        analysis.description = 'Value is outside the allowed range';
        analysis.possibleCauses = [
          'Invalid array index',
          'Invalid numeric argument',
          'Stack overflow',
        ];
      }
    }
    // TypeScript specific errors
    else if (language === 'typescript') {
      if (errorMessage.includes('TS')) {
        const match = errorMessage.match(/TS(\d+)/);
        const errorCode = match ? match[1] : 'unknown';
        
        analysis.errorType = `TypeScript Error (TS${errorCode})`;
        analysis.errorCategory = 'type';
        analysis.confidence = 0.9;
        
        if (errorMessage.includes('is not assignable to type')) {
          const typeMatch = errorMessage.match(/Type '(.+?)' is not assignable to type '(.+?)'/);
          const sourceType = typeMatch ? typeMatch[1] : 'unknown';
          const targetType = typeMatch ? typeMatch[2] : 'unknown';
          
          analysis.description = `Type '${sourceType}' is not assignable to type '${targetType}'`;
          analysis.possibleCauses = [
            'Incompatible types',
            'Missing properties in object',
            'Incorrect type definition',
          ];
        } else if (errorMessage.includes('Property') && errorMessage.includes('does not exist on type')) {
          const propMatch = errorMessage.match(/Property '(.+?)' does not exist on type/);
          const prop = propMatch ? propMatch[1] : 'unknown';
          
          analysis.description = `Property '${prop}' does not exist on the type`;
          analysis.possibleCauses = [
            'Typo in property name',
            'Missing property in interface/type',
            'Incorrect type assertion',
          ];
        } else {
          analysis.description = 'TypeScript type error';
          analysis.possibleCauses = [
            'Type mismatch',
            'Missing type definition',
            'Incorrect type usage',
          ];
        }
      }
    }
  }
  // Python errors
  else if (language === 'python') {
    if (errorMessage.includes('SyntaxError')) {
      analysis.errorType = 'Syntax Error';
      analysis.errorCategory = 'syntax';
      analysis.confidence = 0.9;
      
      analysis.description = 'Python syntax error';
      analysis.possibleCauses = [
        'Invalid syntax',
        'Indentation error',
        'Missing colon',
      ];
    } else if (errorMessage.includes('IndentationError')) {
      analysis.errorType = 'Indentation Error';
      analysis.errorCategory = 'syntax';
      analysis.confidence = 0.95;
      
      analysis.description = 'Python indentation error';
      analysis.possibleCauses = [
        'Inconsistent indentation',
        'Mixing tabs and spaces',
        'Incorrect indentation level',
      ];
    } else if (errorMessage.includes('NameError')) {
      analysis.errorType = 'Name Error';
      analysis.errorCategory = 'runtime';
      analysis.confidence = 0.9;
      
      const match = errorMessage.match(/name '(.+?)' is not defined/);
      const variable = match ? match[1] : 'unknown';
      
      analysis.description = `Variable '${variable}' is used but not defined`;
      analysis.possibleCauses = [
        'Typo in variable name',
        'Variable not defined',
        'Variable out of scope',
      ];
    } else if (errorMessage.includes('TypeError')) {
      analysis.errorType = 'Type Error';
      analysis.errorCategory = 'runtime';
      analysis.confidence = 0.85;
      
      analysis.description = 'Python type error';
      analysis.possibleCauses = [
        'Incompatible types',
        'Incorrect function usage',
        'Unsupported operation',
      ];
    } else if (errorMessage.includes('ImportError') || errorMessage.includes('ModuleNotFoundError')) {
      analysis.errorType = 'Import Error';
      analysis.errorCategory = 'runtime';
      analysis.confidence = 0.9;
      
      const match = errorMessage.match(/No module named '(.+?)'/);
      const module = match ? match[1] : 'unknown';
      
      analysis.description = `Module '${module}' not found`;
      analysis.possibleCauses = [
        'Module not installed',
        'Typo in module name',
        'Module not in Python path',
      ];
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
      analysis.possibleCauses.push('Unbalanced parentheses');
    }
    
    if (openBraces !== closeBraces) {
      analysis.possibleCauses.push('Unbalanced braces');
    }
    
    if (openSquareBrackets !== closeSquareBrackets) {
      analysis.possibleCauses.push('Unbalanced square brackets');
    }
  } else if (analysis.errorCategory === 'runtime') {
    // Look for common runtime error patterns
    if (analysis.errorType === 'Type Error' && analysis.description.includes('not a function')) {
      // Check for common typos in function names
      const functionMatch = analysis.description.match(/Attempted to call '(.+?)' as a function/);
      if (functionMatch) {
        const funcName = functionMatch[1];
        
        // Look for similar function names in the code context
        const similarFunctions = findSimilarFunctionNames(funcName, codeContext);
        if (similarFunctions.length > 0) {
          analysis.possibleCauses.push(`Possible typo: '${funcName}' might be '${similarFunctions[0]}'`);
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
 * Generate solutions for an error
 */
function generateSolutions(errorAnalysis: ErrorAnalysis, solutionCount: number): Solution[] {
  const solutions: Solution[] = [];
  
  // Generate solutions based on error category
  switch (errorAnalysis.errorCategory) {
    case 'syntax':
      solutions.push(...generateSyntaxErrorSolutions(errorAnalysis));
      break;
    
    case 'runtime':
      solutions.push(...generateRuntimeErrorSolutions(errorAnalysis));
      break;
    
    case 'type':
      solutions.push(...generateTypeErrorSolutions(errorAnalysis));
      break;
    
    case 'logical':
      solutions.push(...generateLogicalErrorSolutions(errorAnalysis));
      break;
    
    case 'dependency':
      solutions.push(...generateDependencyErrorSolutions(errorAnalysis));
      break;
    
    default:
      solutions.push({
        description: 'Generic error solution',
        explanation: 'This is a generic solution for an unknown error type. Review the error message and code context for more specific guidance.',
        confidence: 0.5,
      });
      break;
  }
  
  // Sort solutions by confidence (descending)
  solutions.sort((a, b) => b.confidence - a.confidence);
  
  // Limit to requested count
  return solutions.slice(0, solutionCount);
}

/**
 * Generate solutions for syntax errors
 */
function generateSyntaxErrorSolutions(errorAnalysis: ErrorAnalysis): Solution[] {
  const solutions: Solution[] = [];
  
  // Check for unbalanced brackets, braces, or parentheses
  if (errorAnalysis.possibleCauses.some(cause => cause.includes('Unbalanced'))) {
    if (errorAnalysis.possibleCauses.includes('Unbalanced parentheses')) {
      solutions.push({
        description: 'Fix unbalanced parentheses',
        explanation: 'The code has unbalanced parentheses. Check for missing opening or closing parentheses.',
        code: 'Add missing parenthesis at the appropriate location',
        confidence: 0.8,
      });
    }
    
    if (errorAnalysis.possibleCauses.includes('Unbalanced braces')) {
      solutions.push({
        description: 'Fix unbalanced braces',
        explanation: 'The code has unbalanced braces. Check for missing opening or closing braces.',
        code: 'Add missing brace at the appropriate location',
        confidence: 0.8,
      });
    }
    
    if (errorAnalysis.possibleCauses.includes('Unbalanced square brackets')) {
      solutions.push({
        description: 'Fix unbalanced square brackets',
        explanation: 'The code has unbalanced square brackets. Check for missing opening or closing square brackets.',
        code: 'Add missing square bracket at the appropriate location',
        confidence: 0.8,
      });
    }
  }
  
  // Check for unexpected tokens
  if (errorAnalysis.description.includes('Unexpected token')) {
    const match = errorAnalysis.description.match(/Unexpected token '(.+?)'/);
    const token = match ? match[1] : 'unknown';
    
    solutions.push({
      description: `Fix unexpected token '${token}'`,
      explanation: `The code has an unexpected token '${token}'. This might be due to a syntax error or a typo.`,
      code: `Check the code around the unexpected token '${token}' and fix the syntax error`,
      confidence: 0.7,
    });
  }
  
  // Check for unexpected end of input
  if (errorAnalysis.description.includes('Unexpected end of input')) {
    solutions.push({
      description: 'Fix unexpected end of input',
      explanation: 'The code has an unexpected end of input. This might be due to unclosed brackets, braces, or parentheses.',
      code: 'Check for unclosed brackets, braces, or parentheses and add the missing closing characters',
      confidence: 0.7,
    });
  }
  
  // Add generic solution if no specific solutions were generated
  if (solutions.length === 0) {
    solutions.push({
      description: 'Fix syntax error',
      explanation: 'The code has a syntax error. Check the code for typos, missing semicolons, or other syntax issues.',
      confidence: 0.6,
    });
  }
  
  return solutions;
}

/**
 * Generate solutions for runtime errors
 */
function generateRuntimeErrorSolutions(errorAnalysis: ErrorAnalysis): Solution[] {
  const solutions: Solution[] = [];
  
  // Check for "is not a function" errors
  if (errorAnalysis.description.includes('not a function')) {
    const match = errorAnalysis.description.match(/Attempted to call '(.+?)' as a function/);
    const func = match ? match[1] : 'unknown';
    
    // Check for typos
    const typoMatch = errorAnalysis.possibleCauses.find(cause => cause.includes('Possible typo'));
    if (typoMatch) {
      const correctFuncMatch = typoMatch.match(/might be '(.+?)'/);
      const correctFunc = correctFuncMatch ? correctFuncMatch[1] : null;
      
      if (correctFunc) {
        solutions.push({
          description: `Fix typo in function name: '${func}' -> '${correctFunc}'`,
          explanation: `The function '${func}' is not defined, but '${correctFunc}' is. This might be a typo.`,
          code: `// Replace\n${func}()\n\n// With\n${correctFunc}()`,
          confidence: 0.85,
        });
      }
    }
    
    solutions.push({
      description: `Check if '${func}' is defined and is a function`,
      explanation: `The code is trying to call '${func}' as a function, but it's not a function. Make sure it's defined and is actually a function.`,
      code: `// Check if ${func} is defined and is a function\nif (typeof ${func} === 'function') {\n  ${func}();\n} else {\n  console.error('${func} is not a function');\n}`,
      confidence: 0.7,
    });
  }
  
  // Check for "Cannot read property" errors
  if (errorAnalysis.description.includes('property') && (errorAnalysis.description.includes('undefined') || errorAnalysis.description.includes('null'))) {
    const propMatch = errorAnalysis.description.match(/property '(.+?)' of/);
    const prop = propMatch ? propMatch[1] : 'unknown';
    const objMatch = errorAnalysis.description.match(/of (undefined|null)/);
    const obj = objMatch ? objMatch[1] : 'undefined';
    
    solutions.push({
      description: `Add null/undefined check before accessing '${prop}'`,
      explanation: `The code is trying to access the property '${prop}' of ${obj}. Add a check to make sure the object is defined before accessing its properties.`,
      code: `// Add null/undefined check\nif (object && object.${prop}) {\n  // Access object.${prop} safely\n}`,
      confidence: 0.9,
    });
    
    solutions.push({
      description: `Use optional chaining for '${prop}'`,
      explanation: `The code is trying to access the property '${prop}' of ${obj}. Use optional chaining to safely access the property.`,
      code: `// Use optional chaining\nconst value = object?.${prop};\n// Instead of: const value = object.${prop};`,
      confidence: 0.85,
    });
  }
  
  // Check for "is not defined" errors
  if (errorAnalysis.description.includes('is not defined') || errorAnalysis.description.includes('is used but not defined')) {
    const match = errorAnalysis.description.match(/Variable '(.+?)' is/);
    const variable = match ? match[1] : 'unknown';
    
    solutions.push({
      description: `Define variable '${variable}' before use`,
      explanation: `The code is using the variable '${variable}' before it's defined. Make sure to define it before using it.`,
      code: `// Define the variable before use\nconst ${variable} = /* appropriate value */;\n\n// Then use it\n// ... ${variable} ...`,
      confidence: 0.8,
    });
    
    solutions.push({
      description: `Check for typos in variable name '${variable}'`,
      explanation: `The variable '${variable}' is not defined. Check if there's a typo in the variable name.`,
      code: `// Check for typos in the variable name\n// For example, if you have 'userData' but typed 'userdata'`,
      confidence: 0.7,
    });
    
    solutions.push({
      description: `Import/require '${variable}' if it's from a module`,
      explanation: `The variable '${variable}' is not defined. If it's from a module, make sure to import or require it.`,
      code: `// If it's from a module, import it\nimport { ${variable} } from './module';\n// or\nconst ${variable} = require('./module').${variable};`,
      confidence: 0.6,
    });
  }
  
  // Add generic solution if no specific solutions were generated
  if (solutions.length === 0) {
    solutions.push({
      description: 'Fix runtime error',
      explanation: 'The code has a runtime error. Check the error message and code context for more specific guidance.',
      confidence: 0.5,
    });
  }
  
  return solutions;
}

/**
 * Generate solutions for type errors
 */
function generateTypeErrorSolutions(errorAnalysis: ErrorAnalysis): Solution[] {
  const solutions: Solution[] = [];
  
  // Check for "is not assignable to type" errors
  if (errorAnalysis.description.includes('is not assignable to type')) {
    const typeMatch = errorAnalysis.description.match(/Type '(.+?)' is not assignable to type '(.+?)'/);
    const sourceType = typeMatch ? typeMatch[1] : 'unknown';
    const targetType = typeMatch ? typeMatch[2] : 'unknown';
    
    solutions.push({
      description: `Fix type mismatch: '${sourceType}' is not assignable to '${targetType}'`,
      explanation: `The code is trying to assign a value of type '${sourceType}' to a variable of type '${targetType}'. These types are not compatible.`,
      code: `// Option 1: Change the value to match the expected type\n// Option 2: Use type assertion (use with caution)\nconst value = someValue as ${targetType};\n// Option 3: Update the type definition to be more flexible`,
      confidence: 0.8,
    });
  }
  
  // Check for "Property does not exist on type" errors
  if (errorAnalysis.description.includes('does not exist on the type')) {
    const propMatch = errorAnalysis.description.match(/Property '(.+?)' does not exist on the type/);
    const prop = propMatch ? propMatch[1] : 'unknown';
    
    solutions.push({
      description: `Fix missing property: '${prop}' does not exist on the type`,
      explanation: `The code is trying to access property '${prop}' which doesn't exist on the type. This might be a typo or the property might be missing from the type definition.`,
      code: `// Option 1: Check for typos in the property name\n// Option 2: Add the property to the interface/type\ninterface MyType {\n  ${prop}: any; // Use appropriate type\n}\n// Option 3: Use type assertion (use with caution)\nconst value = (obj as any).${prop};`,
      confidence: 0.8,
    });
  }
  
  // Add generic solution if no specific solutions were generated
  if (solutions.length === 0) {
    solutions.push({
      description: 'Fix type error',
      explanation: 'The code has a type error. Check the error message and code context for more specific guidance.',
      confidence: 0.5,
    });
  }
  
  return solutions;
}

/**
 * Generate solutions for logical errors
 */
function generateLogicalErrorSolutions(errorAnalysis: ErrorAnalysis): Solution[] {
  const solutions: Solution[] = [];
  
  // Add generic solution for logical errors
  solutions.push({
    description: 'Fix logical error',
    explanation: 'The code has a logical error. This means the code is syntactically correct but does not behave as expected.',
    code: `// Review the logic of your code\n// Add logging to trace the execution flow\nconsole.log('Debug:', { /* Add relevant variables here */ });\n// Consider edge cases and unexpected inputs`,
    confidence: 0.6,
  });
  
  return solutions;
}

/**
 * Generate solutions for dependency errors
 */
function generateDependencyErrorSolutions(errorAnalysis: ErrorAnalysis): Solution[] {
  const solutions: Solution[] = [];
  
  // Check for missing module errors
  if (errorAnalysis.description.includes('not found')) {
    const moduleMatch = errorAnalysis.description.match(/Module '(.+?)' not found/);
    const module = moduleMatch ? moduleMatch[1] : 'unknown';
    
    solutions.push({
      description: `Install missing module: '${module}'`,
      explanation: `The code is trying to import/require the module '${module}', but it's not installed.`,
      code: `// Install the missing module\nnpm install ${module}\n// or\nyarn add ${module}`,
      confidence: 0.9,
    });
  }
  
  // Add generic solution if no specific solutions were generated
  if (solutions.length === 0) {
    solutions.push({
      description: 'Fix dependency error',
      explanation: 'The code has a dependency error. This might be due to a missing or incompatible dependency.',
      code: `// Check your package.json for the dependency\n// Install the missing dependency\nnpm install <dependency>\n// or\nyarn add <dependency>`,
      confidence: 0.7,
    });
  }
  
  return solutions;
}

/**
 * Format error analysis for display
 */
function formatErrorAnalysis(analysis: ErrorAnalysis): string {
  let result = `Error Analysis\n\n`;
  
  result += `Error Type: ${analysis.errorType}\n`;
  result += `Category: ${analysis.errorCategory}\n`;
  result += `Description: ${analysis.description}\n\n`;
  
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
  
  if (analysis.possibleCauses.length > 0) {
    result += `\nPossible Causes:\n`;
    analysis.possibleCauses.forEach(cause => {
      result += `- ${cause}\n`;
    });
  }
  
  return result;
}

/**
 * Format solutions for display
 */
function formatSolutions(solutions: Solution[], includeExplanation: boolean, includeCode: boolean): string {
  let result = `Generated Solutions\n\n`;
  
  solutions.forEach((solution, index) => {
    result += `Solution ${index + 1}: ${solution.description}\n`;
    
    if (includeExplanation) {
      result += `\nExplanation: ${solution.explanation}\n`;
    }
    
    if (includeCode && solution.code) {
      result += `\nCode:\n\`\`\`\n${solution.code}\n\`\`\`\n`;
    }
    
    if (solution.filePath) {
      result += `\nFile: ${solution.filePath}`;
      if (solution.lineStart) {
        result += `, Lines: ${solution.lineStart}`;
        if (solution.lineEnd && solution.lineEnd !== solution.lineStart) {
          result += `-${solution.lineEnd}`;
        }
      }
      result += `\n`;
    }
    
    result += `\nConfidence: ${Math.round(solution.confidence * 100)}%\n\n`;
  });
  
  return result;
}

/**
 * Apply a solution to a file
 */
function applySolution(fileContent: string, solution: Solution): string {
  // If the solution doesn't have line information, we can't apply it automatically
  if (!solution.lineStart || !solution.lineEnd || !solution.code) {
    return fileContent;
  }
  
  // Split the file content into lines
  const lines = fileContent.split('\n');
  
  // Replace the lines with the solution code
  const beforeLines = lines.slice(0, solution.lineStart - 1);
  const afterLines = lines.slice(solution.lineEnd);
  const solutionLines = solution.code.split('\n');
  
  // Combine the lines
  return [...beforeLines, ...solutionLines, ...afterLines].join('\n');
}

/**
 * Search error database
 */
function searchErrorDatabase(query: string, language?: string, framework?: string, limit: number = 5): ErrorDatabaseEntry[] {
  // In a real implementation, we would search a database of known errors
  // For this simulation, we'll return some mock results
  
  const mockDatabase: ErrorDatabaseEntry[] = [
    {
      errorPattern: 'TypeError: Cannot read property',
      language: 'javascript',
      description: 'Trying to access a property of undefined or null',
      solutions: [
        {
          description: 'Add null/undefined check',
          explanation: 'Add a check to make sure the object is defined before accessing its properties.',
          code: `if (obj && obj.prop) {\n  // Access obj.prop safely\n}`,
          confidence: 0.9,
        },
        {
          description: 'Use optional chaining',
          explanation: 'Use optional chaining to safely access the property.',
          code: `const value = obj?.prop;`,
          confidence: 0.85,
        },
      ],
    },
    {
      errorPattern: 'SyntaxError: Unexpected token',
      language: 'javascript',
      description: 'Invalid syntax in code',
      solutions: [
        {
          description: 'Fix syntax error',
          explanation: 'Check for missing brackets, braces, or parentheses.',
          code: `// Check for missing brackets, braces, or parentheses`,
          confidence: 0.8,
        },
      ],
    },
    {
      errorPattern: 'ReferenceError: is not defined',
      language: 'javascript',
      description: 'Using a variable that is not defined',
      solutions: [
        {
          description: 'Define variable before use',
          explanation: 'Make sure to define the variable before using it.',
          code: `const variable = /* appropriate value */;`,
          confidence: 0.8,
        },
        {
          description: 'Import/require module',
          explanation: 'If the variable is from a module, make sure to import or require it.',
          code: `import { variable } from './module';`,
          confidence: 0.7,
        },
      ],
    },
    {
      errorPattern: 'TS2322: Type is not assignable to type',
      language: 'typescript',
      description: 'Type mismatch in TypeScript',
      solutions: [
        {
          description: 'Fix type mismatch',
          explanation: 'Make sure the types are compatible.',
          code: `// Option 1: Change the value to match the expected type\n// Option 2: Use type assertion\nconst value = someValue as ExpectedType;`,
          confidence: 0.8,
        },
      ],
    },
    {
      errorPattern: 'TS2339: Property does not exist on type',
      language: 'typescript',
      description: 'Accessing a property that does not exist on the type',
      solutions: [
        {
          description: 'Fix missing property',
          explanation: 'Add the property to the interface/type or check for typos.',
          code: `interface MyType {\n  prop: any; // Use appropriate type\n}`,
          confidence: 0.8,
        },
      ],
    },
    {
      errorPattern: 'ImportError: No module named',
      language: 'python',
      description: 'Module not found in Python',
      solutions: [
        {
          description: 'Install missing module',
          explanation: 'Install the missing module using pip.',
          code: `pip install module_name`,
          confidence: 0.9,
        },
      ],
    },
    {
      errorPattern: 'IndentationError:',
      language: 'python',
      description: 'Incorrect indentation in Python',
      solutions: [
        {
          description: 'Fix indentation',
          explanation: 'Make sure the indentation is consistent.',
          code: `# Use consistent indentation (spaces or tabs, not both)`,
          confidence: 0.9,
        },
      ],
    },
  ];
  
  // Filter results based on query, language, and framework
  let results = mockDatabase.filter(entry => {
    // Check if the query matches the error pattern or description
    const matchesQuery = entry.errorPattern.toLowerCase().includes(query.toLowerCase()) ||
                         entry.description.toLowerCase().includes(query.toLowerCase());
    
    // Check if the language matches
    const matchesLanguage = !language || entry.language === language;
    
    // Check if the framework matches
    const matchesFramework = !framework || entry.framework === framework;
    
    return matchesQuery && matchesLanguage && matchesFramework;
  });
  
  // Sort results by relevance (simple implementation: exact matches first)
  results.sort((a, b) => {
    const aExactMatch = a.errorPattern.toLowerCase() === query.toLowerCase();
    const bExactMatch = b.errorPattern.toLowerCase() === query.toLowerCase();
    
    if (aExactMatch && !bExactMatch) return -1;
    if (!aExactMatch && bExactMatch) return 1;
    
    return 0;
  });
  
  // Limit results
  return results.slice(0, limit);
}

/**
 * Format search results for display
 */
function formatSearchResults(results: ErrorDatabaseEntry[]): string {
  if (results.length === 0) {
    return 'No results found.';
  }
  
  let output = `Found ${results.length} result${results.length === 1 ? '' : 's'}:\n\n`;
  
  results.forEach((entry, index) => {
    output += `Result ${index + 1}: ${entry.errorPattern}\n`;
    output += `Language: ${entry.language}${entry.framework ? `, Framework: ${entry.framework}` : ''}\n`;
    output += `Description: ${entry.description}\n\n`;
    
    output += `Solutions:\n`;
    entry.solutions.forEach((solution, solutionIndex) => {
      output += `${solutionIndex + 1}. ${solution.description}\n`;
      output += `   Explanation: ${solution.explanation}\n`;
      if (solution.code) {
        output += `   Code:\n   \`\`\`\n   ${solution.code.split('\n').join('\n   ')}\n   \`\`\`\n`;
      }
      output += `   Confidence: ${Math.round(solution.confidence * 100)}%\n\n`;
    });
    
    output += `\n`;
  });
  
  return output;
}
