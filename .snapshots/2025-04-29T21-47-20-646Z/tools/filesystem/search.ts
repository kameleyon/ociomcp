// Auto-generated safe fallback for search

export function activate() {
    console.log("[TOOL] search activated (passive mode)");
}

export function onFileWrite() { /* no-op */ }
export function onSessionStart() { /* no-op */ }
export function onCommand() { /* no-op */ }
/**
 * Filesystem Search Operations
 * Implements search functionality for files and code
 */

import fs from 'fs/promises';
import path from 'path';
import { spawn } from 'child_process';
import { platform } from 'os';
import { SearchResult } from './types.js';

/**
 * Search for files by name pattern
 * 
 * @param searchPath Path to search in
 * @param regex Regular expression to search for
 * @param filePattern File pattern to match
 * @param timeoutMs Timeout in milliseconds
 * @returns List of matching files
 */
export async function searchFiles(
  searchPath: string,
  regex: string,
  filePattern?: string,
  timeoutMs: number = 30000
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const results: string[] = [];
    
    // Determine the command to use based on platform
    let command: string;
    let args: string[];
    
    if (platform() === 'win32') {
      // On Windows, use PowerShell to search for files
      command = 'powershell';
      args = [
        '-Command',
        `Get-ChildItem -Path "${searchPath}" -Recurse ${filePattern ? `-Include "${filePattern}"` : ''} | Where-Object { $_.Name -match "${regex}" } | ForEach-Object { $_.FullName }`
      ];
    } else {
      // On Unix-like systems, use find and grep
      command = 'find';
      args = [
        searchPath,
        '-type', 'f',
        filePattern ? `-name "${filePattern}"` : '',
        '-exec', 'grep', '-l', regex, '{}', ';'
      ].filter(Boolean) as string[];
    }
    
    // Spawn the process
    const process = spawn(command, args);
    
    // Set up a timeout
    const timeout = setTimeout(() => {
      process.kill();
      reject(new Error(`Search timed out after ${timeoutMs}ms`));
    }, timeoutMs);
    
    // Collect stdout
    process.stdout.on('data', (data) => {
      const lines = data.toString().trim().split('\n');
      for (const line of lines) {
        if (line.trim()) {
          results.push(line.trim());
        }
      }
    });
    
    // Handle process exit
    process.on('exit', (code) => {
      clearTimeout(timeout);
      
      if (code === 0) {
        resolve(results);
      } else {
        reject(new Error(`Search failed with exit code ${code}`));
      }
    });
    
    // Handle process error
    process.on('error', (error) => {
      clearTimeout(timeout);
      reject(error);
    });
  });
}

/**
 * Search for code patterns in files
 * 
 * @param searchPath Path to search in
 * @param regex Regular expression to search for
 * @param filePattern File pattern to match
 * @param contextLines Number of context lines to include
 * @param timeoutMs Timeout in milliseconds
 * @returns List of search results
 */
export async function searchCode(
  searchPath: string,
  regex: string,
  filePattern?: string,
  contextLines: number = 2,
  timeoutMs: number = 30000
): Promise<SearchResult[]> {
  return new Promise((resolve, reject) => {
    const results: SearchResult[] = [];
    
    // Determine the command to use based on platform
    let command: string;
    let args: string[];
    
    if (platform() === 'win32') {
      // On Windows, use PowerShell to search for code
      // For Windows, use a simpler approach with findstr
      command = 'cmd.exe';
      args = [
        '/c',
        `findstr /s /n /i /r "${regex}" "${searchPath}\\${filePattern || '*'}"`,
      ];
    } else {
      // On Unix-like systems, use grep
      command = 'grep';
      args = [
        '-r',
        '-n',
        '-A', contextLines.toString(),
        '-B', contextLines.toString(),
        '-E', regex,
        filePattern ? `--include="${filePattern}"` : '',
        searchPath
      ].filter(Boolean) as string[];
    }
    
    // Spawn the process
    const process = spawn(command, args);
    
    // Set up a timeout
    const timeout = setTimeout(() => {
      process.kill();
      reject(new Error(`Search timed out after ${timeoutMs}ms`));
    }, timeoutMs);
    
    // Collect stdout
    let output = '';
    process.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    // Handle process exit
    process.on('exit', (code) => {
      clearTimeout(timeout);
      
      if (code === 0 || code === 1) {
        // Parse the output
        if (platform() === 'win32') {
          // Parse PowerShell output
          const matches = output.split('FILE:');
          
          for (const match of matches) {
            if (!match.trim()) continue;
            
            const lines = match.trim().split('\n');
            const filePath = lines[0].trim();
            const lineNumber = parseInt(lines[1].replace('LINE:', '').trim(), 10);
            const content = lines[2].replace('CONTENT:', '').trim();
            const contextStr = lines.slice(3).join('\n').replace('CONTEXT:', '').trim();
            const context = contextStr.split('\n').map(line => line.trim());
            
            results.push({
              path: filePath,
              line: lineNumber,
              content,
              context,
            });
          }
        } else {
          // Parse grep output
          const matches = output.split('--');
          
          for (const match of matches) {
            if (!match.trim()) continue;
            
            const lines = match.trim().split('\n');
            const firstLine = lines[0].trim();
            const filePathMatch = firstLine.match(/^(.+):(\d+):/);
            
            if (filePathMatch) {
              const filePath = filePathMatch[1];
              const lineNumber = parseInt(filePathMatch[2], 10);
              const content = firstLine.substring(filePathMatch[0].length);
              const context = lines.slice(1).map(line => {
                // Remove line numbers from context lines
                const lineMatch = line.match(/^(\d+)[-:]/);
                return lineMatch ? line.substring(lineMatch[0].length) : line;
              });
              
              results.push({
                path: filePath,
                line: lineNumber,
                content,
                context,
              });
            }
          }
        }
        
        resolve(results);
      } else {
        reject(new Error(`Search failed with exit code ${code}`));
      }
    });
    
    // Handle process error
    process.on('error', (error) => {
      clearTimeout(timeout);
      reject(error);
    });
  });
}

/**
 * Apply a diff to a file
 * 
 * @param filePath Path to the file to edit
 * @param diff Diff to apply
 * @returns Whether the diff was applied successfully
 */
export async function applyDiff(filePath: string, diff: string): Promise<boolean> {
  try {
    // Read the file content
    const content = await fs.readFile(filePath, 'utf-8');
    
    // Parse the diff
    const diffBlocks = parseDiff(diff);
    
    // Apply each diff block
    let newContent = content;
    
    for (const block of diffBlocks) {
      // Find the search content in the file
      const searchIndex = newContent.indexOf(block.search);
      
      if (searchIndex === -1) {
        throw new Error(`Search content not found in file: ${block.search.substring(0, 50)}...`);
      }
      
      // Replace the search content with the replacement content
      newContent = newContent.substring(0, searchIndex) +
        block.replace +
        newContent.substring(searchIndex + block.search.length);
    }
    
    // Write the new content back to the file
    await fs.writeFile(filePath, newContent, 'utf-8');
    
    return true;
  } catch (error) {
    console.error(`Error applying diff to ${filePath}:`, error);
    return false;
  }
}

/**
 * Parse a diff string into diff blocks
 * 
 * @param diff Diff string
 * @returns List of diff blocks
 */
interface DiffBlock {
  search: string;
  replace: string;
}

function parseDiff(diff: string): DiffBlock[] {
  const blocks: DiffBlock[] = [];
  
  // Split the diff into blocks
  const blockRegex = /<<<<<<< SEARCH\s+([\s\S]*?)=======\s+([\s\S]*?)>>>>>>> REPLACE/g;
  let match;
  
  while ((match = blockRegex.exec(diff)) !== null) {
    const search = match[1];
    const replace = match[2];
    
    blocks.push({
      search,
      replace,
    });
  }
  
  return blocks;
}
