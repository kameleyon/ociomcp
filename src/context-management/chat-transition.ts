import { ContextTracker } from './context-tracker.js';

export interface SessionState {
  projectState: any;
  activeFiles: string[];
  activeSessions: number[];
  currentTask: string;
  contextSummary: string;
}

export class ChatTransitionManager {
  private contextTracker: ContextTracker;
  
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