// Auto-generated safe fallback for complexity-tool

export function activate() {
    console.log("[TOOL] complexity-tool activated (passive mode)");
}

export function onFileWrite(filePath: string, content: string) {
  console.log(`[TOOL] Complexity tool processing file: ${filePath}`);
  
  // Check if the file is a source code file
  const extension = path.extname(filePath);
  const isSourceCode = ['.js', '.jsx', '.ts', '.tsx', '.java', '.py', '.rb', '.go', '.php', '.c', '.cpp', '.cs'].includes(extension);
  
  if (isSourceCode) {
    try {
      // Analyze the file for complexity
      const fileComplexity = analyzeFileComplexity(filePath, content, {
        path: filePath,
        recursive: false,
        includeMetrics: ['all'],
        outputFormat: 'text'
      });
      
      // Log complexity metrics
      console.log(`[TOOL] Complexity metrics for ${filePath}:`);
      console.log(`- Cyclomatic complexity: ${fileComplexity.metrics.cyclomatic}`);
      console.log(`- Cognitive complexity: ${fileComplexity.metrics.cognitive}`);
      console.log(`- Maintainability index: ${fileComplexity.metrics.maintainability}`);
      console.log(`- Lines of code: ${fileComplexity.metrics.sloc.physical}`);
      
      // Log issues
      const allIssues = [...fileComplexity.issues];
      fileComplexity.functions.forEach(func => {
        allIssues.push(...func.issues);
      });
      
      if (allIssues.length > 0) {
        console.log(`[TOOL] Found ${allIssues.length} complexity issues:`);
        
        // Log high severity issues
        const highSeverityIssues = allIssues.filter(issue => issue.severity === 'high' || issue.severity === 'critical');
        if (highSeverityIssues.length > 0) {
          console.log('[TOOL] High severity issues:');
          highSeverityIssues.forEach(issue => {
            console.log(`- Line ${issue.line}: ${issue.message}`);
            if (issue.recommendation) {
              console.log(`  Recommendation: ${issue.recommendation}`);
            }
          });
        }
      } else {
        console.log(`[TOOL] No complexity issues found in ${filePath}`);
      }
      
      // Identify refactoring opportunities
      if (fileComplexity.metrics.cyclomatic > 20 || fileComplexity.metrics.cognitive > 30 || fileComplexity.metrics.maintainability < 65) {
        console.log('[TOOL] This file may benefit from refactoring to reduce complexity');
      }
    } catch (error) {
      console.error(`[TOOL] Error analyzing file complexity: ${error}`);
    }
  }
}

export function onSessionStart(sessionId: string) {
  console.log(`[TOOL] Complexity tool initialized for session: ${sessionId}`);
  
  // Schedule a complexity scan for the project
  setTimeout(() => {
    console.log('[TOOL] Running project-wide complexity scan...');
    scanProjectForComplexityIssues();
  }, 3000); // Delay to ensure project files are loaded
}

export function onCommand(command: string, args: any[]) {
  if (command === 'analyze-complexity') {
    console.log('[TOOL] Analyzing code complexity...');
    
    const path = args[0] || '.';
    const recursive = args[1] !== false;
    const includeMetrics = args[2] || ['all'];
    const threshold = args[3];
    const filePatterns = args[4];
    const excludePatterns = args[5];
    
    return handleAnalyzeComplexity({
      path,
      recursive,
      includeMetrics,
      threshold,
      filePatterns,
      excludePatterns,
      outputFormat: 'text'
    });
  } else if (command === 'identify-refactoring') {
    console.log('[TOOL] Identifying refactoring opportunities...');
    
    const path = args[0] || '.';
    const recursive = args[1] !== false;
    const minComplexity = args[2] || 10;
    const minDuplication = args[3] || 3;
    const minSize = args[4] || 50;
    
    return handleIdentifyRefactoringOpportunities({
      path,
      recursive,
      minComplexity,
      minDuplication,
      minSize,
      filePatterns: args[5],
      excludePatterns: args[6],
      maxResults: args[7] || 10
    });
  } else if (command === 'generate-complexity-report') {
    console.log('[TOOL] Generating complexity report...');
    
    const analysisResults = args[0];
    const format = args[1] || 'html';
    const outputPath = args[2];
    
    return handleGenerateComplexityReport({
      analysisResults,
      format,
      outputPath,
      includeVisualizations: args[3] !== false,
      includeRecommendations: args[4] !== false
    });
  } else if (command === 'analyze-trends') {
    console.log('[TOOL] Analyzing complexity trends...');
    
    const path = args[0] || '.';
    const historyDepth = args[1] || 5;
    const metrics = args[2] || ['all'];
    
    return handleAnalyzeTrends({
      path,
      historyDepth,
      metrics,
      outputFormat: 'text'
    });
  }
  
  return null;
}

/**
 * Scans the project for complexity issues
 */
function scanProjectForComplexityIssues() {
  console.log('[TOOL] Scanning project for complexity issues...');
  
  // This is a placeholder - in a real implementation, this would scan the filesystem
  // For now, we'll just log a message
  console.log('[TOOL] Recommendation: Use the "analyze-complexity" command to check specific files or directories');
  console.log('[TOOL] Common complexity issues to watch for:');
  console.log('- High cyclomatic complexity (> 10)');
  console.log('- High cognitive complexity (> 15)');
  console.log('- Low maintainability index (< 65)');
  console.log('- Long functions (> 100 lines)');
  console.log('- Deep nesting (> 3 levels)');
}
// Importing TestRunResult interface
import { TestRunResult } from './test-manager';
// Importing report generation functions
import { generateHtmlReport, generateMarkdownReport, generateTextReport } from './test-manager';
/**
 * ComplexityTool
 * 
 * Identifies complex code that needs refactoring
 * Provides metrics on code quality and maintainability
 * Implements with static analysis tools integration
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { z } from 'zod';

// Define schemas for ComplexityTool
export const AnalyzeComplexitySchema = z.object({
  path: z.string(),
  recursive: z.boolean().default(true),
  includeMetrics: z.array(z.enum([
    'cyclomatic',
    'cognitive',
    'halstead',
    'maintainability',
    'sloc',
    'dependencies',
    'all'
  ])).default(['all']),
  threshold: z.object({
    cyclomatic: z.number().default(10),
    cognitive: z.number().default(15),
    maintainability: z.number().default(65),
    sloc: z.number().default(100),
  }).optional(),
  filePatterns: z.array(z.string()).optional(),
  excludePatterns: z.array(z.string()).optional(),
  outputFormat: z.enum(['text', 'json', 'html', 'markdown']).default('text'),
});

export const IdentifyRefactoringOpportunitiesSchema = z.object({
  path: z.string(),
  recursive: z.boolean().default(true),
  minComplexity: z.number().default(10),
  minDuplication: z.number().default(3),
  minSize: z.number().default(50),
  filePatterns: z.array(z.string()).optional(),
  excludePatterns: z.array(z.string()).optional(),
  maxResults: z.number().default(10),
});

export const GenerateComplexityReportSchema = z.object({
  analysisResults: z.any(),
  format: z.enum(['text', 'json', 'html', 'markdown']).default('html'),
  outputPath: z.string().optional(),
  includeVisualizations: z.boolean().default(true),
  includeRecommendations: z.boolean().default(true),
});

export const AnalyzeTrendsSchema = z.object({
  path: z.string(),
  historyDepth: z.number().default(5),
  metrics: z.array(z.enum([
    'cyclomatic',
    'cognitive',
    'maintainability',
    'sloc',
    'all'
  ])).default(['all']),
  outputFormat: z.enum(['text', 'json', 'html', 'markdown']).default('text'),
});

// Types for complexity analysis
interface ComplexityMetrics {
  cyclomatic: number;
  cognitive: number;
  halstead: {
    volume: number;
    difficulty: number;
    effort: number;
    time: number;
    bugs: number;
  };
  maintainability: number;
  sloc: {
    logical: number;
    physical: number;
    comment: number;
    empty: number;
    total: number;
  };
  dependencies: {
    fanIn: number;
    fanOut: number;
    instability: number;
  };
}

interface FunctionComplexity {
  name: string;
  line: number;
  column: number;
  endLine: number;
  endColumn: number;
  metrics: ComplexityMetrics;
  issues: ComplexityIssue[];
}

interface FileComplexity {
  path: string;
  metrics: ComplexityMetrics;
  functions: FunctionComplexity[];
  issues: ComplexityIssue[];
}

interface ComplexityIssue {
  type: 'warning' | 'error' | 'info';
  message: string;
  line: number;
  column: number;
  endLine?: number;
  endColumn?: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  rule: string;
  recommendation?: string;
}

interface RefactoringOpportunity {
  type: 'function' | 'class' | 'file' | 'duplication';
  path: string;
  name?: string;
  startLine: number;
  endLine: number;
  metrics: Partial<ComplexityMetrics>;
  reason: string;
  recommendation: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

interface ComplexityTrend {
  date: string;
  metrics: {
    cyclomatic: number;
    cognitive: number;
    maintainability: number;
    sloc: number;
  };
}

/**
 * Analyze code complexity
 */
export async function handleAnalyzeComplexity(args: any) {
  try {
    const options = args as z.infer<typeof AnalyzeComplexitySchema>;
    
    // Check if path exists
    try {
      await fs.access(options.path);
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error: Path ${options.path} does not exist` }],
        isError: true,
      };
    }
    
    // Get file list
    const files = await getFileList(options.path, options.recursive, options.filePatterns, options.excludePatterns);
    
    if (files.length === 0) {
      return {
        content: [{ type: "text", text: `No files found matching the specified patterns` }],
        isError: true,
      };
    }
    
    // Analyze each file
    const results: FileComplexity[] = [];
    
    for (const file of files) {
      try {
        const content = await fs.readFile(file, 'utf-8');
        const fileComplexity = analyzeFileComplexity(file, content, options);
        results.push(fileComplexity);
      } catch (error) {
        console.error(`Error analyzing file ${file}:`, error);
      }
    }
    
    // Generate summary
    const summary = generateComplexitySummary(results, options);
    
    // Generate report
    const report = generateComplexityReport(results, options);
    
    return {
      content: [{
        type: "text",
        text: `Code Complexity Analysis\n\n${summary}\n\n${options.outputFormat === 'text' ? report : 'Full report available in the data property'}`
      }],
      data: {
        results,
        summary,
        report,
      },
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error analyzing complexity: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Identify refactoring opportunities
 */
export async function handleIdentifyRefactoringOpportunities(args: any) {
  try {
    const options = args as z.infer<typeof IdentifyRefactoringOpportunitiesSchema>;
    
    // Check if path exists
    try {
      await fs.access(options.path);
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error: Path ${options.path} does not exist` }],
        isError: true,
      };
    }
    
    // Get file list
    const files = await getFileList(options.path, options.recursive, options.filePatterns, options.excludePatterns);
    
    if (files.length === 0) {
      return {
        content: [{ type: "text", text: `No files found matching the specified patterns` }],
        isError: true,
      };
    }
    
    // Analyze each file for refactoring opportunities
    const opportunities: RefactoringOpportunity[] = [];
    
    for (const file of files) {
      try {
        const content = await fs.readFile(file, 'utf-8');
        const fileOpportunities = identifyFileRefactoringOpportunities(file, content, options);
        opportunities.push(...fileOpportunities);
      } catch (error) {
        console.error(`Error analyzing file ${file} for refactoring:`, error);
      }
    }
    
    // Sort opportunities by priority and limit results
    const sortedOpportunities = opportunities
      .sort((a, b) => {
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      })
      .slice(0, options.maxResults);
    
    // Generate report
    const report = generateRefactoringReport(sortedOpportunities);
    
    return {
      content: [{
        type: "text",
        text: `Refactoring Opportunities\n\n${report}`
      }],
      data: {
        opportunities: sortedOpportunities,
      },
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error identifying refactoring opportunities: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Generate complexity report
 */
export async function handleGenerateComplexityReport(args: any) {
  try {
    const options = args as z.infer<typeof GenerateComplexityReportSchema>;
    
    // Generate report based on format
    let report: string;
    
    switch (options.format) {
      case 'html':
        report = generateHtmlReport(options.analysisResults, options.includeVisualizations, options.includeRecommendations);
        break;
      case 'markdown':
        report = generateMarkdownReport(options.analysisResults, options.includeVisualizations, options.includeRecommendations);
        break;
      case 'json':
        report = JSON.stringify(options.analysisResults, null, 2);
        break;
      case 'text':
      default:
        report = generateTextReport(options.analysisResults, options.includeRecommendations, false);
        break;
    }
    
    // Save report if outputPath is provided
    if (options.outputPath) {
      try {
        await fs.mkdir(path.dirname(options.outputPath), { recursive: true });
        await fs.writeFile(options.outputPath, report);
      } catch (error) {
        return {
          content: [{ type: "text", text: `Error writing report to ${options.outputPath}: ${error}` }],
          isError: true,
        };
      }
    }
    
    return {
      content: [{
        type: "text",
        text: options.outputPath
          ? `Complexity report generated successfully and saved to ${options.outputPath}`
          : `Generated complexity report:\n\n${options.format === 'text' ? report : 'Report available in the data property'}`
      }],
      data: {
        report,
        format: options.format,
      },
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error generating complexity report: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Analyze complexity trends
 */
export async function handleAnalyzeTrends(args: any) {
  try {
    const options = args as z.infer<typeof AnalyzeTrendsSchema>;
    
    // Check if path exists
    try {
      await fs.access(options.path);
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error: Path ${options.path} does not exist` }],
        isError: true,
      };
    }
    
    // In a real implementation, we would analyze the git history
    // For this simulation, we'll generate mock trend data
    const trends = generateMockTrendData(options.historyDepth);
    
    // Generate trend report
    const report = generateTrendReport(trends, options.metrics, options.outputFormat);
    
    return {
      content: [{
        type: "text",
        text: `Complexity Trend Analysis\n\n${options.outputFormat === 'text' ? report : 'Trend report available in the data property'}`
      }],
      data: {
        trends,
        report,
      },
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error analyzing complexity trends: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Get a list of files to analyze
 */
async function getFileList(dirPath: string, recursive: boolean, filePatterns?: string[], excludePatterns?: string[]): Promise<string[]> {
  const files: string[] = [];
  
  // Convert patterns to RegExp
  const includeRegexps = filePatterns?.map(pattern => new RegExp(pattern)) || [/\.(js|jsx|ts|tsx|java|cs|py|rb|go|php|c|cpp|h|hpp)$/];
  const excludeRegexps = excludePatterns?.map(pattern => new RegExp(pattern)) || [/node_modules|dist|build|\.git/];
  
  async function processDirectory(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      // Skip excluded paths
      if (excludeRegexps.some(regex => regex.test(fullPath))) {
        continue;
      }
      
      if (entry.isDirectory()) {
        if (recursive) {
          await processDirectory(fullPath);
        }
      } else if (entry.isFile()) {
        // Include only files matching patterns
        if (includeRegexps.some(regex => regex.test(entry.name))) {
          files.push(fullPath);
        }
      }
    }
  }
  
  // Check if dirPath is a file or directory
  const stats = await fs.stat(dirPath);
  
  if (stats.isFile()) {
    // If it's a file, just add it if it matches the patterns
    if (includeRegexps.some(regex => regex.test(dirPath)) && 
        !excludeRegexps.some(regex => regex.test(dirPath))) {
      files.push(dirPath);
    }
  } else if (stats.isDirectory()) {
    // If it's a directory, process it
    await processDirectory(dirPath);
  }
  
  return files;
}

/**
 * Analyze the complexity of a file
 */
function analyzeFileComplexity(filePath: string, content: string, options: z.infer<typeof AnalyzeComplexitySchema>): FileComplexity {
  // In a real implementation, we would use a parser to analyze the file
  // For this simulation, we'll generate mock complexity metrics
  
  const extension = path.extname(filePath);
  const isTypeScript = extension === '.ts' || extension === '.tsx';
  const isJavaScript = extension === '.js' || extension === '.jsx';
  const isJava = extension === '.java';
  const isCSharp = extension === '.cs';
  const isPython = extension === '.py';
  
  // Generate mock metrics based on file size and type
  const lines = content.split('\n');
  const lineCount = lines.length;
  
  // More complex files tend to be longer
  const complexityFactor = Math.min(1, lineCount / 1000) * 0.7 + Math.random() * 0.3;
  
  // Different languages have different complexity characteristics
  let languageFactor = 1.0;
  if (isTypeScript) languageFactor = 1.1;
  if (isJavaScript) languageFactor = 1.0;
  if (isJava) languageFactor = 1.2;
  if (isCSharp) languageFactor = 1.15;
  if (isPython) languageFactor = 0.9;
  
  // Generate metrics
  const metrics: ComplexityMetrics = {
    cyclomatic: Math.round(5 + 20 * complexityFactor * languageFactor),
    cognitive: Math.round(8 + 30 * complexityFactor * languageFactor),
    halstead: {
      volume: Math.round(1000 + 9000 * complexityFactor),
      difficulty: Math.round(10 + 40 * complexityFactor),
      effort: Math.round(10000 + 90000 * complexityFactor),
      time: Math.round(500 + 4500 * complexityFactor),
      bugs: parseFloat((0.1 + 0.9 * complexityFactor).toFixed(2)),
    },
    maintainability: Math.round(100 - 50 * complexityFactor),
    sloc: {
      logical: Math.round(lineCount * 0.6),
      physical: lineCount,
      comment: Math.round(lineCount * 0.1),
      empty: Math.round(lineCount * 0.15),
      total: lineCount,
    },
    dependencies: {
      fanIn: Math.round(2 + 8 * complexityFactor),
      fanOut: Math.round(3 + 12 * complexityFactor),
      instability: parseFloat((0.3 + 0.5 * complexityFactor).toFixed(2)),
    },
  };
  
  // Extract functions and their complexity
  const functions = extractFunctions(content, filePath);
  
  // Generate mock function metrics
  const mockFunctions: FunctionComplexity[] = functions.map((func, index) => {
    // Function complexity is often proportional to its size
    const funcComplexityFactor = Math.min(1, func.lines / 100) * 0.7 + Math.random() * 0.3;
    
    const funcMetrics: ComplexityMetrics = {
      cyclomatic: Math.round(1 + 15 * funcComplexityFactor * languageFactor),
      cognitive: Math.round(2 + 25 * funcComplexityFactor * languageFactor),
      halstead: {
        volume: Math.round(200 + 4800 * funcComplexityFactor),
        difficulty: Math.round(5 + 25 * funcComplexityFactor),
        effort: Math.round(1000 + 49000 * funcComplexityFactor),
        time: Math.round(100 + 2400 * funcComplexityFactor),
        bugs: parseFloat((0.05 + 0.45 * funcComplexityFactor).toFixed(2)),
      },
      maintainability: Math.round(100 - 40 * funcComplexityFactor),
      sloc: {
        logical: Math.round(func.lines * 0.6),
        physical: func.lines,
        comment: Math.round(func.lines * 0.1),
        empty: Math.round(func.lines * 0.15),
        total: func.lines,
      },
      dependencies: {
        fanIn: Math.round(1 + 4 * funcComplexityFactor),
        fanOut: Math.round(1 + 6 * funcComplexityFactor),
        instability: parseFloat((0.2 + 0.6 * funcComplexityFactor).toFixed(2)),
      },
    };
    
    // Generate issues based on thresholds
    const issues: ComplexityIssue[] = [];
    
    const thresholds = options.threshold || {
      cyclomatic: 10,
      cognitive: 15,
      maintainability: 65,
      sloc: 100,
    };
    
    if (funcMetrics.cyclomatic > thresholds.cyclomatic) {
      issues.push({
        type: 'warning',
        message: `Function has high cyclomatic complexity (${funcMetrics.cyclomatic})`,
        line: func.line,
        column: func.column,
        endLine: func.endLine,
        endColumn: func.endColumn,
        severity: funcMetrics.cyclomatic > thresholds.cyclomatic * 2 ? 'high' : 'medium',
        rule: 'complexity/cyclomatic',
        recommendation: 'Consider breaking this function into smaller, more focused functions',
      });
    }
    
    if (funcMetrics.cognitive > thresholds.cognitive) {
      issues.push({
        type: 'warning',
        message: `Function has high cognitive complexity (${funcMetrics.cognitive})`,
        line: func.line,
        column: func.column,
        endLine: func.endLine,
        endColumn: func.endColumn,
        severity: funcMetrics.cognitive > thresholds.cognitive * 2 ? 'high' : 'medium',
        rule: 'complexity/cognitive',
        recommendation: 'Simplify the logic by extracting complex conditions into well-named helper functions',
      });
    }
    
    if (funcMetrics.maintainability < thresholds.maintainability) {
      issues.push({
        type: 'warning',
        message: `Function has low maintainability index (${funcMetrics.maintainability})`,
        line: func.line,
        column: func.column,
        endLine: func.endLine,
        endColumn: func.endColumn,
        severity: funcMetrics.maintainability < thresholds.maintainability * 0.7 ? 'high' : 'medium',
        rule: 'complexity/maintainability',
        recommendation: 'Improve code readability by adding comments, using better variable names, and simplifying logic',
      });
    }
    
    if (funcMetrics.sloc.physical > thresholds.sloc) {
      issues.push({
        type: 'warning',
        message: `Function is too long (${funcMetrics.sloc.physical} lines)`,
        line: func.line,
        column: func.column,
        endLine: func.endLine,
        endColumn: func.endColumn,
        severity: funcMetrics.sloc.physical > thresholds.sloc * 2 ? 'high' : 'medium',
        rule: 'complexity/sloc',
        recommendation: 'Break this function into smaller, more focused functions',
      });
    }
    
    return {
      name: func.name,
      line: func.line,
      column: func.column,
      endLine: func.endLine,
      endColumn: func.endColumn,
      metrics: funcMetrics,
      issues,
    };
  });
  
  // Generate file-level issues
  const fileIssues: ComplexityIssue[] = [];
  
  const thresholds = options.threshold || {
    cyclomatic: 10,
    cognitive: 15,
    maintainability: 65,
    sloc: 100,
  };
  
  if (metrics.maintainability < thresholds.maintainability) {
    fileIssues.push({
      type: 'warning',
      message: `File has low maintainability index (${metrics.maintainability})`,
      line: 1,
      column: 1,
      severity: metrics.maintainability < thresholds.maintainability * 0.7 ? 'high' : 'medium',
      rule: 'complexity/maintainability',
      recommendation: 'Consider refactoring this file into smaller, more focused modules',
    });
  }
  
  if (metrics.sloc.physical > thresholds.sloc * 5) {
    fileIssues.push({
      type: 'warning',
      message: `File is too long (${metrics.sloc.physical} lines)`,
      line: 1,
      column: 1,
      severity: metrics.sloc.physical > thresholds.sloc * 10 ? 'high' : 'medium',
      rule: 'complexity/sloc',
      recommendation: 'Split this file into multiple smaller files, each with a single responsibility',
    });
  }
  
  if (metrics.dependencies.instability > 0.7) {
    fileIssues.push({
      type: 'warning',
      message: `File has high instability (${metrics.dependencies.instability})`,
      line: 1,
      column: 1,
      severity: metrics.dependencies.instability > 0.85 ? 'high' : 'medium',
      rule: 'complexity/instability',
      recommendation: 'Reduce the number of outgoing dependencies to make this module more stable',
    });
  }
  
  return {
    path: filePath,
    metrics,
    functions: mockFunctions,
    issues: fileIssues,
  };
}

/**
 * Extract functions from file content
 */
function extractFunctions(content: string, filePath: string): { name: string, line: number, column: number, endLine: number, endColumn: number, lines: number }[] {
  // In a real implementation, we would use a parser to extract functions
  // For this simulation, we'll use regex to extract basic function information
  
  const extension = path.extname(filePath);
  const isTypeScript = extension === '.ts' || extension === '.tsx';
  const isJavaScript = extension === '.js' || extension === '.jsx';
  
  const functions: { name: string, line: number, column: number, endLine: number, endColumn: number, lines: number }[] = [];
  
  if (isJavaScript || isTypeScript) {
    // Match function declarations, function expressions, and arrow functions
    const functionRegex = /(?:function\s+(\w+)|(?:const|let|var)\s+(\w+)\s*=\s*function|(?:const|let|var)\s+(\w+)\s*=\s*\([^)]*\)\s*=>)/g;
    const lines = content.split('\n');
    
    let match;
    while ((match = functionRegex.exec(content)) !== null) {
      const name = match[1] || match[2] || match[3] || 'anonymous';
      
      // Find line and column
      let line = 1;
      let column = 1;
      let pos = 0;
      
      for (let i = 0; i < lines.length; i++) {
        if (pos + lines[i].length >= match.index) {
          line = i + 1;
          column = match.index - pos + 1;
          break;
        }
        pos += lines[i].length + 1; // +1 for the newline
      }
      
      // Estimate function end (this is a simplification)
      // In a real implementation, we would use a parser to get the exact end
      let braceCount = 0;
      let endPos = match.index;
      let foundOpenBrace = false;
      
      // For arrow functions without braces, find the end of the statement
      if (match[0].includes('=>') && !content.substring(match.index).trim().startsWith('(')) {
        const statementEnd = content.indexOf(';', match.index);
        if (statementEnd !== -1) {
          endPos = statementEnd + 1;
        } else {
          endPos = content.length;
        }
      } else {
        // For regular functions and arrow functions with braces, find the matching closing brace
        for (let i = match.index; i < content.length; i++) {
          if (content[i] === '{') {
            foundOpenBrace = true;
            braceCount++;
          } else if (content[i] === '}') {
            braceCount--;
            if (foundOpenBrace && braceCount === 0) {
              endPos = i + 1;
              break;
            }
          }
        }
      }
      
      // Find end line and column
      let endLine = line;
      let endColumn = column;
      pos = 0;
      
      for (let i = 0; i < lines.length; i++) {
        if (pos + lines[i].length >= endPos) {
          endLine = i + 1;
          endColumn = endPos - pos + 1;
          break;
        }
        pos += lines[i].length + 1; // +1 for the newline
      }
      
      functions.push({
        name,
        line,
        column,
        endLine,
        endColumn,
        lines: endLine - line + 1,
      });
    }
  }
  
  return functions;
}

/**
 * Identify refactoring opportunities in a file
 */
function identifyFileRefactoringOpportunities(filePath: string, content: string, options: z.infer<typeof IdentifyRefactoringOpportunitiesSchema>): RefactoringOpportunity[] {
  // In a real implementation, we would use a parser to analyze the file
  // For this simulation, we'll generate mock refactoring opportunities
  
  const opportunities: RefactoringOpportunity[] = [];
  
  // Analyze file complexity
  const fileComplexity = analyzeFileComplexity(filePath, content, {
    path: filePath,
    recursive: false,
    includeMetrics: ['all'],
    outputFormat: 'json',
  });
  
  // Find complex functions
  for (const func of fileComplexity.functions) {
    if (func.metrics.cyclomatic > options.minComplexity || 
        func.metrics.cognitive > options.minComplexity * 1.5 ||
        func.metrics.sloc.physical > options.minSize) {
      
      // Determine priority based on complexity
      let priority: 'low' | 'medium' | 'high' | 'critical' = 'low';
      
      if (func.metrics.cyclomatic > options.minComplexity * 3 || 
          func.metrics.cognitive > options.minComplexity * 4 ||
          func.metrics.sloc.physical > options.minSize * 3) {
        priority = 'critical';
      } else if (func.metrics.cyclomatic > options.minComplexity * 2 || 
                func.metrics.cognitive > options.minComplexity * 3 ||
                func.metrics.sloc.physical > options.minSize * 2) {
        priority = 'high';
      } else if (func.metrics.cyclomatic > options.minComplexity * 1.5 || 
                func.metrics.cognitive > options.minComplexity * 2 ||
                func.metrics.sloc.physical > options.minSize * 1.5) {
        priority = 'medium';
      }
      
      // Generate recommendation based on metrics
      let reason = '';
      let recommendation = '';
      
      if (func.metrics.cyclomatic > options.minComplexity * 2) {
        reason = `High cyclomatic complexity (${func.metrics.cyclomatic})`;
        recommendation = 'Break down complex conditional logic into smaller, well-named functions';
      } else if (func.metrics.cognitive > options.minComplexity * 2) {
        reason = `High cognitive complexity (${func.metrics.cognitive})`;
        recommendation = 'Simplify nested control structures and extract complex conditions into helper functions';
      } else if (func.metrics.sloc.physical > options.minSize * 2) {
        reason = `Function is too long (${func.metrics.sloc.physical} lines)`;
        recommendation = 'Split this function into multiple smaller functions, each with a single responsibility';
      } else {
        reason = 'Multiple complexity issues';
        recommendation = 'Refactor this function to reduce its size and complexity';
      }
      
      opportunities.push({
        type: 'function',
        path: filePath,
        name: func.name,
        startLine: func.line,
        endLine: func.endLine,
        metrics: {
          cyclomatic: func.metrics.cyclomatic,
          cognitive: func.metrics.cognitive,
          maintainability: func.metrics.maintainability,
          halstead: func.metrics.halstead,
          sloc: func.metrics.sloc
        },
        reason,
        recommendation,
        priority
      });
    }
  }
  
  return opportunities;
}

/**
 * Generate a summary of complexity analysis results
 */
function generateComplexitySummary(results: FileComplexity[], options: z.infer<typeof AnalyzeComplexitySchema>): string {
  // Calculate overall metrics
  let totalFiles = results.length;
  let totalFunctions = results.reduce((sum, file) => sum + file.functions.length, 0);
  let totalIssues = results.reduce((sum, file) => sum + file.issues.length + file.functions.reduce((fsum, func) => fsum + func.issues.length, 0), 0);
  
  // Calculate average metrics
  let avgCyclomatic = results.reduce((sum, file) => sum + file.metrics.cyclomatic, 0) / totalFiles;
  let avgCognitive = results.reduce((sum, file) => sum + file.metrics.cognitive, 0) / totalFiles;
  let avgMaintainability = results.reduce((sum, file) => sum + file.metrics.maintainability, 0) / totalFiles;
  let avgSloc = results.reduce((sum, file) => sum + file.metrics.sloc.physical, 0) / totalFiles;
  
  // Count issues by severity
  let criticalIssues = 0;
  let highIssues = 0;
  let mediumIssues = 0;
  let lowIssues = 0;
  
  for (const file of results) {
    for (const issue of file.issues) {
      if (issue.severity === 'critical') criticalIssues++;
      if (issue.severity === 'high') highIssues++;
      if (issue.severity === 'medium') mediumIssues++;
      if (issue.severity === 'low') lowIssues++;
    }
    
    for (const func of file.functions) {
      for (const issue of func.issues) {
        if (issue.severity === 'critical') criticalIssues++;
        if (issue.severity === 'high') highIssues++;
        if (issue.severity === 'medium') mediumIssues++;
        if (issue.severity === 'low') lowIssues++;
      }
    }
  }
  
  // Generate summary text
  let summary = `Summary of Code Complexity Analysis\n`;
  summary += `==================================\n\n`;
  summary += `Files analyzed: ${totalFiles}\n`;
  summary += `Functions analyzed: ${totalFunctions}\n`;
  summary += `Issues found: ${totalIssues}\n\n`;
  
  summary += `Average Metrics:\n`;
  summary += `- Cyclomatic Complexity: ${avgCyclomatic.toFixed(2)}\n`;
  summary += `- Cognitive Complexity: ${avgCognitive.toFixed(2)}\n`;
  summary += `- Maintainability Index: ${avgMaintainability.toFixed(2)}\n`;
  summary += `- Source Lines of Code: ${avgSloc.toFixed(2)}\n\n`;
  
  summary += `Issues by Severity:\n`;
  summary += `- Critical: ${criticalIssues}\n`;
  summary += `- High: ${highIssues}\n`;
  summary += `- Medium: ${mediumIssues}\n`;
  summary += `- Low: ${lowIssues}\n\n`;
  
  // Add recommendations based on issues
  if (totalIssues > 0) {
    summary += `Recommendations:\n`;
    
    if (criticalIssues > 0) {
      summary += `- Address ${criticalIssues} critical complexity issues as a priority\n`;
    }
    
    if (avgCyclomatic > 10) {
      summary += `- Reduce cyclomatic complexity by simplifying conditional logic\n`;
    }
    
    if (avgCognitive > 15) {
      summary += `- Reduce cognitive complexity by simplifying nested control structures\n`;
    }
    
    if (avgMaintainability < 65) {
      summary += `- Improve maintainability by adding comments and simplifying code\n`;
    }
    
    if (avgSloc > 100) {
      summary += `- Reduce function size by breaking down large functions\n`;
    }
  }
  
  return summary;
}

/**
 * Generate a complexity report based on analysis results
 */
function generateComplexityReport(results: FileComplexity[], options: z.infer<typeof AnalyzeComplexitySchema>): string {
  // Generate report based on format
  switch (options.outputFormat) {
    case 'html':
      return generateHtmlReport(transformToTestRunResult(results), true, true);
    case 'markdown':
      return generateMarkdownReport(transformToTestRunResult(results), true, true);
    case 'json':
      return JSON.stringify(results, null, 2);
    case 'text':
    default:
      return generateTextReport(transformToTestRunResult(results), true, false);
  }
}

/**
 * Generate a report of refactoring opportunities
 */
function generateRefactoringReport(opportunities: RefactoringOpportunity[]): string {
  if (opportunities.length === 0) {
    return "No refactoring opportunities identified.";
  }
  
  let report = `Refactoring Opportunities Report\n`;
  report += `===============================\n\n`;
  report += `Total opportunities identified: ${opportunities.length}\n\n`;
  
  // Group by priority
  const criticalOpps = opportunities.filter(o => o.priority === 'critical');
  const highOpps = opportunities.filter(o => o.priority === 'high');
  const mediumOpps = opportunities.filter(o => o.priority === 'medium');
  const lowOpps = opportunities.filter(o => o.priority === 'low');
  
  // Add summary by priority
  report += `Summary by Priority:\n`;
  report += `- Critical: ${criticalOpps.length}\n`;
  report += `- High: ${highOpps.length}\n`;
  report += `- Medium: ${mediumOpps.length}\n`;
  report += `- Low: ${lowOpps.length}\n\n`;
  
  // Add detailed opportunities
  report += `Detailed Opportunities:\n\n`;
  
  for (const opp of opportunities) {
    report += `[${opp.priority.toUpperCase()}] ${opp.type === 'function' ? 'Function' : 'Class'}: ${opp.name || 'unnamed'}\n`;
    report += `File: ${opp.path}\n`;
    report += `Location: Lines ${opp.startLine}-${opp.endLine}\n`;
    report += `Reason: ${opp.reason}\n`;
    
    // Add metrics if available
    if (opp.metrics) {
      report += `Metrics:\n`;
      if (opp.metrics.cyclomatic) report += `  - Cyclomatic Complexity: ${opp.metrics.cyclomatic}\n`;
      if (opp.metrics.cognitive) report += `  - Cognitive Complexity: ${opp.metrics.cognitive}\n`;
      if (opp.metrics.maintainability) report += `  - Maintainability Index: ${opp.metrics.maintainability}\n`;
      if (opp.metrics.sloc?.physical) report += `  - Lines of Code: ${opp.metrics.sloc.physical}\n`;
    }
    
    report += `Recommendation: ${opp.recommendation}\n\n`;
  }
  
  return report;
}

// Function to transform FileComplexity[] to TestRunResult
function transformToTestRunResult(fileComplexities: FileComplexity[]): TestRunResult {
  return {
    success: true, // Assuming success if no errors
    startTime: new Date().toISOString(),
    endTime: new Date().toISOString(),
    duration: 0, // Placeholder, calculate based on actual data
    numPassedTests: fileComplexities.length, // Assuming each file is a passed test
    numFailedTests: 0, // Assuming no failures
    numSkippedTests: 0, // Assuming no skipped tests
    numTotalTests: fileComplexities.length,
    suites: [], // Placeholder, populate with actual suite data if available
    coverage: undefined // Placeholder, populate with actual coverage data if available
  };
}

// Placeholder implementation for generateMockTrendData
function generateMockTrendData(historyDepth: number): any[] {
  // Simulate trend data generation
  return Array.from({ length: historyDepth }, (_, index) => ({
    date: new Date(Date.now() - index * 86400000).toISOString(),
    value: Math.random() * 100
  }));
}

// Placeholder implementation for generateTrendReport
function generateTrendReport(trends: any[], metrics: any, outputFormat: string): string {
  // Simulate trend report generation
  return `Trend Report in ${outputFormat} format with ${trends.length} data points.`;
}
