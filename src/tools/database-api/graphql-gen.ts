// Auto-generated safe fallback for graphql-gen

export function activate() {
    console.log("[TOOL] graphql-gen activated (passive mode)");
}

/**
 * Handles file write events for GraphQL model/config files.
 * If a relevant file changes, auto-regenerates schema and resolvers.
 */
export async function onFileWrite(event?: { path: string; content?: string }) {
  if (!event || !event.path) {
    console.warn("[graphql-gen] onFileWrite called without event data.");
    return;
  }
  if (event.path.endsWith('.graphql-model.json') || event.path.endsWith('.graphql-config.json')) {
    console.log(`[graphql-gen] Detected GraphQL model/config file change: ${event.path}`);
    try {
      const config = JSON.parse(event.content || await (await import('fs/promises')).readFile(event.path, 'utf-8'));
      await handleGenerateGraphQLSchema(config);
      console.log(`[graphql-gen] Schema and resolvers regenerated for ${event.path}`);
    } catch (err) {
      console.error(`[graphql-gen] Error during schema regeneration:`, err);
    }
  }
}

/**
 * Initializes or resets GraphQL generator state at the start of a session.
 */
export function onSessionStart(session?: { id?: string }) {
  console.log(`[graphql-gen] Session started${session && session.id ? `: ${session.id}` : ""}. Preparing GraphQL generation environment.`);
  // Example: clear temp files, reset state, etc.
  // ... actual reset logic
}

/**
 * Handles GraphQL generator commands.
 * Supports dynamic invocation of schema/resolver generation or validation.
 */
export async function onCommand(command?: { name: string; args?: any }) {
  if (!command || !command.name) {
    console.warn("[graphql-gen] onCommand called without command data.");
    return;
  }
  switch (command.name) {
    case "generate":
      console.log("[graphql-gen] Generating GraphQL schema and resolvers...");
      try {
        await handleGenerateGraphQLSchema(command.args);
        console.log("[graphql-gen] Generation complete.");
      } catch (err) {
        console.error("[graphql-gen] Generation failed:", err);
      }
      break;
    case "validate":
      console.log("[graphql-gen] Validating GraphQL schema configuration...");
      try {
        GenerateGraphQLSchemaSchema.parse(command.args);
        console.log("[graphql-gen] Validation successful.");
      } catch (err) {
        console.error("[graphql-gen] Validation failed:", err);
      }
      break;
    default:
      console.warn(`[graphql-gen] Unknown command: ${command.name}`);
  }
}
// src/database-api/graphql-gen.ts

import * as fs from 'fs/promises';
import * as path from 'path';
import { z } from 'zod';

// --- SCHEMAS ---

export const GenerateGraphQLSchemaSchema = z.object({
  name: z.string(),
  models: z.array(z.object({
    name: z.string(),
    description: z.string().optional(),
    fields: z.array(z.object({
      name: z.string(),
      type: z.string(),
      nullable: z.boolean().optional().default(false),
      list: z.boolean().optional().default(false),
    })),
  })),
  outputDir: z.string().optional(),
});

// --- TYPES ---

interface ModelField {
  name: string;
  type: string;
  nullable?: boolean;
  list?: boolean;
}

interface Model {
  name: string;
  description?: string;
  fields: ModelField[];
}

interface GraphQLSchemaOptions {
  name: string;
  models: Model[];
  outputDir?: string;
}

// --- HELPERS ---

function formatGraphQLType(type: string, list?: boolean, nullable?: boolean): string {
  let output = list ? `[${type}]` : type;
  if (!nullable) output += '!';
  return output;
}

function formatGraphQLValue(value: any): string {
  if (typeof value === 'string') return `"${value}"`;
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (value === null) return 'null';
  return String(value);
}

// --- GENERATORS ---

function generateSchema(options: GraphQLSchemaOptions): string {
  let content = `# Auto-generated GraphQL Schema for ${options.name}\n\n`;

  for (const model of options.models) {
    if (model.description) content += `"""${model.description}"""\n`;
    content += `type ${model.name} {\n`;
    for (const field of model.fields) {
      content += `  ${field.name}: ${formatGraphQLType(field.type, field.list, field.nullable)}\n`;
    }
    content += `}\n\n`;
  }

  return content;
}

function generateResolvers(options: GraphQLSchemaOptions): string {
  let content = `// Auto-generated Resolvers for ${options.name}\n\n`;

  content += `export const resolvers = {\n`;
  for (const model of options.models) {
    content += `  ${model.name}: {\n    // Add your field resolvers here\n  },\n`;
  }
  content += `};\n`;

  return content;
}

// --- HANDLERS ---

export async function handleGenerateGraphQLSchema(args: any) {
  const parsed = GenerateGraphQLSchemaSchema.parse(args);
  const outputDir = parsed.outputDir || './graphql';

  const schemaContent = generateSchema(parsed);
  const resolverContent = generateResolvers(parsed);

  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(path.join(outputDir, 'schema.graphql'), schemaContent);
  await fs.writeFile(path.join(outputDir, 'resolvers.ts'), resolverContent);

  return {
    content: [{ type: 'text', text: `GraphQL Schema and Resolvers generated in ${outputDir}` }],
  };
}
