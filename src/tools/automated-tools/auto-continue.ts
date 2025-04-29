// Auto-generated safe fallback for auto-continue

export function activate() {
    console.log("[TOOL] auto-continue activated (passive mode)");
}

export function onFileWrite(event: { path: string; content: string }) {
  console.log("[TOOL] auto-continue detected file write.");
  handleTrackContextSize({ message: "File written." })
    .then((result) => console.log("[TOOL] Context size updated after file write:", result))
    .catch((err) => console.error("[TOOL] Failed to track context size after file write:", err));
}

export function onSessionStart(session: { id: string; startTime: number }) {
  console.log("[TOOL] auto-continue detected session start.");
  handleTrackContextSize({ message: "Session started." })
    .then((result) => console.log("[TOOL] Context size updated after session start:", result))
    .catch((err) => console.error("[TOOL] Failed to track context size after session start:", err));
}

export function onCommand (command: { name: string; args: any[] }) {
  console.log(`[TOOL] auto-continue detected command: ${command || "unknown"}`);
  handleTrackContextSize({ message: `Command issued: ${command || "unknown"}` })
    .then((result) => console.log("[TOOL] Context size updated after command:", result))
    .catch((err) => console.error("[TOOL] Failed to track context size after command:", err));
}

import { z } from 'zod';
import { ChatTransitionManager, SessionState } from '../context-management/chat-transition.js';
import { SessionStateManager } from '../persistence/session-state.js';

// Define schemas for AutoContinue tool
export const TrackContextSizeSchema = z.object({
  message: z.string(),
  apiKey: z.string().optional(),
});

export const TriggerContinuationSchema = z.object({
  state: z.any(),
  summary: z.string(),
});

// Create instances of our managers
const chatTransitionManager = new ChatTransitionManager();
const sessionStateManager = new SessionStateManager();

/**
 * Enhanced version of track_context_size that uses API integration for more accurate token counting
 * when an API key is provided
 */
export async function handleTrackContextSize(args: any) {
  if (args && typeof args === 'object' && 'message' in args && typeof args.message === 'string') {
    // If API key is provided, use it for more accurate token counting
    if ('apiKey' in args && typeof args.apiKey === 'string') {
      try {
        // This would normally call an API to get accurate token count
        // For now, we'll just use our simple estimation method
        console.log(`API key provided: ${args.apiKey.substring(0, 5)}...`);
        // In a real implementation, we would use the API key to get a more accurate token count
      } catch (error) {
        console.error(`Error using API for token counting: ${error}`);
        // Fall back to simple estimation if API call fails
      }
    }

    // Track the message using our existing method
    chatTransitionManager.trackMessage(args.message);
    
    // Return detailed information about the context size
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          currentTokenCount: chatTransitionManager.getTokenCount(),
          shouldTransition: chatTransitionManager.shouldCreateNewChat(),
          message: `Context size tracked. Current token count: ${chatTransitionManager.getTokenCount()}. Should transition: ${chatTransitionManager.shouldCreateNewChat()}`
        }, null, 2)
      }],
    };
  }
  
  return {
    content: [{ type: "text", text: "Error: Invalid arguments for track_context_size" }],
    isError: true,
  };
}

/**
 * Enhanced version of trigger_continuation that provides better summaries and next steps
 */
export async function handleTriggerContinuation(args: any) {
  if (args && typeof args === 'object' && 'state' in args && 'summary' in args && typeof args.summary === 'string') {
    // Create a more detailed state object
    const state: SessionState = {
      projectState: args.state,
      activeFiles: Array.isArray(args.state.activeFiles) ? args.state.activeFiles : [],
      activeSessions: Array.isArray(args.state.activeSessions) ? args.state.activeSessions : [],
      currentTask: args.summary,
      contextSummary: args.summary
    };
    
    // Generate a unique session ID with timestamp and random string
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    
    // Save the state
    await sessionStateManager.initialize();
    await sessionStateManager.saveState(sessionId, state);
    
    // Create a more detailed transition message
    const transitionMessage = createEnhancedTransitionMessage(state, sessionId);
    
    return {
      content: [{
        type: "text",
        text: transitionMessage
      }],
    };
  }
  
  return {
    content: [{ type: "text", text: "Error: Invalid arguments for trigger_continuation" }],
    isError: true,
  };
}

/**
 * Creates an enhanced transition message with more details and next steps
 */
function createEnhancedTransitionMessage(state: SessionState, sessionId: string): string {
  // Extract key information from the state
  const { currentTask, activeFiles, activeSessions, contextSummary } = state;
  
  // Format active files
  const formattedFiles = activeFiles.length > 0 ? activeFiles.join('\n- ') : '';
  
  // Create a detailed transition message
  return `
CONTEXT TRANSITION: Creating new chat due to context size limits.

SESSION ID: ${sessionId}

CURRENT TASK:
${currentTask}

ACTIVE FILES:
${formattedFiles ? `- ${formattedFiles}` : 'None'}

ACTIVE TERMINAL SESSIONS:
${activeSessions.length > 0 ? activeSessions.join(', ') : 'None'}

CONTEXT SUMMARY:
${contextSummary}

NEXT STEPS:
1. Start a new chat session
2. Use the session ID above to restore context
3. Continue working on the current task
`;
}

