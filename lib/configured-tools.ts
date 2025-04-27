import { toolRegistry } from './tool-integration';
import { loadToolsConfig } from './tools-config';

/**
 * Central module that configures and loads all tools based on the tools-config.json
 */

// Import all tool modules (these would be actual imports in a real implementation)
const mockToolImports = {
  ToneAdjuster: {
    createAdjuster: () => ({
      tone: 'default',
      strength: 0.3,
      apply: (content: string) => content,
      isApplied: false
    })
  },
  CodeFormatter: {
    createFormatter: () => ({
      language: 'javascript',
      tabSize: 4,
      singleQuote: false,
      format: (code: string) => code,
      isFormatted: false
    })
  },
  IconManager: {
    createManager: () => ({
      library: 'default',
      framework: 'vanilla',
      getIcon: (name: string) => `<i class="${name}"></i>`,
      icons: new Map()
    })
  },
  ResponsiveUI: {
    createResponsiveUI: () => ({
      framework: 'vanilla',
      styling: 'css',
      createComponent: (name: string) => `<div class="${name}"></div>`,
      components: new Set()
    })
  },
  SnapshotCreator: {
    createSnapshotTool: () => ({
      createAfterEachFile: false,
      includeTimestamp: true,
      createSnapshot: (name: string) => ({ id: `snapshot-${Date.now()}`, name }),
      snapshots: []
    })
  },
  AutoContinue: {
    createAutoContinue: () => ({
      threshold: 0.7,
      enabled: true,
      check: (contextSize: number) => contextSize > 0.7,
      continue: () => console.log('Continuing...')
    })
  }
};

/**
 * Initialize all tools defined in the configuration
 */
export function initializeConfiguredTools() {
  console.log('Loading tool configuration...');
  const config = loadToolsConfig();
  console.log(`Found ${Object.keys(config.tools).length} tools in configuration`);
  
  // Register all tools from the configuration
  for (const [toolName, toolConfig] of Object.entries(config.tools)) {
    if (!toolConfig.enabled) {
      console.log(`Tool ${toolName} is disabled in configuration`);
      continue;
    }
    
    // Get the tool initializer from our imports
    const toolModule = (mockToolImports as any)[toolName];
    if (!toolModule) {
      console.warn(`Tool module for ${toolName} not found`);
      continue;
    }
    
    // Find the tool creator function (convention: createX, createXxx, etc.)
    const creatorFunctionName = Object.keys(toolModule).find(key => key.startsWith('create'));
    if (!creatorFunctionName) {
      console.warn(`Creator function for ${toolName} not found`);
      continue;
    }
    
    // Register the tool
    console.log(`Registering ${toolName} with configuration`);
    toolRegistry.register(toolName, toolModule[creatorFunctionName]);
  }
  
  console.log(`Initialized ${toolRegistry.listTools().length} tools successfully`);
  return toolRegistry;
}

/**
 * Get all configured tools as an object
 */
export function getConfiguredTools() {
  return {
    toneAdjuster: toolRegistry.get('ToneAdjuster'),
    codeFormatter: toolRegistry.get('CodeFormatter'),
    iconManager: toolRegistry.get('IconManager'),
    responsiveUI: toolRegistry.get('ResponsiveUI'),
    snapshotCreator: toolRegistry.get('SnapshotCreator'),
    autoContinue: toolRegistry.get('AutoContinue')
  };
}

// Export a convenience function to get a specific tool
export function getTool<T>(toolName: string): T | null {
  return toolRegistry.get<T>(toolName);
}