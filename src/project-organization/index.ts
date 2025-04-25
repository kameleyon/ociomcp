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