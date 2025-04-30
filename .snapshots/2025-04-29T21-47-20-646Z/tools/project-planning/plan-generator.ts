// Auto-generated safe fallback for plan-generator

export function activate() {
    console.log("[TOOL] plan-generator activated (passive mode)");
}

export function onFileWrite() { /* no-op */ }
export function onSessionStart() { /* no-op */ }
export function onCommand() { /* no-op */ }
import { ProjectPlan, Phase, Task, createEmptyProjectPlan, addPhase, addTask } from './project-plan.js';

/**
 * Project type definitions for different project templates
 */
export type ProjectType = 'web-application' | 'mobile-app' | 'api-service' | 'desktop-application' | 'custom';

/**
 * Interface for project requirements
 */
export interface ProjectRequirements {
  name: string;
  description: string;
  type: ProjectType;
  features: string[];
  timeline?: {
    startDate?: Date;
    endDate?: Date;
  };
  teamSize?: number;
  customPhases?: string[];
}

/**
 * Generates a project plan based on requirements
 */
export function generateProjectPlan(requirements: ProjectRequirements): ProjectPlan {
  // Create the base project plan
  const plan = createEmptyProjectPlan(requirements.name, requirements.description);
  
  // Add phases based on project type
  const phases = getPhasesByProjectType(requirements.type, requirements.customPhases);
  
  // Add each phase to the plan
  phases.forEach(phaseName => {
    const phaseDescription = getPhaseDescription(phaseName);
    const updatedPlan = addPhase(plan, phaseName, phaseDescription);
    Object.assign(plan, updatedPlan);
  });
  
  // Generate tasks for each phase based on features
  generateTasks(plan, requirements.features);
  
  // Set timeline if provided
  if (requirements.timeline) {
    setProjectTimeline(plan, requirements.timeline.startDate, requirements.timeline.endDate);
  }
  
  return plan;
}

/**
 * Get phases based on project type
 */
function getPhasesByProjectType(type: ProjectType, customPhases?: string[]): string[] {
  if (type === 'custom' && customPhases && customPhases.length > 0) {
    return customPhases;
  }
  
  // Default phases for different project types
  switch (type) {
    case 'web-application':
      return [
        'Requirements Gathering',
        'Design',
        'Frontend Development',
        'Backend Development',
        'Integration',
        'Testing',
        'Deployment',
        'Maintenance'
      ];
    case 'mobile-app':
      return [
        'Requirements Gathering',
        'UI/UX Design',
        'Frontend Development',
        'Backend Integration',
        'Testing',
        'App Store Submission',
        'Launch',
        'Maintenance'
      ];
    case 'api-service':
      return [
        'Requirements Gathering',
        'API Design',
        'Implementation',
        'Documentation',
        'Testing',
        'Deployment',
        'Monitoring',
        'Maintenance'
      ];
    case 'desktop-application':
      return [
        'Requirements Gathering',
        'UI/UX Design',
        'Core Functionality',
        'Integration',
        'Testing',
        'Packaging',
        'Distribution',
        'Maintenance'
      ];
    default:
      return [
        'Planning',
        'Design',
        'Development',
        'Testing',
        'Deployment',
        'Maintenance'
      ];
  }
}

/**
 * Get description for a phase
 */
function getPhaseDescription(phaseName: string): string {
  const descriptions: Record<string, string> = {
    'Requirements Gathering': 'Collect and document all project requirements and user stories',
    'Design': 'Create wireframes, mockups, and design specifications',
    'UI/UX Design': 'Design user interfaces and user experience flows',
    'Frontend Development': 'Implement user interfaces and client-side functionality',
    'Backend Development': 'Implement server-side logic and database interactions',
    'API Design': 'Design API endpoints, data models, and documentation',
    'Implementation': 'Implement the core functionality of the system',
    'Integration': 'Integrate different components and systems',
    'Testing': 'Perform unit, integration, and system testing',
    'Deployment': 'Deploy the application to production environment',
    'Monitoring': 'Set up monitoring and alerting systems',
    'Maintenance': 'Provide ongoing support and maintenance',
    'Planning': 'Plan project scope, timeline, and resources',
    'Development': 'Implement the core functionality of the system',
    'Core Functionality': 'Implement the main features of the application',
    'Documentation': 'Create comprehensive documentation',
    'Packaging': 'Package the application for distribution',
    'Distribution': 'Distribute the application to users',
    'App Store Submission': 'Prepare and submit the app to app stores',
    'Launch': 'Launch the application to users'
  };
  
  return descriptions[phaseName] || `${phaseName} phase of the project`;
}

/**
 * Generate tasks for each phase based on features
 */
function generateTasks(plan: ProjectPlan, features: string[]): void {
  plan.phases.forEach(phase => {
    // Generate common tasks for each phase
    const commonTasks = getCommonTasksByPhase(phase.name);
    
    commonTasks.forEach(task => {
      const updatedPlan = addTask(
        plan,
        phase.id,
        task.name,
        task.description,
        task.estimatedHours,
        task.dependencies
      );
      Object.assign(plan, updatedPlan);
    });
    
    // Generate feature-specific tasks for appropriate phases
    if (['Frontend Development', 'Backend Development', 'Implementation', 'Core Functionality'].includes(phase.name)) {
      features.forEach((feature, index) => {
        const updatedPlan = addTask(
          plan,
          phase.id,
          `Implement ${feature}`,
          `Implement the ${feature} functionality`,
          8, // Default estimate
          [] // No dependencies by default
        );
        Object.assign(plan, updatedPlan);
      });
    }
    
    if (phase.name === 'Testing') {
      features.forEach((feature, index) => {
        const updatedPlan = addTask(
          plan,
          phase.id,
          `Test ${feature}`,
          `Test the ${feature} functionality`,
          4, // Default estimate
          [] // No dependencies by default
        );
        Object.assign(plan, updatedPlan);
      });
    }
  });
}

/**
 * Get common tasks for a specific phase
 */
function getCommonTasksByPhase(phaseName: string): { name: string; description: string; estimatedHours: number; dependencies: string[] }[] {
  switch (phaseName) {
    case 'Requirements Gathering':
      return [
        {
          name: 'Stakeholder Interviews',
          description: 'Conduct interviews with key stakeholders',
          estimatedHours: 8,
          dependencies: []
        },
        {
          name: 'Requirements Documentation',
          description: 'Document all requirements and user stories',
          estimatedHours: 16,
          dependencies: []
        },
        {
          name: 'Requirements Review',
          description: 'Review requirements with stakeholders',
          estimatedHours: 4,
          dependencies: []
        }
      ];
    case 'Design':
    case 'UI/UX Design':
      return [
        {
          name: 'Wireframing',
          description: 'Create wireframes for all screens',
          estimatedHours: 16,
          dependencies: []
        },
        {
          name: 'Visual Design',
          description: 'Create visual designs for all screens',
          estimatedHours: 24,
          dependencies: []
        },
        {
          name: 'Design Review',
          description: 'Review designs with stakeholders',
          estimatedHours: 4,
          dependencies: []
        }
      ];
    // Add more cases for other phases
    default:
      return [
        {
          name: `${phaseName} Planning`,
          description: `Plan the ${phaseName} phase`,
          estimatedHours: 4,
          dependencies: []
        },
        {
          name: `${phaseName} Execution`,
          description: `Execute the ${phaseName} phase`,
          estimatedHours: 16,
          dependencies: []
        },
        {
          name: `${phaseName} Review`,
          description: `Review the ${phaseName} phase`,
          estimatedHours: 4,
          dependencies: []
        }
      ];
  }
}

/**
 * Set project timeline with start and end dates
 */
function setProjectTimeline(plan: ProjectPlan, startDate?: Date, endDate?: Date): void {
  if (!startDate) {
    startDate = new Date();
  }
  
  if (!endDate) {
    // Default to 3 months from start date if no end date provided
    endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 3);
  }
  
  // Calculate phase durations based on task estimates
  const totalEstimatedHours = plan.phases.reduce((total, phase) => {
    return total + phase.tasks.reduce((phaseTotal, task) => phaseTotal + task.estimatedHours, 0);
  }, 0);
  
  // Calculate total duration in days
  const totalDurationMs = endDate.getTime() - startDate.getTime();
  const totalDurationDays = totalDurationMs / (1000 * 60 * 60 * 24);
  
  let currentDate = new Date(startDate);
  
  // Assign dates to each phase
  plan.phases.forEach(phase => {
    const phaseEstimatedHours = phase.tasks.reduce((total, task) => total + task.estimatedHours, 0);
    const phaseDurationDays = Math.max(1, Math.round((phaseEstimatedHours / totalEstimatedHours) * totalDurationDays));
    
    phase.startDate = new Date(currentDate);
    
    // Calculate end date
    const phaseEndDate = new Date(currentDate);
    phaseEndDate.setDate(phaseEndDate.getDate() + phaseDurationDays);
    phase.endDate = phaseEndDate;
    
    // Update current date for next phase
    currentDate = new Date(phaseEndDate);
  });
}
