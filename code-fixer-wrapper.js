// Wrapper for code-fixer with directory validation
import * as fs from 'fs/promises';
import * as codeFixer from './dist/tools/automated-tools/code-fixer.js';

// Wrapper for handleFixCode with directory validation
export async function handleFixCode(args) {
  try {
    // Check if path is a directory
    if (args && args.path) {
      try {
        const stats = await fs.stat(args.path);
        if (stats.isDirectory()) {
          return {
            content: [{ 
              type: "text", 
              text: `Error: The provided path '${args.path}' is a directory. Please provide a file path instead.` 
            }],
            isError: true,
          };
        }
      } catch (statError) {
        // If stat fails, we'll let the original function handle the error
      }
    }
    
    // Call the original function
    return await codeFixer.handleFixCode(args);
  } catch (error) {
    return {
      content: [{ 
        type: "text", 
        text: `Error: ${error.message}` 
      }],
      isError: true,
    };
  }
}

// Wrapper for handleAnalyzeCode with directory validation
export async function handleAnalyzeCode(args) {
  try {
    // Check if path is a directory
    if (args && args.path) {
      try {
        const stats = await fs.stat(args.path);
        if (stats.isDirectory()) {
          return {
            content: [{ 
              type: "text", 
              text: `Error: The provided path '${args.path}' is a directory. Please provide a file path instead.` 
            }],
            isError: true,
          };
        }
      } catch (statError) {
        // If stat fails, we'll let the original function handle the error
      }
    }
    
    // Call the original function
    return await codeFixer.handleAnalyzeCode(args);
  } catch (error) {
    return {
      content: [{ 
        type: "text", 
        text: `Error: ${error.message}` 
      }],
      isError: true,
    };
  }
}

// Wrapper for handleFixProject with directory validation
export async function handleFixProject(args) {
  try {
    // Check if directory exists and is actually a directory
    if (args && args.directory) {
      try {
        const stats = await fs.stat(args.directory);
        if (!stats.isDirectory()) {
          return {
            content: [{ 
              type: "text", 
              text: `Error: The provided path '${args.directory}' is not a directory.` 
            }],
            isError: true,
          };
        }
      } catch (statError) {
        return {
          content: [{
            type: "text",
            text: `Error: Could not access directory '${args.directory}': Directory does not exist`
          }],
          isError: true,
        };
      }
    }
    
    // Call the original function
    return await codeFixer.handleFixProject(args);
  } catch (error) {
    return {
      content: [{ 
        type: "text", 
        text: `Error: ${error.message}` 
      }],
      isError: true,
    };
  }
}

// Export other functions from the original module
export const { 
  activate, 
  onFileWrite, 
  onSessionStart, 
  onCommand 
} = codeFixer;