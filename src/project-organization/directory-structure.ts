/**
 * Directory Structure
 * Provides functionality for generating and managing project directory structures
 */

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
      path: 'src',
      type: 'directory',
      description: 'Source code directory',
      children: [
        {
          path: 'app',
          type: 'directory',
          description: 'Next.js app directory (App Router)',
          children: [
            {
              path: 'page.tsx',
              type: 'file',
              description: 'Home page component',
            },
            {
              path: 'layout.tsx',
              type: 'file',
              description: 'Root layout component',
            },
          ],
        },
        {
          path: 'components',
          type: 'directory',
          description: 'React components',
          children: [
            {
              path: 'ui',
              type: 'directory',
              description: 'UI components',
            },
            {
              path: 'layout',
              type: 'directory',
              description: 'Layout components',
            },
          ],
        },
        {
          path: 'lib',
          type: 'directory',
          description: 'Shared libraries and utilities',
        },
        {
          path: 'hooks',
          type: 'directory',
          description: 'Custom React hooks',
        },
        {
          path: 'styles',
          type: 'directory',
          description: 'Global styles and theme definitions',
        },
        {
          path: 'types',
          type: 'directory',
          description: 'TypeScript type definitions',
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
      path: 'next.config.js',
      type: 'file',
      description: 'Next.js configuration',
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
 * Default React Native mobile app directory structure
 */
export const REACT_NATIVE_STRUCTURE: DirectoryTemplate = {
  name: 'React Native Mobile App',
  description: 'A modern React Native mobile application with a clean directory structure',
  type: ProjectType.MOBILE_APP,
  framework: ProjectFramework.REACT_NATIVE,
  structure: [
    {
      path: 'src',
      type: 'directory',
      description: 'Source code directory',
      children: [
        {
          path: 'components',
          type: 'directory',
          description: 'React Native components',
        },
        {
          path: 'screens',
          type: 'directory',
          description: 'Screen components',
        },
        {
          path: 'navigation',
          type: 'directory',
          description: 'Navigation configuration',
        },
        {
          path: 'hooks',
          type: 'directory',
          description: 'Custom React hooks',
        },
        {
          path: 'services',
          type: 'directory',
          description: 'API services and data fetching',
        },
        {
          path: 'utils',
          type: 'directory',
          description: 'Utility functions',
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
        {
          path: 'types',
          type: 'directory',
          description: 'TypeScript type definitions',
        },
      ],
    },
    {
      path: 'android',
      type: 'directory',
      description: 'Android-specific code',
    },
    {
      path: 'ios',
      type: 'directory',
      description: 'iOS-specific code',
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
      path: 'babel.config.js',
      type: 'file',
      description: 'Babel configuration',
    },
    {
      path: 'metro.config.js',
      type: 'file',
      description: 'Metro bundler configuration',
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
      path: 'app.json',
      type: 'file',
      description: 'React Native app configuration',
    },
  ],
};

/**
 * Collection of directory templates
 */
export const DIRECTORY_TEMPLATES: Record<string, DirectoryTemplate> = {
  'react-web-app': REACT_WEB_APP_STRUCTURE,
  'express-api': EXPRESS_API_STRUCTURE,
  'next-js': NEXT_JS_STRUCTURE,
  'react-native': REACT_NATIVE_STRUCTURE,
};

/**
 * Generates a directory structure based on the specified options
 */
export function generateDirectoryStructure(options: DirectoryStructureOptions): DirectoryNode[] {
  const { type, framework, features = [], customDirectories = [], customFiles = [] } = options;

  // Find the appropriate template
  let template: DirectoryTemplate | undefined;
  
  if (type === ProjectType.WEB_APP && framework === ProjectFramework.REACT) {
    template = REACT_WEB_APP_STRUCTURE;
  } else if (type === ProjectType.API && framework === ProjectFramework.EXPRESS) {
    template = EXPRESS_API_STRUCTURE;
  } else if (type === ProjectType.WEB_APP && framework === ProjectFramework.NEXT_JS) {
    template = NEXT_JS_STRUCTURE;
  } else if (type === ProjectType.MOBILE_APP && framework === ProjectFramework.REACT_NATIVE) {
    template = REACT_NATIVE_STRUCTURE;
  } else {
    // Default to React web app if no matching template is found
    template = REACT_WEB_APP_STRUCTURE;
  }

  // Clone the template structure
  const structure = JSON.parse(JSON.stringify(template.structure)) as DirectoryNode[];

  // Add feature-specific directories and files
  for (const feature of features) {
    if (feature === 'authentication') {
      addAuthenticationFiles(structure);
    } else if (feature === 'database') {
      addDatabaseFiles(structure);
    } else if (feature === 'state-management') {
      addStateManagementFiles(structure, framework);
    } else if (feature === 'internationalization') {
      addInternationalizationFiles(structure);
    } else if (feature === 'testing') {
      addTestingFiles(structure);
    }
  }

  // Add custom directories
  for (const dir of customDirectories) {
    addNode(structure, { path: dir, type: 'directory' });
  }

  // Add custom files
  for (const file of customFiles) {
    addNode(structure, { path: file.path, type: 'file', content: file.content });
  }

  return structure;
}

/**
 * Adds authentication-related files to the structure
 */
function addAuthenticationFiles(structure: DirectoryNode[]): void {
  // Find the src directory
  const src = findNode(structure, 'src');
  if (!src || !src.children) return;

  // Add auth directory
  const authDir: DirectoryNode = {
    path: 'auth',
    type: 'directory',
    description: 'Authentication-related code',
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
  };

  src.children.push(authDir);
}

/**
 * Adds database-related files to the structure
 */
function addDatabaseFiles(structure: DirectoryNode[]): void {
  // Find the src directory
  const src = findNode(structure, 'src');
  if (!src || !src.children) return;

  // Add database directory
  const dbDir: DirectoryNode = {
    path: 'database',
    type: 'directory',
    description: 'Database-related code',
    children: [
      {
        path: 'models',
        type: 'directory',
        description: 'Database models',
      },
      {
        path: 'migrations',
        type: 'directory',
        description: 'Database migrations',
      },
      {
        path: 'seeds',
        type: 'directory',
        description: 'Database seeds',
      },
    ],
  };

  src.children.push(dbDir);
}

/**
 * Adds state management files to the structure
 */
function addStateManagementFiles(structure: DirectoryNode[], framework?: ProjectFramework): void {
  // Find the src directory
  const src = findNode(structure, 'src');
  if (!src || !src.children) return;

  // Add state directory
  const stateDir: DirectoryNode = {
    path: 'state',
    type: 'directory',
    description: 'State management',
    children: [],
  };

  if (framework === ProjectFramework.REACT || framework === ProjectFramework.NEXT_JS) {
    stateDir.children?.push(
      {
        path: 'store.ts',
        type: 'file',
        description: 'Redux store configuration',
      },
      {
        path: 'slices',
        type: 'directory',
        description: 'Redux slices',
      },
      {
        path: 'hooks.ts',
        type: 'file',
        description: 'Redux hooks',
      }
    );
  }

  src.children.push(stateDir);
}

/**
 * Adds internationalization files to the structure
 */
function addInternationalizationFiles(structure: DirectoryNode[]): void {
  // Find the src directory
  const src = findNode(structure, 'src');
  if (!src || !src.children) return;

  // Add i18n directory
  const i18nDir: DirectoryNode = {
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
            path: 'en.json',
            type: 'file',
            description: 'English translations',
          },
          {
            path: 'es.json',
            type: 'file',
            description: 'Spanish translations',
          },
        ],
      },
      {
        path: 'config.ts',
        type: 'file',
        description: 'i18n configuration',
      },
    ],
  };

  src.children.push(i18nDir);
}

/**
 * Adds testing files to the structure
 */
function addTestingFiles(structure: DirectoryNode[]): void {
  // Find the tests directory or create it
  let tests = findNode(structure, 'tests');
  if (!tests) {
    tests = {
      path: 'tests',
      type: 'directory',
      description: 'Test files',
      children: [],
    };
    structure.push(tests);
  }

  if (!tests.children) {
    tests.children = [];
  }

  // Add testing directories
  tests.children.push(
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
    }
  );
}

/**
 * Finds a node in the structure by path
 */
function findNode(structure: DirectoryNode[], path: string): DirectoryNode | undefined {
  for (const node of structure) {
    if (node.path === path) {
      return node;
    }
    if (node.children) {
      const found = findNode(node.children, path);
      if (found) {
        return found;
      }
    }
  }
  return undefined;
}

/**
 * Adds a node to the structure
 */
function addNode(structure: DirectoryNode[], node: DirectoryNode): void {
  const parts = node.path.split('/');
  
  if (parts.length === 1) {
    // Add to root
    structure.push(node);
    return;
  }
  
  // Navigate to the parent directory
  let current = structure;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    let found = false;
    
    for (const n of current) {
      if (n.path === part && n.type === 'directory') {
        if (!n.children) {
          n.children = [];
        }
        current = n.children;
        found = true;
        break;
      }
    }
    
    if (!found) {
      // Create parent directory
      const newDir: DirectoryNode = {
        path: part,
        type: 'directory',
        children: [],
      };
      current.push(newDir);
      current = newDir.children!;
    }
  }
  
  // Add the node to the parent directory
  const nodeName = parts[parts.length - 1];
  current.push({
    ...node,
    path: nodeName,
  });
}

/**
 * Generates a flat list of file paths from a directory structure
 */
export function flattenDirectoryStructure(structure: DirectoryNode[], prefix: string = ''): string[] {
  const paths: string[] = [];
  
  for (const node of structure) {
    const path = prefix ? `${prefix}/${node.path}` : node.path;
    
    if (node.type === 'file') {
      paths.push(path);
    } else if (node.type === 'directory') {
      paths.push(`${path}/`);
      if (node.children) {
        paths.push(...flattenDirectoryStructure(node.children, path));
      }
    }
  }
  
  return paths;
}

/**
 * Generates a markdown representation of a directory structure
 */
export function directoryStructureToMarkdown(structure: DirectoryNode[], level: number = 0): string {
  let markdown = '';
  
  for (const node of structure) {
    const indent = '  '.repeat(level);
    const icon = node.type === 'directory' ? '📁' : '📄';
    
    markdown += `${indent}${icon} ${node.path}`;
    
    if (node.description) {
      markdown += ` - ${node.description}`;
    }
    
    markdown += '\n';
    
    if (node.children) {
      markdown += directoryStructureToMarkdown(node.children, level + 1);
    }
  }
  
  return markdown;
}