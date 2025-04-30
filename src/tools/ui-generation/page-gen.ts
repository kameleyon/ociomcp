// Auto-generated safe fallback for page-gen

export function activate() {
    console.log("[TOOL] page-gen activated (passive mode)");
}

export function onFileWrite(filePath: string, content: string) {
  console.log(`[TOOL] Page generator processing file: ${filePath}`);
  
  // Check if the file is a page file
  const isPageFile = filePath.includes('page') || 
                     filePath.includes('pages/') || 
                     filePath.endsWith('.page.tsx') || 
                     filePath.endsWith('.page.jsx') || 
                     filePath.endsWith('.page.vue') || 
                     filePath.endsWith('.page.svelte') || 
                     filePath.endsWith('.html');
  
  if (isPageFile) {
    console.log(`[TOOL] Detected change in page file: ${filePath}`);
    // In a real implementation, we might analyze the page structure and provide suggestions
    analyzePageFile(filePath, content);
  }
}

export function onSessionStart(sessionId: string) {
  console.log(`[TOOL] Page generator initialized for session: ${sessionId}`);
  
  // Check for existing page files in the project
  setTimeout(() => {
    console.log('[TOOL] Checking for existing page files...');
    checkExistingPageFiles();
  }, 3000); // Delay to ensure project files are loaded
}

export function onCommand(command: string, args: any[]) {
  if (command === 'generate-page') {
    console.log('[TOOL] Generating page...');
    
    const options = args[0];
    
    return handleGeneratePage(options);
  } else if (command === 'list-page-templates') {
    console.log('[TOOL] Listing page templates...');
    
    return handleListPageTemplates();
  } else if (command === 'get-page-sections') {
    console.log('[TOOL] Getting page sections...');
    
    const pageType = args[0];
    
    return handleGetPageSections(pageType);
  } else if (command === 'analyze-page') {
    console.log('[TOOL] Analyzing page...');
    
    const filePath = args[0];
    
    return handleAnalyzePage(filePath);
  }
  
  return null;
}

/**
 * Analyzes a page file and provides suggestions
 */
function analyzePageFile(filePath: string, content: string): void {
  console.log(`[TOOL] Analyzing page file: ${filePath}`);
  
  try {
    // Check for common page sections
    const hasSections = {
      header: content.includes('<header') || content.includes('<Header') || content.includes('header'),
      footer: content.includes('<footer') || content.includes('<Footer') || content.includes('footer'),
      navigation: content.includes('<nav') || content.includes('<Nav') || content.includes('navigation'),
      hero: content.includes('<hero') || content.includes('<Hero') || content.includes('hero'),
      features: content.includes('<features') || content.includes('<Features') || content.includes('features'),
      cta: content.includes('<cta') || content.includes('<CTA') || content.includes('cta'),
    };
    
    // Log findings
    console.log('[TOOL] Page analysis results:');
    Object.entries(hasSections).forEach(([section, exists]) => {
      console.log(`- ${section}: ${exists ? 'Found' : 'Not found'}`);
    });
    
    // Check for SEO meta tags
    const hasSeoTags = content.includes('<meta name="description"') || 
                       content.includes('<meta name="keywords"') || 
                       content.includes('<meta property="og:') || 
                       content.includes('<Helmet');
    
    console.log(`- SEO tags: ${hasSeoTags ? 'Found' : 'Not found'}`);
    
    // Check for responsive design
    const hasResponsiveDesign = content.includes('@media') || 
                               content.includes('media query') || 
                               content.includes('responsive');
    
    console.log(`- Responsive design: ${hasResponsiveDesign ? 'Found' : 'Not found'}`);
    
    // Provide suggestions
    if (!hasSections.header) {
      console.log('[TOOL] Suggestion: Consider adding a header section for better navigation');
    }
    
    if (!hasSections.footer) {
      console.log('[TOOL] Suggestion: Consider adding a footer section for contact information and links');
    }
    
    if (!hasSeoTags) {
      console.log('[TOOL] Suggestion: Add SEO meta tags to improve search engine visibility');
    }
    
    if (!hasResponsiveDesign) {
      console.log('[TOOL] Suggestion: Implement responsive design for better mobile experience');
    }
  } catch (error) {
    console.error(`[TOOL] Error analyzing page file: ${error}`);
  }
}

/**
 * Checks for existing page files in the project
 */
function checkExistingPageFiles(): void {
  console.log('[TOOL] Checking for existing page files...');
  
  // This is a placeholder - in a real implementation, this would scan the filesystem
  // For now, we'll just log a message
  console.log('[TOOL] Recommendation: Use the "generate-page" command to create new pages');
  console.log('[TOOL] Common page generation tasks:');
  console.log('- Creating landing pages');
  console.log('- Creating dashboard pages');
  console.log('- Creating authentication pages');
  console.log('- Creating profile pages');
  console.log('- Creating error pages');
}

/**
 * Handles the generate-page command
 */
async function handleGeneratePage(options: any): Promise<any> {
  console.log('[TOOL] Handling generate-page command with options:', options);
  
  try {
    // Validate options
    if (!options || !options.name) {
      return {
        success: false,
        message: 'Missing required option: name'
      };
    }
    
    // Set default options
    const pageOptions: PageOptions = {
      name: options.name,
      framework: options.framework || 'react',
      sections: options.sections || ['header', 'hero', 'features', 'footer'],
      styling: options.styling || 'css',
      typescript: options.typescript !== undefined ? options.typescript : true,
      responsive: options.responsive !== undefined ? options.responsive : true,
      outputDir: options.outputDir,
      description: options.description,
      seo: options.seo,
      layout: options.layout || 'default',
      theme: options.theme,
      customSections: options.customSections
    };
    
    // Generate page content based on framework
    let pageContent = '';
    
    switch (pageOptions.framework) {
      case 'react':
        pageContent = generateReactPage(pageOptions);
        break;
      case 'vue':
        pageContent = generateVuePage(pageOptions);
        break;
      case 'html':
        pageContent = generateHtmlPage(pageOptions);
        break;
      default:
        return {
          success: false,
          message: `Unsupported framework: ${pageOptions.framework}`
        };
    }
    
    // Return the generated page content
    return {
      success: true,
      message: `Page ${pageOptions.name} generated successfully`,
      content: pageContent
    };
  } catch (error) {
    return {
      success: false,
      message: `Error generating page: ${error}`
    };
  }
}

/**
 * Handles the list-page-templates command
 */
async function handleListPageTemplates(): Promise<any> {
  console.log('[TOOL] Handling list-page-templates command');
  
  // Return available page templates
  return {
    success: true,
    templates: [
      {
        type: PageType.LANDING,
        name: 'Landing Page',
        description: 'A landing page for marketing and conversion',
        sections: ['header', 'hero', 'features', 'testimonials', 'pricing', 'cta', 'footer']
      },
      {
        type: PageType.DASHBOARD,
        name: 'Dashboard Page',
        description: 'A dashboard page for displaying data and analytics',
        sections: ['header', 'sidebar', 'stats', 'charts', 'tables', 'footer']
      },
      {
        type: PageType.AUTH,
        name: 'Authentication Page',
        description: 'A page for user login and registration',
        sections: ['header', 'auth-form', 'footer']
      },
      {
        type: PageType.PROFILE,
        name: 'Profile Page',
        description: 'A user profile page',
        sections: ['header', 'profile-header', 'profile-details', 'footer']
      },
      {
        type: PageType.SETTINGS,
        name: 'Settings Page',
        description: 'A page for user settings',
        sections: ['header', 'sidebar', 'settings-form', 'footer']
      },
      {
        type: PageType.DOCUMENTATION,
        name: 'Documentation Page',
        description: 'A documentation page with sidebar navigation',
        sections: ['header', 'sidebar', 'content', 'footer']
      },
      {
        type: PageType.BLOG,
        name: 'Blog Page',
        description: 'A blog page with articles',
        sections: ['header', 'blog-header', 'blog-posts', 'sidebar', 'footer']
      },
      {
        type: PageType.PRODUCT,
        name: 'Product Page',
        description: 'A product page with details and images',
        sections: ['header', 'product-gallery', 'product-details', 'related-products', 'footer']
      },
      {
        type: PageType.CHECKOUT,
        name: 'Checkout Page',
        description: 'A checkout page for e-commerce',
        sections: ['header', 'checkout-form', 'order-summary', 'footer']
      },
      {
        type: PageType.ERROR,
        name: 'Error Page',
        description: 'An error page (404, 500, etc.)',
        sections: ['header', 'error-message', 'footer']
      }
    ]
  };
}

/**
 * Handles the get-page-sections command
 */
async function handleGetPageSections(pageType: string): Promise<any> {
  console.log(`[TOOL] Handling get-page-sections command for page type: ${pageType}`);
  
  // Return sections for the specified page type
  switch (pageType) {
    case PageType.LANDING:
      return {
        success: true,
        sections: ['header', 'hero', 'features', 'testimonials', 'pricing', 'cta', 'footer']
      };
    case PageType.DASHBOARD:
      return {
        success: true,
        sections: ['header', 'sidebar', 'stats', 'charts', 'tables', 'footer']
      };
    case PageType.AUTH:
      return {
        success: true,
        sections: ['header', 'auth-form', 'footer']
      };
    case PageType.PROFILE:
      return {
        success: true,
        sections: ['header', 'profile-header', 'profile-details', 'footer']
      };
    case PageType.SETTINGS:
      return {
        success: true,
        sections: ['header', 'sidebar', 'settings-form', 'footer']
      };
    case PageType.DOCUMENTATION:
      return {
        success: true,
        sections: ['header', 'sidebar', 'content', 'footer']
      };
    case PageType.BLOG:
      return {
        success: true,
        sections: ['header', 'blog-header', 'blog-posts', 'sidebar', 'footer']
      };
    case PageType.PRODUCT:
      return {
        success: true,
        sections: ['header', 'product-gallery', 'product-details', 'related-products', 'footer']
      };
    case PageType.CHECKOUT:
      return {
        success: true,
        sections: ['header', 'checkout-form', 'order-summary', 'footer']
      };
    case PageType.ERROR:
      return {
        success: true,
        sections: ['header', 'error-message', 'footer']
      };
    default:
      return {
        success: false,
        message: `Unknown page type: ${pageType}`
      };
  }
}

/**
 * Handles the analyze-page command
 */
async function handleAnalyzePage(filePath: string): Promise<any> {
  console.log(`[TOOL] Handling analyze-page command for file: ${filePath}`);
  
  try {
    // Read the file content
    const content = await fs.readFile(filePath, 'utf8');
    
    // Analyze the page
    const analysis = {
      sections: {
        header: content.includes('<header') || content.includes('<Header') || content.includes('header'),
        footer: content.includes('<footer') || content.includes('<Footer') || content.includes('footer'),
        navigation: content.includes('<nav') || content.includes('<Nav') || content.includes('navigation'),
        hero: content.includes('<hero') || content.includes('<Hero') || content.includes('hero'),
        features: content.includes('<features') || content.includes('<Features') || content.includes('features'),
        cta: content.includes('<cta') || content.includes('<CTA') || content.includes('cta'),
      },
      seo: {
        hasMeta: content.includes('<meta name="description"') || 
                content.includes('<meta name="keywords"') || 
                content.includes('<meta property="og:') || 
                content.includes('<Helmet'),
        hasTitle: content.includes('<title>') || content.includes('<Title>'),
        hasCanonical: content.includes('rel="canonical"')
      },
      responsive: content.includes('@media') || 
                 content.includes('media query') || 
                 content.includes('responsive'),
      accessibility: {
        hasAltText: content.includes('alt='),
        hasAriaLabels: content.includes('aria-'),
        hasSemanticTags: content.includes('<header') || 
                         content.includes('<footer') || 
                         content.includes('<nav') || 
                         content.includes('<main') || 
                         content.includes('<section') || 
                         content.includes('<article')
      }
    };
    
    // Generate suggestions
    const suggestions = [];
    
    if (!analysis.sections.header) {
      suggestions.push('Consider adding a header section for better navigation');
    }
    
    if (!analysis.sections.footer) {
      suggestions.push('Consider adding a footer section for contact information and links');
    }
    
    if (!analysis.seo.hasMeta) {
      suggestions.push('Add SEO meta tags to improve search engine visibility');
    }
    
    if (!analysis.seo.hasTitle) {
      suggestions.push('Add a title tag for better SEO');
    }
    
    if (!analysis.seo.hasCanonical) {
      suggestions.push('Add a canonical link to prevent duplicate content issues');
    }
    
    if (!analysis.responsive) {
      suggestions.push('Implement responsive design for better mobile experience');
    }
    
    if (!analysis.accessibility.hasAltText) {
      suggestions.push('Add alt text to images for better accessibility');
    }
    
    if (!analysis.accessibility.hasAriaLabels) {
      suggestions.push('Add ARIA labels to improve accessibility');
    }
    
    if (!analysis.accessibility.hasSemanticTags) {
      suggestions.push('Use semantic HTML tags for better accessibility and SEO');
    }
    
    return {
      success: true,
      analysis,
      suggestions
    };
  } catch (error) {
    return {
      success: false,
      message: `Error analyzing page: ${error}`
    };
  }
}
/**
 * Page Generator
 * 
 * Creates complete web pages with various sections
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { z } from 'zod';

/**
 * Schema for PageGen
 */
/**
 * Page type enum
 */
export enum PageType {
  LANDING = 'landing',
  DASHBOARD = 'dashboard',
  AUTH = 'auth',
  PROFILE = 'profile',
  SETTINGS = 'settings',
  DOCUMENTATION = 'documentation',
  BLOG = 'blog',
  PRODUCT = 'product',
  CHECKOUT = 'checkout',
  ERROR = 'error'
}

export const GeneratePageSchema = z.object({
  name: z.string(),
  framework: z.enum(['react', 'vue', 'angular', 'svelte', 'solid', 'html']).default('react'),
  sections: z.array(z.enum([
    'header', 'footer', 'navigation', 'hero', 'features', 'testimonials',
    'pricing', 'contact', 'about', 'faq', 'cta', 'gallery', 'blog',
    'products', 'services', 'team', 'stats', 'newsletter', 'login',
    'signup', 'dashboard', 'settings', 'profile', 'search', 'cart',
    'checkout', 'confirmation', 'error', '404', 'custom'
  ])).default(['header', 'hero', 'footer']),
  styling: z.enum(['css', 'scss', 'less', 'styled-components', 'emotion', 'tailwind', 'none']).default('css'),
  typescript: z.boolean().default(true),
  responsive: z.boolean().default(true),
  outputDir: z.string().optional(),
  description: z.string().optional(),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    ogImage: z.string().optional(),
    canonical: z.string().optional()
  }).optional(),
  type: z.nativeEnum(PageType), // Use nativeEnum for Zod compatibility
  layout: z.enum(['default', 'fullwidth', 'sidebar', 'dashboard', 'landing', 'custom']).default('default'),
  theme: z.object({
    primaryColor: z.string().optional(),
    secondaryColor: z.string().optional(),
    fontFamily: z.string().optional(),
    darkMode: z.boolean().optional()
  }).optional(),
  customSections: z.array(z.object({
    name: z.string(),
    content: z.string().optional()
  })).optional()
});

/**
 * Page section interface
 */
export interface PageSection {
  name: string;
  component: string;
  imports?: string[];
  props?: Record<string, any>;
}

/**
 * Page options interface
 */
export interface PageOptions {
  name: string;
  framework: 'react' | 'vue' | 'angular' | 'svelte' | 'solid' | 'html';
  sections: string[];
  styling: 'css' | 'scss' | 'less' | 'styled-components' | 'emotion' | 'tailwind' | 'none';
  typescript: boolean;
  responsive: boolean;
  outputDir?: string;
  description?: string;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
    ogImage?: string;
    canonical?: string;
  };
  layout: 'default' | 'fullwidth' | 'sidebar' | 'dashboard' | 'landing' | 'custom' | 'topnav' | 'none';
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
    fontFamily?: string;
    darkMode?: boolean;
  };
  customSections?: Array<{
    name: string;
    content?: string;
  }>;
}

/**
 * Format component name to PascalCase
 * 
 * @param name Component name
 * @returns Formatted component name
 */
function formatComponentName(name: string): string {
  return name
    .split(/[-_\s]+/)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('');
}

/**
 * Convert string to kebab-case
 * 
 * @param str String to convert
 * @returns Kebab-case string
 */
function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

/**
 * Generate React page
 * 
 * @param options Page options
 * @returns Generated page content
 */
function generateReactPage(options: PageOptions): string {
  const {
    name,
    sections,
    styling,
    typescript,
    responsive,
    description,
    seo,
    layout,
    theme
  } = options;

  const pageName = formatComponentName(name);
  const hasSeo = !!seo;
  const hasTheme = !!theme;
  const hasHeader = sections.includes('header');
  const hasFooter = sections.includes('footer');
  const hasNavigation = sections.includes('navigation');
  
  // Generate imports
  let imports = `import React${typescript ? ', { FC }' : ''} from 'react';\n`;
  
  // Add styling imports
  if (styling === 'styled-components') {
    imports += `import styled from 'styled-components';\n`;
  } else if (styling === 'emotion') {
    imports += `import { css } from '@emotion/react';\n`;
    imports += `import styled from '@emotion/styled';\n`;
  } else if (styling !== 'none') {
    imports += `import './${pageName}.${styling}';\n`;
  }
  
  // Add section component imports
  if (hasHeader) {
    imports += `import Header from '../components/Header';\n`;
  }
  
  if (hasFooter) {
    imports += `import Footer from '../components/Footer';\n`;
  }
  
  if (hasNavigation) {
    imports += `import Navigation from '../components/Navigation';\n`;
  }
  
  // Add other section imports
  const sectionComponents = mapSectionsToComponents(sections);
  sectionComponents.forEach(section => {
    if (section.imports) {
      section.imports.forEach(importStatement => {
        imports += `${importStatement}\n`;
      });
    } else if (!['header', 'footer', 'navigation'].includes(section.name)) {
      imports += `import ${section.component} from '../components/${section.component}';\n`;
    }
  });
  
  // Add SEO imports if needed
  if (hasSeo) {
    imports += `import { Helmet } from 'react-helmet';\n`;
  }
  
  // Add theme imports if needed
  if (hasTheme) {
    imports += `import { ThemeProvider } from '../theme';\n`;
  }
  
  imports += '\n';
  
  // Generate page component
  let page = '';
  
  // Add description comment
  if (description) {
    page += `/**\n * ${description}\n */\n`;
  }
  
  // Add component declaration
  if (typescript) {
    page += `const ${pageName}: FC = () => {\n`;
  } else {
    page += `const ${pageName} = () => {\n`;
  }
  
  // Add return statement
  page += `  return (\n`;
  
  // Add SEO if needed
  if (hasSeo) {
    page += `    <>\n`;
    page += `      <Helmet>\n`;
    
    if (seo?.title) {
      page += `        <title>${seo.title}</title>\n`;
    }
    
    if (seo?.description) {
      page += `        <meta name="description" content="${seo.description}" />\n`;
    }
    
    if (seo?.keywords && seo.keywords.length > 0) {
      page += `        <meta name="keywords" content="${seo.keywords.join(', ')}" />\n`;
    }
    
    if (seo?.ogImage) {
      page += `        <meta property="og:image" content="${seo.ogImage}" />\n`;
    }
    
    if (seo?.canonical) {
      page += `        <link rel="canonical" href="${seo.canonical}" />\n`;
    }
    
    page += `      </Helmet>\n\n`;
  }
  
  // Add theme provider if needed
  if (hasTheme) {
    const themeValues = {
      primaryColor: theme?.primaryColor || '#007bff',
      secondaryColor: theme?.secondaryColor || '#6c757d',
      fontFamily: theme?.fontFamily || 'Arial, sans-serif',
      darkMode: theme?.darkMode || false
    };
    
    page += `      <ThemeProvider theme={${JSON.stringify(themeValues, null, 6).replace(/\n/g, '\n      ')}>\n`;
  }
  
  // Add page container based on layout
  switch (layout) {
    case 'fullwidth':
      page += `      <div className="${toKebabCase(pageName)}-page fullwidth-layout">\n`;
      break;
    case 'sidebar':
      page += `      <div className="${toKebabCase(pageName)}-page sidebar-layout">\n`;
      page += `        <aside className="sidebar">\n`;
      page += `          {/* Sidebar content */}\n`;
      page += `        </aside>\n`;
      page += `        <main className="main-content">\n`;
      break;
    case 'dashboard':
      page += `      <div className="${toKebabCase(pageName)}-page dashboard-layout">\n`;
      page += `        <aside className="sidebar">\n`;
      page += `          {/* Dashboard navigation */}\n`;
      page += `        </aside>\n`;
      page += `        <div className="dashboard-content">\n`;
      page += `          <div className="dashboard-header">\n`;
      page += `            {/* Dashboard header */}\n`;
      page += `          </div>\n`;
      page += `          <main className="main-content">\n`;
      break;
    case 'landing':
      page += `      <div className="${toKebabCase(pageName)}-page landing-layout">\n`;
      break;
    default:
      page += `      <div className="${toKebabCase(pageName)}-page">\n`;
      break;
  }
  
  // Add sections
  sectionComponents.forEach(section => {
    const props = section.props ? ` ${Object.entries(section.props).map(([key, value]) => `${key}={${JSON.stringify(value)}}`).join(' ')}` : '';
    
    if (section.name === 'header') {
      page += `        <Header${props} />\n`;
    } else if (section.name === 'footer') {
      page += `        <Footer${props} />\n`;
    } else if (section.name === 'navigation') {
      page += `        <Navigation${props} />\n`;
    } else {
      page += `        <${section.component}${props} />\n`;
    }
  });
  
  // Close layout containers
  switch (layout) {
    case 'sidebar':
      page += `        </main>\n`;
      page += `      </div>\n`;
      break;
    case 'dashboard':
      page += `          </main>\n`;
      page += `        </div>\n`;
      page += `      </div>\n`;
      break;
    default:
      page += `      </div>\n`;
      break;
  }
  
  // Close theme provider if needed
  if (hasTheme) {
    page += `      </ThemeProvider>\n`;
  }
  
  // Close SEO wrapper if needed
  if (hasSeo) {
    page += `    </>\n`;
  }
  
  page += `  );\n`;
  page += `};\n\n`;
  
  // Add export
  page += `export default ${pageName};\n`;
  
  return imports + page;
}

/**
 * Generate Vue page
 * 
 * @param options Page options
 * @returns Generated page content
 */
function generateVuePage(options: PageOptions): string {
  const {
    name,
    sections,
    styling,
    typescript,
    responsive,
    description,
    seo,
    layout,
    theme
  } = options;

  const pageName = formatComponentName(name);
  const hasHeader = sections.includes('header');
  const hasFooter = sections.includes('footer');
  const hasNavigation = sections.includes('navigation');
  
  let page = '';
  
  // Add template section
  page += `<template>\n`;
  
  // Add page container based on layout
  switch (layout) {
    case 'fullwidth':
      page += `  <div class="${toKebabCase(pageName)}-page fullwidth-layout">\n`;
      break;
    case 'sidebar':
      page += `  <div class="${toKebabCase(pageName)}-page sidebar-layout">\n`;
      page += `    <aside class="sidebar">\n`;
      page += `      <!-- Sidebar content -->\n`;
      page += `    </aside>\n`;
      page += `    <main class="main-content">\n`;
      break;
    case 'dashboard':
      page += `  <div class="${toKebabCase(pageName)}-page dashboard-layout">\n`;
      page += `    <aside class="sidebar">\n`;
      page += `      <!-- Dashboard navigation -->\n`;
      page += `    </aside>\n`;
      page += `    <div class="dashboard-content">\n`;
      page += `      <div class="dashboard-header">\n`;
      page += `        <!-- Dashboard header -->\n`;
      page += `      </div>\n`;
      page += `      <main class="main-content">\n`;
      break;
    case 'landing':
      page += `  <div class="${toKebabCase(pageName)}-page landing-layout">\n`;
      break;
    default:
      page += `  <div class="${toKebabCase(pageName)}-page">\n`;
      break;
  }
  
  // Add sections
  const sectionComponents = mapSectionsToComponents(sections);
  sectionComponents.forEach(section => {
    const props = section.props ? ` ${Object.entries(section.props).map(([key, value]) => `:${key}="${JSON.stringify(value)}"`).join(' ')}` : '';
    
    if (section.name === 'header') {
      page += `    <Header${props} />\n`;
    } else if (section.name === 'footer') {
      page += `    <Footer${props} />\n`;
    } else if (section.name === 'navigation') {
      page += `    <Navigation${props} />\n`;
    } else {
      page += `    <${section.component}${props} />\n`;
    }
  });
  
  // Close layout containers
  switch (layout) {
    case 'sidebar':
      page += `    </main>\n`;
      page += `  </div>\n`;
      break;
    case 'dashboard':
      page += `      </main>\n`;
      page += `    </div>\n`;
      page += `  </div>\n`;
      break;
    default:
      page += `  </div>\n`;
      break;
  }
  
  page += `</template>\n\n`;
  
  // Add script section
  page += `<script${typescript ? ' lang="ts"' : ''}>\n`;
  
  // Add imports
  if (hasHeader) {
    page += `import Header from '../components/Header.vue';\n`;
  }
  
  if (hasFooter) {
    page += `import Footer from '../components/Footer.vue';\n`;
  }
  
  if (hasNavigation) {
    page += `import Navigation from '../components/Navigation.vue';\n`;
  }
  
  // Add other section imports
  sectionComponents.forEach(section => {
    if (!['header', 'footer', 'navigation'].includes(section.name)) {
      page += `import ${section.component} from '../components/${section.component}.vue';\n`;
    }
  });
  
  page += `\n`;
  
  // Add component definition
  if (typescript) {
    page += `import { defineComponent } from 'vue';\n\n`;
    page += `export default defineComponent({\n`;
  } else {
    page += `export default {\n`;
  }
  
  // Add component name
  page += `  name: '${pageName}',\n\n`;
  
  // Add components
  page += `  components: {\n`;
  
  if (hasHeader) {
    page += `    Header,\n`;
  }
  
  if (hasFooter) {
    page += `    Footer,\n`;
  }
  
  if (hasNavigation) {
    page += `    Navigation,\n`;
  }
  
  // Add other section components
  sectionComponents.forEach(section => {
    if (!['header', 'footer', 'navigation'].includes(section.name)) {
      page += `    ${section.component},\n`;
    }
  });
  
  page += `  },\n\n`;
  
  // Add meta information for SEO
  if (seo) {
    page += `  metaInfo() {\n`;
    page += `    return {\n`;
    
    if (seo.title) {
      page += `      title: '${seo.title}',\n`;
    }
    
    if (seo.description || seo.keywords || seo.ogImage) {
      page += `      meta: [\n`;
      
      if (seo.description) {
        page += `        { name: 'description', content: '${seo.description}' },\n`;
      }
      
      if (seo.keywords && seo.keywords.length > 0) {
        page += `        { name: 'keywords', content: '${seo.keywords.join(', ')}' },\n`;
      }
      
      if (seo.ogImage) {
        page += `        { property: 'og:image', content: '${seo.ogImage}' },\n`;
      }
      
      page += `      ],\n`;
    }
    
    if (seo.canonical) {
      page += `      link: [\n`;
      page += `        { rel: 'canonical', href: '${seo.canonical}' },\n`;
      page += `      ],\n`;
    }
    
    page += `    };\n`;
    page += `  },\n`;
  }
  
  // Add data
  page += `  data() {\n`;
  page += `    return {\n`;
  page += `      // Add your data here\n`;
  page += `    };\n`;
  page += `  },\n`;
  
  // Close component definition
  page += typescript ? `});\n` : `};\n`;
  page += `</script>\n\n`;
  
  // Add style section
  if (styling !== 'none') {
    page += `<style${styling !== 'css' ? ` lang="${styling}"` : ''}>\n`;
    page += `.${toKebabCase(pageName)}-page {\n`;
    page += `  display: flex;\n`;
    page += `  flex-direction: column;\n`;
    page += `  min-height: 100vh;\n`;
    
    if (theme) {
      if (theme.primaryColor) {
        page += `  --primary-color: ${theme.primaryColor};\n`;
      }
      
      if (theme.secondaryColor) {
        page += `  --secondary-color: ${theme.secondaryColor};\n`;
      }
      
      if (theme.fontFamily) {
        page += `  font-family: ${theme.fontFamily};\n`;
      }
    }
    
    page += `}\n`;
    
    // Add responsive styles
    if (responsive) {
      page += `\n/* Responsive styles */\n`;
      page += `@media (max-width: 768px) {\n`;
      page += `  .${toKebabCase(pageName)}-page {\n`;
      page += `    /* Mobile styles */\n`;
      page += `  }\n`;
      page += `}\n`;
    }
    
    // Add layout styles
    switch (layout) {
      case 'sidebar':
        page += `\n.sidebar-layout {\n`;
        page += `  display: grid;\n`;
        page += `  grid-template-columns: 250px 1fr;\n`;
        page += `  grid-gap: 1rem;\n`;
        page += `}\n\n`;
        
        page += `.sidebar {\n`;
        page += `  background-color: #f8f9fa;\n`;
        page += `  padding: 1rem;\n`;
        page += `}\n\n`;
        
        page += `.main-content {\n`;
        page += `  padding: 1rem;\n`;
        page += `}\n`;
        break;
      
      case 'dashboard':
        page += `\n.dashboard-layout {\n`;
        page += `  display: grid;\n`;
        page += `  grid-template-columns: 250px 1fr;\n`;
        page += `  grid-gap: 0;\n`;
        page += `}\n\n`;
        
        page += `.sidebar {\n`;
        page += `  background-color: #212529;\n`;
        page += `  color: white;\n`;
        page += `  padding: 1rem;\n`;
        page += `}\n\n`;
        
        page += `.dashboard-content {\n`;
        page += `  display: flex;\n`;
        page += `  flex-direction: column;\n`;
        page += `}\n\n`;
        
        page += `.dashboard-header {\n`;
        page += `  background-color: white;\n`;
        page += `  border-bottom: 1px solid #dee2e6;\n`;
        page += `  padding: 1rem;\n`;
        page += `}\n\n`;
        
        page += `.main-content {\n`;
        page += `  padding: 1rem;\n`;
        page += `  flex: 1;\n`;
        page += `}\n`;
        break;
    }
    
    page += `</style>\n`;
  }
  
  return page;
}

/**
 * Generate HTML page
 * 
 * @param options Page options
 * @returns Generated page content
 */
function generateHtmlPage(options: PageOptions): string {
  const {
    name,
    sections,
    styling,
    responsive,
    description,
    seo,
    layout,
    theme
  } = options;

  const pageName = toKebabCase(name);
  const hasHeader = sections.includes('header');
  const hasFooter = sections.includes('footer');
  const hasNavigation = sections.includes('navigation');
  
  let page = `<!DOCTYPE html>\n`;
  page += `<html lang="en">\n`;
  page += `<head>\n`;
  page += `  <meta charset="UTF-8">\n`;
  page += `  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n`;
  
  // Add SEO meta tags
  if (seo) {
    if (seo.title) {
      page += `  <title>${seo.title}</title>\n`;
    } else {
      page += `  <title>${formatComponentName(name)}</title>\n`;
    }
    
    if (seo.description) {
      page += `  <meta name="description" content="${seo.description}">\n`;
    }
    
    if (seo.keywords && seo.keywords.length > 0) {
      page += `  <meta name="keywords" content="${seo.keywords.join(', ')}">\n`;
    }
    
    if (seo.ogImage) {
      page += `  <meta property="og:image" content="${seo.ogImage}">\n`;
    }
    
    if (seo.canonical) {
      page += `  <link rel="canonical" href="${seo.canonical}">\n`;
    }
  } else {
    page += `  <title>${formatComponentName(name)}</title>\n`;
  }
  
  // Add styling
  if (styling === 'css') {
    page += `  <link rel="stylesheet" href="${pageName}.css">\n`;
  } else if (styling === 'scss' || styling === 'less') {
    page += `  <link rel="stylesheet" href="${pageName}.css">\n`;
    page += `  <!-- Note: ${styling} files need to be compiled to CSS -->\n`;
  } else if (styling === 'tailwind') {
    page += `  <script src="https://cdn.tailwindcss.com"></script>\n`;
  }
  
  // Add inline styles for theme if needed
  if (theme && styling !== 'none') {
    page += `  <style>\n`;
    page += `    :root {\n`;
    
    if (theme.primaryColor) {
      page += `      --primary-color: ${theme.primaryColor};\n`;
    }
    
    if (theme.secondaryColor) {
      page += `      --secondary-color: ${theme.secondaryColor};\n`;
    }
    
    if (theme.fontFamily) {
      page += `      --font-family: ${theme.fontFamily};\n`;
      page += `      body { font-family: ${theme.fontFamily}; }\n`;
    }
    
    page += `    }\n`;
    
    if (theme.darkMode) {
      page += `    body { background-color: #121212; color: #f8f9fa; }\n`;
    }
    
    page += `  </style>\n`;
  }
  
  page += `</head>\n`;
  page += `<body>\n`;
  
  // Add page container based on layout
  switch (layout) {
    case 'fullwidth':
      page += `  <div class="${pageName}-page fullwidth-layout">\n`;
      break;
    case 'sidebar':
      page += `  <div class="${pageName}-page sidebar-layout">\n`;
      page += `    <aside class="sidebar">\n`;
      page += `      <!-- Sidebar content -->\n`;
      page += `    </aside>\n`;
      page += `    <main class="main-content">\n`;
      break;
    case 'dashboard':
      page += `  <div class="${pageName}-page dashboard-layout">\n`;
      page += `    <aside class="sidebar">\n`;
      page += `      <!-- Dashboard navigation -->\n`;
      page += `    </aside>\n`;
      page += `    <div class="dashboard-content">\n`;
      page += `      <div class="dashboard-header">\n`;
      page += `        <!-- Dashboard header -->\n`;
      page += `      </div>\n`;
      page += `      <main class="main-content">\n`;
      break;
    case 'landing':
      page += `  <div class="${pageName}-page landing-layout">\n`;
      break;
    default:
      page += `  <div class="${pageName}-page">\n`;
      break;
  }
  
  // Add sections
  const sectionComponents = getSectionComponents(sections);
  sectionComponents.forEach(section => {
    if (section.name === 'header') {
      page += `    <header>\n`;
      page += `      <!-- Header content -->\n`;
      page += `      <h1>${formatComponentName(name)}</h1>\n`;
      
      if (hasNavigation) {
        page += `      <nav>\n`;
        page += `        <ul>\n`;
        page += `          <li><a href="#">Home</a></li>\n`;
        page += `          <li><a href="#">About</a></li>\n`;
        page += `          <li><a href="#">Services</a></li>\n`;
        page += `          <li><a href="#">Contact</a></li>\n`;
        page += `        </ul>\n`;
        page += `      </nav>\n`;
      }
      
      page += `    </header>\n`;
    } else if (section.name === 'footer') {
      page += `    <footer>\n`;
      page += `      <!-- Footer content -->\n`;
      page += `      <p>&copy; ${new Date().getFullYear()} ${formatComponentName(name)}. All rights reserved.</p>\n`;
      page += `    </footer>\n`;
    } else if (section.name === 'navigation' && !hasHeader) {
      page += `    <nav>\n`;
      page += `      <ul>\n`;
      page += `        <li><a href="#">Home</a></li>\n`;
      page += `        <li><a href="#">About</a></li>\n`;
      page += `        <li><a href="#">Services</a></li>\n`;
      page += `        <li><a href="#">Contact</a></li>\n`;
      page += `      </ul>\n`;
      page += `    </nav>\n`;
    } else if (section.name === 'hero') {
      page += `    <section class="hero">\n`;
      page += `      <h1>Welcome to ${formatComponentName(name)}</h1>\n`;
      page += `      <p>Your hero message goes here</p>\n`;
      page += `      <button>Get Started</button>\n`;
      page += `    </section>\n`;
    } else if (section.name === 'features') {
      page += `    <section class="features">\n`;
      page += `      <h2>Features</h2>\n`;
      page += `      <div class="feature-grid">\n`;
      page += `        <div class="feature">\n`;
      page += `          <h3>Feature 1</h3>\n`;
      page += `          <p>Description of feature 1</p>\n`;
      page += `        </div>\n`;
      page += `        <div class="feature">\n`;
      page += `          <h3>Feature 2</h3>\n`;
      page += `          <p>Description of feature 2</p>\n`;
      page += `        </div>\n`;
      page += `        <div class="feature">\n`;
      page += `          <h3>Feature 3</h3>\n`;
      page += `          <p>Description of feature 3</p>\n`;
      page += `        </div>\n`;
      page += `      </div>\n`;
      page += `    </section>\n`;
    } else if (section.name === 'custom' && options.customSections) {
      const customSection = options.customSections.find(cs => cs.name === section.name);
      if (customSection && customSection.content) {
        page += `    <section class="custom-section">\n`;
        page += `      ${customSection.content}\n`;
        page += `    </section>\n`;
      } else {
        page += `    <section class="custom-section">\n`;
        page += `      <h2>Custom Section</h2>\n`;
        page += `      <p>This is a custom section. Replace with your content.</p>\n`;
        page += `    </section>\n`;
      }
    } else {
      page += `    <section class="${section.name}">\n`;
      page += `      <h2>${formatComponentName(section.name)}</h2>\n`;
      page += `      <p>Content for ${section.name} section</p>\n`;
      page += `    </section>\n`;
    }
  });
  
  // Close layout containers
  switch (layout) {
    case 'sidebar':
      page += `    </main>\n`;
      page += `    </div>\n`;
      break;
    case 'topnav':
      page += `    </main>\n`;
      page += `    </div>\n`;
      break;
    case 'none':
      page += `    </main>\n`;
      break;
    default:
      page += `    </main>\n`;
      break;
  }

  // Add footer if needed
  if (includeFooter(options)) {
    page += `\n  <footer>\n`;
    page += `    <div class="container">\n`;
    page += `      <p>&copy; ${new Date().getFullYear()} ${pageName} - All rights reserved</p>\n`;
    page += `    </div>\n`;
    page += `  </footer>\n`;
  }

  // Close HTML document
  page += `</body>\n</html>`;

  return page;
}
/**
 * Map sections to components
 * 
 * @param sections Array of section names
 * @returns Array of PageSection objects
 */
function mapSectionsToComponents(sections: string[]): PageSection[] {
  // Implementation maps sections to components
  const result: PageSection[] = [];
  
  sections.forEach(sectionName => {
    result.push({
      name: sectionName,
      component: formatComponentName(sectionName)
    });
  });
  
  return result;
}

/**
 * Get section components
 * 
 * @param sections Array of section names
 * @returns Array of PageSection objects
 */
function getSectionComponents(sections: string[]): PageSection[] {
  // Implementation gets components for sections
  return mapSectionsToComponents(sections);
}

/**
 * Include footer in page
 * 
 * @param options Page options
 * @returns Boolean indicating if footer should be included
 */
function includeFooter(options: PageOptions): boolean {
  // Implementation determines if a footer should be included
  return options.sections.includes('footer');
}
