// Auto-generated safe fallback for version-manager

export function activate() {
    console.log("[TOOL] version-manager activated (passive mode)");
}

/**
 * Handles file write events for version-manager config or version files.
 * Logs changes and optionally triggers version operations.
 */
export function onFileWrite(event?: { path: string; content?: string }) {
  if (!event || !event.path) {
    console.warn("[version-manager] onFileWrite called without event data.");
    return;
  }
  if (event.path.endsWith('package.json') || event.path.endsWith('version.txt')) {
    console.log(`[version-manager] Detected version file change: ${event.path}`);
    // Example: automatically read or validate version
    // handleGetVersion({ filePath: event.path });
  }
}

/**
 * Initializes or resets version-manager state at the start of a session.
 */
export function onSessionStart(session?: { id?: string }) {
  console.log(`[version-manager] Session started${session && session.id ? `: ${session.id}` : ""}. Preparing version manager environment.`);
  // Example: preload version metadata or clear caches
}

/**
 * Handles version-manager commands.
 * Supported commands:
 * - get-version
 * - update-version
 * - compare-versions
 * - validate-version
 * - generate-changelog
 * - generate-release-notes
 */
export async function onCommand(command?: { name: string; args?: any }) {
  if (!command || !command.name) {
    console.warn("[version-manager] onCommand called without command data.");
    return;
  }
  switch (command.name) {
    case "get-version":
      console.log("[version-manager] Getting version...");
      try {
        await handleGetVersion(command.args);
      } catch (err) {
        console.error("[version-manager] Error getting version:", err);
      }
      break;
    case "update-version":
      console.log("[version-manager] Updating version...");
      try {
        await handleUpdateVersion(command.args);
      } catch (err) {
        console.error("[version-manager] Error updating version:", err);
      }
      break;
    case "compare-versions":
      console.log("[version-manager] Comparing versions...");
      try {
        await handleCompareVersions(command.args);
      } catch (err) {
        console.error("[version-manager] Error comparing versions:", err);
      }
      break;
    case "validate-version":
      console.log("[version-manager] Validating version string...");
      try {
        await handleValidateVersion(command.args);
      } catch (err) {
        console.error("[version-manager] Error validating version:", err);
      }
      break;
    case "generate-changelog":
      console.log("[version-manager] Generating changelog...");
      try {
        await handleGenerateChangelog(command.args);
      } catch (err) {
        console.error("[version-manager] Error generating changelog:", err);
      }
      break;
    case "generate-release-notes":
      console.log("[version-manager] Generating release notes...");
      try {
        await handleGenerateReleaseNotes(command.args);
      } catch (err) {
        console.error("[version-manager] Error generating release notes:", err);
      }
      break;
    default:
      console.warn(`[version-manager] Unknown command: ${command.name}`);
  }
}
/**
 * Version Manager
 * 
 * Handles version numbers according to semantic versioning principles
 * Manages changelog generation and release notes
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { z } from 'zod';

const execAsync = promisify(exec);

/**
 * Schema for VersionManager
 */
export const GetVersionSchema = z.object({
  filePath: z.string(),
  type: z.enum(['package.json', 'version.txt', 'custom']).default('package.json'),
  regex: z.string().optional(),
});

export const UpdateVersionSchema = z.object({
  filePath: z.string(),
  type: z.enum(['package.json', 'version.txt', 'custom']).default('package.json'),
  increment: z.enum(['major', 'minor', 'patch', 'prerelease']).default('patch'),
  preid: z.string().optional(),
  regex: z.string().optional(),
});

export const CompareVersionsSchema = z.object({
  version1: z.string(),
  version2: z.string(),
});

export const ValidateVersionSchema = z.object({
  version: z.string(),
});

export const GenerateChangelogSchema = z.object({
  outputPath: z.string(),
  fromTag: z.string().optional(),
  toTag: z.string().optional().default('HEAD'),
  title: z.string().optional(),
  groupBy: z.enum(['type', 'scope', 'none']).optional().default('type'),
  types: z.array(z.string()).optional().default(['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'chore', 'revert']),
  includeCommitLink: z.boolean().optional().default(true),
  includeAuthor: z.boolean().optional().default(true),
  repository: z.string().optional(),
});

export const GenerateReleaseNotesSchema = z.object({
  version: z.string(),
  outputPath: z.string(),
  fromTag: z.string().optional(),
  title: z.string().optional(),
  includeChangelog: z.boolean().optional().default(true),
  includeInstallation: z.boolean().optional().default(true),
  includeUpgrade: z.boolean().optional().default(true),
  repository: z.string().optional(),
});

/**
 * Version information
 */
interface VersionInfo {
  version: string;
  major: number;
  minor: number;
  patch: number;
  prerelease?: string;
  build?: string;
}

/**
 * Version comparison result
 */
interface VersionComparisonResult {
  equal: boolean;
  greater: boolean;
  less: boolean;
  difference: 'major' | 'minor' | 'patch' | 'prerelease' | 'build' | 'none';
}

/**
 * Commit information
 */
interface CommitInfo {
  hash: string;
  shortHash: string;
  subject: string;
  body: string;
  author: string;
  authorEmail: string;
  date: string;
  type?: string;
  scope?: string;
  breaking: boolean;
}

/**
 * Parse a semantic version string
 * 
 * @param version Version string to parse
 * @returns Parsed version information
 */
export function parseVersion(version: string): VersionInfo {
  // Remove 'v' prefix if present
  if (version.startsWith('v')) {
    version = version.substring(1);
  }
  
  // Parse the version string
  const regex = /^(\d+)\.(\d+)\.(\d+)(?:-([^+]+))?(?:\+(.+))?$/;
  const match = version.match(regex);
  
  if (!match) {
    throw new Error(`Invalid semantic version: ${version}`);
  }
  
  const [, major, minor, patch, prerelease, build] = match;
  
  return {
    version,
    major: parseInt(major, 10),
    minor: parseInt(minor, 10),
    patch: parseInt(patch, 10),
    prerelease,
    build,
  };
}

/**
 * Validate a semantic version string
 * 
 * @param version Version string to validate
 * @returns Whether the version is valid
 */
export function validateVersion(version: string): boolean {
  try {
    parseVersion(version);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Compare two semantic versions
 * 
 * @param version1 First version to compare
 * @param version2 Second version to compare
 * @returns Version comparison result
 */
export function compareVersions(version1: string, version2: string): VersionComparisonResult {
  const v1 = parseVersion(version1);
  const v2 = parseVersion(version2);
  
  // Compare major version
  if (v1.major > v2.major) {
    return { equal: false, greater: true, less: false, difference: 'major' };
  } else if (v1.major < v2.major) {
    return { equal: false, greater: false, less: true, difference: 'major' };
  }
  
  // Compare minor version
  if (v1.minor > v2.minor) {
    return { equal: false, greater: true, less: false, difference: 'minor' };
  } else if (v1.minor < v2.minor) {
    return { equal: false, greater: false, less: true, difference: 'minor' };
  }
  
  // Compare patch version
  if (v1.patch > v2.patch) {
    return { equal: false, greater: true, less: false, difference: 'patch' };
  } else if (v1.patch < v2.patch) {
    return { equal: false, greater: false, less: true, difference: 'patch' };
  }
  
  // Compare prerelease
  if (v1.prerelease && v2.prerelease) {
    if (v1.prerelease > v2.prerelease) {
      return { equal: false, greater: true, less: false, difference: 'prerelease' };
    } else if (v1.prerelease < v2.prerelease) {
      return { equal: false, greater: false, less: true, difference: 'prerelease' };
    }
  } else if (v1.prerelease) {
    return { equal: false, greater: false, less: true, difference: 'prerelease' };
  } else if (v2.prerelease) {
    return { equal: false, greater: true, less: false, difference: 'prerelease' };
  }
  
  // Compare build
  if (v1.build && v2.build) {
    if (v1.build > v2.build) {
      return { equal: false, greater: true, less: false, difference: 'build' };
    } else if (v1.build < v2.build) {
      return { equal: false, greater: false, less: true, difference: 'build' };
    }
  } else if (v1.build) {
    return { equal: false, greater: true, less: false, difference: 'build' };
  } else if (v2.build) {
    return { equal: false, greater: false, less: true, difference: 'build' };
  }
  
  // Versions are equal
  return { equal: true, greater: false, less: false, difference: 'none' };
}

/**
 * Increment a semantic version
 * 
 * @param version Version to increment
 * @param type Type of increment
 * @param preid Prerelease identifier
 * @returns Incremented version
 */
export function incrementVersion(version: string, type: 'major' | 'minor' | 'patch' | 'prerelease', preid?: string): string {
  const versionInfo = parseVersion(version);
  
  switch (type) {
    case 'major':
      versionInfo.major += 1;
      versionInfo.minor = 0;
      versionInfo.patch = 0;
      versionInfo.prerelease = undefined;
      break;
    
    case 'minor':
      versionInfo.minor += 1;
      versionInfo.patch = 0;
      versionInfo.prerelease = undefined;
      break;
    
    case 'patch':
      versionInfo.patch += 1;
      versionInfo.prerelease = undefined;
      break;
    
    case 'prerelease':
      if (versionInfo.prerelease) {
        // Extract the numeric part of the prerelease
        const prereleaseRegex = /^([a-zA-Z]+)\.?(\d+)$/;
        const prereleaseMatch = versionInfo.prerelease.match(prereleaseRegex);
        
        if (prereleaseMatch) {
          const [, id, num] = prereleaseMatch;
          versionInfo.prerelease = `${preid || id}.${parseInt(num, 10) + 1}`;
        } else {
          versionInfo.prerelease = `${versionInfo.prerelease}.1`;
        }
      } else {
        versionInfo.prerelease = `${preid || 'beta'}.1`;
      }
      break;
  }
  
  // Build the new version string
  let newVersion = `${versionInfo.major}.${versionInfo.minor}.${versionInfo.patch}`;
  
  if (versionInfo.prerelease) {
    newVersion += `-${versionInfo.prerelease}`;
  }
  
  if (versionInfo.build) {
    newVersion += `+${versionInfo.build}`;
  }
  
  return newVersion;
}

/**
 * Get the version from a file
 * 
 * @param filePath Path to the file
 * @param type Type of file
 * @param regex Regular expression to extract the version
 * @returns Version string
 */
export async function getVersion(filePath: string, type: 'package.json' | 'version.txt' | 'custom' = 'package.json', regex?: string): Promise<string> {
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    
    switch (type) {
      case 'package.json':
        try {
          const packageJson = JSON.parse(fileContent);
          
          if (!packageJson.version) {
            throw new Error('No version field found in package.json');
          }
          
          return packageJson.version;
        } catch (error) {
          throw new Error(`Error parsing package.json: ${error instanceof Error ? error.message : String(error)}`);
        }
      
      case 'version.txt':
        return fileContent.trim();
      
      case 'custom':
        if (!regex) {
          throw new Error('Regular expression is required for custom file type');
        }
        
        const regexObj = new RegExp(regex);
        const match = fileContent.match(regexObj);
        
        if (!match || !match[1]) {
          throw new Error(`No version found using regex: ${regex}`);
        }
        
        return match[1];
    }
  } catch (error) {
    throw new Error(`Error getting version: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Update the version in a file
 * 
 * @param filePath Path to the file
 * @param type Type of file
 * @param increment Type of increment
 * @param preid Prerelease identifier
 * @param regex Regular expression to extract the version
 * @returns Updated version string
 */
export async function updateVersion(filePath: string, type: 'package.json' | 'version.txt' | 'custom' = 'package.json', increment: 'major' | 'minor' | 'patch' | 'prerelease' = 'patch', preid?: string, regex?: string): Promise<string> {
  try {
    // Get the current version
    const currentVersion = await getVersion(filePath, type, regex);
    
    // Increment the version
    const newVersion = incrementVersion(currentVersion, increment, preid);
    
    // Update the file
    const fileContent = await fs.readFile(filePath, 'utf-8');
    let updatedContent: string;
    
    switch (type) {
      case 'package.json':
        try {
          const packageJson = JSON.parse(fileContent);
          packageJson.version = newVersion;
          updatedContent = JSON.stringify(packageJson, null, 2);
        } catch (error) {
          throw new Error(`Error parsing package.json: ${error instanceof Error ? error.message : String(error)}`);
        }
        break;
      
      case 'version.txt':
        updatedContent = newVersion;
        break;
      
      case 'custom':
        if (!regex) {
          throw new Error('Regular expression is required for custom file type');
        }
        
        const regexObj = new RegExp(regex);
        updatedContent = fileContent.replace(regexObj, (match, p1) => match.replace(p1, newVersion));
        break;
    }
    
    // Write the updated content to the file
    await fs.writeFile(filePath, updatedContent, 'utf-8');
    
    return newVersion;
  } catch (error) {
    throw new Error(`Error updating version: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Parse a commit message
 * 
 * @param commit Commit message
 * @returns Parsed commit information
 */
function parseCommitMessage(commit: string): { type?: string; scope?: string; subject: string; breaking: boolean } {
  // Parse conventional commit format: type(scope): subject
  const regex = /^(\w+)(?:\(([^)]+)\))?: (.+)$/;
  const match = commit.match(regex);
  
  if (match) {
    const [, type, scope, subject] = match;
    const breaking = commit.includes('BREAKING CHANGE:') || subject.includes('!:');
    
    return { type, scope, subject, breaking };
  }
  
  return { subject: commit, breaking: commit.includes('BREAKING CHANGE:') };
}

/**
 * Get commits between two tags
 * 
 * @param fromTag From tag
 * @param toTag To tag
 * @returns Commit information
 */
async function getCommits(fromTag?: string, toTag: string = 'HEAD'): Promise<CommitInfo[]> {
  try {
    const range = fromTag ? `${fromTag}..${toTag}` : toTag;
    const format = '%H%n%h%n%s%n%b%n%an%n%ae%n%ad%n===END===';
    
    const { stdout } = await execAsync(`git log ${range} --pretty=format:"${format}"`);
    
    if (!stdout.trim()) {
      return [];
    }
    
    const commits = stdout.split('===END===\n').filter(Boolean);
    
    return commits.map(commit => {
      const [hash, shortHash, subject, body, author, authorEmail, date] = commit.split('\n');
      const { type, scope, breaking } = parseCommitMessage(subject);
      
      return {
        hash,
        shortHash,
        subject,
        body,
        author,
        authorEmail,
        date,
        type,
        scope,
        breaking,
      };
    });
  } catch (error) {
    throw new Error(`Error getting commits: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Group commits by type
 * 
 * @param commits Commits to group
 * @returns Grouped commits
 */
function groupCommitsByType(commits: CommitInfo[]): Record<string, CommitInfo[]> {
  const grouped: Record<string, CommitInfo[]> = {};
  
  for (const commit of commits) {
    const type = commit.type || 'other';
    
    if (!grouped[type]) {
      grouped[type] = [];
    }
    
    grouped[type].push(commit);
  }
  
  return grouped;
}

/**
 * Group commits by scope
 * 
 * @param commits Commits to group
 * @returns Grouped commits
 */
function groupCommitsByScope(commits: CommitInfo[]): Record<string, CommitInfo[]> {
  const grouped: Record<string, CommitInfo[]> = {};
  
  for (const commit of commits) {
    const scope = commit.scope || 'other';
    
    if (!grouped[scope]) {
      grouped[scope] = [];
    }
    
    grouped[scope].push(commit);
  }
  
  return grouped;
}

/**
 * Generate a changelog
 * 
 * @param outputPath Path to the output file
 * @param fromTag From tag
 * @param toTag To tag
 * @param title Title of the changelog
 * @param groupBy How to group commits
 * @param types Types to include
 * @param includeCommitLink Whether to include commit links
 * @param includeAuthor Whether to include author information
 * @param repository Repository URL
 * @returns Generated changelog
 */
export async function generateChangelog(
  outputPath: string,
  fromTag?: string,
  toTag: string = 'HEAD',
  title?: string,
  groupBy: 'type' | 'scope' | 'none' = 'type',
  types: string[] = ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'chore', 'revert'],
  includeCommitLink: boolean = true,
  includeAuthor: boolean = true,
  repository?: string,
): Promise<string> {
  try {
    // Get commits
    const commits = await getCommits(fromTag, toTag);
    
    // Filter commits by type
    const filteredCommits = types.length > 0
      ? commits.filter(commit => !commit.type || types.includes(commit.type))
      : commits;
    
    // Generate changelog content
    let content = '';
    
    // Add title
    if (title) {
      content += `# ${title}\n\n`;
    }
    
    // Group commits
    if (groupBy === 'type') {
      const grouped = groupCommitsByType(filteredCommits);
      
      // Sort types
      const sortedTypes = Object.keys(grouped).sort((a, b) => {
        const aIndex = types.indexOf(a);
        const bIndex = types.indexOf(b);
        
        if (aIndex === -1 && bIndex === -1) {
          return a.localeCompare(b);
        } else if (aIndex === -1) {
          return 1;
        } else if (bIndex === -1) {
          return -1;
        } else {
          return aIndex - bIndex;
        }
      });
      
      // Add commits by type
      for (const type of sortedTypes) {
        const typeCommits = grouped[type];
        
        // Skip empty types
        if (typeCommits.length === 0) {
          continue;
        }
        
        // Add type heading
        const typeHeading = type.charAt(0).toUpperCase() + type.slice(1);
        content += `## ${typeHeading}\n\n`;
        
        // Add commits
        for (const commit of typeCommits) {
          content += formatCommit(commit, includeCommitLink, includeAuthor, repository);
        }
        
        content += '\n';
      }
    } else if (groupBy === 'scope') {
      const grouped = groupCommitsByScope(filteredCommits);
      
      // Sort scopes
      const sortedScopes = Object.keys(grouped).sort();
      
      // Add commits by scope
      for (const scope of sortedScopes) {
        const scopeCommits = grouped[scope];
        
        // Skip empty scopes
        if (scopeCommits.length === 0) {
          continue;
        }
        
        // Add scope heading
        const scopeHeading = scope.charAt(0).toUpperCase() + scope.slice(1);
        content += `## ${scopeHeading}\n\n`;
        
        // Add commits
        for (const commit of scopeCommits) {
          content += formatCommit(commit, includeCommitLink, includeAuthor, repository);
        }
        
        content += '\n';
      }
    } else {
      // Add all commits without grouping
      for (const commit of filteredCommits) {
        content += formatCommit(commit, includeCommitLink, includeAuthor, repository);
      }
      
      content += '\n';
    }
    
    // Write the changelog to the output file
    await fs.writeFile(outputPath, content, 'utf-8');
    
    return content;
  } catch (error) {
    throw new Error(`Error generating changelog: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Format a commit for the changelog
 * 
 * @param commit Commit to format
 * @param includeCommitLink Whether to include commit links
 * @param includeAuthor Whether to include author information
 * @param repository Repository URL
 * @returns Formatted commit
 */
function formatCommit(commit: CommitInfo, includeCommitLink: boolean, includeAuthor: boolean, repository?: string): string {
  let result = '- ';
  
  // Add commit subject
  result += commit.subject;
  
  // Add commit link
  if (includeCommitLink && repository) {
    result += ` ([${commit.shortHash}](${repository}/commit/${commit.hash}))`;
  } else if (includeCommitLink) {
    result += ` (${commit.shortHash})`;
  }
  
  // Add author
  if (includeAuthor) {
    result += ` - ${commit.author}`;
  }
  
  result += '\n';
  
  return result;
}

/**
 * Generate release notes
 * 
 * @param version Version of the release
 * @param outputPath Path to the output file
 * @param fromTag From tag
 * @param title Title of the release notes
 * @param includeChangelog Whether to include the changelog
 * @param includeInstallation Whether to include installation instructions
 * @param includeUpgrade Whether to include upgrade instructions
 * @param repository Repository URL
 * @returns Generated release notes
 */
export async function generateReleaseNotes(
  version: string,
  outputPath: string,
  fromTag?: string,
  title?: string,
  includeChangelog: boolean = true,
  includeInstallation: boolean = true,
  includeUpgrade: boolean = true,
  repository?: string,
): Promise<string> {
  try {
    // Generate content
    let content = '';
    
    // Add title
    content += `# ${title || `Release ${version}`}\n\n`;
    
    // Add version information
    content += `Version: ${version}\n\n`;
    
    // Add release date
    const releaseDate = new Date().toISOString().split('T')[0];
    content += `Date: ${releaseDate}\n\n`;
    
    // Add installation instructions
    if (includeInstallation) {
      content += `## Installation\n\n`;
      content += `\`\`\`bash\n`;
      content += `npm install my-package@${version}\n`;
      content += `\`\`\`\n\n`;
    }
    
    // Add upgrade instructions
    if (includeUpgrade) {
      content += `## Upgrade\n\n`;
      content += `\`\`\`bash\n`;
      content += `npm update my-package@${version}\n`;
      content += `\`\`\`\n\n`;
    }
    
    // Add changelog
    if (includeChangelog) {
      content += `## Changelog\n\n`;
      
      // Generate temporary changelog
      const tempChangelogPath = path.join(path.dirname(outputPath), 'temp-changelog.md');
      const changelog = await generateChangelog(
        tempChangelogPath,
        fromTag,
        'HEAD',
        undefined,
        'type',
        ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'chore', 'revert'],
        true,
        true,
        repository,
      );
      
      // Add changelog content
      content += changelog;
      
      // Remove temporary changelog
      await fs.unlink(tempChangelogPath);
    }
    
    // Write the release notes to the output file
    await fs.writeFile(outputPath, content, 'utf-8');
    
    return content;
  } catch (error) {
    throw new Error(`Error generating release notes: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Handle get_version command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleGetVersion(args: any) {
  try {
    const { filePath, type, regex } = args;
    const version = await getVersion(filePath, type, regex);
    
    return {
      content: [{ type: "text", text: `Version: ${version}` }],
      isError: false,
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error getting version: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Handle update_version command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleUpdateVersion(args: any) {
  try {
    const { filePath, type, increment, preid, regex } = args;
    const newVersion = await updateVersion(filePath, type, increment, preid, regex);
    
    return {
      content: [{ type: "text", text: `Version updated to: ${newVersion}` }],
      isError: false,
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error updating version: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Handle compare_versions command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleCompareVersions(args: any) {
  try {
    const { version1, version2 } = args;
    const result = compareVersions(version1, version2);
    
    let message: string;
    
    if (result.equal) {
      message = `Versions are equal: ${version1} = ${version2}`;
    } else if (result.greater) {
      message = `${version1} is greater than ${version2} (difference: ${result.difference})`;
    } else {
      message = `${version1} is less than ${version2} (difference: ${result.difference})`;
    }
    
    return {
      content: [{ type: "text", text: message }],
      isError: false,
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error comparing versions: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Handle validate_version command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleValidateVersion(args: any) {
  try {
    const { version } = args;
    const isValid = validateVersion(version);
    
    if (isValid) {
      return {
        content: [{ type: "text", text: `Version is valid: ${version}` }],
        isError: false,
      };
    } else {
      return {
        content: [{ type: "text", text: `Version is invalid: ${version}` }],
        isError: true,
      };
    }
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error validating version: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Handle generate_changelog command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleGenerateChangelog(args: any) {
  try {
    const { outputPath, fromTag, toTag, title, groupBy, types, includeCommitLink, includeAuthor, repository } = args;
    const changelog = await generateChangelog(outputPath, fromTag, toTag, title, groupBy, types, includeCommitLink, includeAuthor, repository);
    
    return {
      content: [
        { type: "text", text: `Changelog generated successfully: ${outputPath}` },
        { type: "text", text: changelog },
      ],
      isError: false,
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error generating changelog: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Handle generate_release_notes command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleGenerateReleaseNotes(args: any) {
  try {
    const { version, outputPath, fromTag, title, includeChangelog, includeInstallation, includeUpgrade, repository } = args;
    const releaseNotes = await generateReleaseNotes(version, outputPath, fromTag, title, includeChangelog, includeInstallation, includeUpgrade, repository);
    
    return {
      content: [
        { type: "text", text: `Release notes generated successfully: ${outputPath}` },
        { type: "text", text: releaseNotes },
      ],
      isError: false,
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error generating release notes: ${error}` }],
      isError: true,
    };
  }
}
