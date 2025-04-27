// Auto-generated safe fallback for index

export function activate() {
    console.log("[TOOL] index activated (passive mode)");
}

export function onFileWrite() { /* no-op */ }
export function onSessionStart() { /* no-op */ }
export function onCommand() { /* no-op */ }
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

