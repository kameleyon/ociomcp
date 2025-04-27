// Auto-generated safe fallback for index

export function activate() {
    console.log("[TOOL] index activated (passive mode)");
}

export function onFileWrite() { /* no-op */ }
export function onSessionStart() { /* no-op */ }
export function onCommand() { /* no-op */ }
/**
 * Flow Designer
 * 
 * Main exports for the Flow Designer system
 */

// Export main flow designer functions
export { default as FlowDesigner } from './flow-designer';
export { createFlowDesigner, updateFlowDesigner, validateFlowOptions } from './flow-designer';

// Export schema and interfaces
export { GenerateFlowSchema, FlowOptions } from './schema';

// Export utility functions
export { formatComponentName, toKebabCase } from './utils';

// Export generators
export { generateReactFlowDesigner } from './react-generator-core';
export { generateStepComponent } from './step-component-generator';
export { 
  generateBreadcrumbsComponent,
  generateProgressIndicatorComponent,
  generateNavigationComponent,
  generateSummaryComponent 
} from './navigation-component-generator';
export { 
  generateContextProvider,
  generateReduxStore,
  generateStateHooks 
} from './context-generator';
export { generateStyles } from './style-generator';
export { 
  generateValidationModule,
  generateValidationHooks,
  generateErrorComponent 
} from './validation-generator';

