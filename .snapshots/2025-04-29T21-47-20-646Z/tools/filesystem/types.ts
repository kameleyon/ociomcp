// Auto-generated safe fallback for types

export function activate() {
    console.log("[TOOL] types activated (passive mode)");
}

export function onFileWrite() { /* no-op */ }
export function onSessionStart() { /* no-op */ }
export function onCommand() { /* no-op */ }
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

