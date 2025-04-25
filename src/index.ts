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
        description: "Read the complete contents of a file from the file system or a URL.",
        inputSchema: zodToJsonSchema(Filesystem.ReadFileArgsSchema),
      },
      {
        name: "read_multiple_files",
        description: "Read the contents of multiple files simultaneously.",
        inputSchema: zodToJsonSchema(Filesystem.ReadMultipleFilesArgsSchema),
      },
      {
        name: "write_file",
        description: "Completely replace file contents.",
        inputSchema: zodToJsonSchema(Filesystem.WriteFileArgsSchema),
      },
      {
        name: "create_directory",
        description: "Create a new directory or ensure a directory exists.",
        inputSchema: zodToJsonSchema(Filesystem.CreateDirectoryArgsSchema),
      },
      {
        name: "list_directory",
        description: "Get a detailed listing of all files and directories in a specified path.",
        inputSchema: zodToJsonSchema(Filesystem.ListDirectoryArgsSchema),
      },
      {
        name: "move_file",
        description: "Move or rename files and directories.",
        inputSchema: zodToJsonSchema(Filesystem.MoveFileArgsSchema),
      },
      {
        name: "get_file_info",
        description: "Retrieve detailed metadata about a file or directory.",
        inputSchema: zodToJsonSchema(Filesystem.GetFileInfoArgsSchema),
      },
      {
        name: "search_files",
        description: "Finds files by name using a case-insensitive substring matching.",
        inputSchema: zodToJsonSchema(Filesystem.SearchFilesArgsSchema),
      },
      {
        name: "search_code",
        description: "Search for text/code patterns within file contents.",
        inputSchema: zodToJsonSchema(Filesystem.SearchCodeArgsSchema),
      },
      {
        name: "edit_block",
        description: "Apply surgical text replacements to files.",
        inputSchema: zodToJsonSchema(Filesystem.EditBlockArgsSchema),
      },
      
      // Command execution tools
      {
        name: "execute_command",
        description: "Execute a terminal command with timeout.",
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
        description: "List all running processes.",
        inputSchema: zodToJsonSchema(Command.ListProcessesArgsSchema),
      },
      {
        name: "kill_process",
        description: "Terminate a running process by PID.",
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
        return await Command.handleReadOutput(args);
      case "force_terminate":
        return await Command.handleForceTerminate(args);
      case "list_sessions":
        return await Command.handleListSessions();
      case "list_processes":
        return await Command.handleListProcesses();
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