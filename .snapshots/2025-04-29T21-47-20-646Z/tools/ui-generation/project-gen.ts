// Auto-generated safe fallback for project-gen

export function activate() {
    console.log("[TOOL] project-gen activated (passive mode)");
}

export function onFileWrite() { /* no-op */ }
export function onSessionStart() { /* no-op */ }
export function onCommand() { /* no-op */ }
/**
 * Project Generator
 * 
 * Generates entire UI projects with multiple pages and styling
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { z } from 'zod';

/**
 * Schema for project generation
 */
export const GenerateProjectSchema = z.object({
  name: z.string(),
  framework: z.enum(['react', 'vue', 'angular', 'svelte', 'solid', 'html']).default('react'),
  styling: z.enum(['css', 'scss', 'less', 'styled-components', 'emotion', 'tailwind', 'none']).default('css'),
  typescript: z.boolean().default(true),
  responsive: z.boolean().default(true),
  outputDir: z.string().optional(),
  description: z.string().optional(),
  pages: z.array(z.object({
    name: z.string(),
    sections: z.array(z.string()).optional(),
    path: z.string().optional(),
    layout: z.enum(['default', 'fullwidth', 'sidebar', 'dashboard', 'landing', 'custom']).optional().default('default'),
    isIndex: z.boolean().optional().default(false)
  })),
  components: z.array(z.object({
    name: z.string(),
    type: z.enum(['functional', 'class', 'hook']).optional().default('functional'),
    features: z.array(z.string()).optional()
  })).optional(),
  routing: z.enum(['react-router', 'vue-router', 'angular-router', 'svelte-router', 'none']).optional(),
  stateManagement: z.enum(['redux', 'mobx', 'context', 'vuex', 'pinia', 'ngrx', 'zustand', 'recoil', 'jotai', 'none']).optional().default('none'),
  theme: z.object({
    primaryColor: z.string().optional(),
    secondaryColor: z.string().optional(),
    fontFamily: z.string().optional(),
    darkMode: z.boolean().optional()
  }).optional(),
  features: z.array(z.enum([
    'authentication', 'authorization', 'api-integration', 'form-handling',
    'internationalization', 'seo', 'analytics', 'testing', 'pwa',
    'responsive', 'accessibility', 'dark-mode', 'animations'
  ])).optional(),
  dependencies: z.array(z.string()).optional(),
  devDependencies: z.array(z.string()).optional()
});

/**
 * Options Interface
 */
interface ProjectOptions extends z.infer<typeof GenerateProjectSchema> {}

/**
 * Format to PascalCase
 */
function formatComponentName(name: string): string {
  return name
    .split(/[-_\s]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

/**
 * Format to kebab-case
 */
function toKebabCase(name: string): string {
  return name
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase();
}

/**
 * Main generator for React
 */
export function generateReactProject(options: ProjectOptions): Map<string, string> {
  const {
    name,
    styling,
    typescript,
    responsive,
    outputDir,
    description,
    pages,
    components = [],
    routing,
    stateManagement,
    theme,
    features = [],
    dependencies: customDependencies = [],
    devDependencies: customDevDependencies = []
  } = options;

  const projectName = toKebabCase(name);
  const hasRouting = routing === 'react-router';
  const hasStateManagement = stateManagement && stateManagement !== 'none';
  const hasTypescript = typescript;
  const fileExtension = hasTypescript ? 'tsx' : 'jsx';
  const styleExtension = styling === 'scss' ? 'scss' : styling === 'less' ? 'less' : 'css';

  const projectFiles = new Map<string, string>();

  /** Example minimal project structure */
  projectFiles.set('package.json', JSON.stringify({
    name: projectName,
    version: '0.1.0',
    private: true,
    description: description || '',
    scripts: {
      dev: "vite",
      build: "vite build",
      preview: "vite preview"
    },
    dependencies: {
      react: "^18.2.0",
      "react-dom": "^18.2.0",
      ...(hasRouting ? { "react-router-dom": "^6.12.0" } : {}),
      ...(hasStateManagement ? { "zustand": "^4.3.8" } : {}) // Defaulting to Zustand if needed
    },
    devDependencies: {
      vite: "^4.3.9",
      ...(hasTypescript ? { typescript: "^5.0.4", "@types/react": "^18.2.0", "@types/react-dom": "^18.2.0" } : {})
    }
  }, null, 2));

  projectFiles.set(`src/main.${fileExtension}`, `
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
${styling !== 'none' ? `import './index.${styleExtension}';` : ''}

ReactDOM.createRoot(document.getElementById('root')${hasTypescript ? ' as HTMLElement' : ''}).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`.trim());

  projectFiles.set(`src/App.${fileExtension}`, `
import React from 'react';

const App${hasTypescript ? ': React.FC' : ''} = () => {
  return (
    <div className="App">
      <h1>Hello ${name}</h1>
    </div>
  );
};

export default App;
`.trim());

  projectFiles.set('index.html', `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${name}</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.${fileExtension}"></script>
</body>
</html>
`.trim());

  return projectFiles;
}

