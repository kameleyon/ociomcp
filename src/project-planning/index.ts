/**
 * Project Planning Module
 * 
 * This module provides functionality for generating, managing, and visualizing project plans.
 */

// Export all types and functions from project-plan.ts
export * from './project-plan.js';

// Export all types and functions from plan-generator.ts
export * from './plan-generator.js';

// Export all functions from plan-visualizer.ts
export * from './plan-visualizer.js';

// Export a convenience function to create a complete project plan
import { ProjectRequirements, generateProjectPlan } from './plan-generator.js';
import { renderAsMarkdown, renderAsGanttChart, renderAsHTML } from './plan-visualizer.js';

/**
 * Generate a complete project plan and return it in the specified format
 * @param requirements The project requirements
 * @param format The output format (markdown, gantt, html)
 * @returns The formatted project plan
 */
export function generateFormattedProjectPlan(
  requirements: ProjectRequirements,
  format: 'markdown' | 'gantt' | 'html' = 'markdown'
): string {
  const plan = generateProjectPlan(requirements);
  
  switch (format) {
    case 'gantt':
      return renderAsGanttChart(plan);
    case 'html':
      return renderAsHTML(plan);
    case 'markdown':
    default:
      return renderAsMarkdown(plan);
  }
}