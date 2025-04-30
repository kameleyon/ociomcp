// Auto-generated safe fallback for token-extractor

export function activate() {
    console.log("[TOOL] token-extractor activated (passive mode)");
}

export function onFileWrite(filePath: string, content: string): void {
    // State 1: File write detection
    console.log(`[TOOL] Token Extractor detected file write: ${filePath}`);
    
    // State 2: File content analysis
    const tokens = extractTokensFromContent(content);
    if (Object.keys(tokens).length > 0) {
        console.log(`[TOOL] Detected ${Object.keys(tokens).length} potential design tokens in file: ${filePath}`);
        
        // State 3: Token processing
        processDetectedTokens(tokens, filePath);
    }
}

export function onSessionStart(sessionId: string, context: any): void {
    // State 1: Session initialization
    console.log(`[TOOL] Token Extractor session started with ID: ${sessionId}`);
    
    // State 2: Context analysis
    if (context && context.projectType) {
        console.log(`[TOOL] Detected project type: ${context.projectType}`);
        
        // State 3: Initialize project-specific token handling
        initializeProjectTokenHandling(context.projectType);
    }
}

export function onCommand(command: string, args: string[]): void {
    // State 1: Command validation
    if (!command || !args) {
        console.error('[TOOL] Invalid command format');
        return;
    }
    
    // State 2: Command processing
    switch (command.toLowerCase()) {
        case 'extract':
            // Handle token extraction command
            handleTokenExtraction(args);
            break;
        case 'generate':
            // Handle token generation command
            handleTokenGeneration(args);
            break;
        case 'convert':
            // Handle token conversion command
            handleTokenConversion(args);
            break;
        default:
            // State 3: Unknown command handling
            console.error(`[TOOL] Unknown command: ${command}`);
            displayCommandHelp();
    }
}
/**
 * Token Extractor
 * 
 * Extracts design tokens from design systems or mockups
 * Generates CSS variables, theme files, and design constants
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { z } from 'zod';

/**
 * Schema for TokenExtractor
 */
export const GenerateTokenExtractorSchema = z.object({
  name: z.string(),
  framework: z.enum(['react', 'vue', 'angular', 'svelte', 'solid', 'html']).default('react'),
  format: z.enum(['css', 'scss', 'less', 'js', 'ts', 'json']).default('css'),
  outputDir: z.string().optional(),
  description: z.string().optional(),
  source: z.enum(['figma', 'sketch', 'adobe-xd', 'manual', 'auto']).default('manual'),
  sourceFile: z.string().optional(),
  tokens: z.object({
    colors: z.record(z.string()).optional(),
    typography: z.record(z.string()).optional(),
    spacing: z.record(z.string()).optional(),
    breakpoints: z.record(z.string()).optional(),
    shadows: z.record(z.string()).optional(),
    radii: z.record(z.string()).optional(),
    borders: z.record(z.string()).optional(),
    zIndices: z.record(z.string()).optional(),
    animations: z.record(z.string()).optional(),
    opacity: z.record(z.string()).optional(),
    custom: z.record(z.string()).optional()
  }).optional(),
  options: z.object({
    prefix: z.string().optional().default(''),
    darkMode: z.boolean().optional().default(false),
    rtl: z.boolean().optional().default(false),
    cssVariables: z.boolean().optional().default(true),
    themeObject: z.boolean().optional().default(true),
    comments: z.boolean().optional().default(true)
  }).optional()
});

/**
 * Token Extractor options interface
 */
export interface TokenExtractorOptions {
  name: string;
  framework: 'react' | 'vue' | 'angular' | 'svelte' | 'solid' | 'html';
  format: 'css' | 'scss' | 'less' | 'js' | 'ts' | 'json';
  outputDir?: string;
  description?: string;
  source: 'figma' | 'sketch' | 'adobe-xd' | 'manual' | 'auto';
  sourceFile?: string;
  tokens?: {
    colors?: Record<string, string>;
    typography?: Record<string, string>;
    spacing?: Record<string, string>;
    breakpoints?: Record<string, string>;
    shadows?: Record<string, string>;
    radii?: Record<string, string>;
    borders?: Record<string, string>;
    zIndices?: Record<string, string>;
    animations?: Record<string, string>;
    opacity?: Record<string, string>;
    custom?: Record<string, string>;
  };
  options?: {
    prefix?: string;
    darkMode?: boolean;
    rtl?: boolean;
    cssVariables?: boolean;
    themeObject?: boolean;
    comments?: boolean;
  };
}

/**
 * Format component name to PascalCase
 * 
 * @param name Component name
 * @returns Formatted component name
 */
export function formatComponentName(name: string): string {
  return name
    .split(/[-_\s]+/)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('');
}

/**
 * Invert a color (used for dark mode)
 *
 * @param color Hex color code
 * @returns Inverted color
 */
export function invertColor(color: string): string {
  // Remove the # if present
  let hex = color.replace('#', '');
  
  // Convert to RGB
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);
  
  // Invert
  r = 255 - r;
  g = 255 - g;
  b = 255 - b;
  
  // Convert back to hex
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Convert string to kebab-case
 * 
 * @param str String to convert
 * @returns Kebab-case string
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

/**
 * Convert string to camelCase
 * 
 * @param str String to convert
 * @returns camelCase string
 */
export function toCamelCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '')
    .replace(/^[A-Z]/, c => c.toLowerCase());
}

/**
 * Extracts design tokens from content
 * 
 * @param content File content
 * @returns Extracted tokens
 */
export function extractTokensFromContent(content: string): Record<string, any> {
  // Placeholder for actual token extraction logic
  console.log('[TOOL] Extracting tokens from content (placeholder)');
  return {}; // Return empty object for now
}

/**
 * Processes detected design tokens
 * 
 * @param tokens Detected tokens
 * @param filePath Source file path
 */
export function processDetectedTokens(tokens: Record<string, any>, filePath: string): void {
  // Placeholder for actual token processing logic
  console.log('[TOOL] Processing detected tokens (placeholder)');
}

/**
 * Initializes project-specific token handling
 * 
 * @param projectType Project type
 */
export function initializeProjectTokenHandling(projectType: string): void {
  // Placeholder for actual initialization logic
  console.log(`[TOOL] Initializing token handling for project type: ${projectType} (placeholder)`);
}

/**
 * Handles token extraction command
 * 
 * @param args Command arguments
 */
export function handleTokenExtraction(args: string[]): void {
  // Placeholder for actual extraction command handling
  console.log('[TOOL] Handling token extraction command (placeholder)');
  console.log('Args:', args);
}

/**
 * Handles token generation command
 * 
 * @param args Command arguments
 */
export function handleTokenGeneration(args: string[]): void {
  // Placeholder for actual generation command handling
  console.log('[TOOL] Handling token generation command (placeholder)');
  console.log('Args:', args);
}

/**
 * Handles token conversion command
 * 
 * @param args Command arguments
 */
export function handleTokenConversion(args: string[]): void {
  // Placeholder for actual conversion command handling
  console.log('[TOOL] Handling token conversion command (placeholder)');
  console.log('Args:', args);
}

/**
 * Displays command help for Token Extractor
 */
export function displayCommandHelp(): void {
  // Placeholder for actual help display
  console.log('[TOOL] Displaying Token Extractor command help (placeholder)');
  console.log('Available commands: extract, generate, convert');
}

/**
 * Generate Token Extractor files
 * 
 * @param options Token Extractor options
 * @returns Map of file paths to content
 */
export function generateTokenExtractor(options: TokenExtractorOptions): Map<string, string> {
  const {
    name,
    framework,
    format,
    description,
    source,
    sourceFile,
    tokens = {
      colors: {},
      typography: {},
      spacing: {},
      breakpoints: {},
      shadows: {},
      radii: {},
      borders: {},
      zIndices: {},
      animations: {},
      opacity: {},
      custom: {}
    },
    options: extractorOptions = {
      prefix: '',
      darkMode: false,
      rtl: false,
      cssVariables: true,
      themeObject: true,
      comments: true
    }
  } = options;

  const extractorName = formatComponentName(name);
  const prefix = extractorOptions.prefix ? `${extractorOptions.prefix}-` : '';
  const hasDarkMode = extractorOptions.darkMode;
  const hasRtl = extractorOptions.rtl;
  const useCssVariables = extractorOptions.cssVariables;
  const useThemeObject = extractorOptions.themeObject;
  const useComments = extractorOptions.comments;
  
  const tokenFiles = new Map<string, string>();
  
  // Generate tokens based on format
  if (format === 'css' || format === 'scss' || format === 'less') {
    generateCssTokens(tokenFiles, options);
  } else if (format === 'js' || format === 'ts') {
    generateJsTokens(tokenFiles, options);
  } else if (format === 'json') {
    generateJsTokens(tokenFiles, options);
  }
  
  // Generate theme provider based on framework
  if (useThemeObject) {
    if (framework === 'react') {
      generateReactThemeProvider(tokenFiles, options);
    } else if (framework === 'vue') {
      generateVueThemeProvider(tokenFiles, options);
    } else if (framework === 'angular') {
      generateAngularThemeProvider(tokenFiles, options);
    } else if (framework === 'svelte') {
      generateSvelteThemeProvider(tokenFiles, options);
    }
  }
  
  return tokenFiles;
}

/**
 * Generate CSS tokens
 * 
 * @param tokenFiles Map of file paths to content
 * @param options Token Extractor options
 */
export function generateCssTokens(tokenFiles: Map<string, string>, options: TokenExtractorOptions): void {
  const {
    name,
    format,
    tokens = {},
    options: extractorOptions = {}
  } = options;

  const prefix = extractorOptions.prefix ? `${extractorOptions.prefix}-` : '';
  const hasDarkMode = extractorOptions.darkMode;
  const hasRtl = extractorOptions.rtl;
  const useComments = extractorOptions.comments;
  
  let content = '';
  const fileExtension = format;
  
  // Add header comment
  if (useComments) {
    content += `/**\n`;
    content += ` * ${formatComponentName(name)} Design Tokens\n`;
    content += ` * Generated by TokenExtractor\n`;
    content += ` */\n\n`;
  }
  
  // Add root variables
  content += `:root {\n`;
  
  // Add colors
  if (tokens.colors && Object.keys(tokens.colors).length > 0) {
    if (useComments) {
      content += `  /* Colors */\n`;
    }
    
    Object.entries(tokens.colors).forEach(([key, value]) => {
      content += `  --${prefix}color-${toKebabCase(key)}: ${value};\n`;
    });
    
    content += '\n';
  }
  
  // Add typography
  if (tokens.typography && Object.keys(tokens.typography).length > 0) {
    if (useComments) {
      content += `  /* Typography */\n`;
    }
    
    Object.entries(tokens.typography).forEach(([key, value]) => {
      content += `  --${prefix}font-${toKebabCase(key)}: ${value};\n`;
    });
    
    content += '\n';
  }
  
  // Add spacing
  if (tokens.spacing && Object.keys(tokens.spacing).length > 0) {
    if (useComments) {
      content += `  /* Spacing */\n`;
    }
    
    Object.entries(tokens.spacing).forEach(([key, value]) => {
      content += `  --${prefix}spacing-${toKebabCase(key)}: ${value};\n`;
    });
    
    content += '\n';
  }
  
  // Add breakpoints
  if (tokens.breakpoints && Object.keys(tokens.breakpoints).length > 0) {
    if (useComments) {
      content += `  /* Breakpoints */\n`;
    }
    
    Object.entries(tokens.breakpoints).forEach(([key, value]) => {
      content += `  --${prefix}breakpoint-${toKebabCase(key)}: ${value};\n`;
    });
    
    content += '\n';
  }
  
  // Add shadows
  if (tokens.shadows && Object.keys(tokens.shadows).length > 0) {
    if (useComments) {
      content += `  /* Shadows */\n`;
    }
    
    Object.entries(tokens.shadows).forEach(([key, value]) => {
      content += `  --${prefix}shadow-${toKebabCase(key)}: ${value};\n`;
    });
    
    content += '\n';
  }
  
  // Add radii
  if (tokens.radii && Object.keys(tokens.radii).length > 0) {
    if (useComments) {
      content += `  /* Border Radius */\n`;
    }
    
    Object.entries(tokens.radii).forEach(([key, value]) => {
      content += `  --${prefix}radius-${toKebabCase(key)}: ${value};\n`;
    });
    
    content += '\n';
  }
  
  // Add borders
  if (tokens.borders && Object.keys(tokens.borders).length > 0) {
    if (useComments) {
      content += `  /* Borders */\n`;
    }
    
    Object.entries(tokens.borders).forEach(([key, value]) => {
      content += `  --${prefix}border-${toKebabCase(key)}: ${value};\n`;
    });
    
    content += '\n';
  }
  
  // Add z-indices
  if (tokens.zIndices && Object.keys(tokens.zIndices).length > 0) {
    if (useComments) {
      content += `  /* Z-Indices */\n`;
    }
    
    Object.entries(tokens.zIndices).forEach(([key, value]) => {
      content += `  --${prefix}z-${toKebabCase(key)}: ${value};\n`;
    });
    
    content += '\n';
  }
  
  // Add animations
  if (tokens.animations && Object.keys(tokens.animations).length > 0) {
    if (useComments) {
      content += `  /* Animations */\n`;
    }
    
    Object.entries(tokens.animations).forEach(([key, value]) => {
      content += `  --${prefix}animation-${toKebabCase(key)}: ${value};\n`;
    });
    
    content += '\n';
  }
  
  // Add opacity
  if (tokens.opacity && Object.keys(tokens.opacity).length > 0) {
    if (useComments) {
      content += `  /* Opacity */\n`;
    }
    
    Object.entries(tokens.opacity).forEach(([key, value]) => {
      content += `  --${prefix}opacity-${toKebabCase(key)}: ${value};\n`;
    });
    
    content += '\n';
  }
  
  // Add custom tokens
  if (tokens.custom && Object.keys(tokens.custom).length > 0) {
    if (useComments) {
      content += `  /* Custom */\n`;
    }
    
    Object.entries(tokens.custom).forEach(([key, value]) => {
      content += `  --${prefix}${toKebabCase(key)}: ${value};\n`;
    });
    
    content += '\n';
  }
  
  content += `}\n`;
  
  // Add dark mode if enabled
  if (hasDarkMode) {
    content += `\n`;
    
    if (useComments) {
      content += `/* Dark Mode */\n`;
    }
    
    content += `[data-theme="dark"] {\n`;
    
    // Add dark mode colors
    if (tokens.colors && Object.keys(tokens.colors).length > 0) {
      if (useComments) {
        content += `  /* Colors - Dark Mode */\n`;
      }
      
      // Generate dark mode colors (inverted or adjusted)
      Object.entries(tokens.colors).forEach(([key, value]) => {
        // Simple inversion for demo purposes
        // In a real implementation, this would be more sophisticated
        if (value.startsWith('#')) {
          content += `  --${prefix}color-${toKebabCase(key)}: ${invertColor(value)};\n`;
        }
      });
      
      content += '\n';
    }
    
    content += `}\n`;
  }
  
  // Add RTL support if enabled
  if (hasRtl) {
    content += `\n`;
    
    if (useComments) {
      content += `/* RTL Support */\n`;
    }
    
    content += `[dir="rtl"] {\n`;
    content += `  /* Add RTL specific variables here */\n`;
    content += `}\n`;
  }
  
  // Add utility classes if it's CSS
  if (format === 'css') {
    content += `\n`;
    
    if (useComments) {
      content += `/* Utility Classes */\n`;
    }
    
    // Color utilities
    if (tokens.colors && Object.keys(tokens.colors).length > 0) {
      Object.keys(tokens.colors).forEach(key => {
        content += `.${prefix}color-${toKebabCase(key)} { color: var(--${prefix}color-${toKebabCase(key)}); }\n`;
        content += `.${prefix}bg-${toKebabCase(key)} { background-color: var(--${prefix}color-${toKebabCase(key)}); }\n`;
      });
      
      content += '\n';
    }
    
    // Typography utilities
    if (tokens.typography && Object.keys(tokens.typography).length > 0) {
      Object.keys(tokens.typography).forEach(key => {
        content += `.${prefix}font-${toKebabCase(key)} { font: var(--${prefix}font-${toKebabCase(key)}); }\n`;
      });
      
      content += '\n';
    }
    
    // Spacing utilities
    if (tokens.spacing && Object.keys(tokens.spacing).length > 0) {
      Object.keys(tokens.spacing).forEach(key => {
        content += `.${prefix}m-${toKebabCase(key)} { margin: var(--${prefix}spacing-${toKebabCase(key)}); }\n`;
        content += `.${prefix}p-${toKebabCase(key)} { padding: var(--${prefix}spacing-${toKebabCase(key)}); }\n`;
      });
      
      content += '\n';
    }
    
    // Border radius utilities
    if (tokens.radii && Object.keys(tokens.radii).length > 0) {
      Object.keys(tokens.radii).forEach(key => {
        content += `.${prefix}radius-${toKebabCase(key)} { border-radius: var(--${prefix}radius-${toKebabCase(key)}); }\n`;
      });
      
      content += '\n';
    }
    
    // Shadow utilities
    if (tokens.shadows && Object.keys(tokens.shadows).length > 0) {
      Object.keys(tokens.shadows).forEach(key => {
        content += `.${prefix}shadow-${toKebabCase(key)} { box-shadow: var(--${prefix}shadow-${toKebabCase(key)}); }\n`;
      });
      
      content += '\n';
    }
  }
  
  // Add mixins if it's SCSS or LESS
  if (format === 'scss' || format === 'less') {
    content += `\n`;
    
    if (useComments) {
      content += `/* Mixins */\n`;
    }
    
    const mixinPrefix = format === 'scss' ? '@mixin' : '.';
    const variablePrefix = format === 'scss' ? '$' : '@';
    const includePrefix = format === 'scss' ? '@include' : '.';
    
    // Color mixins
    if (tokens.colors && Object.keys(tokens.colors).length > 0) {
      content += `${mixinPrefix} ${prefix}use-color($color) {\n`;
      content += `  color: var(--${prefix}color-#{$color});\n`;
      content += `}\n\n`;
      
      content += `${mixinPrefix} ${prefix}use-bg-color($color) {\n`;
      content += `  background-color: var(--${prefix}color-#{$color});\n`;
      content += `}\n\n`;
    }
    
    // Typography mixins
    if (tokens.typography && Object.keys(tokens.typography).length > 0) {
      content += `${mixinPrefix} ${prefix}use-font($font) {\n`;
      content += `  font: var(--${prefix}font-#{$font});\n`;
      content += `}\n\n`;
    }
    
    // Spacing mixins
    if (tokens.spacing && Object.keys(tokens.spacing).length > 0) {
      content += `${mixinPrefix} ${prefix}use-margin($size) {\n`;
      content += `  margin: var(--${prefix}spacing-#{$size});\n`;
      content += `}\n\n`;
      
      content += `${mixinPrefix} ${prefix}use-padding($size) {\n`;
      content += `  padding: var(--${prefix}spacing-#{$size});\n`;
      content += `}\n\n`;
    }
    
    // Border radius mixins
    if (tokens.radii && Object.keys(tokens.radii).length > 0) {
      content += `${mixinPrefix} ${prefix}use-radius($radius) {\n`;
      content += `  border-radius: var(--${prefix}radius-#{$radius});\n`;
      content += `}\n\n`;
    }
    
    // Shadow mixins
    if (tokens.shadows && Object.keys(tokens.shadows).length > 0) {
      content += `${mixinPrefix} ${prefix}use-shadow($shadow) {\n`;
      content += `  box-shadow: var(--${prefix}shadow-#{$shadow});\n`;
      content += `}\n\n`;
    }
    
    // Example usage
    content += `/* Example Usage */\n`;
    content += `.example {\n`;
    
    if (tokens.colors && Object.keys(tokens.colors).length > 0) {
      const firstColor = Object.keys(tokens.colors)[0];
      content += `  ${includePrefix} ${prefix}use-color('${toKebabCase(firstColor)}');\n`;
      content += `  ${includePrefix} ${prefix}use-bg-color('${toKebabCase(firstColor)}');\n`;
    }
    
    if (tokens.typography && Object.keys(tokens.typography).length > 0) {
      const firstFont = Object.keys(tokens.typography)[0];
      content += `  ${includePrefix} ${prefix}use-font('${toKebabCase(firstFont)}');\n`;
    }
    
    if (tokens.spacing && Object.keys(tokens.spacing).length > 0) {
      const firstSpacing = Object.keys(tokens.spacing)[0];
      content += `  ${includePrefix} ${prefix}use-margin('${toKebabCase(firstSpacing)}');\n`;
      content += `  ${includePrefix} ${prefix}use-padding('${toKebabCase(firstSpacing)}');\n`;
    }
    
    if (tokens.radii && Object.keys(tokens.radii).length > 0) {
      const firstRadius = Object.keys(tokens.radii)[0];
      content += `  ${includePrefix} ${prefix}use-radius('${toKebabCase(firstRadius)}');\n`;
    }
    
    if (tokens.shadows && Object.keys(tokens.shadows).length > 0) {
      const firstShadow = Object.keys(tokens.shadows)[0];
      content += `  ${includePrefix} ${prefix}use-shadow('${toKebabCase(firstShadow)}');\n`;
    }
    
    content += `}\n`;
  }
  
  tokenFiles.set(`tokens.${fileExtension}`, content);
}

/**
 * Generate JS/TS tokens
 * 
 * @param tokenFiles Map of file paths to content
 * @param options Token Extractor options
 */
export function generateJsTokens(tokenFiles: Map<string, string>, options: TokenExtractorOptions): void {
  const {
    name,
    format,
    tokens = {},
    options: extractorOptions = {}
  } = options;

  const prefix = extractorOptions.prefix ? `${extractorOptions.prefix}` : '';
  const hasDarkMode = extractorOptions.darkMode;
  const useComments = extractorOptions.comments;
  const isTypescript = format === 'ts';
  
  let content = '';
  const fileExtension = format;
  
  // Add header comment
  if (useComments) {
    content += `/**\n`;
    content += ` * ${formatComponentName(name)} Design Tokens\n`;
    content += ` * Generated by TokenExtractor\n`;
    content += ` */\n\n`;
  }
  
  // Add type definitions if TypeScript
  if (isTypescript) {
    content += `// Type definitions\n`;
    
    // Colors type
    if (tokens.colors && Object.keys(tokens.colors).length > 0) {
      content += `export type ColorToken = ${Object.keys(tokens.colors).map(key => `'${toCamelCase(key)}'`).join(' | ')};\n`;
    }
    
    // Typography type
    if (tokens.typography && Object.keys(tokens.typography).length > 0) {
      content += `export type TypographyToken = ${Object.keys(tokens.typography).map(key => `'${toCamelCase(key)}'`).join(' | ')};\n`;
    }
    
    // Spacing type
    if (tokens.spacing && Object.keys(tokens.spacing).length > 0) {
      content += `export type SpacingToken = ${Object.keys(tokens.spacing).map(key => `'${toCamelCase(key)}'`).join(' | ')};\n`;
    }
    
    // Breakpoints type
    if (tokens.breakpoints && Object.keys(tokens.breakpoints).length > 0) {
      content += `export type BreakpointToken = ${Object.keys(tokens.breakpoints).map(key => `'${toCamelCase(key)}'`).join(' | ')};\n`;
    }
    
    // Shadows type
    if (tokens.shadows && Object.keys(tokens.shadows).length > 0) {
      content += `export type ShadowToken = ${Object.keys(tokens.shadows).map(key => `'${toCamelCase(key)}'`).join(' | ')};\n`;
    }
    
    // Radii type
    if (tokens.radii && Object.keys(tokens.radii).length > 0) {
      content += `export type RadiusToken = ${Object.keys(tokens.radii).map(key => `'${toCamelCase(key)}'`).join(' | ')};\n`;
    }
    
    // Borders type
    if (tokens.borders && Object.keys(tokens.borders).length > 0) {
      content += `export type BorderToken = ${Object.keys(tokens.borders).map(key => `'${toCamelCase(key)}'`).join(' | ')};\n`;
    }
    
    // Z-indices type
    if (tokens.zIndices && Object.keys(tokens.zIndices).length > 0) {
      content += `export type ZIndexToken = ${Object.keys(tokens.zIndices).map(key => `'${toCamelCase(key)}'`).join(' | ')};\n`;
    }
    
    // Animations type
    if (tokens.animations && Object.keys(tokens.animations).length > 0) {
      content += `export type AnimationToken = ${Object.keys(tokens.animations).map(key => `'${toCamelCase(key)}'`).join(' | ')};\n`;
    }
    
    // Opacity type
    if (tokens.opacity && Object.keys(tokens.opacity).length > 0) {
      content += `export type OpacityToken = ${Object.keys(tokens.opacity).map(key => `'${toCamelCase(key)}'`).join(' | ')};\n`;
    }
    
    // Custom type
    if (tokens.custom && Object.keys(tokens.custom).length > 0) {
      content += `export type CustomToken = ${Object.keys(tokens.custom).map(key => `'${toCamelCase(key)}'`).join(' | ')};\n`;
    }
    
    // Theme type
    content += `\nexport interface Theme {\n`;
    
    if (tokens.colors && Object.keys(tokens.colors).length > 0) {
      content += `  colors: Record<ColorToken, string>;\n`;
    }
    
    if (tokens.typography && Object.keys(tokens.typography).length > 0) {
      content += `  typography: Record<TypographyToken, string>;\n`;
    }
    
    if (tokens.spacing && Object.keys(tokens.spacing).length > 0) {
      content += `  spacing: Record<SpacingToken, string>;\n`;
    }
    
    if (tokens.breakpoints && Object.keys(tokens.breakpoints).length > 0) {
      content += `  breakpoints: Record<BreakpointToken, string>;\n`;
    }
    
    if (tokens.shadows && Object.keys(tokens.shadows).length > 0) {
      content += `  shadows: Record<ShadowToken, string>;\n`;
    }
    
    if (tokens.radii && Object.keys(tokens.radii).length > 0) {
      content += `  radii: Record<RadiusToken, string>;\n`;
    }
    
    if (tokens.borders && Object.keys(tokens.borders).length > 0) {
      content += `  borders: Record<BorderToken, string>;\n`;
    }
    
    if (tokens.zIndices && Object.keys(tokens.zIndices).length > 0) {
      content += `  zIndices: Record<ZIndexToken, string | number>;\n`;
    }
    
    if (tokens.animations && Object.keys(tokens.animations).length > 0) {
      content += `  animations: Record<AnimationToken, string>;\n`;
    }
    
    if (tokens.opacity && Object.keys(tokens.opacity).length > 0) {
      content += `  opacity: Record<OpacityToken, string | number>;\n`;
    }
    
    if (tokens.custom && Object.keys(tokens.custom).length > 0) {
      content += `  custom: Record<CustomToken, string>;\n`;
    }
    
    content += `}\n\n`;
  }
  
  // Create the theme object
  content += `// Theme tokens\n`;
  content += `${isTypescript ? 'export const theme: Theme' : 'export const theme'} = {\n`;
  
  // Add colors
  if (tokens.colors && Object.keys(tokens.colors).length > 0) {
    content += `  colors: {\n`;
    
    Object.entries(tokens.colors).forEach(([key, value]) => {
      content += `    ${toCamelCase(key)}: '${value}',\n`;
    });
    
    content += `  },\n`;
  }
  
  // Add typography
  if (tokens.typography && Object.keys(tokens.typography).length > 0) {
    content += `  typography: {\n`;
    
    Object.entries(tokens.typography).forEach(([key, value]) => {
      content += `    ${toCamelCase(key)}: '${value}',\n`;
    });
    
    content += `  },\n`;
  }
  
  // Add spacing
  if (tokens.spacing && Object.keys(tokens.spacing).length > 0) {
    content += `  spacing: {\n`;
    
    Object.entries(tokens.spacing).forEach(([key, value]) => {
      content += `    ${toCamelCase(key)}: '${value}',\n`;
    });
    
    content += `  },\n`;
  }
  
  // Add breakpoints
  if (tokens.breakpoints && Object.keys(tokens.breakpoints).length > 0) {
    content += `  breakpoints: {\n`;
    
    Object.entries(tokens.breakpoints).forEach(([key, value]) => {
      content += `    ${toCamelCase(key)}: '${value}',\n`;
    });
    
    content += `  },\n`;
  }
  
  // Add shadows
  if (tokens.shadows && Object.keys(tokens.shadows).length > 0) {
    content += `  shadows: {\n`;
    
    Object.entries(tokens.shadows).forEach(([key, value]) => {
      content += `    ${toCamelCase(key)}: '${value}',\n`;
    });
    
    content += `  },\n`;
  }
  
  // Add radii
  if (tokens.radii && Object.keys(tokens.radii).length > 0) {
    content += `  radii: {\n`;
    
    Object.entries(tokens.radii).forEach(([key, value]) => {
      content += `    ${toCamelCase(key)}: '${value}',\n`;
    });
    
    content += `  },\n`;
  }
  
  // Add borders
  if (tokens.borders && Object.keys(tokens.borders).length > 0) {
    content += `  borders: {\n`;
    
    Object.entries(tokens.borders).forEach(([key, value]) => {
      content += `    ${toCamelCase(key)}: '${value}',\n`;
    });
    
    content += `  },\n`;
  }
  
  // Add z-indices
  if (tokens.zIndices && Object.keys(tokens.zIndices).length > 0) {
    content += `  zIndices: {\n`;
    
    Object.entries(tokens.zIndices).forEach(([key, value]) => {
      content += `    ${toCamelCase(key)}: '${value}',\n`;
    });
    
    content += `  },\n`;
  }
  
  // Close the tokens object and export statement
  content += `};\n\nexport default tokens;\n`;
}

/**
 * Generate React theme provider
 *
 * @param tokenFiles Map of file paths to content
 * @param options Token extractor options
 */
export function generateReactThemeProvider(tokenFiles: Map<string, string>, options: TokenExtractorOptions): void {
  const {
    name,
    format,
    outputDir = './src/theme',
    tokens = {},
    options: extractorOptions = {
      prefix: '',
      darkMode: false,
      rtl: false,
      cssVariables: true,
      themeObject: true,
      comments: true
    }
  } = options;

  const extractorName = formatComponentName(name);
  const prefix = extractorOptions.prefix ? `${extractorOptions.prefix}-` : '';
  const hasDarkMode = extractorOptions.darkMode;
  
  // Generate React theme provider
  let content = `import React, { createContext, useContext, ReactNode } from 'react';\n`;
  content += `import tokens from './tokens';\n\n`;
  
  content += `// Theme context\n`;
  content += `const ${extractorName}ThemeContext = createContext(tokens);\n\n`;
  
  content += `// Theme provider props\n`;
  content += `interface ${extractorName}ThemeProviderProps {\n`;
  content += `  children: ReactNode;\n`;
  
  if (hasDarkMode) {
    content += `  darkMode?: boolean;\n`;
  }
  
  content += `}\n\n`;
  
  content += `// Theme provider component\n`;
  content += `export const ${extractorName}ThemeProvider: React.FC<${extractorName}ThemeProviderProps> = ({ `;
  
  if (hasDarkMode) {
    content += `darkMode = false, `;
  }
  
  content += `children }) => {\n`;
  
  if (hasDarkMode) {
    content += `  React.useEffect(() => {\n`;
    content += `    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');\n`;
    content += `  }, [darkMode]);\n\n`;
  }
  
  content += `  return (\n`;
  content += `    <${extractorName}ThemeContext.Provider value={tokens}>\n`;
  content += `      {children}\n`;
  content += `    </${extractorName}ThemeContext.Provider>\n`;
  content += `  );\n`;
  content += `};\n\n`;
  
  content += `// Hook to use theme\n`;
  content += `export const use${extractorName}Theme = () => useContext(${extractorName}ThemeContext);\n`;
  
  // Add file to tokenFiles
  const ext = format === 'ts' ? 'tsx' : 'jsx';
  tokenFiles.set(`${outputDir}/ThemeProvider.${ext}`, content);
}

/**
 * Generate Vue theme provider
 *
 * @param tokenFiles Map of file paths to content
 * @param options Token extractor options
 */
export function generateVueThemeProvider(tokenFiles: Map<string, string>, options: TokenExtractorOptions): void {
  const {
    name,
    format,
    outputDir = './src/theme',
    tokens = {},
    options: extractorOptions = {
      prefix: '',
      darkMode: false,
      rtl: false,
      cssVariables: true,
      themeObject: true,
      comments: true
    }
  } = options;

  const extractorName = formatComponentName(name);
  const prefix = extractorOptions.prefix ? `${extractorOptions.prefix}-` : '';
  const hasDarkMode = extractorOptions.darkMode;
  
  // Generate Vue theme provider
  let content = `<script>\n`;
  content += `import tokens from './tokens';\n\n`;
  content += `export default {\n`;
  content += `  name: '${extractorName}ThemeProvider',\n`;
  content += `  props: {\n`;
  
  if (hasDarkMode) {
    content += `    darkMode: {\n`;
    content += `      type: Boolean,\n`;
    content += `      default: false\n`;
    content += `    }\n`;
  }
  
  content += `  },\n`;
  
  if (hasDarkMode) {
    content += `  watch: {\n`;
    content += `    darkMode: {\n`;
    content += `      immediate: true,\n`;
    content += `      handler(val) {\n`;
    content += `        document.documentElement.setAttribute('data-theme', val ? 'dark' : 'light');\n`;
    content += `      }\n`;
    content += `    }\n`;
    content += `  },\n`;
  }
  
  content += `  provide() {\n`;
  content += `    return {\n`;
  content += `      theme: tokens\n`;
    content += `    };\n`;
  content += `  }\n`;
  content += `};\n`;
  content += `</script>\n\n`;
  
  content += `<template>\n`;
  content += `  <slot></slot>\n`;
  content += `</template>\n`;
  
  // Add file to tokenFiles
  tokenFiles.set(`${outputDir}/ThemeProvider.vue`, content);
}

/**
 * Generate Angular theme provider
 *
 * @param tokenFiles Map of file paths to content
 * @param options Token extractor options
 */
export function generateAngularThemeProvider(tokenFiles: Map<string, string>, options: TokenExtractorOptions): void {
  const {
    name,
    format,
    outputDir = './src/theme',
    tokens = {},
    options: extractorOptions = {
      prefix: '',
      darkMode: false,
      rtl: false,
      cssVariables: true,
      themeObject: true,
      comments: true
    }
  } = options;

  const extractorName = formatComponentName(name);
  const prefix = extractorOptions.prefix ? `${extractorOptions.prefix}-` : '';
  const hasDarkMode = extractorOptions.darkMode;
  
  // Generate Angular theme service
  let serviceContent = `import { Injectable } from '@angular/core';\n`;
  serviceContent += `import { BehaviorSubject } from 'rxjs';\n`;
  serviceContent += `import tokens from './tokens';\n\n`;
  
  serviceContent += `@Injectable({\n`;
  serviceContent += `  providedIn: 'root'\n`;
  serviceContent += `})\n`;
  serviceContent += `export class ${extractorName}ThemeService {\n`;
  serviceContent += `  private _tokens = tokens;\n`;
  
  if (hasDarkMode) {
    serviceContent += `  private _darkMode = new BehaviorSubject<boolean>(false);\n`;
    serviceContent += `  darkMode$ = this._darkMode.asObservable();\n\n`;
    
    serviceContent += `  setDarkMode(isDark: boolean): void {\n`;
    serviceContent += `    this._darkMode.next(isDark);\n`;
    serviceContent += `    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');\n`;
    serviceContent += `  }\n\n`;
  }
  
  serviceContent += `  getTokens() {\n`;
  serviceContent += `    return this._tokens;\n`;
  serviceContent += `  }\n`;
  serviceContent += `}\n`;
  
  // Add service file to tokenFiles
  const ext = format === 'ts' ? 'ts' : 'js';
  tokenFiles.set(`${outputDir}/theme.service.${ext}`, serviceContent);
  
  // Generate Angular theme module
  let moduleContent = `import { NgModule } from '@angular/core';\n`;
  moduleContent += `import { CommonModule } from '@angular/common';\n`;
  moduleContent += `import { ${extractorName}ThemeService } from './theme.service';\n\n`;
  
  moduleContent += `@NgModule({\n`;
  moduleContent += `  imports: [CommonModule],\n`;
  moduleContent += `  providers: [${extractorName}ThemeService]\n`;
  moduleContent += `})\n`;
  moduleContent += `export class ${extractorName}ThemeModule {}\n`;
  
  // Add module file to tokenFiles
  tokenFiles.set(`${outputDir}/theme.module.${ext}`, moduleContent);
}

/**
 * Generate Svelte theme provider
 *
 * @param tokenFiles Map of file paths to content
 * @param options Token extractor options
 */
export function generateSvelteThemeProvider(tokenFiles: Map<string, string>, options: TokenExtractorOptions): void {
  const {
    name,
    format,
    outputDir = './src/theme',
    tokens = {},
    options: extractorOptions = {
      prefix: '',
      darkMode: false,
      rtl: false,
      cssVariables: true,
      themeObject: true,
      comments: true
    }
  } = options;

  const extractorName = formatComponentName(name);
  const prefix = extractorOptions.prefix ? `${extractorOptions.prefix}-` : '';
  const hasDarkMode = extractorOptions.darkMode;
  
  // Generate Svelte theme store
  let storeContent = `import { writable } from 'svelte/store';\n`;
  storeContent += `import tokens from './tokens';\n\n`;
  
  storeContent += `export const theme = writable(tokens);\n`;
  
  if (hasDarkMode) {
    storeContent += `export const darkMode = writable(false);\n\n`;
    
    storeContent += `// Subscribe to darkMode changes\n`;
    storeContent += `darkMode.subscribe(isDark => {\n`;
    storeContent += `  if (typeof document !== 'undefined') {\n`;
    storeContent += `    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');\n`;
    storeContent += `  }\n`;
    storeContent += `});\n`;
  }
  
  // Add store file to tokenFiles
  const ext = format === 'ts' ? 'ts' : 'js';
  tokenFiles.set(`${outputDir}/theme-store.${ext}`, storeContent);
  
  // Generate Svelte theme provider component
  let componentContent = `<script>\n`;
  componentContent += `  import { theme`;
  
  if (hasDarkMode) {
    componentContent += `, darkMode`;
  }
  
  componentContent += ` } from './theme-store';\n`;
  
  if (hasDarkMode) {
    componentContent += `  export let isDarkMode = false;\n\n`;
    componentContent += `  $: $darkMode = isDarkMode;\n`;
  }
  
  componentContent += `</script>\n\n`;
  componentContent += `<slot></slot>\n`;
  
  // Add component file to tokenFiles
  tokenFiles.set(`${outputDir}/ThemeProvider.svelte`, componentContent);
}
