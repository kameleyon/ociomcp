// Auto-generated safe fallback for index

export function activate() {
    console.log("[TOOL] tools index activated (passive mode)");
}

export function onFileWrite(event: any) {
  console.log(`[Tools] File write event detected: ${event.path}`);
  // Forward events to sub-tools
  if (event.path.includes('automated/')) {
    // Forward to automated tools
    try {
      const automatedTools = require('./automated/index.js');
      if (typeof automatedTools.onFileWrite === 'function') {
        automatedTools.onFileWrite(event);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`[Tools] Error forwarding file write event to automated tools: ${errorMessage}`);
    }
  } else if (event.path.includes('functions/')) {
    // Forward to function tools
    try {
      const functionTools = require('./functions/index.js');
      if (typeof functionTools.onFileWrite === 'function') {
        functionTools.onFileWrite(event);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`[Tools] Error forwarding file write event to function tools: ${errorMessage}`);
    }
  }
}

export function onSessionStart(session: any) {
  console.log(`[Tools] New session started: ${session.id}`);
  // Initialize tools state and forward to sub-tools
  session.toolsState = {
    initialized: true,
    timestamp: new Date().toISOString()
  };
  
  // Forward to automated tools
  try {
    const automatedTools = require('./automated/index.js');
    if (typeof automatedTools.onSessionStart === 'function') {
      automatedTools.onSessionStart(session);
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[Tools] Error forwarding session start to automated tools: ${errorMessage}`);
  }
  
  // Forward to function tools
  try {
    const functionTools = require('./functions/index.js');
    if (typeof functionTools.onSessionStart === 'function') {
      functionTools.onSessionStart(session);
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[Tools] Error forwarding session start to function tools: ${errorMessage}`);
  }
}

export function onCommand(command: any) {
  console.log(`[Tools] Command executed: ${command.name}`);
  // Forward to relevant sub-tools
  
  // Forward to automated tools
  try {
    const automatedTools = require('./automated/index.js');
    if (typeof automatedTools.onCommand === 'function') {
      automatedTools.onCommand(command);
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[Tools] Error forwarding command to automated tools: ${errorMessage}`);
  }
  
  // Forward to function tools
  try {
    const functionTools = require('./functions/index.js');
    if (typeof functionTools.onCommand === 'function') {
      functionTools.onCommand(command);
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[Tools] Error forwarding command to function tools: ${errorMessage}`);
  }
}

/**
 * Tools Module
 * 
 * This module serves as a container for various tool categories.
 */

// Export automated tools
export * as automated from './automated/index.js';

// Export function tools
export * as functions from './functions/index.js';
