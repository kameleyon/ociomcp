// Auto-generated safe fallback for index

export function activate() {
    console.log("[TOOL] index activated (passive mode)");
}

// Define global state types
declare global {
  var persistedData: Record<string, any>;
  var persistenceOperations: Array<{
    operation: string;
    key: string;
    timestamp: string;
    sessionId: string;
  }>;
  var activeSessions: Record<string, {
    id: string;
    startTime: string;
    lastActive: string;
    data: Record<string, any>;
  }>;
}

export function onFileWrite(event: any) {
  console.log(`[Persistence] File write event detected: ${event.path}`);
  
  try {
    // Track persistence file changes
    if (event.path.includes('state') || event.path.includes('cache') || event.path.includes('storage')) {
      console.log(`[Persistence] State or storage file changed: ${event.path}`);
      
      // Initialize persistence operations tracking if needed
      if (!globalThis.persistenceOperations) {
        globalThis.persistenceOperations = [];
      }
      
      // Record the persistence operation
      globalThis.persistenceOperations.push({
        operation: 'file_write',
        key: event.path,
        timestamp: new Date().toISOString(),
        sessionId: globalThis.currentSessionId || 'unknown'
      });
      
      // Trigger state synchronization
      try {
        const { synchronizeState } = require('./session-state.js');
        
        // Determine the state key from the file path
        const pathParts = event.path.split('/');
        const fileName = pathParts[pathParts.length - 1];
        const stateKey = fileName.replace(/\.(json|state|cache)$/, '');
        
        // Synchronize state if we have content
        if (event.content) {
          let stateData;
          
          // Parse content if it's a string
          if (typeof event.content === 'string') {
            try {
              stateData = JSON.parse(event.content);
            } catch (parseError) {
              // If not valid JSON, use as-is
              stateData = event.content;
            }
          } else {
            stateData = event.content;
          }
          
          // Synchronize the state
          synchronizeState(stateKey, stateData);
          console.log(`[Persistence] Synchronized state for key: ${stateKey}`);
        }
      } catch (syncError: unknown) {
        const errorMessage = syncError instanceof Error ? syncError.message : String(syncError);
        console.error(`[Persistence] Error synchronizing state: ${errorMessage}`);
      }
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[Persistence] Error handling file write: ${errorMessage}`);
  }
}

export function onSessionStart(session: any) {
  console.log(`[Persistence] New session started: ${session.id}`);
  
  try {
    // Initialize persistence state
    session.persistedData = {};
    session.lastPersistenceOperation = null;
    
    // Store current session ID globally
    globalThis.currentSessionId = session.id;
    
    // Initialize global persistence state if needed
    if (!globalThis.persistedData) {
      globalThis.persistedData = {};
    }
    
    if (!globalThis.persistenceOperations) {
      globalThis.persistenceOperations = [];
    }
    
    if (!globalThis.activeSessions) {
      globalThis.activeSessions = {};
    }
    
    // Register the session
    globalThis.activeSessions[session.id] = {
      id: session.id,
      startTime: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      data: {}
    };
    
    // Record the session start operation
    globalThis.persistenceOperations.push({
      operation: 'session_start',
      key: session.id,
      timestamp: new Date().toISOString(),
      sessionId: session.id
    });
    
    // Load any previously persisted data for this session
    try {
      const { loadSessionState } = require('./session-state.js');
      const persistedState = loadSessionState(session.id);
      
      if (persistedState) {
        // Merge persisted state into session
        session.persistedData = persistedState;
        console.log(`[Persistence] Loaded persisted state for session: ${session.id}`);
        
        // Also store in global active session data
        globalThis.activeSessions[session.id].data = persistedState;
      }
    } catch (loadError: unknown) {
      const errorMessage = loadError instanceof Error ? loadError.message : String(loadError);
      console.error(`[Persistence] Error loading session state: ${errorMessage}`);
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[Persistence] Error initializing session: ${errorMessage}`);
  }
}

export function onCommand(command: any) {
  console.log(`[Persistence] Command executed: ${command.name}`);
  
  try {
    // Update last active timestamp for current session
    if (globalThis.currentSessionId && globalThis.activeSessions?.[globalThis.currentSessionId]) {
      globalThis.activeSessions[globalThis.currentSessionId].lastActive = new Date().toISOString();
    }
    
    // Handle persistence commands
    if (command.name.includes('session') || command.name.includes('state') || command.name.includes('storage')) {
      console.log(`[Persistence] Handling persistence command: ${command.name}`);
      
      // Import session state functions
      const {
        saveSessionState,
        loadSessionState,
        clearSessionState,
        listSessions
      } = require('./session-state.js');
      
      // Handle specific persistence commands
      switch (command.name) {
        case 'save_session_state':
          // Save session state
          if (command.sessionId && command.data) {
            const result = saveSessionState(command.sessionId, command.data);
            
            // Record the operation
            if (!globalThis.persistenceOperations) {
              globalThis.persistenceOperations = [];
            }
            
            globalThis.persistenceOperations.push({
              operation: 'save_state',
              key: command.sessionId,
              timestamp: new Date().toISOString(),
              sessionId: command.sessionId
            });
            
            return result;
          }
          break;
          
        case 'load_session_state':
          // Load session state
          if (command.sessionId) {
            const state = loadSessionState(command.sessionId);
            
            // Record the operation
            if (!globalThis.persistenceOperations) {
              globalThis.persistenceOperations = [];
            }
            
            globalThis.persistenceOperations.push({
              operation: 'load_state',
              key: command.sessionId,
              timestamp: new Date().toISOString(),
              sessionId: globalThis.currentSessionId || 'unknown'
            });
            
            return { state };
          }
          break;
          
        case 'clear_session_state':
          // Clear session state
          if (command.sessionId) {
            const result = clearSessionState(command.sessionId);
            
            // Record the operation
            if (!globalThis.persistenceOperations) {
              globalThis.persistenceOperations = [];
            }
            
            globalThis.persistenceOperations.push({
              operation: 'clear_state',
              key: command.sessionId,
              timestamp: new Date().toISOString(),
              sessionId: globalThis.currentSessionId || 'unknown'
            });
            
            return result;
          }
          break;
          
        case 'list_sessions':
          // List all sessions
          const sessions = listSessions();
          
          // Record the operation
          if (!globalThis.persistenceOperations) {
            globalThis.persistenceOperations = [];
          }
          
          globalThis.persistenceOperations.push({
            operation: 'list_sessions',
            key: 'all',
            timestamp: new Date().toISOString(),
            sessionId: globalThis.currentSessionId || 'unknown'
          });
          
          return { sessions };
          
        case 'get_active_sessions':
          // Get active sessions
          return {
            sessions: globalThis.activeSessions || {},
            count: Object.keys(globalThis.activeSessions || {}).length
          };
      }
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[Persistence] Error executing command: ${errorMessage}`);
    return { error: errorMessage };
  }
}

/**
 * Persistence Module
 * 
 * This module provides persistence functionality for the OptimusCode system.
 */

// Export session state
export * from './session-state.js';
