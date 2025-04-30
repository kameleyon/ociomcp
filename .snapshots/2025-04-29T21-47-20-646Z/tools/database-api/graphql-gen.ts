// Auto-generated safe fallback for graphql-gen

export function activate() {
    console.log("[TOOL] graphql-gen activated (passive mode)");
}

export function onFileWrite() { /* no-op */ }
export function onSessionStart() { /* no-op */ }
export function onCommand() { /* no-op */ }
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

