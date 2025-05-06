#!/usr/bin/env node

import { setupPostBootActivation } from '../lib/postBootActivator.js';
import { refreshResources } from "../lib/resource-manager.js";
import { registerAllTools } from './tools/registerTools.js';  // Import the centralized tool registration
import { startApiServer } from './api/index.js';  // Import the API server
import { initializeStorage } from './api/storage/index.js';
import { initializeJobQueue } from './api/queue/index.js';
import { initializePluginManager } from './tools/code-tools/plugin-manager.js';

// MCP SDK imports
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { CallToolRequestSchema, ListToolsRequestSchema, ListResourcesRequestSchema, ListPromptsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { zodToJsonSchema } from "zod-to-json-schema";
import { z } from "zod";

// Parse command line arguments
const argv = process.argv.slice(2);
const isApiOnly = argv.includes('--api-only');
const withApi = argv.includes('--with-api') || isApiOnly;
const openDocs = argv.includes('--open-docs');

// Core application imports
import { FilteredStdioServerTransport } from "./custom-stdio.js";

// Initialize the server
const server = new Server({
  name: "optimuscode",
  version: "0.1.0",
}, {
  capabilities: {
    tools: {},
    resources: {}, 
    prompts: {},
  },
});

// Add handler for resources/list method
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [],
  };
});

// Add handler for prompts/list method
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: []
  };
});

// Main function to run the server
async function runServer() {
  try {
    // Initialize storage and job queue systems (needed for both API and MCP)
    const storage = initializeStorage();
    const jobQueue = await initializeJobQueue(storage);
    
    // Initialize plugin manager with server regardless of mode
    // This ensures tools are registered properly even in API-only mode
    initializePluginManager(server);
    
    // API-only mode: just start the API server
    if (isApiOnly) {
      console.error("Running in API-only mode");
      try {
        console.error("Starting API server...");
        await startApiServer();
        console.error("API server started successfully");
        
        if (openDocs) {
          const { exec } = await import('child_process');
          // Open docs in browser
          const openCommand = process.platform === 'win32'
            ? 'start http://localhost:3001/docs'
            : 'open http://localhost:3001/docs';
          
          exec(openCommand, (err) => {
            if (err) console.error("Could not open documentation in browser:", err);
            else console.log("Opened API documentation in browser");
          });
        }
      } catch (apiError) {
        console.error(`FATAL ERROR: Failed to start API server: ${apiError}`);
        process.exit(1);
      }
      return;
    }
    
    // Standard MCP server mode
    console.error("Initializing OptimusCode MCP server...");
    
    // Register all tools using our centralized registration system
    registerAllTools(server);
    console.error("All tools registered with centralized registration system");
    
    // Use our custom FilteredStdioServerTransport
    const transport = new FilteredStdioServerTransport();
    
    console.error("Connecting server...");
    await server.connect(transport);
    console.error("Server connected successfully");

    // Use globalThis instead of global for better TypeScript support
    (function(g) {
      // Define the property on the global object
      Object.defineProperty(g, 'refreshResources', {
        value: refreshResources,
        writable: true,
        enumerable: true,
        configurable: true
      });
    })(globalThis);
    
    console.log("[BOOTSTRAP] Global refreshResources function registered.");
    
    // Start API server if requested
    if (withApi) {
      try {
        console.error("Starting API server...");
        await startApiServer();
        console.error("API server started successfully");
        
        if (openDocs) {
          const { exec } = await import('child_process');
          // Open docs in browser
          const openCommand = process.platform === 'win32'
            ? 'start http://localhost:3001/docs'
            : 'open http://localhost:3001/docs';
          
          exec(openCommand, (err) => {
            if (err) console.error("Could not open documentation in browser:", err);
            else console.log("Opened API documentation in browser");
          });
        }
      } catch (apiError) {
        console.error(`WARNING: Failed to start API server: ${apiError}`);
        console.error("MCP server will continue running without API wrapper");
      }
    }
  } catch (error) {
    console.error(`FATAL ERROR: ${error}`);
    process.exit(1);
  }
}

// Run the server
runServer().catch((error) => {
  console.error(`RUNTIME ERROR: ${error}`);
  process.exit(1);
});
