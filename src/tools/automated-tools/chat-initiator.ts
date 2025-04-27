// Auto-generated safe fallback for chat-initiator

export function activate() {
    console.log("[TOOL] chat-initiator activated (passive mode)");
}

export function onFileWrite() { /* no-op */ }
export function onSessionStart() { /* no-op */ }
export function onCommand() { /* no-op */ }
import { z } from 'zod';
import { SessionState } from '../context-management/chat-transition.js';
import { SessionStateManager } from '../persistence/session-state.js';

// Define schemas for ChatInitiator tool
export const InitiateChatSchema = z.object({
  previousSessionId: z.string().optional(),
  projectContext: z.object({
    name: z.string(),
    description: z.string().optional(),
    activeFiles: z.array(z.string()).optional(),
    currentTask: z.string().optional(),
  }),
  hotkeyUsed: z.boolean().optional(),
});

export const RestoreSessionSchema = z.object({
  sessionId: z.string(),
});

export const ListSessionsSchema = z.object({
  limit: z.number().optional(),
  sortBy: z.enum(['date', 'name']).optional(),
});

// Create instance of session state manager
const sessionStateManager = new SessionStateManager();

/**
 * Initiates a new chat session while maintaining project context
 */
export async function handleInitiateChat(args: any) {
  if (args && typeof args === 'object' && 'projectContext' in args && typeof args.projectContext === 'object') {
    const { projectContext, previousSessionId, hotkeyUsed } = args;
    
    // Generate a unique session ID
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    
    // Create a state object for the new session
    const state: SessionState = {
      projectState: {
        name: projectContext.name,
        description: projectContext.description || '',
        previousSessionId: previousSessionId || null,
        hotkeyInitiated: hotkeyUsed || false,
      },
      activeFiles: Array.isArray(projectContext.activeFiles) ? projectContext.activeFiles : [],
      activeSessions: [],
      currentTask: projectContext.currentTask || 'New session',
      contextSummary: `New chat session for project: ${projectContext.name}`,
    };
    
    // If we have a previous session ID, try to load its state and merge
    if (previousSessionId) {
      try {
        const previousState = await sessionStateManager.loadState(previousSessionId);
        if (previousState) {
          // Merge the previous state with the new state
          state.projectState = {
            ...previousState.projectState,
            ...state.projectState,
          };
          
          // If no active files were provided, use the ones from the previous state
          if (!projectContext.activeFiles && previousState.activeFiles.length > 0) {
            state.activeFiles = previousState.activeFiles;
          }
          
          // If no current task was provided, use the one from the previous state
          if (!projectContext.currentTask && previousState.currentTask) {
            state.currentTask = previousState.currentTask;
          }
          
          // Update the context summary to include information from the previous session
          state.contextSummary = `Continuation of session ${previousSessionId}. ${state.contextSummary}`;
        }
      } catch (error) {
        console.error(`Error loading previous session state: ${error}`);
      }
    }
    
    // Save the new state
    await sessionStateManager.initialize();
    await sessionStateManager.saveState(sessionId, state);
    
    // Create a welcome message for the new session
    const welcomeMessage = createWelcomeMessage(state, sessionId, hotkeyUsed || false);
    
    return {
      content: [{
        type: "text",
        text: welcomeMessage
      }],
    };
  }
  
  return {
    content: [{ type: "text", text: "Error: Invalid arguments for initiate_chat" }],
    isError: true,
  };
}

/**
 * Restores a previous chat session
 */
export async function handleRestoreSession(args: any) {
  if (args && typeof args === 'object' && 'sessionId' in args && typeof args.sessionId === 'string') {
    const { sessionId } = args;
    
    // Load the state for the specified session
    await sessionStateManager.initialize();
    const state = await sessionStateManager.loadState(sessionId);
    
    if (state) {
      // Create a welcome back message
      const welcomeBackMessage = createWelcomeBackMessage(state, sessionId);
      
      return {
        content: [{
          type: "text",
          text: welcomeBackMessage
        }],
      };
    }
    
    return {
      content: [{ type: "text", text: `Error: Session with ID ${sessionId} not found` }],
      isError: true,
    };
  }
  
  return {
    content: [{ type: "text", text: "Error: Invalid arguments for restore_session" }],
    isError: true,
  };
}

/**
 * Lists available chat sessions
 */
export async function handleListSessions(args: any) {
  const limit = args && typeof args === 'object' && 'limit' in args ? args.limit : 10;
  const sortBy = args && typeof args === 'object' && 'sortBy' in args ? args.sortBy : 'date';
  
  // Initialize the session state manager
  await sessionStateManager.initialize();
  
  // Get the list of available sessions
  const sessionIds = await sessionStateManager.listSessions();
  
  // Load the state for each session
  const sessions = await Promise.all(
    sessionIds.map(async (id) => {
      const state = await sessionStateManager.loadState(id);
      return {
        id,
        state,
        timestamp: parseInt(id.split('-')[1], 10) || 0,
      };
    })
  );
  
  // Sort the sessions
  if (sortBy === 'date') {
    sessions.sort((a, b) => b.timestamp - a.timestamp);
  } else {
    sessions.sort((a, b) => {
      const nameA = a.state?.projectState?.name || '';
      const nameB = b.state?.projectState?.name || '';
      return nameA.localeCompare(nameB);
    });
  }
  
  // Limit the number of sessions
  const limitedSessions = sessions.slice(0, limit);
  
  // Format the sessions for display
  const formattedSessions = limitedSessions.map((session) => {
    const { id, state, timestamp } = session;
    const date = new Date(timestamp).toLocaleString();
    const name = state?.projectState?.name || 'Unknown';
    const task = state?.currentTask || 'Unknown';
    
    return {
      id,
      name,
      task,
      date,
      activeFiles: state?.activeFiles || [],
    };
  });
  
  return {
    content: [{
      type: "text",
      text: JSON.stringify(formattedSessions, null, 2)
    }],
  };
}

/**
 * Creates a welcome message for a new chat session
 */
function createWelcomeMessage(state: SessionState, sessionId: string, hotkeyUsed: boolean): string {
  const { projectState, activeFiles, currentTask } = state;
  
  // Create a welcome message
  return `
NEW CHAT SESSION INITIATED${hotkeyUsed ? ' (via hotkey)' : ''}

SESSION ID: ${sessionId}

PROJECT: ${projectState.name}
${projectState.description ? `DESCRIPTION: ${projectState.description}` : ''}

CURRENT TASK:
${currentTask}

ACTIVE FILES:
${activeFiles.length > 0 ? activeFiles.map(file => `- ${file}`).join('\n') : 'None'}

This new chat session has been created with the context from your project.
You can continue working on your current task seamlessly.
`;
}

/**
 * Creates a welcome back message for a restored chat session
 */
function createWelcomeBackMessage(state: SessionState, sessionId: string): string {
  const { projectState, activeFiles, currentTask, contextSummary } = state;
  
  // Create a welcome back message
  return `
CHAT SESSION RESTORED

SESSION ID: ${sessionId}

PROJECT: ${projectState.name}
${projectState.description ? `DESCRIPTION: ${projectState.description}` : ''}

CURRENT TASK:
${currentTask}

ACTIVE FILES:
${activeFiles.length > 0 ? activeFiles.map(file => `- ${file}`).join('\n') : 'None'}

CONTEXT SUMMARY:
${contextSummary}

Your previous chat session has been restored.
You can continue working on your current task seamlessly.
`;
}

