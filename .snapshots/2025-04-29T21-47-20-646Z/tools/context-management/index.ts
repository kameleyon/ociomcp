// Auto-generated safe fallback for index

export function activate() {
    console.log("[TOOL] index activated (passive mode)");
}

// Define global state types
declare global {
  var contextSessions: Record<string, {
    id: string;
    contextSize: number;
    contextHistory: Array<{
      timestamp: string;
      size: number;
      messageCount: number;
      action: string;
    }>;
    maxContextSize: number;
    warningThreshold: number;
    continuationCount: number;
  }>;
  var currentSessionId: string;
}

export function onFileWrite(event: any) {
  console.log(`[ContextManagement] File write event detected: ${event.path}`);
  
  try {
    // Track context changes
    if (event.path.includes('context') || event.path.includes('state')) {
      console.log(`[ContextManagement] Context-related file changed: ${event.path}`);
      
      // Import context tracker
      const { ContextTracker } = require('./context-tracker.js');
      const tracker = ContextTracker.getInstance();
      
      // Add file change to context tracking
      if (globalThis.currentSessionId && globalThis.contextSessions?.[globalThis.currentSessionId]) {
        const session = globalThis.contextSessions[globalThis.currentSessionId];
        
        // Update context size based on file content
        if (event.content) {
          const contentSize = event.content.length;
          tracker.updateContextSize(globalThis.currentSessionId, contentSize);
          
          // Add to context history
          session.contextHistory.push({
            timestamp: new Date().toISOString(),
            size: session.contextSize,
            messageCount: session.contextHistory.length,
            action: `File changed: ${event.path}`
          });
          
          console.log(`[ContextManagement] Updated context size: ${session.contextSize} bytes`);
          
          // Check if we're approaching context limits
          if (session.contextSize > session.maxContextSize * (session.warningThreshold / 100)) {
            console.warn(`[ContextManagement] Context size warning: ${session.contextSize} bytes (${Math.round((session.contextSize / session.maxContextSize) * 100)}% of max)`);
            
            // Import chat transition for potential continuation
            const { prepareChatTransition } = require('./chat-transition.js');
            prepareChatTransition(globalThis.currentSessionId);
          }
        }
      }
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[ContextManagement] Error handling file write: ${errorMessage}`);
  }
}

export function onSessionStart(session: any) {
  console.log(`[ContextManagement] New session started: ${session.id}`);
  
  try {
    // Initialize context tracking
    if (!globalThis.contextSessions) {
      globalThis.contextSessions = {};
    }
    
    // Set current session ID
    globalThis.currentSessionId = session.id;
    
    // Create session context tracking
    globalThis.contextSessions[session.id] = {
      id: session.id,
      contextSize: 0,
      contextHistory: [],
      maxContextSize: session.maxContextSize || 100000, // Default value
      warningThreshold: session.warningThreshold || 85, // Default 85%
      continuationCount: 0
    };
    
    // Import context tracker
    const { ContextTracker } = require('./context-tracker.js');
    const tracker = ContextTracker.getInstance();
    
    // Initialize tracker for this session
    tracker.initializeSession(session.id, {
      maxContextSize: globalThis.contextSessions[session.id].maxContextSize,
      warningThreshold: globalThis.contextSessions[session.id].warningThreshold
    });
    
    // Add initial entry to context history
    globalThis.contextSessions[session.id].contextHistory.push({
      timestamp: new Date().toISOString(),
      size: 0,
      messageCount: 0,
      action: 'Session started'
    });
    
    console.log(`[ContextManagement] Context tracking initialized for session: ${session.id}`);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[ContextManagement] Error initializing session: ${errorMessage}`);
  }
}

export function onCommand(command: any) {
  console.log(`[ContextManagement] Command executed: ${command.name}`);
  
  try {
    // Handle context management commands
    if (command.name === 'track_context_size') {
      // Import context tracker
      const { ContextTracker } = require('./context-tracker.js');
      const tracker = ContextTracker.getInstance();
      
      // Get message size
      const message = command.args?.message || '';
      const messageSize = typeof message === 'string' ? message.length : JSON.stringify(message).length;
      
      console.log(`[ContextManagement] Tracking context size for message: ${message.substring(0, 50)}${message.length > 50 ? '...' : ''}`);
      
      // Update context size
      if (globalThis.currentSessionId) {
        const result = tracker.updateContextSize(globalThis.currentSessionId, messageSize);
        
        // Add to context history
        if (globalThis.contextSessions?.[globalThis.currentSessionId]) {
          globalThis.contextSessions[globalThis.currentSessionId].contextHistory.push({
            timestamp: new Date().toISOString(),
            size: result.newSize,
            messageCount: globalThis.contextSessions[globalThis.currentSessionId].contextHistory.length,
            action: 'Message added'
          });
        }
        
        return {
          sessionId: globalThis.currentSessionId,
          contextSize: result.newSize,
          maxContextSize: result.maxSize,
          sizeRatio: result.sizeRatio,
          warningThreshold: result.warningThreshold,
          approaching: result.approaching
        };
      }
    } else if (command.name === 'trigger_continuation') {
      // Import chat transition
      const { createChatTransition } = require('./chat-transition.js');
      
      // Get summary and state
      const summary = command.args?.summary || 'Chat continuation';
      const state = command.args?.state || {};
      
      console.log(`[ContextManagement] Triggering continuation with summary: ${summary.substring(0, 50)}${summary.length > 50 ? '...' : ''}`);
      
      // Create transition
      if (globalThis.currentSessionId && globalThis.contextSessions?.[globalThis.currentSessionId]) {
        // Increment continuation count
        globalThis.contextSessions[globalThis.currentSessionId].continuationCount++;
        
        // Add to context history
        globalThis.contextSessions[globalThis.currentSessionId].contextHistory.push({
          timestamp: new Date().toISOString(),
          size: globalThis.contextSessions[globalThis.currentSessionId].contextSize,
          messageCount: globalThis.contextSessions[globalThis.currentSessionId].contextHistory.length,
          action: 'Chat continuation triggered'
        });
        
        // Create the transition
        const result = createChatTransition(globalThis.currentSessionId, summary, state);
        
        // Reset context size after continuation
        const { ContextTracker } = require('./context-tracker.js');
        const tracker = ContextTracker.getInstance();
        tracker.resetContextSize(globalThis.currentSessionId);
        
        return {
          transitionId: result.transitionId,
          summary: result.summary,
          continuationCount: globalThis.contextSessions[globalThis.currentSessionId].continuationCount
        };
      }
    } else if (command.name === 'get_context_stats') {
      // Return context statistics for the current session
      if (globalThis.currentSessionId && globalThis.contextSessions?.[globalThis.currentSessionId]) {
        const session = globalThis.contextSessions[globalThis.currentSessionId];
        
        return {
          sessionId: session.id,
          contextSize: session.contextSize,
          maxContextSize: session.maxContextSize,
          sizeRatio: session.contextSize / session.maxContextSize,
          messageCount: session.contextHistory.length,
          continuationCount: session.continuationCount,
          history: session.contextHistory.slice(-10) // Return last 10 history entries
        };
      }
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[ContextManagement] Error executing command: ${errorMessage}`);
    return { error: errorMessage };
  }
}

/**
 * Context Management Module
 * 
 * Exports all context management related components
 */

// Export chat transition components
export * from './chat-transition.js';

// Export context tracker components
export * from './context-tracker.js';
