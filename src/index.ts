#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { CallToolRequestSchema, ListToolsRequestSchema, ListResourcesRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { zodToJsonSchema } from "zod-to-json-schema";
import { z } from "zod";
import { ChatTransitionManager, SessionState } from "./context-management/chat-transition.js";
import { SessionStateManager } from "./persistence/session-state.js";
import { FilteredStdioServerTransport } from "./custom-stdio.js";
import * as ProjectPlanning from "./project-planning/index.js";
import * as UIGeneration from "./ui-generation/index.js";
import * as ProjectOrganization from "./project-organization/index.js";
import * as AdvancedFeatures from "./advanced-features/index.js";
import * as Filesystem from "./filesystem/index.js";
import * as Command from "./command/index.js";
import * as Documentation from "./documentation/index.js";
import * as AutomatedTools from "./automated-tools/index.js";
import * as ApiDependent from "./api-dependent/index.js";
import { PageType, PageSection } from './ui-generation/page-templates';
import { ComponentStyle } from './ui-generation/component-templates';

// Define schemas for our new tools
const TrackContextSizeSchema = z.object({
  message: z.string(),
});

const TriggerContinuationSchema = z.object({
  state: z.any(),
  summary: z.string(),
});

// Project planning schemas
const GenerateProjectPlanSchema = z.object({
  name: z.string(),
  description: z.string(),
  type: z.enum(['web-application', 'mobile-app', 'api-service', 'desktop-application', 'custom']),
  features: z.array(z.string()),
  timeline: z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }).optional(),
  teamSize: z.number().optional(),
  customPhases: z.array(z.string()).optional(),
});

const VisualizeProjectPlanSchema = z.object({
  planId: z.string(),
  format: z.enum(['markdown', 'gantt', 'html']).default('markdown'),
});

const UpdateTaskStatusSchema = z.object({
  planId: z.string(),
  phaseId: z.string(),
  taskId: z.string(),
  status: z.enum(['not-started', 'in-progress', 'completed']),
});


// UI Generation schemas
const GenerateComponentSchema = z.object({
  name: z.string(),
  style: z.enum([
    'basic',
    'card',
    'form',
    'list',
    'table',
    'hero',
    'feature',
    'pricing',
    'cta',
    'footer'
  ]).optional(),
  props: z.array(z.string()).optional(),
  description: z.string().optional(),
});

const GeneratePageSchema = z.object({
  name: z.string(),
  type: z.enum([
    'landing',
    'dashboard',
    'auth',
    'profile',
    'settings',
    'documentation',
    'blog',
    'product',
    'checkout',
    'error'
  ]).optional(),
  sections: z.array(
    z.object({
      type: z.string(),
      name: z.string(),
      props: z.record(z.any()).optional(),
    })
  ).optional(),
  meta: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.array(z.string()).optional(),
  }).optional(),
});

const GenerateProjectSchema = z.object({
  name: z.string(),
  type: z.enum([
    'landing-page',
    'marketing-site',
    'dashboard',
    'e-commerce',
    'blog',
    'documentation',
    'portfolio',
    'saas'
  ]).optional(),
  framework: z.enum([
    'react-vite',
    'next-js',
    'remix',
    'gatsby'
  ]).optional(),
  styling: z.enum([
    'tailwind',
    'styled-components',
    'emotion',
    'css-modules'
  ]).optional(),
  database: z.enum([
    'supabase',
    'firebase',
    'mongodb',
    'postgresql',
    'mysql',
    'none'
  ]).optional(),
  pages: z.array(
    z.object({
      name: z.string(),
      type: z.string(),
      path: z.string(),
    })
  ).optional(),
});

// Project Organization schemas
const GenerateDirectoryStructureSchema = z.object({
  name: z.string(),
  type: z.enum([
    'web-app',
    'mobile-app',
    'api',
    'library',
    'monorepo',
    'desktop-app',
    'static-site',
    'documentation',
  ]),
  framework: z.enum([
    'react',
    'next-js',
    'vue',
    'angular',
    'express',
    'nest-js',
    'django',
    'flask',
    'spring-boot',
    'laravel',
    'electron',
    'react-native',
    'flutter',
  ]).optional(),
  features: z.array(z.string()).optional(),
});

const GenerateDocumentationSchema = z.object({
  projectName: z.string(),
  projectDescription: z.string(),
  type: z.enum([
    'readme',
    'api-docs',
    'user-guide',
    'developer-guide',
    'contributing',
    'code-of-conduct',
    'changelog',
  ]),
  format: z.enum(['markdown', 'html', 'asciidoc', 'rst']).optional(),
});

const AnalyzeFileSizesSchema = z.object({
  files: z.array(z.object({
    path: z.string(),
    size: z.number(),
    lastModified: z.string().optional(),
  })),
});

// Advanced Features schemas
const TrackVersionChangesSchema = z.object({
  path: z.string(),
  type: z.enum(['add', 'modify', 'delete', 'rename']),
  content: z.string().optional(),
  oldContent: z.string().optional(),
  oldPath: z.string().optional(),
  message: z.string().optional(),
});

const RevertToSnapshotSchema = z.object({
  snapshotId: z.string(),
});

const CreateSnapshotSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  author: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

const GenerateContentSchema = z.object({
  type: z.enum(['legal', 'seo', 'marketing', 'documentation', 'email', 'social']),
  subtype: z.string(),
  company: z.object({
    name: z.string(),
    description: z.string(),
    website: z.string().optional(),
    industry: z.string().optional(),
  }).optional(),
  website: z.object({
    url: z.string(),
    title: z.string(),
    description: z.string(),
    keywords: z.array(z.string()).optional(),
  }).optional(),
  legal: z.object({
    jurisdiction: z.string().optional(),
    effectiveDate: z.string().optional(),
    contactEmail: z.string().optional(),
  }).optional(),
});

const GenerateTranslationsSchema = z.object({
  keys: z.array(z.string()),
  locales: z.array(z.string()),
  baseTranslations: z.record(z.string()).optional(),
});

// Create instances of our managers
const chatTransitionManager = new ChatTransitionManager();
const sessionStateManager = new SessionStateManager();

// Store for project plans
const projectPlans = new Map<string, ProjectPlanning.ProjectPlan>();

// Store for generated UI components
const uiComponents = new Map<string, string>();

// Store for generated UI pages
const uiPages = new Map<string, string>();

// Store for generated UI projects
const uiProjects = new Map<string, UIGeneration.ProjectFile[]>();

// Store for version control state
const versionControlState = AdvancedFeatures.createVersionControlState();

// Store for generated content
const generatedContent = new Map<string, string>();

// Store for translation files
const translationFiles = new Map<string, Record<string, Record<string, string>>>();

// Memory and performance systems have been removed to streamline the app generation process

// Initialize the server
const server = new Server({
  name: "optimuscode",
  version: "0.1.0",
}, {
  capabilities: {
    tools: {},
    resources: {}, 
    prompts: {},
  },
});

// Add handler for resources/list method
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [],
  };
});

// Add handler for tools/list method
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      // Filesystem tools
      {
        name: "read_file",
        description: "Read the complete contents of a file from the file system or a URL. When reading from the file system, only works within allowed directories. Can fetch content from URLs when isUrl parameter is set to true. Handles text files normally and image files are returned as viewable images. Recognized image types: PNG, JPEG, GIF, WebP.",
        inputSchema: zodToJsonSchema(Filesystem.ReadFileArgsSchema),
      },
      {
        name: "read_multiple_files",
        description: "Read the contents of multiple files simultaneously. Each file's content is returned with its path as a reference. Handles text files normally and renders images as viewable content. Recognized image types: PNG, JPEG, GIF, WebP. Failed reads for individual files won't stop the entire operation. Only works within allowed directories.",
        inputSchema: zodToJsonSchema(Filesystem.ReadMultipleFilesArgsSchema),
      },
      {
        name: "write_file",
        description: "Completely replace file contents. Best for large changes (>20% of file) or when edit_block fails. Use with caution as it will overwrite existing files. Only works within allowed directories.",
        inputSchema: zodToJsonSchema(Filesystem.WriteFileArgsSchema),
      },
      {
        name: "create_directory",
        description: "Create a new directory or ensure a directory exists. Can create multiple nested directories in one operation. Only works within allowed directories.",
        inputSchema: zodToJsonSchema(Filesystem.CreateDirectoryArgsSchema),
      },
      {
        name: "list_directory",
        description: "Get a detailed listing of all files and directories in a specified path. Results distinguish between files and directories with [FILE] and [DIR] prefixes. Only works within allowed directories.",
        inputSchema: zodToJsonSchema(Filesystem.ListDirectoryArgsSchema),
      },
      {
        name: "move_file",
        description: "Move or rename files and directories. Can move files between directories and rename them in a single operation. Both source and destination must be within allowed directories.",
        inputSchema: zodToJsonSchema(Filesystem.MoveFileArgsSchema),
      },
      {
        name: "get_file_info",
        description: "Retrieve detailed metadata about a file or directory including size, creation time, last modified time, permissions, and type. Only works within allowed directories.",
        inputSchema: zodToJsonSchema(Filesystem.GetFileInfoArgsSchema),
      },
      {
        name: "search_files",
        description: "Finds files by name using a case-insensitive substring matching. Searches through all subdirectories from the starting path. Has a default timeout of 30 seconds which can be customized using the timeoutMs parameter. Only searches within allowed directories.",
        inputSchema: zodToJsonSchema(Filesystem.SearchFilesArgsSchema),
      },
      {
        name: "search_code",
        description: "Search for text/code patterns within file contents using ripgrep. Fast and powerful search similar to VS Code search functionality. Supports regular expressions, file pattern filtering, and context lines. Has a default timeout of 30 seconds which can be customized. Only searches within allowed directories.",
        inputSchema: zodToJsonSchema(Filesystem.SearchCodeArgsSchema),
      },
      {
        name: "edit_block",
        description: "Apply surgical text replacements to files. Best for small changes (<20% of file size). Call repeatedly to change multiple blocks. Will verify changes after application. Format: filepath <<<<<<< SEARCH content to find ======= new content >>>>>>> REPLACE",
        inputSchema: zodToJsonSchema(Filesystem.EditBlockArgsSchema),
      },
      
      // Command execution tools
      {
        name: "execute_command",
        description: "Execute a terminal command with timeout. Command will continue running in background if it doesn't complete within timeout.",
        inputSchema: zodToJsonSchema(Command.ExecuteCommandArgsSchema),
      },
      {
        name: "read_output",
        description: "Read new output from a running terminal session.",
        inputSchema: zodToJsonSchema(Command.ReadOutputArgsSchema),
      },
      {
        name: "force_terminate",
        description: "Force terminate a running terminal session.",
        inputSchema: zodToJsonSchema(Command.ForceTerminateArgsSchema),
      },
      {
        name: "list_sessions",
        description: "List all active terminal sessions.",
        inputSchema: zodToJsonSchema(Command.ListSessionsArgsSchema),
      },
      {
        name: "list_processes",
        description: "List all running processes. Returns process information including PID, command name, CPU usage, and memory usage.",
        inputSchema: zodToJsonSchema(Command.ListProcessesArgsSchema),
      },
      {
        name: "kill_process",
        description: "Terminate a running process by PID. Use with caution as this will forcefully terminate the specified process.",
        inputSchema: zodToJsonSchema(Command.KillProcessArgsSchema),
      },
      
      // Context management tools
      {
        name: "track_context_size",
        description: "Track the current context size and determine if a new chat should be created",
        inputSchema: zodToJsonSchema(TrackContextSizeSchema),
      },
      {
        name: "trigger_continuation",
        description: "Trigger a new chat with the current context preserved",
        inputSchema: zodToJsonSchema(TriggerContinuationSchema),
      },
      // Project planning tools
      {
        name: "generate_project_plan",
        description: "Generate a detailed project plan with phases and tasks based on requirements",
        inputSchema: zodToJsonSchema(GenerateProjectPlanSchema),
      },
      {
        name: "visualize_project_plan",
        description: "Visualize a project plan in different formats (markdown, gantt chart, HTML)",
        inputSchema: zodToJsonSchema(VisualizeProjectPlanSchema),
      },
      {
        name: "update_task_status",
        description: "Update the status of a task in a project plan",
        inputSchema: zodToJsonSchema(UpdateTaskStatusSchema),
      },
      // UI Generation tools
      {
        name: "generate_component",
        description: "Generate a UI component with the specified options",
        inputSchema: zodToJsonSchema(GenerateComponentSchema),
      },
      {
        name: "generate_page",
        description: "Generate a UI page with the specified options",
        inputSchema: zodToJsonSchema(GeneratePageSchema),
      },
      {
        name: "generate_project",
        description: "Generate a complete UI project with the specified options",
        inputSchema: zodToJsonSchema(GenerateProjectSchema),
      },
      {
        name: "IconManager",
        description: "Uses appropriate icon libraries instead of emojis",
        inputSchema: zodToJsonSchema(UIGeneration.GenerateIconManagerSchema),
      },
      {
        name: "TokenExtractor",
        description: "Extracts design tokens from design systems or mockups",
        inputSchema: zodToJsonSchema(UIGeneration.GenerateTokenExtractorSchema),
      },
      {
        name: "DiffApplier",
        description: "Applies code changes in patch/diff format to files",
        inputSchema: zodToJsonSchema(Filesystem.ApplyDiffSchema),
      },
      {
        name: "CodeFormatter",
        description: "Formats code according to project style guidelines",
        inputSchema: zodToJsonSchema(Filesystem.FormatCodeSchema),
      },
      {
        name: "MarkdownTool",
        description: "Converts content between formats (HTML, plain text) to Markdown and ensures consistent Markdown styling",
        inputSchema: zodToJsonSchema(Filesystem.ConvertToMarkdownSchema),
      },
      {
        name: "FormatMarkdown",
        description: "Formats Markdown files according to specified style guidelines",
        inputSchema: zodToJsonSchema(Filesystem.FormatMarkdownSchema),
      },
      {
        name: "DependencyTool",
        description: "Adds, removes, and updates project dependencies",
        inputSchema: zodToJsonSchema(Filesystem.AddDependencySchema),
      },
      {
        name: "GitTool",
        description: "Manages version control operations",
        inputSchema: zodToJsonSchema(Filesystem.GitInitSchema),
      },
      // Project Organization tools
      {
        name: "generate_directory_structure",
        description: "Generate a directory structure for a project",
        inputSchema: zodToJsonSchema(GenerateDirectoryStructureSchema),
      },
      {
        name: "generate_documentation",
        description: "Generate documentation for a project",
        inputSchema: zodToJsonSchema(GenerateDocumentationSchema),
      },
      {
        name: "analyze_file_sizes",
        description: "Analyze file sizes and suggest optimizations",
        inputSchema: zodToJsonSchema(AnalyzeFileSizesSchema),
      },
      // Documentation tools
      {
        name: "APIDocsTool",
        description: "Automatically generates API documentation from code",
        inputSchema: zodToJsonSchema(Documentation.GenerateAPIDocsSchema),
      },
      {
        name: "DocsUpdater",
        description: "Keeps documentation in sync with code changes",
        inputSchema: zodToJsonSchema(Documentation.UpdateDocsSchema),
      },
      {
        name: "CMSConnector",
        description: "Integrates with headless CMS platforms",
        inputSchema: zodToJsonSchema(Documentation.CMSConnectorSchema),
      },
      
      // Advanced Features tools
      {
        name: "track_version_changes",
        description: "Track changes to files for version control",
        inputSchema: zodToJsonSchema(TrackVersionChangesSchema),
      },
      {
        name: "create_snapshot",
        description: "Create a snapshot of the current state",
        inputSchema: zodToJsonSchema(CreateSnapshotSchema),
      },
      {
        name: "revert_to_snapshot",
        description: "Revert to a previous snapshot",
        inputSchema: zodToJsonSchema(RevertToSnapshotSchema),
      },
      {
        name: "generate_content",
        description: "Generate content for various purposes",
        inputSchema: zodToJsonSchema(GenerateContentSchema),
      },
      {
        name: "generate_translations",
        description: "Generate translation files for multiple locales",
        inputSchema: zodToJsonSchema(GenerateTranslationsSchema),
      }
    ],
  };
});

// Add handler for tools/call method
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;
    
    switch (name) {
      // Filesystem tools
      case "read_file":
        return await Filesystem.handleReadFile(args);
      case "read_multiple_files":
        return await Filesystem.handleReadMultipleFiles(args);
      case "write_file":
        return await Filesystem.handleWriteFile(args);
      case "create_directory":
        return await Filesystem.handleCreateDirectory(args);
      case "list_directory":
        return await Filesystem.handleListDirectory(args);
      case "move_file":
        return await Filesystem.handleMoveFile(args);
      case "get_file_info":
        return await Filesystem.handleGetFileInfo(args);
      case "search_files":
        return await Filesystem.handleSearchFiles(args);
      case "search_code":
        return await Filesystem.handleSearchCode(args);
      case "edit_block":
        return await Filesystem.handleEditBlock(args);
        
      // Command execution tools
      case "execute_command":
        return await Command.handleExecuteCommand(args);
      case "read_output":
        return await Command.handleGetOutput(args);
      case "force_terminate":
        return await Command.handleKillSession(args);
      case "list_sessions":
        return await Command.handleListSessions({});
      case "list_processes":
        return await Command.handleListProcesses({});
      case "kill_process":
        return await Command.handleKillProcess(args);
        
      // Context management tools
      case "track_context_size":
        if (args && typeof args === 'object' && 'message' in args && typeof args.message === 'string') {
          chatTransitionManager.trackMessage(args.message);
          return {
            content: [{
              type: "text",
              text: `Context size tracked. Current token count: ${chatTransitionManager.getTokenCount()}. Should transition: ${chatTransitionManager.shouldCreateNewChat()}`
            }],
          };
        }
        return {
          content: [{ type: "text", text: "Error: Invalid arguments for track_context_size" }],
          isError: true,
        };
        
      case "trigger_continuation":
        if (args && typeof args === 'object' && 'state' in args && 'summary' in args && typeof args.summary === 'string') {
          const state: SessionState = {
            projectState: args.state,
            activeFiles: [],
            activeSessions: [],
            currentTask: args.summary,
            contextSummary: args.summary
          };
          
          // Generate a unique session ID
          const sessionId = `session-${Date.now()}`;
          
          // Save the state
          await sessionStateManager.initialize();
          await sessionStateManager.saveState(sessionId, state);
          
          return {
            content: [{
              type: "text",
              text: chatTransitionManager.createTransitionMessage(state) + `\nSession ID: ${sessionId}`
            }],
          };
        }
        
        return {
          content: [{ type: "text", text: "Error: Invalid arguments for trigger_continuation" }],
          isError: true,
        };
        
      case "generate_project_plan":
        if (args && typeof args === 'object') {
          try {
            // Create the requirements object with type assertions
            const requirements: ProjectPlanning.ProjectRequirements = {
              name: String(args.name),
              description: String(args.description),
              type: args.type as ProjectPlanning.ProjectType,
              features: Array.isArray(args.features) ? args.features.map(String) : [],
              teamSize: typeof args.teamSize === 'number' ? args.teamSize : undefined,
              customPhases: Array.isArray(args.customPhases) ? args.customPhases.map(String) : undefined,
            };
            
            // Handle timeline separately
            if (args.timeline && typeof args.timeline === 'object') {
              const timeline: { startDate?: Date; endDate?: Date } = {};
              
              // Use type assertion with any to bypass TypeScript's type checking
              const timelineObj = args.timeline as any;
              
              if (timelineObj.startDate && typeof timelineObj.startDate === 'string') {
                timeline.startDate = new Date(timelineObj.startDate);
              }
              
              if (timelineObj.endDate && typeof timelineObj.endDate === 'string') {
                timeline.endDate = new Date(timelineObj.endDate);
              }
              
              if (timeline.startDate || timeline.endDate) {
                requirements.timeline = timeline;
              }
            }
            
            // Generate the project plan
            const plan = ProjectPlanning.generateProjectPlan(requirements);
            
            // Store the plan
            projectPlans.set(plan.id, plan);
            
            // Generate markdown representation
            const markdown = ProjectPlanning.renderAsMarkdown(plan);
            
            return {
              content: [
                {
                  type: "text",
                  text: `Project plan generated successfully with ID: ${plan.id}\n\n${markdown}`
                }
              ],
            };
          } catch (error) {
            return {
              content: [{ type: "text", text: `Error generating project plan: ${error}` }],
              isError: true,
            };
          }
        }
        return {
          content: [{ type: "text", text: "Error: Invalid arguments for generate_project_plan" }],
          isError: true,
        };
        
      case "visualize_project_plan":
        if (args && typeof args === 'object' && 'planId' in args) {
          const planId = args.planId as string;
          const format = args.format as 'markdown' | 'gantt' | 'html' || 'markdown';
          
          // Get the plan
          const plan = projectPlans.get(planId);
          if (!plan) {
            return {
              content: [{ type: "text", text: `Error: Project plan with ID ${planId} not found` }],
              isError: true,
            };
          }
          
          // Visualize the plan
          let visualization = '';
          switch (format) {
            case 'gantt':
              visualization = ProjectPlanning.renderAsGanttChart(plan);
              break;
            case 'html':
              visualization = ProjectPlanning.renderAsHTML(plan);
              break;
            case 'markdown':
            default:
              visualization = ProjectPlanning.renderAsMarkdown(plan);
              break;
          }
          
          return {
            content: [{ type: "text", text: visualization }],
          };
        }
        return {
          content: [{ type: "text", text: "Error: Invalid arguments for visualize_project_plan" }],
          isError: true,
        };
        
      case "update_task_status":
        if (args && typeof args === 'object' && 'planId' in args && 'phaseId' in args && 'taskId' in args && 'status' in args) {
          const planId = args.planId as string;
          let phaseId = args.phaseId as string;
          let taskId = args.taskId as string;
          const status = args.status as 'not-started' | 'in-progress' | 'completed';
          
          // Get the plan
          const plan = projectPlans.get(planId);
          if (!plan) {
            return {
              content: [{ type: "text", text: `Error: Project plan with ID ${planId} not found` }],
              isError: true,
            };
          }
          
          try {
            // Handle different phase ID formats
            // Convert formats like "phase_1" or "Planning" to "phase-1"
            let phaseIndex = -1;
            
            // Try exact match first
            phaseIndex = plan.phases.findIndex(phase => phase.id === phaseId);
            
            // Try by phase number (phase_1 -> phase-1)
            if (phaseIndex === -1 && phaseId.includes('_')) {
              const phaseNumber = phaseId.split('_').pop();
              if (phaseNumber) {
                const alternativeId = `phase-${phaseNumber}`;
                phaseIndex = plan.phases.findIndex(phase => phase.id === alternativeId);
                if (phaseIndex !== -1) {
                  phaseId = alternativeId;
                }
              }
            }
            
            // Try by phase name
            if (phaseIndex === -1) {
              phaseIndex = plan.phases.findIndex(phase =>
                phase.name.toLowerCase() === phaseId.toLowerCase() ||
                phase.name.toLowerCase().replace(/\s+/g, '-') === phaseId.toLowerCase()
              );
              if (phaseIndex !== -1) {
                phaseId = plan.phases[phaseIndex].id;
              }
            }
            
            // Try by index (1 -> phase-1)
            if (phaseIndex === -1 && /^\d+$/.test(phaseId)) {
              const index = parseInt(phaseId) - 1;
              if (index >= 0 && index < plan.phases.length) {
                phaseIndex = index;
                phaseId = plan.phases[index].id;
              }
            }
            
            if (phaseIndex === -1) {
              // If we still can't find the phase, list available phases
              const availablePhases = plan.phases.map(phase =>
                `${phase.id} (${phase.name})`
              ).join(', ');
              
              return {
                content: [{
                  type: "text",
                  text: `Error: Phase with ID "${phaseId}" not found. Available phases: ${availablePhases}`
                }],
                isError: true,
              };
            }
            
            // Handle different task ID formats
            // Convert formats like "task_phase_1_1" to "task-phase-1-1"
            let taskIndex = -1;
            const phase = plan.phases[phaseIndex];
            
            // Try exact match first
            taskIndex = phase.tasks.findIndex(task => task.id === taskId);
            
            // Try by task name
            if (taskIndex === -1) {
              taskIndex = phase.tasks.findIndex(task =>
                task.name.toLowerCase() === taskId.toLowerCase() ||
                task.name.toLowerCase().replace(/\s+/g, '-') === taskId.toLowerCase()
              );
              if (taskIndex !== -1) {
                taskId = phase.tasks[taskIndex].id;
              }
            }
            
            // Try by index (1 -> first task in phase)
            if (taskIndex === -1 && /^\d+$/.test(taskId)) {
              const index = parseInt(taskId) - 1;
              if (index >= 0 && index < phase.tasks.length) {
                taskIndex = index;
                taskId = phase.tasks[index].id;
              }
            }
            
            if (taskIndex === -1) {
              // If we still can't find the task, list available tasks
              const availableTasks = phase.tasks.map(task =>
                `${task.id} (${task.name})`
              ).join(', ');
              
              return {
                content: [{
                  type: "text",
                  text: `Error: Task with ID "${taskId}" not found in phase "${phase.name}". Available tasks: ${availableTasks}`
                }],
                isError: true,
              };
            }
            
            // Update the task status
            const updatedPlan = ProjectPlanning.updateTaskStatus(plan, phaseId, taskId, status);
            
            // Store the updated plan
            projectPlans.set(planId, updatedPlan);
            
            // Calculate progress
            const progress = ProjectPlanning.calculateProgress(updatedPlan);
            const progressPercentage = Math.round(progress * 100);
            
            return {
              content: [{
                type: "text",
                text: `Task "${phase.tasks[taskIndex].name}" status updated to "${status}". Overall project progress: ${progressPercentage}%`
              }],
            };
          } catch (error) {
            return {
              content: [{ type: "text", text: `Error updating task status: ${error}` }],
              isError: true,
            };
          }
        }
        return {
          content: [{ type: "text", text: "Error: Invalid arguments for update_task_status" }],
          isError: true,
        };
      
      // Documentation tools
      case "APIDocsTool":
        return await Documentation.handleGenerateAPIDocs(args);
      
      case "DocsUpdater":
        return await Documentation.handleUpdateDocs(args);
      
      case "CMSConnector":
        return await Documentation.handleConnectCMS(args);
      
      case "DiffApplier":
        return await Filesystem.handleApplyDiff(args);
        
      case "CodeFormatter":
        return await Filesystem.handleFormatCode(args);
        
      case "MarkdownTool":
        return await Filesystem.handleConvertToMarkdown(args);
        
      case "DependencyTool":
        return await Filesystem.handleAddDependency(args);
        
      case "GitTool":
        return await Filesystem.handleGitInit(args);
        
      case "generate_directory_structure":
        if (args && typeof args === 'object' && 'name' in args && 'type' in args) {
          const name = args.name as string;
          const type = args.type as ProjectOrganization.ProjectType;
          const framework = args.framework as ProjectOrganization.ProjectFramework | undefined;
          const features = args.features as string[] || [];
          
          try {
            // Generate the directory structure
            const options: ProjectOrganization.DirectoryStructureOptions = {
              name,
              type,
              framework,
              features,
            };
            
            const structure = ProjectOrganization.generateDirectoryStructure(options);
            
            // Generate markdown representation
            const markdown = ProjectOrganization.directoryStructureToMarkdown(structure);
            
            return {
              content: [{
                type: "text",
                text: `Directory structure generated for ${name}:\n\n\`\`\`\n${markdown}\n\`\`\``
              }],
            };
          } catch (error) {
            return {
              content: [{ type: "text", text: `Error generating directory structure: ${error}` }],
              isError: true,
            };
          }
        }
        return {
          content: [{ type: "text", text: "Error: Invalid arguments for generate_directory_structure" }],
          isError: true,
        };
        
      default:
        return {
          content: [{ type: "text", text: `Error: Unknown tool: ${name}` }],
          isError: true,
        };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [{ type: "text", text: `Error: ${errorMessage}` }],
      isError: true,
    };
  }
});

// Main function to run the server
async function runServer() {
  try {
    console.error("Initializing OptimusCode MCP server...");
    
    // Initialize the session state manager
    await sessionStateManager.initialize();
    
    // Use our custom FilteredStdioServerTransport
    const transport = new FilteredStdioServerTransport();
    
    console.error("Connecting server...");
    await server.connect(transport);
    console.error("Server connected successfully");
  } catch (error) {
    console.error(`FATAL ERROR: ${error}`);
    process.exit(1);
  }
}

// Run the server
runServer().catch((error) => {
  console.error(`RUNTIME ERROR: ${error}`);
  process.exit(1);
});
