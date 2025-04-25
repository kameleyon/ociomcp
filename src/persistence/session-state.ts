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