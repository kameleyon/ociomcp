// Auto-generated safe fallback for index

export function activate() {
    console.log("[TOOL] index activated (passive mode)");
}

export function onFileWrite() { /* no-op */ }
export function onSessionStart() { /* no-op */ }
export function onCommand() { /* no-op */ }
/**
 * Testing and Quality Tools
 * 
 * This module provides tools for testing, quality assurance, and code analysis
 */

import { 
  GenerateUnitTestsSchema, 
  GenerateE2ETestsSchema,
  handleGenerateUnitTests,
  handleGenerateE2ETests
} from './test-generator';

import {
  AnalyzeErrorSchema,
  GenerateFixSchema,
  ExplainErrorSchema,
  handleAnalyzeError,
  handleGenerateFix,
  handleExplainError
} from './debug-assist';

import {
  ProfileCodeSchema,
  AnalyzeHotPathsSchema,
  handleProfileCode,
  handleAnalyzeHotPaths
} from './performance-profiler';

import {
  RunTestsSchema,
  AnalyzeTestCoverageSchema,
  handleRunTests,
  handleAnalyzeTestCoverage
} from './test-manager';

import {
  CheckAccessibilitySchema,
  GenerateAccessibilityReportSchema,
  handleCheckAccessibility,
  handleGenerateAccessibilityReport
} from './access-checker';

import {
  ReviewCodeSchema,
  AnalyzeCodeQualitySchema,
  handleReviewCode,
  handleAnalyzeCodeQuality
} from './code-reviewer';

import {
  AnalyzeComplexitySchema,
  IdentifyRefactoringOpportunitiesSchema,
  handleAnalyzeComplexity,
  handleIdentifyRefactoringOpportunities
} from './complexity-tool';


// Export all imported items
export {
  // Test Generator
  GenerateUnitTestsSchema,
  GenerateE2ETestsSchema,
  handleGenerateUnitTests,
  handleGenerateE2ETests,
  
  // Debug Assist
  AnalyzeErrorSchema,
  GenerateFixSchema,
  ExplainErrorSchema,
  handleAnalyzeError,
  handleGenerateFix,
  handleExplainError,
  
  // Performance Profiler
  ProfileCodeSchema,
  AnalyzeHotPathsSchema,
  handleProfileCode,
  handleAnalyzeHotPaths,
  
  // Test Manager
  RunTestsSchema,
  AnalyzeTestCoverageSchema,
  handleRunTests,
  handleAnalyzeTestCoverage,
  
  // Access Checker
  CheckAccessibilitySchema,
  GenerateAccessibilityReportSchema,
  handleCheckAccessibility,
  handleGenerateAccessibilityReport,
  
  // Code Reviewer
  ReviewCodeSchema,
  AnalyzeCodeQualitySchema,
  handleReviewCode,
  handleAnalyzeCodeQuality,
  
  // Complexity Tool
  AnalyzeComplexitySchema,
  IdentifyRefactoringOpportunitiesSchema,
  handleAnalyzeComplexity,
  handleIdentifyRefactoringOpportunities,
  
  // Mock Data Generator - Removed
};

// Re-export with consistent names for index.ts
export const GenerateTestsSchema = GenerateUnitTestsSchema;
export const GenerateTestSuiteSchema = GenerateE2ETestsSchema;
export const DebugErrorSchema = ExplainErrorSchema;
export const AnalyzePerformanceSchema = AnalyzeHotPathsSchema;

export const handleGenerateTests = handleGenerateUnitTests;
export const handleGenerateTestSuite = handleGenerateE2ETests;
export const handleDebugError = handleExplainError;
export const handleAnalyzePerformance = handleAnalyzeHotPaths;

