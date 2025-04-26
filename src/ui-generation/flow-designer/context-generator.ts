/**
 * Context Generator
 * 
 * Generates context and state management logic for the flow designer
 */

import { FlowOptions } from './schema';

/**
 * Generate context provider for React Context API
 * 
 * @param options Flow options
 * @returns Context provider code string
 */
export function generateContextProvider(options: FlowOptions): string {
  const { typescript, steps } = options;
  let stepStateInterface = '';
  
  if (typescript) {
    stepStateInterface = `
interface StepState {
  [key: string]: any;
}`;
  }
  
  let content = `import React, { createContext, useContext, useState${typescript ? ', FC, ReactNode' : ''} } from 'react';
${typescript ? stepStateInterface : ''}

${typescript ? `
interface FlowContextProps {
  currentStep: number;
  state: StepState;
  updateState: (newState: StepState) => void;
  goToStep: (stepIndex: number) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
  isFirstStep: boolean;
  isLastStep: boolean;
  progress: number;
}

interface FlowProviderProps {
  children: ReactNode;
  initialState?: StepState;
  initialStep?: number;
  totalSteps: number;
}` : ''}

// Create the context
const FlowContext = createContext(${typescript ? '{} as FlowContextProps' : '{}'});

// Custom hook to use the flow context
export const useFlowContext = () => useContext(FlowContext);

// Flow Provider component
export const FlowProvider = ${typescript ? 'React.' : ''}(({ 
  children, 
  initialState = {}, 
  initialStep = 0, 
  totalSteps 
}${typescript ? ': FlowProviderProps' : ''}) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [state, setState] = useState(initialState);
  
  // Update state with new values
  const updateState = (newState${typescript ? ': StepState' : ''}) => {
    setState((prevState) => ({
      ...prevState,
      ...newState
    }));
  };
  
  // Navigation helpers
  const goToStep = (stepIndex${typescript ? ': number' : ''}) => {
    if (stepIndex >= 0 && stepIndex < totalSteps) {
      setCurrentStep(stepIndex);
    }
  };
  
  const goToNextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Navigation state
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;
  const canGoBack = !isFirstStep;
  const canGoForward = true; // This would typically depend on validation
  const progress = Math.round((currentStep / (totalSteps - 1)) * 100);
  
  // Prepare the context value
  const contextValue = {
    currentStep,
    state,
    updateState,
    goToStep,
    goToNextStep,
    goToPreviousStep,
    canGoBack,
    canGoForward,
    isFirstStep,
    isLastStep,
    progress
  };
  
  return (
    <FlowContext.Provider value={contextValue}>
      {children}
    </FlowContext.Provider>
  );
});
`;

  return content;
}

/**
 * Generate a Redux store for state management
 * 
 * @param options Flow options
 * @returns Redux store code string
 */
export function generateReduxStore(options: FlowOptions): string {
  const { typescript, steps } = options;
  
  let content = `// Flow Redux Store
import { createSlice, configureStore } from '@reduxjs/toolkit';

// Define the initial state
const initialState = {
  currentStep: 0,
  stepData: {},
  isComplete: false,
  history: []
};

// Create a slice for the flow
const flowSlice = createSlice({
  name: 'flow',
  initialState,
  reducers: {
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
    },
    setStepData: (state, action) => {
      state.stepData = {
        ...state.stepData,
        [action.payload.stepId]: action.payload.data
      };
      // Add to history for undo functionality
      state.history.push({
        type: 'stepData',
        stepId: action.payload.stepId,
        data: action.payload.data,
        timestamp: Date.now()
      });
    },
    nextStep: (state) => {
      const totalSteps = ${steps.length};
      if (state.currentStep < totalSteps - 1) {
        state.currentStep += 1;
      }
    },
    previousStep: (state) => {
      if (state.currentStep > 0) {
        state.currentStep -= 1;
      }
    },
    completeFlow: (state) => {
      state.isComplete = true;
      state.history.push({
        type: 'complete',
        timestamp: Date.now()
      });
    },
    resetFlow: (state) => {
      return {
        ...initialState,
        history: [...state.history, {
          type: 'reset',
          timestamp: Date.now()
        }]
      };
    }
  }
});

// Export actions
export const {
  setCurrentStep,
  setStepData,
  nextStep,
  previousStep,
  completeFlow,
  resetFlow
} = flowSlice.actions;

// Configure the store
export const store = configureStore({
  reducer: {
    flow: flowSlice.reducer
  }
});

// Export types if using TypeScript
${typescript ? `export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;` : ''}
`;

  return content;
}

/**
 * Generate hooks for state management based on the chosen approach
 * 
 * @param options Flow options
 * @returns Hooks code string
 */
export function generateStateHooks(options: FlowOptions): string {
  const { stateManagement, typescript } = options;
  
  let content = '';
  
  if (stateManagement === 'context') {
    // Custom hook for context
    content = `import { useFlowContext } from '../context/FlowContext';

${typescript ? `interface UseFlowResult {
  currentStep: number;
  state: any;
  goToStep: (stepIndex: number) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  progress: number;
  updateStepData: (stepId: string, data: any) => void;
}` : ''}

export const useFlow = ()${typescript ? ': UseFlowResult' : ''} => {
  const context = useFlowContext();
  
  // Add a convenience method for updating step data
  const updateStepData = (stepId${typescript ? ': string' : ''}, data${typescript ? ': any' : ''}) => {
    context.updateState({ [stepId]: data });
  };
  
  return {
    ...context,
    updateStepData
  };
};`;
  } else if (stateManagement === 'redux') {
    // Custom hook for Redux
    content = `import { useSelector, useDispatch } from 'react-redux';
import { 
  setCurrentStep, 
  setStepData, 
  nextStep, 
  previousStep, 
  completeFlow, 
  resetFlow 
} from '../store/flowSlice';
${typescript ? `import { RootState } from '../store/store';

interface UseFlowResult {
  currentStep: number;
  stepData: any;
  isComplete: boolean;
  goToStep: (stepIndex: number) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  updateStepData: (stepId: string, data: any) => void;
  completeFlow: () => void;
  resetFlow: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  progress: number;
}` : ''}

export const useFlow = ()${typescript ? ': UseFlowResult' : ''} => {
  const dispatch = useDispatch();
  const { currentStep, stepData, isComplete } = useSelector(${typescript ? '(state: RootState) => state.flow' : 'state => state.flow'});
  const totalSteps = ${options.steps.length}; // Replace with actual step count
  
  const goToStep = (stepIndex${typescript ? ': number' : ''}) => {
    dispatch(setCurrentStep(stepIndex));
  };
  
  const goToNextStep = () => {
    dispatch(nextStep());
  };
  
  const goToPreviousStep = () => {
    dispatch(previousStep());
  };
  
  const updateStepData = (stepId${typescript ? ': string' : ''}, data${typescript ? ': any' : ''}) => {
    dispatch(setStepData({ stepId, data }));
  };
  
  const completeFlowAction = () => {
    dispatch(completeFlow());
  };
  
  const resetFlowAction = () => {
    dispatch(resetFlow());
  };
  
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;
  const progress = Math.round((currentStep / (totalSteps - 1)) * 100);
  
  return {
    currentStep,
    stepData,
    isComplete,
    goToStep,
    goToNextStep,
    goToPreviousStep,
    updateStepData,
    completeFlow: completeFlowAction,
    resetFlow: resetFlowAction,
    isFirstStep,
    isLastStep,
    progress
  };
};`;
  }
  
  return content;
}