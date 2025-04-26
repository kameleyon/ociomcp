import { z } from 'zod';
import * as fs from 'fs/promises';
import * as path from 'path';

// Define schemas for PlanCreator tool
export const CreatePlanSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  tasks: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    dependencies: z.array(z.string()).optional(),
    estimatedHours: z.number().optional(),
    assignee: z.string().optional(),
  })),
  outputFormat: z.enum(['json', 'markdown', 'mermaid']).optional(),
});

export const VisualizePlanSchema = z.object({
  planPath: z.string(),
  format: z.enum(['mermaid-gantt', 'mermaid-flowchart', 'markdown-table']).optional(),
  showDependencies: z.boolean().optional(),
  showAssignees: z.boolean().optional(),
});

export const UpdatePlanSchema = z.object({
  planPath: z.string(),
  tasks: z.array(z.object({
    id: z.string(),
    title: z.string().optional(),
    description: z.string().optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    dependencies: z.array(z.string()).optional(),
    estimatedHours: z.number().optional(),
    assignee: z.string().optional(),
    status: z.enum(['not-started', 'in-progress', 'completed', 'blocked']).optional(),
  })).optional(),
  addTasks: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    dependencies: z.array(z.string()).optional(),
    estimatedHours: z.number().optional(),
    assignee: z.string().optional(),
    status: z.enum(['not-started', 'in-progress', 'completed', 'blocked']).optional(),
  })).optional(),
  removeTasks: z.array(z.string()).optional(),
});

// Define types for the plan
interface Task {
  id: string;
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  dependencies?: string[];
  estimatedHours?: number;
  assignee?: string;
  status?: 'not-started' | 'in-progress' | 'completed' | 'blocked';
}

interface Plan {
  title: string;
  description?: string;
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Creates a project plan with tasks, timelines, and dependencies
 */
export async function handleCreatePlan(args: any) {
  if (args && typeof args === 'object' && 'title' in args && 'tasks' in args && Array.isArray(args.tasks)) {
    try {
      const { title, description, tasks, outputFormat = 'json' } = args;
      
      // Create the plan
      const plan: Plan = {
        title,
        description,
        tasks: tasks.map((task: any) => ({
          id: task.id,
          title: task.title,
          description: task.description,
          priority: task.priority || 'medium',
          dependencies: task.dependencies || [],
          estimatedHours: task.estimatedHours,
          assignee: task.assignee,
          status: 'not-started',
        })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Validate the plan
      validatePlan(plan);
      
      // Save the plan to a file
      const planFileName = `${title.toLowerCase().replace(/\s+/g, '-')}-plan.json`;
      await fs.writeFile(planFileName, JSON.stringify(plan, null, 2));
      
      // Generate the output based on the requested format
      let output: string;
      switch (outputFormat) {
        case 'markdown':
          output = generateMarkdownPlan(plan);
          break;
        case 'mermaid':
          output = generateMermaidPlan(plan);
          break;
        case 'json':
        default:
          output = JSON.stringify(plan, null, 2);
          break;
      }
      
      return {
        content: [{
          type: "text",
          text: `Plan created successfully and saved to ${planFileName}\n\n${output}`
        }],
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error creating plan: ${error}`
        }],
        isError: true,
      };
    }
  }
  
  return {
    content: [{ type: "text", text: "Error: Invalid arguments for create_plan" }],
    isError: true,
  };
}

/**
 * Visualizes a project plan in various formats
 */
export async function handleVisualizePlan(args: any) {
  if (args && typeof args === 'object' && 'planPath' in args && typeof args.planPath === 'string') {
    try {
      const { planPath, format = 'mermaid-gantt', showDependencies = true, showAssignees = true } = args;
      
      // Read the plan from the file
      const planContent = await fs.readFile(planPath, 'utf8');
      const plan = JSON.parse(planContent) as Plan;
      
      // Generate the visualization based on the requested format
      let visualization: string;
      switch (format) {
        case 'mermaid-flowchart':
          visualization = generateMermaidFlowchart(plan, showDependencies);
          break;
        case 'markdown-table':
          visualization = generateMarkdownTable(plan, showAssignees);
          break;
        case 'mermaid-gantt':
        default:
          visualization = generateMermaidGantt(plan, showDependencies, showAssignees);
          break;
      }
      
      return {
        content: [{
          type: "text",
          text: visualization
        }],
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error visualizing plan: ${error}`
        }],
        isError: true,
      };
    }
  }
  
  return {
    content: [{ type: "text", text: "Error: Invalid arguments for visualize_plan" }],
    isError: true,
  };
}

/**
 * Updates a project plan with new tasks, changes to existing tasks, or removal of tasks
 */
export async function handleUpdatePlan(args: any) {
  if (args && typeof args === 'object' && 'planPath' in args && typeof args.planPath === 'string') {
    try {
      const { planPath, tasks, addTasks, removeTasks } = args;
      
      // Read the plan from the file
      const planContent = await fs.readFile(planPath, 'utf8');
      const plan = JSON.parse(planContent) as Plan;
      
      // Update existing tasks
      if (tasks && Array.isArray(tasks)) {
        for (const updatedTask of tasks) {
          const taskIndex = plan.tasks.findIndex(task => task.id === updatedTask.id);
          if (taskIndex !== -1) {
            plan.tasks[taskIndex] = {
              ...plan.tasks[taskIndex],
              ...updatedTask,
            };
          }
        }
      }
      
      // Add new tasks
      if (addTasks && Array.isArray(addTasks)) {
        for (const newTask of addTasks) {
          // Check if a task with the same ID already exists
          const existingTaskIndex = plan.tasks.findIndex(task => task.id === newTask.id);
          if (existingTaskIndex === -1) {
            plan.tasks.push({
              id: newTask.id,
              title: newTask.title,
              description: newTask.description,
              priority: newTask.priority || 'medium',
              dependencies: newTask.dependencies || [],
              estimatedHours: newTask.estimatedHours,
              assignee: newTask.assignee,
              status: newTask.status || 'not-started',
            });
          }
        }
      }
      
      // Remove tasks
      if (removeTasks && Array.isArray(removeTasks)) {
        plan.tasks = plan.tasks.filter(task => !removeTasks.includes(task.id));
      }
      
      // Update the updatedAt timestamp
      plan.updatedAt = new Date().toISOString();
      
      // Validate the updated plan
      validatePlan(plan);
      
      // Save the updated plan back to the file
      await fs.writeFile(planPath, JSON.stringify(plan, null, 2));
      
      return {
        content: [{
          type: "text",
          text: `Plan updated successfully and saved to ${planPath}`
        }],
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error updating plan: ${error}`
        }],
        isError: true,
      };
    }
  }
  
  return {
    content: [{ type: "text", text: "Error: Invalid arguments for update_plan" }],
    isError: true,
  };
}

/**
 * Validates a plan to ensure it has no circular dependencies
 */
function validatePlan(plan: Plan): void {
  // Check for circular dependencies
  const taskMap = new Map<string, Task>();
  for (const task of plan.tasks) {
    taskMap.set(task.id, task);
  }
  
  for (const task of plan.tasks) {
    if (task.dependencies && task.dependencies.length > 0) {
      const visited = new Set<string>();
      const stack = new Set<string>();
      
      if (hasCyclicDependency(task.id, taskMap, visited, stack)) {
        throw new Error(`Circular dependency detected for task: ${task.id}`);
      }
    }
  }
}

/**
 * Checks if a task has a cyclic dependency
 */
function hasCyclicDependency(
  taskId: string,
  taskMap: Map<string, Task>,
  visited: Set<string>,
  stack: Set<string>
): boolean {
  if (!visited.has(taskId)) {
    visited.add(taskId);
    stack.add(taskId);
    
    const task = taskMap.get(taskId);
    if (task && task.dependencies) {
      for (const dependencyId of task.dependencies) {
        if (!taskMap.has(dependencyId)) {
          throw new Error(`Task ${taskId} depends on non-existent task: ${dependencyId}`);
        }
        
        if (!visited.has(dependencyId) && hasCyclicDependency(dependencyId, taskMap, visited, stack)) {
          return true;
        } else if (stack.has(dependencyId)) {
          return true;
        }
      }
    }
    
    stack.delete(taskId);
  }
  
  return false;
}

/**
 * Generates a Markdown representation of a plan
 */
function generateMarkdownPlan(plan: Plan): string {
  let markdown = `# ${plan.title}\n\n`;
  
  if (plan.description) {
    markdown += `${plan.description}\n\n`;
  }
  
  markdown += `## Tasks\n\n`;
  
  for (const task of plan.tasks) {
    markdown += `### ${task.title} (${task.id})\n\n`;
    
    if (task.description) {
      markdown += `${task.description}\n\n`;
    }
    
    markdown += `- **Priority:** ${task.priority || 'medium'}\n`;
    
    if (task.estimatedHours !== undefined) {
      markdown += `- **Estimated Hours:** ${task.estimatedHours}\n`;
    }
    
    if (task.assignee) {
      markdown += `- **Assignee:** ${task.assignee}\n`;
    }
    
    if (task.dependencies && task.dependencies.length > 0) {
      markdown += `- **Dependencies:** ${task.dependencies.join(', ')}\n`;
    }
    
    markdown += '\n';
  }
  
  return markdown;
}

/**
 * Generates a Mermaid representation of a plan
 */
function generateMermaidPlan(plan: Plan): string {
  let mermaid = `graph TD\n`;
  
  // Add nodes for each task
  for (const task of plan.tasks) {
    mermaid += `  ${task.id}["${task.title}"]\n`;
  }
  
  // Add edges for dependencies
  for (const task of plan.tasks) {
    if (task.dependencies && task.dependencies.length > 0) {
      for (const dependencyId of task.dependencies) {
        mermaid += `  ${dependencyId} --> ${task.id}\n`;
      }
    }
  }
  
  return '```mermaid\n' + mermaid + '```';
}

/**
 * Generates a Mermaid Gantt chart representation of a plan
 */
function generateMermaidGantt(plan: Plan, showDependencies: boolean, showAssignees: boolean): string {
  let mermaid = `gantt\n`;
  mermaid += `  title ${plan.title}\n`;
  mermaid += `  dateFormat YYYY-MM-DD\n`;
  mermaid += `  axisFormat %m/%d\n\n`;
  
  // Add sections for each task
  let startDate = new Date();
  let currentDate = new Date(startDate);
  
  // Sort tasks by dependencies
  const sortedTasks = sortTasksByDependencies(plan.tasks);
  
  for (const task of sortedTasks) {
    const taskTitle = showAssignees && task.assignee ? `${task.title} (${task.assignee})` : task.title;
    const durationDays = task.estimatedHours ? Math.ceil(task.estimatedHours / 8) : 1;
    
    const endDate = new Date(currentDate);
    endDate.setDate(endDate.getDate() + durationDays);
    
    const startDateStr = formatDate(currentDate);
    const endDateStr = formatDate(endDate);
    
    mermaid += `  ${task.id} : ${taskTitle}, ${startDateStr}, ${durationDays}d\n`;
    
    if (showDependencies && task.dependencies && task.dependencies.length > 0) {
      for (const dependencyId of task.dependencies) {
        mermaid += `  ${task.id} after ${dependencyId}\n`;
      }
    }
    
    // Move the current date forward
    currentDate.setDate(currentDate.getDate() + durationDays);
  }
  
  return '```mermaid\n' + mermaid + '```';
}

/**
 * Generates a Mermaid flowchart representation of a plan
 */
function generateMermaidFlowchart(plan: Plan, showDependencies: boolean): string {
  let mermaid = `flowchart TD\n`;
  
  // Add nodes for each task
  for (const task of plan.tasks) {
    const priorityColor = getPriorityColor(task.priority);
    mermaid += `  ${task.id}["${task.title}"]:::${priorityColor}\n`;
  }
  
  // Add edges for dependencies
  if (showDependencies) {
    for (const task of plan.tasks) {
      if (task.dependencies && task.dependencies.length > 0) {
        for (const dependencyId of task.dependencies) {
          mermaid += `  ${dependencyId} --> ${task.id}\n`;
        }
      }
    }
  }
  
  // Add class definitions for priority colors
  mermaid += `\n  classDef low fill:#90EE90,stroke:#006400,stroke-width:2px\n`;
  mermaid += `  classDef medium fill:#FFD700,stroke:#B8860B,stroke-width:2px\n`;
  mermaid += `  classDef high fill:#FF6347,stroke:#8B0000,stroke-width:2px\n`;
  
  return '```mermaid\n' + mermaid + '```';
}

/**
 * Generates a Markdown table representation of a plan
 */
function generateMarkdownTable(plan: Plan, showAssignees: boolean): string {
  let markdown = `# ${plan.title}\n\n`;
  
  if (plan.description) {
    markdown += `${plan.description}\n\n`;
  }
  
  markdown += `| ID | Title | Priority | Estimated Hours | Status |`;
  if (showAssignees) {
    markdown += ` Assignee |`;
  }
  markdown += `\n`;
  
  markdown += `| --- | --- | --- | --- | --- |`;
  if (showAssignees) {
    markdown += ` --- |`;
  }
  markdown += `\n`;
  
  for (const task of plan.tasks) {
    markdown += `| ${task.id} | ${task.title} | ${task.priority || 'medium'} | ${task.estimatedHours || '-'} | ${task.status || 'not-started'} |`;
    if (showAssignees) {
      markdown += ` ${task.assignee || '-'} |`;
    }
    markdown += `\n`;
  }
  
  return markdown;
}

/**
 * Sorts tasks by dependencies
 */
function sortTasksByDependencies(tasks: Task[]): Task[] {
  const result: Task[] = [];
  const visited = new Set<string>();
  const taskMap = new Map<string, Task>();
  
  // Create a map of tasks by ID
  for (const task of tasks) {
    taskMap.set(task.id, task);
  }
  
  // Define a recursive function to visit tasks
  function visit(taskId: string) {
    if (visited.has(taskId)) {
      return;
    }
    
    visited.add(taskId);
    
    const task = taskMap.get(taskId);
    if (task && task.dependencies) {
      for (const dependencyId of task.dependencies) {
        visit(dependencyId);
      }
    }
    
    if (task) {
      result.push(task);
    }
  }
  
  // Visit all tasks
  for (const task of tasks) {
    visit(task.id);
  }
  
  return result;
}

/**
 * Formats a date as YYYY-MM-DD
 */
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

/**
 * Gets the color class for a priority
 */
function getPriorityColor(priority?: string): string {
  switch (priority) {
    case 'low':
      return 'low';
    case 'high':
      return 'high';
    case 'medium':
    default:
      return 'medium';
  }
}
