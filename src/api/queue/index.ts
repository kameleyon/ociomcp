/**
 * Job Queue System
 * 
 * This module provides a job queue system for handling long-running tasks
 * and managing asynchronous processes in the OptimusCode API.
 */

import { Storage } from '../storage/index.js';
import { JobQueue } from './job-queue.js';
import { Job, JobStatus, JobPriority } from './job.js';
import { config } from '../config.js';

// Create default job handlers
const defaultHandlers = {
  /**
   * Handler for component-builder jobs
   */
  'component-builder': async (job: Job) => {
    const { pluginManager } = await import('../../tools/code-tools/plugin-manager.js');
    const tool = pluginManager.getTool('component-builder');
    
    job.updateProgress(10);
    
    if (!tool) {
      throw new Error('Component builder tool not found');
    }
    
    job.updateProgress(30);
    
    // Execute the tool
    const result = await tool.onCommand({
      name: 'component-builder:buildComponent',
      args: job.payload
    });
    
    job.updateProgress(100);
    
    return result;
  },
  
  /**
   * Handler for code-fixer jobs
   */
  'code-fixer': async (job: Job) => {
    const { pluginManager } = await import('../../tools/code-tools/plugin-manager.js');
    const tool = pluginManager.getTool('code-fixer');
    
    job.updateProgress(10);
    
    if (!tool) {
      throw new Error('Code fixer tool not found');
    }
    
    job.updateProgress(30);
    
    // Execute the tool
    const result = await tool.onCommand({
      name: 'code-fixer:fix',
      args: job.payload
    });
    
    job.updateProgress(100);
    
    return result;
  },
  
  /**
   * Handler for app generation jobs
   */
  'generate-app': async (job: Job) => {
    const { pluginManager } = await import('../../tools/code-tools/plugin-manager.js');
    const apiGenerator = pluginManager.getTool('api-generator');
    const componentBuilder = pluginManager.getTool('component-builder');
    
    job.updateProgress(10);
    
    if (!apiGenerator || !componentBuilder) {
      throw new Error('Required tools not found');
    }
    
    job.updateProgress(20);
    
    // Step 1: Generate API structure
    const apiResult = await apiGenerator.onCommand({
      name: 'api-generator:generate',
      args: {
        spec: job.payload.apiSpec,
        outputDir: job.payload.outputDir
      }
    });
    
    job.updateProgress(50);
    
    // Step 2: Generate UI components
    const uiResult = await componentBuilder.onCommand({
      name: 'component-builder:buildComponent',
      args: {
        components: job.payload.components,
        outputDir: job.payload.outputDir
      }
    });
    
    job.updateProgress(80);
    
    // Step 3: Package the results
    const result = {
      api: apiResult,
      ui: uiResult,
      appId: job.payload.appId || job.id
    };
    
    job.updateProgress(100);
    
    return result;
  }
};

/**
 * Simplified interface for job creation
 * This allows creation of jobs with only the essential parameters
 */
export interface JobCreationParams {
  name: string;
  type: string;
  priority?: JobPriority;
  payload: any;
  metadata?: Record<string, any>;
  maxRetries?: number;
  timeout?: number;
}

// Export job queue interfaces and classes
export { Job, JobStatus, JobPriority, JobQueue };

/**
 * Initialize the job queue system
 */
export async function initializeJobQueue(storage?: Storage): Promise<JobQueue> {
  // Use the provided storage or create a new one
  let queueStorage = storage;
  if (!queueStorage) {
    const { initializeStorage } = await import('../storage/index.js');
    queueStorage = initializeStorage();
  }
  
  // Create the job queue
  const jobQueue = new JobQueue(queueStorage);
  
  // Register default handlers
  Object.entries(defaultHandlers).forEach(([type, handler]) => {
    jobQueue.registerHandler(type, handler);
  });
  
  // Start the job queue if configured to do so
  if (config.jobQueue.autostart !== false) {
    jobQueue.start();
  }
  
  return jobQueue;
}

// Export default
export default {
  initializeJobQueue,
  Job,
  JobStatus,
  JobPriority
};