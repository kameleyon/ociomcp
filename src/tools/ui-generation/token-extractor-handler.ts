// Auto-generated safe fallback for token-extractor-handler

export function activate() {
    console.log("[TOOL] token-extractor-handler activated (passive mode)");
}

export function onFileWrite() { /* no-op */ }
export function onSessionStart() { /* no-op */ }
export function onCommand() { /* no-op */ }
/**
 * Token Extractor Handler
 * 
 * Implements the handler for the TokenExtractor tool
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { GenerateTokenExtractorSchema } from './token-extractor.js';

/**
 * Handle generate_token_extractor command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleGenerateTokenExtractor(args: any) {
  try {
    // Parse and validate the arguments
    const validatedArgs = GenerateTokenExtractorSchema.parse(args);
    
    const {
      name,
      framework,
      format,
      outputDir = './src/theme',
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
    } = validatedArgs;

    // Generate CSS tokens
    const cssContent = generateCssTokens(
      name,
      format,
      tokens,
      extractorOptions
    );

    // Create the output directory if it doesn't exist
    try {
      await fs.mkdir(outputDir, { recursive: true });
    } catch (error) {
      // Ignore if directory already exists
    }

    // Write the CSS file
    const cssFilePath = `${outputDir}/tokens.${format}`;
    await fs.writeFile(cssFilePath, cssContent, 'utf8');

    return {
      content: [{ 
        type: "text",
        text: `Successfully generated token extractor file:\n${cssFilePath}`
      }],
    };
  } catch (error) {
    return {
      content: [{ 
        type: "text", 
        text: `Error generating token extractor: ${error instanceof Error ? error.message : String(error)}` 
      }],
      isError: true,
    };
  }
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
 * Invert a color (used for dark mode)
 *
 * @param color Hex color code
 * @returns Inverted color
 */
function invertColor(color: string): string {
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
function toKebabCase(str: string): string {
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
function toCamelCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '')
    .replace(/^[A-Z]/, c => c.toLowerCase());
}

/**
 * Generate CSS tokens
 * 
 * @param name Component name
 * @param format CSS format (css, scss, less)
 * @param tokens Design tokens
 * @param extractorOptions Options for token extraction
 * @returns CSS content
 */
function generateCssTokens(
  name: string,
  format: string,
  tokens: {
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
  },
  extractorOptions: {
    prefix?: string;
    darkMode?: boolean;
    rtl?: boolean;
    cssVariables?: boolean;
    themeObject?: boolean;
    comments?: boolean;
  }
): string {
  const prefix = extractorOptions.prefix ? `${extractorOptions.prefix}-` : '';
  const hasDarkMode = extractorOptions.darkMode;
  const hasRtl = extractorOptions.rtl;
  const useComments = extractorOptions.comments;
  
  let content = '';
  
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
  
  return content;
}

