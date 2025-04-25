/**
 * Version Control
 * Provides functionality for tracking changes, creating snapshots, and reverting changes
 */

/**
 * Change type definitions
 */
export enum ChangeType {
  ADD = 'add',
  MODIFY = 'modify',
  DELETE = 'delete',
  RENAME = 'rename',
}

/**
 * Change severity levels
 */
export enum ChangeSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

/**
 * File change
 */
export interface FileChange {
  path: string;
  type: ChangeType;
  oldPath?: string; // For renames
  content?: string;
  oldContent?: string;
  timestamp: Date;
  author?: string;
  message?: string;
  severity?: ChangeSeverity;
}

/**
 * Snapshot
 */
export interface Snapshot {
  id: string;
  name: string;
  description?: string;
  changes: FileChange[];
  timestamp: Date;
  author?: string;
  tags?: string[];
}

/**
 * Version control state
 */
export interface VersionControlState {
  snapshots: Snapshot[];
  currentSnapshot: string | null;
  changes: FileChange[];
}

/**
 * Creates a new version control state
 */
export function createVersionControlState(): VersionControlState {
  return {
    snapshots: [],
    currentSnapshot: null,
    changes: [],
  };
}

/**
 * Records a file change
 */
export function recordChange(
  state: VersionControlState,
  change: Omit<FileChange, 'timestamp'>
): VersionControlState {
  const newState = { ...state };
  
  // Add timestamp to the change
  const newChange: FileChange = {
    ...change,
    timestamp: new Date(),
  };
  
  // Add severity if not provided
  if (!newChange.severity) {
    newChange.severity = calculateChangeSeverity(newChange);
  }
  
  // Add the change to the state
  newState.changes = [...newState.changes, newChange];
  
  return newState;
}

/**
 * Creates a snapshot of the current state
 */
export function createSnapshot(
  state: VersionControlState,
  name: string,
  description?: string,
  author?: string,
  tags?: string[]
): VersionControlState {
  const newState = { ...state };
  
  // Create a new snapshot
  const snapshot: Snapshot = {
    id: `snapshot-${Date.now()}`,
    name,
    description,
    changes: [...newState.changes],
    timestamp: new Date(),
    author,
    tags,
  };
  
  // Add the snapshot to the state
  newState.snapshots = [...newState.snapshots, snapshot];
  
  // Set the current snapshot
  newState.currentSnapshot = snapshot.id;
  
  // Clear the changes
  newState.changes = [];
  
  return newState;
}

/**
 * Reverts to a previous snapshot
 */
export function revertToSnapshot(
  state: VersionControlState,
  snapshotId: string
): VersionControlState {
  const newState = { ...state };
  
  // Find the snapshot
  const snapshot = newState.snapshots.find(s => s.id === snapshotId);
  
  if (!snapshot) {
    throw new Error(`Snapshot with ID ${snapshotId} not found`);
  }
  
  // Set the current snapshot
  newState.currentSnapshot = snapshot.id;
  
  // Clear the changes
  newState.changes = [];
  
  return newState;
}

/**
 * Gets the changes between two snapshots
 */
export function getChangesBetweenSnapshots(
  state: VersionControlState,
  fromSnapshotId: string,
  toSnapshotId: string
): FileChange[] {
  // Find the snapshots
  const fromSnapshot = state.snapshots.find(s => s.id === fromSnapshotId);
  const toSnapshot = state.snapshots.find(s => s.id === toSnapshotId);
  
  if (!fromSnapshot) {
    throw new Error(`Snapshot with ID ${fromSnapshotId} not found`);
  }
  
  if (!toSnapshot) {
    throw new Error(`Snapshot with ID ${toSnapshotId} not found`);
  }
  
  // Get the index of each snapshot
  const fromIndex = state.snapshots.indexOf(fromSnapshot);
  const toIndex = state.snapshots.indexOf(toSnapshot);
  
  // Ensure fromIndex is before toIndex
  if (fromIndex > toIndex) {
    return getChangesBetweenSnapshots(state, toSnapshotId, fromSnapshotId);
  }
  
  // Get all snapshots between fromIndex and toIndex
  const snapshots = state.snapshots.slice(fromIndex + 1, toIndex + 1);
  
  // Collect all changes
  const changes: FileChange[] = [];
  
  for (const snapshot of snapshots) {
    changes.push(...snapshot.changes);
  }
  
  return changes;
}

/**
 * Calculates the severity of a change
 */
function calculateChangeSeverity(change: FileChange): ChangeSeverity {
  // Determine severity based on change type and content
  if (change.type === ChangeType.DELETE) {
    return ChangeSeverity.HIGH;
  }
  
  if (change.type === ChangeType.RENAME) {
    return ChangeSeverity.MEDIUM;
  }
  
  if (change.type === ChangeType.ADD) {
    return ChangeSeverity.LOW;
  }
  
  if (change.type === ChangeType.MODIFY) {
    // If we have both old and new content, we can calculate the difference
    if (change.content && change.oldContent) {
      const diffPercentage = calculateDiffPercentage(change.oldContent, change.content);
      
      if (diffPercentage > 50) {
        return ChangeSeverity.HIGH;
      } else if (diffPercentage > 20) {
        return ChangeSeverity.MEDIUM;
      } else {
        return ChangeSeverity.LOW;
      }
    }
    
    return ChangeSeverity.MEDIUM;
  }
  
  return ChangeSeverity.LOW;
}

/**
 * Calculates the percentage difference between two strings
 */
function calculateDiffPercentage(oldContent: string, newContent: string): number {
  // Simple implementation: calculate the percentage of characters that have changed
  const maxLength = Math.max(oldContent.length, newContent.length);
  
  if (maxLength === 0) {
    return 0;
  }
  
  let differences = 0;
  
  for (let i = 0; i < maxLength; i++) {
    if (oldContent[i] !== newContent[i]) {
      differences++;
    }
  }
  
  return (differences / maxLength) * 100;
}

/**
 * Generates a diff between two strings
 */
export function generateDiff(oldContent: string, newContent: string): string {
  // Split the content into lines
  const oldLines = oldContent.split('\n');
  const newLines = newContent.split('\n');
  
  // Initialize the diff
  let diff = '';
  
  // Find the longest common subsequence
  const lcs = longestCommonSubsequence(oldLines, newLines);
  
  // Generate the diff
  let oldIndex = 0;
  let newIndex = 0;
  
  for (const [oldLineIndex, newLineIndex] of lcs) {
    // Add removed lines
    while (oldIndex < oldLineIndex) {
      diff += `- ${oldLines[oldIndex]}\n`;
      oldIndex++;
    }
    
    // Add added lines
    while (newIndex < newLineIndex) {
      diff += `+ ${newLines[newIndex]}\n`;
      newIndex++;
    }
    
    // Add unchanged lines
    diff += `  ${newLines[newIndex]}\n`;
    oldIndex++;
    newIndex++;
  }
  
  // Add remaining removed lines
  while (oldIndex < oldLines.length) {
    diff += `- ${oldLines[oldIndex]}\n`;
    oldIndex++;
  }
  
  // Add remaining added lines
  while (newIndex < newLines.length) {
    diff += `+ ${newLines[newIndex]}\n`;
    newIndex++;
  }
  
  return diff;
}

/**
 * Finds the longest common subsequence between two arrays
 */
function longestCommonSubsequence<T>(a: T[], b: T[]): [number, number][] {
  // Create a 2D array to store the length of the LCS
  const dp: number[][] = Array(a.length + 1)
    .fill(0)
    .map(() => Array(b.length + 1).fill(0));
  
  // Fill the dp array
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  
  // Reconstruct the LCS
  const lcs: [number, number][] = [];
  let i = a.length;
  let j = b.length;
  
  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      lcs.unshift([i - 1, j - 1]);
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }
  
  return lcs;
}

/**
 * Applies a patch to a string
 */
export function applyPatch(content: string, patch: string): string {
  // Split the content into lines
  const lines = content.split('\n');
  
  // Split the patch into lines
  const patchLines = patch.split('\n');
  
  // Initialize the result
  const result: string[] = [];
  
  // Apply the patch
  let lineIndex = 0;
  
  for (const patchLine of patchLines) {
    if (patchLine.startsWith('+ ')) {
      // Add a line
      result.push(patchLine.substring(2));
    } else if (patchLine.startsWith('- ')) {
      // Remove a line
      lineIndex++;
    } else if (patchLine.startsWith('  ')) {
      // Keep a line
      result.push(lines[lineIndex]);
      lineIndex++;
    }
  }
  
  return result.join('\n');
}

/**
 * Generates a summary of changes
 */
export function generateChangeSummary(changes: FileChange[]): string {
  // Group changes by type
  const addedFiles = changes.filter(c => c.type === ChangeType.ADD);
  const modifiedFiles = changes.filter(c => c.type === ChangeType.MODIFY);
  const deletedFiles = changes.filter(c => c.type === ChangeType.DELETE);
  const renamedFiles = changes.filter(c => c.type === ChangeType.RENAME);
  
  // Generate summary
  let summary = '';
  
  if (addedFiles.length > 0) {
    summary += `Added ${addedFiles.length} file${addedFiles.length === 1 ? '' : 's'}:\n`;
    for (const file of addedFiles) {
      summary += `  - ${file.path}\n`;
    }
    summary += '\n';
  }
  
  if (modifiedFiles.length > 0) {
    summary += `Modified ${modifiedFiles.length} file${modifiedFiles.length === 1 ? '' : 's'}:\n`;
    for (const file of modifiedFiles) {
      summary += `  - ${file.path}\n`;
    }
    summary += '\n';
  }
  
  if (deletedFiles.length > 0) {
    summary += `Deleted ${deletedFiles.length} file${deletedFiles.length === 1 ? '' : 's'}:\n`;
    for (const file of deletedFiles) {
      summary += `  - ${file.path}\n`;
    }
    summary += '\n';
  }
  
  if (renamedFiles.length > 0) {
    summary += `Renamed ${renamedFiles.length} file${renamedFiles.length === 1 ? '' : 's'}:\n`;
    for (const file of renamedFiles) {
      summary += `  - ${file.oldPath} -> ${file.path}\n`;
    }
    summary += '\n';
  }
  
  return summary;
}

/**
 * Generates a markdown report of snapshots
 */
export function generateSnapshotReport(state: VersionControlState): string {
  let markdown = '# Snapshot Report\n\n';
  
  // Add summary
  markdown += '## Summary\n\n';
  markdown += `- Total snapshots: ${state.snapshots.length}\n`;
  markdown += `- Current snapshot: ${state.currentSnapshot || 'None'}\n`;
  markdown += `- Pending changes: ${state.changes.length}\n\n`;
  
  // Add snapshots
  markdown += '## Snapshots\n\n';
  
  for (const snapshot of state.snapshots) {
    markdown += `### ${snapshot.name}\n\n`;
    
    if (snapshot.description) {
      markdown += `${snapshot.description}\n\n`;
    }
    
    markdown += `- ID: ${snapshot.id}\n`;
    markdown += `- Timestamp: ${snapshot.timestamp.toISOString()}\n`;
    
    if (snapshot.author) {
      markdown += `- Author: ${snapshot.author}\n`;
    }
    
    if (snapshot.tags && snapshot.tags.length > 0) {
      markdown += `- Tags: ${snapshot.tags.join(', ')}\n`;
    }
    
    markdown += `- Changes: ${snapshot.changes.length}\n\n`;
    
    // Add change summary
    if (snapshot.changes.length > 0) {
      markdown += '#### Changes\n\n';
      markdown += generateChangeSummary(snapshot.changes);
    }
  }
  
  // Add pending changes
  if (state.changes.length > 0) {
    markdown += '## Pending Changes\n\n';
    markdown += generateChangeSummary(state.changes);
  }
  
  return markdown;
}