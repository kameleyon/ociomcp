import { initializeConfiguredTools, getConfiguredTools, getTool } from './configured-tools';

/**
 * Bootstrap module for initializing the application with configured tools
 */

export async function bootstrap() {
  console.log('Starting application bootstrap...');
  
  // Initialize all configured tools
  initializeConfiguredTools();
  
  // Get all configured tools
  const tools = getConfiguredTools();
  console.log('Available configured tools:', Object.keys(tools).filter(key => tools[key as keyof typeof tools] !== null));
  
  // Example: Use the tone adjuster if available
  const toneAdjuster = getTool<any>('ToneAdjuster');
  if (toneAdjuster) {
    console.log(`Using ToneAdjuster with tone=${toneAdjuster.tone} and strength=${toneAdjuster.strength}`);
    const adjustedContent = toneAdjuster.apply('Welcome to the application!');
    console.log('Adjusted content:', adjustedContent);
  }
  
  // Example: Use the code formatter if available
  const codeFormatter = getTool<any>('CodeFormatter');
  if (codeFormatter) {
    console.log(`Using CodeFormatter with language=${codeFormatter.language} and tabSize=${codeFormatter.tabSize}`);
    const formattedCode = codeFormatter.format('function example() { return true; }');
    console.log('Formatted code:', formattedCode);
  }
  
  console.log('Bootstrap complete!');
  
  return {
    tools,
    ready: true
  };
}

// Function to run when the application is about to exit
export function shutdown() {
  console.log('Application shutting down...');
  
  // Example: Create a final snapshot if the snapshot tool is enabled
  const snapshotCreator = getTool<any>('SnapshotCreator');
  if (snapshotCreator) {
    console.log('Creating final snapshot before shutdown...');
    const snapshot = snapshotCreator.createSnapshot('final-snapshot');
    console.log('Final snapshot created:', snapshot.id);
  }
  
  console.log('Shutdown complete!');
}

// Export a function to check if all required tools are available
export function checkRequiredTools(requiredTools: string[]): boolean {
  const missingTools: string[] = [];
  
  for (const toolName of requiredTools) {
    if (!getTool(toolName)) {
      missingTools.push(toolName);
    }
  }
  
  if (missingTools.length > 0) {
    console.warn('Missing required tools:', missingTools);
    return false;
  }
  
  return true;
}