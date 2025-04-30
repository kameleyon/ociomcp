// Auto-generated safe fallback for git-tool

export function activate() {
    console.log("[TOOL] git-tool activated (passive mode)");
}

/**
 * Handles file write events for git-related files.
 * If a relevant file changes, triggers status checks or hooks.
 */
export async function onFileWrite(event?: { path: string; content?: string }) {
  if (!event || !event.path) {
    console.warn("[git-tool] onFileWrite called without event data.");
    return;
  }
  try {
    if (event.path.endsWith('.gitignore') || event.path.endsWith('.gitattributes') || event.path.endsWith('.gitmodules')) {
      console.log(`[git-tool] Detected git config file change: ${event.path}`);
      // Optionally trigger git status or reload hooks
      // ... actual logic could go here
    }
  } catch (err) {
    console.error(`[git-tool] Error during file-triggered git operation:`, err);
  }
}

/**
 * Initializes or resets git tool state at the start of a session.
 */
export function onSessionStart(session?: { id?: string }) {
  console.log(`[git-tool] Session started${session && session.id ? `: ${session.id}` : ""}. Preparing git tool environment.`);
  // Example: clear temp files, reset state, etc.
  // ... actual reset logic
}

/**
 * Handles git tool commands.
 * Supports dynamic invocation of git operations (init, clone, add, commit, push, pull, branch, checkout, merge, status, log, etc.).
 */
export async function onCommand(command?: { name: string; args?: any }) {
  if (!command || !command.name) {
    console.warn("[git-tool] onCommand called without command data.");
    return;
  }
  switch (command.name) {
    case "git-init":
      console.log("[git-tool] Initializing git repository...");
      try {
        await handleGitInit(command.args);
        console.log("[git-tool] Git repository initialization complete.");
      } catch (err) {
        console.error("[git-tool] Git repository initialization failed:", err);
      }
      break;
    case "git-clone":
      console.log("[git-tool] Cloning git repository...");
      try {
        await handleGitClone(command.args);
        console.log("[git-tool] Git repository clone complete.");
      } catch (err) {
        console.error("[git-tool] Git repository clone failed:", err);
      }
      break;
    case "git-add":
      console.log("[git-tool] Adding files to git...");
      try {
        await handleGitAdd(command.args);
        console.log("[git-tool] Git add complete.");
      } catch (err) {
        console.error("[git-tool] Git add failed:", err);
      }
      break;
    case "git-commit":
      console.log("[git-tool] Committing changes...");
      try {
        await handleGitCommit(command.args);
        console.log("[git-tool] Git commit complete.");
      } catch (err) {
        console.error("[git-tool] Git commit failed:", err);
      }
      break;
    case "git-push":
      console.log("[git-tool] Pushing changes...");
      try {
        await handleGitPush(command.args);
        console.log("[git-tool] Git push complete.");
      } catch (err) {
        console.error("[git-tool] Git push failed:", err);
      }
      break;
    case "git-pull":
      console.log("[git-tool] Pulling changes...");
      try {
        await handleGitPull(command.args);
        console.log("[git-tool] Git pull complete.");
      } catch (err) {
        console.error("[git-tool] Git pull failed:", err);
      }
      break;
    case "git-branch":
      console.log("[git-tool] Managing git branches...");
      try {
        await handleGitBranch(command.args);
        console.log("[git-tool] Git branch operation complete.");
      } catch (err) {
        console.error("[git-tool] Git branch operation failed:", err);
      }
      break;
    case "git-checkout":
      console.log("[git-tool] Checking out git branch...");
      try {
        await handleGitCheckout(command.args);
        console.log("[git-tool] Git checkout complete.");
      } catch (err) {
        console.error("[git-tool] Git checkout failed:", err);
      }
      break;
    case "git-merge":
      console.log("[git-tool] Merging git branch...");
      try {
        await handleGitMerge(command.args);
        console.log("[git-tool] Git merge complete.");
      } catch (err) {
        console.error("[git-tool] Git merge failed:", err);
      }
      break;
    case "git-status":
      console.log("[git-tool] Getting git status...");
      try {
        await handleGitStatus(command.args);
        console.log("[git-tool] Git status complete.");
      } catch (err) {
        console.error("[git-tool] Git status failed:", err);
      }
      break;
    case "git-log":
      console.log("[git-tool] Getting git log...");
      try {
        await handleGitLog(command.args);
        console.log("[git-tool] Git log complete.");
      } catch (err) {
        console.error("[git-tool] Git log failed:", err);
      }
      break;
    // Add more git operations as needed...
    default:
      console.warn(`[git-tool] Unknown command: ${command.name}`);
  }
}
/**
 * Git Tool
 * 
 * Manages version control operations
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { z } from 'zod';

const execAsync = promisify(exec);

/**
 * Schema for GitTool
 */
export const GitInitSchema = z.object({
  directory: z.string(),
  bare: z.boolean().optional().default(false),
  initialBranch: z.string().optional(),
});

export const GitCloneSchema = z.object({
  repository: z.string(),
  directory: z.string().optional(),
  branch: z.string().optional(),
  depth: z.number().optional(),
  recursive: z.boolean().optional().default(false),
});

export const GitAddSchema = z.object({
  paths: z.union([z.string(), z.array(z.string())]),
  force: z.boolean().optional().default(false),
});

export const GitCommitSchema = z.object({
  message: z.string(),
  author: z.string().optional(),
  allowEmpty: z.boolean().optional().default(false),
  amend: z.boolean().optional().default(false),
});

export const GitPushSchema = z.object({
  remote: z.string().optional().default('origin'),
  branch: z.string().optional(),
  force: z.boolean().optional().default(false),
  tags: z.boolean().optional().default(false),
});

export const GitPullSchema = z.object({
  remote: z.string().optional().default('origin'),
  branch: z.string().optional(),
  rebase: z.boolean().optional().default(false),
});

export const GitBranchSchema = z.object({
  name: z.string().optional(),
  base: z.string().optional(),
  delete: z.boolean().optional().default(false),
  force: z.boolean().optional().default(false),
});

export const GitCheckoutSchema = z.object({
  branch: z.string(),
  create: z.boolean().optional().default(false),
  force: z.boolean().optional().default(false),
});

export const GitMergeSchema = z.object({
  branch: z.string(),
  message: z.string().optional(),
  noFastForward: z.boolean().optional().default(false),
  squash: z.boolean().optional().default(false),
});

export const GitStatusSchema = z.object({
  porcelain: z.boolean().optional().default(false),
});

export const GitLogSchema = z.object({
  maxCount: z.number().optional().default(10),
  skip: z.number().optional().default(0),
  format: z.string().optional(),
  file: z.string().optional(),
});

export const GitShowSchema = z.object({
  commit: z.string().optional().default('HEAD'),
  format: z.string().optional(),
});

export const GitDiffSchema = z.object({
  commit1: z.string().optional(),
  commit2: z.string().optional(),
  path: z.string().optional(),
  staged: z.boolean().optional().default(false),
});

export const GitResetSchema = z.object({
  commit: z.string().optional().default('HEAD'),
  mode: z.enum(['soft', 'mixed', 'hard']).optional().default('mixed'),
  paths: z.union([z.string(), z.array(z.string())]).optional(),
});

export const GitConfigSchema = z.object({
  name: z.string(),
  value: z.string().optional(),
  global: z.boolean().optional().default(true),
  unset: z.boolean().optional().default(false),
});

export const GitTagSchema = z.object({
  name: z.string(),
  message: z.string().optional(),
  commit: z.string().optional().default('HEAD'),
  delete: z.boolean().optional().default(false),
  force: z.boolean().optional().default(false),
});

export const GitRemoteSchema = z.object({
  name: z.string(),
  url: z.string().optional(),
  add: z.boolean().optional().default(false),
  remove: z.boolean().optional().default(false),
});

export const GitStashSchema = z.object({
  message: z.string().optional(),
  include: z.enum(['all', 'staged', 'unstaged']).optional().default('all'),
  pop: z.boolean().optional().default(false),
  apply: z.boolean().optional().default(false),
  drop: z.boolean().optional().default(false),
  stashId: z.string().optional(),
});

/**
 * Git initialization options
 */
interface GitInitOptions {
  directory: string;
  bare?: boolean;
  initialBranch?: string;
}

/**
 * Git clone options
 */
interface GitCloneOptions {
  repository: string;
  directory?: string;
  branch?: string;
  depth?: number;
  recursive?: boolean;
}

/**
 * Git add options
 */
interface GitAddOptions {
  paths: string | string[];
  force?: boolean;
}

/**
 * Git commit options
 */
interface GitCommitOptions {
  message: string;
  author?: string;
  allowEmpty?: boolean;
  amend?: boolean;
}

/**
 * Git push options
 */
interface GitPushOptions {
  remote?: string;
  branch?: string;
  force?: boolean;
  tags?: boolean;
}

/**
 * Git pull options
 */
interface GitPullOptions {
  remote?: string;
  branch?: string;
  rebase?: boolean;
}

/**
 * Git branch options
 */
interface GitBranchOptions {
  name?: string;
  base?: string;
  delete?: boolean;
  force?: boolean;
}

/**
 * Git checkout options
 */
interface GitCheckoutOptions {
  branch: string;
  create?: boolean;
  force?: boolean;
}

/**
 * Git merge options
 */
interface GitMergeOptions {
  branch: string;
  message?: string;
  noFastForward?: boolean;
  squash?: boolean;
}

/**
 * Git status options
 */
interface GitStatusOptions {
  porcelain?: boolean;
}

/**
 * Git log options
 */
interface GitLogOptions {
  maxCount?: number;
  skip?: number;
  format?: string;
  file?: string;
}

/**
 * Git show options
 */
interface GitShowOptions {
  commit?: string;
  format?: string;
}

/**
 * Git diff options
 */
interface GitDiffOptions {
  commit1?: string;
  commit2?: string;
  path?: string;
  staged?: boolean;
}

/**
 * Git reset options
 */
interface GitResetOptions {
  commit?: string;
  mode?: 'soft' | 'mixed' | 'hard';
  paths?: string | string[];
}

/**
 * Git config options
 */
interface GitConfigOptions {
  name: string;
  value?: string;
  global?: boolean;
  unset?: boolean;
}

/**
 * Git tag options
 */
interface GitTagOptions {
  name: string;
  message?: string;
  commit?: string;
  delete?: boolean;
  force?: boolean;
}

/**
 * Git remote options
 */
interface GitRemoteOptions {
  name: string;
  url?: string;
  add?: boolean;
  remove?: boolean;
}

/**
 * Git stash options
 */
interface GitStashOptions {
  message?: string;
  include?: 'all' | 'staged' | 'unstaged';
  pop?: boolean;
  apply?: boolean;
  drop?: boolean;
  stashId?: string;
}

/**
 * Git command result
 */
interface GitCommandResult {
  success: boolean;
  message: string;
  stdout?: string;
  stderr?: string;
  error?: Error;
}

/**
 * Initialize a Git repository
 * 
 * @param options Git initialization options
 * @returns Git command result
 */
export async function gitInit(options: GitInitOptions): Promise<GitCommandResult> {
  try {
    const { directory, bare = false, initialBranch } = options;
    
    // Create the directory if it doesn't exist
    await fs.mkdir(directory, { recursive: true });
    
    // Build the command
    let command = 'git init';
    
    if (bare) {
      command += ' --bare';
    }
    
    if (initialBranch) {
      command += ` --initial-branch=${initialBranch}`;
    }
    
    // Execute the command
    const { stdout, stderr } = await execAsync(command, { cwd: directory });
    
    return {
      success: true,
      message: 'Git repository initialized successfully',
      stdout,
      stderr,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to initialize Git repository: ${error instanceof Error ? error.message : String(error)}`,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

/**
 * Clone a Git repository
 * 
 * @param options Git clone options
 * @returns Git command result
 */
export async function gitClone(options: GitCloneOptions): Promise<GitCommandResult> {
  try {
    const { repository, directory, branch, depth, recursive = false } = options;
    
    // Build the command
    let command = `git clone ${repository}`;
    
    if (directory) {
      command += ` ${directory}`;
    }
    
    if (branch) {
      command += ` --branch ${branch}`;
    }
    
    if (depth) {
      command += ` --depth ${depth}`;
    }
    
    if (recursive) {
      command += ' --recursive';
    }
    
    // Execute the command
    const { stdout, stderr } = await execAsync(command);
    
    return {
      success: true,
      message: 'Git repository cloned successfully',
      stdout,
      stderr,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to clone Git repository: ${error instanceof Error ? error.message : String(error)}`,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

/**
 * Add files to the Git staging area
 * 
 * @param options Git add options
 * @returns Git command result
 */
export async function gitAdd(options: GitAddOptions): Promise<GitCommandResult> {
  try {
    const { paths, force = false } = options;
    
    // Build the command
    let command = 'git add';
    
    if (force) {
      command += ' -f';
    }
    
    if (Array.isArray(paths)) {
      command += ` ${paths.join(' ')}`;
    } else {
      command += ` ${paths}`;
    }
    
    // Execute the command
    const { stdout, stderr } = await execAsync(command);
    
    return {
      success: true,
      message: 'Files added to Git staging area successfully',
      stdout,
      stderr,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to add files to Git staging area: ${error instanceof Error ? error.message : String(error)}`,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

/**
 * Commit changes to the Git repository
 * 
 * @param options Git commit options
 * @returns Git command result
 */
export async function gitCommit(options: GitCommitOptions): Promise<GitCommandResult> {
  try {
    const { message, author, allowEmpty = false, amend = false } = options;
    
    // Build the command
    let command = 'git commit';
    
    if (author) {
      command += ` --author="${author}"`;
    }
    
    if (allowEmpty) {
      command += ' --allow-empty';
    }
    
    if (amend) {
      command += ' --amend';
    }
    
    command += ` -m "${message}"`;
    
    // Execute the command
    const { stdout, stderr } = await execAsync(command);
    
    return {
      success: true,
      message: 'Changes committed to Git repository successfully',
      stdout,
      stderr,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to commit changes to Git repository: ${error instanceof Error ? error.message : String(error)}`,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

/**
 * Push changes to a remote Git repository
 * 
 * @param options Git push options
 * @returns Git command result
 */
export async function gitPush(options: GitPushOptions): Promise<GitCommandResult> {
  try {
    const { remote = 'origin', branch, force = false, tags = false } = options;
    
    // Build the command
    let command = `git push ${remote}`;
    
    if (branch) {
      command += ` ${branch}`;
    }
    
    if (force) {
      command += ' --force';
    }
    
    if (tags) {
      command += ' --tags';
    }
    
    // Execute the command
    const { stdout, stderr } = await execAsync(command);
    
    return {
      success: true,
      message: 'Changes pushed to remote Git repository successfully',
      stdout,
      stderr,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to push changes to remote Git repository: ${error instanceof Error ? error.message : String(error)}`,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

/**
 * Pull changes from a remote Git repository
 * 
 * @param options Git pull options
 * @returns Git command result
 */
export async function gitPull(options: GitPullOptions): Promise<GitCommandResult> {
  try {
    const { remote = 'origin', branch, rebase = false } = options;
    
    // Build the command
    let command = `git pull ${remote}`;
    
    if (branch) {
      command += ` ${branch}`;
    }
    
    if (rebase) {
      command += ' --rebase';
    }
    
    // Execute the command
    const { stdout, stderr } = await execAsync(command);
    
    return {
      success: true,
      message: 'Changes pulled from remote Git repository successfully',
      stdout,
      stderr,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to pull changes from remote Git repository: ${error instanceof Error ? error.message : String(error)}`,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

/**
 * Create, list, or delete Git branches
 * 
 * @param options Git branch options
 * @returns Git command result
 */
export async function gitBranch(options: GitBranchOptions): Promise<GitCommandResult> {
  try {
    const { name, base, delete: deleteBranch = false, force = false } = options;
    
    // Build the command
    let command = 'git branch';
    
    if (deleteBranch) {
      command += force ? ' -D' : ' -d';
      command += ` ${name}`;
    } else if (name) {
      command += ` ${name}`;
      
      if (base) {
        command += ` ${base}`;
      }
    }
    
    // Execute the command
    const { stdout, stderr } = await execAsync(command);
    
    return {
      success: true,
      message: name
        ? deleteBranch
          ? `Git branch ${name} deleted successfully`
          : `Git branch ${name} created successfully`
        : 'Git branches listed successfully',
      stdout,
      stderr,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to ${options.name ? (options.delete ? 'delete' : 'create') : 'list'} Git branch: ${error instanceof Error ? error.message : String(error)}`,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

/**
 * Checkout a Git branch
 * 
 * @param options Git checkout options
 * @returns Git command result
 */
export async function gitCheckout(options: GitCheckoutOptions): Promise<GitCommandResult> {
  try {
    const { branch, create = false, force = false } = options;
    
    // Build the command
    let command = 'git checkout';
    
    if (create) {
      command += ' -b';
    }
    
    if (force) {
      command += ' -f';
    }
    
    command += ` ${branch}`;
    
    // Execute the command
    const { stdout, stderr } = await execAsync(command);
    
    return {
      success: true,
      message: `Git branch ${branch} checked out successfully`,
      stdout,
      stderr,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to checkout Git branch: ${error instanceof Error ? error.message : String(error)}`,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

/**
 * Merge a Git branch
 * 
 * @param options Git merge options
 * @returns Git command result
 */
export async function gitMerge(options: GitMergeOptions): Promise<GitCommandResult> {
  try {
    const { branch, message, noFastForward = false, squash = false } = options;
    
    // Build the command
    let command = 'git merge';
    
    if (noFastForward) {
      command += ' --no-ff';
    }
    
    if (squash) {
      command += ' --squash';
    }
    
    if (message) {
      command += ` -m "${message}"`;
    }
    
    command += ` ${branch}`;
    
    // Execute the command
    const { stdout, stderr } = await execAsync(command);
    
    return {
      success: true,
      message: `Git branch ${branch} merged successfully`,
      stdout,
      stderr,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to merge Git branch: ${error instanceof Error ? error.message : String(error)}`,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

/**
 * Get the status of the Git repository
 * 
 * @param options Git status options
 * @returns Git command result
 */
export async function gitStatus(options: GitStatusOptions = {}): Promise<GitCommandResult> {
  try {
    const { porcelain = false } = options;
    
    // Build the command
    let command = 'git status';
    
    if (porcelain) {
      command += ' --porcelain';
    }
    
    // Execute the command
    const { stdout, stderr } = await execAsync(command);
    
    return {
      success: true,
      message: 'Git status retrieved successfully',
      stdout,
      stderr,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to get Git status: ${error instanceof Error ? error.message : String(error)}`,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

/**
 * Get the log of the Git repository
 * 
 * @param options Git log options
 * @returns Git command result
 */
export async function gitLog(options: GitLogOptions = {}): Promise<GitCommandResult> {
  try {
    const { maxCount = 10, skip = 0, format, file } = options;
    
    // Build the command
    let command = 'git log';
    
    command += ` -n ${maxCount}`;
    
    if (skip > 0) {
      command += ` --skip=${skip}`;
    }
    
    if (format) {
      command += ` --format=${format}`;
    }
    
    if (file) {
      command += ` -- ${file}`;
    }
    
    // Execute the command
    const { stdout, stderr } = await execAsync(command);
    
    return {
      success: true,
      message: 'Git log retrieved successfully',
      stdout,
      stderr,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to get Git log: ${error instanceof Error ? error.message : String(error)}`,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

/**
 * Show a Git commit
 * 
 * @param options Git show options
 * @returns Git command result
 */
export async function gitShow(options: GitShowOptions = {}): Promise<GitCommandResult> {
  try {
    const { commit = 'HEAD', format } = options;
    
    // Build the command
    let command = 'git show';
    
    if (format) {
      command += ` --format=${format}`;
    }
    
    command += ` ${commit}`;
    
    // Execute the command
    const { stdout, stderr } = await execAsync(command);
    
    return {
      success: true,
      message: 'Git commit shown successfully',
      stdout,
      stderr,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to show Git commit: ${error instanceof Error ? error.message : String(error)}`,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

/**
 * Get the diff of the Git repository
 * 
 * @param options Git diff options
 * @returns Git command result
 */
export async function gitDiff(options: GitDiffOptions = {}): Promise<GitCommandResult> {
  try {
    const { commit1, commit2, path, staged = false } = options;
    
    // Build the command
    let command = 'git diff';
    
    if (staged) {
      command += ' --staged';
    }
    
    if (commit1) {
      command += ` ${commit1}`;
      
      if (commit2) {
        command += `..${commit2}`;
      }
    }
    
    if (path) {
      command += ` -- ${path}`;
    }
    
    // Execute the command
    const { stdout, stderr } = await execAsync(command);
    
    return {
      success: true,
      message: 'Git diff retrieved successfully',
      stdout,
      stderr,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to get Git diff: ${error instanceof Error ? error.message : String(error)}`,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

/**
 * Reset the Git repository
 * 
 * @param options Git reset options
 * @returns Git command result
 */
export async function gitReset(options: GitResetOptions = {}): Promise<GitCommandResult> {
  try {
    const { commit = 'HEAD', mode = 'mixed', paths } = options;
    
    // Build the command
    let command = 'git reset';
    
    if (mode === 'soft') {
      command += ' --soft';
    } else if (mode === 'hard') {
      command += ' --hard';
    }
    
    command += ` ${commit}`;
    
    if (paths) {
      if (Array.isArray(paths)) {
        command += ` -- ${paths.join(' ')}`;
      } else {
        command += ` -- ${paths}`;
      }
    }
    
    // Execute the command
    const { stdout, stderr } = await execAsync(command);
    
    return {
      success: true,
      message: 'Git repository reset successfully',
      stdout,
      stderr,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to reset Git repository: ${error instanceof Error ? error.message : String(error)}`,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

/**
 * Configure Git
 * 
 * @param options Git config options
 * @returns Git command result
 */
export async function gitConfig(options: GitConfigOptions): Promise<GitCommandResult> {
  try {
    const { name, value, global = true, unset = false } = options;
    
    // Build the command
    let command = 'git config';
    
    if (global) {
      command += ' --global';
    }
    
    if (unset) {
      command += ' --unset';
      command += ` ${name}`;
    } else {
      command += ` ${name}`;
      
      if (value !== undefined) {
        command += ` "${value}"`;
      }
    }
    
    // Execute the command
    const { stdout, stderr } = await execAsync(command);
    
    return {
      success: true,
      message: unset
        ? `Git config ${name} unset successfully`
        : value !== undefined
          ? `Git config ${name} set to ${value} successfully`
          : `Git config ${name} retrieved successfully`,
      stdout,
      stderr,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to ${options.unset ? 'unset' : options.value !== undefined ? 'set' : 'get'} Git config: ${error instanceof Error ? error.message : String(error)}`,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

/**
 * Create, list, or delete Git tags
 * 
 * @param options Git tag options
 * @returns Git command result
 */
export async function gitTag(options: GitTagOptions): Promise<GitCommandResult> {
  try {
    const { name, message, commit = 'HEAD', delete: deleteTag = false, force = false } = options;
    
    // Build the command
    let command = 'git tag';
    
    if (deleteTag) {
      command += force ? ' -d' : ' -d';
      command += ` ${name}`;
    } else {
      if (message) {
        command += ` -m "${message}"`;
      }
      
      if (force) {
        command += ' -f';
      }
      
      command += ` ${name} ${commit}`;
    }
    
    // Execute the command
    const { stdout, stderr } = await execAsync(command);
    
    return {
      success: true,
      message: deleteTag
        ? `Git tag ${name} deleted successfully`
        : `Git tag ${name} created successfully`,
      stdout,
      stderr,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to ${options.delete ? 'delete' : 'create'} Git tag: ${error instanceof Error ? error.message : String(error)}`,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

/**
 * Manage Git remotes
 * 
 * @param options Git remote options
 * @returns Git command result
 */
export async function gitRemote(options: GitRemoteOptions): Promise<GitCommandResult> {
  try {
    const { name, url, add = false, remove = false } = options;
    
    // Build the command
    let command = 'git remote';
    
    if (add) {
      command += ' add';
      command += ` ${name} ${url}`;
    } else if (remove) {
      command += ' remove';
      command += ` ${name}`;
    } else if (url) {
      command += ' set-url';
      command += ` ${name} ${url}`;
    } else {
      command += ' -v';
    }
    
    // Execute the command
    const { stdout, stderr } = await execAsync(command);
    
    return {
      success: true,
      message: add
        ? `Git remote ${name} added successfully`
        : remove
          ? `Git remote ${name} removed successfully`
          : url
            ? `Git remote ${name} URL set to ${url} successfully`
            : 'Git remotes listed successfully',
      stdout,
      stderr,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to ${options.add ? 'add' : options.remove ? 'remove' : options.url ? 'set URL for' : 'list'} Git remote: ${error instanceof Error ? error.message : String(error)}`,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

/**
 * Manage Git stash
 * 
 * @param options Git stash options
 * @returns Git command result
 */
export async function gitStash(options: GitStashOptions = {}): Promise<GitCommandResult> {
  try {
    const { message, include = 'all', pop = false, apply = false, drop = false, stashId } = options;
    
    // Build the command
    let command = 'git stash';
    
    if (pop) {
      command += ' pop';
      
      if (stashId) {
        command += ` ${stashId}`;
      }
    } else if (apply) {
      command += ' apply';
      
      if (stashId) {
        command += ` ${stashId}`;
      }
    } else if (drop) {
      command += ' drop';
      
      if (stashId) {
        command += ` ${stashId}`;
      }
    } else {
      if (include === 'all') {
        command += ' push';
      } else if (include === 'staged') {
        command += ' push --staged';
      } else if (include === 'unstaged') {
        command += ' push --keep-index';
      }
      
      if (message) {
        command += ` -m "${message}"`;
      }
    }
    
    // Execute the command
    const { stdout, stderr } = await execAsync(command);
    
    return {
      success: true,
      message: pop
        ? 'Git stash popped successfully'
        : apply
          ? 'Git stash applied successfully'
          : drop
            ? 'Git stash dropped successfully'
            : 'Git changes stashed successfully',
      stdout,
      stderr,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to ${options.pop ? 'pop' : options.apply ? 'apply' : options.drop ? 'drop' : 'create'} Git stash: ${error instanceof Error ? error.message : String(error)}`,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

/**
 * Handle git_init command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleGitInit(args: any) {
  try {
    const result = await gitInit(args);
    
    return {
      content: [{ type: "text", text: result.message + (result.stdout ? `\n\n${result.stdout}` : '') }],
      isError: !result.success,
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error initializing Git repository: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Handle git_clone command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleGitClone(args: any) {
  try {
    const result = await gitClone(args);
    
    return {
      content: [{ type: "text", text: result.message + (result.stdout ? `\n\n${result.stdout}` : '') }],
      isError: !result.success,
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error cloning Git repository: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Handle git_add command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleGitAdd(args: any) {
  try {
    const result = await gitAdd(args);
    
    return {
      content: [{ type: "text", text: result.message + (result.stdout ? `\n\n${result.stdout}` : '') }],
      isError: !result.success,
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error adding files to Git staging area: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Handle git_commit command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleGitCommit(args: any) {
  try {
    const result = await gitCommit(args);
    
    return {
      content: [{ type: "text", text: result.message + (result.stdout ? `\n\n${result.stdout}` : '') }],
      isError: !result.success,
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error committing changes to Git repository: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Handle git_push command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleGitPush(args: any) {
  try {
    const result = await gitPush(args);
    
    return {
      content: [{ type: "text", text: result.message + (result.stdout ? `\n\n${result.stdout}` : '') }],
      isError: !result.success,
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error pushing changes to remote Git repository: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Handle git_pull command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleGitPull(args: any) {
  try {
    const result = await gitPull(args);
    
    return {
      content: [{ type: "text", text: result.message + (result.stdout ? `\n\n${result.stdout}` : '') }],
      isError: !result.success,
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error pulling changes from remote Git repository: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Handle git_branch command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleGitBranch(args: any) {
  try {
    const result = await gitBranch(args);
    
    return {
      content: [{ type: "text", text: result.message + (result.stdout ? `\n\n${result.stdout}` : '') }],
      isError: !result.success,
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error managing Git branches: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Handle git_checkout command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleGitCheckout(args: any) {
  try {
    const result = await gitCheckout(args);
    
    return {
      content: [{ type: "text", text: result.message + (result.stdout ? `\n\n${result.stdout}` : '') }],
      isError: !result.success,
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error checking out Git branch: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Handle git_merge command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleGitMerge(args: any) {
  try {
    const result = await gitMerge(args);
    
    return {
      content: [{ type: "text", text: result.message + (result.stdout ? `\n\n${result.stdout}` : '') }],
      isError: !result.success,
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error merging Git branch: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Handle git_status command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleGitStatus(args: any) {
  try {
    const result = await gitStatus(args);
    
    return {
      content: [{ type: "text", text: result.message + (result.stdout ? `\n\n${result.stdout}` : '') }],
      isError: !result.success,
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error getting Git status: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Handle git_log command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleGitLog(args: any) {
  try {
    const result = await gitLog(args);
    
    return {
      content: [{ type: "text", text: result.message + (result.stdout ? `\n\n${result.stdout}` : '') }],
      isError: !result.success,
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error getting Git log: ${error}` }],
      isError: true,
    };
  }
}
