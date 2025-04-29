// Auto-generated safe fallback for index

export function activate() {
    console.log("[TOOL] index activated (passive mode)");
}

/**
 * Called when a file is written
 * - Broadcasts file write events to all automated tools
 * - Can trigger code analysis, formatting, and other automated tasks
 * - Maintains a history of file changes for tools to reference
 */
export async function onFileWrite(event: { path: string; content: string }) {
  console.log(`[Automated Tools] File written: ${event.path}`);
  
  // Broadcast to relevant tools based on file type
  const extension = event.path.split('.').pop()?.toLowerCase();
  
  if (extension === 'ts' || extension === 'js') {
    try {
      // Check file size first
      const fs = require('fs');
      const stats = fs.statSync(event.path);
      const fileSizeInKB = stats.size / 1024;
      
      // Skip extremely large files to prevent memory issues
      if (fileSizeInKB > 5000) { // 5MB limit
        console.warn(`[Automated Tools] File too large to process automatically: ${event.path} (${fileSizeInKB.toFixed(2)}KB)`);
        return;
      }
      
      // Set a timeout for code analysis operations
      const analysisTimeout = setTimeout(() => {
        console.warn(`[Automated Tools] Analysis timeout for file: ${event.path}`);
      }, 30000); // 30 seconds timeout
      
      // Safely import and use the code-fixer
      try {
        const { handleAnalyzeCode } = require('./code-fixer.js');
        await Promise.race([
          handleAnalyzeCode({ path: event.path }),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Operation timed out')), 30000))
        ]);
      } catch (codeFixerError: unknown) {
        const errorMessage = codeFixerError instanceof Error ? codeFixerError.message : String(codeFixerError);
        console.error(`[Automated Tools] Error in code-fixer: ${errorMessage}`);
      } finally {
        clearTimeout(analysisTimeout);
      }
      
      // If file is large (over 100KB), analyze for potential splitting
      if (fileSizeInKB > 100) {
        try {
          const { handleAnalyzeFile } = require('./code-splitter.js');
          await Promise.race([
            handleAnalyzeFile({ path: event.path }),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Operation timed out')), 30000))
          ]);
          console.log(`[Automated Tools] Large file detected (${fileSizeInKB.toFixed(2)}KB), analyzing for potential splitting`);
        } catch (splitterError: unknown) {
          const errorMessage = splitterError instanceof Error ? splitterError.message : String(splitterError);
          console.error(`[Automated Tools] Error in code-splitter: ${errorMessage}`);
        }
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`[Automated Tools] Error processing TypeScript/JavaScript file: ${errorMessage}`);
    }
  }
  
  // Track file changes for plan updates
  try {
    // Store file change in global tracking object
    if (!globalThis.fileChanges) {
      globalThis.fileChanges = [];
    }
    
    // Add change to history
    globalThis.fileChanges.push({
      path: event.path,
      timestamp: new Date().toISOString(),
      contentLength: event.content.length
    });
    
    // If we have a plan creator, update the plan
    if (globalThis.currentPlan) {
      const { handleUpdatePlan } = require('./plan-creator.js');
      handleUpdatePlan({
        planId: globalThis.currentPlan.id,
        updates: [{
          type: 'file_change',
          path: event.path,
          timestamp: new Date().toISOString()
        }]
      });
      console.log(`[Automated Tools] Updated plan with file change: ${event.path}`);
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[Automated Tools] Error tracking file change: ${errorMessage}`);
  }
}

/**
 * Called when a new session starts
 * - Initializes all automated tools for the session
 * - Sets up session state and preferences
 * - Prepares automated assistance based on project context
 */
export function onSessionStart(session: { id: string; startTime: number }) {
  console.log(`[Automated Tools] New session started: ${session.id}`);
  
  try {
    // Initialize session state
    const sessionState = {
      id: session.id,
      startTime: session.startTime,
      tools: {
        autoContinue: { enabled: true, threshold: 0.85 },
        codeFixer: { enabled: true, autoFix: false },
        codeSplitter: { enabled: true, threshold: 100 * 1024 }, // 100KB
        pathEnforcer: { enabled: true, projectRoot: process.cwd() },
        planCreator: { enabled: true, autoUpdate: true },
        toneAdjuster: { enabled: true, defaultTone: 'professional' }
      },
      fileChanges: [],
      commandHistory: []
    };
    
    // Store session state globally
    if (!globalThis.sessions) {
      globalThis.sessions = {};
    }
    globalThis.sessions[session.id] = sessionState;
    
    // Load user preferences if available
    try {
      const fs = require('fs');
      const path = require('path');
      const prefsPath = path.join(process.cwd(), '.automated-tools-prefs.json');
      
      if (fs.existsSync(prefsPath)) {
        const prefs = JSON.parse(fs.readFileSync(prefsPath, 'utf8'));
        
        // Apply preferences to session state
        if (prefs.tools) {
          Object.assign(sessionState.tools, prefs.tools);
        }
        
        console.log(`[Automated Tools] Loaded user preferences`);
      }
    } catch (prefError: unknown) {
      const errorMessage = prefError instanceof Error ? prefError.message : String(prefError);
      console.error(`[Automated Tools] Error loading preferences: ${errorMessage}`);
    }
    
    // Prepare automated assistance based on project context
    try {
      // Create initial project plan
      const { handleCreatePlan } = require('./plan-creator.js');
      const planResult = handleCreatePlan({
        name: `Session ${session.id} Plan`,
        description: `Automated plan for session ${session.id}`,
        projectRoot: process.cwd()
      });
      
      if (planResult?.planId) {
        globalThis.currentPlan = {
          id: planResult.planId,
          name: planResult.name
        };
        console.log(`[Automated Tools] Created initial project plan: ${planResult.planId}`);
      }
    } catch (planError: unknown) {
      const errorMessage = planError instanceof Error ? planError.message : String(planError);
      console.error(`[Automated Tools] Error creating initial plan: ${errorMessage}`);
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[Automated Tools] Error initializing session: ${errorMessage}`);
  }
}

/**
 * Called when a command is executed
 * - Routes commands to appropriate automated tools
 * - Provides centralized command handling for all automated tools
 * - Maintains command history for context
 */
export async function onCommand(command: { name: string; args: any[] }) {
  console.log(`[Automated Tools] Command received: ${command.name}`);
  
  try {
    // Route commands to appropriate handlers with timeouts and error handling
    if (command.name.startsWith('code-fixer:')) {
      try {
        // Import handlers from code-fixer.js with error handling
        let handleFixCode, handleAnalyzeCode, handleFixProject;
        
        try {
          const codeFixerModule = require('./code-fixer.js');
          handleFixCode = codeFixerModule.handleFixCode;
          handleAnalyzeCode = codeFixerModule.handleAnalyzeCode;
          handleFixProject = codeFixerModule.handleFixProject;
        } catch (importError) {
          console.error(`[Automated Tools] Failed to import code-fixer.js: ${importError}`);
          return {
            error: `Failed to load code-fixer module: ${importError}`,
            content: [{ type: "text", text: "Error: Could not load code-fixer module" }]
          };
        }
        
        // Handle code fixer commands with timeouts
        const subCommand = command.name.split(':')[1];
        
        if (subCommand === 'fix' && command.args?.length > 0) {
          // Set a timeout for the operation
          const operationPromise = handleFixCode({ path: command.args[0] });
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Operation timed out')), 60000); // 60 seconds timeout
          });
          
          return await Promise.race([operationPromise, timeoutPromise]);
        } else if (subCommand === 'analyze' && command.args?.length > 0) {
          const operationPromise = handleAnalyzeCode({ path: command.args[0] });
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Operation timed out')), 60000); // 60 seconds timeout
          });
          
          return await Promise.race([operationPromise, timeoutPromise]);
        } else if (subCommand === 'fix-project' && command.args?.length > 0) {
          const operationPromise = handleFixProject({
            directory: command.args[0],
            recursive: command.args[1] !== false,
            fixTypes: command.args[2] || ['all']
          });
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Operation timed out')), 300000); // 5 minutes timeout for project
          });
          
          return await Promise.race([operationPromise, timeoutPromise]);
        }
      } catch (error) {
        console.error(`[Automated Tools] Error in code-fixer command: ${error}`);
        return {
          error: String(error),
          content: [{ type: "text", text: `Error executing code-fixer command: ${error}` }]
        };
      }
    }
    
    if (command.name.startsWith('code-splitter:')) {
      try {
        // Import handlers from code-splitter.js with error handling
        let handleAnalyzeFile, handleSplitFile;
        
        try {
          const codeSplitterModule = require('./code-splitter.js');
          handleAnalyzeFile = codeSplitterModule.handleAnalyzeFile;
          handleSplitFile = codeSplitterModule.handleSplitFile;
        } catch (importError) {
          console.error(`[Automated Tools] Failed to import code-splitter.js: ${importError}`);
          return {
            error: `Failed to load code-splitter module: ${importError}`,
            content: [{ type: "text", text: "Error: Could not load code-splitter module" }]
          };
        }
        
        // Handle code splitter commands with timeouts
        const subCommand = command.name.split(':')[1];
        
        if (subCommand === 'analyze' && command.args?.length > 0) {
          const operationPromise = handleAnalyzeFile({ path: command.args[0] });
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Operation timed out')), 60000); // 60 seconds timeout
          });
          
          return await Promise.race([operationPromise, timeoutPromise]);
        } else if (subCommand === 'split' && command.args?.length > 0) {
          const operationPromise = handleSplitFile({ path: command.args[0] });
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Operation timed out')), 120000); // 2 minutes timeout
          });
          
          return await Promise.race([operationPromise, timeoutPromise]);
        }
      } catch (error) {
        console.error(`[Automated Tools] Error in code-splitter command: ${error}`);
        return {
          error: String(error),
          content: [{ type: "text", text: `Error executing code-splitter command: ${error}` }]
        };
      }
    }
    
    // Handle other tool commands
    if (command.name.startsWith('plan:')) {
      const { handleCreatePlan, handleUpdatePlan, handleVisualizePlan } = require('./plan-creator.js');
      
      const subCommand = command.name.split(':')[1];
      if (subCommand === 'create') {
        return handleCreatePlan(command.args[0] || {});
      } else if (subCommand === 'update' && command.args?.length > 0) {
        return handleUpdatePlan(command.args[0]);
      } else if (subCommand === 'visualize' && command.args?.length > 0) {
        return handleVisualizePlan(command.args[0]);
      }
    }
    
    if (command.name.startsWith('tone:')) {
      const { handleAdjustTone, handleGetTonePreferences, handleSetTonePreferences } = require('./tone-adjuster.js');
      
      const subCommand = command.name.split(':')[1];
      if (subCommand === 'adjust' && command.args?.length > 0) {
        return handleAdjustTone(command.args[0]);
      } else if (subCommand === 'get') {
        return handleGetTonePreferences(command.args[0] || {});
      } else if (subCommand === 'set' && command.args?.length > 0) {
        return handleSetTonePreferences(command.args[0]);
      }
    }
    
    // Track command history
    if (!globalThis.commandHistory) {
      globalThis.commandHistory = [];
    }
    
    globalThis.commandHistory.push({
      name: command.name,
      timestamp: new Date().toISOString(),
      args: command.args ? JSON.stringify(command.args) : ''
    });
    
    // Limit history size
    if (globalThis.commandHistory.length > 100) {
      globalThis.commandHistory = globalThis.commandHistory.slice(-100);
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[Automated Tools] Error handling command: ${errorMessage}`);
    return { error: errorMessage };
  }
}

// Add type definitions for global state
declare global {
  var fileChanges: Array<{
    path: string;
    timestamp: string;
    contentLength: number;
  }>;
  var currentPlan: {
    id: string;
    name: string;
  } | null;
  var sessions: Record<string, any>;
  var commandHistory: Array<{
    name: string;
    timestamp: string;
    args: string;
  }>;
}
// Export all automated tools from a single entry point

// AutoContinue tool
export { 
  handleTrackContextSize,
  handleTriggerContinuation,
  TrackContextSizeSchema,
  TriggerContinuationSchema
} from './auto-continue.js';

// ChatInitiator tool
export {
  handleInitiateChat,
  handleRestoreSession,
  handleListSessions,
  InitiateChatSchema,
  RestoreSessionSchema,
  ListSessionsSchema
} from './chat-initiator.js';

// ToneAdjuster tool
export {
  handleAdjustTone,
  handleGetTonePreferences,
  handleSetTonePreferences,
  AdjustToneSchema,
  GetTonePreferencesSchema,
  SetTonePreferencesSchema
} from './tone-adjuster.js';

// PathEnforcer tool
export {
  handleValidatePath,
  handleGetProjectDirectory,
  handleSetProjectDirectory,
  ensurePathWithinProject,
  ensureDirectoryExists,
  ValidatePathSchema,
  GetProjectDirectorySchema,
  SetProjectDirectorySchema
} from './path-enforcer.js';

// CodeSplitter tool
export {
  handleAnalyzeFile,
  handleSplitFile,
  handleAnalyzeProject,
  AnalyzeFileSchema,
  SplitFileSchema,
  AnalyzeProjectSchema
} from './code-splitter.js';

// CodeFixer tool
export {
  handleFixCode,
  handleAnalyzeCode,
  handleFixProject,
  FixCodeSchema,
  AnalyzeCodeSchema,
  FixProjectSchema
} from './code-fixer.js';

// PlanCreator tool
export {
  handleCreatePlan,
  handleVisualizePlan,
  handleUpdatePlan,
  CreatePlanSchema,
  VisualizePlanSchema,
  UpdatePlanSchema
} from './plan-creator.js';

