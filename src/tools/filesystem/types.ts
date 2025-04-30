// Auto-generated safe fallback for types

export function activate() {
    console.log("[TOOL] types activated (passive mode)");
}

/**
 * Handles file write events for filesystem types definition changes.
 * Logs changes and could trigger type regeneration if needed.
 */
export function onFileWrite(event?: { path: string }) {
  console.log(`[types] File write detected: ${event?.path}`);
  // In a real implementation, regenerate or validate Zod schemas here.
}

/**
 * Initializes type definitions at the start of a session.
 */
export function onSessionStart(session?: { id?: string }) {
  console.log(`[types] Session started${session?.id ? `: ${session.id}` : ""}. Preparing type schema environment.`);
  // Clear type caches or preload schemas as needed.
}

/**
 * Handles commands for inspecting or validating schemas.
 * Supported commands:
 * - listSchemas: returns available schema names
 * - validateSchema: validates data against a named schema
 */
export async function onCommand(command?: { name: string; args?: any }) {
  if (!command || !command.name) {
    console.warn("[types] onCommand called without command data.");
    return;
  }
  const schemas: Record<string, any> = {
    ReadFileArgsSchema,
    ReadMultipleFilesArgsSchema,
    WriteFileArgsSchema,
    CreateDirectoryArgsSchema,
    ListDirectoryArgsSchema,
    MoveFileArgsSchema,
    GetFileInfoArgsSchema,
    SearchFilesArgsSchema,
    SearchCodeArgsSchema,
    EditBlockArgsSchema
  };
  switch (command.name) {
    case "listSchemas":
      console.log("[types] Listing schemas.");
      return Object.keys(schemas);
    case "validateSchema":
      const { schemaName, data } = command.args || {};
      if (!schemaName || !schemas[schemaName]) {
        console.warn(`[types] Unknown schema: ${schemaName}`);
        return;
      }
      try {
        schemas[schemaName].parse(data);
        console.log(`[types] Validation successful for schema ${schemaName}.`);
        return { valid: true };
      } catch (err) {
        console.error(`[types] Validation failed for schema ${schemaName}:`, err);
        return { valid: false, error: err };
      }
    default:
      console.warn(`[types] Unknown command: ${command.name}`);
  }
}
/**
 * Filesystem Types
 * Provides type definitions for filesystem operations
 */

import { z } from 'zod';

/**
 * Arguments for read_file command
 */
export const ReadFileArgsSchema = z.object({
  path: z.string(),
  isUrl: z.boolean().optional(),
});

/**
 * Arguments for read_multiple_files command
 */
export const ReadMultipleFilesArgsSchema = z.object({
  paths: z.array(z.string()),
});

/**
 * Arguments for write_file command
 */
export const WriteFileArgsSchema = z.object({
  path: z.string(),
  content: z.string(),
});

/**
 * Arguments for create_directory command
 */
export const CreateDirectoryArgsSchema = z.object({
  path: z.string(),
  recursive: z.boolean().optional(),
});

/**
 * Arguments for list_directory command
 */
export const ListDirectoryArgsSchema = z.object({
  path: z.string(),
  recursive: z.boolean().optional(),
});

/**
 * Arguments for move_file command
 */
export const MoveFileArgsSchema = z.object({
  source: z.string(),
  destination: z.string(),
});

/**
 * Arguments for get_file_info command
 */
export const GetFileInfoArgsSchema = z.object({
  path: z.string(),
});

/**
 * Arguments for search_files command
 */
export const SearchFilesArgsSchema = z.object({
  path: z.string(),
  regex: z.string(),
  filePattern: z.string().optional(),
  timeoutMs: z.number().optional(),
});

/**
 * Arguments for search_code command
 */
export const SearchCodeArgsSchema = z.object({
  path: z.string(),
  regex: z.string(),
  filePattern: z.string().optional(),
  contextLines: z.number().optional(),
  timeoutMs: z.number().optional(),
});

/**
 * Arguments for edit_block command
 */
export const EditBlockArgsSchema = z.object({
  path: z.string(),
  diff: z.string(),
});

/**
 * Search result object
 */
export interface SearchResult {
  path: string;
  line: number;
  content: string;
  context: string[];
}

/**
 * File information object
 */
export interface FileInfo {
  path: string;
  name: string;
  type: 'file' | 'directory' | 'link' | 'other';
  size: number;
  createdAt: string;
  modifiedAt: string;
  isReadable: boolean;
  isWritable: boolean;
  isExecutable: boolean;
}

/**
 * Directory entry object
 */
export interface DirectoryEntry {
  path: string;
  name: string;  // <--- Add this line!
  type: 'file' | 'directory' | 'link' | 'other';
  size?: number;
}


/**
 * File read result
 */
export interface FileReadResult {
  content: string;
  isImage: boolean;
  mimeType?: string;
}

/**
 * Import the ApplyDiffSchema from diff-applier.ts to use as the schema for the apply_diff command
 */
export { ApplyDiffSchema } from './diff-applier.js';

/**
 * Import the FormatCodeSchema from code-formatter.ts to use as the schema for the format_code command
 */
export { FormatCodeSchema } from './code-formatter.js';
