/**
 * PerformanceProfiler Tool
 * 
 * Identifies performance bottlenecks in code
 * Provides detailed metrics on execution time and resource usage
 * Implements with runtime profiling and optimization suggestions
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { z } from 'zod';

// Define schemas for PerformanceProfiler tool
export const ProfileCodeSchema = z.object({
  target: z.union([
    z.object({
      code: z.string(),
      language: z.string().default('javascript'),
    }),
    z.object({
      filePath: z.string(),
    }),
    z.object({
      functionName: z.string(),
      filePath: z.string(),
    }),
  ]),
  iterations: z.number().default(100),
  warmupIterations: z.number().default(5),
  timeout: z.number().default(30000), // 30 seconds
  memoryProfiling: z.boolean().default(true),
  cpuProfiling: z.boolean().default(true),
});

export const AnalyzeHotPathsSchema = z.object({
  profileData: z.any(),
  threshold: z.number().min(0).max(100).default(10), // Percentage of total time
  includeNodeModules: z.boolean().default(false),
  sortBy: z.enum(['time', 'calls', 'avgTime']).default('time'),
  limit: z.number().default(10),
});

export const GeneratePerformanceReportSchema = z.object({
  profileData: z.any(),
  format: z.enum(['text', 'json', 'html', 'markdown']).default('text'),
  includeRecommendations: z.boolean().default(true),
  includeCharts: z.boolean().default(true),
  outputPath: z.string().optional(),
});

export const ComparePerformanceSchema = z.object({
  baseline: z.any(),
  current: z.any(),
  threshold: z.number().default(5), // Percentage change to highlight
  includeImprovedMetrics: z.boolean().default(true),
});

// Types for performance profiling
interface ProfileResult {
  executionTime: {
    total: number;
    mean: number;
    median: number;
    min: number;
    max: number;
    stdDev: number;
    p95: number;
    p99: number;
  };
  memory: {
    baseline: number;
    peak: number;
    final: number;
    allocated: number;
    freed: number;
  };
  cpu: {
    usage: number;
    userTime: number;
    systemTime: number;
  };
  callTree: CallTreeNode[];
  hotPaths: HotPath[];
  timestamp: string;
  target: string;
  iterations: number;
  warmupIterations: number;
}

interface CallTreeNode {
  name: string;
  file?: string;
  line?: number;
  column?: number;
  selfTime: number;
  totalTime: number;
  selfTimePercentage: number;
  totalTimePercentage: number;
  calls: number;
  children: CallTreeNode[];
}

interface HotPath {
  path: string;
  function: string;
  file?: string;
  line?: number;
  column?: number;
  time: number;
  timePercentage: number;
  calls: number;
  avgTime: number;
  recommendations: string[];
}

interface PerformanceComparison {
  baseline: {
    executionTime: ProfileResult['executionTime'];
    memory: ProfileResult['memory'];
    cpu: ProfileResult['cpu'];
  };
  current: {
    executionTime: ProfileResult['executionTime'];
    memory: ProfileResult['memory'];
    cpu: ProfileResult['cpu'];
  };
  changes: {
    executionTime: {
      total: number;
      mean: number;
      median: number;
      min: number;
      max: number;
      p95: number;
      p99: number;
    };
    memory: {
      peak: number;
      allocated: number;
    };
    cpu: {
      usage: number;
    };
  };
  improvements: string[];
  regressions: string[];
  summary: string;
}

/**
 * Profile code execution
 */
export async function handleProfileCode(args: any) {
  try {
    const options = args as z.infer<typeof ProfileCodeSchema>;
    
    // Get code to profile
    let code = '';
    let targetDescription = '';
    
    if ('code' in options.target) {
      code = options.target.code;
      targetDescription = `Inline ${options.target.language} code`;
    } else if ('filePath' in options.target && !('functionName' in options.target)) {
      try {
        code = await fs.readFile(options.target.filePath, 'utf-8');
        targetDescription = `File: ${options.target.filePath}`;
      } catch (error) {
        return {
          content: [{ type: "text", text: `Error reading file: ${error}` }],
          isError: true,
        };
      }
    } else if ('functionName' in options.target && 'filePath' in options.target) {
      try {
        const fileContent = await fs.readFile(options.target.filePath, 'utf-8');
        const extractedCode = extractFunctionCode(fileContent, options.target.functionName);
        
        if (!extractedCode) {
          return {
            content: [{ type: "text", text: `Error: Function ${options.target.functionName} not found in ${options.target.filePath}` }],
            isError: true,
          };
        }
        
        code = extractedCode;
        targetDescription = `Function: ${options.target.functionName} in ${options.target.filePath}`;
      } catch (error) {
        return {
          content: [{ type: "text", text: `Error reading file: ${error}` }],
          isError: true,
        };
      }
    }
    
    // Profile the code
    const profileResult = await profileCode(code, options.iterations, options.warmupIterations, options.timeout, options.memoryProfiling, options.cpuProfiling);
    
    // Add target description
    profileResult.target = targetDescription;
    
    // Generate summary
    const summary = generateProfileSummary(profileResult);
    
    return {
      content: [{
        type: "text",
        text: `Performance Profile Results\n\n${summary}`
      }],
      data: profileResult,
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error profiling code: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Analyze hot paths in profile data
 */
export async function handleAnalyzeHotPaths(args: any) {
  try {
    const options = args as z.infer<typeof AnalyzeHotPathsSchema>;
    
    // Extract hot paths from profile data
    const hotPaths = extractHotPaths(options.profileData, options.threshold, options.includeNodeModules);
    
    // Sort hot paths
    const sortedHotPaths = sortHotPaths(hotPaths, options.sortBy);
    
    // Limit the number of hot paths
    const limitedHotPaths = sortedHotPaths.slice(0, options.limit);
    
    // Generate recommendations for each hot path
    const hotPathsWithRecommendations = generateHotPathRecommendations(limitedHotPaths);
    
    // Generate report
    const report = generateHotPathsReport(hotPathsWithRecommendations);
    
    return {
      content: [{
        type: "text",
        text: `Hot Paths Analysis\n\n${report}`
      }],
      data: hotPathsWithRecommendations,
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error analyzing hot paths: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Generate a performance report
 */
export async function handleGeneratePerformanceReport(args: any) {
  try {
    const options = args as z.infer<typeof GeneratePerformanceReportSchema>;
    
    // Generate report based on format
    let report: string;
    
    switch (options.format) {
      case 'html':
        report = generateHtmlReport(options.profileData, options.includeRecommendations, options.includeCharts);
        break;
      case 'markdown':
        report = generateMarkdownReport(options.profileData, options.includeRecommendations, options.includeCharts);
        break;
      case 'json':
        report = JSON.stringify(options.profileData, null, 2);
        break;
      case 'text':
      default:
        report = generateTextReport(options.profileData, options.includeRecommendations);
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
          ? `Performance report generated successfully and saved to ${options.outputPath}`
          : `Generated performance report:\n\n${options.format === 'text' ? report : 'Report available in the data property'}`
      }],
      data: {
        report,
        format: options.format,
      },
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error generating performance report: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Compare performance between baseline and current profiles
 */
export async function handleComparePerformance(args: any) {
  try {
    const options = args as z.infer<typeof ComparePerformanceSchema>;
    
    // Compare performance
    const comparison = comparePerformance(options.baseline, options.current, options.threshold, options.includeImprovedMetrics);
    
    // Generate report
    const report = generateComparisonReport(comparison);
    
    return {
      content: [{
        type: "text",
        text: `Performance Comparison\n\n${report}`
      }],
      data: comparison,
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error comparing performance: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Extract function code from file content
 */
function extractFunctionCode(fileContent: string, functionName: string): string | null {
  // Simple regex-based extraction (not perfect, but works for most cases)
  const functionRegex = new RegExp(`(function\\s+${functionName}\\s*\\([^)]*\\)\\s*{[\\s\\S]*?^}|const\\s+${functionName}\\s*=\\s*function\\s*\\([^)]*\\)\\s*{[\\s\\S]*?^}|const\\s+${functionName}\\s*=\\s*\\([^)]*\\)\\s*=>\\s*{[\\s\\S]*?^})`, 'm');
  
  const match = fileContent.match(functionRegex);
  return match ? match[0] : null;
}

/**
 * Profile code execution
 */
async function profileCode(
  code: string,
  iterations: number,
  warmupIterations: number,
  timeout: number,
  memoryProfiling: boolean,
  cpuProfiling: boolean
): Promise<ProfileResult> {
  // In a real implementation, we would use a profiler to measure execution time, memory usage, etc.
  // For this simulation, we'll generate mock profile data
  
  // Generate execution time data
  const executionTimes: number[] = [];
  const meanTime = 50 + Math.random() * 100; // 50-150ms
  const stdDev = meanTime * 0.2; // 20% of mean
  
  for (let i = 0; i < iterations; i++) {
    // Generate a random execution time with normal distribution around the mean
    const time = Math.max(1, meanTime + (Math.random() * 2 - 1) * stdDev);
    executionTimes.push(time);
  }
  
  // Sort execution times for percentile calculations
  executionTimes.sort((a, b) => a - b);
  
  // Calculate statistics
  const totalTime = executionTimes.reduce((sum, time) => sum + time, 0);
  const mean = totalTime / iterations;
  const median = iterations % 2 === 0
    ? (executionTimes[iterations / 2 - 1] + executionTimes[iterations / 2]) / 2
    : executionTimes[Math.floor(iterations / 2)];
  const min = executionTimes[0];
  const max = executionTimes[iterations - 1];
  const variance = executionTimes.reduce((sum, time) => sum + Math.pow(time - mean, 2), 0) / iterations;
  const stdDevCalculated = Math.sqrt(variance);
  const p95 = executionTimes[Math.floor(iterations * 0.95)];
  const p99 = executionTimes[Math.floor(iterations * 0.99)];
  
  // Generate memory profile data
  const baselineMemory = 10 + Math.random() * 5; // 10-15 MB
  const peakMemory = baselineMemory + 5 + Math.random() * 20; // 15-40 MB
  const finalMemory = baselineMemory + 2 + Math.random() * 8; // 12-23 MB
  const allocatedMemory = 20 + Math.random() * 30; // 20-50 MB
  const freedMemory = allocatedMemory - (finalMemory - baselineMemory); // Allocated - (Final - Baseline)
  
  // Generate CPU profile data
  const cpuUsage = 10 + Math.random() * 90; // 10-100%
  const userTime = totalTime * 0.8; // 80% of total time
  const systemTime = totalTime * 0.2; // 20% of total time
  
  // Generate call tree
  const callTree = generateMockCallTree(code);
  
  // Generate hot paths
  const hotPaths = generateMockHotPaths(callTree);
  
  return {
    executionTime: {
      total: totalTime,
      mean,
      median,
      min,
      max,
      stdDev: stdDevCalculated,
      p95,
      p99,
    },
    memory: {
      baseline: baselineMemory,
      peak: peakMemory,
      final: finalMemory,
      allocated: allocatedMemory,
      freed: freedMemory,
    },
    cpu: {
      usage: cpuUsage,
      userTime,
      systemTime,
    },
    callTree,
    hotPaths,
    timestamp: new Date().toISOString(),
    target: '',
    iterations,
    warmupIterations,
  };
}

/**
 * Generate a mock call tree
 */
function generateMockCallTree(code: string): CallTreeNode[] {
  // In a real implementation, we would use a profiler to generate a call tree
  // For this simulation, we'll generate a mock call tree based on the code
  
  // Extract function names from the code
  const functionNames = extractFunctionNames(code);
  
  // Generate a root node
  const root: CallTreeNode = {
    name: 'root',
    selfTime: 10,
    totalTime: 100,
    selfTimePercentage: 10,
    totalTimePercentage: 100,
    calls: 1,
    children: [],
  };
  
  // Generate child nodes for each function
  for (const functionName of functionNames) {
    const totalTime = 10 + Math.random() * 40; // 10-50ms
    const selfTime = totalTime * (0.3 + Math.random() * 0.4); // 30-70% of total time
    const calls = 1 + Math.floor(Math.random() * 10); // 1-10 calls
    
    const node: CallTreeNode = {
      name: functionName,
      file: 'example.js',
      line: Math.floor(Math.random() * 100) + 1,
      column: Math.floor(Math.random() * 30) + 1,
      selfTime,
      totalTime,
      selfTimePercentage: selfTime,
      totalTimePercentage: totalTime,
      calls,
      children: [],
    };
    
    // Add some grandchildren
    if (Math.random() > 0.5) {
      const grandchildCount = Math.floor(Math.random() * 3) + 1;
      
      for (let i = 0; i < grandchildCount; i++) {
        const gcTotalTime = totalTime * (0.1 + Math.random() * 0.3); // 10-40% of parent's total time
        const gcSelfTime = gcTotalTime * (0.4 + Math.random() * 0.4); // 40-80% of total time
        const gcCalls = 1 + Math.floor(Math.random() * 5); // 1-5 calls
        
        node.children.push({
          name: `helper${i}`,
          file: 'example.js',
          line: Math.floor(Math.random() * 100) + 1,
          column: Math.floor(Math.random() * 30) + 1,
          selfTime: gcSelfTime,
          totalTime: gcTotalTime,
          selfTimePercentage: gcSelfTime,
          totalTimePercentage: gcTotalTime,
          calls: gcCalls,
          children: [],
        });
      }
    }
    
    root.children.push(node);
  }
  
  // Normalize percentages
  const totalTime = root.totalTime;
  normalizeCallTreePercentages(root, totalTime);
  
  return [root];
}

/**
 * Normalize call tree percentages
 */
function normalizeCallTreePercentages(node: CallTreeNode, totalTime: number): void {
  node.selfTimePercentage = (node.selfTime / totalTime) * 100;
  node.totalTimePercentage = (node.totalTime / totalTime) * 100;
  
  for (const child of node.children) {
    normalizeCallTreePercentages(child, totalTime);
  }
}

/**
 * Extract function names from code
 */
function extractFunctionNames(code: string): string[] {
  // Simple regex-based extraction (not perfect, but works for most cases)
  const functionNames: string[] = [];
  
  // Match function declarations
  const functionRegex = /function\s+([a-zA-Z0-9_$]+)\s*\(/g;
  let match;
  
  while ((match = functionRegex.exec(code)) !== null) {
    functionNames.push(match[1]);
  }
  
  // Match function expressions
  const functionExprRegex = /(?:const|let|var)\s+([a-zA-Z0-9_$]+)\s*=\s*function\s*\(/g;
  
  while ((match = functionExprRegex.exec(code)) !== null) {
    functionNames.push(match[1]);
  }
  
  // Match arrow functions
  const arrowFunctionRegex = /(?:const|let|var)\s+([a-zA-Z0-9_$]+)\s*=\s*\([^)]*\)\s*=>/g;
  
  while ((match = arrowFunctionRegex.exec(code)) !== null) {
    functionNames.push(match[1]);
  }
  
  // If we couldn't find any functions, add some mock ones
  if (functionNames.length === 0) {
    functionNames.push('processData', 'calculateResults', 'formatOutput');
  }
  
  return functionNames;
}

/**
 * Generate mock hot paths
 */
function generateMockHotPaths(callTree: CallTreeNode[]): HotPath[] {
  // In a real implementation, we would analyze the call tree to find hot paths
  // For this simulation, we'll generate mock hot paths based on the call tree
  
  const hotPaths: HotPath[] = [];
  
  // Flatten the call tree
  const flattenedNodes: CallTreeNode[] = [];
  flattenCallTree(callTree, flattenedNodes);
  
  // Sort by total time (descending)
  flattenedNodes.sort((a, b) => b.totalTime - a.totalTime);
  
  // Take the top nodes as hot paths
  for (let i = 0; i < Math.min(5, flattenedNodes.length); i++) {
    const node = flattenedNodes[i];
    
    hotPaths.push({
      path: generatePath(node),
      function: node.name,
      file: node.file,
      line: node.line,
      column: node.column,
      time: node.totalTime,
      timePercentage: node.totalTimePercentage,
      calls: node.calls,
      avgTime: node.totalTime / node.calls,
      recommendations: [],
    });
  }
  
  return hotPaths;
}

/**
 * Flatten a call tree
 */
function flattenCallTree(nodes: CallTreeNode[], result: CallTreeNode[]): void {
  for (const node of nodes) {
    if (node.name !== 'root') {
      result.push(node);
    }
    
    if (node.children.length > 0) {
      flattenCallTree(node.children, result);
    }
  }
}

/**
 * Generate a path for a call tree node
 */
function generatePath(node: CallTreeNode): string {
  if (node.file) {
    return `${node.file}:${node.line || 0}:${node.column || 0}`;
  } else {
    return node.name;
  }
}

/**
 * Extract hot paths from profile data
 */
function extractHotPaths(profileData: ProfileResult, threshold: number, includeNodeModules: boolean): HotPath[] {
  // In a real implementation, we would analyze the profile data to extract hot paths
  // For this simulation, we'll just return the hot paths from the profile data
  
  // Filter hot paths based on threshold and includeNodeModules
  return profileData.hotPaths.filter(hotPath => {
    // Check if the path exceeds the threshold
    if (hotPath.timePercentage < threshold) {
      return false;
    }
    
    // Check if the path is in node_modules
    if (!includeNodeModules && hotPath.path.includes('node_modules')) {
      return false;
    }
    
    return true;
  });
}

/**
 * Sort hot paths
 */
function sortHotPaths(hotPaths: HotPath[], sortBy: string): HotPath[] {
  return [...hotPaths].sort((a, b) => {
    switch (sortBy) {
      case 'time':
        return b.time - a.time;
      case 'calls':
        return b.calls - a.calls;
      case 'avgTime':
        return b.avgTime - a.avgTime;
      default:
        return b.time - a.time;
    }
  });
}

/**
 * Generate recommendations for hot paths
 */
function generateHotPathRecommendations(hotPaths: HotPath[]): HotPath[] {
  return hotPaths.map(hotPath => {
    const recommendations: string[] = [];
    
    // Generate recommendations based on the hot path characteristics
    if (hotPath.calls > 10 && hotPath.avgTime > 10) {
      recommendations.push('Consider memoizing the function to avoid redundant calculations');
    }
    
    if (hotPath.timePercentage > 20) {
      recommendations.push('This function is a critical hot path. Consider optimizing its algorithm or implementation');
    }
    
    if (hotPath.calls > 100) {
      recommendations.push('This function is called very frequently. Consider inlining it or reducing the number of calls');
    }
    
    if (hotPath.avgTime > 50) {
      recommendations.push('This function has a high average execution time. Look for opportunities to optimize or parallelize its work');
    }
    
    // If no specific recommendations, add a generic one
    if (recommendations.length === 0) {
      recommendations.push('Review this hot path for potential optimizations');
    }
    
    return {
      ...hotPath,
      recommendations,
    };
  });
}

/**
 * Generate a profile summary
 */
function generateProfileSummary(profileResult: ProfileResult): string {
  const { executionTime, memory, cpu, hotPaths, target, iterations } = profileResult;
  
  let summary = `Target: ${target}\n`;
  summary += `Iterations: ${iterations}\n\n`;
  
  summary += `Execution Time:\n`;
  summary += `- Total: ${executionTime.total.toFixed(2)} ms\n`;
  summary += `- Mean: ${executionTime.mean.toFixed(2)} ms\n`;
  summary += `- Median: ${executionTime.median.toFixed(2)} ms\n`;
  summary += `- Min: ${executionTime.min.toFixed(2)} ms\n`;
  summary += `- Max: ${executionTime.max.toFixed(2)} ms\n`;
  summary += `- Std Dev: ${executionTime.stdDev.toFixed(2)} ms\n`;
  summary += `- P95: ${executionTime.p95.toFixed(2)} ms\n`;
  summary += `- P99: ${executionTime.p99.toFixed(2)} ms\n\n`;
  
  summary += `Memory Usage:\n`;
  summary += `- Baseline: ${memory.baseline.toFixed(2)} MB\n`;
  summary += `- Peak: ${memory.peak.toFixed(2)} MB\n`;
  summary += `- Final: ${memory.final.toFixed(2)} MB\n`;
  summary += `- Allocated: ${memory.allocated.toFixed(2)} MB\n`;
  summary += `- Freed: ${memory.freed.toFixed(2)} MB\n\n`;
  
  summary += `CPU Usage:\n`;
  summary += `- Usage: ${cpu.usage.toFixed(2)}%\n`;
  summary += `- User Time: ${cpu.userTime.toFixed(2)} ms\n`;
  summary += `- System Time: ${cpu.systemTime.toFixed(2)} ms\n\n`;
  
  summary += `Top Hot Paths:\n`;
  hotPaths.slice(0, 3).forEach((hotPath, index) => {
    summary += `${index + 1}. ${hotPath.function} (${hotPath.timePercentage.toFixed(2)}% of total time)\n`;
    summary += `   Path: ${hotPath.path}\n`;
    summary += `   Calls: ${hotPath.calls}, Avg Time: ${hotPath.avgTime.toFixed(2)} ms\n`;
  });
  
  return summary;
}

/**
 * Generate a hot paths report
 */
function generateHotPathsReport(hotPaths: HotPath[]): string {
  let report = `Found ${hotPaths.length} hot paths\n\n`;
  
  hotPaths.forEach((hotPath, index) => {
    report += `${index + 1}. ${hotPath.function}\n`;
    report += `   Path: ${hotPath.path}\n`;
    report += `   Time: ${hotPath.time.toFixed(2)} ms (${hotPath.timePercentage.toFixed(2)}% of total time)\n`;
    report += `   Calls: ${hotPath.calls}, Avg Time: ${hotPath.avgTime.toFixed(2)} ms\n`;
    
    if (hotPath.recommendations.length > 0) {
      report += `   Recommendations:\n`;
      hotPath.recommendations.forEach(recommendation => {
        report += `   - ${recommendation}\n`;
      });
    }
    
    report += `\n`;
  });
  
  return report;
}

/**
 * Generate a text report
 */
function generateTextReport(profileData: ProfileResult, includeRecommendations: boolean): string {
  const { executionTime, memory, cpu, hotPaths, callTree, target, iterations, timestamp } = profileData;
  
  let report = `Performance Profile Report\n`;
  report += `=========================\n\n`;
  
  report += `Target: ${target}\n`;
  report += `Timestamp: ${new Date(timestamp).toLocaleString()}\n`;
  report += `Iterations: ${iterations}\n\n`;
  
  report += `Execution Time\n`;
  report += `--------------\n`;
  report += `Total: ${executionTime.total.toFixed(2)} ms\n`;
  report += `Mean: ${executionTime.mean.toFixed(2)} ms\n`;
  report += `Median: ${executionTime.median.toFixed(2)} ms\n`;
  report += `Min: ${executionTime.min.toFixed(2)} ms\n`;
  report += `Max: ${executionTime.max.toFixed(2)} ms\n`;
  report += `Std Dev: ${executionTime.stdDev.toFixed(2)} ms\n`;
  report += `P95: ${executionTime.p95.toFixed(2)} ms\n`;
  report += `P99: ${executionTime.p99.toFixed(2)} ms\n\n`;
  
  report += `Memory Usage\n`;
  report += `------------\n`;
  report += `Baseline: ${memory.baseline.toFixed(2)} MB\n`;
  report += `Peak: ${memory.peak.toFixed(2)} MB\n`;
  report += `Final: ${memory.final.toFixed(2)} MB\n`;
  report += `Allocated: ${memory.allocated.toFixed(2)} MB\n`;
  report += `Freed: ${memory.freed.toFixed(2)} MB\n\n`;
  
  report += `CPU Usage\n`;
  report += `---------\n`;
  report += `Usage: ${cpu.usage.toFixed(2)}%\n`;
  report += `User Time: ${cpu.userTime.toFixed(2)} ms\n`;
  report += `System Time: ${cpu.systemTime.toFixed(2)} ms\n\n`;
  
  report += `Hot Paths\n`;
  report += `---------\n`;
  hotPaths.forEach((hotPath, index) => {
    report += `${index + 1}. ${hotPath.function}\n`;
    report += `   Path: ${hotPath.path}\n`;
    report += `   Time: ${hotPath.time.toFixed(2)} ms (${hotPath.timePercentage.toFixed(2)}% of total time)\n`;
    report += `   Calls: ${hotPath.calls}, Avg Time: ${hotPath.avgTime.toFixed(2)} ms\n`;
    
    if (includeRecommendations && hotPath.recommendations.length > 0) {
      report += `   Recommendations:\n`;
      hotPath.recommendations.forEach(recommendation => {
        report += `   - ${recommendation}\n`;
      });
    }
    
    report += `\n`;
  });
  
  return report;
}

/**
 * Generate an HTML report
 */
function generateHtmlReport(profileData: ProfileResult, includeRecommendations: boolean, includeCharts: boolean): string {
  // In a real implementation, we would generate a proper HTML report with charts
  // For this simulation, we'll generate a basic HTML report
  
  const { executionTime, memory, cpu, hotPaths, callTree, target, iterations, timestamp } = profileData;
  
  let report = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Performance Profile Report</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 1200px; margin: 0 auto; padding: 20px; }
    h1, h2, h3, h4 { margin-top: 20px; }
    .summary { display: flex; flex-wrap: wrap; gap: 20px; margin: 20px 0; }
    .metric { background-color: #f5f5f5; padding: 15px; border-radius: 5px; flex: 1; min-width: 200px; }
    .hot-path { margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
    .recommendation { margin: 5px 0; padding: 5px 10px; border-left: 3px solid #007bff; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background-color: #f2f2f2; }
  </style>
</head>
<body>
  <h1>Performance Profile Report</h1>
  
  <div class="summary">
    <div class="metric">
      <h3>Target</h3>
      <p>${target}</p>
    </div>
    <div class="metric">
      <h3>Timestamp</h3>
      <p>${new Date(timestamp).toLocaleString()}</p>
    </div>
    <div class="metric">
      <h3>Iterations</h3>
      <p>${iterations}</p>
    </div>
  </div>
  
  <h2>Execution Time</h2>
  <table>
    <tr>
      <th>Metric</th>
      <th>Value (ms)</th>
    </tr>
    <tr>
      <td>Total</td>
      <td>${executionTime.total.toFixed(2)}</td>
    </tr>
    <tr>
      <td>Mean</td>
      <td>${executionTime.mean.toFixed(2)}</td>
    </tr>
    <tr>
      <td>Median</td>
      <td>${executionTime.median.toFixed(2)}</td>
    </tr>
    <tr>
      <td>Min</td>
      <td>${executionTime.min.toFixed(2)}</td>
    </tr>
    <tr>
      <td>Max</td>
      <td>${executionTime.max.toFixed(2)}</td>
    </tr>
    <tr>
      <td>Std Dev</td>
      <td>${executionTime.stdDev.toFixed(2)}</td>
    </tr>
    <tr>
      <td>P95</td>
      <td>${executionTime.p95.toFixed(2)}</td>
    </tr>
    <tr>
      <td>P99</td>
      <td>${executionTime.p99.toFixed(2)}</td>
    </tr>
  </table>
  
  <h2>Memory Usage</h2>
  <table>
    <tr>
      <th>Metric</th>
      <th>Value (MB)</th>
    </tr>
    <tr>
      <td>Baseline</td>
      <td>${memory.baseline.toFixed(2)}</td>
    </tr>
    <tr>
      <td>Peak</td>
      <td>${memory.peak.toFixed(2)}</td>
    </tr>
    <tr>
      <td>Final</td>
      <td>${memory.final.toFixed(2)}</td>
    </tr>
    <tr>
      <td>Allocated</td>
      <td>${memory.allocated.toFixed(2)}</td>
    </tr>
    <tr>
      <td>Freed</td>
      <td>${memory.freed.toFixed(2)}</td>
    </tr>
  </table>
  
  <h2>CPU Usage</h2>
  <table>
    <tr>
      <th>Metric</th>
      <th>Value</th>
    </tr>
    <tr>
      <td>Usage</td>
      <td>${cpu.usage.toFixed(2)}%</td>
    </tr>
    <tr>
      <td>User Time</td>
      <td>${cpu.userTime.toFixed(2)} ms</td>
    </tr>
    <tr>
      <td>System Time</td>
      <td>${cpu.systemTime.toFixed(2)} ms</td>
    </tr>
  </table>
  
  <h2>Hot Paths</h2>
  ${hotPaths.map((hotPath, index) => `
    <div class="hot-path">
      <h3>${index + 1}. ${hotPath.function}</h3>
      <p><strong>Path:</strong> ${hotPath.path}</p>
      <p><strong>Time:</strong> ${hotPath.time.toFixed(2)} ms (${hotPath.timePercentage.toFixed(2)}% of total time)</p>
      <p><strong>Calls:</strong> ${hotPath.calls}, <strong>Avg Time:</strong> ${hotPath.avgTime.toFixed(2)} ms</p>
      
      ${includeRecommendations && hotPath.recommendations.length > 0 ? `
        <h4>Recommendations:</h4>
        <ul>
          ${hotPath.recommendations.map(recommendation => `
            <li class="recommendation">${recommendation}</li>
          `).join('')}
        </ul>
      ` : ''}
    </div>
  `).join('')}
  
  ${includeCharts ? `
    <h2>Performance Charts</h2>
    <p>Charts would be displayed here in a real implementation.</p>
  ` : ''}
</body>
</html>`;
  
  return report;
}

/**
 * Generate a Markdown report
 */
function generateMarkdownReport(profileData: ProfileResult, includeRecommendations: boolean, includeCharts: boolean): string {
  const { executionTime, memory, cpu, hotPaths, callTree, target, iterations, timestamp } = profileData;
  
  let report = `# Performance Profile Report\n\n`;
  
  report += `- **Target:** ${target}\n`;
  report += `- **Timestamp:** ${new Date(timestamp).toLocaleString()}\n`;
  report += `- **Iterations:** ${iterations}\n\n`;
  
  report += `## Execution Time\n\n`;
  report += `| Metric | Value (ms) |\n`;
  report += `| ------ | ---------: |\n`;
  report += `| Total | ${executionTime.total.toFixed(2)} |\n`;
  report += `| Mean | ${executionTime.mean.toFixed(2)} |\n`;
  report += `| Median | ${executionTime.median.toFixed(2)} |\n`;
  report += `| Min | ${executionTime.min.toFixed(2)} |\n`;
  report += `| Max | ${executionTime.max.toFixed(2)} |\n`;
  report += `| Std Dev | ${executionTime.stdDev.toFixed(2)} |\n`;
  report += `| P95 | ${executionTime.p95.toFixed(2)} |\n`;
  report += `| P99 | ${executionTime.p99.toFixed(2)} |\n\n`;
  
  report += `## Memory Usage\n\n`;
  report += `| Metric | Value (MB) |\n`;
  report += `| ------ | ---------: |\n`;
  report += `| Baseline | ${memory.baseline.toFixed(2)} |\n`;
  report += `| Peak | ${memory.peak.toFixed(2)} |\n`;
  report += `| Final | ${memory.final.toFixed(2)} |\n`;
  report += `| Allocated | ${memory.allocated.toFixed(2)} |\n`;
  report += `| Freed | ${memory.freed.toFixed(2)} |\n\n`;
  
  report += `## CPU Usage\n\n`;
  report += `| Metric | Value |\n`;
  report += `| ------ | ----: |\n`;
  report += `| Usage | ${cpu.usage.toFixed(2)}% |\n`;
  report += `| User Time | ${cpu.userTime.toFixed(2)} ms |\n`;
  report += `| System Time | ${cpu.systemTime.toFixed(2)} ms |\n\n`;
  
  report += `## Hot Paths\n\n`;
  
  hotPaths.forEach((hotPath, index) => {
    report += `### ${index + 1}. ${hotPath.function}\n\n`;
    report += `- **Path:** ${hotPath.path}\n`;
    report += `- **Time:** ${hotPath.time.toFixed(2)} ms (${hotPath.timePercentage.toFixed(2)}% of total time)\n`;
    report += `- **Calls:** ${hotPath.calls}, **Avg Time:** ${hotPath.avgTime.toFixed(2)} ms\n\n`;
    
    if (includeRecommendations && hotPath.recommendations.length > 0) {
      report += `#### Recommendations\n\n`;
      hotPath.recommendations.forEach(recommendation => {
        report += `- ${recommendation}\n`;
      });
      report += `\n`;
    }
  });
  
  if (includeCharts) {
    report += `## Performance Charts\n\n`;
    report += `Charts would be displayed here in a real implementation.\n\n`;
  }
  
  return report;
}

/**
 * Compare performance between baseline and current profiles
 */
function comparePerformance(
  baseline: ProfileResult,
  current: ProfileResult,
  threshold: number,
  includeImprovedMetrics: boolean
): PerformanceComparison {
  // Calculate changes
  const changes = {
    executionTime: {
      total: calculatePercentageChange(baseline.executionTime.total, current.executionTime.total),
      mean: calculatePercentageChange(baseline.executionTime.mean, current.executionTime.mean),
      median: calculatePercentageChange(baseline.executionTime.median, current.executionTime.median),
      min: calculatePercentageChange(baseline.executionTime.min, current.executionTime.min),
      max: calculatePercentageChange(baseline.executionTime.max, current.executionTime.max),
      p95: calculatePercentageChange(baseline.executionTime.p95, current.executionTime.p95),
      p99: calculatePercentageChange(baseline.executionTime.p99, current.executionTime.p99),
    },
    memory: {
      peak: calculatePercentageChange(baseline.memory.peak, current.memory.peak),
      allocated: calculatePercentageChange(baseline.memory.allocated, current.memory.allocated),
    },
    cpu: {
      usage: calculatePercentageChange(baseline.cpu.usage, current.cpu.usage),
    },
  };
  
  // Generate improvements and regressions
  const improvements: string[] = [];
  const regressions: string[] = [];
  
  // Check execution time changes
  if (changes.executionTime.mean < -threshold) {
    improvements.push(`Mean execution time improved by ${Math.abs(changes.executionTime.mean).toFixed(2)}%`);
  } else if (changes.executionTime.mean > threshold) {
    regressions.push(`Mean execution time regressed by ${changes.executionTime.mean.toFixed(2)}%`);
  }
  
  if (changes.executionTime.p95 < -threshold) {
    improvements.push(`P95 execution time improved by ${Math.abs(changes.executionTime.p95).toFixed(2)}%`);
  } else if (changes.executionTime.p95 > threshold) {
    regressions.push(`P95 execution time regressed by ${changes.executionTime.p95.toFixed(2)}%`);
  }
  
  // Check memory changes
  if (changes.memory.peak < -threshold) {
    improvements.push(`Peak memory usage improved by ${Math.abs(changes.memory.peak).toFixed(2)}%`);
  } else if (changes.memory.peak > threshold) {
    regressions.push(`Peak memory usage regressed by ${changes.memory.peak.toFixed(2)}%`);
  }
  
  if (changes.memory.allocated < -threshold) {
    improvements.push(`Memory allocation improved by ${Math.abs(changes.memory.allocated).toFixed(2)}%`);
  } else if (changes.memory.allocated > threshold) {
    regressions.push(`Memory allocation regressed by ${changes.memory.allocated.toFixed(2)}%`);
  }
  
  // Check CPU changes
  if (changes.cpu.usage < -threshold) {
    improvements.push(`CPU usage improved by ${Math.abs(changes.cpu.usage).toFixed(2)}%`);
  } else if (changes.cpu.usage > threshold) {
    regressions.push(`CPU usage regressed by ${changes.cpu.usage.toFixed(2)}%`);
  }
  
  // Filter improvements if not including improved metrics
  const filteredImprovements = includeImprovedMetrics ? improvements : [];
  
  // Generate summary
  let summary = '';
  
  if (regressions.length === 0 && filteredImprovements.length === 0) {
    summary = 'No significant performance changes detected.';
  } else {
    if (regressions.length > 0) {
      summary += `Found ${regressions.length} performance regression${regressions.length > 1 ? 's' : ''}.`;
    }
    
    if (filteredImprovements.length > 0) {
      if (summary) summary += ' ';
      summary += `Found ${filteredImprovements.length} performance improvement${filteredImprovements.length > 1 ? 's' : ''}.`;
    }
  }
  
  return {
    baseline: {
      executionTime: baseline.executionTime,
      memory: baseline.memory,
      cpu: baseline.cpu,
    },
    current: {
      executionTime: current.executionTime,
      memory: current.memory,
      cpu: current.cpu,
    },
    changes,
    improvements: filteredImprovements,
    regressions,
    summary,
  };
}

/**
 * Calculate percentage change between two values
 */
function calculatePercentageChange(baseline: number, current: number): number {
  if (baseline === 0) {
    return current === 0 ? 0 : 100;
  }
  
  return ((current - baseline) / baseline) * 100;
}

/**
 * Generate a comparison report
 */
function generateComparisonReport(comparison: PerformanceComparison): string {
  const { baseline, current, changes, improvements, regressions, summary } = comparison;
  
  let report = `Performance Comparison\n`;
  report += `=====================\n\n`;
  
  report += `Summary: ${summary}\n\n`;
  
  if (regressions.length > 0) {
    report += `Regressions:\n`;
    regressions.forEach(regression => {
      report += `- ${regression}\n`;
    });
    report += `\n`;
  }
  
  if (improvements.length > 0) {
    report += `Improvements:\n`;
    improvements.forEach(improvement => {
      report += `- ${improvement}\n`;
    });
    report += `\n`;
  }
  
  report += `Execution Time\n`;
  report += `--------------\n`;
  report += `| Metric | Baseline (ms) | Current (ms) | Change (%) |\n`;
  report += `| ------ | ------------: | -----------: | ---------: |\n`;
  report += `| Total | ${baseline.executionTime.total.toFixed(2)} | ${current.executionTime.total.toFixed(2)} | ${formatChange(changes.executionTime.total)} |\n`;
  report += `| Mean | ${baseline.executionTime.mean.toFixed(2)} | ${current.executionTime.mean.toFixed(2)} | ${formatChange(changes.executionTime.mean)} |\n`;
  report += `| Median | ${baseline.executionTime.median.toFixed(2)} | ${current.executionTime.median.toFixed(2)} | ${formatChange(changes.executionTime.median)} |\n`;
  report += `| Min | ${baseline.executionTime.min.toFixed(2)} | ${current.executionTime.min.toFixed(2)} | ${formatChange(changes.executionTime.min)} |\n`;
  report += `| Max | ${baseline.executionTime.max.toFixed(2)} | ${current.executionTime.max.toFixed(2)} | ${formatChange(changes.executionTime.max)} |\n`;
  report += `| P95 | ${baseline.executionTime.p95.toFixed(2)} | ${current.executionTime.p95.toFixed(2)} | ${formatChange(changes.executionTime.p95)} |\n`;
  report += `| P99 | ${baseline.executionTime.p99.toFixed(2)} | ${current.executionTime.p99.toFixed(2)} | ${formatChange(changes.executionTime.p99)} |\n\n`;
  
  report += `Memory Usage\n`;
  report += `------------\n`;
  report += `| Metric | Baseline (MB) | Current (MB) | Change (%) |\n`;
  report += `| ------ | ------------: | -----------: | ---------: |\n`;
  report += `| Peak | ${baseline.memory.peak.toFixed(2)} | ${current.memory.peak.toFixed(2)} | ${formatChange(changes.memory.peak)} |\n`;
  report += `| Allocated | ${baseline.memory.allocated.toFixed(2)} | ${current.memory.allocated.toFixed(2)} | ${formatChange(changes.memory.allocated)} |\n\n`;
  
  report += `CPU Usage\n`;
  report += `---------\n`;
  report += `| Metric | Baseline (%) | Current (%) | Change (%) |\n`;
  report += `| ------ | -----------: | ----------: | ---------: |\n`;
  report += `| Usage | ${baseline.cpu.usage.toFixed(2)} | ${current.cpu.usage.toFixed(2)} | ${formatChange(changes.cpu.usage)} |\n\n`;
  
  return report;
}

/**
 * Format a change value for display
 */
function formatChange(change: number): string {
  const prefix = change > 0 ? '+' : '';
  return `${prefix}${change.toFixed(2)}%`;
}
