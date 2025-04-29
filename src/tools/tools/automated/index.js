// Export all automated tools
export * from './BaseAutomatedTool.js';
export * from './AutoContinue.js';
export * from './CodeFormatter.js';
export * from './ImportFixer.js';
export * from './TypeScriptErrorFixer.js';

// Export default activation function
export function activate() {
  console.log("[TOOL] automated tools index activated");
}

// Export event handlers
export function onFileWrite(event) {
  console.log(`[Automated] File write event detected: ${event.path}`);
  
  // Check if the file is a TypeScript or JavaScript file
  if (event.path.endsWith('.ts') || event.path.endsWith('.js')) {
    // Import and use the appropriate tools based on file type
    try {
      // For TypeScript files, check for errors
      if (event.path.endsWith('.ts')) {
        const TypeScriptErrorFixer = require('./TypeScriptErrorFixer.js').TypeScriptErrorFixer;
        const fixer = new TypeScriptErrorFixer();
        fixer.onFileCreated(event.path);
      }
      
      // For JavaScript files, fix imports
      if (event.path.endsWith('.js')) {
        const ImportFixer = require('./ImportFixer.js').ImportFixer;
        const fixer = new ImportFixer();
        fixer.onFileChanged(event.path);
      }
      
      // Format code for all supported file types
      const CodeFormatter = require('./CodeFormatter.js').CodeFormatter;
      const formatter = new CodeFormatter();
      formatter.process({
        currentMessage: null,
        formatRequested: true,
        filePath: event.path
      });
    } catch (error) {
      console.error(`[Automated] Error processing file write event: ${error.message}`);
    }
  }
}

export function onSessionStart(session) {
  console.log(`[Automated] New session started: ${session.id}`);
  
  // Initialize session-specific automated tools
  try {
    // Set up AutoContinue for context monitoring
    const AutoContinue = require('./AutoContinue.js').AutoContinue;
    const autoContinue = new AutoContinue();
    
    // Store tool instances in session state for later use
    session.automatedTools = {
      autoContinue,
      initialized: true,
      timestamp: new Date().toISOString()
    };
    
    // Start monitoring context size
    autoContinue.process({
      conversation: session.conversation || [],
      currentMessage: session.currentMessage || '',
      state: session.state || {}
    });
  } catch (error) {
    console.error(`[Automated] Error initializing session tools: ${error.message}`);
  }
}

export function onCommand(command) {
  console.log(`[Automated] Command executed: ${command.name}`);
  
  // Handle specific commands for automated tools
  try {
    switch (command.name) {
      case 'format':
        // Format code using CodeFormatter
        const CodeFormatter = require('./CodeFormatter.js').CodeFormatter;
        const formatter = new CodeFormatter();
        formatter.formatCode(command.code, command.language, command.options);
        break;
        
      case 'fix-imports':
        // Fix imports using ImportFixer
        const ImportFixer = require('./ImportFixer.js').ImportFixer;
        const importFixer = new ImportFixer();
        importFixer.run({
          directory: command.directory || './dist',
          dryRun: command.dryRun || false
        });
        break;
        
      case 'fix-typescript':
        // Fix TypeScript errors
        const TypeScriptErrorFixer = require('./TypeScriptErrorFixer.js').TypeScriptErrorFixer;
        const tsFixer = new TypeScriptErrorFixer();
        tsFixer.run({
          targetFiles: command.files || [],
          fixAll: command.fixAll !== undefined ? command.fixAll : true,
          dryRun: command.dryRun || false
        });
        break;
        
      default:
        console.log(`[Automated] Unknown command: ${command.name}`);
    }
  } catch (error) {
    console.error(`[Automated] Error executing command: ${error.message}`);
  }
}