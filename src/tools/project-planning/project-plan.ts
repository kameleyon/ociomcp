// Auto-generated safe fallback for project-plan

export function activate() {
    console.log("[TOOL] project-plan activated (passive mode)");
}

export function onFileWrite() { /* no-op */ }
export function onSessionStart() { /* no-op */ }
export function onCommand() { /* no-op */ }
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
