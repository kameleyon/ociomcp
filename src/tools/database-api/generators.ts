// Auto-generated safe fallback for generators

export function activate() {
    console.log("[TOOL] generators activated (passive mode)");
}

export function onFileWrite() { /* no-op */ }
export function onSessionStart() { /* no-op */ }
export function onCommand() { /* no-op */ }
/**
 * Service Generator Functions
 * 
 * This file contains all the generator functions used by the ServiceBuilder tool
 * to create microservice architectures, API gateways, and orchestrators.
 */

import { ServiceOptions, GatewayOptions, OrchestratorOptions, Endpoint, Model } from './types';

/**
 * Group endpoints by their base path
 */
export function groupEndpointsByBasePath(endpoints: Endpoint[]): Record<string, Endpoint[]> {
  const groups: Record<string, Endpoint[]> = {};

  for (const endpoint of endpoints) {
    const parts = endpoint.path.split('/');
    const basePath = parts.length > 1 ? `/${parts[1]}` : '/';

    if (!groups[basePath]) {
      groups[basePath] = [];
    }

    groups[basePath].push(endpoint);
  }

  return groups;
}

/**
 * Generate orchestrator configuration files
 */
export function generateOrchestrator(options: OrchestratorOptions): Record<string, string> {
  return {
    'deployment.yaml': '',
    'service.yaml': ''
  };
}

/**
 * Generate Dependencies (FIXED the broken switch here)
 */
export function generateDependencies(options: ServiceOptions) {
  const dependencies: Record<string, string> = {};
  const devDependencies: Record<string, string> = {};

  if (options.database) {
    switch (options.database) {
      case 'mysql':
        dependencies["mysql2"] = "^3.2.0";
        dependencies["sequelize"] = "^6.29.3";
        break;
      case 'sqlite':
        dependencies["sqlite3"] = "^5.1.4";
        dependencies["sequelize"] = "^6.29.3";
        break;
      default:
        break;
    }
  }

  if (options.authentication) {
    dependencies["jsonwebtoken"] = "^9.0.0";
    dependencies["bcrypt"] = "^5.1.0";

    if (options.framework === 'nestjs') {
      dependencies["@nestjs/jwt"] = "^10.0.2";
      dependencies["@nestjs/passport"] = "^9.0.3";
      dependencies["passport"] = "^0.6.0";
      dependencies["passport-jwt"] = "^4.0.1";
      devDependencies["@types/passport-jwt"] = "^3.0.8";
    }
  }

  if (options.language === 'typescript') {
    devDependencies["typescript"] = "^4.9.5";
    devDependencies["@types/node"] = "^18.15.0";

    if (options.framework === 'express') {
      devDependencies["@types/express"] = "^4.17.17";
      devDependencies["@types/cors"] = "^2.8.13";
      devDependencies["@types/morgan"] = "^1.9.4";
    }

    if (options.authentication) {
      devDependencies["@types/jsonwebtoken"] = "^9.0.1";
      devDependencies["@types/bcrypt"] = "^5.0.0";
    }

    if (options.framework === 'socket.io') {
      devDependencies["@types/express"] = "^4.17.17";
    }

    if (options.framework === 'rabbitmq') {
      devDependencies["@types/amqplib"] = "^0.10.1";
    }
  }

  return { dependencies, devDependencies };
}

/**
 * Generate package.json file
 */
export function generatePackageJson(options: ServiceOptions): string {
  const { dependencies, devDependencies } = generateDependencies(options);

  const scripts: Record<string, string> = {
    "start": options.language === 'typescript' ? "node dist/index.js" : "node src/index.js",
    "dev": options.language === 'typescript' ? "ts-node src/index.ts" : "nodemon src/index.js",
    ...(options.language === 'typescript' ? { "build": "tsc" } : {})
  };

  if (options.language === 'typescript') {
    devDependencies["ts-node"] = "^10.9.1";
    devDependencies["nodemon"] = "^2.0.21";
  } else {
    devDependencies["nodemon"] = "^2.0.21";
  }

  const packageJson = {
    name: options.name,
    version: "1.0.0",
    description: options.description || `${options.name} microservice`,
    main: options.language === 'typescript' ? "dist/index.js" : "src/index.js",
    scripts,
    keywords: [
      "microservice",
      options.framework,
      options.type
    ],
    author: "",
    license: "ISC",
    dependencies,
    devDependencies
  };

  return JSON.stringify(packageJson, null, 2);
}

/**
 * All other generators (stubs)
 */

export function generateReadme(options: ServiceOptions): string {
  return `# ${options.name}`;
}

export function generateGatewayReadme(options: GatewayOptions): string {
  return `# ${options.name}`;
}

export function generateGitignore(): string {
  return `node_modules/\ndist/\n.env\n`;
}

export function generateTsConfig(): string {
  return `{
  "compilerOptions": {
    "target": "es2018",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "**/*.test.ts"]
}`;
}

export function generateDockerfile(options: ServiceOptions): string {
  const isTypescript = options.language === 'typescript';
  return `FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install${isTypescript ? ' && npm install -g typescript' : ''}

COPY . .

${isTypescript ? 'RUN npm run build' : ''}

EXPOSE 3000

CMD ["npm", "start"]`;
}

export function generateDockerignore(): string {
  return `node_modules\nnpm-debug.log\nDockerfile\n.dockerignore\n.git\n.gitignore\n.env\n`;
}

// ---- Stub Implementations ----
export function generateExpressApp(options: ServiceOptions): string { return ''; }
export function generateExpressServer(options: ServiceOptions): string { return ''; }
export function generateExpressRouteIndex(options: ServiceOptions): string { return ''; }
export function generateExpressRoutes(routeName: string, endpoints: Endpoint[], options: ServiceOptions): string { return ''; }
export function generateModelIndex(options: ServiceOptions): string { return ''; }
export function generateModel(model: Model, options: ServiceOptions): string { return ''; }
export function generateAuthMiddleware(options: ServiceOptions): string { return ''; }
export function generateConfig(options: ServiceOptions): string { return ''; }
export function generateLogger(options: ServiceOptions): string { return ''; }
export function generateEnvExample(options: ServiceOptions): string { return ''; }
export function generateFastifyApp(options: ServiceOptions): string { return ''; }
export function generateFastifyServer(options: ServiceOptions): string { return ''; }
export function generateFastifyRouteIndex(options: ServiceOptions): string { return ''; }
export function generateFastifyRoutes(routeName: string, endpoints: Endpoint[], options: ServiceOptions): string { return ''; }
export function generateFastifyAuthPlugin(options: ServiceOptions): string { return ''; }
export function generateNestJsMain(options: ServiceOptions): string { return ''; }
export function generateNestJsAppModule(options: ServiceOptions): string { return ''; }
export function generateNestJsModule(moduleName: string, options: ServiceOptions): string { return ''; }
export function generateNestJsController(moduleName: string, endpoints: Endpoint[], options: ServiceOptions): string { return ''; }
export function generateNestJsService(moduleName: string, endpoints: Endpoint[], options: ServiceOptions): string { return ''; }
export function generateNestJsDtoIndex(moduleName: string, endpoints: Endpoint[]): string { return ''; }
export function generateNestJsDto(endpoint: Endpoint, options: ServiceOptions): string { return ''; }
export function generateNestJsEntity(model: Model, options: ServiceOptions): string { return ''; }
export function generateNestJsAuthModule(options: ServiceOptions): string { return ''; }
export function generateNestJsAuthService(options: ServiceOptions): string { return ''; }
export function generateNestJsAuthController(options: ServiceOptions): string { return ''; }
export function generateNestJsJwtAuthGuard(options: ServiceOptions): string { return ''; }
export function generateNestJsJwtStrategy(options: ServiceOptions): string { return ''; }
export function generateNestJsConfig(options: ServiceOptions): string { return ''; }
export function generateNestJsHttpExceptionFilter(options: ServiceOptions): string { return ''; }
export function generateNestJsLoggingInterceptor(options: ServiceOptions): string { return ''; }
export function generateApolloServer(options: ServiceOptions): string { return ''; }
export function generateApolloSchema(options: ServiceOptions): string { return ''; }
export function generateApolloResolverIndex(options: ServiceOptions): string { return ''; }
export function generateApolloResolver(model: Model, options: ServiceOptions): string { return ''; }
export function generateApolloAuth(options: ServiceOptions): string { return ''; }
export function generateGrpcServer(options: ServiceOptions): string { return ''; }
export function generateProtoDefinition(options: ServiceOptions): string { return ''; }
export function generateGrpcServiceIndex(options: ServiceOptions): string { return ''; }
export function generateGrpcService(model: Model, options: ServiceOptions): string { return ''; }
export function generateGrpcAuthMiddleware(options: ServiceOptions): string { return ''; }
export function generateSocketIoServer(options: ServiceOptions): string { return ''; }
export function generateSocketIoEventIndex(options: ServiceOptions): string { return ''; }
export function generateSocketIoEvents(eventName: string, endpoints: Endpoint[], options: ServiceOptions): string { return ''; }
export function generateSocketIoAuthMiddleware(options: ServiceOptions): string { return ''; }
export function generateMessagingServer(options: ServiceOptions): string { return ''; }
export function generateConsumerIndex(options: ServiceOptions): string { return ''; }
export function generateProducerIndex(options: ServiceOptions): string { return ''; }
export function generateConsumer(topicName: string, endpoints: Endpoint[], options: ServiceOptions): string { return ''; }
export function generateProducer(topicName: string, endpoints: Endpoint[], options: ServiceOptions): string { return ''; }
export function generateGatewayPackageJson(options: GatewayOptions): string { return '{}'; }


