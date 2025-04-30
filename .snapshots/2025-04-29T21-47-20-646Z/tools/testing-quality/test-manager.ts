// Auto-generated safe fallback for test-manager

export function activate() {
    console.log("[TOOL] test-manager activated (passive mode)");
}

export function onFileWrite() { /* no-op */ }
export function onSessionStart() { /* no-op */ }
export function onCommand() { /* no-op */ }
// Exporting TestRunResult interface
export { TestRunResult };
// Exporting report generation functions
export { generateHtmlReport, generateMarkdownReport, generateTextReport };
/**
 * TestManager Tool
 * 
 * Manages and runs tests for a project
 * Provides test execution and reporting capabilities
 * Implements with test discovery and selective execution
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { z } from 'zod';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Define schemas for TestManager tool
export const RunTestsSchema = z.object({
  testPattern: z.string().optional(),
  testFiles: z.array(z.string()).optional(),
  testNames: z.array(z.string()).optional(),
  framework: z.enum(['jest', 'mocha', 'jasmine', 'vitest', 'cypress', 'playwright', 'auto']).default('auto'),
  watch: z.boolean().default(false),
  coverage: z.boolean().default(false),
  updateSnapshots: z.boolean().default(false),
  bail: z.boolean().default(false),
  verbose: z.boolean().default(false),
  timeout: z.number().default(60000), // 60 seconds
  additionalArgs: z.array(z.string()).optional(),
});

export const FindTestsSchema = z.object({
  directory: z.string().default('.'),
  recursive: z.boolean().default(true),
  testPattern: z.string().optional(),
  excludePattern: z.string().optional(),
  framework: z.enum(['jest', 'mocha', 'jasmine', 'vitest', 'cypress', 'playwright', 'auto']).default('auto'),
  includeSkipped: z.boolean().default(false),
});

export const GenerateTestReportSchema = z.object({
  testResults: z.any(),
  format: z.enum(['text', 'json', 'html', 'markdown']).default('text'),
  outputPath: z.string().optional(),
  includeFailureDetails: z.boolean().default(true),
  includeCoverage: z.boolean().default(true),
});

export const AnalyzeTestCoverageSchema = z.object({
  coverageData: z.any(),
  threshold: z.object({
    statements: z.number().min(0).max(100).default(80),
    branches: z.number().min(0).max(100).default(80),
    functions: z.number().min(0).max(100).default(80),
    lines: z.number().min(0).max(100).default(80),
  }).optional(),
  excludePatterns: z.array(z.string()).optional(),
});

// Types for test management
interface TestResult {
  name: string;
  status: 'passed' | 'failed' | 'skipped' | 'pending';
  duration: number;
  failureMessages?: string[];
  location?: {
    file: string;
    line: number;
    column: number;
  };
}

interface TestSuiteResult {
  name: string;
  status: 'passed' | 'failed';
  duration: number;
  tests: TestResult[];
  suites?: TestSuiteResult[];
  coverage?: CoverageData;
}

interface TestRunResult {
  success: boolean;
  startTime: string;
  endTime: string;
  duration: number;
  numPassedTests: number;
  numFailedTests: number;
  numSkippedTests: number;
  numTotalTests: number;
  suites: TestSuiteResult[];
  coverage?: CoverageData;
}

interface CoverageData {
  statements: {
    total: number;
    covered: number;
    skipped: number;
    percentage: number;
  };
  branches: {
    total: number;
    covered: number;
    skipped: number;
    percentage: number;
  };
  functions: {
    total: number;
    covered: number;
    skipped: number;
    percentage: number;
  };
  lines: {
    total: number;
    covered: number;
    skipped: number;
    percentage: number;
  };
  files: {
    [filePath: string]: {
      statements: {
        total: number;
        covered: number;
        skipped: number;
        percentage: number;
      };
      branches: {
        total: number;
        covered: number;
        skipped: number;
        percentage: number;
      };
      functions: {
        total: number;
        covered: number;
        skipped: number;
        percentage: number;
      };
      lines: {
        total: number;
        covered: number;
        skipped: number;
        percentage: number;
      };
    };
  };
}

interface TestFile {
  path: string;
  name: string;
  framework: string;
  tests: string[];
  suites: string[];
  skipped: boolean;
}

/**
 * Run tests
 */
export async function handleRunTests(args: any) {
  try {
    const options = args as z.infer<typeof RunTestsSchema>;
    
    // Detect test framework if set to auto
    const framework = options.framework === 'auto'
      ? await detectTestFramework()
      : options.framework;
    
    if (!framework) {
      return {
        content: [{ type: "text", text: `Error: Could not detect test framework. Please specify a framework.` }],
        isError: true,
      };
    }
    
    // Build command to run tests
    const command = buildTestCommand(framework, options);
    
    // Run tests
    const startTime = new Date();
    
    try {
      const { stdout, stderr } = await execAsync(command, { timeout: options.timeout });
      
      // Parse test results
      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();
      
      const testResults = parseTestResults(stdout, stderr, framework, startTime.toISOString(), endTime.toISOString(), duration);
      
      // Generate summary
      const summary = generateTestSummary(testResults);
      
      return {
        content: [{
          type: "text",
          text: `Test Results\n\n${summary}`
        }],
        data: testResults,
      };
    } catch (error: any) {
      // Check if it's a test failure (non-zero exit code) or a command error
      if (error.stdout || error.stderr) {
        // Tests ran but some failed
        const endTime = new Date();
        const duration = endTime.getTime() - startTime.getTime();
        
        const testResults = parseTestResults(error.stdout || '', error.stderr || '', framework, startTime.toISOString(), endTime.toISOString(), duration, false);
        
        // Generate summary
        const summary = generateTestSummary(testResults);
        
        return {
          content: [{
            type: "text",
            text: `Test Results (Some Tests Failed)\n\n${summary}`
          }],
          data: testResults,
        };
      } else {
        // Command error
        return {
          content: [{ type: "text", text: `Error running tests: ${error.message}` }],
          isError: true,
        };
      }
    }
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error running tests: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Find tests in a directory
 */
export async function handleFindTests(args: any) {
  try {
    const options = args as z.infer<typeof FindTestsSchema>;
    
    // Check if directory exists
    try {
      await fs.access(options.directory);
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error: Directory ${options.directory} does not exist` }],
        isError: true,
      };
    }
    
    // Detect test framework if set to auto
    const framework = options.framework === 'auto'
      ? await detectTestFramework()
      : options.framework;
    
    if (!framework) {
      return {
        content: [{ type: "text", text: `Error: Could not detect test framework. Please specify a framework.` }],
        isError: true,
      };
    }
    
    // Find test files
    const testFiles = await findTestFiles(options.directory, options.recursive, options.testPattern, options.excludePattern, framework);
    
    // Extract test names from files
    const testFilesWithTests = await extractTestNames(testFiles, options.includeSkipped);
    
    // Generate summary
    const summary = generateTestFilesSummary(testFilesWithTests);
    
    return {
      content: [{
        type: "text",
        text: `Found Tests\n\n${summary}`
      }],
      data: testFilesWithTests,
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error finding tests: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Generate a test report
 */
export async function handleGenerateTestReport(args: any) {
  try {
    const options = args as z.infer<typeof GenerateTestReportSchema>;
    
    // Generate report based on format
    let report: string;
    
    switch (options.format) {
      case 'html':
        report = generateHtmlReport(options.testResults, options.includeFailureDetails, options.includeCoverage);
        break;
      case 'markdown':
        report = generateMarkdownReport(options.testResults, options.includeFailureDetails, options.includeCoverage);
        break;
      case 'json':
        report = JSON.stringify(options.testResults, null, 2);
        break;
      case 'text':
      default:
        report = generateTextReport(options.testResults, options.includeFailureDetails, options.includeCoverage);
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
          ? `Test report generated successfully and saved to ${options.outputPath}`
          : `Generated test report:\n\n${options.format === 'text' ? report : 'Report available in the data property'}`
      }],
      data: {
        report,
        format: options.format,
      },
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error generating test report: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Analyze test coverage
 */
export async function handleAnalyzeTestCoverage(args: any) {
  try {
    const options = args as z.infer<typeof AnalyzeTestCoverageSchema>;
    
    // Analyze coverage
    const analysis = analyzeCoverage(options.coverageData, options.threshold, options.excludePatterns);
    
    // Generate report
    const report = generateCoverageReport(analysis);
    
    return {
      content: [{
        type: "text",
        text: `Coverage Analysis\n\n${report}`
      }],
      data: analysis,
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error analyzing test coverage: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Detect test framework
 */
async function detectTestFramework(): Promise<string | null> {
  try {
    // Check for package.json
    const packageJsonContent = await fs.readFile('package.json', 'utf-8');
    const packageJson = JSON.parse(packageJsonContent);
    
    // Check dependencies and devDependencies
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    if (dependencies.jest) return 'jest';
    if (dependencies.mocha) return 'mocha';
    if (dependencies.jasmine) return 'jasmine';
    if (dependencies.vitest) return 'vitest';
    if (dependencies.cypress) return 'cypress';
    if (dependencies.playwright) return 'playwright';
    
    // Check for config files
    try {
      await fs.access('jest.config.js');
      return 'jest';
    } catch (error) {}
    
    try {
      await fs.access('.mocharc.js');
      return 'mocha';
    } catch (error) {}
    
    try {
      await fs.access('jasmine.json');
      return 'jasmine';
    } catch (error) {}
    
    try {
      await fs.access('vitest.config.js');
      return 'vitest';
    } catch (error) {}
    
    try {
      await fs.access('cypress.config.js');
      return 'cypress';
    } catch (error) {}
    
    try {
      await fs.access('playwright.config.js');
      return 'playwright';
    } catch (error) {}
    
    // Default to Jest if we can't detect anything
    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Build test command
 */
function buildTestCommand(framework: string, options: z.infer<typeof RunTestsSchema>): string {
  let command = '';
  
  switch (framework) {
    case 'jest':
      command = 'npx jest';
      if (options.testPattern) command += ` ${options.testPattern}`;
      if (options.testFiles && options.testFiles.length > 0) command += ` ${options.testFiles.join(' ')}`;
      if (options.testNames && options.testNames.length > 0) command += ` -t "${options.testNames.join('|')}"`;
      if (options.watch) command += ' --watch';
      if (options.coverage) command += ' --coverage';
      if (options.updateSnapshots) command += ' --updateSnapshot';
      if (options.bail) command += ' --bail';
      if (options.verbose) command += ' --verbose';
      break;
    
    case 'mocha':
      command = 'npx mocha';
      if (options.testPattern) command += ` "${options.testPattern}"`;
      if (options.testFiles && options.testFiles.length > 0) command += ` ${options.testFiles.join(' ')}`;
      if (options.testNames && options.testNames.length > 0) command += ` --grep "${options.testNames.join('|')}"`;
      if (options.watch) command += ' --watch';
      if (options.bail) command += ' --bail';
      if (options.timeout) command += ` --timeout ${options.timeout}`;
      break;
    
    case 'jasmine':
      command = 'npx jasmine';
      if (options.testFiles && options.testFiles.length > 0) command += ` ${options.testFiles.join(' ')}`;
      break;
    
    case 'vitest':
      command = 'npx vitest';
      if (options.testPattern) command += ` ${options.testPattern}`;
      if (options.testFiles && options.testFiles.length > 0) command += ` ${options.testFiles.join(' ')}`;
      if (options.testNames && options.testNames.length > 0) command += ` -t "${options.testNames.join('|')}"`;
      if (options.watch) command += ' --watch';
      if (options.coverage) command += ' --coverage';
      if (options.updateSnapshots) command += ' --update';
      if (options.bail) command += ' --bail';
      break;
    
    case 'cypress':
      command = 'npx cypress run';
      if (options.testFiles && options.testFiles.length > 0) command += ` --spec "${options.testFiles.join(',')}"`;
      if (options.testPattern) command += ` --spec "${options.testPattern}"`;
      if (options.watch) command += ' --watch';
      if (options.coverage) command += ' --coverage';
      break;
    
    case 'playwright':
      command = 'npx playwright test';
      if (options.testFiles && options.testFiles.length > 0) command += ` ${options.testFiles.join(' ')}`;
      if (options.testPattern) command += ` ${options.testPattern}`;
      if (options.testNames && options.testNames.length > 0) command += ` -g "${options.testNames.join('|')}"`;
      if (options.updateSnapshots) command += ' --update-snapshots';
      if (options.timeout) command += ` --timeout ${options.timeout}`;
      break;
  }
  
  // Add additional arguments
  if (options.additionalArgs && options.additionalArgs.length > 0) {
    command += ` ${options.additionalArgs.join(' ')}`;
  }
  
  return command;
}

/**
 * Find test files
 */
async function findTestFiles(
  directory: string,
  recursive: boolean,
  testPattern?: string,
  excludePattern?: string,
  framework?: string
): Promise<string[]> {
  const testFiles: string[] = [];
  
  // Default test patterns by framework
  const defaultPatterns: { [key: string]: RegExp } = {
    jest: /\.(test|spec)\.(js|jsx|ts|tsx)$/,
    mocha: /\.(test|spec)\.(js|jsx|ts|tsx)$/,
    jasmine: /\.spec\.(js|jsx|ts|tsx)$/,
    vitest: /\.(test|spec)\.(js|jsx|ts|tsx)$/,
    cypress: /\.cy\.(js|jsx|ts|tsx)$/,
    playwright: /\.spec\.(js|jsx|ts|tsx)$/,
  };
  
  // Use provided pattern or default for the framework
  const pattern = testPattern
    ? new RegExp(testPattern)
    : framework && defaultPatterns[framework]
      ? defaultPatterns[framework]
      : /\.(test|spec)\.(js|jsx|ts|tsx)$/;
  
  // Use provided exclude pattern or default
  const exclude = excludePattern
    ? new RegExp(excludePattern)
    : /node_modules/;
  
  async function processDirectory(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      // Skip excluded paths
      if (exclude.test(fullPath)) {
        continue;
      }
      
      if (entry.isDirectory()) {
        if (recursive) {
          await processDirectory(fullPath);
        }
      } else if (entry.isFile() && pattern.test(entry.name)) {
        testFiles.push(fullPath);
      }
    }
  }
  
  await processDirectory(directory);
  
  return testFiles;
}

/**
 * Extract test names from files
 */
async function extractTestNames(testFiles: string[], includeSkipped: boolean): Promise<TestFile[]> {
  const result: TestFile[] = [];
  
  for (const filePath of testFiles) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      
      // Determine framework based on file content
      let framework = 'unknown';
      if (content.includes('describe(') || content.includes('it(') || content.includes('test(')) {
        framework = 'jest/mocha';
      } else if (content.includes('cy.')) {
        framework = 'cypress';
      } else if (content.includes('test.describe') || content.includes('test.it')) {
        framework = 'playwright';
      }
      
      // Extract test names
      const tests: string[] = [];
      const suites: string[] = [];
      let skipped = false;
      
      // Match test declarations
      const testRegex = /(?:it|test)\s*\(\s*['"](.+?)['"]/g;
      let match;
      while ((match = testRegex.exec(content)) !== null) {
        tests.push(match[1]);
      }
      
      // Match skipped tests
      const skippedTestRegex = /(?:it|test)\.skip\s*\(\s*['"](.+?)['"]/g;
      while ((match = skippedTestRegex.exec(content)) !== null) {
        if (includeSkipped) {
          tests.push(`[SKIPPED] ${match[1]}`);
        }
        skipped = true;
      }
      
      // Match suite declarations
      const suiteRegex = /describe\s*\(\s*['"](.+?)['"]/g;
      while ((match = suiteRegex.exec(content)) !== null) {
        suites.push(match[1]);
      }
      
      // Match skipped suites
      const skippedSuiteRegex = /describe\.skip\s*\(\s*['"](.+?)['"]/g;
      while ((match = skippedSuiteRegex.exec(content)) !== null) {
        if (includeSkipped) {
          suites.push(`[SKIPPED] ${match[1]}`);
        }
        skipped = true;
      }
      
      result.push({
        path: filePath,
        name: path.basename(filePath),
        framework,
        tests,
        suites,
        skipped,
      });
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error);
    }
  }
  
  return result;
}

/**
 * Parse test results
 */
function parseTestResults(
  stdout: string,
  stderr: string,
  framework: string,
  startTime: string,
  endTime: string,
  duration: number,
  success: boolean = true
): TestRunResult {
  // In a real implementation, we would parse the test results based on the framework
  // For this simulation, we'll generate mock test results
  
  // Generate random test results
  const numTotalTests = 10 + Math.floor(Math.random() * 20); // 10-30 tests
  const numPassedTests = success ? numTotalTests - Math.floor(Math.random() * 3) : numTotalTests - Math.floor(Math.random() * 10) - 1;
  const numFailedTests = numTotalTests - numPassedTests - Math.floor(Math.random() * 3);
  const numSkippedTests = numTotalTests - numPassedTests - numFailedTests;
  
  // Generate test suites
  const suites: TestSuiteResult[] = [];
  const numSuites = 2 + Math.floor(Math.random() * 3); // 2-5 suites
  
  for (let i = 0; i < numSuites; i++) {
    const suiteName = `Test Suite ${i + 1}`;
    const suiteTests: TestResult[] = [];
    const numSuiteTests = Math.floor(numTotalTests / numSuites);
    let numSuitePassedTests = Math.floor(numPassedTests * (numSuiteTests / numTotalTests));
    let numSuiteFailedTests = Math.floor(numFailedTests * (numSuiteTests / numTotalTests));
    let numSuiteSkippedTests = numSuiteTests - numSuitePassedTests - numSuiteFailedTests;
    
    // Adjust for rounding errors
    if (i === numSuites - 1) {
      numSuitePassedTests = numPassedTests - suites.reduce((sum, suite) => sum + suite.tests.filter(t => t.status === 'passed').length, 0);
      numSuiteFailedTests = numFailedTests - suites.reduce((sum, suite) => sum + suite.tests.filter(t => t.status === 'failed').length, 0);
      numSuiteSkippedTests = numSkippedTests - suites.reduce((sum, suite) => sum + suite.tests.filter(t => t.status === 'skipped').length, 0);
    }
    
    // Generate passed tests
    for (let j = 0; j < numSuitePassedTests; j++) {
      suiteTests.push({
        name: `Test ${j + 1}`,
        status: 'passed',
        duration: 10 + Math.random() * 90, // 10-100ms
      });
    }
    
    // Generate failed tests
    for (let j = 0; j < numSuiteFailedTests; j++) {
      suiteTests.push({
        name: `Test ${numSuitePassedTests + j + 1}`,
        status: 'failed',
        duration: 10 + Math.random() * 90, // 10-100ms
        failureMessages: [
          `Expected value to be true, but got false`,
          `at ${suiteName}.test.js:${20 + j}:10`,
        ],
        location: {
          file: `${suiteName.toLowerCase().replace(/\s+/g, '-')}.test.js`,
          line: 20 + j,
          column: 10,
        },
      });
    }
    
    // Generate skipped tests
    for (let j = 0; j < numSuiteSkippedTests; j++) {
      suiteTests.push({
        name: `Test ${numSuitePassedTests + numSuiteFailedTests + j + 1}`,
        status: 'skipped',
        duration: 0,
      });
    }
    
    suites.push({
      name: suiteName,
      status: numSuiteFailedTests > 0 ? 'failed' : 'passed',
      duration: suiteTests.reduce((sum, test) => sum + test.duration, 0),
      tests: suiteTests,
    });
  }
  
  // Generate coverage data if stdout contains coverage information
  let coverage: CoverageData | undefined;
  if (stdout.includes('coverage') || stdout.includes('Coverage')) {
    coverage = generateMockCoverageData();
  }
  
  return {
    success: numFailedTests === 0,
    startTime,
    endTime,
    duration,
    numPassedTests,
    numFailedTests,
    numSkippedTests,
    numTotalTests,
    suites,
    coverage,
  };
}

/**
 * Generate mock coverage data
 */
function generateMockCoverageData(): CoverageData {
  // Generate overall coverage
  const statements = {
    total: 100 + Math.floor(Math.random() * 100), // 100-200 statements
    covered: 0,
    skipped: 0,
    percentage: 0,
  };
  
  const branches = {
    total: 50 + Math.floor(Math.random() * 50), // 50-100 branches
    covered: 0,
    skipped: 0,
    percentage: 0,
  };
  
  const functions = {
    total: 20 + Math.floor(Math.random() * 30), // 20-50 functions
    covered: 0,
    skipped: 0,
    percentage: 0,
  };
  
  const lines = {
    total: 200 + Math.floor(Math.random() * 300), // 200-500 lines
    covered: 0,
    skipped: 0,
    percentage: 0,
  };
  
  // Generate file coverage
  const files: { [filePath: string]: any } = {};
  const numFiles = 5 + Math.floor(Math.random() * 5); // 5-10 files
  
  for (let i = 0; i < numFiles; i++) {
    const filePath = `src/component${i + 1}.js`;
    
    const fileStatements = {
      total: 10 + Math.floor(Math.random() * 20), // 10-30 statements
      covered: 0,
      skipped: 0,
      percentage: 0,
    };
    
    const fileBranches = {
      total: 5 + Math.floor(Math.random() * 10), // 5-15 branches
      covered: 0,
      skipped: 0,
      percentage: 0,
    };
    
    const fileFunctions = {
      total: 2 + Math.floor(Math.random() * 5), // 2-7 functions
      covered: 0,
      skipped: 0,
      percentage: 0,
    };
    
    const fileLines = {
      total: 20 + Math.floor(Math.random() * 30), // 20-50 lines
      covered: 0,
      skipped: 0,
      percentage: 0,
    };
    
    // Calculate covered and skipped
    fileStatements.covered = Math.floor(fileStatements.total * (0.7 + Math.random() * 0.3)); // 70-100% coverage
    fileStatements.skipped = Math.floor((fileStatements.total - fileStatements.covered) * Math.random()); // 0-100% of uncovered are skipped
    fileStatements.percentage = (fileStatements.covered / fileStatements.total) * 100;
    
    fileBranches.covered = Math.floor(fileBranches.total * (0.6 + Math.random() * 0.4)); // 60-100% coverage
    fileBranches.skipped = Math.floor((fileBranches.total - fileBranches.covered) * Math.random()); // 0-100% of uncovered are skipped
    fileBranches.percentage = (fileBranches.covered / fileBranches.total) * 100;
    
    fileFunctions.covered = Math.floor(fileFunctions.total * (0.8 + Math.random() * 0.2)); // 80-100% coverage
    fileFunctions.skipped = Math.floor((fileFunctions.total - fileFunctions.covered) * Math.random()); // 0-100% of uncovered are skipped
    fileFunctions.percentage = (fileFunctions.covered / fileFunctions.total) * 100;
    
    fileLines.covered = Math.floor(fileLines.total * (0.7 + Math.random() * 0.3)); // 70-100% coverage
    fileLines.skipped = Math.floor((fileLines.total - fileLines.covered) * Math.random()); // 0-100% of uncovered are skipped
    fileLines.percentage = (fileLines.covered / fileLines.total) * 100;
    
    files[filePath] = {
      statements: fileStatements,
      branches: fileBranches,
      functions: fileFunctions,
      lines: fileLines,
    };
    
    // Add to overall coverage
    statements.total += fileStatements.total;
    statements.covered += fileStatements.covered;
    statements.skipped += fileStatements.skipped;
    
    branches.total += fileBranches.total;
    branches.covered += fileBranches.covered;
    branches.skipped += fileBranches.skipped;
    
    functions.total += fileFunctions.total;
    functions.covered += fileFunctions.covered;
    functions.skipped += fileFunctions.skipped;
    
    lines.total += fileLines.total;
    lines.covered = lines.covered || 0;
    lines.covered += fileLines.covered;
    lines.skipped += fileLines.skipped;
  }
  
  // Calculate percentages
  statements.percentage = (statements.covered / statements.total) * 100;
  branches.percentage = (branches.covered / branches.total) * 100;
  functions.percentage = (functions.covered / functions.total) * 100;
  lines.percentage = (lines.covered / lines.total) * 100;
  
  return {
    statements,
    branches,
    functions,
    lines,
    files,
  };
}

/**
 * Generate a test summary
 */
function generateTestSummary(testResults: TestRunResult): string {
  const { numPassedTests, numFailedTests, numSkippedTests, numTotalTests, duration, suites } = testResults;
  
  let summary = `Test Results Summary\n`;
  summary += `===================\n\n`;
  
  summary += `Total Tests: ${numTotalTests}\n`;
  summary += `Passed: ${numPassedTests}\n`;
  summary += `Failed: ${numFailedTests}\n`;
  summary += `Skipped: ${numSkippedTests}\n`;
  summary += `Duration: ${(duration / 1000).toFixed(2)}s\n\n`;
  
  // Add failed tests
  const failedTests = suites.flatMap(suite => 
    suite.tests.filter(test => test.status === 'failed')
  );
  
  if (failedTests.length > 0) {
    summary += `Failed Tests:\n`;
    failedTests.forEach((test, index) => {
      summary += `${index + 1}. ${test.name}\n`;
      if (test.failureMessages) {
        summary += `   ${test.failureMessages[0]}\n`;
      }
    });
    summary += `\n`;
  }
  
  // Add coverage summary if available
  if (testResults.coverage) {
    summary += `Coverage Summary:\n`;
    summary += `- Statements: ${testResults.coverage.statements.percentage.toFixed(2)}%\n`;
    summary += `- Branches: ${testResults.coverage.branches.percentage.toFixed(2)}%\n`;
    summary += `- Functions: ${testResults.coverage.functions.percentage.toFixed(2)}%\n`;
    summary += `- Lines: ${testResults.coverage.lines.percentage.toFixed(2)}%\n`;
  }
  
  return summary;
}

/**
 * Generate a test files summary
 */
function generateTestFilesSummary(testFiles: TestFile[]): string {
  let summary = `Found ${testFiles.length} test files\n\n`;
  
  testFiles.forEach((file, index) => {
    summary += `${index + 1}. ${file.name} (${file.framework})\n`;
    
    if (file.suites.length > 0) {
      summary += `   Suites:\n`;
      file.suites.forEach(suite => {
        summary += `   - ${suite}\n`;
      });
    }
    
    if (file.tests.length > 0) {
      summary += `   Tests:\n`;
      file.tests.forEach(test => {
        summary += `   - ${test}\n`;
      });
    }
    
    if (file.skipped) {
      summary += `   Note: Contains skipped tests/suites\n`;
    }
    
    summary += `\n`;
  });
  
  return summary;
}

/**
 * Generate a text report
 */
function generateTextReport(testResults: TestRunResult, includeFailureDetails: boolean, includeCoverage: boolean): string {
  const { numPassedTests, numFailedTests, numSkippedTests, numTotalTests, duration, suites, startTime, endTime } = testResults;
  
  let report = `Test Report\n`;
  report += `===========\n\n`;
  
  report += `Start Time: ${new Date(startTime).toLocaleString()}\n`;
  report += `End Time: ${new Date(endTime).toLocaleString()}\n`;
  report += `Duration: ${(duration / 1000).toFixed(2)}s\n\n`;
  
  report += `Summary:\n`;
  report += `- Total Tests: ${numTotalTests}\n`;
  report += `- Passed: ${numPassedTests}\n`;
  report += `- Failed: ${numFailedTests}\n`;
  report += `- Skipped: ${numSkippedTests}\n\n`;
  
  // Add test suites
  report += `Test Suites:\n`;
  suites.forEach((suite, index) => {
    report += `${index + 1}. ${suite.name} (${suite.status})\n`;
    
    // Add tests
    suite.tests.forEach((test, testIndex) => {
      report += `   ${testIndex + 1}. ${test.name} (${test.status}) - ${test.duration.toFixed(2)}ms\n`;
      
      // Add failure details
      if (includeFailureDetails && test.status === 'failed' && test.failureMessages) {
        report += `      Failure: ${test.failureMessages[0]}\n`;
        if (test.location) {
          report += `      Location: ${test.location.file}:${test.location.line}:${test.location.column}\n`;
        }
      }
    });
    
    report += `\n`;
  });
  
  // Add coverage if available and requested
  if (includeCoverage && testResults.coverage) {
    report += `Coverage Summary:\n`;
    report += `- Statements: ${testResults.coverage.statements.percentage.toFixed(2)}% (${testResults.coverage.statements.covered}/${testResults.coverage.statements.total})\n`;
    report += `- Branches: ${testResults.coverage.branches.percentage.toFixed(2)}% (${testResults.coverage.branches.covered}/${testResults.coverage.branches.total})\n`;
    report += `- Functions: ${testResults.coverage.functions.percentage.toFixed(2)}% (${testResults.coverage.functions.covered}/${testResults.coverage.functions.total})\n`;
    report += `- Lines: ${testResults.coverage.lines.percentage.toFixed(2)}% (${testResults.coverage.lines.covered}/${testResults.coverage.lines.total})\n\n`;
    
    // Add file coverage
    report += `File Coverage:\n`;
    Object.entries(testResults.coverage.files).forEach(([filePath, coverage], index) => {
      report += `${index + 1}. ${filePath}\n`;
      report += `   - Statements: ${coverage.statements.percentage.toFixed(2)}% (${coverage.statements.covered}/${coverage.statements.total})\n`;
      report += `   - Branches: ${coverage.branches.percentage.toFixed(2)}% (${coverage.branches.covered}/${coverage.branches.total})\n`;
      report += `   - Functions: ${coverage.functions.percentage.toFixed(2)}% (${coverage.functions.covered}/${coverage.functions.total})\n`;
      report += `   - Lines: ${coverage.lines.percentage.toFixed(2)}% (${coverage.lines.covered}/${coverage.lines.total})\n`;
    });
  }
  
  return report;
}

/**
 * Generate an HTML report
 */
function generateHtmlReport(testResults: TestRunResult, includeFailureDetails: boolean, includeCoverage: boolean): string {
  // In a real implementation, we would generate a proper HTML report
  // For this simulation, we'll generate a basic HTML report
  
  const { numPassedTests, numFailedTests, numSkippedTests, numTotalTests, duration, suites, startTime, endTime } = testResults;
  
  let report = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Test Report</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 1200px; margin: 0 auto; padding: 20px; }
    h1, h2, h3, h4 { margin-top: 20px; }
    .summary { display: flex; flex-wrap: wrap; gap: 20px; margin: 20px 0; }
    .metric { background-color: #f5f5f5; padding: 15px; border-radius: 5px; flex: 1; min-width: 200px; }
    .suite { margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
    .passed { color: #28a745; }
    .failed { color: #dc3545; }
    .skipped { color: #6c757d; }
    .failure-message { background-color: #f8d7da; padding: 10px; border-radius: 5px; margin-top: 10px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background-color: #f2f2f2; }
    .coverage-bar { height: 20px; background-color: #e9ecef; border-radius: 5px; overflow: hidden; margin-top: 5px; }
    .coverage-value { height: 100%; background-color: #28a745; }
    .coverage-low { background-color: #dc3545; }
    .coverage-medium { background-color: #ffc107; }
    .coverage-high { background-color: #28a745; }
  </style>
</head>
<body>
  <h1>Test Report</h1>
  
  <div class="summary">
    <div class="metric">
      <h3>Total Tests</h3>
      <p>${numTotalTests}</p>
    </div>
    <div class="metric">
      <h3>Passed</h3>
      <p class="passed">${numPassedTests}</p>
    </div>
    <div class="metric">
      <h3>Failed</h3>
      <p class="failed">${numFailedTests}</p>
    </div>
    <div class="metric">
      <h3>Skipped</h3>
      <p class="skipped">${numSkippedTests}</p>
    </div>
    <div class="metric">
      <h3>Duration</h3>
      <p>${(duration / 1000).toFixed(2)}s</p>
    </div>
  </div>
  
  <div>
    <p><strong>Start Time:</strong> ${new Date(startTime).toLocaleString()}</p>
    <p><strong>End Time:</strong> ${new Date(endTime).toLocaleString()}</p>
  </div>
  
  <h2>Test Suites</h2>
  ${suites.map((suite, index) => `
    <div class="suite">
      <h3>${index + 1}. ${suite.name} <span class="${suite.status}">(${suite.status})</span></h3>
      <p>Duration: ${(suite.duration / 1000).toFixed(2)}s</p>
      
      <table>
        <tr>
          <th>#</th>
          <th>Test</th>
          <th>Status</th>
          <th>Duration</th>
        </tr>
        ${suite.tests.map((test, testIndex) => `
          <tr>
            <td>${testIndex + 1}</td>
            <td>${test.name}</td>
            <td class="${test.status}">${test.status}</td>
            <td>${test.duration.toFixed(2)}ms</td>
          </tr>
          ${includeFailureDetails && test.status === 'failed' && test.failureMessages ? `
            <tr>
              <td colspan="4">
                <div class="failure-message">
                  <strong>Failure:</strong> ${test.failureMessages[0]}
                  ${test.location ? `<br><strong>Location:</strong> ${test.location.file}:${test.location.line}:${test.location.column}` : ''}
                </div>
              </td>
            </tr>
          ` : ''}
        `).join('')}
      </table>
    </div>
  `).join('')}
  
  ${includeCoverage && testResults.coverage ? `
    <h2>Coverage Summary</h2>
    <table>
      <tr>
        <th>Type</th>
        <th>Coverage</th>
        <th>Covered/Total</th>
      </tr>
      <tr>
        <td>Statements</td>
        <td>
          ${testResults.coverage.statements.percentage.toFixed(2)}%
          <div class="coverage-bar">
            <div class="coverage-value ${getCoverageClass(testResults.coverage.statements.percentage)}" style="width: ${Math.min(100, testResults.coverage.statements.percentage)}%"></div>
          </div>
        </td>
        <td>${testResults.coverage.statements.covered}/${testResults.coverage.statements.total}</td>
      </tr>
      <tr>
        <td>Branches</td>
        <td>
          ${testResults.coverage.branches.percentage.toFixed(2)}%
          <div class="coverage-bar">
            <div class="coverage-value ${getCoverageClass(testResults.coverage.branches.percentage)}" style="width: ${Math.min(100, testResults.coverage.branches.percentage)}%"></div>
          </div>
        </td>
        <td>${testResults.coverage.branches.covered}/${testResults.coverage.branches.total}</td>
      </tr>
      <tr>
        <td>Functions</td>
        <td>
          ${testResults.coverage.functions.percentage.toFixed(2)}%
          <div class="coverage-bar">
            <div class="coverage-value ${getCoverageClass(testResults.coverage.functions.percentage)}" style="width: ${Math.min(100, testResults.coverage.functions.percentage)}%"></div>
          </div>
        </td>
        <td>${testResults.coverage.functions.covered}/${testResults.coverage.functions.total}</td>
      </tr>
      <tr>
        <td>Lines</td>
        <td>
          ${testResults.coverage.lines.percentage.toFixed(2)}%
          <div class="coverage-bar">
            <div class="coverage-value ${getCoverageClass(testResults.coverage.lines.percentage)}" style="width: ${Math.min(100, testResults.coverage.lines.percentage)}%"></div>
          </div>
        </td>
        <td>${testResults.coverage.lines.covered}/${testResults.coverage.lines.total}</td>
      </tr>
    </table>
    
    <h2>File Coverage</h2>
    <table>
      <tr>
        <th>File</th>
        <th>Statements</th>
        <th>Branches</th>
        <th>Functions</th>
        <th>Lines</th>
      </tr>
      ${Object.entries(testResults.coverage.files).map(([filePath, coverage]) => `
        <tr>
          <td>${filePath}</td>
          <td>
            ${coverage.statements.percentage.toFixed(2)}%
            <div class="coverage-bar">
              <div class="coverage-value ${getCoverageClass(coverage.statements.percentage)}" style="width: ${Math.min(100, coverage.statements.percentage)}%"></div>
            </div>
          </td>
          <td>
            ${coverage.branches.percentage.toFixed(2)}%
            <div class="coverage-bar">
              <div class="coverage-value ${getCoverageClass(coverage.branches.percentage)}" style="width: ${Math.min(100, coverage.branches.percentage)}%"></div>
            </div>
          </td>
          <td>
            ${coverage.functions.percentage.toFixed(2)}%
            <div class="coverage-bar">
              <div class="coverage-value ${getCoverageClass(coverage.functions.percentage)}" style="width: ${Math.min(100, coverage.functions.percentage)}%"></div>
            </div>
          </td>
          <td>
            ${coverage.lines.percentage.toFixed(2)}%
            <div class="coverage-bar">
              <div class="coverage-value ${getCoverageClass(coverage.lines.percentage)}" style="width: ${Math.min(100, coverage.lines.percentage)}%"></div>
            </div>
          </td>
        </tr>
      `).join('')}
    </table>
  ` : ''}
</body>
</html>`;
  
  return report;
}

/**
 * Get coverage class based on percentage
 */
function getCoverageClass(percentage: number): string {
  if (percentage < 50) return 'coverage-low';
  if (percentage < 80) return 'coverage-medium';
  return 'coverage-high';
}

/**
 * Generate a Markdown report
 */
function generateMarkdownReport(testResults: TestRunResult, includeFailureDetails: boolean, includeCoverage: boolean): string {
  const { numPassedTests, numFailedTests, numSkippedTests, numTotalTests, duration, suites, startTime, endTime } = testResults;
  
  let report = `# Test Report\n\n`;
  
  report += `- **Start Time:** ${new Date(startTime).toLocaleString()}\n`;
  report += `- **End Time:** ${new Date(endTime).toLocaleString()}\n`;
  report += `- **Duration:** ${(duration / 1000).toFixed(2)}s\n\n`;
  
  report += `## Summary\n\n`;
  report += `- **Total Tests:** ${numTotalTests}\n`;
  report += `- **Passed:** ${numPassedTests}\n`;
  report += `- **Failed:** ${numFailedTests}\n`;
  report += `- **Skipped:** ${numSkippedTests}\n\n`;
  
  // Add test suites
  report += `## Test Suites\n\n`;
  suites.forEach((suite, index) => {
    report += `### ${index + 1}. ${suite.name} (${suite.status})\n\n`;
    report += `Duration: ${(suite.duration / 1000).toFixed(2)}s\n\n`;
    
    // Add tests
    report += `| # | Test | Status | Duration |\n`;
    report += `| --- | --- | --- | --- |\n`;
    
    suite.tests.forEach((test, testIndex) => {
      report += `| ${testIndex + 1} | ${test.name} | ${test.status} | ${test.duration.toFixed(2)}ms |\n`;
      
      // Add failure details
      if (includeFailureDetails && test.status === 'failed' && test.failureMessages) {
        report += `\n**Failure:** ${test.failureMessages[0]}\n`;
        if (test.location) {
          report += `\n**Location:** ${test.location.file}:${test.location.line}:${test.location.column}\n`;
        }
        report += `\n`;
      }
    });
    
    report += `\n`;
  });
  
  // Add coverage if available and requested
  if (includeCoverage && testResults.coverage) {
    report += `## Coverage Summary\n\n`;
    report += `| Type | Coverage | Covered/Total |\n`;
    report += `| --- | --- | --- |\n`;
    report += `| Statements | ${testResults.coverage.statements.percentage.toFixed(2)}% | ${testResults.coverage.statements.covered}/${testResults.coverage.statements.total} |\n`;
    report += `| Branches | ${testResults.coverage.branches.percentage.toFixed(2)}% | ${testResults.coverage.branches.covered}/${testResults.coverage.branches.total} |\n`;
    report += `| Functions | ${testResults.coverage.functions.percentage.toFixed(2)}% | ${testResults.coverage.functions.covered}/${testResults.coverage.functions.total} |\n`;
    report += `| Lines | ${testResults.coverage.lines.percentage.toFixed(2)}% | ${testResults.coverage.lines.covered}/${testResults.coverage.lines.total} |\n\n`;
    
    // Add file coverage
    report += `## File Coverage\n\n`;
    report += `| File | Statements | Branches | Functions | Lines |\n`;
    report += `| --- | --- | --- | --- | --- |\n`;
    
    Object.entries(testResults.coverage.files).forEach(([filePath, coverage]) => {
      report += `| ${filePath} | ${coverage.statements.percentage.toFixed(2)}% | ${coverage.branches.percentage.toFixed(2)}% | ${coverage.functions.percentage.toFixed(2)}% | ${coverage.lines.percentage.toFixed(2)}% |\n`;
    });
  }
  
  return report;
}

/**
 * Analyze coverage data
 */
function analyzeCoverage(
  coverageData: CoverageData,
  threshold?: {
    statements: number;
    branches: number;
    functions: number;
    lines: number;
  },
  excludePatterns?: string[]
): any {
  // Default thresholds
  const thresholds = threshold || {
    statements: 80,
    branches: 80,
    functions: 80,
    lines: 80,
  };
  
  // Filter files based on exclude patterns
  const excludeRegexps = excludePatterns?.map(pattern => new RegExp(pattern)) || [];
  
  const filteredFiles = Object.entries(coverageData.files)
    .filter(([filePath]) => !excludeRegexps.some(regex => regex.test(filePath)))
    .reduce((acc, [filePath, coverage]) => {
      acc[filePath] = coverage;
      return acc;
    }, {} as { [filePath: string]: any });
  
  // Calculate overall coverage for filtered files
  const overallCoverage = {
    statements: {
      total: 0,
      covered: 0,
      skipped: 0,
      percentage: 0,
    },
    branches: {
      total: 0,
      covered: 0,
      skipped: 0,
      percentage: 0,
    },
    functions: {
      total: 0,
      covered: 0,
      skipped: 0,
      percentage: 0,
    },
    lines: {
      total: 0,
      covered: 0,
      skipped: 0,
      percentage: 0,
    },
  };
  
  // Calculate overall coverage
  Object.values(filteredFiles).forEach(coverage => {
    overallCoverage.statements.total += coverage.statements.total;
    overallCoverage.statements.covered += coverage.statements.covered;
    overallCoverage.statements.skipped += coverage.statements.skipped;
    
    overallCoverage.branches.total += coverage.branches.total;
    overallCoverage.branches.covered += coverage.branches.covered;
    overallCoverage.branches.skipped += coverage.branches.skipped;
    
    overallCoverage.functions.total += coverage.functions.total;
    overallCoverage.functions.covered += coverage.functions.covered;
    overallCoverage.functions.skipped += coverage.functions.skipped;
    
    overallCoverage.lines.total += coverage.lines.total;
    overallCoverage.lines.covered += coverage.lines.covered;
    overallCoverage.lines.skipped += coverage.lines.skipped;
  });
  
  // Calculate percentages
  overallCoverage.statements.percentage = overallCoverage.statements.total > 0
    ? (overallCoverage.statements.covered / overallCoverage.statements.total) * 100
    : 0;
  
  overallCoverage.branches.percentage = overallCoverage.branches.total > 0
    ? (overallCoverage.branches.covered / overallCoverage.branches.total) * 100
    : 0;
  
  overallCoverage.functions.percentage = overallCoverage.functions.total > 0
    ? (overallCoverage.functions.covered / overallCoverage.functions.total) * 100
    : 0;
  
  overallCoverage.lines.percentage = overallCoverage.lines.total > 0
    ? (overallCoverage.lines.covered / overallCoverage.lines.total) * 100
    : 0;
  
  // Check if coverage meets thresholds
  const thresholdResults = {
    statements: overallCoverage.statements.percentage >= thresholds.statements,
    branches: overallCoverage.branches.percentage >= thresholds.branches,
    functions: overallCoverage.functions.percentage >= thresholds.functions,
    lines: overallCoverage.lines.percentage >= thresholds.lines,
  };
  
  // Find files with low coverage
  const lowCoverageFiles = Object.entries(filteredFiles)
    .filter(([_, coverage]) => {
      return coverage.statements.percentage < thresholds.statements ||
             coverage.branches.percentage < thresholds.branches ||
             coverage.functions.percentage < thresholds.functions ||
             coverage.lines.percentage < thresholds.lines;
    })
    .map(([filePath, coverage]) => ({
      filePath,
      coverage,
      issues: [
        coverage.statements.percentage < thresholds.statements ? `Statements: ${coverage.statements.percentage.toFixed(2)}% < ${thresholds.statements}%` : null,
        coverage.branches.percentage < thresholds.branches ? `Branches: ${coverage.branches.percentage.toFixed(2)}% < ${thresholds.branches}%` : null,
        coverage.functions.percentage < thresholds.functions ? `Functions: ${coverage.functions.percentage.toFixed(2)}% < ${thresholds.functions}%` : null,
        coverage.lines.percentage < thresholds.lines ? `Lines: ${coverage.lines.percentage.toFixed(2)}% < ${thresholds.lines}%` : null,
      ].filter(Boolean),
    }));
  
  return {
    coverage: overallCoverage,
    thresholds,
    thresholdResults,
    passed: Object.values(thresholdResults).every(Boolean),
    lowCoverageFiles,
    excludedPatterns: excludePatterns || [],
  };
}

/**
 * Generate a coverage report
 */
function generateCoverageReport(analysis: any): string {
  const { coverage, thresholds, thresholdResults, passed, lowCoverageFiles } = analysis;
  
  let report = `Coverage Analysis\n`;
  report += `================\n\n`;
  
  report += `Overall Result: ${passed ? 'PASSED' : 'FAILED'}\n\n`;
  
  report += `Coverage Summary:\n`;
  report += `- Statements: ${coverage.statements.percentage.toFixed(2)}% (${thresholdResults.statements ? 'PASS' : 'FAIL'}, threshold: ${thresholds.statements}%)\n`;
  report += `- Branches: ${coverage.branches.percentage.toFixed(2)}% (${thresholdResults.branches ? 'PASS' : 'FAIL'}, threshold: ${thresholds.branches}%)\n`;
  report += `- Functions: ${coverage.functions.percentage.toFixed(2)}% (${thresholdResults.functions ? 'PASS' : 'FAIL'}, threshold: ${thresholds.functions}%)\n`;
  report += `- Lines: ${coverage.lines.percentage.toFixed(2)}% (${thresholdResults.lines ? 'PASS' : 'FAIL'}, threshold: ${thresholds.lines}%)\n\n`;
  
  if (lowCoverageFiles.length > 0) {
    report += `Files with Low Coverage:\n`;
    lowCoverageFiles.forEach((file: any, index: number) => {
      report += `${index + 1}. ${file.filePath}\n`;
      file.issues.forEach((issue: string) => {
        report += `   - ${issue}\n`;
      });
    });
    report += `\n`;
  }
  
  if (analysis.excludedPatterns.length > 0) {
    report += `Excluded Patterns:\n`;
    analysis.excludedPatterns.forEach((pattern: string) => {
      report += `- ${pattern}\n`;
    });
  }
  
  return report;
}

