// Auto-generated safe fallback for index

export function activate() {
    console.log("[TOOL] index activated (passive mode)");
}

// Define global state types
declare global {
  var documentationFiles: Record<string, {
    path: string;
    lastUpdated: string;
    type: string;
  }>;
  var pendingDocUpdates: Array<{
    path: string;
    reason: string;
    timestamp: string;
  }>;
}

export function onFileWrite(event: any) {
  console.log(`[Documentation] File write event detected: ${event.path}`);
  
  try {
    // Track documentation files
    if (!globalThis.documentationFiles) {
      globalThis.documentationFiles = {};
    }
    
    // Track pending documentation updates
    if (!globalThis.pendingDocUpdates) {
      globalThis.pendingDocUpdates = [];
    }
    
    // Check if the file is a documentation file
    const extension = event.path.split('.').pop()?.toLowerCase();
    if (extension === 'md' ||
        extension === 'mdx' ||
        extension === 'html' ||
        extension === 'txt' ||
        event.path.includes('docs') ||
        event.path.includes('documentation')) {
      
      // Update documentation file tracking
      globalThis.documentationFiles[event.path] = {
        path: event.path,
        lastUpdated: new Date().toISOString(),
        type: extension || 'unknown'
      };
      
      console.log(`[Documentation] Documentation file updated: ${event.path}`);
    }
    
    // Check if the file is a source code file that might need documentation updates
    if (extension === 'js' ||
        extension === 'ts' ||
        extension === 'jsx' ||
        extension === 'tsx' ||
        extension === 'py' ||
        extension === 'java' ||
        extension === 'c' ||
        extension === 'cpp') {
      
      // Add to pending documentation updates
      globalThis.pendingDocUpdates.push({
        path: event.path,
        reason: 'Source code change',
        timestamp: new Date().toISOString()
      });
      
      console.log(`[Documentation] Source code change detected, documentation update may be needed: ${event.path}`);
      
      // If we have accumulated several pending updates, suggest updating documentation
      if (globalThis.pendingDocUpdates.length >= 5) {
        console.log(`[Documentation] Multiple source code changes detected. Consider updating documentation.`);
      }
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[Documentation] Error handling file write: ${errorMessage}`);
  }
}

export function onSessionStart(session: any) {
  console.log(`[Documentation] New session started: ${session.id}`);
  
  try {
    // Initialize documentation state for the session
    session.documentationState = {
      initialized: true,
      timestamp: new Date().toISOString(),
      documentationFiles: {},
      pendingUpdates: [],
      apiDocs: {
        lastGenerated: null,
        sourcePaths: []
      },
      cmsConnections: {}
    };
    
    // Initialize global state if not already initialized
    if (!globalThis.documentationFiles) globalThis.documentationFiles = {};
    if (!globalThis.pendingDocUpdates) globalThis.pendingDocUpdates = [];
    
    // Scan project for documentation files
    try {
      const fs = require('fs');
      const path = require('path');
      const projectRoot = process.cwd();
      
      // Function to scan directory recursively
      const scanDirectory = (dir: string, fileTypes: string[]) => {
        const results: string[] = [];
        const files = fs.readdirSync(dir);
        
        for (const file of files) {
          const filePath = path.join(dir, file);
          const stat = fs.statSync(filePath);
          
          if (stat.isDirectory()) {
            // Skip node_modules and other common excluded directories
            if (file === 'node_modules' || file === '.git' || file === 'dist' || file === 'build') {
              continue;
            }
            // Recursively scan subdirectories
            results.push(...scanDirectory(filePath, fileTypes));
          } else {
            // Check if file matches any of the target extensions
            const ext = path.extname(file).toLowerCase().substring(1);
            if (fileTypes.includes(ext)) {
              results.push(filePath);
            }
          }
        }
        
        return results;
      };
      
      // Scan for documentation files
      const docFiles = scanDirectory(projectRoot, ['md', 'mdx', 'html', 'txt']);
      console.log(`[Documentation] Found ${docFiles.length} documentation files`);
      
      // Store documentation files in session state and global tracking
      docFiles.forEach(file => {
        const extension = path.extname(file).toLowerCase().substring(1);
        
        session.documentationState.documentationFiles[file] = {
          path: file,
          lastUpdated: new Date(fs.statSync(file).mtime).toISOString(),
          type: extension
        };
        
        globalThis.documentationFiles[file] = {
          path: file,
          lastUpdated: new Date(fs.statSync(file).mtime).toISOString(),
          type: extension
        };
      });
      
      // Check for API documentation needs
      const sourceFiles = scanDirectory(projectRoot, ['js', 'ts', 'jsx', 'tsx']);
      const apiSourceDirs = new Set<string>();
      
      sourceFiles.forEach(file => {
        // Check if file contains API-related code
        const content = fs.readFileSync(file, 'utf8');
        if (content.includes('export') &&
            (content.includes('function') || content.includes('class')) &&
            (content.includes('@param') || content.includes('@returns') || content.includes('/**'))) {
          
          // Add directory to potential API source directories
          apiSourceDirs.add(path.dirname(file));
        }
      });
      
      // Store API source directories in session state
      session.documentationState.apiDocs.sourcePaths = Array.from(apiSourceDirs);
      
      console.log(`[Documentation] Identified ${apiSourceDirs.size} potential API source directories`);
    } catch (scanError: unknown) {
      const errorMessage = scanError instanceof Error ? scanError.message : String(scanError);
      console.error(`[Documentation] Error scanning project files: ${errorMessage}`);
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[Documentation] Error initializing session: ${errorMessage}`);
  }
}

export function onCommand(command: any) {
  console.log(`[Documentation] Command executed: ${command.name}`);
  
  try {
    // Handle documentation-related commands
    switch (command.name) {
      case 'generate_api_docs':
        // Generate API documentation
        return handleGenerateAPIDocs({
          sourcePath: command.sourcePath,
          outputPath: command.outputPath,
          format: command.format || 'markdown',
          includePrivate: command.includePrivate || false,
          title: command.title,
          description: command.description
        });
        
      case 'update_docs':
        // Update documentation
        return handleUpdateDocs({
          docsPath: command.docsPath,
          sourcePath: command.sourcePath,
          patterns: command.patterns,
          updateStrategy: command.updateStrategy || 'merge'
        });
        
      case 'connect_cms':
        // Connect to CMS
        return handleConnectCMS({
          platform: command.platform,
          apiKey: command.apiKey,
          apiUrl: command.apiUrl,
          contentType: command.contentType,
          operation: command.operation,
          data: command.data,
          query: command.query,
          id: command.id
        });
        
      case 'get_pending_doc_updates':
        // Get pending documentation updates
        if (globalThis.pendingDocUpdates) {
          return {
            content: [{
              type: "text",
              text: `Pending documentation updates:\n\n${JSON.stringify(globalThis.pendingDocUpdates, null, 2)}`
            }]
          };
        } else {
          return {
            content: [{ type: "text", text: "No pending documentation updates" }]
          };
        }
        
      case 'clear_pending_doc_updates':
        // Clear pending documentation updates
        if (globalThis.pendingDocUpdates) {
          const count = globalThis.pendingDocUpdates.length;
          globalThis.pendingDocUpdates = [];
          return {
            content: [{ type: "text", text: `Cleared ${count} pending documentation updates` }]
          };
        } else {
          return {
            content: [{ type: "text", text: "No pending documentation updates to clear" }]
          };
        }
        
      default:
        console.log(`[Documentation] Unknown command: ${command.name}`);
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[Documentation] Error executing command: ${errorMessage}`);
    return {
      content: [{ type: "text", text: `Error executing documentation command: ${errorMessage}` }],
      isError: true
    };
  }
}
import { z } from "zod";
import * as fs from "fs/promises";
import * as path from "path";
import { APIDocsTool } from "./api-docs-tool.js";
import { DocsUpdater } from "./docs-updater.js";
import { CMSConnector } from "./cms-connector.js";
export * from './legal-creator.js';
export * from './seo-tool.js';

// Schema for API Docs Tool
export const GenerateAPIDocsSchema = z.object({
  sourcePath: z.string().describe("Path to the source code to generate API documentation for"),
  outputPath: z.string().describe("Path to save the generated API documentation"),
  format: z.enum(["markdown", "html", "json"]).default("markdown").describe("Format of the generated documentation"),
  includePrivate: z.boolean().default(false).describe("Whether to include private members in the documentation"),
  title: z.string().optional().describe("Title for the documentation"),
  description: z.string().optional().describe("Description for the documentation"),
});

// Schema for Docs Updater
export const UpdateDocsSchema = z.object({
  docsPath: z.string().describe("Path to the documentation files to update"),
  sourcePath: z.string().describe("Path to the source code to sync documentation with"),
  patterns: z.array(z.string()).optional().describe("Patterns to match files for documentation updates"),
  updateStrategy: z.enum(["replace", "append", "merge"]).default("merge").describe("Strategy for updating documentation"),
});

// Schema for CMS Connector
export const CMSConnectorSchema = z.object({
  platform: z.enum(["contentful", "strapi", "sanity", "wordpress", "custom"]).describe("CMS platform to connect to"),
  apiKey: z.string().describe("API key for the CMS platform"),
  apiUrl: z.string().describe("API URL for the CMS platform"),
  contentType: z.string().describe("Content type to interact with"),
  operation: z.enum(["fetch", "create", "update", "delete"]).describe("Operation to perform"),
  data: z.record(z.any()).optional().describe("Data for create or update operations"),
  query: z.record(z.any()).optional().describe("Query parameters for fetch operations"),
  id: z.string().optional().describe("ID for update or delete operations"),
});

/**
 * Handle generating API documentation
 */
export async function handleGenerateAPIDocs(args: any) {
  try {
    if (!args || typeof args !== 'object') {
      return {
        content: [{ type: "text", text: "Error: Invalid arguments for APIDocsTool" }],
        isError: true,
      };
    }

    const sourcePath = args.sourcePath as string;
    const outputPath = args.outputPath as string;
    const format = (args.format as "markdown" | "html" | "json") || "markdown";
    const includePrivate = args.includePrivate as boolean || false;
    const title = args.title as string || "API Documentation";
    const description = args.description as string || "";

    // Check if source path exists
    try {
      await fs.access(sourcePath);
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error: Source path ${sourcePath} does not exist or is not accessible` }],
        isError: true,
      };
    }

    // Create output directory if it doesn't exist
    const outputDir = path.dirname(outputPath);
    try {
      await fs.mkdir(outputDir, { recursive: true });
    } catch (error) {
      // Ignore if directory already exists
    }

    // Generate API documentation
    const apiDocs = new APIDocsTool({
      sourcePath,
      outputPath,
      format,
      includePrivate,
      title,
      description,
    });

    const result = await apiDocs.generate();

    return {
      content: [{ 
        type: "text", 
        text: `API documentation generated successfully at ${outputPath}\n\n${result.summary}` 
      }],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [{ type: "text", text: `Error generating API documentation: ${errorMessage}` }],
      isError: true,
    };
  }
}

/**
 * Handle updating documentation
 */
export async function handleUpdateDocs(args: any) {
  try {
    if (!args || typeof args !== 'object') {
      return {
        content: [{ type: "text", text: "Error: Invalid arguments for DocsUpdater" }],
        isError: true,
      };
    }

    const docsPath = args.docsPath as string;
    const sourcePath = args.sourcePath as string;
    const patterns = args.patterns as string[] || ["**/*.{js,ts,jsx,tsx}"];
    const updateStrategy = (args.updateStrategy as "replace" | "append" | "merge") || "merge";

    // Check if paths exist
    try {
      await fs.access(docsPath);
      await fs.access(sourcePath);
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error: One or more paths do not exist or are not accessible` }],
        isError: true,
      };
    }

    // Update documentation
    const docsUpdater = new DocsUpdater({
      docsPath,
      sourcePath,
      patterns,
      updateStrategy,
    });

    const result = await docsUpdater.update();

    return {
      content: [{ 
        type: "text", 
        text: `Documentation updated successfully\n\n${result.summary}` 
      }],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [{ type: "text", text: `Error updating documentation: ${errorMessage}` }],
      isError: true,
    };
  }
}

/**
 * Handle connecting to CMS
 */
export async function handleConnectCMS(args: any) {
  try {
    if (!args || typeof args !== 'object') {
      return {
        content: [{ type: "text", text: "Error: Invalid arguments for CMSConnector" }],
        isError: true,
      };
    }

    const platform = args.platform as "contentful" | "strapi" | "sanity" | "wordpress" | "custom";
    const apiKey = args.apiKey as string;
    const apiUrl = args.apiUrl as string;
    const contentType = args.contentType as string;
    const operation = args.operation as "fetch" | "create" | "update" | "delete";
    const data = args.data as Record<string, any> || {};
    const query = args.query as Record<string, any> || {};
    const id = args.id as string || "";

    // Connect to CMS
    const cmsConnector = new CMSConnector({
      platform,
      apiKey,
      apiUrl,
      contentType,
    });

    let result;
    switch (operation) {
      case "fetch":
        result = await cmsConnector.fetch(query);
        break;
      case "create":
        result = await cmsConnector.create(data);
        break;
      case "update":
        result = await cmsConnector.update(id, data);
        break;
      case "delete":
        result = await cmsConnector.delete(id);
        break;
      default:
        return {
          content: [{ type: "text", text: `Error: Invalid operation ${operation}` }],
          isError: true,
        };
    }

    // Format the result for display
    let resultText = "";
    if (typeof result === "object") {
      resultText = JSON.stringify(result, null, 2);
    } else {
      resultText = String(result);
    }

    return {
      content: [{ 
        type: "text", 
        text: `CMS operation ${operation} completed successfully\n\n\`\`\`json\n${resultText}\n\`\`\`` 
      }],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [{ type: "text", text: `Error connecting to CMS: ${errorMessage}` }],
      isError: true,
    };
  }
}

