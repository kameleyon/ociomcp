/**
 * React Generator Core
 * 
 * Main module for generating React flow designer components
 */

import { FlowOptions } from './schema';
import { formatComponentName, toKebabCase } from './utils';
import { generateStepComponent } from './step-component-generator';
import {
  generateBreadcrumbsComponent,
  generateProgressIndicatorComponent,
  generateNavigationComponent,
  generateSummaryComponent
} from './navigation-component-generator';
import { generateContextProvider, generateReduxStore, generateStateHooks } from './context-generator';
import { generateStyles } from './style-generator';
import { generateValidationModule, generateValidationHooks, generateErrorComponent } from './validation-generator';

/**
 * Generate main flow container component
 * 
 * @param options Flow options
 * @returns Flow container component code string
 */
export function generateFlowContainer(options: FlowOptions): string {
  const { typescript, stateManagement, features = [] } = options;
  
  let imports = `import React, { useState${typescript ? ', FC, ReactNode' : ''} } from 'react';\n`;
  
  // Add state management imports
  if (stateManagement === 'context') {
    imports += `import { FlowProvider, useFlowContext } from './context/FlowContext';\n`;
  } else if (stateManagement === 'redux') {
    imports += `import { Provider } from 'react-redux';\nimport { store } from './store/store';\nimport { useFlow } from './hooks/useFlow';\n`;
  }
  
  // Add feature imports
  if (features.includes('breadcrumbs')) {
    imports += `import FlowBreadcrumbs from './components/FlowBreadcrumbs';\n`;
  }
  
  if (features.includes('progress-indicator')) {
    imports += `import ProgressIndicator from './components/ProgressIndicator';\n`;
  }
  
  if (features.includes('summary-view')) {
    imports += `import SummaryView from './components/SummaryView';\n`;
  }
  
  // Add step imports
  options.steps.forEach(step => {
    imports += `import ${formatComponentName(step.id)} from './steps/${formatComponentName(step.id)}';\n`;
  });
  
  // TypeScript interfaces
  let types = '';
  if (typescript) {
    types = `
interface ${formatComponentName(options.name)}Props {
  onComplete?: (data: Record<string, any>) => void;
  initialData?: Record<string, any>;
  initialStep?: number;
}`;
  }
  
  // Render method
  let renderMethod = '';
  if (typescript) {
    renderMethod = `
  const renderStep = (): ReactNode => {
    switch (currentStep) {`;
  } else {
    renderMethod = `
  const renderStep = () => {
    switch (currentStep) {`;
  }
  
  options.steps.forEach((step, index) => {
    const componentName = formatComponentName(step.id);
    renderMethod += `
      case ${index}:
        return (
          <${componentName}
            onNext={(data) => {
              if (data) {
                updateStepData('${step.id}', data);
              }
              goToNextStep();
            }}
            ${!step.isInitial ? `onBack={goToPreviousStep}` : ''}
            data={stepData['${step.id}']}
          />
        );`;
  });
  
  renderMethod += `
      default:
        return null;
    }
  };`;
  
  // Component body
  let component = '';
  if (typescript) {
    component = `
const ${formatComponentName(options.name)}Flow: FC<${formatComponentName(options.name)}Props> = ({
  onComplete,
  initialData = {},
  initialStep = 0
}) => {`;
  } else {
    component = `
const ${formatComponentName(options.name)}Flow = ({
  onComplete,
  initialData = {},
  initialStep = 0
}) => {`;
  }
  
  // State and hooks
  if (stateManagement === 'context') {
    component += `
  const {
    currentStep,
    state: stepData,
    updateState: updateStepData,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    isFirstStep,
    isLastStep,
    progress
  } = useFlowContext();`;
  } else if (stateManagement === 'redux') {
    component += `
  const {
    currentStep,
    stepData,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    updateStepData,
    isFirstStep,
    isLastStep,
    progress
  } = useFlow();`;
  } else {
    component += `
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [stepData, setStepData] = useState(initialData);
  
  // Navigation helpers
  const goToNextStep = () => {
    if (currentStep < ${options.steps.length - 1}) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const goToStep = (step${typescript ? ': number' : ''}) => {
    if (step >= 0 && step < ${options.steps.length}) {
      setCurrentStep(step);
    }
  };
  
  const updateStepData = (stepId${typescript ? ': string' : ''}, data${typescript ? ': any' : ''}) => {
    setStepData({
      ...stepData,
      [stepId]: data
    });
  };
  
  // Navigation state
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === ${options.steps.length - 1};
  const progress = Math.round((currentStep / (${options.steps.length} - 1)) * 100);`;
  }
  
  // Complete flow handler
  component += `
  
  const handleComplete = () => {
    if (onComplete) {
      onComplete(stepData);
    }
  };`;
  
  // Generate steps data for navigation components
  component += `
  
  // Prepare steps data for navigation components
  const stepsData = [
    ${options.steps.map((step, index) => `{ id: '${step.id}', title: '${step.title}', isActive: currentStep === ${index}, isCompleted: currentStep > ${index} }`).join(',\n    ')}
  ];`;
  
  // Render UI
  component += `
  
  return (
    <div className="flow-container ${toKebabCase(options.name)}-flow">
      ${features.includes('breadcrumbs') ? `
      <FlowBreadcrumbs 
        steps={stepsData}
        onStepClick={(stepId) => {
          const index = stepsData.findIndex(s => s.id === stepId);
          if (index >= 0 && index < currentStep) {
            goToStep(index);
          }
        }}
      />` : ''}
      
      ${features.includes('progress-indicator') ? `
      <ProgressIndicator 
        steps={stepsData}
        currentStep={currentStep}
        totalSteps={${options.steps.length}}
      />` : ''}
      
      <div className="flow-content">
        {renderStep()}
      </div>
      
      ${features.includes('summary-view') && options.steps.some(step => step.isFinal) ? `
      {currentStep === ${options.steps.findIndex(step => step.isFinal)} && (
        <SummaryView
          steps={stepsData.filter(s => !s.isActive)}
          onEdit={(stepId) => {
            const index = stepsData.findIndex(s => s.id === stepId);
            if (index >= 0) {
              goToStep(index);
            }
          }}
          onSubmit={handleComplete}
        />
      )}` : ''}
    </div>
  );
};`;
  
  // Wrapper component with provider
  let wrapper = '';
  if (stateManagement === 'context') {
    wrapper = `
const ${formatComponentName(options.name)} = (props${typescript ? ': ' + formatComponentName(options.name) + 'Props' : ''}) => (
  <FlowProvider
    initialState={props.initialData || {}}
    initialStep={props.initialStep || 0}
    totalSteps={${options.steps.length}}
  >
    <${formatComponentName(options.name)}Flow {...props} />
  </FlowProvider>
);`;
  } else if (stateManagement === 'redux') {
    wrapper = `
const ${formatComponentName(options.name)} = (props${typescript ? ': ' + formatComponentName(options.name) + 'Props' : ''}) => (
  <Provider store={store}>
    <${formatComponentName(options.name)}Flow {...props} />
  </Provider>
);`;
  } else {
    wrapper = '';
  }
  
  // Export
  const exportStatement = `
export default ${formatComponentName(options.name)}${wrapper ? '' : 'Flow'};`;
  
  return `${imports}${types}${component}${wrapper}${exportStatement}`;
}

/**
 * Generate project structure
 * 
 * @param options Flow options
 * @returns Array of { path, content } objects
 */
export function generateReactProject(options: FlowOptions): Array<{ path: string; content: string }> {
  const { name, stateManagement, features = [] } = options;
  const files: Array<{ path: string; content: string }> = [];
  const basePath = options.outputDir || './src';
  const flowPath = `${basePath}/${toKebabCase(name)}`;
  
  // Create main component
  files.push({
    path: `${flowPath}/index.tsx`,
    content: generateFlowContainer(options)
  });
  
  // Create state management
  if (stateManagement === 'context') {
    files.push({
      path: `${flowPath}/context/FlowContext.tsx`,
      content: generateContextProvider(options)
    });
  } else if (stateManagement === 'redux') {
    files.push({
      path: `${flowPath}/store/store.ts`,
      content: generateReduxStore(options)
    });
    
    files.push({
      path: `${flowPath}/hooks/useFlow.ts`,
      content: generateStateHooks(options)
    });
  }
  
  // Create step components
  options.steps.forEach((step, index) => {
    files.push({
      path: `${flowPath}/steps/${formatComponentName(step.id)}.tsx`,
      content: generateStepComponent(options, index)
    });
  });
  
  // Create navigation components
  if (features.includes('breadcrumbs')) {
    files.push({
      path: `${flowPath}/components/FlowBreadcrumbs.tsx`,
      content: generateBreadcrumbsComponent(options)
    });
  }
  
  if (features.includes('progress-indicator')) {
    files.push({
      path: `${flowPath}/components/ProgressIndicator.tsx`,
      content: generateProgressIndicatorComponent(options)
    });
  }
  
  if (features.includes('back-button') || features.includes('skip-option')) {
    files.push({
      path: `${flowPath}/components/StepNavigation.tsx`,
      content: generateNavigationComponent(options)
    });
  }
  
  if (features.includes('summary-view')) {
    files.push({
      path: `${flowPath}/components/SummaryView.tsx`,
      content: generateSummaryComponent(options)
    });
  }
  
  // Create validation
  if (features.includes('validation')) {
    files.push({
      path: `${flowPath}/utils/validation.ts`,
      content: generateValidationModule(options)
    });
    
    files.push({
      path: `${flowPath}/hooks/useValidation.ts`,
      content: generateValidationHooks(options)
    });
    
    files.push({
      path: `${flowPath}/components/ErrorMessage.tsx`,
      content: generateErrorComponent(options)
    });
  }
  
  // Create styles
  const styleExtension = options.styling === 'scss' ? 'scss' : 
                         options.styling === 'less' ? 'less' : 'css';
  
  files.push({
    path: `${flowPath}/styles.${styleExtension}`,
    content: generateStyles(options)
  });
  
  // Create index.ts barrel file
  const exportStatement = `export { default } from './${toKebabCase(name)}';
export * from './schema';
${features.includes('validation') ? "export * from './utils/validation';" : ''}
`;
  
  files.push({
    path: `${basePath}/index.ts`,
    content: exportStatement
  });
  
  return files;
}

/**
 * Main function to generate a React flow designer
 * 
 * @param options Flow options
 * @returns Result object with files and paths
 */
export function generateReactFlowDesigner(options: FlowOptions): { 
  success: boolean; 
  files: Array<{ path: string; content: string }>; 
  message: string;
} {
  try {
    const files = generateReactProject(options);
    
    return {
      success: true,
      files,
      message: `Successfully generated ${files.length} files for ${options.name} flow designer`
    };
  } catch (error) {
    return {
      success: false,
      files: [],
      message: `Error generating React flow designer: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}