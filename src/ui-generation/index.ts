/**
 * UI Generation Tools
 * 
 * This module exports all UI generation tools for the OptimusCode MCP system.
 */

import { z } from 'zod';
import { GenerateComponentSchema, ComponentStyle } from './component-gen.js';
import { GeneratePageSchema, PageSection, PageOptions, PageType } from './page-gen.js';
import { GenerateProjectSchema } from './project-gen.js';
import { GenerateFlowSchema, FlowOptions } from './flow-designer.js';
import { GenerateResponsiveUISchema } from './responsive-ui.js';
import { GenerateIconManagerSchema, handleGenerateIconManager } from './icon-manager.js';
import { GenerateTokenExtractorSchema } from './token-extractor.js';
import { handleGenerateTokenExtractor } from './token-extractor-handler.js';
import { GeneratePWASchema } from './pwa-converter.js';
import { GenerateBrowserCheckerSchema } from './browser-checker.js';
import { GenerateEnhancementSchema } from './enhancement-tool.js';
import { generatePage } from './page-templates.js';
import { generateReactComponent } from './component-gen.js';
import {
  ProjectType,
  ProjectFramework,
  ProjectStyling,
  ProjectDatabase,
  ProjectAuthentication,
  ProjectFile,
  ProjectOptions,
  generateProject
} from './project-templates.js';

/**
 * Export all UI generation schemas
 */
export {
  GenerateComponentSchema,
  GeneratePageSchema,
  GenerateProjectSchema,
  GenerateFlowSchema,
  GenerateResponsiveUISchema,
  GenerateIconManagerSchema,
  GenerateTokenExtractorSchema,
  GeneratePWASchema,
  GenerateBrowserCheckerSchema,
  GenerateEnhancementSchema,
  handleGenerateIconManager,
  handleGenerateTokenExtractor,
  
  // Export types and functions from component-gen
  ComponentStyle,
  
  // Export types and functions from page-gen
  PageSection,
  PageOptions,
  PageType,
  
  
  // Export types from flow-designer
  FlowOptions,
  
  // Export functions from page-templates
  generatePage,
  
  // Export types and functions from project-templates
  ProjectType,
  ProjectFramework,
  ProjectStyling,
  ProjectDatabase,
  ProjectAuthentication,
  ProjectFile,
  ProjectOptions,
  generateProject,
  generateReactComponent,
};

/**
 * Default landing page sections
 */
export const DEFAULT_LANDING_PAGE_SECTIONS: PageSection[] = [
  { name: 'header', component: 'Header' },
  { name: 'hero', component: 'Hero' },
  { name: 'features', component: 'Features' },
  { name: 'footer', component: 'Footer' }
];

/**
 * Export all UI generation tools
 */
export const uiGenerationTools = {
  componentGen: {
    name: 'ComponentGen',
    description: 'Creates reusable UI components with specified styles',
    schema: GenerateComponentSchema
  },
  pageGen: {
    name: 'PageGen',
    description: 'Creates complete web pages with various sections',
    schema: GeneratePageSchema
  },
  projectGen: {
    name: 'ProjectGen',
    description: 'Generates entire UI projects with multiple pages and styling',
    schema: GenerateProjectSchema
  },
  flowDesigner: {
    name: 'FlowDesigner',
    description: 'Establishes user-friendly navigation flows',
    schema: GenerateFlowSchema
  },
  responsiveUI: {
    name: 'ResponsiveUI',
    description: 'Ensures highly responsive, modern, clean UI/UX',
    schema: GenerateResponsiveUISchema
  },
  iconManager: {
    name: 'IconManager',
    description: 'Uses appropriate icon libraries instead of emojis',
    schema: GenerateIconManagerSchema
  },
  tokenExtractor: {
    name: 'TokenExtractor',
    description: 'Extracts design tokens from design systems or mockups',
    schema: GenerateTokenExtractorSchema,
    handler: handleGenerateTokenExtractor
  },
  pwaConverter: {
    name: 'PWAConverter',
    description: 'Transforms web applications into PWAs',
    schema: GeneratePWASchema
  },
  browserChecker: {
    name: 'BrowserChecker',
    description: 'Analyzes code for cross-browser compatibility issues',
    schema: GenerateBrowserCheckerSchema
  },
  enhancementTool: {
    name: 'EnhancementTool',
    description: 'Adds fallbacks and enhancements based on browser capabilities',
    schema: GenerateEnhancementSchema
  }
};
