// Auto-generated safe fallback for service-builder

export function activate() {
    console.log("[TOOL] service-builder activated (passive mode)");
}

/**
 * Handles file write events for service, gateway, or orchestrator config files.
 * If a relevant file changes, auto-generates the corresponding boilerplate.
 */
export async function onFileWrite(event?: { path: string; content?: string }) {
  if (!event || !event.path) {
    console.warn("[service-builder] onFileWrite called without event data.");
    return;
  }
  try {
    if (event.path.endsWith('.service.json')) {
      console.log(`[service-builder] Detected service config file change: ${event.path}`);
      const config = JSON.parse(event.content || await (await import('fs/promises')).readFile(event.path, 'utf-8'));
      await handleCreateService(config);
      console.log(`[service-builder] Service boilerplate regenerated for ${event.path}`);
    } else if (event.path.endsWith('.gateway.json')) {
      console.log(`[service-builder] Detected gateway config file change: ${event.path}`);
      const config = JSON.parse(event.content || await (await import('fs/promises')).readFile(event.path, 'utf-8'));
      await handleCreateGateway(config);
      console.log(`[service-builder] Gateway boilerplate regenerated for ${event.path}`);
    } else if (event.path.endsWith('.orchestrator.json')) {
      console.log(`[service-builder] Detected orchestrator config file change: ${event.path}`);
      const config = JSON.parse(event.content || await (await import('fs/promises')).readFile(event.path, 'utf-8'));
      await handleCreateOrchestrator(config);
      console.log(`[service-builder] Orchestrator boilerplate regenerated for ${event.path}`);
    }
  } catch (err) {
    console.error(`[service-builder] Error during file-triggered generation:`, err);
  }
}

/**
 * Initializes or resets service builder state at the start of a session.
 */
export function onSessionStart(session?: { id?: string }) {
  console.log(`[service-builder] Session started${session && session.id ? `: ${session.id}` : ""}. Preparing service builder environment.`);
  // Example: clear temp files, reset state, etc.
  // ... actual reset logic
}

/**
 * Handles service-builder commands.
 * Supports dynamic invocation of service/gateway/orchestrator creation or validation.
 */
export async function onCommand(command?: { name: string; args?: any }) {
  if (!command || !command.name) {
    console.warn("[service-builder] onCommand called without command data.");
    return;
  }
  switch (command.name) {
    case "create-service":
      console.log("[service-builder] Creating microservice...");
      try {
        await handleCreateService(command.args);
        console.log("[service-builder] Microservice creation complete.");
      } catch (err) {
        console.error("[service-builder] Microservice creation failed:", err);
      }
      break;
    case "create-gateway":
      console.log("[service-builder] Creating API gateway...");
      try {
        await handleCreateGateway(command.args);
        console.log("[service-builder] API gateway creation complete.");
      } catch (err) {
        console.error("[service-builder] API gateway creation failed:", err);
      }
      break;
    case "create-orchestrator":
      console.log("[service-builder] Creating orchestrator configuration...");
      try {
        await handleCreateOrchestrator(command.args);
        console.log("[service-builder] Orchestrator creation complete.");
      } catch (err) {
        console.error("[service-builder] Orchestrator creation failed:", err);
      }
      break;
    case "validate-service":
      console.log("[service-builder] Validating service configuration...");
      try {
        CreateServiceSchema.parse(command.args);
        console.log("[service-builder] Service validation successful.");
      } catch (err) {
        console.error("[service-builder] Service validation failed:", err);
      }
      break;
    case "validate-gateway":
      console.log("[service-builder] Validating gateway configuration...");
      try {
        CreateGatewaySchema.parse(command.args);
        console.log("[service-builder] Gateway validation successful.");
      } catch (err) {
        console.error("[service-builder] Gateway validation failed:", err);
      }
      break;
    case "validate-orchestrator":
      console.log("[service-builder] Validating orchestrator configuration...");
      try {
        CreateOrchestratorSchema.parse(command.args);
        console.log("[service-builder] Orchestrator validation successful.");
      } catch (err) {
        console.error("[service-builder] Orchestrator validation failed:", err);
      }
      break;
    default:
      console.warn(`[service-builder] Unknown command: ${command.name}`);
  }
}
/**
 * ServiceBuilder Tool
 * 
 * Creates boilerplate for microservice architectures
 * Sets up inter-service communication and API gateways
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { z } from 'zod';

/**
 * Exported generator functions for orchestrator, package, etc.
 * These are stubs and should be implemented in generators.ts.
 */
export function generateOrchestrator(options: any): Record<string, string> {
  return {};
}

// All other generator stubs (not exported for index.ts)
function generatePackageJson(options: any): string { return ''; }
function generateReadme(options: any): string { return ''; }
function generateGitignore(): string { return ''; }
function generateTsConfig(): string { return ''; }
function generateDockerfile(options: any): string { return ''; }
function generateDockerignore(): string { return ''; }
function generateExpressApp(options: any): string { return ''; }
function generateExpressServer(options: any): string { return ''; }
function generateExpressRouteIndex(options: any): string { return ''; }
function groupEndpointsByBasePath(endpoints: any[]): Record<string, any[]> { return {}; }
function generateExpressRoutes(routeName: string, endpoints: any[], options: any): string { return ''; }
function generateModelIndex(options: any): string { return ''; }
function generateModel(model: any, options: any): string { return ''; }
function generateAuthMiddleware(options: any): string { return ''; }
function generateConfig(options: any): string { return ''; }
function generateLogger(options: any): string { return ''; }
function generateEnvExample(options: any): string { return ''; }
function generateFastifyApp(options: any): string { return ''; }
function generateFastifyServer(options: any): string { return ''; }
function generateFastifyRouteIndex(options: any): string { return ''; }
function generateFastifyRoutes(routeName: string, endpoints: any[], options: any): string { return ''; }
function generateFastifyAuthPlugin(options: any): string { return ''; }
function generateNestJsMain(options: any): string { return ''; }
function generateNestJsAppModule(options: any): string { return ''; }
function generateNestJsModule(moduleName: string, options: any): string { return ''; }
function generateNestJsController(moduleName: string, endpoints: any[], options: any): string { return ''; }
function generateNestJsService(moduleName: string, endpoints: any[], options: any): string { return ''; }
function generateNestJsDtoIndex(moduleName: string, endpoints: any[]): string { return ''; }
function generateNestJsDto(endpoint: any, options: any): string { return ''; }
function generateNestJsEntity(model: any, options: any): string { return ''; }
function generateNestJsAuthModule(options: any): string { return ''; }
function generateNestJsAuthService(options: any): string { return ''; }
function generateNestJsAuthController(options: any): string { return ''; }
function generateNestJsJwtAuthGuard(options: any): string { return ''; }
function generateNestJsJwtStrategy(options: any): string { return ''; }
function generateNestJsConfig(options: any): string { return ''; }
function generateNestJsHttpExceptionFilter(options: any): string { return ''; }
function generateNestJsLoggingInterceptor(options: any): string { return ''; }
function generateApolloServer(options: any): string { return ''; }
function generateApolloSchema(options: any): string { return ''; }
function generateApolloResolverIndex(options: any): string { return ''; }
function generateApolloResolver(model: any, options: any): string { return ''; }
function generateApolloAuth(options: any): string { return ''; }
function generateGrpcServer(options: any): string { return ''; }
function generateProtoDefinition(options: any): string { return ''; }
function generateGrpcServiceIndex(options: any): string { return ''; }
function generateGrpcService(model: any, options: any): string { return ''; }
function generateGrpcAuthMiddleware(options: any): string { return ''; }
function generateSocketIoServer(options: any): string { return ''; }
function generateSocketIoEventIndex(options: any): string { return ''; }
function generateSocketIoEvents(eventName: string, endpoints: any[], options: any): string { return ''; }
function generateSocketIoAuthMiddleware(options: any): string { return ''; }
function generateMessagingServer(options: any): string { return ''; }
function generateConsumerIndex(options: any): string { return ''; }
function generateProducerIndex(options: any): string { return ''; }
function generateConsumer(topicName: string, endpoints: any[], options: any): string { return ''; }
function generateProducer(topicName: string, endpoints: any[], options: any): string { return ''; }
function generateGatewayReadme(options: any): string { return ''; }
function generateGatewayPackageJson(options: any): string { return ''; }

/**
 * Export schemas and handlers for use in index.ts and other modules.
 * (Exports are handled at the point of definition below.)
 */

// Define schemas for ServiceBuilder tool
export const CreateServiceSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  type: z.enum(['rest', 'graphql', 'grpc', 'websocket', 'event-driven']),
  framework: z.enum(['express', 'fastify', 'koa', 'nestjs', 'apollo', 'grpc-node', 'socket.io', 'kafka', 'rabbitmq']),
  language: z.enum(['typescript', 'javascript']),
  database: z.enum(['mongodb', 'postgresql', 'mysql', 'sqlite', 'none']).optional(),
  authentication: z.boolean().default(false),
  authorization: z.boolean().default(false),
  containerization: z.boolean().default(false),
  endpoints: z.array(
    z.object({
      path: z.string(),
      method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD']).optional(),
      description: z.string().optional(),
      requestBody: z.object({
        type: z.string(),
        properties: z.record(z.object({
          type: z.string(),
          description: z.string().optional(),
          required: z.boolean().default(false),
        })),
      }).optional(),
      responseBody: z.object({
        type: z.string(),
        properties: z.record(z.object({
          type: z.string(),
          description: z.string().optional(),
        })),
      }).optional(),
      authentication: z.boolean().default(false),
      authorization: z.boolean().default(false),
    })
  ).optional(),
  models: z.array(
    z.object({
      name: z.string(),
      description: z.string().optional(),
      fields: z.record(z.object({
        type: z.string(),
        description: z.string().optional(),
        required: z.boolean().default(false),
        unique: z.boolean().default(false),
        default: z.any().optional(),
        ref: z.string().optional(),
      })),
    })
  ).optional(),
  outputDir: z.string().optional(),
});

export const CreateGatewaySchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  type: z.enum(['api-gateway', 'bff', 'graphql-federation', 'grpc-proxy']),
  framework: z.enum(['express', 'fastify', 'koa', 'nestjs', 'apollo', 'envoy', 'kong', 'traefik']),
  language: z.enum(['typescript', 'javascript', 'yaml', 'none']),
  services: z.array(
    z.object({
      name: z.string(),
      url: z.string(),
      type: z.enum(['rest', 'graphql', 'grpc', 'websocket', 'event-driven']),
      routes: z.array(
        z.object({
          path: z.string(),
          method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD', 'ANY']).optional(),
          target: z.string(),
          authentication: z.boolean().default(false),
          authorization: z.boolean().default(false),
          rateLimit: z.object({
            limit: z.number(),
            period: z.string(),
          }).optional(),
          caching: z.object({
            ttl: z.number(),
            strategy: z.enum(['memory', 'redis', 'none']),
          }).optional(),
        })
      ).optional(),
    })
  ),
  authentication: z.object({
    type: z.enum(['jwt', 'oauth2', 'api-key', 'basic', 'none']),
    provider: z.string().optional(),
    config: z.record(z.any()).optional(),
  }).optional(),
  rateLimit: z.object({
    global: z.object({
      limit: z.number(),
      period: z.string(),
    }).optional(),
    perService: z.boolean().default(false),
    perRoute: z.boolean().default(false),
    perUser: z.boolean().default(false),
  }).optional(),
  logging: z.object({
    level: z.enum(['debug', 'info', 'warn', 'error']),
    format: z.enum(['json', 'text']),
    destination: z.enum(['console', 'file', 'service']),
  }).optional(),
  monitoring: z.object({
    enabled: z.boolean().default(false),
    type: z.enum(['prometheus', 'datadog', 'newrelic', 'custom']).optional(),
    config: z.record(z.any()).optional(),
  }).optional(),
  containerization: z.boolean().default(false),
  outputDir: z.string().optional(),
});

export const CreateOrchestratorSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  type: z.enum(['kubernetes', 'docker-compose', 'aws-ecs', 'azure-aks', 'gcp-gke']),
  services: z.array(
    z.object({
      name: z.string(),
      image: z.string().optional(),
      replicas: z.number().default(1),
      ports: z.array(
        z.object({
          internal: z.number(),
          external: z.number().optional(),
          protocol: z.enum(['tcp', 'udp']).default('tcp'),
        })
      ).optional(),
      environment: z.record(z.string()).optional(),
      volumes: z.array(
        z.object({
          source: z.string(),
          target: z.string(),
          type: z.enum(['bind', 'volume']).default('volume'),
        })
      ).optional(),
      resources: z.object({
        limits: z.object({
          cpu: z.string().optional(),
          memory: z.string().optional(),
        }).optional(),
        requests: z.object({
          cpu: z.string().optional(),
          memory: z.string().optional(),
        }).optional(),
      }).optional(),
      healthCheck: z.object({
        path: z.string().optional(),
        port: z.number().optional(),
        initialDelay: z.number().optional(),
        period: z.number().optional(),
        timeout: z.number().optional(),
        retries: z.number().optional(),
      }).optional(),
      dependencies: z.array(z.string()).optional(),
    })
  ),
  networks: z.array(
    z.object({
      name: z.string(),
      driver: z.string().optional(),
      services: z.array(z.string()),
    })
  ).optional(),
  volumes: z.array(
    z.object({
      name: z.string(),
      driver: z.string().optional(),
      size: z.string().optional(),
    })
  ).optional(),
  ingress: z.object({
    enabled: z.boolean().default(false),
    type: z.enum(['nginx', 'traefik', 'istio', 'ambassador', 'kong']).optional(),
    config: z.record(z.any()).optional(),
  }).optional(),
  monitoring: z.object({
    enabled: z.boolean().default(false),
    type: z.enum(['prometheus', 'datadog', 'newrelic', 'custom']).optional(),
    config: z.record(z.any()).optional(),
  }).optional(),
  logging: z.object({
    enabled: z.boolean().default(false),
    type: z.enum(['elasticsearch', 'fluentd', 'loki', 'custom']).optional(),
    config: z.record(z.any()).optional(),
  }).optional(),
  outputDir: z.string().optional(),
});

// Types for service generation
interface Endpoint {
  path: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD';
  description?: string;
  requestBody?: {
    type: string;
    properties: Record<string, {
      type: string;
      description?: string;
      required: boolean;
    }>;
  };
  responseBody?: {
    type: string;
    properties: Record<string, {
      type: string;
      description?: string;
    }>;
  };
  authentication: boolean;
  authorization: boolean;
}

interface Model {
  name: string;
  description?: string;
  fields: Record<string, {
    type: string;
    description?: string;
    required: boolean;
    unique: boolean;
    default?: any;
    ref?: string;
  }>;
}

interface ServiceOptions {
  name: string;
  description?: string;
  type: 'rest' | 'graphql' | 'grpc' | 'websocket' | 'event-driven';
  framework: 'express' | 'fastify' | 'koa' | 'nestjs' | 'apollo' | 'grpc-node' | 'socket.io' | 'kafka' | 'rabbitmq';
  language: 'typescript' | 'javascript';
  database?: 'mongodb' | 'postgresql' | 'mysql' | 'sqlite' | 'none';
  authentication: boolean;
  authorization: boolean;
  containerization: boolean;
  endpoints?: Endpoint[];
  models?: Model[];
  outputDir?: string;
}

interface Route {
  path: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD' | 'ANY';
  target: string;
  authentication: boolean;
  authorization: boolean;
  rateLimit?: {
    limit: number;
    period: string;
  };
  caching?: {
    ttl: number;
    strategy: 'memory' | 'redis' | 'none';
  };
}

interface Service {
  name: string;
  url: string;
  type: 'rest' | 'graphql' | 'grpc' | 'websocket' | 'event-driven';
  routes?: Route[];
}

interface GatewayOptions {
  name: string;
  description?: string;
  type: 'api-gateway' | 'bff' | 'graphql-federation' | 'grpc-proxy';
  framework: 'express' | 'fastify' | 'koa' | 'nestjs' | 'apollo' | 'envoy' | 'kong' | 'traefik';
  language: 'typescript' | 'javascript' | 'yaml' | 'none';
  services: Service[];
  authentication?: {
    type: 'jwt' | 'oauth2' | 'api-key' | 'basic' | 'none';
    provider?: string;
    config?: Record<string, any>;
  };
  rateLimit?: {
    global?: {
      limit: number;
      period: string;
    };
    perService: boolean;
    perRoute: boolean;
    perUser: boolean;
  };
  logging?: {
    level: 'debug' | 'info' | 'warn' | 'error';
    format: 'json' | 'text';
    destination: 'console' | 'file' | 'service';
  };
  monitoring?: {
    enabled: boolean;
    type?: 'prometheus' | 'datadog' | 'newrelic' | 'custom';
    config?: Record<string, any>;
  };
  containerization: boolean;
  outputDir?: string;
}

interface ServiceConfig {
  name: string;
  image?: string;
  replicas: number;
  ports?: {
    internal: number;
    external?: number;
    protocol: 'tcp' | 'udp';
  }[];
  environment?: Record<string, string>;
  volumes?: {
    source: string;
    target: string;
    type: 'bind' | 'volume';
  }[];
  resources?: {
    limits?: {
      cpu?: string;
      memory?: string;
    };
    requests?: {
      cpu?: string;
      memory?: string;
    };
  };
  healthCheck?: {
    path?: string;
    port?: number;
    initialDelay?: number;
    period?: number;
    timeout?: number;
    retries?: number;
  };
  dependencies?: string[];
}

interface Network {
  name: string;
  driver?: string;
  services: string[];
}

interface Volume {
  name: string;
  driver?: string;
  size?: string;
}

interface OrchestratorOptions {
  name: string;
  description?: string;
  type: 'kubernetes' | 'docker-compose' | 'aws-ecs' | 'azure-aks' | 'gcp-gke';
  services: ServiceConfig[];
  networks?: Network[];
  volumes?: Volume[];
  ingress?: {
    enabled: boolean;
    type?: 'nginx' | 'traefik' | 'istio' | 'ambassador' | 'kong';
    config?: Record<string, any>;
  };
  monitoring?: {
    enabled: boolean;
    type?: 'prometheus' | 'datadog' | 'newrelic' | 'custom';
    config?: Record<string, any>;
  };
  logging?: {
    enabled: boolean;
    type?: 'elasticsearch' | 'fluentd' | 'loki' | 'custom';
    config?: Record<string, any>;
  };
  outputDir?: string;
}

/**
 * Create a microservice
 */
export async function handleCreateService(args: any) {
  try {
    const options = args as ServiceOptions;
    
    // Generate the service based on the framework and type
    const serviceFiles = generateService(options);
    
    // Determine the output directory
    const outputDir = options.outputDir || `./${options.name}`;
    
    // Ensure the output directory exists
    await fs.mkdir(outputDir, { recursive: true });
    
    // Write the service files to disk
    const writtenFiles = [];
    for (const [filename, content] of Object.entries(serviceFiles)) {
      const filePath = path.join(outputDir, filename);
      
      // Ensure the directory exists
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      
      await fs.writeFile(filePath, content);
      writtenFiles.push(filePath);
    }
    
    return {
      content: [{
        type: "text",
        text: `Successfully created microservice ${options.name}:\n${writtenFiles.join('\n')}`
      }],
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error creating microservice: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Create an API gateway
 */
export async function handleCreateGateway(args: any) {
  try {
    const options = args as GatewayOptions;
    
    // Generate the gateway based on the framework and type
    const gatewayFiles = generateGateway(options);
    
    // Determine the output directory
    const outputDir = options.outputDir || `./${options.name}`;
    
    // Ensure the output directory exists
    await fs.mkdir(outputDir, { recursive: true });
    
    // Write the gateway files to disk
    const writtenFiles = [];
    for (const [filename, content] of Object.entries(gatewayFiles)) {
      const filePath = path.join(outputDir, filename);
      
      // Ensure the directory exists
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      
      await fs.writeFile(filePath, content);
      writtenFiles.push(filePath);
    }
    
    return {
      content: [{
        type: "text",
        text: `Successfully created API gateway ${options.name}:\n${writtenFiles.join('\n')}`
      }],
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error creating API gateway: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Create an orchestrator configuration
 */
export async function handleCreateOrchestrator(args: any) {
  try {
    const options = args as OrchestratorOptions;
    
    // Generate the orchestrator based on the type
    const orchestratorFiles = generateOrchestrator(options);
    
    // Determine the output directory
    const outputDir = options.outputDir || `./${options.name}`;
    
    // Ensure the output directory exists
    await fs.mkdir(outputDir, { recursive: true });
    
    // Write the orchestrator files to disk
    const writtenFiles = [];
    for (const [filename, content] of Object.entries(orchestratorFiles)) {
      const filePath = path.join(outputDir, filename);
      
      // Ensure the directory exists
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      
      await fs.writeFile(filePath, content);
      writtenFiles.push(filePath);
    }
    
    return {
      content: [{
        type: "text",
        text: `Successfully created orchestrator configuration ${options.name}:\n${writtenFiles.join('\n')}`
      }],
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error creating orchestrator configuration: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Generate service files based on options
 */
function generateService(options: ServiceOptions): Record<string, string> {
  const files: Record<string, string> = {};
  const extension = options.language === 'typescript' ? '.ts' : '.js';
  
  // Generate package.json
  files['package.json'] = generatePackageJson(options);
  
  // Generate README.md
  files['README.md'] = generateReadme(options);
  
  // Generate .gitignore
  files['.gitignore'] = generateGitignore();
  
  // Generate tsconfig.json if using TypeScript
  if (options.language === 'typescript') {
    files['tsconfig.json'] = generateTsConfig();
  }
  
  // Generate Dockerfile if containerization is enabled
  if (options.containerization) {
    files['Dockerfile'] = generateDockerfile(options);
    files['.dockerignore'] = generateDockerignore();
  }
  
  // Generate service files based on framework and type
  switch (options.framework) {
    case 'express':
      files[`src/app${extension}`] = generateExpressApp(options);
      files[`src/server${extension}`] = generateExpressServer(options);
      
      if (options.endpoints && options.endpoints.length > 0) {
        files[`src/routes/index${extension}`] = generateExpressRouteIndex(options);
        
        // Group endpoints by their base path
        const routeGroups = groupEndpointsByBasePath(options.endpoints);
        
        for (const [basePath, endpoints] of Object.entries(routeGroups)) {
          const routeName = basePath.replace(/^\//, '').replace(/\//g, '-') || 'root';
          files[`src/routes/${routeName}${extension}`] = generateExpressRoutes(routeName, endpoints, options);
        }
      }
      
      if (options.models && options.models.length > 0) {
        files[`src/models/index${extension}`] = generateModelIndex(options);
        
        for (const model of options.models) {
          files[`src/models/${model.name.toLowerCase()}${extension}`] = generateModel(model, options);
        }
      }
      
      if (options.authentication || options.authorization) {
        files[`src/middleware/auth${extension}`] = generateAuthMiddleware(options);
      }
      
      files[`src/config/index${extension}`] = generateConfig(options);
      files[`src/utils/logger${extension}`] = generateLogger(options);
      files[`.env.example`] = generateEnvExample(options);
      break;
    
    case 'fastify':
      files[`src/app${extension}`] = generateFastifyApp(options);
      files[`src/server${extension}`] = generateFastifyServer(options);
      
      if (options.endpoints && options.endpoints.length > 0) {
        files[`src/routes/index${extension}`] = generateFastifyRouteIndex(options);
        
        // Group endpoints by their base path
        const routeGroups = groupEndpointsByBasePath(options.endpoints);
        
        for (const [basePath, endpoints] of Object.entries(routeGroups)) {
          const routeName = basePath.replace(/^\//, '').replace(/\//g, '-') || 'root';
          files[`src/routes/${routeName}${extension}`] = generateFastifyRoutes(routeName, endpoints, options);
        }
      }
      
      if (options.models && options.models.length > 0) {
        files[`src/models/index${extension}`] = generateModelIndex(options);
        
        for (const model of options.models) {
          files[`src/models/${model.name.toLowerCase()}${extension}`] = generateModel(model, options);
        }
      }
      
      if (options.authentication || options.authorization) {
        files[`src/plugins/auth${extension}`] = generateFastifyAuthPlugin(options);
      }
      
      files[`src/config/index${extension}`] = generateConfig(options);
      files[`src/utils/logger${extension}`] = generateLogger(options);
      files[`.env.example`] = generateEnvExample(options);
      break;
    
    case 'nestjs':
      files[`src/main${extension}`] = generateNestJsMain(options);
      files[`src/app.module${extension}`] = generateNestJsAppModule(options);
      
      if (options.endpoints && options.endpoints.length > 0) {
        // Group endpoints by their base path
        const routeGroups = groupEndpointsByBasePath(options.endpoints);
        
        for (const [basePath, endpoints] of Object.entries(routeGroups)) {
          const moduleName = basePath.replace(/^\//, '').replace(/\//g, '-') || 'root';
          const controllerName = `${moduleName}-controller`;
          const serviceName = `${moduleName}-service`;
          
          files[`src/modules/${moduleName}/${moduleName}.module${extension}`] = generateNestJsModule(moduleName, options);
          files[`src/modules/${moduleName}/${controllerName}${extension}`] = generateNestJsController(moduleName, endpoints, options);
          files[`src/modules/${moduleName}/${serviceName}${extension}`] = generateNestJsService(moduleName, endpoints, options);
          
          if (endpoints.some(e => e.requestBody)) {
            files[`src/modules/${moduleName}/dto/index${extension}`] = generateNestJsDtoIndex(moduleName, endpoints);
            
            for (const endpoint of endpoints) {
              if (endpoint.requestBody) {
                const dtoName = `${endpoint.path.replace(/^\//, '').replace(/\//g, '-') || 'default'}-dto`;
                files[`src/modules/${moduleName}/dto/${dtoName}${extension}`] = generateNestJsDto(endpoint, options);
              }
            }
          }
        }
      }
      
      if (options.models && options.models.length > 0) {
        for (const model of options.models) {
          files[`src/models/${model.name.toLowerCase()}.entity${extension}`] = generateNestJsEntity(model, options);
        }
      }
      
      if (options.authentication || options.authorization) {
        files[`src/auth/auth.module${extension}`] = generateNestJsAuthModule(options);
        files[`src/auth/auth.service${extension}`] = generateNestJsAuthService(options);
        files[`src/auth/auth.controller${extension}`] = generateNestJsAuthController(options);
        files[`src/auth/guards/jwt-auth.guard${extension}`] = generateNestJsJwtAuthGuard(options);
        files[`src/auth/strategies/jwt.strategy${extension}`] = generateNestJsJwtStrategy(options);
      }
      
      files[`src/config/configuration${extension}`] = generateNestJsConfig(options);
      files[`src/common/filters/http-exception.filter${extension}`] = generateNestJsHttpExceptionFilter(options);
      files[`src/common/interceptors/logging.interceptor${extension}`] = generateNestJsLoggingInterceptor(options);
      files[`.env.example`] = generateEnvExample(options);
      break;
    
    case 'apollo':
      files[`src/index${extension}`] = generateApolloServer(options);
      files[`src/schema${extension}`] = generateApolloSchema(options);
      
      if (options.models && options.models.length > 0) {
        files[`src/resolvers/index${extension}`] = generateApolloResolverIndex(options);
        
        for (const model of options.models) {
          files[`src/resolvers/${model.name.toLowerCase()}.resolver${extension}`] = generateApolloResolver(model, options);
          files[`src/models/${model.name.toLowerCase()}${extension}`] = generateModel(model, options);
        }
      }
      
      if (options.authentication || options.authorization) {
        files[`src/auth${extension}`] = generateApolloAuth(options);
      }
      
      files[`src/config${extension}`] = generateConfig(options);
      files[`src/utils/logger${extension}`] = generateLogger(options);
      files[`.env.example`] = generateEnvExample(options);
      break;
    
    case 'grpc-node':
      files[`src/index${extension}`] = generateGrpcServer(options);
      files[`src/protos/${options.name}.proto`] = generateProtoDefinition(options);
      
      if (options.models && options.models.length > 0) {
        files[`src/services/index${extension}`] = generateGrpcServiceIndex(options);
        
        for (const model of options.models) {
          files[`src/services/${model.name.toLowerCase()}.service${extension}`] = generateGrpcService(model, options);
          files[`src/models/${model.name.toLowerCase()}${extension}`] = generateModel(model, options);
        }
      }
      
      if (options.authentication || options.authorization) {
        files[`src/middleware/auth${extension}`] = generateGrpcAuthMiddleware(options);
      }
      
      files[`src/config${extension}`] = generateConfig(options);
      files[`src/utils/logger${extension}`] = generateLogger(options);
      files[`.env.example`] = generateEnvExample(options);
      break;
    
    case 'socket.io':
      files[`src/index${extension}`] = generateSocketIoServer(options);
      
      if (options.endpoints && options.endpoints.length > 0) {
        files[`src/events/index${extension}`] = generateSocketIoEventIndex(options);
        
        // Group endpoints by their base path (event namespace)
        const eventGroups = groupEndpointsByBasePath(options.endpoints);
        
        for (const [namespace, endpoints] of Object.entries(eventGroups)) {
          const eventName = namespace.replace(/^\//, '').replace(/\//g, '-') || 'default';
          files[`src/events/${eventName}${extension}`] = generateSocketIoEvents(eventName, endpoints, options);
        }
      }
      
      if (options.models && options.models.length > 0) {
        files[`src/models/index${extension}`] = generateModelIndex(options);
        
        for (const model of options.models) {
          files[`src/models/${model.name.toLowerCase()}${extension}`] = generateModel(model, options);
        }
      }
      
      if (options.authentication || options.authorization) {
        files[`src/middleware/auth${extension}`] = generateSocketIoAuthMiddleware(options);
      }
      
      files[`src/config${extension}`] = generateConfig(options);
      files[`src/utils/logger${extension}`] = generateLogger(options);
      files[`.env.example`] = generateEnvExample(options);
      break;
    
    case 'kafka':
    case 'rabbitmq':
      const messagingSystem = options.framework;
      
      files[`src/index${extension}`] = generateMessagingServer(options);
      
      if (options.endpoints && options.endpoints.length > 0) {
        files[`src/consumers/index${extension}`] = generateConsumerIndex(options);
        files[`src/producers/index${extension}`] = generateProducerIndex(options);
        
        // Group endpoints by their base path (topic/queue)
        const messageGroups = groupEndpointsByBasePath(options.endpoints);
        
        for (const [topic, endpoints] of Object.entries(messageGroups)) {
          const topicName = topic.replace(/^\//, '').replace(/\//g, '-') || 'default';
          files[`src/consumers/${topicName}${extension}`] = generateConsumer(topicName, endpoints, options);
          files[`src/producers/${topicName}${extension}`] = generateProducer(topicName, endpoints, options);
        }
      }
      
      if (options.models && options.models.length > 0) {
        files[`src/models/index${extension}`] = generateModelIndex(options);
        
        for (const model of options.models) {
          files[`src/models/${model.name.toLowerCase()}${extension}`] = generateModel(model, options);
        }
      }
      
      files[`src/config${extension}`] = generateConfig(options);
      files[`src/utils/logger${extension}`] = generateLogger(options);
      files[`.env.example`] = generateEnvExample(options);
      break;
  }
  
  return files;
}

/**
 * Generate gateway files based on options
 */
function generateGateway(options: GatewayOptions): Record<string, string> {
  const files: Record<string, string> = {};
  const extension = options.language === 'typescript' || options.language === 'javascript' ? 
    (options.language === 'typescript' ? '.ts' : '.js') : 
    (options.language === 'yaml' ? '.yaml' : '');
  
  // Generate README.md
  files['README.md'] = generateGatewayReadme(options);
  
  // Generate .gitignore
  files['.gitignore'] = generateGitignore();
  
  // Generate package.json
  files['package.json'] = generateGatewayPackageJson(options);
  
  // Generate tsconfig.json if using TypeScript
  if (options.language === 'typescript') {
    files['tsconfig.json'] = generateTsConfig();
  }
  
  // Return the generated files
  return files;
}
