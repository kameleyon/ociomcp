/**
 * Filesystem Operations
 * Implements file system operations for the optimuscode-mcp server
 */

import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import fetch from 'cross-fetch';
import { FileType, FileInfo, DirectoryEntry, FileContent, SearchResult } from './types.js';

/**
 * Get allowed directories from configuration
 * This is a security measure to prevent access to sensitive directories
 */
async function getAllowedDirs(): Promise<string[]> {
  // For now, we'll allow access to the user's home directory
  // In a production environment, this should be configurable
  return [
    os.homedir() // User's home directory
  ];
}

/**
 * Normalize all paths consistently
 */
function normalizePath(p: string): string {
  return path.normalize(expandHome(p)).toLowerCase();
}

/**
 * Expand ~ to user's home directory
 */
function expandHome(filepath: string): string {
  if (filepath.startsWith('~/') || filepath === '~') {
    return path.join(os.homedir(), filepath.slice(1));
  }
  return filepath;
}

/**
 * Check if a path is allowed
 */
async function isPathAllowed(filePath: string): Promise<boolean> {
  const allowedDirs = await getAllowedDirs();
  
  // If no allowed directories are specified, allow all paths
  if (allowedDirs.length === 0) {
    return true;
  }
  
  const normalizedPath = normalizePath(filePath);
  
  // Check if the path is within any of the allowed directories
  for (const allowedDir of allowedDirs) {
    const normalizedAllowedDir = normalizePath(allowedDir);
    if (normalizedPath === normalizedAllowedDir || normalizedPath.startsWith(normalizedAllowedDir + path.sep)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Read a file from the filesystem or a URL
 */
export async function readFile(filePath: string, isUrl = false): Promise<FileContent> {
  if (isUrl) {
    // Fetch content from URL
    const response = await fetch(filePath);
    const contentType = response.headers.get('content-type') || '';
    const isImage = contentType.startsWith('image/');
    
    if (isImage) {
      // For images, return as base64
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      return {
        content: buffer.toString('base64'),
        isImage: true,
        mimeType: contentType,
      };
    } else {
      // For text, return as string
      const text = await response.text();
      return {
        content: text,
        isImage: false,
      };
    }
  } else {
    // Check if path is allowed
    if (!(await isPathAllowed(filePath))) {
      throw new Error(`Access to path '${filePath}' is not allowed`);
    }
    
    // Read file from filesystem
    try {
      const stats = await fs.stat(filePath);
      
      if (!stats.isFile()) {
        throw new Error(`Path '${filePath}' is not a file`);
      }
      
      // Read file content
      const buffer = await fs.readFile(filePath);
      
      // Detect if it's an image based on file extension
      const ext = path.extname(filePath).toLowerCase();
      const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp', '.ico'];
      const isImage = imageExtensions.includes(ext);
      
      if (isImage) {
        // For images, return as base64
        return {
          content: buffer.toString('base64'),
          isImage: true,
          mimeType: getMimeType(ext),
        };
      } else {
        // For text, return as string
        return {
          content: buffer.toString('utf-8'),
          isImage: false,
        };
      }
    } catch (error) {
      throw new Error(`Failed to read file '${filePath}': ${error}`);
    }
  }
}

/**
 * Read multiple files from the filesystem
 */
export async function readMultipleFiles(filePaths: string[]): Promise<Record<string, FileContent>> {
  const results: Record<string, FileContent> = {};
  
  // Read each file
  for (const filePath of filePaths) {
    try {
      results[filePath] = await readFile(filePath);
    } catch (error) {
      // If a file fails to read, include an error message
      results[filePath] = {
        content: `Error reading file: ${error}`,
        isImage: false,
      };
    }
  }
  
  return results;
}

/**
 * Write content to a file
 */
export async function writeFile(filePath: string, content: string): Promise<void> {
  // Check if path is allowed
  if (!(await isPathAllowed(filePath))) {
    throw new Error(`Access to path '${filePath}' is not allowed`);
  }
  
  try {
    // Create directory if it doesn't exist
    const dirPath = path.dirname(filePath);
    await fs.mkdir(dirPath, { recursive: true });
    
    // Write file content
    await fs.writeFile(filePath, content, 'utf-8');
  } catch (error) {
    throw new Error(`Failed to write file '${filePath}': ${error}`);
  }
}

/**
 * Create a directory
 */
export async function createDirectory(dirPath: string): Promise<void> {
  // Check if path is allowed
  if (!(await isPathAllowed(dirPath))) {
    throw new Error(`Access to path '${dirPath}' is not allowed`);
  }
  
  try {
    // Create directory recursively
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    throw new Error(`Failed to create directory '${dirPath}': ${error}`);
  }
}

/**
 * List directory contents
 */
export async function listDirectory(dirPath: string, recursive = false): Promise<DirectoryEntry[]> {
  // Check if path is allowed
  if (!(await isPathAllowed(dirPath))) {
    throw new Error(`Access to path '${dirPath}' is not allowed`);
  }
  
  try {
    const entries: DirectoryEntry[] = [];
    
    // Read directory entries
    const dirEntries = await fs.readdir(dirPath, { withFileTypes: true });
    
    // Process each entry
    for (const entry of dirEntries) {
      const entryPath = path.join(dirPath, entry.name);
      
      // Determine entry type
      let type: FileType;
      if (entry.isFile()) {
        type = FileType.FILE;
      } else if (entry.isDirectory()) {
        type = FileType.DIRECTORY;
      } else if (entry.isSymbolicLink()) {
        type = FileType.SYMLINK;
      } else {
        type = FileType.OTHER;
      }
      
      // Get file size for files
      let size: number | undefined;
      if (type === FileType.FILE) {
        const stats = await fs.stat(entryPath);
        size = stats.size;
      }
      
      // Add entry to results
      entries.push({
        path: entryPath,
        name: entry.name,
        type,
        size,
      });
      
      // If recursive and entry is a directory, list its contents
      if (recursive && type === FileType.DIRECTORY) {
        const subEntries = await listDirectory(entryPath, true);
        entries.push(...subEntries);
      }
    }
    
    return entries;
  } catch (error) {
    throw new Error(`Failed to list directory '${dirPath}': ${error}`);
  }
}

/**
 * Move or rename a file or directory
 */
export async function moveFile(sourcePath: string, destinationPath: string): Promise<void> {
  // Check if paths are allowed
  if (!(await isPathAllowed(sourcePath))) {
    throw new Error(`Access to path '${sourcePath}' is not allowed`);
  }
  
  if (!(await isPathAllowed(destinationPath))) {
    throw new Error(`Access to path '${destinationPath}' is not allowed`);
  }
  
  try {
    // Create destination directory if it doesn't exist
    const destDir = path.dirname(destinationPath);
    await fs.mkdir(destDir, { recursive: true });
    
    // Move/rename the file or directory
    await fs.rename(sourcePath, destinationPath);
  } catch (error) {
    throw new Error(`Failed to move '${sourcePath}' to '${destinationPath}': ${error}`);
  }
}

/**
 * Get file information
 */
export async function getFileInfo(filePath: string): Promise<FileInfo> {
  // Check if path is allowed
  if (!(await isPathAllowed(filePath))) {
    throw new Error(`Access to path '${filePath}' is not allowed`);
  }
  
  try {
    // Get file stats
    const stats = await fs.stat(filePath);
    
    // Determine file type
    let type: FileType;
    if (stats.isFile()) {
      type = FileType.FILE;
    } else if (stats.isDirectory()) {
      type = FileType.DIRECTORY;
    } else if (stats.isSymbolicLink()) {
      type = FileType.SYMLINK;
    } else {
      type = FileType.OTHER;
    }
    
    // Check file permissions
    let isReadable = true;
    let isWritable = true;
    let isExecutable = true;
    
    try {
      await fs.access(filePath, fs.constants.R_OK);
    } catch {
      isReadable = false;
    }
    
    try {
      await fs.access(filePath, fs.constants.W_OK);
    } catch {
      isWritable = false;
    }
    
    try {
      await fs.access(filePath, fs.constants.X_OK);
    } catch {
      isExecutable = false;
    }
    
    return {
      path: filePath,
      name: path.basename(filePath),
      type,
      size: stats.size,
      createdAt: stats.birthtime.toISOString(),
      modifiedAt: stats.mtime.toISOString(),
      isReadable,
      isWritable,
      isExecutable,
    };
  } catch (error) {
    throw new Error(`Failed to get info for '${filePath}': ${error}`);
  }
}

/**
 * Get MIME type from file extension
 */
function getMimeType(ext: string): string {
  const mimeTypes: Record<string, string> = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.bmp': 'image/bmp',
    '.ico': 'image/x-icon',
  };
  
  return mimeTypes[ext] || 'application/octet-stream';
}