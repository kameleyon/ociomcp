/**
 * UI Generation Module
 * 
 * This module provides functionality for generating UI components, pages, and projects
 * with various styles, layouts, and configurations.
 */

// Export all types and functions from component-templates.ts
export * from './component-templates.js';

// Export all types and functions from page-templates.ts
export * from './page-templates.js';

// Export all types and functions from project-templates.ts
export * from './project-templates.js';

// Export convenience functions

import {
  ComponentOptions,
  ComponentStyle,
  ComponentType,
  ComponentFramework,
  StylingFramework,
  generateComponent,
  DEFAULT_COMPONENT_OPTIONS,
} from './component-templates.js';

import {
  PageOptions,
  PageType,
  PageSection,
  generatePage,
  DEFAULT_PAGE_OPTIONS,
  DEFAULT_LANDING_PAGE_SECTIONS,
} from './page-templates.js';

import {
  ProjectOptions,
  ProjectType,
  ProjectFramework,
  ProjectStyling,
  ProjectDatabase,
  ProjectAuthentication,
  ProjectFile,
  generateProject,
  DEFAULT_PROJECT_OPTIONS,
} from './project-templates.js';

/**
 * Default UI generation configuration
 */
export const DEFAULT_UI_CONFIG = {
  framework: 'react',
  styling: 'tailwind',
  icons: 'lucide-react',
  database: 'supabase',
  features: {
    darkMode: true,
    responsive: true,
    animation: true,
    accessibility: true,
  },
  design: {
    cardStyle: 'rounded-xl shadow-sm',
    colorPalette: 'neutral',
    typography: {
      fontFamily: 'sans-serif',
      headingStyle: 'modern',
    },
    spacing: 'comfortable',
  },
};

/**
 * Generates a React component with the specified options
 */
export function generateReactComponent(
  name: string,
  style: ComponentStyle = ComponentStyle.BASIC,
  props: string[] = [],
  description?: string
): string {
  const options: ComponentOptions = {
    ...DEFAULT_COMPONENT_OPTIONS,
    name,
    style,
    type: ComponentType.FUNCTIONAL,
    framework: ComponentFramework.REACT,
    styling: StylingFramework.TAILWIND,
    props,
    description,
  };

  return generateComponent(options);
}

/**
 * Generates a landing page with the specified options
 */
export function generateLandingPage(
  name: string,
  sections: PageSection[] = DEFAULT_LANDING_PAGE_SECTIONS,
  meta?: { title?: string; description?: string; keywords?: string[] }
): string {
  const options: PageOptions = {
    ...DEFAULT_PAGE_OPTIONS,
    name,
    type: PageType.LANDING,
    sections,
    meta,
  };

  return generatePage(options);
}

/**
 * Generates a complete React project with the specified options
 */
export function generateReactProject(
  name: string,
  type: ProjectType = ProjectType.LANDING_PAGE,
  pages: { name: string; type: PageType; path: string }[] = [
    { name: 'Home', type: PageType.LANDING, path: 'pages/Home.tsx' },
  ]
): ProjectFile[] {
  const options: ProjectOptions = {
    ...DEFAULT_PROJECT_OPTIONS,
    name,
    type,
    framework: ProjectFramework.REACT_VITE,
    styling: ProjectStyling.TAILWIND,
    database: ProjectDatabase.SUPABASE,
    authentication: ProjectAuthentication.SUPABASE,
    pages,
    components: [],
  };

  return generateProject(options);
}

/**
 * Generates a component based on a text description
 */
export function generateComponentFromDescription(description: string): string {
  // Parse the description to determine component type, style, and props
  const style = determineComponentStyle(description);
  const name = determineComponentName(description);
  const props = determineComponentProps(description, style);

  return generateReactComponent(name, style, props, description);
}

/**
 * Determines the component style based on a description
 */
function determineComponentStyle(description: string): ComponentStyle {
  const lowerDesc = description.toLowerCase();
  
  if (lowerDesc.includes('hero') || lowerDesc.includes('banner') || lowerDesc.includes('header section')) {
    return ComponentStyle.HERO;
  }
  
  if (lowerDesc.includes('feature') || lowerDesc.includes('benefits') || lowerDesc.includes('services')) {
    return ComponentStyle.FEATURE;
  }
  
  if (lowerDesc.includes('pricing') || lowerDesc.includes('plan') || lowerDesc.includes('subscription')) {
    return ComponentStyle.PRICING;
  }
  
  if (lowerDesc.includes('cta') || lowerDesc.includes('call to action') || lowerDesc.includes('sign up')) {
    return ComponentStyle.CTA;
  }
  
  if (lowerDesc.includes('footer')) {
    return ComponentStyle.FOOTER;
  }
  
  if (lowerDesc.includes('card') || lowerDesc.includes('box') || lowerDesc.includes('container')) {
    return ComponentStyle.CARD;
  }
  
  if (lowerDesc.includes('form') || lowerDesc.includes('input') || lowerDesc.includes('field')) {
    return ComponentStyle.FORM;
  }
  
  if (lowerDesc.includes('list') || lowerDesc.includes('items')) {
    return ComponentStyle.LIST;
  }
  
  if (lowerDesc.includes('table') || lowerDesc.includes('data') || lowerDesc.includes('grid')) {
    return ComponentStyle.TABLE;
  }
  
  return ComponentStyle.BASIC;
}

/**
 * Determines the component name based on a description
 */
function determineComponentName(description: string): string {
  // Extract potential name from description
  const words = description.split(' ');
  const potentialName = words
    .filter(word => word.length > 2 && /^[A-Za-z]+$/.test(word))
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
  
  // If no valid name found, use a default based on the first word
  if (!potentialName) {
    return 'Component';
  }
  
  // Ensure name starts with uppercase letter and doesn't end with "Component"
  let name = potentialName.charAt(0).toUpperCase() + potentialName.slice(1);
  if (!name.endsWith('Component')) {
    name += 'Component';
  }
  
  return name;
}

/**
 * Determines the component props based on a description and style
 */
function determineComponentProps(description: string, style: ComponentStyle): string[] {
  const lowerDesc = description.toLowerCase();
  const props: string[] = [];
  
  // Add common props
  if (lowerDesc.includes('title') || style === ComponentStyle.HERO || style === ComponentStyle.FEATURE || style === ComponentStyle.PRICING) {
    props.push('title: string');
  }
  
  if (lowerDesc.includes('description') || lowerDesc.includes('text') || style === ComponentStyle.CARD) {
    props.push('description: string');
  }
  
  if (lowerDesc.includes('image') || lowerDesc.includes('picture') || lowerDesc.includes('photo')) {
    props.push('image: string');
  }
  
  if (lowerDesc.includes('icon') || style === ComponentStyle.CARD || style === ComponentStyle.FEATURE) {
    props.push('icon?: LucideIcon');
  }
  
  if (lowerDesc.includes('button') || lowerDesc.includes('link') || style === ComponentStyle.CTA || style === ComponentStyle.HERO) {
    props.push('ctaText: string');
    props.push('ctaLink: string');
  }
  
  if (lowerDesc.includes('children') || lowerDesc.includes('content')) {
    props.push('children?: React.ReactNode');
  }
  
  if (lowerDesc.includes('className') || lowerDesc.includes('style')) {
    props.push('className?: string');
  }
  
  return props;
}