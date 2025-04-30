// Auto-generated but now fully vigilant Path Enforcer

import { z } from 'zod';
import * as path from 'path';
import * as fs from 'fs/promises';

let projectDirectory: string | null = null;

export function activate() {
  console.log("[TOOL] path-enforcer ACTIVATED (VIGILANT mode)");
}

export async function onFileWrite(event: { path: string; content: string }) {
  console.log(`[Path Enforcer] File write detected: ${event.path}`);
  const enforcedPath = ensurePathWithinProject(event.path);
  if (enforcedPath !== event.path) {
    console.warn(`[Path Enforcer] WARNING: File was outside project directory. Corrected: ${enforcedPath}`);
    await moveFile(event.path, enforcedPath);
  }
}

export async function onSessionStart(session: { id: string; startTime: number }) {
  console.log(`[Path Enforcer] Session started: ${session.id}`);
  if (!projectDirectory) {
    console.warn("[Path Enforcer] WARNING: Project directory not set. Expecting immediate setup.");
  }
}

export async function onCommand(command: { name: string; args: any[] }) {
  const commandName = command?.name || "unknown";
  console.log(`[Path Enforcer] Command received: ${commandName}`);

  if (commandName === 'path-enforcer:set-project') {
    if (command.args && command.args.length > 0) {
      await handleSetProjectDirectory({ path: command.args[0] });
    }
  }
}

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

/**
 * Validates if a path is within the project directory
 */
export async function handleValidatePath(args: any) {
  if (!args || typeof args !== 'object' || !args.path) {
    return errorResult("Invalid arguments for validate_path");
  }

  const filePath = path.normalize(args.path);
  const rootDir = path.normalize(args.projectRoot || projectDirectory || '');

  if (!rootDir) {
    return errorResult("Project directory not set. Please set it first.");
  }

  const isValid = filePath.startsWith(rootDir);
  const result = {
    valid: isValid,
    path: filePath,
    rootDir,
    ...(isValid
      ? { message: `Valid path within project.` }
      : { message: `Path outside project. Should be: ${path.join(rootDir, path.basename(filePath))}` }),
  };

  return {
    content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
  };
}

/**
 * Gets the current project directory
 */
export async function handleGetProjectDirectory(args: any) {
  if (projectDirectory) {
    return {
      content: [{ type: "text", text: JSON.stringify({ projectDirectory }, null, 2) }],
    };
  } else {
    return {
      content: [{ type: "text", text: "Project directory not set." }],
      isError: true,
    };
  }
}

/**
 * Sets the project directory
 */
export async function handleSetProjectDirectory(args: any) {
  if (!args || typeof args !== 'object' || !args.path) {
    return errorResult("Invalid arguments for set_project_directory");
  }

  const dirPath = path.normalize(args.path);

  try {
    await ensureDirectoryExists(dirPath);
    projectDirectory = dirPath;
    console.log(`[Path Enforcer] Project directory set to: ${projectDirectory}`);
    return {
      content: [{ type: "text", text: `Project directory set to: ${projectDirectory}` }],
    };
  } catch (error) {
    return errorResult(`Failed to set project directory: ${error}`);
  }
}

/**
 * Ensures a file path is within the project, adjusts it if needed
 */
export function ensurePathWithinProject(filePath: string): string {
  if (!projectDirectory) return filePath;

  const normalizedPath = path.normalize(filePath);
  const normalizedRoot = path.normalize(projectDirectory);

  if (normalizedPath.startsWith(normalizedRoot)) {
    return normalizedPath;
  }

  return path.join(normalizedRoot, path.basename(normalizedPath));
}

/**
 * Ensures a directory exists, creating it if necessary
 */
export async function ensureDirectoryExists(dirPath: string) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    console.error(`[Path Enforcer] Failed creating directory: ${dirPath}`, error);
    throw error;
  }
}

/**
 * Moves a file to the corrected location inside project
 */
async function moveFile(oldPath: string, newPath: string) {
  try {
    await ensureDirectoryExists(path.dirname(newPath));
    await fs.rename(oldPath, newPath);
    console.log(`[Path Enforcer] Moved file to enforced location: ${newPath}`);
  } catch (error) {
    console.error(`[Path Enforcer] Failed moving file: ${error}`);
  }
}

/**
 * Standard error formatter
 */
function errorResult(message: string) {
  return {
    content: [{ type: "text", text: message }],
    isError: true,
  };
}
