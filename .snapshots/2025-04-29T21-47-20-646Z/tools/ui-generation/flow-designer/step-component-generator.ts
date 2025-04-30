// Auto-generated safe fallback for step-component-generator

export function activate() {
    console.log("[TOOL] step-component-generator activated (passive mode)");
}

export function onFileWrite() { /* no-op */ }
export function onSessionStart() { /* no-op */ }
export function onCommand() { /* no-op */ }
/**
 * Step Component Generator
 * 
 * Generates React step components for the flow designer
 */

import { FlowOptions } from './schema';
import { formatComponentName, toKebabCase } from './utils';

/**
 * Generate base imports for a step component
 * 
 * @param options Flow options
 * @returns Import statements string
 */
export function generateStepImports(
  options: FlowOptions,
  stepIndex: number
): string {
  const { typescript, stateManagement } = options;
  const step = options.steps[stepIndex];
  
  let imports = `import React${typescript ? ', { FC }' : ''} from 'react';\n`;
  
  // Add state management imports
  if (stateManagement === 'context') {
    imports += `import { useFlowContext } from '../context/FlowContext';\n`;
  }
  
  // Add feature-specific imports
  if (options.features?.includes('validation')) {
    imports += `import { validateStep } from '../utils/validation';\n`;
  }
  
  return imports;
}

/**
 * Generate the types for a step component
 * 
 * @param options Flow options
 * @param stepIndex Index of the step
 * @returns Type definitions string or empty string if not using TypeScript
 */
export function generateStepTypes(
  options: FlowOptions,
  stepIndex: number
): string {
  if (!options.typescript) {
    return '';
  }
  
  const step = options.steps[stepIndex];
  
  return `
interface ${formatComponentName(step.id)}Props {
  onNext: (data?: any) => void;
  onBack?: () => void;
  data?: any;
}
`;
}

/**
 * Generate the content for a step component
 * 
 * @param options Flow options
 * @param stepIndex Index of the step
 * @returns Component content string
 */
export function generateStepContent(
  options: FlowOptions,
  stepIndex: number
): string {
  const { typescript, stateManagement } = options;
  const step = options.steps[stepIndex];
  const componentName = formatComponentName(step.id);
  
  let content = '';
  
  // Generate component opening
  if (typescript) {
    content += `const ${componentName}: FC<${componentName}Props> = ({ onNext, onBack, data }) => {\n`;
  } else {
    content += `const ${componentName} = ({ onNext, onBack, data }) => {\n`;
  }
  
  // Generate state management if needed
  if (stateManagement === 'context') {
    content += `  const { state, updateState } = useFlowContext();\n`;
  }
  
  // Generate component state and handlers
  content += `  const [formData, setFormData] = React.useState(data || {});\n`;
  
  content += `
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
`;

  // Add validation if needed
  if (options.features?.includes('validation') && step.validationRules?.length) {
    content += `    const errors = validateStep('${step.id}', formData);
    if (Object.keys(errors).length > 0) {
      // Handle validation errors
      console.error('Validation errors:', errors);
      return;
    }
`;
  }

  // Add state update and navigation
  if (stateManagement === 'context') {
    content += `    updateState({ ...state, ${step.id}: formData });\n`;
  }
  content += `    onNext(formData);\n`;
  content += `  };\n\n`;

  // Generate the UI
  content += `  return (
    <div className="${toKebabCase(step.id)}-step">
      <h2>${step.title}</h2>
      ${step.description ? `<p>${step.description}</p>` : ''}
      <form onSubmit={handleSubmit}>
        {/* Step content will be implemented based on specific requirements */}
        <div className="form-content">
          {/* Placeholder for form fields */}
          <div className="form-group">
            <label htmlFor="field1">Field 1</label>
            <input
              type="text"
              id="field1"
              name="field1"
              value={formData.field1 || ''}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="step-navigation">
          ${!step.isInitial ? `<button type="button" onClick={onBack}>Back</button>` : ''}
          <button type="submit">${step.isFinal ? 'Finish' : 'Next'}</button>
        </div>
      </form>
    </div>
  );`;
  
  // Close the component
  content += `\n};\n\nexport default ${componentName};\n`;
  
  return content;
}

/**
 * Generate a complete step component
 * 
 * @param options Flow options
 * @param stepIndex Index of the step
 * @returns Complete component file content
 */
export function generateStepComponent(
  options: FlowOptions,
  stepIndex: number
): string {
  const step = options.steps[stepIndex];
  
  const imports = generateStepImports(options, stepIndex);
  const types = generateStepTypes(options, stepIndex);
  const content = generateStepContent(options, stepIndex);
  
  return `${imports}\n${types}\n${content}`;
}
