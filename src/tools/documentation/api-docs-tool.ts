// Auto-generated safe fallback for api-docs-tool

export function activate() {
    console.log("[TOOL] api-docs-tool activated (passive mode)");
}

/**
 * Handles file write events for API source or documentation config files.
 * If a relevant file changes, triggers documentation regeneration.
 */
export async function onFileWrite(event?: { path: string; content?: string }) {
  if (!event || !event.path) {
    console.warn("[api-docs-tool] onFileWrite called without event data.");
    return;
  }
  try {
    if (event.path.endsWith('.api-docs.json') || event.path.endsWith('.api-docs.config.json')) {
      console.log(`[api-docs-tool] Detected API docs config file change: ${event.path}`);
      const config = JSON.parse(event.content || await (await import('fs/promises')).readFile(event.path, 'utf-8'));
      const tool = new APIDocsTool(config);
      await tool.generate();
      console.log(`[api-docs-tool] API documentation regenerated for ${event.path}`);
    } else if (/\.(js|ts|jsx|tsx)$/.test(event.path)) {
      console.log(`[api-docs-tool] Detected API source file change: ${event.path}`);
      // Optionally trigger re-parsing or regeneration
      // ... actual logic could go here
    }
  } catch (err) {
    console.error(`[api-docs-tool] Error during file-triggered documentation generation:`, err);
  }
}

/**
 * Initializes or resets API docs tool state at the start of a session.
 */
export function onSessionStart(session?: { id?: string }) {
  console.log(`[api-docs-tool] Session started${session && session.id ? `: ${session.id}` : ""}. Preparing API docs tool environment.`);
  // Example: clear temp files, reset state, etc.
  // ... actual reset logic
}

/**
 * Handles API docs tool commands.
 * Supports dynamic invocation of documentation generation, validation, or reporting.
 */
export async function onCommand(command?: { name: string; args?: any }) {
  if (!command || !command.name) {
    console.warn("[api-docs-tool] onCommand called without command data.");
    return;
  }
  switch (command.name) {
    case "generate-docs":
      console.log("[api-docs-tool] Generating API documentation...");
      try {
        const tool = new APIDocsTool(command.args);
        await tool.generate();
        console.log("[api-docs-tool] API documentation generation complete.");
      } catch (err) {
        console.error("[api-docs-tool] API documentation generation failed:", err);
      }
      break;
    case "validate-docs":
      console.log("[api-docs-tool] Validating API documentation schema...");
      try {
        GenerateAPIDocsSchema.parse(command.args);
        console.log("[api-docs-tool] API documentation schema validation successful.");
      } catch (err) {
        console.error("[api-docs-tool] API documentation schema validation failed:", err);
      }
      break;
    case "report-docs":
      console.log("[api-docs-tool] Reporting API documentation status...");
      // ... actual reporting logic
      break;
    default:
      console.warn(`[api-docs-tool] Unknown command: ${command.name}`);
  }
}
/**
 * API Docs Tool
 * 
 * Automatically generates API documentation from code
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { z } from 'zod';

/**
 * API Documentation Tool
 * 
 * A class for generating API documentation from source code
 */
export class APIDocsTool {
  private sourcePath: string;
  private outputPath: string;
  private format: 'markdown' | 'html' | 'json';
  private includePrivate: boolean;
  private title: string;
  private description: string;

  /**
   * Create a new API documentation tool
   * 
   * @param options Tool options
   */
  constructor(options: {
    sourcePath: string;
    outputPath: string;
    format?: 'markdown' | 'html' | 'json';
    includePrivate?: boolean;
    title?: string;
    description?: string;
  }) {
    this.sourcePath = options.sourcePath;
    this.outputPath = options.outputPath;
    this.format = options.format || 'markdown';
    this.includePrivate = options.includePrivate || false;
    this.title = options.title || 'API Documentation';
    this.description = options.description || '';
  }

  /**
   * Generate API documentation
   * 
   * @returns Generation result
   */
  async generate(): Promise<{
    success: boolean;
    message: string;
    outputPath: string;
    summary: string;
  }> {
    try {
      // Parse API documentation from source code
      const apiDocs = await parseAPIDocs({
        sourcePath: this.sourcePath,
        filePatterns: ['**/*.js', '**/*.ts', '**/*.jsx', '**/*.tsx'],
        includeRoutes: true,
        includeControllers: true,
        includeModels: true,
        framework: 'auto',
        outputFormat: this.format,
      });

      // Write the documentation to the output file
      await fs.mkdir(path.dirname(this.outputPath), { recursive: true });
      await fs.writeFile(this.outputPath, apiDocs);

      // Count the number of endpoints and models
      const apiDocsObj = JSON.parse(apiDocs);
      const endpointCount = Object.keys(apiDocsObj.paths || {}).length;
      const modelCount = Object.keys(apiDocsObj.components?.schemas || {}).length;

      return {
        success: true,
        message: `API documentation generated successfully at ${this.outputPath}`,
        outputPath: this.outputPath,
        summary: `Generated documentation for ${endpointCount} endpoints and ${modelCount} models.`,
      };
    } catch (error) {
      throw new Error(`Failed to generate API documentation: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

/**
 * Schema for APIDocsTool
 */
export const GenerateAPIDocsSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  version: z.string().optional(),
  endpoints: z.array(z.object({
    path: z.string(),
    method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD']),
    summary: z.string(),
    description: z.string().optional(),
    parameters: z.array(z.object({
      name: z.string(),
      in: z.enum(['path', 'query', 'header', 'cookie', 'body']),
      required: z.boolean().optional(),
      description: z.string().optional(),
      schema: z.object({
        type: z.enum(['string', 'number', 'integer', 'boolean', 'array', 'object']),
        format: z.string().optional(),
        items: z.any().optional(),
        properties: z.record(z.any()).optional(),
        required: z.array(z.string()).optional(),
      }).optional(),
    })).optional(),
    requestBody: z.object({
      description: z.string().optional(),
      required: z.boolean().optional(),
      content: z.record(z.object({
        schema: z.object({
          type: z.enum(['string', 'number', 'integer', 'boolean', 'array', 'object']),
          properties: z.record(z.any()).optional(),
          required: z.array(z.string()).optional(),
          items: z.any().optional(),
        }),
      })),
    }).optional(),
    responses: z.record(z.object({
      description: z.string(),
      content: z.record(z.object({
        schema: z.object({
          type: z.enum(['string', 'number', 'integer', 'boolean', 'array', 'object']),
          properties: z.record(z.any()).optional(),
          required: z.array(z.string()).optional(),
          items: z.any().optional(),
        }),
      })).optional(),
    })),
    tags: z.array(z.string()).optional(),
    security: z.array(z.record(z.array(z.string()))).optional(),
  })),
  securitySchemes: z.record(z.object({
    type: z.enum(['apiKey', 'http', 'oauth2', 'openIdConnect']),
    description: z.string().optional(),
    name: z.string().optional(),
    in: z.enum(['query', 'header', 'cookie']).optional(),
    scheme: z.string().optional(),
    bearerFormat: z.string().optional(),
    flows: z.object({
      implicit: z.object({
        authorizationUrl: z.string(),
        refreshUrl: z.string().optional(),
        scopes: z.record(z.string()),
      }).optional(),
      password: z.object({
        tokenUrl: z.string(),
        refreshUrl: z.string().optional(),
        scopes: z.record(z.string()),
      }).optional(),
      clientCredentials: z.object({
        tokenUrl: z.string(),
        refreshUrl: z.string().optional(),
        scopes: z.record(z.string()),
      }).optional(),
      authorizationCode: z.object({
        authorizationUrl: z.string(),
        tokenUrl: z.string(),
        refreshUrl: z.string().optional(),
        scopes: z.record(z.string()),
      }).optional(),
    }).optional(),
    openIdConnectUrl: z.string().optional(),
  })).optional(),
  tags: z.array(z.object({
    name: z.string(),
    description: z.string().optional(),
  })).optional(),
  servers: z.array(z.object({
    url: z.string(),
    description: z.string().optional(),
  })).optional(),
  outputFormat: z.enum(['json', 'yaml', 'markdown', 'html']).default('json'),
  includeExamples: z.boolean().optional().default(true),
});

/**
 * Schema for ParseAPIDocsSchema
 */
export const ParseAPIDocsSchema = z.object({
  sourcePath: z.string(),
  filePatterns: z.array(z.string()).optional(),
  includeRoutes: z.boolean().optional().default(true),
  includeControllers: z.boolean().optional().default(true),
  includeModels: z.boolean().optional().default(true),
  framework: z.enum(['express', 'nest', 'fastify', 'koa', 'hapi', 'auto']).optional().default('auto'),
  outputFormat: z.enum(['json', 'yaml', 'markdown', 'html']).default('json'),
});

/**
 * API Documentation
 */
export interface APIDocumentation {
  openapi: string;
  info: {
    title: string;
    description?: string;
    version: string;
  };
  paths: Record<string, Record<string, {
    summary: string;
    description?: string;
    parameters?: Array<{
      name: string;
      in: 'path' | 'query' | 'header' | 'cookie' | 'body';
      required?: boolean;
      description?: string;
      schema?: {
        type: 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object';
        format?: string;
        items?: any;
        properties?: Record<string, any>;
        required?: string[];
      };
    }>;
    requestBody?: {
      description?: string;
      required?: boolean;
      content: Record<string, {
        schema: {
          type: 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object';
          properties?: Record<string, any>;
          required?: string[];
          items?: any;
        };
      }>;
    };
    responses: Record<string, {
      description: string;
      content?: Record<string, {
        schema: {
          type: 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object';
          properties?: Record<string, any>;
          required?: string[];
          items?: any;
        };
      }>;
    }>;
    tags?: string[];
    security?: Array<Record<string, string[]>>;
  }>>;
  components?: {
    schemas?: Record<string, any>;
    securitySchemes?: Record<string, {
      type: 'apiKey' | 'http' | 'oauth2' | 'openIdConnect';
      description?: string;
      name?: string;
      in?: 'query' | 'header' | 'cookie';
      scheme?: string;
      bearerFormat?: string;
      flows?: {
        implicit?: {
          authorizationUrl: string;
          refreshUrl?: string;
          scopes: Record<string, string>;
        };
        password?: {
          tokenUrl: string;
          refreshUrl?: string;
          scopes: Record<string, string>;
        };
        clientCredentials?: {
          tokenUrl: string;
          refreshUrl?: string;
          scopes: Record<string, string>;
        };
        authorizationCode?: {
          authorizationUrl: string;
          tokenUrl: string;
          refreshUrl?: string;
          scopes: Record<string, string>;
        };
      };
      openIdConnectUrl?: string;
    }>;
  };
  tags?: Array<{
    name: string;
    description?: string;
  }>;
  servers?: Array<{
    url: string;
    description?: string;
  }>;
}

/**
 * Parsed API Route
 */
interface ParsedRoute {
  path: string;
  method: string;
  summary: string;
  description?: string;
  parameters?: Array<{
    name: string;
    in: "path" | "query" | "header" | "cookie" | "body";
    required?: boolean;
    description?: string;
    schema?: any;
  }>;
  requestBody?: {
    description?: string;
    required?: boolean;
    content: Record<string, any>;
  };
  responses: Record<string, {
    description: string;
    content?: Record<string, any>;
  }>;
  controller: string;
  handler: string;
  tags?: string[];
}

/**
 * Parsed API Model
 */
interface ParsedModel {
  name: string;
  properties: Record<string, {
    type: string;
    description?: string;
    required?: boolean;
    format?: string;
    enum?: any[];
    default?: any;
    items?: any;
    properties?: Record<string, any>;
  }>;
  description?: string;
}

/**
 * Generate API documentation from endpoints
 * 
 * @param options API documentation options
 * @returns Generated API documentation
 */
export function generateAPIDocs(
  options: {
    title: string;
    description?: string;
    version?: string;
    endpoints: Array<{
      path: string;
      method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD';
      summary: string;
      description?: string;
      parameters?: Array<{
        name: string;
        in: 'path' | 'query' | 'header' | 'cookie' | 'body';
        required?: boolean;
        description?: string;
        schema?: {
          type: 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object';
          format?: string;
          items?: any;
          properties?: Record<string, any>;
          required?: string[];
        };
      }>;
      requestBody?: {
        description?: string;
        required?: boolean;
        content: Record<string, {
          schema: {
            type: 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object';
            properties?: Record<string, any>;
            required?: string[];
            items?: any;
          };
        }>;
      };
      responses: Record<string, {
        description: string;
        content?: Record<string, {
          schema: {
            type: 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object';
            properties?: Record<string, any>;
            required?: string[];
            items?: any;
          };
        }>;
      }>;
      tags?: string[];
      security?: Array<Record<string, string[]>>;
    }>;
    securitySchemes?: Record<string, {
      type: 'apiKey' | 'http' | 'oauth2' | 'openIdConnect';
      description?: string;
      name?: string;
      in?: 'query' | 'header' | 'cookie';
      scheme?: string;
      bearerFormat?: string;
      flows?: {
        implicit?: {
          authorizationUrl: string;
          refreshUrl?: string;
          scopes: Record<string, string>;
        };
        password?: {
          tokenUrl: string;
          refreshUrl?: string;
          scopes: Record<string, string>;
        };
        clientCredentials?: {
          tokenUrl: string;
          refreshUrl?: string;
          scopes: Record<string, string>;
        };
        authorizationCode?: {
          authorizationUrl: string;
          tokenUrl: string;
          refreshUrl?: string;
          scopes: Record<string, string>;
        };
      };
      openIdConnectUrl?: string;
    }>;
    tags?: Array<{
      name: string;
      description?: string;
    }>;
    servers?: Array<{
      url: string;
      description?: string;
    }>;
    outputFormat?: 'json' | 'yaml' | 'markdown' | 'html';
    includeExamples?: boolean;
  }
): string {
  // Create the OpenAPI document
  const apiDoc: APIDocumentation = {
    openapi: '3.0.0',
    info: {
      title: options.title,
      description: options.description,
      version: options.version || '1.0.0',
    },
    paths: {},
  };
  
  // Add the components section if security schemes are provided
  if (options.securitySchemes) {
    apiDoc.components = {
      securitySchemes: options.securitySchemes,
    };
  }
  
  // Add tags if provided
  if (options.tags) {
    apiDoc.tags = options.tags;
  }
  
  // Add servers if provided
  if (options.servers) {
    apiDoc.servers = options.servers;
  }
  
  // Generate paths from endpoints
  for (const endpoint of options.endpoints) {
    // Initialize path if it doesn't exist
    if (!apiDoc.paths[endpoint.path]) {
      apiDoc.paths[endpoint.path] = {};
    }
    
    // Add the endpoint method
    apiDoc.paths[endpoint.path][endpoint.method.toLowerCase()] = {
      summary: endpoint.summary,
      description: endpoint.description,
      parameters: endpoint.parameters,
      requestBody: endpoint.requestBody,
      responses: endpoint.responses,
      tags: endpoint.tags,
      security: endpoint.security,
    };
  }
  
  // Format the output based on the specified format
  const outputFormat = options.outputFormat || 'json';
  
  switch (outputFormat) {
    case 'json':
      return JSON.stringify(apiDoc, null, 2);
    case 'yaml':
      return convertToYaml(apiDoc, options.includeExamples || false);
    case 'markdown':
      return convertToMarkdown(apiDoc, options.includeExamples || false);
    case 'html':
      return convertToHtml(apiDoc, options.includeExamples || false);
    default:
      return JSON.stringify(apiDoc, null, 2);
  }
}

/**
 * Parse API documentation from source code
 * 
 * @param options Parse options
 * @returns Parsed API documentation
 */
export async function parseAPIDocs(
  options: {
    sourcePath: string;
    filePatterns?: string[];
    includeRoutes?: boolean;
    includeControllers?: boolean;
    includeModels?: boolean;
    framework?: 'express' | 'nest' | 'fastify' | 'koa' | 'hapi' | 'auto';
    outputFormat?: 'json' | 'yaml' | 'markdown' | 'html';
  }
): Promise<string> {
  // Default options
  const includeRoutes = options.includeRoutes !== false;
  const includeControllers = options.includeControllers !== false;
  const includeModels = options.includeModels !== false;
  const framework = options.framework || 'auto';
  const outputFormat = options.outputFormat || 'json';
  
  // Detect the framework if set to auto
  const detectedFramework = await detectFramework(options.sourcePath);
  const actualFramework = framework === 'auto' ? detectedFramework : framework;
  
  // Find all relevant files
  const files = await findFiles(options.sourcePath, options.filePatterns || getDefaultFilePatterns(actualFramework));
  
  // Parse the files
  const routes: ParsedRoute[] = [];
  const models: ParsedModel[] = [];
  
  for (const file of files) {
    if (includeRoutes || includeControllers) {
      const parsedRoutes = await parseRoutesFromFile(file, actualFramework);
      routes.push(...parsedRoutes);
    }
    
    if (includeModels) {
      const parsedModels = await parseModelsFromFile(file, actualFramework);
      models.push(...parsedModels);
    }
  }
  
  // Create the API documentation
  const apiDoc: APIDocumentation = {
    openapi: '3.0.0',
    info: {
      title: path.basename(options.sourcePath),
      description: `API documentation for ${path.basename(options.sourcePath)}`,
      version: '1.0.0',
    },
    paths: {},
  };
  
  // Add paths from routes
  for (const route of routes) {
    // Initialize path if it doesn't exist
    if (!apiDoc.paths[route.path]) {
      apiDoc.paths[route.path] = {};
    }
    
    // Add the route method
    apiDoc.paths[route.path][route.method.toLowerCase()] = {
      summary: route.summary,
      description: route.description,
      parameters: route.parameters,
      requestBody: route.requestBody,
      responses: route.responses,
      tags: route.tags,
    };
  }
  
  // Add schemas from models
  if (models.length > 0) {
    if (!apiDoc.components) {
      apiDoc.components = {};
    }
    
    apiDoc.components.schemas = {};
    
    for (const model of models) {
      apiDoc.components.schemas[model.name] = {
        type: 'object',
        properties: model.properties,
        description: model.description,
      };
    }
  }
  
  // Format the output based on the specified format
  switch (outputFormat) {
    case 'json':
      return JSON.stringify(apiDoc, null, 2);
    case 'yaml':
      return convertToYaml(apiDoc, true);
    case 'markdown':
      return convertToMarkdown(apiDoc, true);
    case 'html':
      return convertToHtml(apiDoc, true);
    default:
      return JSON.stringify(apiDoc, null, 2);
  }
}

/**
 * Detect the framework used in a project
 * 
 * @param sourcePath Source path
 * @returns Detected framework
 */
async function detectFramework(sourcePath: string): Promise<'express' | 'nest' | 'fastify' | 'koa' | 'hapi'> {
  try {
    // Look for package.json
    const packageJsonPath = path.join(sourcePath, 'package.json');
    
    try {
      const packageJsonContent = await fs.readFile(packageJsonPath, 'utf8');
      const packageJson = JSON.parse(packageJsonContent);
      
      const dependencies = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
      };
      
      if (dependencies['@nestjs/core']) {
        return 'nest';
      } else if (dependencies.fastify) {
        return 'fastify';
      } else if (dependencies.koa) {
        return 'koa';
      } else if (dependencies.hapi || dependencies['@hapi/hapi']) {
        return 'hapi';
      } else if (dependencies.express) {
        return 'express';
      }
    } catch (error) {
      // No package.json or other error
    }
    
    // Look for framework-specific files
    const files = await fs.readdir(sourcePath, { recursive: true });
    
    // Check for NestJS
    if (files.some(file => file.includes('nest-cli.json'))) {
      return 'nest';
    }
    
    // Default to Express
    return 'express';
  } catch (error) {
    return 'express';
  }
}

/**
 * Get default file patterns for a framework
 * 
 * @param framework Framework
 * @returns Default file patterns
 */
function getDefaultFilePatterns(framework: 'express' | 'nest' | 'fastify' | 'koa' | 'hapi'): string[] {
  switch (framework) {
    case 'nest':
      return ['**/*.controller.ts', '**/*.service.ts', '**/*.entity.ts', '**/*.dto.ts'];
    case 'express':
      return ['**/*.js', '**/*.ts', '**/*.route.js', '**/*.route.ts', '**/*.model.js', '**/*.model.ts'];
    case 'fastify':
      return ['**/*.js', '**/*.ts', '**/*.route.js', '**/*.route.ts', '**/*.schema.js', '**/*.schema.ts'];
    case 'koa':
      return ['**/*.js', '**/*.ts', '**/*.route.js', '**/*.route.ts', '**/*.model.js', '**/*.model.ts'];
    case 'hapi':
      return ['**/*.js', '**/*.ts', '**/*.route.js', '**/*.route.ts', '**/*.model.js', '**/*.model.ts'];
    default:
      return ['**/*.js', '**/*.ts'];
  }
}

/**
 * Find files matching patterns
 * 
 * @param sourcePath Source path
 * @param patterns File patterns
 * @returns Found files
 */
async function findFiles(sourcePath: string, patterns: string[]): Promise<string[]> {
  try {
    // List all files
    const files = await fs.readdir(sourcePath, { recursive: true });
    
    // Filter files matching patterns
    const matchingFiles: string[] = [];
    
    for (const file of files) {
      for (const pattern of patterns) {
        // Simple pattern matching
        if (file.match(new RegExp(pattern.replace('**/', '').replace(/\*/g, '.*')))) {
          matchingFiles.push(path.join(sourcePath, file.toString()));
          break;
        }
      }
    }
    
    return matchingFiles;
  } catch (error) {
    return [];
  }
}

/**
 * Parse routes from a file
 * 
 * @param filePath File path
 * @param framework Framework
 * @returns Parsed routes
 */
async function parseRoutesFromFile(filePath: string, framework: 'express' | 'nest' | 'fastify' | 'koa' | 'hapi'): Promise<ParsedRoute[]> {
  try {
    // Read the file
    const content = await fs.readFile(filePath, 'utf8');
    
    // Parse the file based on the framework
    switch (framework) {
      case 'nest':
        return parseNestRoutes(content, filePath);
      case 'express':
        return parseExpressRoutes(content, filePath);
      case 'fastify':
        return parseFastifyRoutes(content, filePath);
      case 'koa':
        return parseKoaRoutes(content, filePath);
      case 'hapi':
        return parseHapiRoutes(content, filePath);
      default:
        return [];
    }
  } catch (error) {
    return [];
  }
}

/**
 * Parse models from a file
 * 
 * @param filePath File path
 * @param framework Framework
 * @returns Parsed models
 */
async function parseModelsFromFile(filePath: string, framework: 'express' | 'nest' | 'fastify' | 'koa' | 'hapi'): Promise<ParsedModel[]> {
  try {
    // Read the file
    const content = await fs.readFile(filePath, 'utf8');
    
    // Parse the file based on the framework
    switch (framework) {
      case 'nest':
        return parseNestModels(content, filePath);
      case 'express':
        return parseExpressModels(content, filePath);
      case 'fastify':
        return parseFastifyModels(content, filePath);
      case 'koa':
        return parseKoaModels(content, filePath);
      case 'hapi':
        return parseHapiModels(content, filePath);
      default:
        return [];
    }
  } catch (error) {
    return [];
  }
}

/**
 * Parse NestJS routes
 * 
 * @param content File content
 * @param filePath File path
 * @returns Parsed routes
 */
function parseNestRoutes(content: string, filePath: string): ParsedRoute[] {
  const routes: ParsedRoute[] = [];
  
  // Look for controller class
  const controllerMatch = content.match(/@Controller\(['"]?(.*?)['"]?\)/);
  if (!controllerMatch) {
    return routes;
  }
  
  const controllerPrefix = controllerMatch[1] || '';
  const controllerName = path.basename(filePath).replace('.controller.ts', '');
  
  // Look for route handlers
  const methodRegex = /@(Get|Post|Put|Delete|Patch|Options|Head)\(['"]?(.*?)['"]?\)[\s\S]*?async\s+(\w+)/g;
  
  let match;
  while ((match = methodRegex.exec(content)) !== null) {
    const method = match[1].toUpperCase();
    const routePath = match[2] || '';
    const handler = match[3];
    
    // Look for method documentation
    const docCommentRegex = new RegExp(`\\/\\*\\*[\\s\\S]*?\\*\\/[\\s\\n]*@${match[1]}\\(['"]?${routePath}['"]?\\)`);
    const docMatch = content.match(docCommentRegex);
    
    let summary = handler;
    let description = '';
    
    if (docMatch) {
      const docComment = docMatch[0];
      
      // Extract summary and description
      const summaryMatch = docComment.match(/@summary\s+(.*?)(\n|$)/);
      const descriptionMatch = docComment.match(/@description\s+(.*?)(\n|$)/);
      
      if (summaryMatch) {
        summary = summaryMatch[1].trim();
      }
      
      if (descriptionMatch) {
        description = descriptionMatch[1].trim();
      }
    }
    
    // Create the path by combining controller prefix and route path
    const fullPath = `/${controllerPrefix}/${routePath}`.replace(/\/+/g, '/').replace(/\/$/, '');
    
    // Create the route
    routes.push({
      path: fullPath,
      method,
      summary,
      description,
      controller: controllerName,
      handler,
      tags: [controllerName],
      responses: {
        '200': {
          description: 'Successful operation',
        },
      },
    });
  }
  
  return routes;
}

/**
 * Parse Express routes
 * 
 * @param content File content
 * @param filePath File path
 * @returns Parsed routes
 */
function parseExpressRoutes(content: string, filePath: string): ParsedRoute[] {
  const routes: ParsedRoute[] = [];
  
  // Look for route definitions
  const routeRegex = /\.(get|post|put|delete|patch|options|head)\(['"]([^'"]+)['"]\s*,\s*(?:async\s*)?\(?(?:\w+,\s*\w+(?:,\s*\w+)*)?\)?\s*(?:=>|{)/g;
  
  let match;
  while ((match = routeRegex.exec(content)) !== null) {
    const method = match[1].toUpperCase();
    const routePath = match[2];
    
    // Create a handler name from the path
    const handler = `handle${method}${routePath.split('/').filter(Boolean).map(p => p.replace(/:/g, '')).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('')}`;
    
    // Create the route
    routes.push({
      path: routePath,
      method,
      summary: `Handle ${method} ${routePath}`,
      controller: path.basename(filePath).replace('.js', '').replace('.ts', ''),
      handler,
      responses: {
        '200': {
          description: 'Successful operation',
        },
      },
    });
  }
  
  return routes;
}

/**
 * Parse Fastify routes
 * 
 * @param content File content
 * @param filePath File path
 * @returns Parsed routes
 */
function parseFastifyRoutes(content: string, filePath: string): ParsedRoute[] {
  const routes: ParsedRoute[] = [];
  
  // Look for route definitions
  const routeRegex = /\.route\(\s*{\s*method:\s*['"]([^'"]+)['"]\s*,\s*url:\s*['"]([^'"]+)['"]\s*,/g;
  
  let match;
  while ((match = routeRegex.exec(content)) !== null) {
    const method = match[1].toUpperCase();
    const routePath = match[2];
    
    // Create a handler name from the path
    const handler = `handle${method}${routePath.split('/').filter(Boolean).map(p => p.replace(/:/g, '')).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('')}`;
    
    // Create the route
    routes.push({
      path: routePath,
      method,
      summary: `Handle ${method} ${routePath}`,
      controller: path.basename(filePath).replace('.js', '').replace('.ts', ''),
      handler,
      responses: {
        '200': {
          description: 'Successful operation',
        },
      },
    });
  }
  
  return routes;
}

/**
 * Parse Koa routes
 * 
 * @param content File content
 * @param filePath File path
 * @returns Parsed routes
 */
function parseKoaRoutes(content: string, filePath: string): ParsedRoute[] {
  const routes: ParsedRoute[] = [];
  
  // Look for route definitions
  const routeRegex = /\.(get|post|put|delete|patch|options|head)\(['"]([^'"]+)['"]/g;
  
  let match;
  while ((match = routeRegex.exec(content)) !== null) {
    const method = match[1].toUpperCase();
    const routePath = match[2];
    
    // Create a handler name from the path
    const handler = `handle${method}${routePath.split('/').filter(Boolean).map(p => p.replace(/:/g, '')).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('')}`;
    
    // Create the route
    routes.push({
      path: routePath,
      method,
      summary: `Handle ${method} ${routePath}`,
      controller: path.basename(filePath).replace('.js', '').replace('.ts', ''),
      handler,
      responses: {
        '200': {
          description: 'Successful operation',
        },
      },
    });
  }
  
  return routes;
}

/**
 * Parse Hapi routes
 * 
 * @param content File content
 * @param filePath File path
 * @returns Parsed routes
 */
function parseHapiRoutes(content: string, filePath: string): ParsedRoute[] {
  const routes: ParsedRoute[] = [];
  
  // Look for route definitions
  const routeRegex = /\.route\(\s*{\s*method:\s*['"]([^'"]+)['"]\s*,\s*path:\s*['"]([^'"]+)['"]\s*,/g;
  
  let match;
  while ((match = routeRegex.exec(content)) !== null) {
    const method = match[1].toUpperCase();
    const routePath = match[2];
    
    // Create a handler name from the path
    const handler = `handle${method}${routePath.split('/').filter(Boolean).map(p => p.replace(/:/g, '')).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('')}`;
    
    routes.push({
      path: routePath,
      method,
      summary: `Handle ${method} ${routePath}`,
      controller: path.basename(filePath).replace('.js', '').replace('.ts', ''),
      handler,
      responses: {
        '200': {
          description: 'Successful operation',
        },
      },
    });
  }
  
  return routes;
}

/**
 * Convert OpenAPI spec to YAML format
 * 
 * @param spec OpenAPI specification
 * @param includeExamples Whether to include examples
 * @returns YAML string
 */
function convertToYaml(spec: APIDocumentation, includeExamples: boolean): string {
  // Implementation would use a library like js-yaml
  return JSON.stringify(spec, null, 2); // Placeholder implementation
}

/**
 * Convert OpenAPI spec to Markdown format
 * 
 * @param spec OpenAPI specification
 * @param includeExamples Whether to include examples
 * @returns Markdown string
 */
function convertToMarkdown(spec: APIDocumentation, includeExamples: boolean): string {
  // Implementation would convert the OpenAPI spec to markdown documentation
  return JSON.stringify(spec, null, 2); // Placeholder implementation
}

/**
 * Convert OpenAPI spec to HTML format
 * 
 * @param spec OpenAPI specification
 * @param includeExamples Whether to include examples
 * @returns HTML string
 */
function convertToHtml(spec: APIDocumentation, includeExamples: boolean): string {
  // Implementation would convert the OpenAPI spec to HTML documentation
  return JSON.stringify(spec, null, 2); // Placeholder implementation
}

/**
 * Parse models from NestJS application
 * 
 * @param content File content
 * @param filePath File path
 * @returns Parsed models
 */
function parseNestModels(content: string, filePath: string): ParsedModel[] {
  // Implementation would extract model definitions from NestJS decorators
  return []; // Placeholder implementation
}

/**
 * Parse models from Express application
 * 
 * @param content File content
 * @param filePath File path
 * @returns Parsed models
 */
function parseExpressModels(content: string, filePath: string): ParsedModel[] {
  // Implementation would extract model definitions from Express routes
  return []; // Placeholder implementation
}

/**
 * Parse models from Fastify application
 * 
 * @param content File content
 * @param filePath File path
 * @returns Parsed models
 */
function parseFastifyModels(content: string, filePath: string): ParsedModel[] {
  // Implementation would extract model definitions from Fastify schemas
  return []; // Placeholder implementation
}

/**
 * Parse models from Koa application
 * 
 * @param content File content
 * @param filePath File path
 * @returns Parsed models
 */
function parseKoaModels(content: string, filePath: string): ParsedModel[] {
  // Implementation would extract model definitions from Koa routes
  return []; // Placeholder implementation
}

/**
 * Parse models from Hapi application
 * 
 * @param content File content
 * @param filePath File path
 * @returns Parsed models
 */
function parseHapiModels(content: string, filePath: string): ParsedModel[] {
  // Implementation would extract model definitions from Hapi routes
  return []; // Placeholder implementation
}
