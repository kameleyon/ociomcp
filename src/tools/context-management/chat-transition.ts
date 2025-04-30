// Auto-generated safe fallback for chat-transition
import { ContextTracker } from './context-tracker.js';

export interface SessionState {
  projectState: any;
  activeFiles: string[];
  activeSessions: number[];
  currentTask: string;
  contextSummary: string;
}

export class ChatTransitionManager {
  public contextTracker: ContextTracker;
  
  constructor(tokenLimit: number = 100000, thresholdPercentage: number = 80) {
    this.contextTracker = new ContextTracker(tokenLimit, thresholdPercentage);
  }
  
  public trackMessage(message: string): void {
    // Very simple token estimation (can be improved with actual tokenizer)
    const estimatedTokens = Math.ceil(message.length / 4);
    this.contextTracker.addTokens(estimatedTokens);
  }
  
  public shouldCreateNewChat(): boolean {
    return this.contextTracker.shouldTransition();
  }
  
  public getTokenCount(): number {
    return this.contextTracker.getTokenCount();
  }
  
  public serializeState(state: SessionState): string {
    return JSON.stringify(state);
  }
  
  public deserializeState(serialized: string): SessionState {
    return JSON.parse(serialized);
  }
  
  public createTransitionMessage(state: SessionState): string {
    return `
    CONTEXT TRANSITION: Creating new chat due to context size limits.
    
    Current task: ${state.currentTask}
    Active files: ${state.activeFiles.join(', ')}
    Active terminal sessions: ${state.activeSessions.join(', ')}
    
    Context summary: ${state.contextSummary}
    `;
  }
}

// Singleton instance for chat transition management
const transitionManager = new ChatTransitionManager();

export function activate() {
    console.log("[TOOL] chat-transition activated (passive mode)");
}

export async function onFileWrite(filePath?: string) {
  // Track file changes that might affect context
  const fs = require('fs/promises');
  const path = require('path');
  const stateFile = path.join(process.cwd(), 'chat-transition-state.json');
  
  try {
    // Read current state or create default
    let state: SessionState = {
      projectState: {},
      activeFiles: [],
      activeSessions: [],
      currentTask: "Unknown",
      contextSummary: ""
    };
    
    try {
      const data = await fs.readFile(stateFile, 'utf-8');
      state = JSON.parse(data);
    } catch (err) {
      // File doesn't exist yet, use default state
    }
    
    // Update active files if a file path was provided
    if (filePath && !state.activeFiles.includes(filePath)) {
      state.activeFiles.push(filePath);
      // Keep only the 10 most recent files
      if (state.activeFiles.length > 10) {
        state.activeFiles.shift();
      }
    }
    
    // Save updated state
    await fs.writeFile(stateFile, JSON.stringify(state, null, 2), 'utf-8');
    console.log('[chat-transition] State updated with file:', filePath);
  } catch (err) {
    console.error('[chat-transition] Failed to update state:', err);
  }
}

export function onSessionStart() {
  // Reset the context tracker for a new session
  transitionManager.contextTracker.reset();
  console.log('[chat-transition] Session started, context reset');
  
  // Return initial state information
  return {
    tokenCount: 0,
    shouldTransition: false,
    message: 'Chat transition manager initialized'
  };
}

export function onCommand(command?: { name: string; args?: any[] }) {
  const name = command?.name;
  const args = command?.args || [];
  
  switch (name) {
    case 'chat-transition:check': {
      const shouldTransition = transitionManager.shouldCreateNewChat();
      console.log('[chat-transition] Transition check:', shouldTransition ? 'Should transition' : 'No transition needed');
      return { shouldTransition, tokenCount: transitionManager.getTokenCount() };
    }
    case 'chat-transition:track-message': {
      const message = args[0] || '';
      transitionManager.trackMessage(message);
      console.log('[chat-transition] Message tracked, token count:', transitionManager.getTokenCount());
      return { tokenCount: transitionManager.getTokenCount() };
    }
    default:
      console.log('[chat-transition] Unknown command:', name);
      return { error: 'Unknown command' };
  }
}
