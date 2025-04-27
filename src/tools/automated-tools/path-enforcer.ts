// Auto-generated safe fallback for path-enforcer

export function activate() {
    console.log("[TOOL] path-enforcer activated (passive mode)");
}

export function onFileWrite() { /* no-op */ }
export function onSessionStart() { /* no-op */ }
export function onCommand() { /* no-op */ }
import { z } from 'zod';
import * as path from 'path';
import * as fs from 'fs/promises';

// Define schemas for PathEnforcer tool
export const ValidatePathSchema = z.object({
  path: z.string(),
  projectRoot: z.string().optional(),
});

export const GetProjectDirectorySchema = z.object({
  askIfMissing: z.boolean().optional(),
});

export const SetProjectDirectorySchema = z.object({
  path: z.string(),
});

// Store for project directory
let projectDirectory: string | null = null;

/**
 * Validates if a path is within the specified project directory
 */
export async function handleValidatePath(args: any) {
  if (args && typeof args === 'object' && 'path' in args && typeof args.path === 'string') {
    const { path: filePath } = args;
    const rootDir = args.projectRoot || projectDirectory;
    
    if (!rootDir) {
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            valid: false,
            message: "Project directory not set. Please set a project directory first."
          }, null, 2)
        }],
      };
    }
    
    // Normalize paths for comparison
    const normalizedFilePath = path.normalize(filePath);
    const normalizedRootDir = path.normalize(rootDir);
    
    // Check if the file path is within the project directory
    const isWithinProject = normalizedFilePath.startsWith(normalizedRootDir);
    
    if (isWithinProject) {
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            valid: true,
            message: `Path is within the project directory: ${rootDir}`
          }, null, 2)
        }],
      };
    } else {
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            valid: false,
            message: `Path is outside the project directory: ${rootDir}`,
            suggestedPath: path.join(normalizedRootDir, path.basename(normalizedFilePath))
          }, null, 2)
        }],
      };
    }
  }
  
  return {
    content: [{ type: "text", text: "Error: Invalid arguments for validate_path" }],
    isError: true,
  };
}

/**
 * Gets the current project directory
 */
export async function handleGetProjectDirectory(args: any) {
  const askIfMissing = args && typeof args === 'object' && 'askIfMissing' in args ? args.askIfMissing : false;
  
  if (projectDirectory) {
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          projectDirectory,
          message: `Current project directory: ${projectDirectory}`
        }, null, 2)
      }],
    };
  } else if (askIfMissing) {
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          projectDirectory: null,
          message: "Project directory not set. Please provide a project directory.",
          requestInput: true
        }, null, 2)
      }],
    };
  } else {
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          projectDirectory: null,
          message: "Project directory not set."
        }, null, 2)
      }],
    };
  }
}

/**
 * Sets the project directory
 */
export async function handleSetProjectDirectory(args: any) {
  if (args && typeof args === 'object' && 'path' in args && typeof args.path === 'string') {
    const { path: dirPath } = args;
    
    try {
      // Check if the directory exists
      const stats = await fs.stat(dirPath);
      
      if (stats.isDirectory()) {
        // Set the project directory
        projectDirectory = path.normalize(dirPath);
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              success: true,
              message: `Project directory set to: ${projectDirectory}`
            }, null, 2)
          }],
        };
      } else {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              success: false,
              message: `Path is not a directory: ${dirPath}`
            }, null, 2)
          }],
          isError: true,
        };
      }
    } catch (error) {
      // If the directory doesn't exist, try to create it
      try {
        await fs.mkdir(dirPath, { recursive: true });
        
        // Set the project directory
        projectDirectory = path.normalize(dirPath);
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              success: true,
              message: `Created and set project directory to: ${projectDirectory}`
            }, null, 2)
          }],
        };
      } catch (createError) {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              success: false,
              message: `Failed to create directory: ${dirPath}`,
              error: String(createError)
            }, null, 2)
          }],
          isError: true,
        };
      }
    }
  }
  
  return {
    content: [{ type: "text", text: "Error: Invalid arguments for set_project_directory" }],
    isError: true,
  };
}

/**
 * Ensures a path is within the project directory, or adjusts it to be within
 */
export function ensurePathWithinProject(filePath: string): string {
  if (!projectDirectory) {
    // If no project directory is set, return the path as is
    return filePath;
  }
  
  // Normalize paths for comparison
  const normalizedFilePath = path.normalize(filePath);
  const normalizedRootDir = path.normalize(projectDirectory);
  
  // Check if the file path is within the project directory
  if (normalizedFilePath.startsWith(normalizedRootDir)) {
    return normalizedFilePath;
  } else {
    // If not, adjust the path to be within the project directory
    return path.join(normalizedRootDir, path.basename(normalizedFilePath));
  }
}

/**
 * Checks if a directory exists, and creates it if it doesn't
 */
export async function ensureDirectoryExists(dirPath: string): Promise<boolean> {
  try {
    // Check if the directory exists
    const stats = await fs.stat(dirPath);
    
    return stats.isDirectory();
  } catch (error) {
    // If the directory doesn't exist, try to create it
    try {
      await fs.mkdir(dirPath, { recursive: true });
      return true;
    } catch (createError) {
      return false;
    }
  }
}

