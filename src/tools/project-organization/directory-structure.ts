// Auto-generated safe fallback for directory-structure

export function activate() {
    console.log("[TOOL] directory-structure activated (passive mode)");
}

import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * Project type definitions for directory structure generation
 */
export enum ProjectType {
  WEB_APP = 'web-app',
  MOBILE_APP = 'mobile-app',
  API = 'api',
  LIBRARY = 'library',
  MONOREPO = 'monorepo',
  DESKTOP_APP = 'desktop-app',
  STATIC_SITE = 'static-site',
  DOCUMENTATION = 'documentation',
}

/**
 * Framework definitions for directory structure generation
 */
export enum ProjectFramework {
  REACT = 'react',
  NEXT_JS = 'next-js',
  VUE = 'vue',
  ANGULAR = 'angular',
  EXPRESS = 'express',
  NEST_JS = 'nest-js',
  DJANGO = 'django',
  FLASK = 'flask',
  SPRING_BOOT = 'spring-boot',
  LARAVEL = 'laravel',
  ELECTRON = 'electron',
  REACT_NATIVE = 'react-native',
  FLUTTER = 'flutter',
}

/**
 * Directory structure template
 */
export interface DirectoryTemplate {
  name: string;
  description: string;
  type: ProjectType;
  framework?: ProjectFramework;
  structure: DirectoryNode[];
}

/**
 * Directory node representing a file or directory
 */
export interface DirectoryNode {
  path: string;
  type: 'file' | 'directory';
  description?: string;
  content?: string;
  children?: DirectoryNode[];
}

/**
 * Directory structure options
 */
export interface DirectoryStructureOptions {
  name: string;
  type: ProjectType;
  framework?: ProjectFramework;
  features?: string[];
  customDirectories?: string[];
  customFiles?: { path: string; content?: string }[];
}

// Track generated directory structures
const generatedStructures: Record<string, DirectoryNode[]> = {};

export async function onFileWrite(filePath?: string) {
  if (!filePath) return;
  
  try {
    // Check if the file is a directory structure template
    if (filePath.includes('directory-structure') || filePath.endsWith('.structure.json')) {
      console.log(`[directory-structure] Detected change in directory structure file: ${filePath}`);
      
      // In a real implementation, we might validate the structure file
      // and update the available templates
    }
  } catch (err) {
    console.error(`[directory-structure] Error processing file change: ${err}`);
  }
}

export async function onSessionStart() {
  console.log('[directory-structure] Session started');
  
  try {
    // Initialize with default templates
    generatedStructures['react-web-app'] = REACT_WEB_APP_STRUCTURE.structure;
    generatedStructures['express-api'] = EXPRESS_API_STRUCTURE.structure;
    
    console.log(`[directory-structure] Initialized with default directory structures`);
    
    return {
      initialized: true,
      templatesLoaded: Object.keys(generatedStructures).length,
      message: 'Directory structure initialized'
    };
  } catch (err) {
    console.error(`[directory-structure] Error initializing: ${err}`);
    return {
      initialized: false,
      message: `Error initializing directory structure: ${err}`
    };
  }
}

export async function onCommand(command?: { name: string; args?: any[] }) {
  const name = command?.name;
  const args = command?.args || [];
  
  switch (name) {
    case 'directory-structure:generate': {
      const options = args[0] as DirectoryStructureOptions;
      
      if (!options) {
        return { success: false, message: 'Directory structure options are required' };
      }
      
      try {
        // Generate the directory structure
        const structure = generateDirectoryStructure(options);
        generatedStructures[options.name] = structure;
        
        console.log(`[directory-structure] Generated directory structure: ${options.name}`);
        return { success: true, structure };
      } catch (err) {
        console.error(`[directory-structure] Error generating directory structure: ${err}`);
        return { success: false, message: `Error generating directory structure: ${err}` };
      }
    }
    case 'directory-structure:list': {
      return {
        success: true,
        structures: Object.keys(generatedStructures)
      };
    }
    case 'directory-structure:get': {
      const structureName = args[0];
      if (!structureName) {
        return { success: false, message: 'Structure name is required' };
      }
      
      const structure = generatedStructures[structureName];
      if (!structure) {
        return { success: false, message: `Structure with name ${structureName} not found` };
      }
      
      return { success: true, structure };
    }
    default:
      console.log(`[directory-structure] Unknown command: ${name}`);
      return { message: `Unknown command: ${name}` };
  }
}

/**
 * Directory Structure
 * Provides functionality for generating and managing project directory structures
 */

/**
 * Default React web app directory structure
 */
export const REACT_WEB_APP_STRUCTURE: DirectoryTemplate = {
  name: 'React Web App',
  description: 'A modern React web application with a clean directory structure',
  type: ProjectType.WEB_APP,
  framework: ProjectFramework.REACT,
  structure: [
    {
      path: 'src',
      type: 'directory',
      description: 'Source code directory',
      children: [
        {
          path: 'components',
          type: 'directory',
          description: 'React components',
          children: [
            {
              path: 'common',
              type: 'directory',
              description: 'Common components used throughout the application',
            },
            {
              path: 'layout',
              type: 'directory',
              description: 'Layout components like Header, Footer, Sidebar',
            },
            {
              path: 'pages',
              type: 'directory',
              description: 'Page-specific components',
            },
          ],
        },
        {
          path: 'hooks',
          type: 'directory',
          description: 'Custom React hooks',
        },
        {
          path: 'context',
          type: 'directory',
          description: 'React context providers',
        },
        {
          path: 'utils',
          type: 'directory',
          description: 'Utility functions',
        },
        {
          path: 'services',
          type: 'directory',
          description: 'API services and data fetching',
        },
        {
          path: 'types',
          type: 'directory',
          description: 'TypeScript type definitions',
        },
        {
          path: 'assets',
          type: 'directory',
          description: 'Static assets like images, fonts, etc.',
        },
        {
          path: 'styles',
          type: 'directory',
          description: 'Global styles and theme definitions',
        },
      ],
    },
    {
      path: 'public',
      type: 'directory',
      description: 'Public assets that will be served as-is',
    },
    {
      path: 'tests',
      type: 'directory',
      description: 'Test files',
    },
    {
      path: '.github',
      type: 'directory',
      description: 'GitHub workflows and configuration',
      children: [
        {
          path: 'workflows',
          type: 'directory',
          description: 'GitHub Actions workflows',
        },
      ],
    },
    {
      path: 'package.json',
      type: 'file',
      description: 'NPM package configuration',
    },
    {
      path: 'tsconfig.json',
      type: 'file',
      description: 'TypeScript configuration',
    },
    {
      path: '.eslintrc.js',
      type: 'file',
      description: 'ESLint configuration',
    },
    {
      path: '.prettierrc',
      type: 'file',
      description: 'Prettier configuration',
    },
    {
      path: 'README.md',
      type: 'file',
      description: 'Project documentation',
    },
    {
      path: '.gitignore',
      type: 'file',
      description: 'Git ignore file',
    },
  ],
};

/**
 * Default Express API directory structure
 */
export const EXPRESS_API_STRUCTURE: DirectoryTemplate = {
  name: 'Express API',
  description: 'A modern Express.js API with a clean directory structure',
  type: ProjectType.API,
  framework: ProjectFramework.EXPRESS,
  structure: [
    {
      path: 'src',
      type: 'directory',
      description: 'Source code directory',
      children: [
        {
          path: 'controllers',
          type: 'directory',
          description: 'API controllers',
        },
        {
          path: 'models',
          type: 'directory',
          description: 'Data models',
        },
        {
          path: 'routes',
          type: 'directory',
          description: 'API routes',
        },
        {
          path: 'middleware',
          type: 'directory',
          description: 'Express middleware',
        },
        {
          path: 'services',
          type: 'directory',
          description: 'Business logic services',
        },
        {
          path: 'utils',
          type: 'directory',
          description: 'Utility functions',
        },
        {
          path: 'config',
          type: 'directory',
          description: 'Configuration files',
        },
        {
          path: 'types',
          type: 'directory',
          description: 'TypeScript type definitions',
        },
      ],
    },
    {
      path: 'tests',
      type: 'directory',
      description: 'Test files',
    },
    {
      path: '.github',
      type: 'directory',
      description: 'GitHub workflows and configuration',
      children: [
        {
          path: 'workflows',
          type: 'directory',
          description: 'GitHub Actions workflows',
        },
      ],
    },
    {
      path: 'package.json',
      type: 'file',
      description: 'NPM package configuration',
    },
    {
      path: 'tsconfig.json',
      type: 'file',
      description: 'TypeScript configuration',
    },
    {
      path: '.eslintrc.js',
      type: 'file',
      description: 'ESLint configuration',
    },
    {
      path: '.prettierrc',
      type: 'file',
      description: 'Prettier configuration',
    },
    {
      path: 'README.md',
      type: 'file',
      description: 'Project documentation',
    },
    {
      path: '.gitignore',
      type: 'file',
      description: 'Git ignore file',
    },
    {
      path: '.env.example',
      type: 'file',
      description: 'Example environment variables',
    },
  ],
};

/**
 * Default Next.js web app directory structure
 */
export const NEXT_JS_STRUCTURE: DirectoryTemplate = {
  name: 'Next.js Web App',
  description: 'A modern Next.js web application with a clean directory structure',
  type: ProjectType.WEB_APP,
  framework: ProjectFramework.NEXT_JS,
  structure: [
    {
      path: 'pages',
      type: 'directory',
      description: 'Next.js pages directory for routing',
      children: [
        {
          path: 'api',
          type: 'directory',
          description: 'API routes',
        },
        {
          path: '_app.tsx',
          type: 'file',
          description: 'Custom App component',
        },
        {
          path: '_document.tsx',
          type: 'file',
          description: 'Custom Document component',
        },
        {
          path: 'index.tsx',
          type: 'file',
          description: 'Home page',
        },
      ],
    },
    {
      path: 'public',
      type: 'directory',
      description: 'Public assets that will be served as-is',
    },
    {
      path: 'styles',
      type: 'directory',
      description: 'Global styles and CSS modules',
    },
    {
      path: 'components',
      type: 'directory',
      description: 'React components',
      children: [
        {
          path: 'common',
          type: 'directory',
          description: 'Common components used throughout the application',
        },
        {
          path: 'layout',
          type: 'directory',
          description: 'Layout components like Header, Footer, Sidebar',
        },
      ],
    },
    {
      path: 'lib',
      type: 'directory',
      description: 'Shared utilities and libraries',
    },
    {
      path: 'hooks',
      type: 'directory',
      description: 'Custom React hooks',
    },
    {
      path: 'context',
      type: 'directory',
      description: 'React context providers',
    },
    {
      path: 'types',
      type: 'directory',
      description: 'TypeScript type definitions',
    },
    {
      path: 'tests',
      type: 'directory',
      description: 'Test files',
    },
    {
      path: 'next.config.js',
      type: 'file',
      description: 'Next.js configuration',
    },
    {
      path: 'package.json',
      type: 'file',
      description: 'NPM package configuration',
    },
    {
      path: 'tsconfig.json',
      type: 'file',
      description: 'TypeScript configuration',
    },
    {
      path: '.eslintrc.js',
      type: 'file',
      description: 'ESLint configuration',
    },
    {
      path: '.prettierrc',
      type: 'file',
      description: 'Prettier configuration',
    },
    {
      path: 'README.md',
      type: 'file',
      description: 'Project documentation',
    },
    {
      path: '.gitignore',
      type: 'file',
      description: 'Git ignore file',
    },
  ],
};

/**
 * Generate directory structure based on options
 */
export function generateDirectoryStructure(options: DirectoryStructureOptions): DirectoryNode[] {
  let structure: DirectoryNode[] = [];
  
  // Start with a base structure based on project type and framework
  if (options.type === ProjectType.WEB_APP) {
    if (options.framework === ProjectFramework.REACT) {
      structure = JSON.parse(JSON.stringify(REACT_WEB_APP_STRUCTURE.structure));
    } else if (options.framework === ProjectFramework.NEXT_JS) {
      structure = JSON.parse(JSON.stringify(NEXT_JS_STRUCTURE.structure)); // Added comment to trigger re-evaluation
    }
  } else if (options.type === ProjectType.API) {
    if (options.framework === ProjectFramework.EXPRESS) {
      structure = JSON.parse(JSON.stringify(EXPRESS_API_STRUCTURE.structure));
    }
  }
  
  // Add feature-specific files and directories
  if (options.features) {
    if (options.features.includes('authentication')) {
      addAuthenticationFiles(structure);
    }
    
    if (options.features.includes('database')) {
      addDatabaseFiles(structure);
    }
    
    if (options.features.includes('state-management')) {
      addStateManagementFiles(structure, options.framework);
    }
    
    if (options.features.includes('i18n')) {
      addInternationalizationFiles(structure);
    }
    
    if (options.features.includes('testing')) {
      addTestingFiles(structure);
    }
  }
  
  // Add custom directories
  if (options.customDirectories) {
    for (const dir of options.customDirectories) {
      addNode(structure, {
        path: dir,
        type: 'directory',
        description: 'Custom directory',
      });
    }
  }
  
  // Add custom files
  if (options.customFiles) {
    for (const file of options.customFiles) {
      addNode(structure, {
        path: file.path,
        type: 'file',
        description: 'Custom file',
        content: file.content,
      });
    }
  }
  
  return structure;
}

/**
 * Add authentication files to the directory structure
 */
function addAuthenticationFiles(structure: DirectoryNode[]): void {
  // Add auth directory to src
  const srcNode = findNode(structure, 'src');
  if (srcNode && srcNode.children) {
    srcNode.children.push({
      path: 'auth',
      type: 'directory',
      description: 'Authentication related files',
      children: [
        {
          path: 'providers',
          type: 'directory',
          description: 'Authentication providers',
        },
        {
          path: 'hooks',
          type: 'directory',
          description: 'Authentication hooks',
        },
        {
          path: 'components',
          type: 'directory',
          description: 'Authentication components',
        },
      ],
    });
  }
}

/**
 * Add database files to the directory structure
 */
function addDatabaseFiles(structure: DirectoryNode[]): void {
  // Add database directory to src
  const srcNode = findNode(structure, 'src');
  if (srcNode && srcNode.children) {
    srcNode.children.push({
      path: 'database',
      type: 'directory',
      description: 'Database related files',
      children: [
        {
          path: 'migrations',
          type: 'directory',
          description: 'Database migrations',
        },
        {
          path: 'seeders',
          type: 'directory',
          description: 'Database seeders',
        },
        {
          path: 'models',
          type: 'directory',
          description: 'Database models',
        },
      ],
    });
  }
}

/**
 * Add state management files to the directory structure
 */
function addStateManagementFiles(structure: DirectoryNode[], framework?: ProjectFramework): void {
  // Add state management directory to src
  const srcNode = findNode(structure, 'src');
  if (srcNode && srcNode.children) {
    if (framework === ProjectFramework.REACT) {
      srcNode.children.push({
        path: 'store',
        type: 'directory',
        description: 'State management',
        children: [
          {
            path: 'slices',
            type: 'directory',
            description: 'Redux slices',
          },
          {
            path: 'hooks',
            type: 'directory',
            description: 'Redux hooks',
          },
          {
            path: 'store.ts',
            type: 'file',
            description: 'Redux store configuration',
          },
        ],
      });
    }
  }
}

/**
 * Add internationalization files to the directory structure
 */
function addInternationalizationFiles(structure: DirectoryNode[]): void {
  // Add i18n directory to src
  const srcNode = findNode(structure, 'src');
  if (srcNode && srcNode.children) {
    srcNode.children.push({
      path: 'i18n',
      type: 'directory',
      description: 'Internationalization',
      children: [
        {
          path: 'locales',
          type: 'directory',
          description: 'Translation files',
          children: [
            {
              path: 'en',
              type: 'directory',
              description: 'English translations',
            },
            {
              path: 'es',
              type: 'directory',
              description: 'Spanish translations',
            },
            {
              path: 'fr',
              type: 'directory',
              description: 'French translations',
            },
          ],
        },
        {
          path: 'config.ts',
          type: 'file',
          description: 'i18n configuration',
        },
      ],
    });
  }
}

/**
 * Add testing files to the directory structure
 */
function addTestingFiles(structure: DirectoryNode[]): void {
  // Add test directories
  structure.push({
    path: 'tests',
    type: 'directory',
    description: 'Test files',
    children: [
      {
        path: 'unit',
        type: 'directory',
        description: 'Unit tests',
      },
      {
        path: 'integration',
        type: 'directory',
        description: 'Integration tests',
      },
      {
        path: 'e2e',
        type: 'directory',
        description: 'End-to-end tests',
      },
      {
        path: 'fixtures',
        type: 'directory',
        description: 'Test fixtures',
      },
      {
        path: 'mocks',
        type: 'directory',
        description: 'Test mocks',
      },
    ],
  });
  
  // Add test configuration files
  structure.push({
    path: 'jest.config.js',
    type: 'file',
    description: 'Jest configuration',
  });
}

/**
 * Find a node in the directory structure by path
 */
function findNode(structure: DirectoryNode[], path: string): DirectoryNode | undefined {
  for (const node of structure) {
    if (node.path === path) {
      return node;
    }
    
    if (node.children) {
      const foundNode = findNode(node.children, path);
      if (foundNode) {
        return foundNode;
      }
    }
  }
  
  return undefined;
}

/**
 * Add a node to the directory structure
 */
function addNode(structure: DirectoryNode[], node: DirectoryNode): void {
  // Check if the path contains directories
  const parts = node.path.split('/');
  
  if (parts.length === 1) {
    // Simple path, add directly to the structure
    structure.push(node);
  } else {
    // Complex path, need to create parent directories if they don't exist
    let currentPath = '';
    let currentStructure = structure;
    
    for (let i = 0; i < parts.length - 1; i++) {
      currentPath += (i > 0 ? '/' : '') + parts[i];
      
      let dirNode = findNode(currentStructure, parts[i]);
      
      if (!dirNode) {
        dirNode = {
          path: parts[i],
          type: 'directory',
          description: 'Generated directory',
          children: [],
        };
        currentStructure.push(dirNode);
      }
      
      if (!dirNode.children) {
        dirNode.children = [];
      }
      
      currentStructure = dirNode.children;
    }
    
    // Add the final node
    const finalNode = { ...node, path: parts[parts.length - 1] };
    currentStructure.push(finalNode);
  }
}

/**
 * Flatten directory structure to a list of paths
 */
export function flattenDirectoryStructure(structure: DirectoryNode[], prefix: string = ''): string[] {
  const paths: string[] = [];
  
  for (const node of structure) {
    const nodePath = prefix ? `${prefix}/${node.path}` : node.path;
    paths.push(nodePath);
    
    if (node.children) {
      paths.push(...flattenDirectoryStructure(node.children, nodePath));
    }
  }
  
  return paths;
}

/**
 * Convert directory structure to markdown
 */
export function directoryStructureToMarkdown(structure: DirectoryNode[], level: number = 0): string {
  let markdown = '';
  
  for (const node of structure) {
    const indent = '  '.repeat(level);
    const icon = node.type === 'directory' ? '📁' : '📄';
    
    markdown += `${indent}${icon} ${node.path}${node.description ? ` - ${node.description}` : ''}\n`;
    
    if (node.children) {
      markdown += directoryStructureToMarkdown(node.children, level + 1);
    }
  }
  
  return markdown;
}
