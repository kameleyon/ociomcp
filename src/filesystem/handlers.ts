/**
 * Filesystem Handlers
 * Implements handlers for filesystem operations
 */

import { readFile, readMultipleFiles, writeFile, createDirectory, listDirectory, moveFile, getFileInfo } from './filesystem.js';
import { searchFiles, searchCode, applyDiff } from './search.js';
import { handleApplyDiff } from './diff-applier.js';
import { handleFormatCode } from './code-formatter.js';
import { handleConvertToMarkdown, handleFormatMarkdown } from './markdown-tool.js';
import { 
  handleAddDependency, 
  handleRemoveDependency, 
  handleUpdateDependency, 
  handleListDependencies, 
  handleCheckForUpdates 
} from './dependency-tool.js';
import {
  handleGitInit,
  handleGitClone,
  handleGitAdd,
  handleGitCommit,
  handleGitPush,
  handleGitPull,
  handleGitBranch,
  handleGitCheckout,
  handleGitMerge,
  handleGitStatus,
  handleGitLog
} from './git-tool.js';

/**
 * Handle read_file command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleReadFile(args: any) {
  try {
    const { path, isUrl } = args;
    
    // Read the file
    const fileResult = await readFile(path, isUrl);
    
    if (fileResult.isImage) {
      // For image files, return as an image content type
      return {
        content: [
          {
            type: "text",
            text: `Image file: ${path} (${fileResult.mimeType})\n`
          },
          {
            type: "image",
            data: fileResult.content,
            mimeType: fileResult.mimeType
          }
        ],
      };
    } else {
      // For all other files, return as text
      return {
        content: [{ type: "text", text: fileResult.content }],
      };
    }
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error reading file: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Handle read_multiple_files command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleReadMultipleFiles(args: any) {
  try {
    const { paths } = args;
    
    // Read the files
    const results = await readMultipleFiles(paths);
    
    // Prepare the response content
    const content: any[] = [];
    
    // Add a header
    content.push({
      type: "text",
      text: `Read ${Object.keys(results).length} files:\n\n`
    });
    
    // Add each file's content
    for (const [filePath, fileResult] of Object.entries(results)) {
      if (fileResult.isImage) {
        // For image files, add as image
        content.push({
          type: "text",
          text: `\n--- ${filePath} (${fileResult.mimeType}) ---\n`
        });
        content.push({
          type: "image",
          data: fileResult.content,
          mimeType: fileResult.mimeType
        });
      } else {
        // For text files, add as text
        content.push({
          type: "text",
          text: `\n--- ${filePath} ---\n${fileResult.content}`
        });
      }
    }
    
    return { content };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error reading files: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Handle write_file command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleWriteFile(args: any) {
  try {
    const { path, content } = args;
    
    // Write the file
    await writeFile(path, content);
    
    return {
      content: [{ type: "text", text: `File written successfully: ${path}` }],
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error writing file: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Handle create_directory command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleCreateDirectory(args: any) {
  try {
    const { path } = args;
    
    // Create the directory
    await createDirectory(path);
    
    return {
      content: [{ type: "text", text: `Directory created successfully: ${path}` }],
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error creating directory: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Handle list_directory command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleListDirectory(args: any) {
  try {
    const { path, recursive } = args;
    
    // List the directory
    const entries = await listDirectory(path, recursive);
    
    // Format the entries
    const formattedEntries = entries.map(entry => {
      const typePrefix = entry.type === 'directory' ? '[DIR]' : '[FILE]';
      const sizeStr = entry.size !== undefined ? ` (${formatSize(entry.size)})` : '';
      return `${typePrefix} ${entry.path}${sizeStr}`;
    });
    
    return {
      content: [{ type: "text", text: formattedEntries.join('\n') }],
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error listing directory: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Handle move_file command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleMoveFile(args: any) {
  try {
    const { source, destination } = args;
    
    // Move the file
    await moveFile(source, destination);
    
    return {
      content: [{ type: "text", text: `File moved successfully from ${source} to ${destination}` }],
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error moving file: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Handle get_file_info command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleGetFileInfo(args: any) {
  try {
    const { path } = args;
    
    // Get file info
    const info = await getFileInfo(path);
    
    // Format the info
    const formattedInfo = [
      `Path: ${info.path}`,
      `Name: ${info.name}`,
      `Type: ${info.type}`,
      `Size: ${formatSize(info.size)}`,
      `Created: ${info.createdAt}`,
      `Modified: ${info.modifiedAt}`,
      `Permissions: ${formatPermissions(info.isReadable, info.isWritable, info.isExecutable)}`,
    ].join('\n');
    
    return {
      content: [{ type: "text", text: formattedInfo }],
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error getting file info: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Format file size in human-readable format
 * 
 * @param size File size in bytes
 * @returns Formatted size string
 */
function formatSize(size: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let unitIndex = 0;
  let formattedSize = size;
  
  while (formattedSize >= 1024 && unitIndex < units.length - 1) {
    formattedSize /= 1024;
    unitIndex++;
  }
  
  return `${formattedSize.toFixed(2)} ${units[unitIndex]}`;
}

/**
 * Format file permissions
 * 
 * @param isReadable Whether the file is readable
 * @param isWritable Whether the file is writable
 * @param isExecutable Whether the file is executable
 * @returns Formatted permissions string
 */
function formatPermissions(isReadable: boolean, isWritable: boolean, isExecutable: boolean): string {
  return [
    isReadable ? 'r' : '-',
    isWritable ? 'w' : '-',
    isExecutable ? 'x' : '-',
  ].join('');
}

/**
 * Handle search_files command
 *
 * @param args Command arguments
 * @returns Command result
 */
export async function handleSearchFiles(args: any) {
  try {
    const { path, regex, filePattern, timeoutMs } = args;
    
    // Search for files
    const results = await searchFiles(path, regex, filePattern, timeoutMs);
    
    if (results.length === 0) {
      return {
        content: [{ type: "text", text: `No files matching "${regex}" found in ${path}` }],
      };
    }
    
    return {
      content: [{ type: "text", text: `Found ${results.length} matching files:\n\n${results.join('\n')}` }],
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error searching files: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Handle search_code command
 *
 * @param args Command arguments
 * @returns Command result
 */
export async function handleSearchCode(args: any) {
  try {
    const { path, regex, filePattern, contextLines, timeoutMs } = args;
    
    // Search for code
    const results = await searchCode(path, regex, filePattern, contextLines, timeoutMs);
    
    if (results.length === 0) {
      return {
        content: [{ type: "text", text: `No code matching "${regex}" found in ${path}` }],
      };
    }
    
    // Format the results
    const formattedResults = results.map(result => {
      return [
        `File: ${result.path}`,
        `Line: ${result.line}`,
        `Content: ${result.content}`,
        'Context:',
        ...result.context.map(line => `  ${line}`),
        '---',
      ].join('\n');
    });
    
    return {
      content: [{ type: "text", text: `Found ${results.length} matches:\n\n${formattedResults.join('\n')}` }],
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error searching code: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Handle edit_block command
 *
 * @param args Command arguments
 * @returns Command result
 */
export async function handleEditBlock(args: any) {
  try {
    const { path, diff } = args;
    
    // Apply the diff
    const success = await applyDiff(path, diff);
    
    if (success) {
      return {
        content: [{ type: "text", text: `Successfully applied diff to ${path}` }],
      };
    } else {
      return {
        content: [{ type: "text", text: `Failed to apply diff to ${path}` }],
        isError: true,
      };
    }
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error applying diff: ${error}` }],
      isError: true,
    };
  }
}

// Re-export the handlers from the imported modules
export {
  handleApplyDiff,
  handleFormatCode,
  handleConvertToMarkdown,
  handleFormatMarkdown,
  handleAddDependency,
  handleRemoveDependency,
  handleUpdateDependency,
  handleListDependencies,
  handleCheckForUpdates,
  handleGitInit,
  handleGitClone,
  handleGitAdd,
  handleGitCommit,
  handleGitPush,
  handleGitPull,
  handleGitBranch,
  handleGitCheckout,
  handleGitMerge,
  handleGitStatus,
  handleGitLog
};
