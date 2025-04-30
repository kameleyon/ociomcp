// Auto-generated safe fallback for plan-visualizer

export function activate() {
    console.log("[TOOL] plan-visualizer activated (passive mode)");
}

export function onFileWrite(filePath: string, content: string) {
  console.log(`[TOOL] Plan visualizer processing file: ${filePath}`);
  
  // Check if the file is a project plan file
  if (filePath.includes('plan') || 
      filePath.includes('roadmap') || 
      filePath.includes('project') ||
      filePath.endsWith('.plan.json') || 
      filePath.endsWith('.plan.md')) {
    
    try {
      // Try to parse the file as a project plan
      const plan = parseProjectPlan(filePath, content);
      
      if (plan) {
        console.log('[TOOL] Detected project plan:');
        console.log(`- Plan name: ${plan.name}`);
        console.log(`- Phases: ${plan.phases.length}`);
        
        // Generate visualizations
        const markdown = renderAsMarkdown(plan);
        const ganttChart = renderAsGanttChart(plan);
        
        console.log('[TOOL] Generated visualizations for the project plan');
        console.log('[TOOL] Use the "visualize-plan" command to view these visualizations');
      }
    } catch (error) {
      console.error(`[TOOL] Error processing file: ${error}`);
    }
  }
}

export function onSessionStart(sessionId: string) {
  console.log(`[TOOL] Plan visualizer initialized for session: ${sessionId}`);
  
  // Check for existing project plans to visualize
  setTimeout(() => {
    checkForExistingPlans();
  }, 2500); // Delay to ensure project files are loaded
}

export function onCommand(command: string, args: any[]) {
  if (command === 'visualize-plan') {
    console.log('[TOOL] Visualizing project plan...');
    
    const plan = args[0];
    const format = args[1] || 'markdown';
    
    if (!plan) {
      console.error('[TOOL] No plan provided for visualization');
      return { error: 'No plan provided for visualization' };
    }
    
    // Generate the visualization based on the requested format
    let visualization;
    switch (format) {
      case 'gantt':
        visualization = renderAsGanttChart(plan);
        break;
      case 'html':
        visualization = renderAsHTML(plan);
        break;
      case 'markdown':
      default:
        visualization = renderAsMarkdown(plan);
        break;
    }
    
    console.log(`[TOOL] Project plan visualization generated in ${format} format`);
    return { visualization, format };
  } else if (command === 'export-plan') {
    const plan = args[0];
    const format = args[1] || 'markdown';
    const filePath = args[2] || `project-plan.${format === 'html' ? 'html' : 'md'}`;
    
    if (!plan) {
      console.error('[TOOL] No plan provided for export');
      return { error: 'No plan provided for export' };
    }
    
    // Generate the visualization based on the requested format
    let content;
    switch (format) {
      case 'gantt':
        content = renderAsGanttChart(plan);
        break;
      case 'html':
        content = renderAsHTML(plan);
        break;
      case 'markdown':
      default:
        content = renderAsMarkdown(plan);
        break;
    }
    
    console.log(`[TOOL] Project plan exported to ${filePath} in ${format} format`);
    return { content, filePath, format };
  }
  
  return null;
}

/**
 * Parses a project plan from file content
 */
function parseProjectPlan(filePath: string, content: string): ProjectPlan | null {
  try {
    // Check if it's a JSON file
    if (filePath.endsWith('.json') || filePath.endsWith('.plan.json')) {
      try {
        const data = JSON.parse(content);
        
        // Check if it has the required properties of a project plan
        if (data.name && Array.isArray(data.phases)) {
          return data as ProjectPlan;
        }
      } catch (e) {
        // Not valid JSON or not a project plan, continue with other checks
      }
    }
    
    // For markdown files, try to extract plan information
    if (filePath.endsWith('.md') || filePath.endsWith('.plan.md')) {
      // This is a placeholder - in a real implementation, this would parse markdown
      // For now, we'll just check for some basic plan structure
      if (content.includes('# Project Plan') || 
          content.includes('## Phases') || 
          content.includes('| Task |')) {
        
        console.log('[TOOL] Detected markdown project plan, but parsing is not implemented');
        // Return null as we don't have actual parsing logic for markdown
        return null;
      }
    }
    
    return null;
  } catch (error) {
    console.error(`[TOOL] Error parsing project plan: ${error}`);
    return null;
  }
}

/**
 * Checks for existing project plans in the project
 */
function checkForExistingPlans() {
  console.log('[TOOL] Checking for existing project plans to visualize...');
  
  // This is a placeholder - in a real implementation, this would scan the filesystem
  // For now, we'll just log a message
  console.log('[TOOL] Recommendation: Use the "visualize-plan" command to generate visualizations for your project plans');
}
import { ProjectPlan, Phase, Task, calculateProgress } from './project-plan.js';

/**
 * Renders a project plan as Markdown
 */
export function renderAsMarkdown(plan: ProjectPlan): string {
  let markdown = `# ${plan.name}\n\n`;
  
  // Add description
  markdown += `${plan.description}\n\n`;
  
  // Add progress
  const progress = calculateProgress(plan);
  const progressPercentage = Math.round(progress * 100);
  markdown += `**Overall Progress:** ${progressPercentage}%\n\n`;
  
  // Add plan ID
  markdown += `**Plan ID:** ${plan.id}\n\n`;
  
  // Add creation and update dates
  markdown += `**Created:** ${formatDate(plan.createdAt)}\n`;
  markdown += `**Last Updated:** ${formatDate(plan.updatedAt)}\n\n`;
  
  // Add phases
  plan.phases.forEach(phase => {
    markdown += renderPhaseAsMarkdown(phase);
  });
  
  return markdown;
}

/**
 * Renders a phase as Markdown
 */
function renderPhaseAsMarkdown(phase: Phase): string {
  let markdown = `## ${phase.name}\n\n`;
  
  // Add phase ID
  markdown += `**Phase ID:** ${phase.id}\n\n`;
  
  // Add description
  markdown += `${phase.description}\n\n`;
  
  // Add dates if available
  if (phase.startDate && phase.endDate) {
    markdown += `**Timeline:** ${formatDate(phase.startDate)} to ${formatDate(phase.endDate)}\n\n`;
  }
  
  // Add tasks table
  markdown += "| Task | Task ID | Status | Est. Hours | Dependencies |\n";
  markdown += "|------|---------|--------|------------|-------------|\n";
  
  phase.tasks.forEach(task => {
    const statusEmoji = getStatusEmoji(task.status);
    const dependencies = task.dependencies.length > 0
      ? task.dependencies.join(', ')
      : 'None';
    
    markdown += `| ${task.name} | \`${task.id}\` | ${statusEmoji} ${task.status} | ${task.estimatedHours} | ${dependencies} |\n`;
  });
  
  markdown += '\n';
  
  return markdown;
}

/**
 * Get emoji for task status
 */
function getStatusEmoji(status: string): string {
  switch (status) {
    case 'not-started':
      return '⬜';
    case 'in-progress':
      return '🔶';
    case 'completed':
      return '✅';
    default:
      return '';
  }
}

/**
 * Format date as YYYY-MM-DD
 */
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Renders a project plan as a Gantt chart in Mermaid syntax
 * This can be rendered by Mermaid.js or other Markdown processors that support Mermaid
 */
export function renderAsGanttChart(plan: ProjectPlan): string {
  let gantt = '```mermaid\ngantt\n';
  gantt += `    title ${plan.name}\n`;
  gantt += '    dateFormat YYYY-MM-DD\n';
  gantt += '    axisFormat %Y-%m-%d\n\n';
  
  // Add sections for each phase
  plan.phases.forEach(phase => {
    gantt += `    section ${phase.name}\n`;
    
    // Add tasks
    phase.tasks.forEach(task => {
      const taskId = task.id.replace(/-/g, '_');
      const status = task.status === 'completed' ? 'done' : 
                    task.status === 'in-progress' ? 'active' : '';
      
      // If phase has dates, use them for the task
      if (phase.startDate && phase.endDate) {
        const startDate = formatDate(phase.startDate);
        
        // Calculate task duration based on estimated hours
        // Assuming 8 hours per day
        const durationDays = Math.max(1, Math.ceil(task.estimatedHours / 8));
        
        gantt += `    ${task.name} :${status}, ${taskId}, ${startDate}, ${durationDays}d\n`;
      } else {
        // If no dates, just show tasks in sequence
        gantt += `    ${task.name} :${status}, ${taskId}, 1d\n`;
      }
      
      // Add dependencies
      if (task.dependencies.length > 0) {
        task.dependencies.forEach(depId => {
          const depTaskId = depId.replace(/-/g, '_');
          gantt += `    ${taskId} after ${depTaskId}\n`;
        });
      }
    });
    
    gantt += '\n';
  });
  
  gantt += '```\n';
  
  return gantt;
}

/**
 * Renders a project plan as HTML
 */
export function renderAsHTML(plan: ProjectPlan): string {
  let html = `<!DOCTYPE html>
<html>
<head>
  <title>${plan.name}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    h1, h2 { color: #333; }
    .progress-bar { 
      height: 20px; 
      background-color: #f0f0f0; 
      border-radius: 10px; 
      margin: 10px 0; 
    }
    .progress-fill { 
      height: 100%; 
      background-color: #4CAF50; 
      border-radius: 10px; 
    }
    table { 
      border-collapse: collapse; 
      width: 100%; 
      margin: 20px 0; 
    }
    th, td { 
      border: 1px solid #ddd; 
      padding: 8px; 
      text-align: left; 
    }
    th { background-color: #f2f2f2; }
    .not-started { color: #999; }
    .in-progress { color: #FF9800; }
    .completed { color: #4CAF50; }
  </style>
</head>
<body>
  <h1>${plan.name}</h1>
  <p>${plan.description}</p>
  
  <h2>Overall Progress</h2>
  <div class="progress-bar">
    <div class="progress-fill" style="width: ${Math.round(calculateProgress(plan) * 100)}%;"></div>
  </div>
  <p><strong>Progress:</strong> ${Math.round(calculateProgress(plan) * 100)}%</p>
  <p><strong>Plan ID:</strong> <code>${plan.id}</code></p>
  <p><strong>Created:</strong> ${formatDate(plan.createdAt)}</p>
  <p><strong>Last Updated:</strong> ${formatDate(plan.updatedAt)}</p>
  
`;

  // Add phases
  plan.phases.forEach(phase => {
    html += `  <h2>${phase.name}</h2>
  <p><strong>Phase ID:</strong> <code>${phase.id}</code></p>
  <p>${phase.description}</p>
`;

    if (phase.startDate && phase.endDate) {
      html += `  <p><strong>Timeline:</strong> ${formatDate(phase.startDate)} to ${formatDate(phase.endDate)}</p>
`;
    }

    html += `  <table>
    <tr>
      <th>Task</th>
      <th>Task ID</th>
      <th>Status</th>
      <th>Est. Hours</th>
      <th>Dependencies</th>
    </tr>
`;

    phase.tasks.forEach(task => {
      const dependencies = task.dependencies.length > 0 
        ? task.dependencies.join(', ') 
        : 'None';
      
      html += `    <tr class="${task.status}">
      <td>${task.name}</td>
      <td><code>${task.id}</code></td>
      <td>${getStatusEmoji(task.status)} ${task.status}</td>
      <td>${task.estimatedHours}</td>
      <td>${dependencies}</td>
    </tr>
`;
    });

    html += `  </table>
`;
  });

  html += `</body>
</html>`;

  return html;
}
