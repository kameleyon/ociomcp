// Auto-generated safe fallback for dependency-tool

export function activate() {
    console.log("[TOOL] dependency-tool activated (passive mode)");
}

/**
 * Handles file write events for dependency files (package.json, lock files).
 * If a relevant file changes, triggers dependency checks or updates.
 */
export async function onFileWrite(event?: { path: string; content?: string }) {
  if (!event || !event.path) {
    console.warn("[dependency-tool] onFileWrite called without event data.");
    return;
  }
  try {
    if (event.path.endsWith('package.json') || event.path.endsWith('yarn.lock') || event.path.endsWith('pnpm-lock.yaml') || event.path.endsWith('package-lock.json')) {
      console.log(`[dependency-tool] Detected dependency file change: ${event.path}`);
      // Optionally check for updates or validate dependencies
      // ... actual logic could go here
    }
  } catch (err) {
    console.error(`[dependency-tool] Error during file-triggered dependency operation:`, err);
  }
}

/**
 * Initializes or resets dependency tool state at the start of a session.
 */
export function onSessionStart(session?: { id?: string }) {
  console.log(`[dependency-tool] Session started${session && session.id ? `: ${session.id}` : ""}. Preparing dependency tool environment.`);
  // Example: clear temp files, reset state, etc.
  // ... actual reset logic
}

/**
 * Handles dependency tool commands.
 * Supports dynamic invocation of dependency operations (add, remove, update, list, check for updates, validate).
 */
export async function onCommand(command?: { name: string; args?: any }) {
  if (!command || !command.name) {
    console.warn("[dependency-tool] onCommand called without command data.");
    return;
  }
  switch (command.name) {
    case "add-dependency":
      console.log("[dependency-tool] Adding dependency...");
      try {
        await handleAddDependency(command.args);
        console.log("[dependency-tool] Dependency addition complete.");
      } catch (err) {
        console.error("[dependency-tool] Dependency addition failed:", err);
      }
      break;
    case "remove-dependency":
      console.log("[dependency-tool] Removing dependency...");
      try {
        await handleRemoveDependency(command.args);
        console.log("[dependency-tool] Dependency removal complete.");
      } catch (err) {
        console.error("[dependency-tool] Dependency removal failed:", err);
      }
      break;
    case "update-dependency":
      console.log("[dependency-tool] Updating dependency...");
      try {
        await handleUpdateDependency(command.args);
        console.log("[dependency-tool] Dependency update complete.");
      } catch (err) {
        console.error("[dependency-tool] Dependency update failed:", err);
      }
      break;
    case "list-dependencies":
      console.log("[dependency-tool] Listing dependencies...");
      try {
        await handleListDependencies(command.args);
        console.log("[dependency-tool] Dependency listing complete.");
      } catch (err) {
        console.error("[dependency-tool] Dependency listing failed:", err);
      }
      break;
    case "check-for-updates":
      console.log("[dependency-tool] Checking for dependency updates...");
      try {
        await handleCheckForUpdates(command.args);
        console.log("[dependency-tool] Dependency update check complete.");
      } catch (err) {
        console.error("[dependency-tool] Dependency update check failed:", err);
      }
      break;
    case "validate-dependency-schema":
      console.log("[dependency-tool] Validating dependency schema...");
      try {
        AddDependencySchema.parse(command.args);
        RemoveDependencySchema.parse(command.args);
        UpdateDependencySchema.parse(command.args);
        ListDependenciesSchema.parse(command.args);
        CheckForUpdatesSchema.parse(command.args);
        console.log("[dependency-tool] Dependency schema validation successful.");
      } catch (err) {
        console.error("[dependency-tool] Dependency schema validation failed:", err);
      }
      break;
    default:
      console.warn(`[dependency-tool] Unknown command: ${command.name}`);
  }
}
/**
 * Dependency Tool
 * 
 * Adds, removes, and updates project dependencies
 * Resolves version conflicts and ensures compatibility
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { spawn } from 'child_process';
import { z } from 'zod';

/**
 * Schema for DependencyTool
 */
export const AddDependencySchema = z.object({
  packageName: z.string(),
  version: z.string().optional(),
  isDev: z.boolean().optional(),
  packageManager: z.enum(['npm', 'yarn', 'pnpm', 'auto']).default('auto'),
  path: z.string().optional(),
});

export const RemoveDependencySchema = z.object({
  packageName: z.string(),
  packageManager: z.enum(['npm', 'yarn', 'pnpm', 'auto']).default('auto'),
  path: z.string().optional(),
});

export const UpdateDependencySchema = z.object({
  packageName: z.string(),
  version: z.string().optional(),
  packageManager: z.enum(['npm', 'yarn', 'pnpm', 'auto']).default('auto'),
  path: z.string().optional(),
});

export const ListDependenciesSchema = z.object({
  type: z.enum(['all', 'prod', 'dev']).default('all'),
  packageManager: z.enum(['npm', 'yarn', 'pnpm', 'auto']).default('auto'),
  path: z.string().optional(),
});

export const CheckForUpdatesSchema = z.object({
  packageManager: z.enum(['npm', 'yarn', 'pnpm', 'auto']).default('auto'),
  path: z.string().optional(),
});

/**
 * Detects the package manager used in a project
 * 
 * @param projectPath Path to the project
 * @returns Detected package manager
 */
async function detectPackageManager(projectPath: string): Promise<string> {
  try {
    // Check for lock files
    const files = await fs.readdir(projectPath);
    
    if (files.includes('yarn.lock')) {
      return 'yarn';
    } else if (files.includes('pnpm-lock.yaml')) {
      return 'pnpm';
    } else if (files.includes('package-lock.json')) {
      return 'npm';
    }
    
    // Default to npm
    return 'npm';
  } catch (error) {
    // If there's an error, default to npm
    return 'npm';
  }
}

/**
 * Executes a command and returns the output
 * 
 * @param command Command to execute
 * @param args Command arguments
 * @param cwd Working directory
 * @returns Command output
 */
function executeCommand(command: string, args: string[], cwd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args, { cwd });
    let stdout = '';
    let stderr = '';
    
    process.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    process.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    process.on('close', (code) => {
      if (code === 0) {
        resolve(stdout);
      } else {
        reject(new Error(`Command failed with code ${code}: ${stderr}`));
      }
    });
    
    process.on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * Adds a dependency to a project
 * 
 * @param packageName Name of the package to add
 * @param version Version of the package to add
 * @param isDev Whether the package is a dev dependency
 * @param packageManager Package manager to use
 * @param projectPath Path to the project
 * @returns Result of the operation
 */
export async function addDependency(
  packageName: string,
  version?: string,
  isDev: boolean = false,
  packageManager: string = 'auto',
  projectPath: string = process.cwd()
): Promise<{ success: boolean, message: string, output?: string }> {
  try {
    // Normalize the project path
    projectPath = path.resolve(projectPath);
    
    // Detect the package manager if set to auto
    if (packageManager === 'auto') {
      packageManager = await detectPackageManager(projectPath);
    }
    
    // Format the package name with version if provided
    const packageSpec = version ? `${packageName}@${version}` : packageName;
    
    // Prepare the command and arguments based on the package manager
    let command: string;
    let args: string[];
    
    switch (packageManager) {
      case 'yarn':
        command = 'yarn';
        args = ['add', packageSpec];
        if (isDev) {
          args.push('--dev');
        }
        break;
      case 'pnpm':
        command = 'pnpm';
        args = ['add', packageSpec];
        if (isDev) {
          args.push('--save-dev');
        }
        break;
      case 'npm':
      default:
        command = 'npm';
        args = ['install', packageSpec];
        if (isDev) {
          args.push('--save-dev');
        } else {
          args.push('--save');
        }
        break;
    }
    
    // Execute the command
    const output = await executeCommand(command, args, projectPath);
    
    return {
      success: true,
      message: `Successfully added ${packageSpec} to ${isDev ? 'dev dependencies' : 'dependencies'}.`,
      output
    };
  } catch (error) {
    return {
      success: false,
      message: `Error adding dependency: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * Removes a dependency from a project
 * 
 * @param packageName Name of the package to remove
 * @param packageManager Package manager to use
 * @param projectPath Path to the project
 * @returns Result of the operation
 */
export async function removeDependency(
  packageName: string,
  packageManager: string = 'auto',
  projectPath: string = process.cwd()
): Promise<{ success: boolean, message: string, output?: string }> {
  try {
    // Normalize the project path
    projectPath = path.resolve(projectPath);
    
    // Detect the package manager if set to auto
    if (packageManager === 'auto') {
      packageManager = await detectPackageManager(projectPath);
    }
    
    // Prepare the command and arguments based on the package manager
    let command: string;
    let args: string[];
    
    switch (packageManager) {
      case 'yarn':
        command = 'yarn';
        args = ['remove', packageName];
        break;
      case 'pnpm':
        command = 'pnpm';
        args = ['remove', packageName];
        break;
      case 'npm':
      default:
        command = 'npm';
        args = ['uninstall', packageName];
        break;
    }
    
    // Execute the command
    const output = await executeCommand(command, args, projectPath);
    
    return {
      success: true,
      message: `Successfully removed ${packageName}.`,
      output
    };
  } catch (error) {
    return {
      success: false,
      message: `Error removing dependency: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * Updates a dependency in a project
 * 
 * @param packageName Name of the package to update
 * @param version Version to update to
 * @param packageManager Package manager to use
 * @param projectPath Path to the project
 * @returns Result of the operation
 */
export async function updateDependency(
  packageName: string,
  version?: string,
  packageManager: string = 'auto',
  projectPath: string = process.cwd()
): Promise<{ success: boolean, message: string, output?: string }> {
  try {
    // Normalize the project path
    projectPath = path.resolve(projectPath);
    
    // Detect the package manager if set to auto
    if (packageManager === 'auto') {
      packageManager = await detectPackageManager(projectPath);
    }
    
    // Format the package name with version if provided
    const packageSpec = version ? `${packageName}@${version}` : packageName;
    
    // Prepare the command and arguments based on the package manager
    let command: string;
    let args: string[];
    
    switch (packageManager) {
      case 'yarn':
        command = 'yarn';
        args = version ? ['add', packageSpec] : ['upgrade', packageName];
        break;
      case 'pnpm':
        command = 'pnpm';
        args = version ? ['add', packageSpec] : ['update', packageName];
        break;
      case 'npm':
      default:
        command = 'npm';
        args = version ? ['install', packageSpec] : ['update', packageName];
        break;
    }
    
    // Execute the command
    const output = await executeCommand(command, args, projectPath);
    
    return {
      success: true,
      message: `Successfully updated ${packageName}${version ? ` to version ${version}` : ''}.`,
      output
    };
  } catch (error) {
    return {
      success: false,
      message: `Error updating dependency: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * Lists dependencies in a project
 * 
 * @param type Type of dependencies to list
 * @param packageManager Package manager to use
 * @param projectPath Path to the project
 * @returns Result of the operation
 */
export async function listDependencies(
  type: 'all' | 'prod' | 'dev' = 'all',
  packageManager: string = 'auto',
  projectPath: string = process.cwd()
): Promise<{ success: boolean, message: string, dependencies?: Record<string, string>, output?: string }> {
  try {
    // Normalize the project path
    projectPath = path.resolve(projectPath);
    
    // Read the package.json file
    const packageJsonPath = path.join(projectPath, 'package.json');
    const packageJsonContent = await fs.readFile(packageJsonPath, 'utf8');
    const packageJson = JSON.parse(packageJsonContent);
    
    // Get the dependencies based on the type
    const dependencies: Record<string, string> = {};
    
    if (type === 'all' || type === 'prod') {
      if (packageJson.dependencies) {
        Object.assign(dependencies, packageJson.dependencies);
      }
    }
    
    if (type === 'all' || type === 'dev') {
      if (packageJson.devDependencies) {
        Object.assign(dependencies, packageJson.devDependencies);
      }
    }
    
    // Format the output
    const formattedDependencies = Object.entries(dependencies)
      .map(([name, version]) => `${name}: ${version}`)
      .join('\n');
    
    return {
      success: true,
      message: `Dependencies (${type}):`,
      dependencies,
      output: formattedDependencies
    };
  } catch (error) {
    return {
      success: false,
      message: `Error listing dependencies: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * Checks for updates to dependencies in a project
 * 
 * @param packageManager Package manager to use
 * @param projectPath Path to the project
 * @returns Result of the operation
 */
export async function checkForUpdates(
  packageManager: string = 'auto',
  projectPath: string = process.cwd()
): Promise<{ success: boolean, message: string, updates?: Record<string, { current: string, latest: string }>, output?: string }> {
  try {
    // Normalize the project path
    projectPath = path.resolve(projectPath);
    
    // Detect the package manager if set to auto
    if (packageManager === 'auto') {
      packageManager = await detectPackageManager(projectPath);
    }
    
    // Prepare the command and arguments based on the package manager
    let command: string;
    let args: string[];
    
    switch (packageManager) {
      case 'yarn':
        command = 'yarn';
        args = ['outdated', '--json'];
        break;
      case 'pnpm':
        command = 'pnpm';
        args = ['outdated', '--format', 'json'];
        break;
      case 'npm':
      default:
        command = 'npm';
        args = ['outdated', '--json'];
        break;
    }
    
    // Execute the command
    const output = await executeCommand(command, args, projectPath);
    
    // Parse the output
    const updates: Record<string, { current: string, latest: string }> = {};
    
    try {
      const outdated = JSON.parse(output);
      
      for (const [name, info] of Object.entries(outdated)) {
        if (typeof info === 'object' && info !== null) {
          const current = (info as any).current || 'unknown';
          const latest = (info as any).latest || 'unknown';
          
          if (current !== latest) {
            updates[name] = { current, latest };
          }
        }
      }
    } catch (error) {
      // If we can't parse the JSON, just return the raw output
      return {
        success: true,
        message: 'Available updates:',
        output
      };
    }
    
    // Format the output
    const formattedUpdates = Object.entries(updates)
      .map(([name, { current, latest }]) => `${name}: ${current} -> ${latest}`)
      .join('\n');
    
    return {
      success: true,
      message: 'Available updates:',
      updates,
      output: formattedUpdates || 'All dependencies are up to date.'
    };
  } catch (error) {
    return {
      success: false,
      message: `Error checking for updates: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * Handle add_dependency command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleAddDependency(args: any) {
  try {
    const { packageName, version, isDev, packageManager, path } = args;
    
    // Add the dependency
    const result = await addDependency(packageName, version, isDev, packageManager, path);
    
    if (result.success) {
      return {
        content: [{ 
          type: "text",
          text: result.output
            ? `${result.message}\n\n${result.output}`
            : result.message
        }],
      };
    } else {
      return {
        content: [{ 
          type: "text",
          text: result.output
            ? `${result.message}\n\n${result.output}`
            : result.message
        }],
        isError: true,
      };
    }
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error adding dependency: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Handle remove_dependency command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleRemoveDependency(args: any) {
  try {
    const { packageName, packageManager, path } = args;
    
    // Remove the dependency
    const result = await removeDependency(packageName, packageManager, path);
    
    if (result.success) {
      return {
        content: [{ 
          type: "text",
          text: result.output
            ? `${result.message}\n\n${result.output}`
            : result.message
        }],
      };
    } else {
      return {
        content: [{ 
          type: "text",
          text: result.output
            ? `${result.message}\n\n${result.output}`
            : result.message
        }],
        isError: true,
      };
    }
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error removing dependency: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Handle update_dependency command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleUpdateDependency(args: any) {
  try {
    const { packageName, version, packageManager, path } = args;
    
    // Update the dependency
    const result = await updateDependency(packageName, version, packageManager, path);
    
    if (result.success) {
      return {
        content: [{ 
          type: "text",
          text: result.output
            ? `${result.message}\n\n${result.output}`
            : result.message
        }],
      };
    } else {
      return {
        content: [{ 
          type: "text",
          text: result.output
            ? `${result.message}\n\n${result.output}`
            : result.message
        }],
        isError: true,
      };
    }
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error updating dependency: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Handle list_dependencies command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleListDependencies(args: any) {
  try {
    const { type, packageManager, path } = args;
    
    // List the dependencies
    const result = await listDependencies(type, packageManager, path);
    
    if (result.success) {
      return {
        content: [{ 
          type: "text",
          text: result.output
            ? `${result.message}\n\n${result.output}`
            : result.message
        }],
      };
    } else {
      return {
        content: [{ 
          type: "text",
          text: result.output
            ? `${result.message}\n\n${result.output}`
            : result.message
        }],
        isError: true,
      };
    }
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error listing dependencies: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Handle check_for_updates command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleCheckForUpdates(args: any) {
  try {
    const { packageManager, path } = args;
    
    // Check for updates
    const result = await checkForUpdates(packageManager, path);
    
    if (result.success) {
      return {
        content: [{ 
          type: "text",
          text: result.output
            ? `${result.message}\n\n${result.output}`
            : result.message
        }],
      };
    } else {
      return {
        content: [{ 
          type: "text",
          text: result.output
            ? `${result.message}\n\n${result.output}`
            : result.message
        }],
        isError: true,
      };
    }
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error checking for updates: ${error}` }],
      isError: true,
    };
  }
}
