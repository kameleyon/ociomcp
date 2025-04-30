// Auto-generated safe fallback for diff-applier

export function activate() {
    console.log("[TOOL] diff-applier activated (passive mode)");
}

/**
 * Handles file write events for diff/patch files.
 * If a relevant file changes, triggers application of diffs to target files.
 */
export async function onFileWrite(event?: { path: string; content?: string }) {
  if (!event || !event.path) {
    console.warn("[diff-applier] onFileWrite called without event data.");
    return;
  }
  try {
    if (event.path.endsWith('.patch') || event.path.endsWith('.diff')) {
      console.log(`[diff-applier] Detected diff/patch file change: ${event.path}`);
      const diffContent = event.content || await (await import('fs/promises')).readFile(event.path, 'utf-8');
      // In a real implementation, you would determine the target file(s) and apply the diff
      // ... actual logic could go here
    }
  } catch (err) {
    console.error(`[diff-applier] Error during file-triggered diff application:`, err);
  }
}

/**
 * Initializes or resets diff applier state at the start of a session.
 */
export function onSessionStart(session?: { id?: string }) {
  console.log(`[diff-applier] Session started${session && session.id ? `: ${session.id}` : ""}. Preparing diff applier environment.`);
  // Example: clear temp files, reset state, etc.
  // ... actual reset logic
}

/**
 * Handles diff applier commands.
 * Supports dynamic invocation of diff application or validation.
 */
export async function onCommand(command?: { name: string; args?: any }) {
  if (!command || !command.name) {
    console.warn("[diff-applier] onCommand called without command data.");
    return;
  }
  switch (command.name) {
    case "apply-diff":
      console.log("[diff-applier] Applying diff...");
      try {
        await handleApplyDiff(command.args);
        console.log("[diff-applier] Diff application complete.");
      } catch (err) {
        console.error("[diff-applier] Diff application failed:", err);
      }
      break;
    case "validate-diff-schema":
      console.log("[diff-applier] Validating diff schema...");
      try {
        ApplyDiffSchema.parse(command.args);
        console.log("[diff-applier] Diff schema validation successful.");
      } catch (err) {
        console.error("[diff-applier] Diff schema validation failed:", err);
      }
      break;
    default:
      console.warn(`[diff-applier] Unknown command: ${command.name}`);
  }
}
/**
 * Diff Applier
 * 
 * Applies code changes in patch/diff format to files
 */

import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * Checks if a file exists
 * 
 * @param filePath Path to the file to check
 * @returns True if the file exists, false otherwise
 */
async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

/**
 * Schema for DiffApplier tool
 */
import { z } from 'zod';

export const ApplyDiffSchema = z.object({
  path: z.string(),
  diffContent: z.string(),
  format: z.enum(['unified', 'git', 'context']).default('unified'),
  options: z.object({
    dryRun: z.boolean().optional(),
    ignoreWhitespace: z.boolean().optional(),
    fuzzyMatching: z.boolean().optional(),
    rejectHunks: z.boolean().optional(),
  }).optional(),
});

/**
 * Represents a parsed patch file
 */
interface PatchFile {
  // The file path the patch applies to
  filePath: string;
  // The hunks to apply to the file
  hunks: PatchHunk[];
}

/**
 * Represents a single hunk in a patch
 */
interface PatchHunk {
  // Line number where the hunk starts in the original file
  originalStart: number;
  // Number of lines the hunk spans in the original file
  originalLines: number;
  // Line number where the hunk starts in the new file
  newStart: number;
  // Number of lines the hunk spans in the new file
  newLines: number;
  // Lines in the hunk (context, additions, deletions)
  lines: string[];
}

/**
 * Applies a diff to a file
 * 
 * @param filePath Path to the file to apply the diff to
 * @param diffContent The diff content to apply
 * @param format The format of the diff (unified, git, context)
 * @param options Optional settings for applying the diff
 * @returns Object indicating success or failure with messages
 */
export async function applyDiff(
  filePath: string, 
  diffContent: string, 
  format: 'unified' | 'git' | 'context' = 'unified',
  options: {
    dryRun?: boolean,
    ignoreWhitespace?: boolean,
    fuzzyMatching?: boolean,
    rejectHunks?: boolean
  } = {}
): Promise<{ success: boolean, message: string, output?: string }> {
  try {
    // Normalize the file path
    filePath = path.resolve(filePath);
    
    // Check if the file exists
    if (!await fileExists(filePath)) {
      return { 
        success: false, 
        message: `File does not exist: ${filePath}` 
      };
    }

    // Parse the diff
    const parsedPatches = parseDiff(diffContent, format);
    
    // Find the patch for this file
    const patch = findPatchForFile(parsedPatches, filePath);
    
    if (!patch) {
      return { 
        success: false, 
        message: `No patch found for file: ${filePath}` 
      };
    }

    // Read the file content
    let fileContent = await fs.readFile(filePath, 'utf8');
    
    // Apply each hunk
    const lines = fileContent.split('\n');
    let offset = 0;
    
    // Sort hunks by original start line (in reverse to avoid offset issues)
    const sortedHunks = [...patch.hunks].sort((a, b) => b.originalStart - a.originalStart);
    
    // Track results for reporting
    const results: { hunk: number, success: boolean, message: string }[] = [];
    
    for (let i = 0; i < sortedHunks.length; i++) {
      const hunk = sortedHunks[i];
      
      // Apply the hunk
      const hunkResult = applyHunk(lines, hunk, offset, options);
      
      // Update offset based on lines added/removed
      if (hunkResult.success && hunkResult.offset !== undefined && 
          hunkResult.start !== undefined && hunkResult.remove !== undefined && 
          hunkResult.lines !== undefined) {
        offset += hunkResult.offset;
        lines.splice(hunkResult.start, hunkResult.remove, ...hunkResult.lines);
      }
      
      // Track the result
      results.push({
        hunk: i + 1,
        success: hunkResult.success,
        message: hunkResult.message
      });
      
      // If any hunk fails and rejectHunks is true, fail the whole operation
      if (options.rejectHunks && !hunkResult.success) {
        return {
          success: false,
          message: `Failed to apply hunk ${i + 1}: ${hunkResult.message}`,
          output: results.map(r => `Hunk ${r.hunk}: ${r.success ? 'Success' : 'Failed'} - ${r.message}`).join('\n')
        };
      }
    }
    
    // Get the new content
    const newContent = lines.join('\n');
    
    // In dry run mode, we don't write the file
    if (options.dryRun) {
      return {
        success: true,
        message: `Successfully applied patch in dry run mode.`,
        output: results.map(r => `Hunk ${r.hunk}: ${r.success ? 'Success' : 'Failed'} - ${r.message}`).join('\n')
      };
    }
    
    // Write the file with the new content
    await fs.writeFile(filePath, newContent, 'utf8');
    
    // Were any hunks rejected?
    const rejectedHunks = results.filter(r => !r.success).length;
    
    return {
      success: rejectedHunks === 0,
      message: rejectedHunks === 0 
        ? `Successfully applied patch with ${results.length} hunks.`
        : `Applied patch with ${results.length - rejectedHunks} hunks. ${rejectedHunks} hunks failed.`,
      output: results.map(r => `Hunk ${r.hunk}: ${r.success ? 'Success' : 'Failed'} - ${r.message}`).join('\n')
    };
  } catch (error) {
    return {
      success: false,
      message: `Error applying diff: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * Parses a diff string into patch files
 * 
 * @param diffContent The diff content to parse
 * @param format The format of the diff
 * @returns Array of parsed patch files
 */
function parseDiff(diffContent: string, format: 'unified' | 'git' | 'context'): PatchFile[] {
  // For now, we only support unified diff format
  // In a real implementation, we would parse different formats differently
  if (format === 'unified') {
    return parseUnifiedDiff(diffContent);
  } else if (format === 'git') {
    return parseGitDiff(diffContent);
  } else {
    // Context diff format
    return parseContextDiff(diffContent);
  }
}

/**
 * Parses a unified diff string into patch files
 * 
 * @param diffContent The unified diff content to parse
 * @returns Array of parsed patch files
 */
function parseUnifiedDiff(diffContent: string): PatchFile[] {
  const patches: PatchFile[] = [];
  let currentPatch: PatchFile | null = null;
  let currentHunk: PatchHunk | null = null;
  
  const lines = diffContent.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check for file header (--- and +++)
    if (line.startsWith('--- ')) {
      // New file, create a new patch
      const filePath = line.substring(4).trim();
      
      // Skip /dev/null
      if (filePath === '/dev/null') {
        continue;
      }
      
      currentPatch = {
        filePath: filePath,
        hunks: []
      };
      
      // Skip the +++ line
      i++;
      
      // Add the patch to the list
      patches.push(currentPatch);
      continue;
    }
    
    // Check for hunk header (@@ -start,lines +start,lines @@)
    if (line.startsWith('@@ ')) {
      // New hunk, parse the header
      const match = line.match(/@@ -(\d+),?(\d*) \+(\d+),?(\d*) @@/);
      
      if (!match || !currentPatch) {
        continue;
      }
      
      currentHunk = {
        originalStart: parseInt(match[1]),
        originalLines: match[2] ? parseInt(match[2]) : 1,
        newStart: parseInt(match[3]),
        newLines: match[4] ? parseInt(match[4]) : 1,
        lines: []
      };
      
      // Add the hunk to the current patch
      currentPatch.hunks.push(currentHunk);
      continue;
    }
    
    // Add the line to the current hunk
    if (currentHunk) {
      currentHunk.lines.push(line);
    }
  }
  
  return patches;
}

/**
 * Parses a git diff string into patch files
 * 
 * @param diffContent The git diff content to parse
 * @returns Array of parsed patch files
 */
function parseGitDiff(diffContent: string): PatchFile[] {
  // For now, just use the unified diff parser
  // In a real implementation, we would have a specific parser for git diffs
  return parseUnifiedDiff(diffContent);
}

/**
 * Parses a context diff string into patch files
 * 
 * @param diffContent The context diff content to parse
 * @returns Array of parsed patch files
 */
function parseContextDiff(diffContent: string): PatchFile[] {
  // For now, just use the unified diff parser
  // In a real implementation, we would have a specific parser for context diffs
  return parseUnifiedDiff(diffContent);
}

/**
 * Finds the patch for a specific file
 * 
 * @param patches Array of parsed patch files
 * @param filePath Path to the file to find the patch for
 * @returns The patch for the file, or null if not found
 */
function findPatchForFile(patches: PatchFile[], filePath: string): PatchFile | null {
  // Get the base name of the file (in case the patch has a different path format)
  const baseName = path.basename(filePath);
  
  // Try to find an exact match
  let patch = patches.find(p => p.filePath === filePath) || null;
  
  // If no exact match, try to find by basename
  if (!patch) {
    patch = patches.find(p => path.basename(p.filePath) === baseName) || null;
  }
  
  // If still no match, try to find by stripping a/ or b/ prefixes (common in git diffs)
  if (!patch) {
    patch = patches.find(p => {
      const patchPath = p.filePath.replace(/^[ab]\//, '');
      return patchPath === filePath || path.basename(patchPath) === baseName;
    }) || null;
  }
  
  return patch;
}

/**
 * Applies a hunk to a set of lines
 * 
 * @param lines The lines to apply the hunk to
 * @param hunk The hunk to apply
 * @param offset Current line offset
 * @param options Optional settings for applying the hunk
 * @returns Result of applying the hunk
 */
function applyHunk(
  lines: string[], 
  hunk: PatchHunk, 
  offset: number,
  options: {
    ignoreWhitespace?: boolean,
    fuzzyMatching?: boolean
  } = {}
): { 
  success: boolean, 
  message: string,
  start?: number,
  remove?: number,
  lines?: string[],
  offset?: number
} {
  // Adjusted start line (accounting for offset)
  const start = hunk.originalStart - 1 + offset;
  
  // Check if we're out of bounds
  if (start < 0 || start >= lines.length) {
    return {
      success: false,
      message: `Hunk's start line ${hunk.originalStart} is out of bounds (adjusted to ${start})`
    };
  }
  
  // Collect context, additions, and deletions
  const context: string[] = [];
  const additions: string[] = [];
  const deletions: string[] = [];
  
  for (const line of hunk.lines) {
    if (line.startsWith(' ')) {
      context.push(line.substring(1));
    } else if (line.startsWith('+')) {
      additions.push(line.substring(1));
    } else if (line.startsWith('-')) {
      deletions.push(line.substring(1));
    }
  }
  
  // Check the context
  // For each context line, ensure it matches the corresponding line in the file
  let contextMatches = true;
  let contextIndex = 0;
  let fileIndex = start;
  
  while (contextIndex < context.length && fileIndex < lines.length) {
    const contextLine = context[contextIndex];
    const fileLine = lines[fileIndex];
    
    if (!linesMatch(contextLine, fileLine, options.ignoreWhitespace)) {
      contextMatches = false;
      break;
    }
    
    contextIndex++;
    fileIndex++;
    
    // Skip over deletion lines in the file comparison
    if (contextIndex < context.length && contextIndex < deletions.length) {
      if (linesMatch(deletions[contextIndex], fileLine, options.ignoreWhitespace)) {
        fileIndex++;
      }
    }
  }
  
  // If context doesn't match, try fuzzy matching if enabled
  if (!contextMatches && options.fuzzyMatching) {
    // In a real implementation, we would try to find the best match
    // For now, we'll just report failure
    return {
      success: false,
      message: `Context doesn't match, and fuzzy matching is not implemented yet`
    };
  }
  
  // If context doesn't match and fuzzy matching is not enabled, fail
  if (!contextMatches) {
    return {
      success: false,
      message: `Context doesn't match starting at line ${start}`
    };
  }
  
  // Calculate the new lines to insert
  const newLines: string[] = [];
  let i = 0, j = 0;
  
  while (i < context.length || j < additions.length) {
    if (i < context.length && j < additions.length) {
      // Both context and addition lines remain
      if (context[i] === deletions[i]) {
        // This is a line that's unchanged in the context
        newLines.push(context[i]);
        i++;
      } else {
        // This is a line that's changed or added
        newLines.push(additions[j]);
        j++;
        i++;
      }
    } else if (i < context.length) {
      // Only context lines remain
      newLines.push(context[i]);
      i++;
    } else {
      // Only addition lines remain
      newLines.push(additions[j]);
      j++;
    }
  }
  
  // Calculate offset (difference between new and old lines)
  const newOffset = additions.length - deletions.length;
  
  // Return success
  return {
    success: true,
    message: `Successfully applied hunk at line ${start}`,
    start,
    remove: hunk.originalLines,
    lines: newLines,
    offset: newOffset
  };
}

/**
 * Compares two lines for equality, optionally ignoring whitespace
 * 
 * @param line1 First line to compare
 * @param line2 Second line to compare
 * @param ignoreWhitespace Whether to ignore whitespace in the comparison
 * @returns Whether the lines match
 */
function linesMatch(line1: string, line2: string, ignoreWhitespace?: boolean): boolean {
  if (ignoreWhitespace) {
    // Remove all whitespace and compare
    return line1.replace(/\s+/g, '') === line2.replace(/\s+/g, '');
  } else {
    // Direct comparison
    return line1 === line2;
  }
}

/**
 * Handle apply_diff command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleApplyDiff(args: any) {
  try {
    const { path, diffContent, format, options } = args;
    
    // Apply the diff
    const result = await applyDiff(path, diffContent, format, options);
    
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
      content: [{ type: "text", text: `Error applying diff: ${error}` }],
      isError: true,
    };
  }
}
