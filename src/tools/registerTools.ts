/**
 * Centralized Tool Registration System
 * 
 * This file imports all tools from the code-tools directory and provides a unified
 * registration mechanism for MCP tools. This eliminates scattered registration logic
 * and ensures all tools are discoverable by MCP and LLMs via ListToolsRequestSchema.
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { initializePluginManager, getPluginManager } from './code-tools/plugin-manager.js';

// Import tool modules from code-tools directory
import * as apiGeneratorModule from './code-tools/api-generator.js';
import * as authCheckerModule from './code-tools/auth-checker.js';
import * as autoContinueModule from './code-tools/auto-continue.js';
import * as backupCreatorModule from './code-tools/backup-creator.js';
import * as buildRunnerModule from './code-tools/build-runner.js';
import * as cacheCleanerModule from './code-tools/cache-cleaner.js';
import * as cliPrompterModule from './code-tools/cli-prompter.js';
import * as cliToolkitModule from './code-tools/cli-toolkit.js';
import * as codeAnalyzerModule from './code-tools/code-analyzer.js';
import * as codeFixerModule from './code-tools/code-fixer.js';
import * as componentBuilderModule from './code-tools/component-builder.js';
import * as dbMigratorModule from './code-tools/db-migrator.js';
import * as docGeneratorModule from './code-tools/doc-generator.js';
import * as duplicateFinderModule from './code-tools/duplicate-finder.js';
import * as envManagerModule from './code-tools/env-manager.js';
import * as errorLoggerModule from './code-tools/error-logger.js';
import * as eventDispatcherModule from './code-tools/event-dispatcher.js';
import * as fileWatcherModule from './code-tools/file-watcher.js';
import * as formatterModule from './code-tools/formatter.js';
import * as gitInitializerModule from './code-tools/git-initializer.js';
import * as i18nLoaderModule from './code-tools/i18n-loader.js';
import * as logViewerModule from './code-tools/log-viewer.js';
import * as metadataReaderModule from './code-tools/metadata-reader.js';
import * as mockDataInserterModule from './code-tools/mock-data-inserter.js';
import * as notificationSenderModule from './code-tools/notification-sender.js';
import * as performanceMonitorModule from './code-tools/performance-monitor.js';
import * as pluginLoaderModule from './code-tools/plugin-loader.js';
import * as refactorToolModule from './code-tools/refactor-tool.js';
import * as schemaValidatorModule from './code-tools/schema-validator.js';
import * as testRunnerModule from './code-tools/test-runner.js';
import * as themeSwitcherModule from './code-tools/theme-switcher.js';
import * as tokenRefresherModule from './code-tools/token-refresher.js';
import * as toneAdjusterModule from './code-tools/tone-adjuster.js';
import * as toolSuggesterModule from './code-tools/tool-suggester.js';

// Import unique tool modules
import * as avatarRendererModule from './code-tools/avatar-renderer.js';
import * as voiceClonerModule from './code-tools/voice-cloner.js';
import * as assistantRouterModule from './code-tools/assistant-router.js';
import * as chatLoggerModule from './code-tools/chat-logger.js';
import * as personaLoaderModule from './code-tools/persona-loader.js';

/**
 * Tool definition with metadata
 */
interface Tool {
  name: string;
  description: string;
  module: any;
  inputSchema?: z.ZodType<any>;
}

/**
 * Register all tools with the MCP server
 * This function integrates tools with the MCP server through the plugin manager
 * 
 * @param server The MCP server instance
 */
export function registerAllTools(server: any) {
  console.log('[TOOLS] Registering all tools with MCP server...');
  
  // Initialize the plugin manager with the server
  initializePluginManager(server);
  const pluginManager = getPluginManager();
  
  // Define tool configurations with metadata
  const tools: Tool[] = [
    { name: 'api-generator', description: 'API generator including individual endpoint creation', module: apiGeneratorModule },
    { name: 'auth-checker', description: 'Auth checker by validating session tokens', module: authCheckerModule },
    { name: 'auto-continue', description: 'Auto continue tool', module: autoContinueModule },
    { name: 'backup-creator', description: 'Backup creator and restores previous states', module: backupCreatorModule },
    { name: 'build-runner', description: 'Build runner and triggers deployment pipelines', module: buildRunnerModule },
    { name: 'cache-cleaner', description: 'Cache cleaner and optimizes memory usage', module: cacheCleanerModule },
    { name: 'cli-prompter', description: 'CLI prompter including full interactive wizards', module: cliPrompterModule },
    { name: 'cli-toolkit', description: 'CLI toolkit', module: cliToolkitModule },
    { name: 'code-fixer', description: 'Code fixer', module: codeFixerModule },
    { name: 'component-builder', description: 'Component builder', module: componentBuilderModule },
    { name: 'db-migrator', description: 'DB migrator and updates database schemas', module: dbMigratorModule },
    { name: 'doc-generator', description: 'Doc generator including README.md files', module: docGeneratorModule },
    { name: 'duplicate-finder', description: 'Duplicate finder', module: duplicateFinderModule },
    { name: 'env-manager', description: 'Env manager and loads config settings', module: envManagerModule },
    { name: 'error-logger', description: 'Error logger', module: errorLoggerModule },
    { name: 'event-dispatcher', description: 'Event dispatcher and invokes reactive hooks', module: eventDispatcherModule },
    { name: 'file-watcher', description: 'File watcher', module: fileWatcherModule },
    { name: 'formatter', description: 'Formatter', module: formatterModule },
    { name: 'git-initializer', description: 'Git initializer', module: gitInitializerModule },
    { name: 'i18n-loader', description: 'I18n loader and switches between languages', module: i18nLoaderModule },
    { name: 'log-viewer', description: 'Log viewer', module: logViewerModule },
    { name: 'metadata-reader', description: 'Metadata reader and parses file contents', module: metadataReaderModule },
    { name: 'mock-data-inserter', description: 'Mock data inserter', module: mockDataInserterModule },
    { name: 'notification-sender', description: 'Notification sender and manages alert thresholds', module: notificationSenderModule },
    { name: 'performance-monitor', description: 'Performance monitor including detailed latency metrics', module: performanceMonitorModule },
    { name: 'plugin-loader', description: 'Plugin loader including extension initialization', module: pluginLoaderModule },
    { name: 'refactor-tool', description: 'Refactor tool including variable/class renaming', module: refactorToolModule },
    { name: 'schema-validator', description: 'Schema validator', module: schemaValidatorModule },
    { name: 'test-runner', description: 'Test runner', module: testRunnerModule },
    { name: 'theme-switcher', description: 'Theme switcher and manages layout configuration', module: themeSwitcherModule },
    { name: 'token-refresher', description: 'Token refresher and decodes JWTs for inspection and validation', module: tokenRefresherModule },
    { name: 'tone-adjuster', description: 'Tone adjuster', module: toneAdjusterModule },
    { name: 'tool-suggester', description: 'Tool suggester by listing available tool capabilities', module: toolSuggesterModule },
    { name: 'code-analyzer', description: 'Code analyzer', module: codeAnalyzerModule },
    
    // Unique tools
    { name: 'avatar-renderer', description: 'Avatar renderer', module: avatarRendererModule },
    { name: 'voice-cloner', description: 'Voice cloner', module: voiceClonerModule },
    { name: 'assistant-router', description: 'Assistant router', module: assistantRouterModule },
    { name: 'chat-logger', description: 'Chat logger', module: chatLoggerModule },
    { name: 'persona-loader', description: 'Persona loader', module: personaLoaderModule }
  ];
  
  // Register each tool
  let registeredTools = 0;
  
  for (const tool of tools) {
    try {
      // Create tool object with appropriate properties
      const toolObj = {
        name: tool.name,
        description: tool.description,
        inputSchema: tool.module.inputSchema || z.object({}),
        onCommand: tool.module.onCommand || function(args: any) { 
          return { content: [{ type: "text", text: `Tool ${tool.name} executed` }] };
        }
      };
      
      // Register tool with plugin manager
      pluginManager.registerTool(tool.name, toolObj);
      registeredTools++;
      console.log(`[TOOLS] Registered tool: ${tool.name}`);
    } catch (error) {
      console.error(`[TOOLS] Failed to register tool ${tool.name}:`, error);
    }
  }
  
  // If plugin manager doesn't work (no tools registered), fall back to direct server method
  if (registeredTools === 0 && server) {
    console.log('[TOOLS] Falling back to direct server registration method');
    
    // Extend the ListToolsRequestSchema handler to include our tools
    const originalListHandler = server.getRequestHandler(ListToolsRequestSchema);
    
    // Set up a new handler that includes our tools
    server.setRequestHandler(ListToolsRequestSchema, async (request: any) => {
      // First get the original response
      const originalResponse = await originalListHandler ? await originalListHandler(request) : { tools: [] };
      
      // Make sure tools array exists
      if (!originalResponse.tools) {
        originalResponse.tools = [];
      }
      
      // Filter out any existing tools with the same names
      const filteredTools = originalResponse.tools.filter(
        (existingTool: any) => !tools.some(t => t.name === existingTool.name)
      );
      
      // Add our tools
      originalResponse.tools = [
        ...filteredTools,
        ...tools.map(tool => ({
          name: tool.name,
          description: tool.description,
          inputSchema: tool.module.inputSchema ? zodToJsonSchema(tool.module.inputSchema) : {},
        })),
      ];
      
      return originalResponse;
    });
    
    console.log(`[TOOLS] Added ${tools.length} tools to ListToolsRequestSchema handler`);
  }
  
  console.log(`[TOOLS] Successfully registered ${registeredTools} tools with MCP server`);
  
  return tools;
}

export default registerAllTools;