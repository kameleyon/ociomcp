// Auto-generated safe fallback for navigation-component-generator

export function activate() {
    console.log("[TOOL] navigation-component-generator activated (passive mode)");
}

export function onFileWrite() { /* no-op */ }
export function onSessionStart() { /* no-op */ }
export function onCommand() { /* no-op */ }
/**
 * Navigation Component Generator
 * 
 * Generates navigation components for the flow designer (breadcrumbs, progress indicators, etc.)
 */

import { FlowOptions } from './schema';
import { formatComponentName, toKebabCase } from './utils';

/**
 * Generate breadcrumbs component
 * 
 * @param options Flow options
 * @returns Breadcrumbs component string
 */
export function generateBreadcrumbsComponent(options: FlowOptions): string {
  const { typescript } = options;
  const componentName = 'FlowBreadcrumbs';
  
  let content = `import React${typescript ? ', { FC }' : ''} from 'react';\n`;
  
  if (typescript) {
    content += `
interface BreadcrumbsProps {
  steps: Array<{
    id: string;
    title: string;
    isActive: boolean;
    isCompleted: boolean;
  }>;
  onStepClick?: (stepId: string) => void;
}

const ${componentName}: FC<BreadcrumbsProps> = ({ steps, onStepClick }) => {\n`;
  } else {
    content += `
const ${componentName} = ({ steps, onStepClick }) => {\n`;
  }

  content += `  return (
    <nav className="flow-breadcrumbs" aria-label="Flow navigation">
      <ol>
        {steps.map((step, index) => (
          <li 
            key={step.id}
            className={\`breadcrumb-item \${step.isActive ? 'active' : ''} \${step.isCompleted ? 'completed' : ''}\`}
          >
            {index > 0 && <span className="separator">/</span>}
            <button
              onClick={() => onStepClick && step.isCompleted ? onStepClick(step.id) : null}
              disabled={!step.isCompleted && !step.isActive}
              className={\`breadcrumb-link \${(!step.isCompleted && !step.isActive) ? 'disabled' : ''}\`}
            >
              {step.title}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default ${componentName};\n`;

  return content;
}

/**
 * Generate progress indicator component
 * 
 * @param options Flow options
 * @returns Progress indicator component string
 */
export function generateProgressIndicatorComponent(options: FlowOptions): string {
  const { typescript } = options;
  const componentName = 'ProgressIndicator';
  
  let content = `import React${typescript ? ', { FC }' : ''} from 'react';\n`;
  
  if (typescript) {
    content += `
interface ProgressIndicatorProps {
  steps: Array<{
    id: string;
    title: string;
    isActive: boolean;
    isCompleted: boolean;
  }>;
  currentStep: number;
  totalSteps: number;
}

const ${componentName}: FC<ProgressIndicatorProps> = ({ steps, currentStep, totalSteps }) => {\n`;
  } else {
    content += `
const ${componentName} = ({ steps, currentStep, totalSteps }) => {\n`;
  }

  content += `  // Calculate progress percentage
  const progressPercentage = Math.round((currentStep / (totalSteps - 1)) * 100);
  
  return (
    <div className="progress-indicator-container">
      <div className="step-indicators">
        {steps.map((step, index) => (
          <div 
            key={step.id}
            className={\`step-indicator \${step.isActive ? 'active' : ''} \${step.isCompleted ? 'completed' : ''}\`}
          >
            <div className="indicator-circle">
              {step.isCompleted ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                index + 1
              )}
            </div>
            <div className="indicator-label">{step.title}</div>
            {index < steps.length - 1 && (
              <div className={\`indicator-line \${index < currentStep ? 'completed' : ''}\`} />
            )}
          </div>
        ))}
      </div>
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: \`\${progressPercentage}%\` }}></div>
      </div>
      <div className="progress-text">
        {currentStep} of {totalSteps - 1} steps completed ({progressPercentage}%)
      </div>
    </div>
  );
};

export default ${componentName};\n`;

  return content;
}

/**
 * Generate back/next navigation component
 * 
 * @param options Flow options
 * @returns Navigation component string
 */
export function generateNavigationComponent(options: FlowOptions): string {
  const { typescript } = options;
  const componentName = 'StepNavigation';
  
  let content = `import React${typescript ? ', { FC }' : ''} from 'react';\n`;
  
  if (typescript) {
    content += `
interface StepNavigationProps {
  canGoBack: boolean;
  canGoForward: boolean;
  isLastStep: boolean;
  onBack: () => void;
  onNext: () => void;
  onSubmit?: () => void;
}

const ${componentName}: FC<StepNavigationProps> = ({ 
  canGoBack, 
  canGoForward, 
  isLastStep, 
  onBack, 
  onNext, 
  onSubmit 
}) => {\n`;
  } else {
    content += `
const ${componentName} = ({ 
  canGoBack, 
  canGoForward, 
  isLastStep, 
  onBack, 
  onNext, 
  onSubmit 
}) => {\n`;
  }

  content += `  return (
    <div className="step-navigation">
      {canGoBack && (
        <button 
          type="button" 
          className="back-button" 
          onClick={onBack}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Back
        </button>
      )}
      
      {isLastStep ? (
        <button 
          type="button" 
          className="submit-button" 
          disabled={!canGoForward} 
          onClick={onSubmit}
        >
          Submit
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
            <path d="M12 5l7 7-7 7" />
          </svg>
        </button>
      ) : (
        <button 
          type="button" 
          className="next-button" 
          disabled={!canGoForward} 
          onClick={onNext}
        >
          Next
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
            <path d="M12 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ${componentName};\n`;

  return content;
}

/**
 * Generate a summary component to review all steps
 * 
 * @param options Flow options
 * @returns Summary component string
 */
export function generateSummaryComponent(options: FlowOptions): string {
  const { typescript } = options;
  const componentName = 'SummaryView';
  
  let content = `import React${typescript ? ', { FC }' : ''} from 'react';\n`;
  
  if (options.stateManagement === 'context') {
    content += `import { useFlowContext } from '../context/FlowContext';\n`;
  }
  
  if (typescript) {
    content += `
interface SummaryViewProps {
  steps: Array<{
    id: string;
    title: string;
  }>;
  onEdit: (stepId: string) => void;
  onSubmit: () => void;
}

const ${componentName}: FC<SummaryViewProps> = ({ steps, onEdit, onSubmit }) => {\n`;
  } else {
    content += `
const ${componentName} = ({ steps, onEdit, onSubmit }) => {\n`;
  }

  content += `  ${options.stateManagement === 'context' ? 'const { state } = useFlowContext();' : 'const state = {}; // Replace with actual state'}
  
  return (
    <div className="summary-view">
      <h2>Summary</h2>
      <p>Please review your information before submitting.</p>
      
      <div className="summary-sections">
        {steps.map((step) => (
          <div key={step.id} className="summary-section">
            <div className="summary-header">
              <h3>{step.title}</h3>
              <button
                type="button"
                className="edit-button"
                onClick={() => onEdit(step.id)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                </svg>
                Edit
              </button>
            </div>
            
            <div className="summary-content">
              {state[step.id] && (
                <dl>
                  {Object.entries(state[step.id]).map(([key, value]) => (
                    <div key={key} className="summary-item">
                      <dt>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="summary-actions">
        <button type="button" className="submit-button" onClick={onSubmit}>
          Submit
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ${componentName};\n`;

  return content;
}
