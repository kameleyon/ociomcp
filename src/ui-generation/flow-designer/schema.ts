/**
 * Flow Designer Schema
 * 
 * Defines the Zod schema and interfaces for flow designer
 */

import { z } from 'zod';

/**
 * Schema for FlowDesigner
 */
export const GenerateFlowSchema = z.object({
  name: z.string(),
  framework: z.enum(['react', 'vue', 'angular', 'svelte', 'solid', 'html']).default('react'),
  flowType: z.enum(['wizard', 'multi-step-form', 'onboarding', 'checkout', 'authentication', 'custom']).default('wizard'),
  steps: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional(),
    component: z.string().optional(),
    path: z.string().optional(),
    isInitial: z.boolean().optional().default(false),
    isFinal: z.boolean().optional().default(false),
    validationRules: z.array(z.object({
      field: z.string(),
      rule: z.string(),
      message: z.string()
    })).optional(),
    nextSteps: z.array(z.object({
      stepId: z.string(),
      condition: z.string().optional(),
      label: z.string().optional()
    })).optional()
  })).min(2),
  styling: z.enum(['css', 'scss', 'less', 'styled-components', 'emotion', 'tailwind', 'none']).default('css'),
  typescript: z.boolean().default(true),
  responsive: z.boolean().default(true),
  outputDir: z.string().optional(),
  stateManagement: z.enum(['context', 'redux', 'mobx', 'zustand', 'recoil', 'jotai', 'none']).optional().default('context'),
  features: z.array(z.enum([
    'breadcrumbs', 'progress-indicator', 'validation', 'persistence',
    'back-button', 'skip-option', 'summary-view', 'animations'
  ])).optional(),
  theme: z.object({
    primaryColor: z.string().optional(),
    secondaryColor: z.string().optional(),
    fontFamily: z.string().optional(),
    borderRadius: z.string().optional(),
    spacing: z.string().optional()
  }).optional()
});

/**
 * Flow options interface
 */
export interface FlowOptions {
  name: string;
  framework: 'react' | 'vue' | 'angular' | 'svelte' | 'solid' | 'html';
  flowType: 'wizard' | 'multi-step-form' | 'onboarding' | 'checkout' | 'authentication' | 'custom';
  steps: Array<{
    id: string;
    title: string;
    description?: string;
    component?: string;
    path?: string;
    isInitial?: boolean;
    isFinal?: boolean;
    validationRules?: Array<{
      field: string;
      rule: string;
      message: string;
    }>;
    nextSteps?: Array<{
      stepId: string;
      condition?: string;
      label?: string;
    }>;
  }>;
  styling: 'css' | 'scss' | 'less' | 'styled-components' | 'emotion' | 'tailwind' | 'none';
  typescript: boolean;
  responsive: boolean;
  outputDir?: string;
  stateManagement?: 'context' | 'redux' | 'mobx' | 'zustand' | 'recoil' | 'jotai' | 'none';
  features?: Array<string>;
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
    fontFamily?: string;
    borderRadius?: string;
    spacing?: string;
  };
}