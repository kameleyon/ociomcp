// Auto-generated safe fallback for index

export function activate() {
    console.log("[TOOL] index activated (passive mode)");
}

// Define global state types
declare global {
  var projectPlans: Record<string, {
    id: string;
    name: string;
    description: string;
    tasks: Array<{
      id: string;
      name: string;
      description: string;
      status: string;
      startDate: string;
      endDate: string;
      dependencies: string[];
      assignee: string;
      progress: number;
    }>;
    createdAt: string;
    updatedAt: string;
  }>;
  var currentPlanId: string | null;
}

export function onFileWrite(event: any) {
  console.log(`[Project Planning] File write event detected: ${event.path}`);
  
  try {
    // Check if the file is related to project planning
    if (event.path.includes('plan') ||
        event.path.includes('roadmap') ||
        event.path.includes('milestone') ||
        event.path.includes('task') ||
        event.path.endsWith('.md') ||
        event.path.endsWith('.json')) {
      
      // Initialize project plans if needed
      if (!globalThis.projectPlans) {
        globalThis.projectPlans = {};
      }
      
      // Check if the file contains plan data
      if (event.content) {
        try {
          // Try to parse the content as JSON
          let planData;
          if (typeof event.content === 'string') {
            // Check if it's a JSON file
            if (event.path.endsWith('.json')) {
              try {
                planData = JSON.parse(event.content);
              } catch (parseError) {
                // Not valid JSON, continue with other checks
              }
            }
            
            // If not parsed as JSON, check for markdown plan format
            if (!planData && event.path.endsWith('.md')) {
              // Check if it's a markdown file with plan data
              if (event.content.includes('# Project Plan') ||
                  event.content.includes('# Roadmap') ||
                  event.content.includes('# Milestones')) {
                
                // Import plan parser
                const { parsePlanFromMarkdown } = require('./project-plan.js');
                planData = parsePlanFromMarkdown(event.content);
              }
            }
          } else {
            // Content is already an object
            planData = event.content;
          }
          
          // If we have plan data, update or create a plan
          if (planData && planData.tasks) {
            const planId = planData.id || `plan-${Date.now()}`;
            
            globalThis.projectPlans[planId] = {
              id: planId,
              name: planData.name || 'Unnamed Plan',
              description: planData.description || '',
              tasks: planData.tasks || [],
              createdAt: planData.createdAt || new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            
            console.log(`[Project Planning] Updated project plan: ${planId}`);
          }
        } catch (contentError: unknown) {
          const errorMessage = contentError instanceof Error ? contentError.message : String(contentError);
          console.error(`[Project Planning] Error processing file content: ${errorMessage}`);
        }
      }
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[Project Planning] Error handling file write: ${errorMessage}`);
  }
}

export function onSessionStart(session: any) {
  console.log(`[Project Planning] New session started: ${session.id}`);
  
  try {
    // Initialize project planning state for the session
    session.projectPlanningState = {
      initialized: true,
      timestamp: new Date().toISOString(),
      plans: {},
      currentPlanId: null
    };
    
    // Initialize global state if needed
    if (!globalThis.projectPlans) {
      globalThis.projectPlans = {};
    }
    
    // Look for existing project plans in the project
    try {
      const fs = require('fs');
      const path = require('path');
      const projectRoot = process.cwd();
      
      // Check common locations for project plans
      const planLocations = [
        'project-plan.json',
        'plan.json',
        'roadmap.json',
        'docs/project-plan.json',
        'docs/plan.json',
        'docs/roadmap.json',
        'project-plan.md',
        'plan.md',
        'roadmap.md',
        'docs/project-plan.md',
        'docs/plan.md',
        'docs/roadmap.md'
      ];
      
      for (const location of planLocations) {
        const planPath = path.join(projectRoot, location);
        
        try {
          if (fs.existsSync(planPath)) {
            const content = fs.readFileSync(planPath, 'utf8');
            
            // Parse the plan based on file type
            let planData;
            
            if (location.endsWith('.json')) {
              planData = JSON.parse(content);
            } else if (location.endsWith('.md')) {
              // Import plan parser
              const { parsePlanFromMarkdown } = require('./project-plan.js');
              planData = parsePlanFromMarkdown(content);
            }
            
            if (planData && planData.tasks) {
              const planId = planData.id || `plan-${Date.now()}`;
              
              globalThis.projectPlans[planId] = {
                id: planId,
                name: planData.name || 'Unnamed Plan',
                description: planData.description || '',
                tasks: planData.tasks || [],
                createdAt: planData.createdAt || new Date().toISOString(),
                updatedAt: new Date().toISOString()
              };
              
              // Set as current plan
              globalThis.currentPlanId = planId;
              session.projectPlanningState.currentPlanId = planId;
              
              console.log(`[Project Planning] Loaded project plan from ${location}: ${planId}`);
              break; // Stop after finding the first valid plan
            }
          }
        } catch (fileError) {
          // Continue to the next location
        }
      }
      
      // Update session state with plans
      session.projectPlanningState.plans = globalThis.projectPlans;
    } catch (scanError: unknown) {
      const errorMessage = scanError instanceof Error ? scanError.message : String(scanError);
      console.error(`[Project Planning] Error scanning for project plans: ${errorMessage}`);
    }
    
    // If no plan was found, create a default one
    if (!globalThis.currentPlanId && Object.keys(globalThis.projectPlans).length === 0) {
      try {
        // Import plan generator
        const { generateProjectPlan } = require('./plan-generator.js');
        
        // Generate a basic plan
        const defaultPlan = generateProjectPlan({
          name: 'Default Project Plan',
          description: 'Automatically generated project plan',
          type: 'generic',
          features: [],
          timeline: {
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
          }
        });
        
        const planId = `plan-${Date.now()}`;
        
        globalThis.projectPlans[planId] = {
          id: planId,
          name: defaultPlan.name,
          description: defaultPlan.description,
          tasks: defaultPlan.tasks,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        // Set as current plan
        globalThis.currentPlanId = planId;
        session.projectPlanningState.currentPlanId = planId;
        session.projectPlanningState.plans = globalThis.projectPlans;
        
        console.log(`[Project Planning] Created default project plan: ${planId}`);
      } catch (defaultPlanError: unknown) {
        const errorMessage = defaultPlanError instanceof Error ? defaultPlanError.message : String(defaultPlanError);
        console.error(`[Project Planning] Error creating default plan: ${errorMessage}`);
      }
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[Project Planning] Error initializing session: ${errorMessage}`);
  }
}

export function onCommand(command: any) {
  console.log(`[Project Planning] Command executed: ${command.name}`);
  
  try {
    // Handle project planning commands
    switch (command.name) {
      case 'generate_project_plan':
        // Generate a project plan
        const { generateProjectPlan } = require('./plan-generator.js');
        
        const plan = generateProjectPlan({
          name: command.name || 'Project Plan',
          description: command.description || 'Generated project plan',
          type: command.type || 'generic',
          features: command.features || [],
          timeline: command.timeline || {
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
          }
        });
        
        // Store the plan
        if (!globalThis.projectPlans) {
          globalThis.projectPlans = {};
        }
        
        const planId = command.id || `plan-${Date.now()}`;
        
        globalThis.projectPlans[planId] = {
          id: planId,
          name: plan.name,
          description: plan.description,
          tasks: plan.tasks,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        // Set as current plan
        globalThis.currentPlanId = planId;
        
        // Format the plan if requested
        let formattedPlan = null;
        if (command.format) {
          formattedPlan = generateFormattedProjectPlan(
            {
              name: plan.name,
              description: plan.description,
              type: command.type || 'generic',
              features: command.features || [],
              timeline: command.timeline || {
                startDate: new Date().toISOString(),
                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
              }
            },
            command.format
          );
        }
        
        return {
          planId,
          plan: globalThis.projectPlans[planId],
          formattedPlan
        };
        
      case 'visualize_plan':
        // Visualize a project plan
        if (!globalThis.projectPlans) {
          return {
            error: 'No project plans available'
          };
        }
        
        const planToVisualize = command.planId ?
          globalThis.projectPlans[command.planId] :
          (globalThis.currentPlanId ?
            globalThis.projectPlans[globalThis.currentPlanId] :
            null);
        
        if (!planToVisualize) {
          return {
            error: 'Plan not found'
          };
        }
        
        // Import visualizer
        const { renderAsMarkdown, renderAsGanttChart, renderAsHTML } = require('./plan-visualizer.js');
        
        // Render the plan in the requested format
        const format = command.format || 'markdown';
        let visualization;
        
        switch (format) {
          case 'gantt':
            visualization = renderAsGanttChart(planToVisualize);
            break;
          case 'html':
            visualization = renderAsHTML(planToVisualize);
            break;
          case 'markdown':
          default:
            visualization = renderAsMarkdown(planToVisualize);
            break;
        }
        
        return {
          planId: planToVisualize.id,
          format,
          visualization
        };
        
      case 'update_plan':
        // Update a project plan
        if (!globalThis.projectPlans) {
          return {
            error: 'No project plans available'
          };
        }
        
        const planToUpdate = command.planId ?
          globalThis.projectPlans[command.planId] :
          (globalThis.currentPlanId ?
            globalThis.projectPlans[globalThis.currentPlanId] :
            null);
        
        if (!planToUpdate) {
          return {
            error: 'Plan not found'
          };
        }
        
        // Update plan properties
        if (command.name) planToUpdate.name = command.name;
        if (command.description) planToUpdate.description = command.description;
        
        // Update tasks if provided
        if (command.tasks) {
          planToUpdate.tasks = command.tasks;
        }
        
        // Update individual task if provided
        if (command.task) {
          const taskIndex = planToUpdate.tasks.findIndex((t: any) => t.id === command.task.id);
          
          if (taskIndex >= 0) {
            // Update existing task
            planToUpdate.tasks[taskIndex] = {
              ...planToUpdate.tasks[taskIndex],
              ...command.task
            };
          } else if (command.task.id) {
            // Add new task
            planToUpdate.tasks.push(command.task);
          }
        }
        
        // Update timestamp
        planToUpdate.updatedAt = new Date().toISOString();
        
        return {
          planId: planToUpdate.id,
          plan: planToUpdate
        };
        
      case 'get_plans':
        // Get all project plans
        return {
          plans: globalThis.projectPlans || {},
          currentPlanId: globalThis.currentPlanId
        };
        
      case 'get_plan':
        // Get a specific project plan
        if (!globalThis.projectPlans) {
          return {
            error: 'No project plans available'
          };
        }
        
        const planToGet = command.planId ?
          globalThis.projectPlans[command.planId] :
          (globalThis.currentPlanId ?
            globalThis.projectPlans[globalThis.currentPlanId] :
            null);
        
        if (!planToGet) {
          return {
            error: 'Plan not found'
          };
        }
        
        return {
          plan: planToGet
        };
        
      case 'set_current_plan':
        // Set the current project plan
        if (!globalThis.projectPlans || !command.planId || !globalThis.projectPlans[command.planId]) {
          return {
            error: 'Plan not found'
          };
        }
        
        globalThis.currentPlanId = command.planId;
        
        // Make sure currentPlanId is not null before using it as an index
        const currentPlan = globalThis.currentPlanId ?
          globalThis.projectPlans[globalThis.currentPlanId] :
          null;
          
        return {
          currentPlanId: globalThis.currentPlanId,
          plan: currentPlan
        };
        
      default:
        console.log(`[Project Planning] Unknown command: ${command.name}`);
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[Project Planning] Error executing command: ${errorMessage}`);
    return { error: errorMessage };
  }
}
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
