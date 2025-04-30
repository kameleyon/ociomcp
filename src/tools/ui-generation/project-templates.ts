// Auto-generated safe fallback for project-templates

export function activate() {
    console.log("[TOOL] project-templates activated (passive mode)");
}

export function onFileWrite(filePath: string, content: string) {
  console.log(`[TOOL] Project templates processing file: ${filePath}`);
  
  // Check if the file is a project template file
  const isTemplateFile = filePath.includes('project-templates') || filePath.endsWith('.template.ts');
  
  if (isTemplateFile) {
    console.log(`[TOOL] Detected change in project template file: ${filePath}`);
    // In a real implementation, we might reload or update the templates
  }
}

export function onSessionStart(sessionId: string) {
  console.log(`[TOOL] Project templates initialized for session: ${sessionId}`);
  
  // Check for existing project templates
  setTimeout(() => {
    console.log('[TOOL] Checking for existing project templates...');
    checkExistingTemplates();
  }, 3000); // Delay to ensure project files are loaded
}

export function onCommand(command: string, args: any[]) {
  if (command === 'list-project-templates') {
    console.log('[TOOL] Listing project templates...');
    
    return handleListProjectTemplates();
  } else if (command === 'get-project-template') {
    console.log('[TOOL] Getting project template...');
    
    const templateName = args[0];
    const framework = args[1] || 'react-vite';
    
    return handleGetProjectTemplate(templateName, framework);
  } else if (command === 'generate-project-from-template') {
    console.log('[TOOL] Generating project from template...');
    
    const templateName = args[0];
    const options = args[1];
    
    return handleGenerateProjectFromTemplate(templateName, options);
  }
  
  return null;
}

/**
 * Checks for existing project templates
 */
function checkExistingTemplates() {
  console.log('[TOOL] Checking for existing project templates...');
  
  // This is a placeholder - in a real implementation, this would scan the filesystem
  // For now, we'll just log a message
  console.log('[TOOL] Recommendation: Use the "list-project-templates" command to see available templates');
  console.log('[TOOL] Common template tasks:');
  console.log('- Listing available project templates');
  console.log('- Getting a specific project template');
  console.log('- Generating a project from a template');
}

/**
 * Handles the list-project-templates command
 */
async function handleListProjectTemplates(): Promise<any> {
  console.log('[TOOL] Handling list-project-templates command');
  // Placeholder implementation
  return { success: true, templates: Object.values(ProjectType) };
}

/**
 * Handles the get-project-template command
 */
async function handleGetProjectTemplate(templateName: string, framework: string): Promise<any> {
  console.log(`[TOOL] Handling get-project-template command for ${templateName} (${framework})`);
  // Placeholder implementation
  return { success: true, template: { name: templateName, framework: framework, description: 'Mock project template' } };
}

/**
 * Handles the generate-project-from-template command
 */
async function handleGenerateProjectFromTemplate(templateName: string, options: any): Promise<any> {
  console.log(`[TOOL] Handling generate-project-from-template command for ${templateName} with options:`, options);
  // Placeholder implementation
  return { success: true, message: `Project generated from template ${templateName} (mock)` };
}
/**
 * Project Templates
 * Provides templates for generating complete React projects with various configurations
 */

import { PageType } from './page-templates.js';

/**
 * Project type definitions
 */
export enum ProjectType {
  LANDING_PAGE = 'landing-page',
  MARKETING_SITE = 'marketing-site',
  DASHBOARD = 'dashboard',
  E_COMMERCE = 'e-commerce',
  BLOG = 'blog',
  DOCUMENTATION = 'documentation',
  PORTFOLIO = 'portfolio',
  SAAS = 'saas',
}

/**
 * Project framework definitions
 */
export enum ProjectFramework {
  REACT_VITE = 'react-vite',
  NEXT_JS = 'next-js',
  REMIX = 'remix',
  GATSBY = 'gatsby',
}

/**
 * Project styling framework definitions
 */
export enum ProjectStyling {
  TAILWIND = 'tailwind',
  STYLED_COMPONENTS = 'styled-components',
  EMOTION = 'emotion',
  CSS_MODULES = 'css-modules',
}

/**
 * Project database definitions
 */
export enum ProjectDatabase {
  SUPABASE = 'supabase',
  FIREBASE = 'firebase',
  MONGODB = 'mongodb',
  POSTGRESQL = 'postgresql',
  MYSQL = 'mysql',
  NONE = 'none',
}

/**
 * Project authentication definitions
 */
export enum ProjectAuthentication {
  SUPABASE = 'supabase',
  FIREBASE = 'firebase',
  AUTH0 = 'auth0',
  CLERK = 'clerk',
  CUSTOM = 'custom',
  NONE = 'none',
}

/**
 * Project file structure
 */
export interface ProjectFile {
  path: string;
  content: string;
}

/**
 * Project page
 */
export interface ProjectPage {
  name: string;
  type: PageType;
  path: string;
}

/**
 * Project component
 */
export interface ProjectComponent {
  name: string;
  path: string;
}

/**
 * Project options
 */
export interface ProjectOptions {
  name: string;
  type: ProjectType;
  framework: ProjectFramework;
  styling: ProjectStyling;
  database: ProjectDatabase;
  authentication: ProjectAuthentication;
  pages: ProjectPage[];
  components: ProjectComponent[];
  features?: {
    darkMode?: boolean;
    responsive?: boolean;
    i18n?: boolean;
    seo?: boolean;
    analytics?: boolean;
    pwa?: boolean;
  };
  dependencies?: string[];
  devDependencies?: string[];
}

/**
 * Default project options
 */
export const DEFAULT_PROJECT_OPTIONS: Partial<ProjectOptions> = {
  framework: ProjectFramework.REACT_VITE,
  styling: ProjectStyling.TAILWIND,
  database: ProjectDatabase.SUPABASE,
  authentication: ProjectAuthentication.SUPABASE,
  features: {
    darkMode: true,
    responsive: true,
    i18n: false,
    seo: true,
    analytics: false,
    pwa: false,
  },
};

/**
 * Default project dependencies for React Vite with Tailwind
 */
export const DEFAULT_REACT_VITE_DEPENDENCIES = [
  'react',
  'react-dom',
  'react-router-dom',
  'lucide-react',
  'react-markdown',
  'tailwindcss',
  'postcss',
  'autoprefixer',
  'clsx',
  'tailwind-merge',
];

/**
 * Default project dev dependencies for React Vite with Tailwind
 */
export const DEFAULT_REACT_VITE_DEV_DEPENDENCIES = [
  'vite',
  'typescript',
  '@types/react',
  '@types/react-dom',
  '@vitejs/plugin-react',
  'eslint',
  'eslint-plugin-react',
  'eslint-plugin-react-hooks',
  'prettier',
  'prettier-plugin-tailwindcss',
];

/**
 * Generates a package.json file for a React Vite project
 */
export function generatePackageJson(options: ProjectOptions): string {
  const {
    name,
    dependencies = DEFAULT_REACT_VITE_DEPENDENCIES,
    devDependencies = DEFAULT_REACT_VITE_DEV_DEPENDENCIES,
  } = options;

  // Generate dependencies object
  const dependenciesObj = dependencies.reduce((acc, dep) => {
    acc[dep] = getLatestVersion(dep);
    return acc;
  }, {} as Record<string, string>);

  // Generate dev dependencies object
  const devDependenciesObj = devDependencies.reduce((acc, dep) => {
    acc[dep] = getLatestVersion(dep);
    return acc;
  }, {} as Record<string, string>);

  // Generate package.json
  return JSON.stringify(
    {
      name: name.toLowerCase().replace(/\s+/g, '-'),
      private: true,
      version: '0.1.0',
      type: 'module',
      scripts: {
        dev: 'vite',
        build: 'tsc && vite build',
        preview: 'vite preview',
        lint: 'eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0',
        format: 'prettier --write "src/**/*.{ts,tsx}"',
      },
      dependencies: dependenciesObj,
      devDependencies: devDependenciesObj,
    },
    null,
    2
  );
}

/**
 * Generates a tsconfig.json file for a React Vite project
 */
export function generateTsConfig(): string {
  return JSON.stringify(
    {
      compilerOptions: {
        target: 'ES2020',
        useDefineForClassFields: true,
        lib: ['ES2020', 'DOM', 'DOM.Iterable'],
        module: 'ESNext',
        skipLibCheck: true,
        moduleResolution: 'bundler',
        allowImportingTsExtensions: true,
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        jsx: 'react-jsx',
        strict: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        noFallthroughCasesInSwitch: true,
        paths: {
          '@/*': ['./src/*'],
        },
      },
      include: ['src'],
      references: [{ path: './tsconfig.node.json' }],
    },
    null,
    2
  );
}

/**
 * Generates a tsconfig.node.json file for a React Vite project
 */
export function generateTsConfigNode(): string {
  return JSON.stringify(
    {
      compilerOptions: {
        composite: true,
        skipLibCheck: true,
        module: 'ESNext',
        moduleResolution: 'bundler',
        allowSyntheticDefaultImports: true,
      },
      include: ['vite.config.ts'],
    },
    null,
    2
  );
}

/**
 * Generates a vite.config.ts file for a React Vite project
 */
export function generateViteConfig(): string {
  return `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
`;
}

/**
 * Generates a tailwind.config.js file
 */
export function generateTailwindConfig(): string {
  return `/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3b82f6',
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
      },
      borderRadius: {
        'xl': '0.75rem',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.5s ease-out',
        'slide-down': 'slide-down 0.5s ease-out',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
`;
}

/**
 * Generates a postcss.config.js file
 */
export function generatePostCssConfig(): string {
  return `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`;
}

/**
 * Generates an index.html file for a React Vite project
 */
export function generateIndexHtml(options: ProjectOptions): string {
  const { name } = options;

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${name} - A modern React application" />
    <title>${name}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;
}

/**
 * Generates a main.tsx file for a React Vite project
 */
export function generateMainTsx(options: ProjectOptions): string {
  const { features } = options;
  const darkMode = features?.darkMode ?? true;

  return `import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

${darkMode ? `// Initialize dark mode based on user preference
const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
if (prefersDarkMode) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}` : ''}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
`;
}

/**
 * Generates an App.tsx file for a React Vite project
 */
export function generateAppTsx(options: ProjectOptions): string {
  const { pages } = options;

  // Generate imports
  const imports = [
    "import { Routes, Route } from 'react-router-dom';",
  ];

  // Add page imports
  const pageImports = pages.map(page => {
    return `import { ${page.name}Page } from './${page.path}';`;
  });

  // Generate routes
  const routes = pages.map(page => {
    return `        <Route path="${getRoutePath(page)}" element={<${page.name}Page />} />`;
  }).join('\n');

  return `${imports.join('\n')}
${pageImports.join('\n')}

function App() {
  return (
    <Routes>
${routes}
    </Routes>
  );
}

export default App;
`;
}

/**
 * Generates an index.css file for a React Vite project with Tailwind
 */
export function generateIndexCss(): string {
  return `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.75rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 48%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

.bg-grid-gray-900\/\[0\.2\] {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(17 24 39 / 0.2)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
}

.dark .bg-grid-gray-900\/\[0\.2\] {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(243 244 246 / 0.2)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
}
`;
}

/**
 * Generates a utils.ts file with common utility functions
 */
export function generateUtilsTs(): string {
  return `import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines multiple class names into a single string, merging Tailwind classes properly
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date using the Intl.DateTimeFormat API
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * Truncates a string to a specified length and adds an ellipsis
 */
export function truncateString(str: string, length: number): string {
  if (str.length <= length) {
    return str;
  }
  return str.slice(0, length) + '...';
}

/**
 * Generates a random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}
`;
}

/**
 * Generates a favicon.svg file
 */
export function generateFaviconSvg(options: ProjectOptions): string {
  const { name } = options;
  const initial = name.charAt(0).toUpperCase();

  return `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" rx="8" fill="#3B82F6"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="16" fill="white">${initial}</text>
</svg>
`;
}

/**
 * Gets the latest version of a package (simplified)
 */
function getLatestVersion(packageName: string): string {
  // In a real implementation, this would fetch the latest version from npm
  // For simplicity, we'll return a fixed version
  return '^1.0.0';
}

/**
 * Gets the route path for a page
 */
function getRoutePath(page: ProjectPage): string {
  if (page.name.toLowerCase() === 'home') {
    return '/';
  }
  return `/${page.name.toLowerCase().replace(/page$/, '')}`;
}

/**
 * Generates a complete React Vite project
 */
export function generateReactViteProject(options: ProjectOptions): ProjectFile[] {
  const files: ProjectFile[] = [];

  // Root files
  files.push({
    path: 'package.json',
    content: generatePackageJson(options),
  });
  files.push({
    path: 'tsconfig.json',
    content: generateTsConfig(),
  });
  files.push({
    path: 'tsconfig.node.json',
    content: generateTsConfigNode(),
  });
  files.push({
    path: 'vite.config.ts',
    content: generateViteConfig(),
  });
  files.push({
    path: 'tailwind.config.js',
    content: generateTailwindConfig(),
  });
  files.push({
    path: 'postcss.config.js',
    content: generatePostCssConfig(),
  });
  files.push({
    path: 'index.html',
    content: generateIndexHtml(options),
  });
  files.push({
    path: 'public/favicon.svg',
    content: generateFaviconSvg(options),
  });

  // Source files
  files.push({
    path: 'src/main.tsx',
    content: generateMainTsx(options),
  });
  files.push({
    path: 'src/App.tsx',
    content: generateAppTsx(options),
  });
  files.push({
    path: 'src/index.css',
    content: generateIndexCss(),
  });
  files.push({
    path: 'src/utils.ts',
    content: generateUtilsTs(),
  });

  // Add more files based on project options

  return files;
}

/**
 * Generates a project based on the specified options
 */
export function generateProject(options: ProjectOptions): ProjectFile[] {
  const mergedOptions = { ...DEFAULT_PROJECT_OPTIONS, ...options };

  // Generate the project based on the framework
  switch (mergedOptions.framework) {
    case ProjectFramework.REACT_VITE:
      return generateReactViteProject(mergedOptions);
    // Add more frameworks here
    default:
      return generateReactViteProject(mergedOptions);
  }
}
