// Auto-generated safe fallback for style-generator

export function activate() {
    console.log("[TOOL] style-generator activated (passive mode)");
}

export function onFileWrite() { /* no-op */ }
export function onSessionStart() { /* no-op */ }
export function onCommand() { /* no-op */ }
/**
 * Style Generator
 * 
 * Generates styles for flow designer components
 */

import { FlowOptions } from './schema';
import { toKebabCase } from './utils';

/**
 * Generate base CSS styles
 * 
 * @param options Flow options
 * @returns CSS string
 */
export function generateBaseStyles(options: FlowOptions): string {
  const { theme } = options;
  
  const primaryColor = theme?.primaryColor || '#3182ce';
  const secondaryColor = theme?.secondaryColor || '#718096';
  const fontFamily = theme?.fontFamily || 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  const borderRadius = theme?.borderRadius || '0.25rem';
  const spacing = theme?.spacing || '1rem';
  
  return `/* Flow Designer Base Styles */
:root {
  --flow-primary-color: ${primaryColor};
  --flow-secondary-color: ${secondaryColor};
  --flow-font-family: ${fontFamily};
  --flow-border-radius: ${borderRadius};
  --flow-spacing: ${spacing};
  --flow-transition: all 0.3s ease;
  
  --flow-success-color: #38a169;
  --flow-error-color: #e53e3e;
  --flow-warning-color: #ed8936;
  --flow-info-color: #4299e1;
  
  --flow-border-color: #e2e8f0;
  --flow-background-color: #f7fafc;
  --flow-text-color: #2d3748;
  --flow-text-light-color: #4a5568;
}

/* Container styles */
.flow-container {
  font-family: var(--flow-font-family);
  max-width: 800px;
  margin: 0 auto;
  padding: var(--flow-spacing);
  color: var(--flow-text-color);
}

/* Form elements */
.form-group {
  margin-bottom: var(--flow-spacing);
}

.form-group label {
  display: block;
  margin-bottom: calc(var(--flow-spacing) / 2);
  font-weight: 500;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: calc(var(--flow-spacing) / 2);
  border: 1px solid var(--flow-border-color);
  border-radius: var(--flow-border-radius);
  font-family: var(--flow-font-family);
  font-size: 1rem;
  transition: var(--flow-transition);
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--flow-primary-color);
  box-shadow: 0 0 0 2px rgba(var(--flow-primary-color-rgb), 0.2);
}

/* Buttons */
button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: calc(var(--flow-spacing) / 2) var(--flow-spacing);
  background-color: var(--flow-primary-color);
  color: white;
  border: none;
  border-radius: var(--flow-border-radius);
  font-family: var(--flow-font-family);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--flow-transition);
}

button:hover {
  background-color: var(--flow-primary-color-dark);
}

button:disabled {
  background-color: var(--flow-secondary-color);
  cursor: not-allowed;
  opacity: 0.7;
}

button svg {
  margin-right: calc(var(--flow-spacing) / 4);
}

.back-button {
  background-color: transparent;
  color: var(--flow-text-color);
  border: 1px solid var(--flow-border-color);
}

.back-button:hover {
  background-color: var(--flow-background-color);
}

/* Step navigation */
.step-navigation {
  display: flex;
  justify-content: space-between;
  margin-top: var(--flow-spacing);
}`;
}

/**
 * Generate styles for breadcrumbs component
 * 
 * @param options Flow options
 * @returns CSS string
 */
export function generateBreadcrumbsStyles(options: FlowOptions): string {
  return `
/* Breadcrumbs styles */
.flow-breadcrumbs {
  margin-bottom: var(--flow-spacing);
}

.flow-breadcrumbs ol {
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  padding: 0;
  margin: 0;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
}

.breadcrumb-item .separator {
  margin: 0 calc(var(--flow-spacing) / 2);
  color: var(--flow-text-light-color);
}

.breadcrumb-link {
  background: transparent;
  border: none;
  padding: calc(var(--flow-spacing) / 4) calc(var(--flow-spacing) / 2);
  font-size: 0.875rem;
  color: var(--flow-text-light-color);
  cursor: pointer;
  border-radius: var(--flow-border-radius);
}

.breadcrumb-link:hover:not(.disabled) {
  background-color: var(--flow-background-color);
  color: var(--flow-primary-color);
}

.breadcrumb-item.active .breadcrumb-link {
  color: var(--flow-primary-color);
  font-weight: 500;
}

.breadcrumb-item.completed .breadcrumb-link {
  color: var(--flow-success-color);
}

.breadcrumb-link.disabled {
  cursor: not-allowed;
  opacity: 0.5;
}`;
}

/**
 * Generate styles for progress indicator component
 * 
 * @param options Flow options
 * @returns CSS string
 */
export function generateProgressIndicatorStyles(options: FlowOptions): string {
  return `
/* Progress indicator styles */
.progress-indicator-container {
  margin-bottom: var(--flow-spacing);
}

.step-indicators {
  display: flex;
  justify-content: space-between;
  position: relative;
  margin-bottom: calc(var(--flow-spacing) / 2);
}

.indicator-line {
  position: absolute;
  top: 50%;
  height: 2px;
  background-color: var(--flow-border-color);
  z-index: 1;
}

.indicator-line.completed {
  background-color: var(--flow-primary-color);
}

.step-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
}

.indicator-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: white;
  border: 2px solid var(--flow-border-color);
  font-weight: 500;
  margin-bottom: calc(var(--flow-spacing) / 4);
}

.step-indicator.active .indicator-circle {
  border-color: var(--flow-primary-color);
  color: var(--flow-primary-color);
}

.step-indicator.completed .indicator-circle {
  background-color: var(--flow-primary-color);
  border-color: var(--flow-primary-color);
  color: white;
}

.indicator-label {
  font-size: 0.75rem;
  text-align: center;
  color: var(--flow-text-light-color);
}

.step-indicator.active .indicator-label {
  color: var(--flow-primary-color);
  font-weight: 500;
}

.progress-bar-container {
  height: 8px;
  background-color: var(--flow-border-color);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: calc(var(--flow-spacing) / 4);
}

.progress-bar {
  height: 100%;
  background-color: var(--flow-primary-color);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.75rem;
  color: var(--flow-text-light-color);
  text-align: right;
}`;
}

/**
 * Generate styles for summary component
 * 
 * @param options Flow options
 * @returns CSS string
 */
export function generateSummaryStyles(options: FlowOptions): string {
  return `
/* Summary view styles */
.summary-view {
  margin-bottom: var(--flow-spacing);
}

.summary-sections {
  margin-top: var(--flow-spacing);
}

.summary-section {
  border: 1px solid var(--flow-border-color);
  border-radius: var(--flow-border-radius);
  padding: var(--flow-spacing);
  margin-bottom: var(--flow-spacing);
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: calc(var(--flow-spacing) / 2);
}

.summary-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 500;
}

.edit-button {
  background-color: transparent;
  color: var(--flow-primary-color);
  padding: calc(var(--flow-spacing) / 4);
  margin: 0;
}

.edit-button:hover {
  background-color: rgba(var(--flow-primary-color-rgb), 0.1);
}

.summary-content dl {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: calc(var(--flow-spacing) / 2);
}

.summary-item dt {
  font-weight: 500;
  color: var(--flow-text-light-color);
}

.summary-item dd {
  margin: 0;
}

.summary-actions {
  margin-top: var(--flow-spacing);
  display: flex;
  justify-content: flex-end;
}`;
}

/**
 * Generate responsive styles
 * 
 * @param options Flow options
 * @returns CSS string
 */
export function generateResponsiveStyles(options: FlowOptions): string {
  if (!options.responsive) {
    return '';
  }
  
  return `
/* Responsive styles */
@media (max-width: 768px) {
  .flow-container {
    padding: calc(var(--flow-spacing) / 2);
  }
  
  .step-indicators {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .step-indicator {
    flex-direction: row;
    margin-bottom: calc(var(--flow-spacing) / 2);
  }
  
  .indicator-label {
    margin-left: calc(var(--flow-spacing) / 2);
  }
  
  .indicator-line {
    display: none;
  }
  
  .summary-content dl {
    grid-template-columns: 1fr;
  }
  
  .summary-item {
    margin-bottom: calc(var(--flow-spacing) / 2);
  }
}

@media (max-width: 480px) {
  .step-navigation {
    flex-direction: column;
    gap: calc(var(--flow-spacing) / 2);
  }
  
  .back-button,
  .next-button,
  .submit-button {
    width: 100%;
  }
}`;
}

/**
 * Generate styles for a specific framework
 * 
 * @param options Flow options
 * @returns Style code string based on the chosen framework and styling option
 */
export function generateFrameworkStyles(options: FlowOptions): string {
  const { framework, styling } = options;
  
  if (framework === 'react') {
    if (styling === 'styled-components') {
      return generateStyledComponentsStyles(options);
    } else if (styling === 'emotion') {
      return generateEmotionStyles(options);
    } else if (styling === 'tailwind') {
      return generateTailwindConfig(options);
    }
  }
  
  // Default to CSS/SCSS/LESS
  const baseStyles = generateBaseStyles(options);
  const breadcrumbsStyles = generateBreadcrumbsStyles(options);
  const progressStyles = generateProgressIndicatorStyles(options);
  const summaryStyles = generateSummaryStyles(options);
  const responsiveStyles = generateResponsiveStyles(options);
  
  return `${baseStyles}${breadcrumbsStyles}${progressStyles}${summaryStyles}${responsiveStyles}`;
}

/**
 * Generate styled-components styles
 * 
 * @param options Flow options
 * @returns Styled-components code string
 */
function generateStyledComponentsStyles(options: FlowOptions): string {
  const { theme } = options;
  
  const primaryColor = theme?.primaryColor || '#3182ce';
  const secondaryColor = theme?.secondaryColor || '#718096';
  
  return `import styled from 'styled-components';

// Theme variables
export const flowTheme = {
  primaryColor: '${primaryColor}',
  secondaryColor: '${secondaryColor}',
  fontFamily: '${theme?.fontFamily || 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'}',
  borderRadius: '${theme?.borderRadius || '0.25rem'}',
  spacing: '${theme?.spacing || '1rem'}',
  transition: 'all 0.3s ease',
  
  successColor: '#38a169',
  errorColor: '#e53e3e',
  warningColor: '#ed8936',
  infoColor: '#4299e1',
  
  borderColor: '#e2e8f0',
  backgroundColor: '#f7fafc',
  textColor: '#2d3748',
  textLightColor: '#4a5568',
};

// Container
export const FlowContainer = styled.div\`
  font-family: \${props => props.theme.fontFamily};
  max-width: 800px;
  margin: 0 auto;
  padding: \${props => props.theme.spacing};
  color: \${props => props.theme.textColor};
\`;

// Form elements
export const FormGroup = styled.div\`
  margin-bottom: \${props => props.theme.spacing};
\`;

export const Label = styled.label\`
  display: block;
  margin-bottom: calc(\${props => props.theme.spacing} / 2);
  font-weight: 500;
\`;

export const Input = styled.input\`
  width: 100%;
  padding: calc(\${props => props.theme.spacing} / 2);
  border: 1px solid \${props => props.theme.borderColor};
  border-radius: \${props => props.theme.borderRadius};
  font-family: \${props => props.theme.fontFamily};
  font-size: 1rem;
  transition: \${props => props.theme.transition};
  
  &:focus {
    outline: none;
    border-color: \${props => props.theme.primaryColor};
    box-shadow: 0 0 0 2px rgba(\${props => props.theme.primaryColor}, 0.2);
  }
\`;

// Buttons
export const Button = styled.button\`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: calc(\${props => props.theme.spacing} / 2) \${props => props.theme.spacing};
  background-color: \${props => props.theme.primaryColor};
  color: white;
  border: none;
  border-radius: \${props => props.theme.borderRadius};
  font-family: \${props => props.theme.fontFamily};
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: \${props => props.theme.transition};
  
  &:hover {
    background-color: \${props => props.theme.primaryColorDark};
  }
  
  &:disabled {
    background-color: \${props => props.theme.secondaryColor};
    cursor: not-allowed;
    opacity: 0.7;
  }
  
  svg {
    margin-right: calc(\${props => props.theme.spacing} / 4);
  }
\`;

export const BackButton = styled(Button)\`
  background-color: transparent;
  color: \${props => props.theme.textColor};
  border: 1px solid \${props => props.theme.borderColor};
  
  &:hover {
    background-color: \${props => props.theme.backgroundColor};
  }
\`;

// Navigation
export const StepNavigation = styled.div\`
  display: flex;
  justify-content: space-between;
  margin-top: \${props => props.theme.spacing};
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: calc(\${props => props.theme.spacing} / 2);
    
    button {
      width: 100%;
    }
  }
\`;

// Add more styled components for other elements as needed...
`;
}

/**
 * Generate Emotion styles
 * 
 * @param options Flow options
 * @returns Emotion CSS code string
 */
function generateEmotionStyles(options: FlowOptions): string {
  const { theme } = options;
  
  const primaryColor = theme?.primaryColor || '#3182ce';
  const secondaryColor = theme?.secondaryColor || '#718096';
  
  return `/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

// Theme variables
export const flowTheme = {
  primaryColor: '${primaryColor}',
  secondaryColor: '${secondaryColor}',
  fontFamily: '${theme?.fontFamily || 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'}',
  borderRadius: '${theme?.borderRadius || '0.25rem'}',
  spacing: '${theme?.spacing || '1rem'}',
  transition: 'all 0.3s ease',
  
  successColor: '#38a169',
  errorColor: '#e53e3e',
  warningColor: '#ed8936',
  infoColor: '#4299e1',
  
  borderColor: '#e2e8f0',
  backgroundColor: '#f7fafc',
  textColor: '#2d3748',
  textLightColor: '#4a5568',
};

// Container styles
export const flowContainer = css\`
  font-family: \${flowTheme.fontFamily};
  max-width: 800px;
  margin: 0 auto;
  padding: \${flowTheme.spacing};
  color: \${flowTheme.textColor};
\`;

// Form elements
export const formGroup = css\`
  margin-bottom: \${flowTheme.spacing};
\`;

export const label = css\`
  display: block;
  margin-bottom: calc(\${flowTheme.spacing} / 2);
  font-weight: 500;
\`;

export const input = css\`
  width: 100%;
  padding: calc(\${flowTheme.spacing} / 2);
  border: 1px solid \${flowTheme.borderColor};
  border-radius: \${flowTheme.borderRadius};
  font-family: \${flowTheme.fontFamily};
  font-size: 1rem;
  transition: \${flowTheme.transition};
  
  &:focus {
    outline: none;
    border-color: \${flowTheme.primaryColor};
    box-shadow: 0 0 0 2px rgba(\${flowTheme.primaryColor}, 0.2);
  }
\`;

// Buttons
export const button = css\`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: calc(\${flowTheme.spacing} / 2) \${flowTheme.spacing};
  background-color: \${flowTheme.primaryColor};
  color: white;
  border: none;
  border-radius: \${flowTheme.borderRadius};
  font-family: \${flowTheme.fontFamily};
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: \${flowTheme.transition};
  
  &:hover {
    background-color: \${flowTheme.primaryColorDark};
  }
  
  &:disabled {
    background-color: \${flowTheme.secondaryColor};
    cursor: not-allowed;
    opacity: 0.7;
  }
  
  svg {
    margin-right: calc(\${flowTheme.spacing} / 4);
  }
\`;

export const backButton = css\`
  \${button}
  background-color: transparent;
  color: \${flowTheme.textColor};
  border: 1px solid \${flowTheme.borderColor};
  
  &:hover {
    background-color: \${flowTheme.backgroundColor};
  }
\`;

// Navigation
export const stepNavigation = css\`
  display: flex;
  justify-content: space-between;
  margin-top: \${flowTheme.spacing};
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: calc(\${flowTheme.spacing} / 2);
    
    button {
      width: 100%;
    }
  }
\`;

// Add more emotion styles for other elements as needed...
`;
}

/**
 * Generate Tailwind CSS configuration
 * 
 * @param options Flow options
 * @returns Tailwind config string
 */
function generateTailwindConfig(options: FlowOptions): string {
  const { theme } = options;
  
  const primaryColor = theme?.primaryColor || '#3182ce';
  const secondaryColor = theme?.secondaryColor || '#718096';
  
  return `// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'flow-primary': '${primaryColor}',
        'flow-secondary': '${secondaryColor}',
        'flow-success': '#38a169',
        'flow-error': '#e53e3e',
        'flow-warning': '#ed8936',
        'flow-info': '#4299e1',
        'flow-border': '#e2e8f0',
        'flow-background': '#f7fafc',
        'flow-text': '#2d3748',
        'flow-text-light': '#4a5568',
      },
      fontFamily: {
        flow: '${theme?.fontFamily || 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'}',
      },
      borderRadius: {
        flow: '${theme?.borderRadius || '0.25rem'}',
      },
      spacing: {
        flow: '${theme?.spacing || '1rem'}',
      },
    },
  },
  plugins: [],
};

// Example Tailwind CSS class utility for use in components:
// const tailwindClasses = {
//   flowContainer: 'font-flow max-w-3xl mx-auto p-flow text-flow-text',
//   formGroup: 'mb-flow',
//   label: 'block mb-flow/2 font-medium',
//   input: 'w-full p-flow/2 border border-flow-border rounded-flow font-flow text-base transition-all focus:outline-none focus:border-flow-primary focus:ring-2 focus:ring-flow-primary focus:ring-opacity-20',
//   button: 'inline-flex items-center justify-center py-flow/2 px-flow bg-flow-primary text-white border-none rounded-flow font-flow text-base font-medium cursor-pointer transition-all hover:bg-flow-primary/90 disabled:bg-flow-secondary disabled:cursor-not-allowed disabled:opacity-70',
//   backButton: 'inline-flex items-center justify-center py-flow/2 px-flow bg-transparent text-flow-text border border-flow-border rounded-flow font-flow text-base font-medium cursor-pointer transition-all hover:bg-flow-background',
//   stepNavigation: 'flex justify-between mt-flow sm:flex-row flex-col sm:gap-0 gap-flow/2',
// };
`;
}

/**
 * Generate complete styles for the flow designer
 * 
 * @param options Flow options
 * @returns Complete style code string
 */
export function generateStyles(options: FlowOptions): string {
  const { styling } = options;
  
  // Generate styles based on the styling option
  switch (styling) {
    case 'styled-components':
      return generateStyledComponentsStyles(options);
    case 'emotion':
      return generateEmotionStyles(options);
    case 'tailwind':
      return generateTailwindConfig(options);
    case 'scss':
      return `// SCSS version of the styles
${generateFrameworkStyles(options)}`;
    case 'less':
      return `// LESS version of the styles
${generateFrameworkStyles(options)}`;
    default:
      return `/* CSS styles */
${generateFrameworkStyles(options)}`;
  }
}
