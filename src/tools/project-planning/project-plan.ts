// Auto-generated safe fallback for project-plan

export function activate() {
    console.log("[TOOL] project-plan activated (passive mode)");
}

import * as fs from 'fs/promises';
import * as path from 'path';

// Store project plans in memory
const projectPlans: Record<string, ProjectPlan> = {};

export async function onFileWrite(filePath?: string) {
  if (!filePath) return;
  
  try {
    // Check if the file is related to project planning
    if (filePath.includes('project-plan') || filePath.endsWith('.plan.json')) {
      console.log(`[project-plan] Detected change in project plan file: ${filePath}`);
      
      // Read the file and update the in-memory project plan
      const content = await fs.readFile(filePath, 'utf-8');
      try {
        const plan = JSON.parse(content);
        if (plan.id && plan.name) {
          projectPlans[plan.id] = plan;
          console.log(`[project-plan] Updated project plan: ${plan.name}`);
        }
      } catch (err) {
        console.error(`[project-plan] Error parsing project plan file: ${err}`);
      }
    }
  } catch (err) {
    console.error(`[project-plan] Error processing file change: ${err}`);
  }
}

export async function onSessionStart() {
  console.log('[project-plan] Session started');
  
  try {
    // Create project plans directory if it doesn't exist
    const plansDir = path.join(process.cwd(), 'project-plans');
    await fs.mkdir(plansDir, { recursive: true });
    
    // Load existing project plans
    try {
      const files = await fs.readdir(plansDir);
      const planFiles = files.filter(file => file.endsWith('.plan.json'));
      
      for (const file of planFiles) {
        try {
          const content = await fs.readFile(path.join(plansDir, file), 'utf-8');
          const plan = JSON.parse(content);
          if (plan.id && plan.name) {
            projectPlans[plan.id] = plan;
          }
        } catch (err) {
          console.error(`[project-plan] Error loading plan file ${file}: ${err}`);
        }
      }
      
      console.log(`[project-plan] Loaded ${Object.keys(projectPlans).length} project plans`);
    } catch (err) {
      // Directory might not exist yet
      console.log('[project-plan] No existing project plans found');
    }
    
    return {
      initialized: true,
      plansLoaded: Object.keys(projectPlans).length,
      message: 'Project planning initialized'
    };
  } catch (err) {
    console.error(`[project-plan] Error initializing: ${err}`);
    return {
      initialized: false,
      message: `Error initializing project planning: ${err}`
    };
  }
}

export async function onCommand(command?: { name: string; args?: any[] }) {
  const name = command?.name;
  const args = command?.args || [];
  
  switch (name) {
    case 'project-plan:create': {
      const planName = args[0] || 'New Project Plan';
      const planDescription = args[1] || 'Project plan description';
      
      const plan = createEmptyProjectPlan(planName, planDescription);
      projectPlans[plan.id] = plan;
      
      // Save the plan to disk
      try {
        const plansDir = path.join(process.cwd(), 'project-plans');
        await fs.mkdir(plansDir, { recursive: true });
        await fs.writeFile(
          path.join(plansDir, `${plan.id}.plan.json`),
          JSON.stringify(plan, null, 2),
          'utf-8'
        );
        
        console.log(`[project-plan] Created new project plan: ${plan.name}`);
        return { success: true, plan };
      } catch (err) {
        console.error(`[project-plan] Error saving project plan: ${err}`);
        return { success: false, error: `Error saving project plan: ${err}` };
      }
    }
    case 'project-plan:list': {
      return {
        success: true,
        plans: Object.values(projectPlans).map(plan => ({
          id: plan.id,
          name: plan.name,
          phases: plan.phases.length,
          progress: calculateProgress(plan)
        }))
      };
    }
    case 'project-plan:get': {
      const planId = args[0];
      if (!planId) {
        return { success: false, error: 'Plan ID is required' };
      }
      
      const plan = projectPlans[planId];
      if (!plan) {
        return { success: false, error: `Plan with ID ${planId} not found` };
      }
      
      return { success: true, plan };
    }
    default:
      console.log(`[project-plan] Unknown command: ${name}`);
      return { success: false, error: `Unknown command: ${name}` };
  }
}
/**
 * Project Plan Model
 * Represents a complete project plan with phases, tasks, and timelines
 */

export interface Task {
  id: string;
  name: string;
  description: string;
  status: 'not-started' | 'in-progress' | 'completed';
  estimatedHours: number;
  dependencies: string[]; // IDs of tasks that must be completed before this one
}

export interface Phase {
  id: string;
  name: string;
  description: string;
  tasks: Task[];
  startDate?: Date;
  endDate?: Date;
}

export interface ProjectPlan {
  id: string;
  name: string;
  description: string;
  phases: Phase[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Creates a new empty project plan
 */
export function createEmptyProjectPlan(name: string, description: string): ProjectPlan {
  const now = new Date();
  return {
    id: `plan-${now.getTime()}`,
    name,
    description,
    phases: [],
    createdAt: now,
    updatedAt: now
  };
}

/**
 * Adds a phase to a project plan
 */
export function addPhase(plan: ProjectPlan, name: string, description: string): ProjectPlan {
  const updatedPlan = { ...plan };
  const phaseId = `phase-${updatedPlan.phases.length + 1}`;
  
  updatedPlan.phases.push({
    id: phaseId,
    name,
    description,
    tasks: []
  });
  
  updatedPlan.updatedAt = new Date();
  return updatedPlan;
}

/**
 * Adds a task to a phase
 */
export function addTask(
  plan: ProjectPlan, 
  phaseId: string, 
  name: string, 
  description: string, 
  estimatedHours: number,
  dependencies: string[] = []
): ProjectPlan {
  const updatedPlan = { ...plan };
  const phaseIndex = updatedPlan.phases.findIndex(phase => phase.id === phaseId);
  
  if (phaseIndex === -1) {
    throw new Error(`Phase with ID ${phaseId} not found`);
  }
  
  const taskId = `task-${phaseId}-${updatedPlan.phases[phaseIndex].tasks.length + 1}`;
  
  updatedPlan.phases[phaseIndex].tasks.push({
    id: taskId,
    name,
    description,
    status: 'not-started',
    estimatedHours,
    dependencies
  });
  
  updatedPlan.updatedAt = new Date();
  return updatedPlan;
}

/**
 * Updates the status of a task
 */
export function updateTaskStatus(
  plan: ProjectPlan,
  phaseId: string,
  taskId: string,
  status: 'not-started' | 'in-progress' | 'completed'
): ProjectPlan {
  const updatedPlan = { ...plan };
  const phaseIndex = updatedPlan.phases.findIndex(phase => phase.id === phaseId);
  
  if (phaseIndex === -1) {
    throw new Error(`Phase with ID ${phaseId} not found`);
  }
  
  const taskIndex = updatedPlan.phases[phaseIndex].tasks.findIndex(task => task.id === taskId);
  
  if (taskIndex === -1) {
    throw new Error(`Task with ID ${taskId} not found in phase ${phaseId}`);
  }
  
  updatedPlan.phases[phaseIndex].tasks[taskIndex].status = status;
  updatedPlan.updatedAt = new Date();
  
  return updatedPlan;
}

/**
 * Calculates the overall progress of the project plan
 * Returns a number between 0 and 1
 */
export function calculateProgress(plan: ProjectPlan): number {
  let totalTasks = 0;
  let completedTasks = 0;
  
  plan.phases.forEach(phase => {
    phase.tasks.forEach(task => {
      totalTasks++;
      if (task.status === 'completed') {
        completedTasks++;
      }
    });
  });
  
  return totalTasks === 0 ? 0 : completedTasks / totalTasks;
}
