/**
 * Docs Updater
 * 
 * Keeps documentation in sync with code changes
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { z } from 'zod';

/**
 * Documentation Updater Tool
 * 
 * A class for keeping documentation in sync with code changes
 */
export class DocsUpdater {
  private sourcePath: string;
  private docsPath: string;
  private patterns: string[];
  private updateStrategy: 'append' | 'replace' | 'merge';

  /**
   * Create a new documentation updater
   * 
   * @param options Updater options
   */
  constructor(options: {
    sourcePath: string;
    docsPath: string;
    patterns?: string[];
    updateStrategy?: 'append' | 'replace' | 'merge';
  }) {
    this.sourcePath = options.sourcePath;
    this.docsPath = options.docsPath;
    this.patterns = options.patterns || ['**/*.js', '**/*.ts', '**/*.jsx', '**/*.tsx'];
    this.updateStrategy = options.updateStrategy || 'merge';
  }

  /**
   * Update documentation
   * 
   * @returns Update result
   */
  async update(): Promise<{
    success: boolean;
    message: string;
    updatedFiles: string[];
    summary: string;
  }> {
    try {
      // Update the documentation
      const result = await updateDocs({
        sourcePath: this.sourcePath,
        docsPath: this.docsPath,
        filePatterns: this.patterns,
        updateStrategy: this.updateStrategy,
        options: {
          includeExamples: true,
          includeChangelog: true,
          updateToc: true,
          updateVersions: true,
          updateApiDocs: true,
          updateReadmeFlag: true,
        },
      });

      return {
        success: result.success,
        message: result.message,
        updatedFiles: result.updatedFiles,
        summary: `Updated ${result.updatedFiles.length} documentation files.${result.errors?.length ? ` Encountered ${result.errors.length} errors.` : ''}`,
      };
    } catch (error) {
      throw new Error(`Failed to update documentation: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Synchronize documentation with code changes
   * 
   * @param changedFiles Changed files
   * @returns Sync result
   */
  async sync(changedFiles: string[]): Promise<{
    success: boolean;
    message: string;
    updatedFiles: string[];
    summary: string;
  }> {
    try {
      // Synchronize the documentation
      const result = await syncDocs({
        sourcePath: this.sourcePath,
        docsPath: this.docsPath,
        changedFiles,
        options: {
          updateToc: true,
          updateVersions: true,
          generateChangelog: true,
        },
      });

      return {
        success: result.success,
        message: result.message,
        updatedFiles: result.updatedFiles,
        summary: `Synchronized ${result.updatedFiles.length} documentation files.${result.errors?.length ? ` Encountered ${result.errors.length} errors.` : ''}`,
      };
    } catch (error) {
      throw new Error(`Failed to synchronize documentation: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

/**
 * Schema for DocsUpdater tool
 */
export const UpdateDocsSchema = z.object({
  sourcePath: z.string(),
  docsPath: z.string(),
  filePatterns: z.array(z.string()).optional(),
  updateStrategy: z.enum(['append', 'replace', 'merge']).default('merge'),
  options: z.object({
    includeExamples: z.boolean().optional().default(true),
    includeChangelog: z.boolean().optional().default(true),
    updateToc: z.boolean().optional().default(true),
    updateVersions: z.boolean().optional().default(true),
    updateApiDocs: z.boolean().optional().default(true),
    updateReadmeFlag: z.boolean().optional().default(true), // Renamed to avoid conflict
  }).optional(),
});

/**
 * Schema for SyncDocsSchema
 */
export const SyncDocsSchema = z.object({
  sourcePath: z.string(),
  docsPath: z.string(),
  changedFiles: z.array(z.string()),
  options: z.object({
    updateToc: z.boolean().optional().default(true),
    updateVersions: z.boolean().optional().default(true),
    generateChangelog: z.boolean().optional().default(true),
    commitMessage: z.string().optional(),
  }).optional(),
});

/**
 * Documentation file type
 */
export enum DocFileType {
  README = 'readme',
  API = 'api',
  GUIDE = 'guide',
  TUTORIAL = 'tutorial',
  REFERENCE = 'reference',
  CHANGELOG = 'changelog',
  CONTRIBUTING = 'contributing',
  LICENSE = 'license',
  TOC = 'toc',
  OTHER = 'other',
}

/**
 * Documentation file
 */
export interface DocFile {
  path: string;
  type: DocFileType;
  content: string;
  lastModified: Date;
  relatedSourceFiles?: string[];
}

/**
 * Source file
 */
export interface SourceFile {
  path: string;
  content: string;
  lastModified: Date;
  docBlocks: DocBlock[];
}

/**
 * Documentation block
 */
export interface DocBlock {
  type: 'class' | 'function' | 'method' | 'property' | 'interface' | 'type' | 'enum' | 'constant' | 'other';
  name: string;
  description: string;
  params?: Array<{
    name: string;
    type: string;
    description: string;
    optional?: boolean;
    defaultValue?: string;
  }>;
  returns?: {
    type: string;
    description: string;
  };
  examples?: string[];
  deprecated?: boolean;
  since?: string;
  see?: string[];
  throws?: Array<{
    type: string;
    description: string;
  }>;
  lineStart: number;
  lineEnd: number;
}

/**
 * Update documentation based on source code changes
 * 
 * @param options Update options
 * @returns Update result
 */
export async function updateDocs(
  options: {
    sourcePath: string;
    docsPath: string;
    filePatterns?: string[];
    updateStrategy?: 'append' | 'replace' | 'merge';
    options?: {
      includeExamples?: boolean;
      includeChangelog?: boolean;
      updateToc?: boolean;
      updateVersions?: boolean;
      updateApiDocs?: boolean;
      updateReadmeFlag?: boolean; // Renamed to avoid conflict
    };
  }
): Promise<{
  success: boolean;
  message: string;
  updatedFiles: string[];
  errors?: string[];
}> {
  try {
    // Default options
    const updateStrategy = options.updateStrategy || 'merge';
    const includeExamples = options.options?.includeExamples !== false;
    const includeChangelog = options.options?.includeChangelog !== false;
    const updateToc = options.options?.updateToc !== false;
    const updateVersions = options.options?.updateVersions !== false;
    const updateApiDocs = options.options?.updateApiDocs !== false;
    const updateReadmeFlag = options.options?.updateReadmeFlag !== false; // Corrected reference
    
    // Find source files
    const sourceFiles = await findSourceFiles(options.sourcePath, options.filePatterns);
    
    // Find documentation files
    const docFiles = await findDocFiles(options.docsPath);
    
    // Parse source files for documentation blocks
    const parsedSourceFiles: SourceFile[] = [];
    
    for (const file of sourceFiles) {
      const content = await fs.readFile(file, 'utf8');
      const stats = await fs.stat(file);
      
      const docBlocks = parseDocBlocks(content);
      
      parsedSourceFiles.push({
        path: file,
        content,
        lastModified: stats.mtime,
        docBlocks,
      });
    }
    
    // Parse documentation files
    const parsedDocFiles: DocFile[] = [];
    
    for (const file of docFiles) {
      const content = await fs.readFile(file, 'utf8');
      const stats = await fs.stat(file);
      
      const type = determineDocType(file);
      const relatedSourceFiles = findRelatedSourceFiles(file, parsedSourceFiles);
      
      parsedDocFiles.push({
        path: file,
        type,
        content,
        lastModified: stats.mtime,
        relatedSourceFiles,
      });
    }
    
    // Update documentation files
    const updatedFiles: string[] = [];
    const errors: string[] = [];
    
    // Update API documentation
    if (updateApiDocs) {
      const apiDocFiles = parsedDocFiles.filter(file => file.type === DocFileType.API);
      
      for (const apiDocFile of apiDocFiles) {
        try {
          const updatedContent = await updateApiDoc(
            apiDocFile,
            parsedSourceFiles.filter(sourceFile => 
              apiDocFile.relatedSourceFiles?.includes(sourceFile.path)
            ),
            updateStrategy,
            includeExamples
          );
          
          if (updatedContent !== apiDocFile.content) {
            await fs.writeFile(apiDocFile.path, updatedContent);
            updatedFiles.push(apiDocFile.path);
          }
        } catch (error) {
          errors.push(`Error updating API doc ${apiDocFile.path}: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    }
    
    // Update README
    if (updateReadmeFlag) { // Renamed to avoid conflict
      const readmeFiles = parsedDocFiles.filter(file => file.type === DocFileType.README);
      
      for (const readmeFile of readmeFiles) {
        try {
          const updatedContent = await updateReadme( // Ensure updateReadme is a function
            readmeFile,
            parsedSourceFiles,
            updateStrategy
          );
          
          if (updatedContent !== readmeFile.content) {
            await fs.writeFile(readmeFile.path, updatedContent);
            updatedFiles.push(readmeFile.path);
          }
        } catch (error) {
          errors.push(`Error updating README ${readmeFile.path}: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    }
    
    // Update table of contents
    if (updateToc) {
      const tocFiles = parsedDocFiles.filter(file => file.type === DocFileType.TOC);
      
      for (const tocFile of tocFiles) {
        try {
          const updatedContent = updateTableOfContents(
            tocFile.content,
            parsedDocFiles.filter(file => file.path !== tocFile.path).map(file => file.content) // Assuming 'content' is the string property needed
          );
          
          if (updatedContent !== tocFile.content) {
            await fs.writeFile(tocFile.path, updatedContent);
            updatedFiles.push(tocFile.path);
          }
        } catch (error) {
          errors.push(`Error updating TOC ${tocFile.path}: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    }
    
    // Update changelog
    if (includeChangelog) {
      const changelogFiles = parsedDocFiles.filter(file => file.type === DocFileType.CHANGELOG);
      
      for (const changelogFile of changelogFiles) {
        try {
          const updatedContent = await updateChangelog(
            changelogFile.content, // Pass the content property
            parsedSourceFiles[0]?.content || '', // Pass the content of the first file as a placeholder
            updateStrategy
          );
          
          if (updatedContent !== changelogFile.content) {
            await fs.writeFile(changelogFile.path, updatedContent);
            updatedFiles.push(changelogFile.path);
          }
        } catch (error) {
          errors.push(`Error updating changelog ${changelogFile.path}: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    }
    
    // Update versions
    if (updateVersions) {
      try {
        const packageJsonPath = path.join(options.sourcePath, 'package.json');
        
        try {
          const packageJsonContent = await fs.readFile(packageJsonPath, 'utf8');
          const packageJson = JSON.parse(packageJsonContent);
          
          const version = packageJson.version;
          
          if (version) {
            // Update version references in documentation files
            for (const docFile of parsedDocFiles) {
              const updatedContent = updateVersionReferences(docFile.content, version, 'newVersion'); // Replace 'newVersion' with the actual new version value
              
              if (updatedContent !== docFile.content) {
                await fs.writeFile(docFile.path, updatedContent);
                updatedFiles.push(docFile.path);
              }
            }
          }
        } catch (error) {
          // No package.json or other error
        }
      } catch (error) {
        errors.push(`Error updating versions: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    
    return {
      success: errors.length === 0,
      message: errors.length === 0
        ? `Successfully updated ${updatedFiles.length} documentation files`
        : `Updated ${updatedFiles.length} documentation files with ${errors.length} errors`,
      updatedFiles,
      errors: errors.length > 0 ? errors : undefined,
    };
  } catch (error) {
    return {
      success: false,
      message: `Error updating documentation: ${error instanceof Error ? error.message : String(error)}`,
      updatedFiles: [],
      errors: [`Error updating documentation: ${error instanceof Error ? error.message : String(error)}`],
    };
  }
}

/**
 * Synchronize documentation with code changes
 * 
 * @param options Sync options
 * @returns Sync result
 */
export async function syncDocs(
  options: {
    sourcePath: string;
    docsPath: string;
    changedFiles: string[];
    options?: {
      updateToc?: boolean;
      updateVersions?: boolean;
      generateChangelog?: boolean;
      commitMessage?: string;
    };
  }
): Promise<{
  success: boolean;
  message: string;
  updatedFiles: string[];
  errors?: string[];
}> {
  try {
    // Default options
    const updateToc = options.options?.updateToc !== false;
    const updateVersions = options.options?.updateVersions !== false;
    const generateChangelog = options.options?.generateChangelog !== false;
    
    // Find documentation files related to changed source files
    const changedSourceFiles: string[] = [];
    const changedDocFiles: string[] = [];
    
    for (const file of options.changedFiles) {
      const absolutePath = path.resolve(file);
      
      if (absolutePath.startsWith(path.resolve(options.sourcePath))) {
        changedSourceFiles.push(absolutePath);
      } else if (absolutePath.startsWith(path.resolve(options.docsPath))) {
        changedDocFiles.push(absolutePath);
      }
    }
    
    // Update documentation for changed source files
    const updateResult = await updateDocs({
      sourcePath: options.sourcePath,
      docsPath: options.docsPath,
      filePatterns: changedSourceFiles.map(file => path.relative(options.sourcePath, file)),
      updateStrategy: 'merge',
      options: {
        includeExamples: true,
        includeChangelog: generateChangelog,
        updateToc,
        updateVersions,
        updateApiDocs: true,
        updateReadmeFlag: true, // Corrected property name
      },
    });
    
    return updateResult;
  } catch (error) {
    return {
      success: false,
      message: `Error synchronizing documentation: ${error instanceof Error ? error.message : String(error)}`,
      updatedFiles: [],
      errors: [`Error synchronizing documentation: ${error instanceof Error ? error.message : String(error)}`],
    };
  }
}

/**
 * Find source files
 * 
 * @param sourcePath Source path
 * @param filePatterns File patterns
 * @returns Source files
 */
async function findSourceFiles(sourcePath: string, filePatterns?: string[]): Promise<string[]> {
  try {
    // Default file patterns
    const patterns = filePatterns || ['**/*.js', '**/*.ts', '**/*.jsx', '**/*.tsx'];
    
    // List all files
    const files = await fs.readdir(sourcePath, { recursive: true });
    
    // Filter files matching patterns
    const matchingFiles: string[] = [];
    
    for (const file of files) {
      for (const pattern of patterns) {
        // Simple pattern matching
        if (file.match(new RegExp(pattern.replace('**/', '').replace(/\*/g, '.*')))) {
          matchingFiles.push(path.join(sourcePath, file.toString()));
          break;
        }
      }
    }
    
    return matchingFiles;
  } catch (error) {
    return [];
  }
}

/**
 * Find documentation files
 * 
 * @param docsPath Documentation path
 * @returns Documentation files
 */
async function findDocFiles(docsPath: string): Promise<string[]> {
  try {
    // List all files
    const files = await fs.readdir(docsPath, { recursive: true });
    
    // Filter documentation files
    const docFiles: string[] = [];
    
    for (const file of files) {
      const filePath = path.join(docsPath, file.toString());
      const ext = path.extname(filePath).toLowerCase();
      
      if (['.md', '.mdx', '.txt', '.html'].includes(ext)) {
        docFiles.push(filePath);
      }
    }
    
    return docFiles;
  } catch (error) {
    return [];
  }
}

/**
 * Determine documentation file type
 * 
 * @param filePath File path
 * @returns Documentation file type
 */
function determineDocType(filePath: string): DocFileType {
  const fileName = path.basename(filePath).toLowerCase();
  
  if (fileName === 'readme.md' || fileName === 'index.md') {
    return DocFileType.README;
  } else if (fileName === 'changelog.md' || fileName === 'history.md' || fileName === 'releases.md') {
    return DocFileType.CHANGELOG;
  } else if (fileName === 'contributing.md') {
    return DocFileType.CONTRIBUTING;
  } else if (fileName === 'license.md' || fileName === 'license.txt') {
    return DocFileType.LICENSE;
  } else if (fileName === 'toc.md' || fileName === 'summary.md' || fileName === '_sidebar.md') {
    return DocFileType.TOC;
  } else if (fileName.includes('api') || fileName.includes('reference')) {
    return DocFileType.API;
  } else if (fileName.includes('guide') || fileName.includes('manual')) {
    return DocFileType.GUIDE;
  } else if (fileName.includes('tutorial') || fileName.includes('howto')) {
    return DocFileType.TUTORIAL;
  } else {
    return DocFileType.OTHER;
  }
}

/**
 * Find source files related to a documentation file
 * 
 * @param docFilePath Documentation file path
 * @param sourceFiles Source files
 * @returns Related source files
 */
function findRelatedSourceFiles(docFilePath: string, sourceFiles: SourceFile[]): string[] {
  const docFileName = path.basename(docFilePath, path.extname(docFilePath)).toLowerCase();
  const relatedFiles: string[] = [];
  
  for (const sourceFile of sourceFiles) {
    const sourceFileName = path.basename(sourceFile.path, path.extname(sourceFile.path)).toLowerCase();
    
    // Check if the file names match
    if (sourceFileName === docFileName) {
      relatedFiles.push(sourceFile.path);
      continue;
    }
    
    // Check if the documentation file mentions the source file
    const relativePath = path.basename(sourceFile.path);
    if (sourceFile.content.includes(relativePath)) {
      relatedFiles.push(sourceFile.path);
      continue;
    }
    
    // Check if the source file has documentation blocks that mention the documentation file
    for (const docBlock of sourceFile.docBlocks) {
      if (docBlock.see && docBlock.see.some(see => see.includes(docFileName))) {
        relatedFiles.push(sourceFile.path);
        break;
      }
    }
  }
  
  return relatedFiles;
}

/**
 * Parse documentation blocks from source code
 * 
 * @param content Source code content
 * @returns Documentation blocks
 */
function parseDocBlocks(content: string): DocBlock[] {
  const docBlocks: DocBlock[] = [];
  
  // Match JSDoc comments
  const jsDocRegex = /\/\*\*\s*([\s\S]*?)\s*\*\/\s*(?:export\s+)?(?:(class|function|interface|type|enum|const)\s+(\w+)|(\w+)\s*[:=])/g;
  
  let match;
  while ((match = jsDocRegex.exec(content)) !== null) {
    const commentContent = match[1];
    const blockType = match[2] || 'other';
    const blockName = match[3] || match[4] || '';
    
    // Parse the JSDoc comment
    const description: string[] = [];
    const params: Array<{
      name: string;
      type: string;
      description: string;
      optional?: boolean;
      defaultValue?: string;
    }> = [];
    let returns: { type: string; description: string } | undefined;
    const examples: string[] = [];
    let deprecated = false;
    let since: string | undefined;
    const see: string[] = [];
    const throws: Array<{ type: string; description: string }> = [];
    
    // Split the comment into lines
    const lines = commentContent.split('\n');
    
    let currentTag: string | null = null;
    let currentTagContent: string[] = [];
    
    for (const line of lines) {
      const trimmedLine = line.trim().replace(/^\*\s*/, '');
      
      // Check for JSDoc tags
      const tagMatch = trimmedLine.match(/^@(\w+)(?:\s+(.*))?$/);
      
      if (tagMatch) {
        // Process the previous tag
        if (currentTag) {
          processJsDocTag(
            currentTag,
            currentTagContent.join(' '),
            description,
            params,
            returns,
            examples,
            deprecated,
            since,
            see,
            throws
          );
        }
        
        // Start a new tag
        currentTag = tagMatch[1];
        currentTagContent = tagMatch[2] ? [tagMatch[2]] : [];
      } else if (currentTag) {
        // Continue the current tag
        currentTagContent.push(trimmedLine);
      } else {
        // Add to description
        description.push(trimmedLine);
      }
    }
    
    // Process the last tag
    if (currentTag) {
      processJsDocTag(
        currentTag,
        currentTagContent.join(' '),
        description,
        params,
        returns,
        examples,
        deprecated,
        since,
        see,
        throws
      );
    }
    
    // Calculate the line numbers
    const lineStart = content.substring(0, match.index).split('\n').length;
    const lineEnd = lineStart + match[0].split('\n').length - 1;
    
    // Create the doc block
    docBlocks.push({
      type: blockType as DocBlock['type'],
      name: blockName,
      description: description.join('\n').trim(),
      params: params.length > 0 ? params : undefined,
      returns,
      examples: examples.length > 0 ? examples : undefined,
      deprecated,
      since,
      see: see.length > 0 ? see : undefined,
      throws: throws.length > 0 ? throws : undefined,
      lineStart,
      lineEnd,
    });
  }
  
  return docBlocks;
}

/**
 * Process a JSDoc tag
 * 
 * @param tag Tag name
 * @param content Tag content
 * @param description Description array
 * @param params Parameters array
 * @param returns Returns object
 * @param examples Examples array
 * @param deprecated Deprecated flag
 * @param since Since version
 * @param see See references array
 * @param throws Throws array
 */
function processJsDocTag(
  tag: string,
  content: string,
  description: string[],
  params: Array<{
    name: string;
    type: string;
    description: string;
    optional?: boolean;
    defaultValue?: string;
  }>,
  returns: { type: string; description: string } | undefined,
  examples: string[],
  deprecated: boolean,
  since: string | undefined,
  see: string[],
  throws: Array<{ type: string; description: string }>
): void {
  switch (tag) {
    case 'param':
    case 'arg':
    case 'argument':
      // Parse parameter
      const paramMatch = content.match(/^\{([^}]*)\}\s+(\[?)([\w.]+)(?:=([^]]+))?(\]?)\s*(?:-\s*)?(.*)$/);
      
      if (paramMatch) {
        const type = paramMatch[1];
        const isOptionalStart = paramMatch[2] === '[';
        const name = paramMatch[3];
        const defaultValue = paramMatch[4];
        const isOptionalEnd = paramMatch[5] === ']';
        const paramDescription = paramMatch[6];
        
        params.push({
          name,
          type,
          description: paramDescription,
          optional: isOptionalStart || isOptionalEnd,
          defaultValue,
        });
      }
      break;
      
    case 'returns':
    case 'return':
      // Parse return value
      const returnMatch = content.match(/^\{([^}]*)\}\s*(?:-\s*)?(.*)$/);
      
      if (returnMatch) {
        returns = {
          type: returnMatch[1],
          description: returnMatch[2],
        };
      }
      break;
      
    case 'example':
      // Add example
      examples.push(content);
      break;
      
    case 'deprecated':
      // Mark as deprecated
      deprecated = true;
      break;
      
    case 'since':
      // Set since version
      since = content;
      break;
      
    case 'see':
      // Add see reference
      see.push(content);
      break;
      
    case 'throws':
    case 'exception':
      // Parse throws
      const throwsMatch = content.match(/^\{([^}]*)\}\s*(?:-\s*)?(.*)$/);
      
      if (throwsMatch) {
        throws.push({
          type: throwsMatch[1],
          description: throwsMatch[2],
        });
      }
      break;
      
    default:
      // Add to description
      description.push(`@${tag} ${content}`);
      break;
  }
}

/**
 * Update API documentation
 * 
 * @param apiDocFile API documentation file
 * @param sourceFiles Source files
 * @param updateStrategy Update strategy
 * @param includeExamples Whether to include examples
 * @returns Updated content
 */
async function updateApiDoc(
  apiDocFile: DocFile,
  sourceFiles: SourceFile[],
  updateStrategy: 'append' | 'replace' | 'merge',
  includeExamples: boolean
): Promise<string> {
  // Extract all doc blocks from source files
  const docBlocks: DocBlock[] = [];
  
  for (const sourceFile of sourceFiles) {
    docBlocks.push(...sourceFile.docBlocks);
  }
  
  // Group doc blocks by type
  const groupedBlocks: Record<string, DocBlock[]> = {};
  
  for (const block of docBlocks) {
    if (!groupedBlocks[block.type]) {
      groupedBlocks[block.type] = [];
    }
    
    groupedBlocks[block.type].push(block);
  }
  
  // Generate new content
  let newContent = '';
  
  // Add title if it doesn't exist
  if (!apiDocFile.content.match(/^#\s+API\s+Documentation/m)) {
    newContent += '# API Documentation\n\n';
  }
  
  // Add sections for each type
  for (const [type, blocks] of Object.entries(groupedBlocks)) {
    newContent += `## ${type.charAt(0).toUpperCase() + type.slice(1)}s\n\n`;
    
    for (const block of blocks) {
      newContent += `### ${block.name}\n\n`;
      
      if (block.description) {
        newContent += `${block.description}\n\n`;
      }
      
      if (block.params && block.params.length > 0) {
        newContent += '#### Parameters\n\n';
        newContent += '| Name | Type | Description | Required | Default |\n';
        newContent += '|------|------|-------------|----------|--------|\n';
        
        for (const param of block.params) {
          newContent += `| ${param.name} | \`${param.type}\` | ${param.description} | ${param.optional ? 'No' : 'Yes'} | ${param.defaultValue || '-'} |\n`;
        }
        
        newContent += '\n';
      }
      
      if (block.returns) {
        newContent += '#### Returns\n\n';
        newContent += `\`${block.returns.type}\`: ${block.returns.description}\n\n`;
      }
      
      if (block.throws && block.throws.length > 0) {
        newContent += '#### Throws\n\n';
        
        for (const throwsItem of block.throws) {
          newContent += `- \`${throwsItem.type}\`: ${throwsItem.description}\n`;
        }
        
        newContent += '\n';
      }
      
      if (includeExamples && block.examples && block.examples.length > 0) {
        newContent += '#### Examples\n\n';
        
        for (const example of block.examples) {
          newContent += '```typescript\n';
          newContent += example;
          newContent += '\n```\n\n';
        }
      }
      
      if (block.since) {
        newContent += `*Since: ${block.since}*\n\n`;
      }
      
      if (block.deprecated) {
        newContent += '**Deprecated**\n\n';
      }
      
      if (block.see && block.see.length > 0) {
        newContent += '#### See Also\n\n';
        
        for (const seeItem of block.see) {
          newContent += `- ${seeItem}\n`;
        }
        
        newContent += '\n';
      }
    }
  }
  
  // Apply the update strategy
  switch (updateStrategy) {
    case 'replace':
      return newContent;
    case 'append':
      return apiDocFile.content + '\n\n' + newContent;
    case 'merge':
    default:
      // Find sections in the existing content
      const existingSections = apiDocFile.content.match(/^##\s+.*$(?:\n(?!##\s+).*$)*/gm) || [];
      const existingSectionTitles = existingSections.map(section => {
        const titleMatch = section.match(/^##\s+(.*)$/m);
        return titleMatch ? titleMatch[1].toLowerCase() : '';
      });
      
      // Find sections in the new content
      const newSections = newContent.match(/^##\s+.*$(?:\n(?!##\s+).*$)*/gm) || [];
      
      // Merge sections
      let mergedContent = apiDocFile.content;
      
      for (const newSection of newSections) {
        const titleMatch = newSection.match(/^##\s+(.*)$/m);
        
        if (titleMatch) {
          const title = titleMatch[1].toLowerCase();
          const sectionIndex = existingSectionTitles.indexOf(title);
          
          if (sectionIndex !== -1) {
            // Replace the existing section
            mergedContent = mergedContent.replace(existingSections[sectionIndex], newSection);
          } else {
            // Add the new section
            mergedContent += '\n\n' + newSection;
          }
        }
      }
      
      return mergedContent;
  }
}

/**
 * Update README
 * 
 * @param readmeFile README file
 * @param sourceFiles Source files
 * @param updateStrategy Update strategy
 * @returns Updated content
 */
async function updateReadme(
  readmeFile: DocFile,
  sourceFiles: SourceFile[],
  updateStrategy: 'append' | 'replace' | 'merge'
): Promise<string> {
  // Extract project information
  let projectName = '';
  let projectDescription = '';
  
  try {
    const packageJsonPath = path.join(path.dirname(sourceFiles[0]?.path || ''), 'package.json');
    
    try {
      const packageJsonContent = await fs.readFile(packageJsonPath, 'utf8');
      const packageJson = JSON.parse(packageJsonContent);
      
      projectName = packageJson.name || '';
      projectDescription = packageJson.description || '';
    } catch (error) {
      // No package.json or other error
    }
  } catch (error) {
    // Error finding package.json
  }
  
  // Generate new content
  let newContent = '';
  
  // Add title if it doesn't exist
  if (!readmeFile.content.match(/^#\s+/m)) {
    newContent += `# ${projectName || 'Project'}\n\n`;
  }
  
  // Add description if it doesn't exist
  if (projectDescription && !readmeFile.content.match(/^##\s+Description/m)) {
    newContent += `## Description\n\n${projectDescription}\n\n`;
  }
  
  // Add installation section if it doesn't exist
  if (!readmeFile.content.match(/^##\s+Installation/m)) {
    newContent += '## Installation\n\n';
    newContent += '```bash\n';
    newContent += `npm install ${projectName}\n`;
    newContent += '```\n\n';
  }
  
  // Add usage section if it doesn't exist
  if (!readmeFile.content.match(/^##\s+Usage/m)) {
    newContent += '## Usage\n\n';
    newContent += '```javascript\n';
    newContent += `const ${camelCase(projectName)} = require('${projectName}');\n\n`;
    newContent += `// Example usage\n`;
    newContent += `${camelCase(projectName)}.someFunction();\n`;
    newContent += '```\n\n';
  }
  
  return newContent;
}

// Update table of contents in documentation
function updateTableOfContents(content: string, headings: string[]): string {
  // Implementation would generate a table of contents from headings
  return content; // Placeholder implementation
}

// Update changelog in documentation
function updateChangelog(content: string, version: string, changes: string): string {
  // Implementation would add a new version entry to the changelog
  return content; // Placeholder implementation
}

// Update version references in documentation
function updateVersionReferences(content: string, oldVersion: string, newVersion: string): string {
  // Implementation would replace all occurrences of the old version with the new version
  return content.replace(new RegExp(oldVersion, 'g'), newVersion);
}

// Convert string to camelCase
function camelCase(str: string): string {
  return str.replace(/(?:^w|[A-Z]|w)/g, (word, index) => 
    index === 0 ? word.toLowerCase() : word.toUpperCase()
  ).replace(/s+/g, '');
}
