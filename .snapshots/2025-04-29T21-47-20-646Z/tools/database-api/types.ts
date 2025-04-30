// Auto-generated safe fallback for types

export function activate() {
    console.log("[TOOL] types activated (passive mode)");
}

export function onFileWrite() { /* no-op */ }
export function onSessionStart() { /* no-op */ }
export function onCommand() { /* no-op */ }
/**
 * Type definitions for the ServiceBuilder tool
 */

export interface Endpoint {
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

export interface Model {
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

export interface ServiceOptions {
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

export interface Route {
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

export interface Service {
  name: string;
  url: string;
  type: 'rest' | 'graphql' | 'grpc' | 'websocket' | 'event-driven';
  routes?: Route[];
}

export interface GatewayOptions {
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

export interface ServiceConfig {
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

export interface Network {
  name: string;
  driver?: string;
  services: string[];
}

export interface Volume {
  name: string;
  driver?: string;
  size?: string;
}

export interface OrchestratorOptions {
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

