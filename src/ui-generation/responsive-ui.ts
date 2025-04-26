/**
 * Responsive UI
 * 
 * Ensures highly responsive, modern, clean UI/UX
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { z } from 'zod';

/**
 * Schema for ResponsiveUI
 */
export const GenerateResponsiveUISchema = z.object({
  name: z.string(),
  framework: z.enum(['react', 'vue', 'angular', 'svelte', 'solid', 'html']).default('react'),
  styling: z.enum(['css', 'scss', 'less', 'styled-components', 'emotion', 'tailwind', 'none']).default('css'),
  typescript: z.boolean().default(true),
  outputDir: z.string().optional(),
  description: z.string().optional(),
  components: z.array(z.enum([
    'navbar', 'sidebar', 'footer', 'card', 'button', 'form', 'modal',
    'tabs', 'accordion', 'carousel', 'pagination', 'table', 'grid',
    'alert', 'toast', 'dropdown', 'breadcrumb', 'badge', 'avatar',
    'tooltip', 'progress', 'spinner', 'skeleton', 'all'
  ])).default(['navbar', 'card', 'button']),
  breakpoints: z.object({
    sm: z.string().optional().default('576px'),
    md: z.string().optional().default('768px'),
    lg: z.string().optional().default('992px'),
    xl: z.string().optional().default('1200px'),
    xxl: z.string().optional().default('1400px')
  }).optional(),
  theme: z.object({
    primaryColor: z.string().optional().default('#0070f3'),
    secondaryColor: z.string().optional().default('#6c757d'),
    successColor: z.string().optional().default('#28a745'),
    dangerColor: z.string().optional().default('#dc3545'),
    warningColor: z.string().optional().default('#ffc107'),
    infoColor: z.string().optional().default('#17a2b8'),
    lightColor: z.string().optional().default('#f8f9fa'),
    darkColor: z.string().optional().default('#343a40'),
    fontFamily: z.string().optional().default('system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'),
    borderRadius: z.string().optional().default('0.25rem'),
    boxShadow: z.string().optional().default('0 0.5rem 1rem rgba(0, 0, 0, 0.15)'),
    spacing: z.string().optional().default('1rem')
  }).optional(),
  features: z.array(z.enum([
    'dark-mode', 'rtl-support', 'grid-system', 'typography', 'animations',
    'accessibility', 'print-styles', 'utilities', 'normalize'
  ])).optional(),
  customization: z.object({
    prefix: z.string().optional().default('ui'),
    cssVariables: z.boolean().optional().default(true),
    minify: z.boolean().optional().default(false)
  }).optional()
});

/**
 * Responsive UI options interface
 */
interface ResponsiveUIOptions {
  name: string;
  framework: 'react' | 'vue' | 'angular' | 'svelte' | 'solid' | 'html';
  styling: 'css' | 'scss' | 'less' | 'styled-components' | 'emotion' | 'tailwind' | 'none';
  typescript: boolean;
  outputDir?: string;
  description?: string;
  components: string[];
  breakpoints?: {
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    xxl?: string;
  };
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
    successColor?: string;
    dangerColor?: string;
    warningColor?: string;
    infoColor?: string;
    lightColor?: string;
    darkColor?: string;
    fontFamily?: string;
    borderRadius?: string;
    boxShadow?: string;
    spacing?: string;
  };
  features?: string[];
  customization?: {
    prefix?: string;
    cssVariables?: boolean;
    minify?: boolean;
  };
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
 * Utility function to lighten a color by a percentage
 *
 * @param color Hex color code
 * @param percent Percentage to lighten
 * @returns Lightened color
 */
function lightenColor(color: string, percent: number): string {
  // Remove the # if present
  let hex = color.replace('#', '');
  
  // Convert to RGB
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);
  
  // Lighten
  r = Math.min(255, Math.round(r + (255 - r) * (percent / 100)));
  g = Math.min(255, Math.round(g + (255 - g) * (percent / 100)));
  b = Math.min(255, Math.round(b + (255 - b) * (percent / 100)));
  
  // Convert back to hex
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Generate responsive UI files
 *
 * @param options Responsive UI options
 * @returns Map of file paths to content
 */
function generateResponsiveUI(options: ResponsiveUIOptions): Map<string, string> {
  const {
    name,
    framework,
    styling,
    typescript,
    components,
    breakpoints = {
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
      xxl: '1400px'
    },
    theme = {
      primaryColor: '#0070f3',
      secondaryColor: '#6c757d',
      successColor: '#28a745',
      dangerColor: '#dc3545',
      warningColor: '#ffc107',
      infoColor: '#17a2b8',
      lightColor: '#f8f9fa',
      darkColor: '#343a40',
      fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      borderRadius: '0.25rem',
      boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)',
      spacing: '1rem'
    },
    features = [],
    customization = {
      prefix: 'ui',
      cssVariables: true,
      minify: false
    }
  } = options;

  const uiName = formatComponentName(name);
  const prefix = customization.prefix;
  const hasDarkMode = features.includes('dark-mode');
  const hasRtlSupport = features.includes('rtl-support');
  const hasGridSystem = features.includes('grid-system');
  const hasTypography = features.includes('typography');
  const hasAnimations = features.includes('animations');
  const hasAccessibility = features.includes('accessibility');
  const hasPrintStyles = features.includes('print-styles');
  const hasUtilities = features.includes('utilities');
  const hasNormalize = features.includes('normalize');
  const includeAllComponents = components.includes('all');
  
  const uiFiles = new Map<string, string>();
  
  // Generate variables file
  if (customization.cssVariables && (styling === 'css' || styling === 'scss' || styling === 'less')) {
    let variablesContent = '';
    
    if (styling === 'scss') {
      variablesContent = `// ${uiName} Variables
      
// Colors
$${prefix}-primary: ${theme.primaryColor};
$${prefix}-secondary: ${theme.secondaryColor};
$${prefix}-success: ${theme.successColor};
$${prefix}-danger: ${theme.dangerColor};
$${prefix}-warning: ${theme.warningColor};
$${prefix}-info: ${theme.infoColor};
$${prefix}-light: ${theme.lightColor};
$${prefix}-dark: ${theme.darkColor};

// Typography
$${prefix}-font-family: ${theme.fontFamily};
$${prefix}-font-size-base: 1rem;
$${prefix}-font-size-sm: 0.875rem;
$${prefix}-font-size-lg: 1.25rem;
$${prefix}-line-height-base: 1.5;
$${prefix}-font-weight-normal: 400;
$${prefix}-font-weight-bold: 700;

// Spacing
$${prefix}-spacing: ${theme.spacing};
$${prefix}-spacing-sm: calc(${theme.spacing} * 0.5);
$${prefix}-spacing-lg: calc(${theme.spacing} * 2);
$${prefix}-spacing-xl: calc(${theme.spacing} * 3);

// Borders
$${prefix}-border-radius: ${theme.borderRadius};
$${prefix}-border-radius-sm: calc(${theme.borderRadius} * 0.75);
$${prefix}-border-radius-lg: calc(${theme.borderRadius} * 1.5);
$${prefix}-border-width: 1px;
$${prefix}-border-color: rgba(0, 0, 0, 0.125);

// Shadows
$${prefix}-box-shadow: ${theme.boxShadow};
$${prefix}-box-shadow-sm: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
$${prefix}-box-shadow-lg: 0 1rem 3rem rgba(0, 0, 0, 0.175);

// Breakpoints
$${prefix}-breakpoint-sm: ${breakpoints.sm};
$${prefix}-breakpoint-md: ${breakpoints.md};
$${prefix}-breakpoint-lg: ${breakpoints.lg};
$${prefix}-breakpoint-xl: ${breakpoints.xl};
$${prefix}-breakpoint-xxl: ${breakpoints.xxl};

// Z-index
$${prefix}-zindex-dropdown: 1000;
$${prefix}-zindex-sticky: 1020;
$${prefix}-zindex-fixed: 1030;
$${prefix}-zindex-modal-backdrop: 1040;
$${prefix}-zindex-modal: 1050;
$${prefix}-zindex-popover: 1060;
$${prefix}-zindex-tooltip: 1070;

// Transitions
$${prefix}-transition-base: all 0.2s ease-in-out;
$${prefix}-transition-fade: opacity 0.15s linear;
$${prefix}-transition-collapse: height 0.35s ease;

${hasDarkMode ? `// Dark mode colors
$${prefix}-dark-bg: #121212;
$${prefix}-dark-text: #f8f9fa;
$${prefix}-dark-border: #343a40;
$${prefix}-dark-primary: lighten(${theme.primaryColor}, 10%);
$${prefix}-dark-secondary: lighten(${theme.secondaryColor}, 10%);` : ''}
`;
    } else if (styling === 'less') {
      variablesContent = `// ${uiName} Variables
      
// Colors
@${prefix}-primary: ${theme.primaryColor};
@${prefix}-secondary: ${theme.secondaryColor};
@${prefix}-success: ${theme.successColor};
@${prefix}-danger: ${theme.dangerColor};
@${prefix}-warning: ${theme.warningColor};
@${prefix}-info: ${theme.infoColor};
@${prefix}-light: ${theme.lightColor};
@${prefix}-dark: ${theme.darkColor};

// Typography
@${prefix}-font-family: ${theme.fontFamily};
@${prefix}-font-size-base: 1rem;
@${prefix}-font-size-sm: 0.875rem;
@${prefix}-font-size-lg: 1.25rem;
@${prefix}-line-height-base: 1.5;
@${prefix}-font-weight-normal: 400;
@${prefix}-font-weight-bold: 700;

// Spacing
@${prefix}-spacing: ${theme.spacing};
@${prefix}-spacing-sm: ${theme.spacing} * 0.5;
@${prefix}-spacing-lg: ${theme.spacing} * 2;
@${prefix}-spacing-xl: ${theme.spacing} * 3;

// Borders
@${prefix}-border-radius: ${theme.borderRadius};
@${prefix}-border-radius-sm: ${theme.borderRadius} * 0.75;
@${prefix}-border-radius-lg: ${theme.borderRadius} * 1.5;
@${prefix}-border-width: 1px;
@${prefix}-border-color: rgba(0, 0, 0, 0.125);

// Shadows
@${prefix}-box-shadow: ${theme.boxShadow};
@${prefix}-box-shadow-sm: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
@${prefix}-box-shadow-lg: 0 1rem 3rem rgba(0, 0, 0, 0.175);

// Breakpoints
@${prefix}-breakpoint-sm: ${breakpoints.sm};
@${prefix}-breakpoint-md: ${breakpoints.md};
@${prefix}-breakpoint-lg: ${breakpoints.lg};
@${prefix}-breakpoint-xl: ${breakpoints.xl};
@${prefix}-breakpoint-xxl: ${breakpoints.xxl};

// Z-index
@${prefix}-zindex-dropdown: 1000;
@${prefix}-zindex-sticky: 1020;
@${prefix}-zindex-fixed: 1030;
@${prefix}-zindex-modal-backdrop: 1040;
@${prefix}-zindex-modal: 1050;
@${prefix}-zindex-popover: 1060;
@${prefix}-zindex-tooltip: 1070;

// Transitions
@${prefix}-transition-base: all 0.2s ease-in-out;
@${prefix}-transition-fade: opacity 0.15s linear;
@${prefix}-transition-collapse: height 0.35s ease;

${hasDarkMode ? `// Dark mode colors
@${prefix}-dark-bg: #121212;
@${prefix}-dark-text: #f8f9fa;
@${prefix}-dark-border: #343a40;
@${prefix}-dark-primary: lighten(@${prefix}-primary, 10%);
@${prefix}-dark-secondary: lighten(@${prefix}-secondary, 10%);` : ''}
`;
    } else {
      variablesContent = `:root {
  /* Colors */
  --${prefix}-primary: ${theme.primaryColor};
  --${prefix}-secondary: ${theme.secondaryColor};
  --${prefix}-success: ${theme.successColor};
  --${prefix}-danger: ${theme.dangerColor};
  --${prefix}-warning: ${theme.warningColor};
  --${prefix}-info: ${theme.infoColor};
  --${prefix}-light: ${theme.lightColor};
  --${prefix}-dark: ${theme.darkColor};

  /* Typography */
  --${prefix}-font-family: ${theme.fontFamily};
  --${prefix}-font-size-base: 1rem;
  --${prefix}-font-size-sm: 0.875rem;
  --${prefix}-font-size-lg: 1.25rem;
  --${prefix}-line-height-base: 1.5;
  --${prefix}-font-weight-normal: 400;
  --${prefix}-font-weight-bold: 700;

  /* Spacing */
  --${prefix}-spacing: ${theme.spacing};
  --${prefix}-spacing-sm: calc(var(--${prefix}-spacing) * 0.5);
  --${prefix}-spacing-lg: calc(var(--${prefix}-spacing) * 2);
  --${prefix}-spacing-xl: calc(var(--${prefix}-spacing) * 3);

  /* Borders */
  --${prefix}-border-radius: ${theme.borderRadius};
  --${prefix}-border-radius-sm: calc(var(--${prefix}-border-radius) * 0.75);
  --${prefix}-border-radius-lg: calc(var(--${prefix}-border-radius) * 1.5);
  --${prefix}-border-width: 1px;
  --${prefix}-border-color: rgba(0, 0, 0, 0.125);

  /* Shadows */
  --${prefix}-box-shadow: ${theme.boxShadow};
  --${prefix}-box-shadow-sm: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  --${prefix}-box-shadow-lg: 0 1rem 3rem rgba(0, 0, 0, 0.175);

  /* Z-index */
  --${prefix}-zindex-dropdown: 1000;
  --${prefix}-zindex-sticky: 1020;
  --${prefix}-zindex-fixed: 1030;
  --${prefix}-zindex-modal-backdrop: 1040;
  --${prefix}-zindex-modal: 1050;
  --${prefix}-zindex-popover: 1060;
  --${prefix}-zindex-tooltip: 1070;

  /* Transitions */
  --${prefix}-transition-base: all 0.2s ease-in-out;
  --${prefix}-transition-fade: opacity 0.15s linear;
  --${prefix}-transition-collapse: height 0.35s ease;
}

${hasDarkMode ? `[data-theme="dark"] {
  --${prefix}-primary: ${lightenColor(theme.primaryColor || '#0070f3', 10)};
  --${prefix}-secondary: ${lightenColor(theme.secondaryColor || '#6c757d', 10)};
  --${prefix}-light: ${theme.darkColor};
  --${prefix}-dark: ${theme.lightColor};
  --${prefix}-border-color: rgba(255, 255, 255, 0.125);
  
  background-color: #121212;
  color: #f8f9fa;
}` : ''}
`;
    }
    
    const variablesExt = styling === 'scss' ? 'scss' : styling === 'less' ? 'less' : 'css';
    uiFiles.set(`_variables.${variablesExt}`, variablesContent);
  }
  
  // Generate mixins file for SCSS or LESS
  if (styling === 'scss' || styling === 'less') {
    let mixinsContent = '';
    
    if (styling === 'scss') {
      mixinsContent = `// ${uiName} Mixins

// Responsive breakpoint mixins
@mixin ${prefix}-media-breakpoint-up($breakpoint) {
  @if $breakpoint == sm {
    @media (min-width: $${prefix}-breakpoint-sm) { @content; }
  } @else if $breakpoint == md {
    @media (min-width: $${prefix}-breakpoint-md) { @content; }
  } @else if $breakpoint == lg {
    @media (min-width: $${prefix}-breakpoint-lg) { @content; }
  } @else if $breakpoint == xl {
    @media (min-width: $${prefix}-breakpoint-xl) { @content; }
  } @else if $breakpoint == xxl {
    @media (min-width: $${prefix}-breakpoint-xxl) { @content; }
  }
}

@mixin ${prefix}-media-breakpoint-down($breakpoint) {
  @if $breakpoint == sm {
    @media (max-width: $${prefix}-breakpoint-sm - 0.02) { @content; }
  } @else if $breakpoint == md {
    @media (max-width: $${prefix}-breakpoint-md - 0.02) { @content; }
  } @else if $breakpoint == lg {
    @media (max-width: $${prefix}-breakpoint-lg - 0.02) { @content; }
  } @else if $breakpoint == xl {
    @media (max-width: $${prefix}-breakpoint-xl - 0.02) { @content; }
  } @else if $breakpoint == xxl {
    @media (max-width: $${prefix}-breakpoint-xxl - 0.02) { @content; }
  }
}

// Flexbox mixins
@mixin ${prefix}-flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin ${prefix}-flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

// Typography mixins
@mixin ${prefix}-text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// Border mixins
@mixin ${prefix}-border-radius($radius: $${prefix}-border-radius) {
  border-radius: $radius;
}

// Transition mixins
@mixin ${prefix}-transition($transition: $${prefix}-transition-base) {
  transition: $transition;
}

// Box shadow mixins
@mixin ${prefix}-box-shadow($shadow: $${prefix}-box-shadow) {
  box-shadow: $shadow;
}

${hasRtlSupport ? `// RTL support mixins
@mixin ${prefix}-rtl {
  [dir="rtl"] & {
    @content;
  }
}

@mixin ${prefix}-ltr {
  [dir="ltr"] & {
    @content;
  }
}

@mixin ${prefix}-margin-start($value) {
  margin-left: $value;
  
  @include ${prefix}-rtl {
    margin-left: 0;
    margin-right: $value;
  }
}

@mixin ${prefix}-margin-end($value) {
  margin-right: $value;
  
  @include ${prefix}-rtl {
    margin-right: 0;
    margin-left: $value;
  }
}

@mixin ${prefix}-padding-start($value) {
  padding-left: $value;
  
  @include ${prefix}-rtl {
    padding-left: 0;
    padding-right: $value;
  }
}

@mixin ${prefix}-padding-end($value) {
  padding-right: $value;
  
  @include ${prefix}-rtl {
    padding-right: 0;
    padding-left: $value;
  }
}` : ''}

${hasAccessibility ? `// Accessibility mixins
@mixin ${prefix}-visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@mixin ${prefix}-focus-ring {
  outline: none;
  box-shadow: 0 0 0 0.25rem rgba($${prefix}-primary, 0.25);
}` : ''}
`;
    } else {
      mixinsContent = `// ${uiName} Mixins

// Responsive breakpoint mixins
.${prefix}-media-breakpoint-up(@breakpoint, @rules) {
  & when (@breakpoint = sm) {
    @media (min-width: @${prefix}-breakpoint-sm) { @rules(); }
  }
  & when (@breakpoint = md) {
    @media (min-width: @${prefix}-breakpoint-md) { @rules(); }
  }
  & when (@breakpoint = lg) {
    @media (min-width: @${prefix}-breakpoint-lg) { @rules(); }
  }
  & when (@breakpoint = xl) {
    @media (min-width: @${prefix}-breakpoint-xl) { @rules(); }
  }
  & when (@breakpoint = xxl) {
    @media (min-width: @${prefix}-breakpoint-xxl) { @rules(); }
  }
}

.${prefix}-media-breakpoint-down(@breakpoint, @rules) {
  & when (@breakpoint = sm) {
    @media (max-width: (@${prefix}-breakpoint-sm - 0.02)) { @rules(); }
  }
  & when (@breakpoint = md) {
    @media (max-width: (@${prefix}-breakpoint-md - 0.02)) { @rules(); }
  }
  & when (@breakpoint = lg) {
    @media (max-width: (@${prefix}-breakpoint-lg - 0.02)) { @rules(); }
  }
  & when (@breakpoint = xl) {
    @media (max-width: (@${prefix}-breakpoint-xl - 0.02)) { @rules(); }
  }
  
  // Add return statement to fix the TypeScript error
  return uiFiles;
  & when (@breakpoint = xxl) {
    @media (max-width: (@${prefix}-breakpoint-xxl - 0.02)) { @rules(); }
  }
}

// Flexbox mixins
.${prefix}-flex-center() {
  display: flex;
  align-items: center;
  justify-content: center;
}

.${prefix}-flex-between() {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

// Typography mixins
.${prefix}-text-truncate() {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// Border mixins
.${prefix}-border-radius(@radius: @${prefix}-border-radius) {
  border-radius: @radius;
}

// Transition mixins
.${prefix}-transition(@transition: @${prefix}-transition-base) {
  transition: @transition;
}

// Box shadow mixins
.${prefix}-box-shadow(@shadow: @${prefix}-box-shadow) {
  box-shadow: @shadow;
}

${hasRtlSupport ? `// RTL support mixins
.${prefix}-rtl(@rules) {
  [dir="rtl"] & {
    @rules();
  }
}

.${prefix}-ltr(@rules) {
  [dir="ltr"] & {
    @rules();
  }
}

.${prefix}-margin-start(@value) {
  margin-left: @value;
  
  .${prefix}-rtl({
    margin-left: 0;
    margin-right: @value;
  });
}

.${prefix}-margin-end(@value) {
  margin-right: @value;
  
  .${prefix}-rtl({
    margin-right: 0;
    margin-left: @value;
  });
}

.${prefix}-padding-start(@value) {
  padding-left: @value;
  
  .${prefix}-rtl({
    padding-left: 0;
    padding-right: @value;
  });
}

.${prefix}-padding-end(@value) {
  padding-right: @value;
  
  .${prefix}-rtl({
    padding-right: 0;
    padding-left: @value;
  });
}` : ''}

${hasAccessibility ? `// Accessibility mixins
.${prefix}-visually-hidden() {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.${prefix}-focus-ring() {
  outline: none;
  box-shadow: 0 0 0 0.25rem fade(@${prefix}-primary, 25%);
}` : ''}
`;
    }
    
    const mixinsExt = styling === 'scss' ? 'scss' : 'less';
    uiFiles.set(`_mixins.${mixinsExt}`, mixinsContent);
  }
  
  // Generate normalize/reset CSS
  if (hasNormalize && (styling === 'css' || styling === 'scss' || styling === 'less')) {
    let normalizeContent = '';
    
    if (styling === 'scss') {
      normalizeContent = `// ${uiName} Normalize/Reset

// Box sizing
html {
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: inherit;
}

// Body reset
body {
  margin: 0;
  font-family: $${prefix}-font-family;
  font-size: $${prefix}-font-size-base;
  font-weight: $${prefix}-font-weight-normal;
  line-height: $${prefix}-line-height-base;
  color: $${prefix}-dark;
  background-color: #fff;
  -webkit-text-size-adjust: 100%;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

// Reset margins
h1, h2, h3, h4, h5, h6,
p, ol, ul, dl, figure,
blockquote, fieldset, legend {
  margin: 0 0 $${prefix}-spacing;
}

// Lists
ol, ul {
  padding-left: 2rem;
}

// Links
a {
  color: $${prefix}-primary;
  text-decoration: none;
  
  &:hover {
    color: darken($${prefix}-primary, 10%);
    text-decoration: underline;
  }
}

// Images
img {
  max-width: 100%;
  height: auto;
  vertical-align: middle;
}

// Tables
table {
  border-collapse: collapse;
}

// Forms
button,
input,
optgroup,
select,
textarea {
  margin: 0;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
}

button,
[type="button"],
[type="reset"],
[type="submit"] {
  -webkit-appearance: button;
}

// Remove inner border and padding from Firefox buttons
::-moz-focus-inner {
  padding: 0;
  border-style: none;
}

// Correct the cursor style of increment and decrement buttons in Safari
::-webkit-inner-spin-button,
::-webkit-outer-spin-button {
  height: auto;
}

// Correct the odd appearance of search inputs in Chrome and Safari
[type="search"] {
  -webkit-appearance: textfield;
  outline-offset: -2px;
}

// Remove the inner padding in Chrome and Safari on macOS
::-webkit-search-decoration {
  -webkit-appearance: none;
}

// Correct the inability to style clickable types in iOS and Safari
::-webkit-file-upload-button {
  -webkit-appearance: button;
  font: inherit;
}

// Textarea
textarea {
  resize: vertical;
}

// Fieldset
fieldset {
  min-width: 0;
  padding: 0;
  margin: 0;
  border: 0;
}
`;
    } else if (styling === 'less') {
      normalizeContent = `// ${uiName} Normalize/Reset

// Box sizing
html {
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: inherit;
}

// Body reset
body {
  margin: 0;
  font-family: @${prefix}-font-family;
  font-size: @${prefix}-font-size-base;
  font-weight: @${prefix}-font-weight-normal;
  line-height: @${prefix}-line-height-base;
  color: @${prefix}-dark;
  background-color: #fff;
  -webkit-text-size-adjust: 100%;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

// Reset margins
h1, h2, h3, h4, h5, h6,
p, ol, ul, dl, figure,
blockquote, fieldset, legend {
  margin: 0 0 @${prefix}-spacing;
}

// Lists
ol, ul {
  padding-left: 2rem;
}

// Links
a {
  color: @${prefix}-primary;
  text-decoration: none;
}
`;
    }
    
    // Add normalize CSS file to uiFiles
    const normalizeExt = styling === 'scss' ? 'scss' : styling === 'less' ? 'less' : 'css';
    uiFiles.set(`_normalize.${normalizeExt}`, normalizeContent);
  }
  
  // Return the generated UI files
  return uiFiles;
}
