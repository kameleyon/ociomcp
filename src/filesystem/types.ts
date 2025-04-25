/**
 * Filesystem Types
 * Defines the interfaces and types for filesystem operations
 */

import { z } from 'zod';

/**
 * Schema for read_file arguments
 */
export const ReadFileArgsSchema = z.object({
  path: z.string().describe("Path to the file to read"),
  isUrl: z.boolean().optional().describe("Whether the path is a URL"),
});

/**
 * Schema for read_multiple_files arguments
 */
export const ReadMultipleFilesArgsSchema = z.object({
  paths: z.array(z.string()).describe("Paths to the files to read"),
  isUrl: z.boolean().optional().describe("Whether the paths are URLs"),
});

/**
 * Schema for write_file arguments
 */
export const WriteFileArgsSchema = z.object({
  path: z.string().describe("Path to the file to write"),
  content: z.string().describe("Content to write to the file"),
});

/**
 * Schema for create_directory arguments
 */
export const CreateDirectoryArgsSchema = z.object({
  path: z.string().describe("Path to the directory to create"),
});

/**
 * Schema for list_directory arguments
 */
export const ListDirectoryArgsSchema = z.object({
  path: z.string().describe("Path to the directory to list"),
  recursive: z.boolean().optional().describe("Whether to list recursively"),
});

/**
 * Schema for move_file arguments
 */
export const MoveFileArgsSchema = z.object({
  source: z.string().describe("Path to the source file or directory"),
  destination: z.string().describe("Path to the destination file or directory"),
});

/**
 * Schema for search_files arguments
 */
export const SearchFilesArgsSchema = z.object({
  path: z.string().describe("Path to search in"),
  regex: z.string().describe("Regular expression to search for"),
  filePattern: z.string().optional().describe("File pattern to match"),
  timeoutMs: z.number().optional().describe("Timeout in milliseconds"),
});

/**
 * Schema for get_file_info arguments
 */
export const GetFileInfoArgsSchema = z.object({
  path: z.string().describe("Path to the file or directory"),
});

/**
 * Schema for search_code arguments
 */
export const SearchCodeArgsSchema = z.object({
  path: z.string().describe("Path to search in"),
  regex: z.string().describe("Regular expression to search for"),
  filePattern: z.string().optional().describe("File pattern to match"),
  contextLines: z.number().optional().describe("Number of context lines to include"),
  timeoutMs: z.number().optional().describe("Timeout in milliseconds"),
});

/**
 * Schema for edit_block arguments
 */
export const EditBlockArgsSchema = z.object({
  path: z.string().describe("Path to the file to edit"),
  diff: z.string().describe("Diff to apply"),
});

/**
 * File type enum
 */
export enum FileType {
  FILE = 'file',
  DIRECTORY = 'directory',
  SYMLINK = 'symlink',
  OTHER = 'other',
}

/**
 * File info interface
 */
export interface FileInfo {
  path: string;
  name: string;
  type: FileType;
  size: number;
  createdAt: string;
  modifiedAt: string;
  isReadable: boolean;
  isWritable: boolean;
  isExecutable: boolean;
}

/**
 * Directory entry interface
 */
export interface DirectoryEntry {
  path: string;
  name: string;
  type: FileType;
  size?: number;
}

/**
 * Search result interface
 */
export interface SearchResult {
  path: string;
  line: number;
  content: string;
  context: string[];
}

/**
 * File content interface
 */
export interface FileContent {
  content: string;
  isImage: boolean;
  mimeType?: string;
}