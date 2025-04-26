/**
 * Validation Generator
 * 
 * Generates validation logic for flow designer forms
 */

import { FlowOptions } from './schema';

/**
 * Generate base validation utility
 * 
 * @param options Flow options
 * @returns Validation utility code string
 */
export function generateBaseValidation(options: FlowOptions): string {
  const { typescript } = options;
  
  // TypeScript interfaces
  const typeDefinitions = typescript ? `
interface ValidationError {
  field: string;
  message: string;
}

interface ValidationResult {
  [key: string]: string;
}

interface ValidationRule {
  field: string;
  rule: string;
  message: string;
}

interface ValidationRules {
  [key: string]: ValidationRule[];
}
` : '';

  // Extract validation rules from steps
  let validationRulesObj = '';
  const validationRules: Record<string, any[]> = {};
  
  options.steps.forEach(step => {
    if (step.validationRules && step.validationRules.length > 0) {
      validationRules[step.id] = step.validationRules;
    }
  });
  
  validationRulesObj = `const validationRules${typescript ? ': ValidationRules' : ''} = ${JSON.stringify(validationRules, null, 2)};`;
  
  return `${typeDefinitions}
${validationRulesObj}

/**
 * Validate a single field based on a rule
 * 
 * @param value Field value
 * @param rule Validation rule
 * @returns true if valid, false otherwise
 */
function validateField(value${typescript ? ': any' : ''}, rule${typescript ? ': string' : ''})${typescript ? ': boolean' : ''} {
  if (!value && rule !== 'required') {
    return true; // Skip validation for optional fields if they are empty
  }
  
  switch (rule) {
    case 'required':
      return value !== undefined && value !== null && value !== '';
      
    case 'email':
      return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$/i.test(value);
      
    case 'numeric':
      return /^\\d+$/.test(value);
      
    case 'alpha':
      return /^[A-Za-z]+$/.test(value);
      
    case 'alphanumeric':
      return /^[A-Za-z0-9]+$/.test(value);
      
    case 'phone':
      return /^\\+?[\\d\\s-()]{8,}$/.test(value);
      
    case 'url':
      try {
        new URL(value);
        return true;
      } catch (e) {
        return false;
      }
      
    case 'date':
      return !isNaN(Date.parse(value));
      
    default:
      // Handle custom validation rules
      if (rule.startsWith('min:')) {
        const min = parseInt(rule.split(':')[1], 10);
        return value.length >= min;
      }
      
      if (rule.startsWith('max:')) {
        const max = parseInt(rule.split(':')[1], 10);
        return value.length <= max;
      }
      
      if (rule.startsWith('between:')) {
        const [min, max] = rule.split(':')[1].split(',').map(n => parseInt(n, 10));
        return value.length >= min && value.length <= max;
      }
      
      if (rule.startsWith('regex:')) {
        const regex = new RegExp(rule.split(':')[1]);
        return regex.test(value);
      }
      
      return true; // Default to valid if rule is not recognized
  }
}

/**
 * Validate a step's form data
 * 
 * @param stepId ID of the step to validate
 * @param data Form data to validate
 * @returns Object with field names as keys and error messages as values
 */
export function validateStep(stepId${typescript ? ': string' : ''}, data${typescript ? ': Record<string, any>' : ''})${typescript ? ': ValidationResult' : ''} {
  const errors${typescript ? ': ValidationResult' : ''} = {};
  
  // If no validation rules for this step, return empty errors
  if (!validationRules[stepId]) {
    return errors;
  }
  
  // Validate each field based on its rules
  validationRules[stepId].forEach(({ field, rule, message }) => {
    if (!validateField(data[field], rule)) {
      errors[field] = message;
    }
  });
  
  return errors;
}

/**
 * Check if a step is valid
 * 
 * @param stepId ID of the step to check
 * @param data Form data to validate
 * @returns true if valid, false otherwise
 */
export function isStepValid(stepId${typescript ? ': string' : ''}, data${typescript ? ': Record<string, any>' : ''})${typescript ? ': boolean' : ''} {
  const errors = validateStep(stepId, data);
  return Object.keys(errors).length === 0;
}

/**
 * Validate all steps
 * 
 * @param stepsData Object with step IDs as keys and form data as values
 * @returns Object with step IDs as keys and validation results as values
 */
export function validateAllSteps(stepsData${typescript ? ': Record<string, Record<string, any>>' : ''})${typescript ? ': Record<string, ValidationResult>' : ''} {
  const allErrors${typescript ? ': Record<string, ValidationResult>' : ''} = {};
  
  Object.keys(validationRules).forEach(stepId => {
    if (stepsData[stepId]) {
      const stepErrors = validateStep(stepId, stepsData[stepId]);
      if (Object.keys(stepErrors).length > 0) {
        allErrors[stepId] = stepErrors;
      }
    } else {
      // If step data is missing and has required fields, mark it as invalid
      const hasRequiredFields = validationRules[stepId].some(
        rule => rule.rule === 'required'
      );
      
      if (hasRequiredFields) {
        allErrors[stepId] = { _form: 'This step has required fields that are missing.' };
      }
    }
  });
  
  return allErrors;
}

/**
 * Check if all steps are valid
 * 
 * @param stepsData Object with step IDs as keys and form data as values
 * @returns true if all steps are valid, false otherwise
 */
export function isFlowValid(stepsData${typescript ? ': Record<string, Record<string, any>>' : ''})${typescript ? ': boolean' : ''} {
  const allErrors = validateAllSteps(stepsData);
  return Object.keys(allErrors).length === 0;
}`;
}

/**
 * Generate validation hooks for React
 * 
 * @param options Flow options
 * @returns Validation hooks code string
 */
export function generateValidationHooks(options: FlowOptions): string {
  const { typescript } = options;
  
  return `import { useState } from 'react';
import { validateStep, isStepValid, validateAllSteps, isFlowValid } from './validation';

${typescript ? `interface ValidationError {
  [key: string]: string;
}

interface UseValidationResult {
  errors: ValidationError;
  validateData: (data: Record<string, any>) => boolean;
  clearErrors: () => void;
  setErrors: (newErrors: ValidationError) => void;
  hasErrors: boolean;
}` : ''}

/**
 * Custom hook for form validation
 * 
 * @param stepId ID of the step to validate
 * @returns Validation utilities
 */
export function useValidation(stepId${typescript ? ': string' : ''})${typescript ? ': UseValidationResult' : ''} {
  const [errors, setErrors] = useState${typescript ? '<ValidationError>' : ''}({});
  
  const validateData = (data${typescript ? ': Record<string, any>' : ''})${typescript ? ': boolean' : ''} => {
    const validationErrors = validateStep(stepId, data);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };
  
  const clearErrors = () => {
    setErrors({});
  };
  
  return {
    errors,
    validateData,
    clearErrors,
    setErrors,
    hasErrors: Object.keys(errors).length > 0
  };
}

${typescript ? `interface UseFlowValidationResult {
  stepErrors: Record<string, ValidationError>;
  validateFlow: (stepsData: Record<string, Record<string, any>>) => boolean;
  validateCurrentStep: (stepId: string, data: Record<string, any>) => boolean;
  clearStepErrors: (stepId: string) => void;
  clearAllErrors: () => void;
  hasErrors: boolean;
  getFirstInvalidStep: (stepsData: Record<string, Record<string, any>>) => string | null;
}` : ''}

/**
 * Custom hook for multi-step flow validation
 * 
 * @returns Flow validation utilities
 */
export function useFlowValidation()${typescript ? ': UseFlowValidationResult' : ''} {
  const [stepErrors, setStepErrors] = useState${typescript ? '<Record<string, ValidationError>>' : ''}({});
  
  const validateFlow = (stepsData${typescript ? ': Record<string, Record<string, any>>' : ''})${typescript ? ': boolean' : ''} => {
    const allErrors = validateAllSteps(stepsData);
    setStepErrors(allErrors);
    return Object.keys(allErrors).length === 0;
  };
  
  const validateCurrentStep = (stepId${typescript ? ': string' : ''}, data${typescript ? ': Record<string, any>' : ''})${typescript ? ': boolean' : ''} => {
    const validationErrors = validateStep(stepId, data);
    
    setStepErrors(prev => ({
      ...prev,
      [stepId]: validationErrors
    }));
    
    return Object.keys(validationErrors).length === 0;
  };
  
  const clearStepErrors = (stepId${typescript ? ': string' : ''}) => {
    setStepErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[stepId];
      return newErrors;
    });
  };
  
  const clearAllErrors = () => {
    setStepErrors({});
  };
  
  const getFirstInvalidStep = (stepsData${typescript ? ': Record<string, Record<string, any>>' : ''})${typescript ? ': string | null' : ''} => {
    const allErrors = validateAllSteps(stepsData);
    const invalidStepId = Object.keys(allErrors)[0];
    return invalidStepId || null;
  };
  
  return {
    stepErrors,
    validateFlow,
    validateCurrentStep,
    clearStepErrors,
    clearAllErrors,
    hasErrors: Object.keys(stepErrors).length > 0,
    getFirstInvalidStep
  };
}`;
}

/**
 * Generate error message component
 * 
 * @param options Flow options
 * @returns Error message component code string
 */
export function generateErrorComponent(options: FlowOptions): string {
  const { typescript } = options;
  
  return `import React${typescript ? ', { FC }' : ''} from 'react';

${typescript ? `interface ErrorMessageProps {
  error?: string;
  field: string;
}` : ''}

/**
 * Error message component for form validation
 */
const ErrorMessage = ${typescript ? 'React.' : ''}(({ error, field }${typescript ? ': ErrorMessageProps' : ''}) => {
  if (!error) return null;
  
  return (
    <div 
      className="error-message" 
      role="alert"
      id={\`\${field}-error\`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      {error}
    </div>
  );
});

export default ErrorMessage;`;
}

/**
 * Generate validation module with all components and utilities
 * 
 * @param options Flow options
 * @returns Complete validation module code
 */
export function generateValidationModule(options: FlowOptions): string {
  if (!options.features?.includes('validation')) {
    return '// Validation not enabled for this flow';
  }
  
  const baseValidation = generateBaseValidation(options);
  
  return baseValidation;
}