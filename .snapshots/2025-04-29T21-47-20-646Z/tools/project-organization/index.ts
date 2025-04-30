// Auto-generated safe fallback for index

export function activate() {
    console.log("[TOOL] index activated (passive mode)");
}

// Define global state types
declare global {
  var projectStructure: {
    files: Array<{
      path: string;
      size: number;
      lastModified: string;
      type: string;
    }>;
    directories: Array<{
      path: string;
      fileCount: number;
      totalSize: number;
    }>;
    lastUpdated: string;
  };
  var projectDocumentation: Record<string, {
    path: string;
    type: string;
    lastUpdated: string;
  }>;
  var fileMonitoringStats: {
    largeFiles: Array<{
      path: string;
      size: number;
      severity: string;
    }>;
    lastScan: string;
    totalSize: number;
    fileCount: number;
  };
}

export function onFileWrite(event: any) {
  console.log(`[Project Organization] File write event detected: ${event.path}`);
  
  try {
    // Initialize global state if needed
    if (!globalThis.projectStructure) {
      globalThis.projectStructure = {
        files: [],
        directories: [],
        lastUpdated: new Date().toISOString()
      };
    }
    
    if (!globalThis.projectDocumentation) {
      globalThis.projectDocumentation = {};
    }
    
    if (!globalThis.fileMonitoringStats) {
      globalThis.fileMonitoringStats = {
        largeFiles: [],
        lastScan: new Date().toISOString(),
        totalSize: 0,
        fileCount: 0
      };
    }
    
    // Update project structure
    const fs = require('fs');
    const path = require('path');
    
    try {
      // Get file stats
      const stats = fs.statSync(event.path);
      const fileSize = stats.size;
      const lastModified = stats.mtime.toISOString();
      const extension = path.extname(event.path).toLowerCase().substring(1);
      
      // Update or add file in project structure
      const existingFileIndex = globalThis.projectStructure.files.findIndex(
        (file: any) => file.path === event.path
      );
      
      if (existingFileIndex >= 0) {
        // Update existing file
        globalThis.projectStructure.files[existingFileIndex] = {
          path: event.path,
          size: fileSize,
          lastModified,
          type: extension
        };
      } else {
        // Add new file
        globalThis.projectStructure.files.push({
          path: event.path,
          size: fileSize,
          lastModified,
          type: extension
        });
      }
      
      // Update directory information
      const dirPath = path.dirname(event.path);
      const existingDirIndex = globalThis.projectStructure.directories.findIndex(
        (dir: any) => dir.path === dirPath
      );
      
      if (existingDirIndex >= 0) {
        // Update existing directory
        const dirFiles = globalThis.projectStructure.files.filter(
          (file: any) => path.dirname(file.path) === dirPath
        );
        
        globalThis.projectStructure.directories[existingDirIndex] = {
          path: dirPath,
          fileCount: dirFiles.length,
          totalSize: dirFiles.reduce((sum: number, file: any) => sum + file.size, 0)
        };
      } else {
        // Add new directory
        globalThis.projectStructure.directories.push({
          path: dirPath,
          fileCount: 1,
          totalSize: fileSize
        });
      }
      
      // Update last updated timestamp
      globalThis.projectStructure.lastUpdated = new Date().toISOString();
      
      // Check if it's a documentation file
      if (extension === 'md' ||
          extension === 'mdx' ||
          extension === 'txt' ||
          event.path.includes('docs') ||
          event.path.includes('documentation') ||
          event.path.includes('README') ||
          event.path.includes('LICENSE')) {
        
        // Update documentation tracking
        globalThis.projectDocumentation[event.path] = {
          path: event.path,
          type: extension,
          lastUpdated: new Date().toISOString()
        };
        
        console.log(`[Project Organization] Documentation file updated: ${event.path}`);
      }
      
      // Check file size for monitoring
      const { FileSizeSeverity } = require('./file-monitor.js');
      
      // Define size thresholds (in bytes)
      const SIZE_WARNING = 1024 * 1024; // 1MB
      const SIZE_CRITICAL = 5 * 1024 * 1024; // 5MB
      
      if (fileSize > SIZE_WARNING) {
        // Determine severity
        const severity = fileSize > SIZE_CRITICAL ?
          FileSizeSeverity.CRITICAL :
          FileSizeSeverity.WARNING;
        
        // Add or update large file tracking
        const existingLargeFileIndex = globalThis.fileMonitoringStats.largeFiles.findIndex(
          (file: any) => file.path === event.path
        );
        
        if (existingLargeFileIndex >= 0) {
          globalThis.fileMonitoringStats.largeFiles[existingLargeFileIndex] = {
            path: event.path,
            size: fileSize,
            severity
          };
        } else {
          globalThis.fileMonitoringStats.largeFiles.push({
            path: event.path,
            size: fileSize,
            severity
          });
        }
        
        console.log(`[Project Organization] Large file detected: ${event.path} (${fileSize} bytes, ${severity})`);
        
        // If it's a critical size, suggest code splitting
        if (severity === FileSizeSeverity.CRITICAL) {
          const { suggestCodeSplitting, formatFileSize } = require('./file-monitor.js');
          const suggestions = suggestCodeSplitting({
            path: event.path,
            size: fileSize,
            content: event.content || ''
          });
          
          console.log(`[Project Organization] File size critical: ${event.path} (${formatFileSize(fileSize)})`);
          console.log(`[Project Organization] Suggestions: ${suggestions.join(', ')}`);
        }
      }
      
      // Update monitoring stats
      globalThis.fileMonitoringStats.lastScan = new Date().toISOString();
      globalThis.fileMonitoringStats.totalSize = globalThis.projectStructure.files.reduce(
        (sum: number, file: any) => sum + file.size, 0
      );
      globalThis.fileMonitoringStats.fileCount = globalThis.projectStructure.files.length;
    } catch (fsError: unknown) {
      const errorMessage = fsError instanceof Error ? fsError.message : String(fsError);
      console.error(`[Project Organization] Error accessing file: ${errorMessage}`);
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[Project Organization] Error handling file write: ${errorMessage}`);
  }
}

export function onSessionStart(session: any) {
  console.log(`[Project Organization] New session started: ${session.id}`);
  
  try {
    // Initialize project organization state for the session
    session.projectOrganizationState = {
      initialized: true,
      timestamp: new Date().toISOString(),
      projectStructure: {
        files: [],
        directories: [],
        lastUpdated: new Date().toISOString()
      },
      documentation: {},
      fileMonitoring: {
        largeFiles: [],
        lastScan: null,
        totalSize: 0,
        fileCount: 0
      }
    };
    
    // Initialize global state if needed
    if (!globalThis.projectStructure) {
      globalThis.projectStructure = {
        files: [],
        directories: [],
        lastUpdated: new Date().toISOString()
      };
    }
    
    if (!globalThis.projectDocumentation) {
      globalThis.projectDocumentation = {};
    }
    
    if (!globalThis.fileMonitoringStats) {
      globalThis.fileMonitoringStats = {
        largeFiles: [],
        lastScan: new Date().toISOString(),
        totalSize: 0,
        fileCount: 0
      };
    }
    
    // Scan project structure
    try {
      const fs = require('fs');
      const path = require('path');
      const projectRoot = process.cwd();
      
      // Function to scan directory recursively
      const scanDirectory = (dir: string, results: any[] = []) => {
        const files = fs.readdirSync(dir);
        
        for (const file of files) {
          const filePath = path.join(dir, file);
          const stats = fs.statSync(filePath);
          
          if (stats.isDirectory()) {
            // Skip node_modules and other common excluded directories
            if (file === 'node_modules' || file === '.git' || file === 'dist' || file === 'build') {
              continue;
            }
            // Recursively scan subdirectories
            scanDirectory(filePath, results);
          } else {
            // Add file to results
            results.push({
              path: filePath,
              size: stats.size,
              lastModified: stats.mtime.toISOString(),
              type: path.extname(file).toLowerCase().substring(1)
            });
          }
        }
        
        return results;
      };
      
      // Scan project files
      const files = scanDirectory(projectRoot);
      console.log(`[Project Organization] Scanned ${files.length} files in project`);
      
      // Update project structure
      globalThis.projectStructure.files = files;
      
      // Build directory structure
      const directories = new Map();
      
      for (const file of files) {
        const dirPath = path.dirname(file.path);
        
        if (!directories.has(dirPath)) {
          directories.set(dirPath, {
            path: dirPath,
            fileCount: 0,
            totalSize: 0
          });
        }
        
        const dirInfo = directories.get(dirPath);
        dirInfo.fileCount++;
        dirInfo.totalSize += file.size;
      }
      
      globalThis.projectStructure.directories = Array.from(directories.values());
      globalThis.projectStructure.lastUpdated = new Date().toISOString();
      
      // Update session state
      session.projectOrganizationState.projectStructure = globalThis.projectStructure;
      
      // Identify documentation files
      const docFiles = files.filter(file =>
        file.type === 'md' ||
        file.type === 'mdx' ||
        file.type === 'txt' ||
        file.path.includes('docs') ||
        file.path.includes('documentation') ||
        file.path.includes('README') ||
        file.path.includes('LICENSE')
      );
      
      // Update documentation tracking
      for (const file of docFiles) {
        globalThis.projectDocumentation[file.path] = {
          path: file.path,
          type: file.type,
          lastUpdated: file.lastModified
        };
      }
      
      session.projectOrganizationState.documentation = globalThis.projectDocumentation;
      
      // Identify large files
      const { FileSizeSeverity } = require('./file-monitor.js');
      
      // Define size thresholds (in bytes)
      const SIZE_WARNING = 1024 * 1024; // 1MB
      const SIZE_CRITICAL = 5 * 1024 * 1024; // 5MB
      
      const largeFiles = files
        .filter(file => file.size > SIZE_WARNING)
        .map(file => ({
          path: file.path,
          size: file.size,
          severity: file.size > SIZE_CRITICAL ?
            FileSizeSeverity.CRITICAL :
            FileSizeSeverity.WARNING
        }));
      
      globalThis.fileMonitoringStats.largeFiles = largeFiles;
      globalThis.fileMonitoringStats.lastScan = new Date().toISOString();
      globalThis.fileMonitoringStats.totalSize = files.reduce((sum, file) => sum + file.size, 0);
      globalThis.fileMonitoringStats.fileCount = files.length;
      
      session.projectOrganizationState.fileMonitoring = globalThis.fileMonitoringStats;
      
      console.log(`[Project Organization] Identified ${largeFiles.length} large files`);
      console.log(`[Project Organization] Identified ${Object.keys(globalThis.projectDocumentation).length} documentation files`);
    } catch (scanError: unknown) {
      const errorMessage = scanError instanceof Error ? scanError.message : String(scanError);
      console.error(`[Project Organization] Error scanning project: ${errorMessage}`);
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[Project Organization] Error initializing session: ${errorMessage}`);
  }
}

export function onCommand(command: any) {
  console.log(`[Project Organization] Command executed: ${command.name}`);
  
  try {
    // Handle project organization commands
    switch (command.name) {
      case 'generate_project':
        // Generate project structure
        return generateProject({
          name: command.name || 'my-project',
          description: command.description || 'A new project',
          type: command.type || ProjectType.API, // Using ProjectType.API as default since WEB doesn't exist
          framework: command.framework,
          features: command.features || [],
          includeDocumentation: command.includeDocumentation !== false,
          includeReadme: command.includeReadme !== false,
          includeLicense: command.includeLicense !== false,
          licenseType: command.licenseType || 'MIT',
          author: command.author || '',
          repositoryUrl: command.repositoryUrl || ''
        });
        
      case 'analyze_project':
        // Analyze project structure
        if (globalThis.projectStructure && globalThis.projectStructure.files) {
          // Convert string dates to Date objects to match the expected type
          const filesWithDateObjects = globalThis.projectStructure.files.map((file: any) => ({
            path: file.path,
            size: file.size,
            lastModified: new Date(file.lastModified) // Convert string to Date object
          }));
          
          return analyzeProject(filesWithDateObjects);
        } else {
          return {
            error: 'Project structure not available. Start a session first.'
          };
        }
        
      case 'generate_documentation':
        // Generate documentation
        const { generateDocumentation } = require('./documentation-generator.js');
        return {
          documentation: generateDocumentation({
            projectName: command.projectName || 'Project',
            projectDescription: command.projectDescription || 'A project',
            type: command.type || DocumentationType.USER_GUIDE,
            format: command.format || DocumentationFormat.MARKDOWN,
            includeInstallation: command.includeInstallation !== false,
            includeUsage: command.includeUsage !== false,
            includeAPI: command.includeAPI !== false,
            includeContributing: command.includeContributing !== false,
            includeLicense: command.includeLicense !== false,
            licenseType: command.licenseType || 'MIT',
            author: command.author || '',
            repositoryUrl: command.repositoryUrl || ''
          })
        };
        
      case 'analyze_file_sizes':
        // Analyze file sizes
        const { analyzeFileSizes, generateFileSizeReport } = require('./file-monitor.js');
        
        if (globalThis.projectStructure && globalThis.projectStructure.files) {
          const sizeReport = analyzeFileSizes(globalThis.projectStructure.files);
          return {
            report: generateFileSizeReport(sizeReport),
            suggestions: sizeReport.suggestions,
            largeFiles: globalThis.fileMonitoringStats.largeFiles
          };
        } else {
          return {
            error: 'Project structure not available. Start a session first.'
          };
        }
        
      case 'get_project_structure':
        // Get project structure
        if (globalThis.projectStructure) {
          const structure = buildDirectoryTree(
            globalThis.projectStructure.files.map((file: any) => file.path)
          );
          
          return {
            structure,
            fileCount: globalThis.projectStructure.files.length,
            directoryCount: globalThis.projectStructure.directories.length,
            totalSize: globalThis.fileMonitoringStats.totalSize,
            lastUpdated: globalThis.projectStructure.lastUpdated
          };
        } else {
          return {
            error: 'Project structure not available. Start a session first.'
          };
        }
        
      case 'get_documentation_files':
        // Get documentation files
        if (globalThis.projectDocumentation) {
          return {
            documentationFiles: globalThis.projectDocumentation,
            count: Object.keys(globalThis.projectDocumentation).length
          };
        } else {
          return {
            error: 'Documentation tracking not available. Start a session first.'
          };
        }
        
      default:
        console.log(`[Project Organization] Unknown command: ${command.name}`);
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[Project Organization] Error executing command: ${errorMessage}`);
    return { error: errorMessage };
  }
}
/**
 * Project Organization Module
 * 
 * This module provides functionality for organizing and managing project structure,
 * generating documentation, and monitoring file sizes.
 */

// Export all types and functions from directory-structure.ts
export * from './directory-structure.js';

// Export all types and functions from documentation-generator.ts
export * from './documentation-generator.js';

// Export all types and functions from file-monitor.ts
export * from './file-monitor.js';

// Export convenience functions

import {
  ProjectType,
  ProjectFramework,
  DirectoryStructureOptions,
  generateDirectoryStructure,
  directoryStructureToMarkdown,
  flattenDirectoryStructure,
  DIRECTORY_TEMPLATES,
} from './directory-structure.js';

import {
  DocumentationType,
  DocumentationFormat,
  DocumentationOptions,
  generateDocumentation,
  generateReadme,
  generateApiDocs,
  DOCUMENTATION_TEMPLATES,
} from './documentation-generator.js';

import {
  FileType,
  FileSizeThreshold,
  FileSizeSeverity,
  analyzeFileSizes,
  generateFileSizeReport,
  suggestCodeSplitting,
  suggestCssOptimizations,
  formatFileSize,
} from './file-monitor.js';

/**
 * Generates a complete project structure with documentation
 */
export function generateProject(options: {
  name: string;
  description: string;
  type: ProjectType;
  framework?: ProjectFramework;
  features?: string[];
  includeDocumentation?: boolean;
  includeReadme?: boolean;
  includeLicense?: boolean;
  licenseType?: string;
  author?: string;
  repositoryUrl?: string;
}): {
  structure: { path: string; type: 'file' | 'directory'; content?: string }[];
  documentation: { path: string; content: string }[];
} {
  const {
    name,
    description,
    type,
    framework,
    features = [],
    includeDocumentation = true,
    includeReadme = true,
    includeLicense = true,
    licenseType = 'MIT',
    author = '',
    repositoryUrl = '',
  } = options;

  // Generate directory structure
  const directoryOptions: DirectoryStructureOptions = {
    name,
    type,
    framework,
    features,
  };

  const structure = generateDirectoryStructure(directoryOptions);
  const flatStructure = flattenDirectoryStructure(structure);

  // Generate documentation
  const documentation: { path: string; content: string }[] = [];

  if (includeReadme) {
    const readmeContent = generateReadme({
      projectName: name,
      projectDescription: description,
      features: features.map(f => f.charAt(0).toUpperCase() + f.slice(1)),
      installation: `\`\`\`bash\nnpm install\n\`\`\``,
      usage: `\`\`\`bash\nnpm start\n\`\`\``,
      license: licenseType,
      author,
      repositoryUrl,
    });

    documentation.push({
      path: 'README.md',
      content: readmeContent,
    });
  }

  if (includeDocumentation) {
    // Generate API documentation if it's an API project
    if (type === ProjectType.API) {
      const apiDocsContent = generateApiDocs({
        projectName: name,
        endpoints: [
          {
            method: 'GET',
            path: '/api/resources',
            description: 'Get a list of resources',
            parameters: [
              {
                name: 'page',
                type: 'number',
                description: 'Page number',
                required: false,
              },
              {
                name: 'limit',
                type: 'number',
                description: 'Number of items per page',
                required: false,
              },
            ],
            responses: [
              {
                status: 200,
                description: 'Success',
                schema: 'Array<Resource>',
              },
              {
                status: 400,
                description: 'Bad Request',
                schema: 'Error',
              },
              {
                status: 500,
                description: 'Internal Server Error',
                schema: 'Error',
              },
            ],
          },
          {
            method: 'GET',
            path: '/api/resources/:id',
            description: 'Get a resource by ID',
            parameters: [
              {
                name: 'id',
                type: 'string',
                description: 'Resource ID',
                required: true,
              },
            ],
            responses: [
              {
                status: 200,
                description: 'Success',
                schema: 'Resource',
              },
              {
                status: 404,
                description: 'Not Found',
                schema: 'Error',
              },
              {
                status: 500,
                description: 'Internal Server Error',
                schema: 'Error',
              },
            ],
          },
          {
            method: 'POST',
            path: '/api/resources',
            description: 'Create a new resource',
            parameters: [
              {
                name: 'body',
                type: 'object',
                description: 'Resource data',
                required: true,
              },
            ],
            responses: [
              {
                status: 201,
                description: 'Created',
                schema: 'Resource',
              },
              {
                status: 400,
                description: 'Bad Request',
                schema: 'Error',
              },
              {
                status: 500,
                description: 'Internal Server Error',
                schema: 'Error',
              },
            ],
          },
        ],
        models: [
          {
            name: 'Resource',
            description: 'A resource object',
            properties: [
              {
                name: 'id',
                type: 'string',
                description: 'Resource ID',
                required: true,
              },
              {
                name: 'name',
                type: 'string',
                description: 'Resource name',
                required: true,
              },
              {
                name: 'description',
                type: 'string',
                description: 'Resource description',
                required: false,
              },
              {
                name: 'createdAt',
                type: 'string',
                description: 'Creation date',
                required: true,
              },
              {
                name: 'updatedAt',
                type: 'string',
                description: 'Last update date',
                required: true,
              },
            ],
          },
          {
            name: 'Error',
            description: 'An error object',
            properties: [
              {
                name: 'message',
                type: 'string',
                description: 'Error message',
                required: true,
              },
              {
                name: 'code',
                type: 'string',
                description: 'Error code',
                required: false,
              },
            ],
          },
        ],
        authentication: 'This API uses JWT for authentication. Include the JWT token in the Authorization header as a Bearer token.',
        errorHandling: 'All errors return a JSON object with a message property and optionally a code property.',
        rateLimiting: 'The API is rate limited to 100 requests per minute per IP address.',
      });

      documentation.push({
        path: 'docs/api.md',
        content: apiDocsContent,
      });
    }

    // Generate user guide
    const userGuideContent = generateDocumentation({
      projectName: name,
      projectDescription: description,
      type: DocumentationType.USER_GUIDE,
      format: DocumentationFormat.MARKDOWN,
      includeInstallation: true,
      includeUsage: true,
      includeAPI: type === ProjectType.API,
      includeContributing: true,
      includeLicense: true,
      licenseType,
      author,
      repositoryUrl,
    });

    documentation.push({
      path: 'docs/user-guide.md',
      content: userGuideContent,
    });

    // Generate contributing guide
    const contributingContent = generateDocumentation({
      projectName: name,
      projectDescription: description,
      type: DocumentationType.CONTRIBUTING,
      format: DocumentationFormat.MARKDOWN,
      licenseType,
      author,
      repositoryUrl,
    });

    documentation.push({
      path: 'CONTRIBUTING.md',
      content: contributingContent,
    });
  }

  if (includeLicense) {
    // Generate license file
    const licenseContent = generateDocumentation({
      projectName: name,
      projectDescription: description,
      type: DocumentationType.LICENSE,
      format: DocumentationFormat.MARKDOWN,
      licenseType,
      author,
      repositoryUrl,
    });

    documentation.push({
      path: 'LICENSE',
      content: licenseContent,
    });
  }

  return {
    structure: flatStructure.map(path => {
      const isDirectory = path.endsWith('/');
      return {
        path: isDirectory ? path.slice(0, -1) : path,
        type: isDirectory ? 'directory' : 'file',
      };
    }),
    documentation,
  };
}

/**
 * Analyzes a project's file structure and generates a report
 */
export function analyzeProject(files: { path: string; size: number; lastModified?: Date }[]): {
  sizeReport: string;
  structureReport: string;
  suggestions: string[];
} {
  // Analyze file sizes
  const sizeReport = analyzeFileSizes(files);
  
  // Generate structure report
  const structure = buildDirectoryTree(files.map(f => f.path));
  const structureMarkdown = directoryTreeToMarkdown(structure);
  
  return {
    sizeReport: generateFileSizeReport(sizeReport),
    structureReport: structureMarkdown,
    suggestions: sizeReport.suggestions,
  };
}

/**
 * Builds a directory tree from a list of file paths
 */
function buildDirectoryTree(paths: string[]): { name: string; children: any[]; type: 'directory' | 'file' }[] {
  const root: { [key: string]: { name: string; children: { [key: string]: any }; type: 'directory' | 'file' } } = {};
  
  for (const path of paths) {
    const parts = path.split('/');
    let current = root;
    
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isFile = i === parts.length - 1;
      
      if (!current[part]) {
        current[part] = {
          name: part,
          children: {},
          type: isFile ? 'file' : 'directory',
        };
      }
      
      if (!isFile) {
        current = current[part].children;
      }
    }
  }
  
  // Convert the tree to the expected format
  return Object.values(root).map(node => convertNode(node));
}

/**
 * Converts a node from the internal format to the expected output format
 */
function convertNode(node: { name: string; children: { [key: string]: any }; type: 'directory' | 'file' }): { name: string; children: any[]; type: 'directory' | 'file' } {
  return {
    name: node.name,
    type: node.type,
    children: Object.values(node.children).map(child => convertNode(child)),
  };
}

/**
 * Converts a directory tree to markdown
 */
function directoryTreeToMarkdown(tree: { name: string; children: any[]; type: 'directory' | 'file' }[], level: number = 0): string {
  let markdown = '';
  
  for (const node of tree) {
    const indent = '  '.repeat(level);
    const icon = node.type === 'directory' ? '📁' : '📄';
    
    markdown += `${indent}${icon} ${node.name}\n`;
    
    if (node.children && node.children.length > 0) {
      markdown += directoryTreeToMarkdown(node.children, level + 1);
    }
  }
  
  return markdown;
}
