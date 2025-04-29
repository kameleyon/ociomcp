// Export all function tools
export * from './create_snapshot.js';
export * from './edit_block.js';

// Export default activation function
export function activate() {
  console.log("[TOOL] function tools index activated");
}

// Export event handlers
export function onFileWrite(event) {
  console.log(`[Functions] File write event detected: ${event.path}`);
  
  // Track file changes for potential snapshot creation
  try {
    // Add file to tracked changes
    if (!global.trackedChanges) {
      global.trackedChanges = [];
    }
    
    global.trackedChanges.push({
      path: event.path,
      timestamp: new Date().toISOString(),
      operation: 'write'
    });
    
    // If we've accumulated several changes, suggest creating a snapshot
    if (global.trackedChanges.length >= 5) {
      console.log('[Functions] Multiple file changes detected. Consider creating a snapshot.');
    }
  } catch (error) {
    console.error(`[Functions] Error tracking file changes: ${error.message}`);
  }
}

export function onSessionStart(session) {
  console.log(`[Functions] New session started: ${session.id}`);
  
  // Initialize function tools state
  try {
    // Create a session-specific state for function tools
    session.functionToolsState = {
      initialized: true,
      timestamp: new Date().toISOString(),
      snapshots: [],
      editHistory: []
    };
    
    // Reset tracked changes for new session
    global.trackedChanges = [];
    
    console.log('[Functions] Function tools initialized for session');
  } catch (error) {
    console.error(`[Functions] Error initializing session state: ${error.message}`);
  }
}

export function onCommand(command) {
  console.log(`[Functions] Command executed: ${command.name}`);
  
  // Handle specific commands for function tools
  try {
    switch (command.name) {
      case 'create_snapshot':
        // Create a snapshot using create_snapshot function
        const { create_snapshot } = require('./create_snapshot.js');
        create_snapshot({
          name: command.name || `Snapshot ${new Date().toLocaleString()}`,
          description: command.description || 'Automatically created snapshot',
          author: command.author || 'System',
          tags: command.tags || ['auto']
        }).then(result => {
          console.log(`[Functions] Snapshot created: ${result.snapshotId}`);
          
          // Store snapshot in session state if available
          if (global.currentSession && global.currentSession.functionToolsState) {
            global.currentSession.functionToolsState.snapshots.push(result.metadata);
          }
        }).catch(error => {
          console.error(`[Functions] Error creating snapshot: ${error.message}`);
        });
        break;
        
      case 'edit_block':
        // Edit a code block using edit_block function
        const { edit_block } = require('./edit_block.js');
        edit_block({
          code: command.code,
          language: command.language,
          edits: command.edits
        }).then(result => {
          console.log(`[Functions] Code block edited successfully`);
          
          // Track edit in session state if available
          if (global.currentSession && global.currentSession.functionToolsState) {
            global.currentSession.functionToolsState.editHistory.push({
              timestamp: new Date().toISOString(),
              language: command.language,
              success: result.success
            });
          }
        }).catch(error => {
          console.error(`[Functions] Error editing code block: ${error.message}`);
        });
        break;
        
      default:
        console.log(`[Functions] Unknown command: ${command.name}`);
    }
  } catch (error) {
    console.error(`[Functions] Error executing command: ${error.message}`);
  }
}