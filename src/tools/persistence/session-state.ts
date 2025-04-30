// Auto-generated safe fallback for session-state

import { SessionState } from '../context-management/chat-transition.js';
import * as fs from 'fs/promises';
import * as path from 'path';

export class SessionStateManager {
  private stateDirectory: string;
  
  constructor(stateDirectory: string = '.optimuscode-state') {
    this.stateDirectory = stateDirectory;
  }
  
  /**
   * Initialize the state directory
   */
  public async initialize(): Promise<void> {
    try {
      await fs.mkdir(this.stateDirectory, { recursive: true });
    } catch (error) {
      console.error(`Failed to create state directory: ${error}`);
      throw error;
    }
  }
  
  /**
   * Save session state to a file
   */
  public async saveState(sessionId: string, state: SessionState): Promise<void> {
    try {
      const filePath = path.join(this.stateDirectory, `${sessionId}.json`);
      await fs.writeFile(filePath, JSON.stringify(state, null, 2), 'utf8');
    } catch (error) {
      console.error(`Failed to save session state: ${error}`);
      throw error;
    }
  }
  
  /**
   * Load session state from a file
   */
  public async loadState(sessionId: string): Promise<SessionState | null> {
    try {
      const filePath = path.join(this.stateDirectory, `${sessionId}.json`);
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data) as SessionState;
    } catch (error) {
      // If file doesn't exist, return null instead of throwing
      if ((error as any).code === 'ENOENT') {
        return null;
      }
      console.error(`Failed to load session state: ${error}`);
      throw error;
    }
  }
  
  /**
   * List all available session states
   */
  public async listSessions(): Promise<string[]> {
    try {
      const files = await fs.readdir(this.stateDirectory);
      return files
        .filter((file: string) => file.endsWith('.json'))
        .map((file: string) => file.replace('.json', ''));
    } catch (error) {
      console.error(`Failed to list sessions: ${error}`);
      return [];
    }
  }
  
  /**
   * Delete a session state
   */
  public async deleteState(sessionId: string): Promise<boolean> {
    try {
      const filePath = path.join(this.stateDirectory, `${sessionId}.json`);
      await fs.unlink(filePath);
      return true;
    } catch (error) {
      console.error(`Failed to delete session state: ${error}`);
      return false;
    }
  }
}

// Singleton instance for session state management
const sessionStateManager = new SessionStateManager();

export function activate() {
    console.log("[TOOL] session-state activated (passive mode)");
}

export async function onFileWrite(filePath?: string) {
  if (!filePath) return;
  
  try {
    // Check if the file is a session state file
    if (filePath.includes('.optimuscode-state') && filePath.endsWith('.json')) {
      console.log(`[session-state] Detected change in session state file: ${filePath}`);
      // In a real implementation, we might validate the state file
    }
  } catch (err) {
    console.error(`[session-state] Error processing file change: ${err}`);
  }
}

export async function onSessionStart() {
  console.log('[session-state] Session started');
  
  try {
    // Initialize the state directory
    await sessionStateManager.initialize();
    
    // List existing sessions
    const sessions = await sessionStateManager.listSessions();
    console.log(`[session-state] Loaded ${sessions.length} existing sessions`);
    
    return {
      initialized: true,
      sessionsLoaded: sessions.length,
      message: 'Session state manager initialized'
    };
  } catch (err) {
    console.error(`[session-state] Error initializing: ${err}`);
    return {
      initialized: false,
      message: `Error initializing session state manager: ${err}`
    };
  }
}

export async function onCommand(command?: { name: string; args?: any[] }) {
  const name = command?.name;
  const args = command?.args || [];
  
  switch (name) {
    case 'session-state:save': {
      const sessionId = args[0];
      const state = args[1];
      
      if (!sessionId || !state) {
        return { success: false, message: 'Session ID and state are required' };
      }
      
      try {
        await sessionStateManager.saveState(sessionId, state);
        console.log(`[session-state] Saved session state for ${sessionId}`);
        return { success: true, message: `Saved session state for ${sessionId}` };
      } catch (err) {
        console.error(`[session-state] Error saving session state: ${err}`);
        return { success: false, message: `Error saving session state: ${err}` };
      }
    }
    case 'session-state:load': {
      const sessionId = args[0];
      
      if (!sessionId) {
        return { success: false, message: 'Session ID is required' };
      }
      
      try {
        const state = await sessionStateManager.loadState(sessionId);
        if (state) {
          console.log(`[session-state] Loaded session state for ${sessionId}`);
          return { success: true, state };
        } else {
          return { success: false, message: `Session state not found for ${sessionId}` };
        }
      } catch (err) {
        console.error(`[session-state] Error loading session state: ${err}`);
        return { success: false, message: `Error loading session state: ${err}` };
      }
    }
    case 'session-state:list': {
      try {
        const sessions = await sessionStateManager.listSessions();
        console.log(`[session-state] Listed sessions: ${sessions.join(', ')}`);
        return { success: true, sessions };
      } catch (err) {
        console.error(`[session-state] Error listing sessions: ${err}`);
        return { success: false, message: `Error listing sessions: ${err}` };
      }
    }
    default:
      console.log(`[session-state] Unknown command: ${name}`);
      return { message: `Unknown command: ${name}` };
  }
}
