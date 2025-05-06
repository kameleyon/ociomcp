/**
 * Job Model
 * 
 * This file defines the Job class that represents a single task in the job queue.
 */

import { v4 as uuidv4 } from 'uuid';

// Job status enum
export enum JobStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

// Job priority enum
export enum JobPriority {
  LOW = 0,
  NORMAL = 1,
  HIGH = 2,
  CRITICAL = 3
}

// Job data interface
export interface JobData {
  id?: string;
  name: string;
  type: string;
  status?: JobStatus;
  priority?: JobPriority;
  payload: any;
  progress?: number;
  result?: any;
  error?: string;
  createdAt?: string;
  startedAt?: string;
  completedAt?: string;
  retries?: number;
  maxRetries?: number;
  timeout?: number;
  metadata?: Record<string, any>;
}

/**
 * Job class represents a single task in the job queue
 */
export class Job implements JobData {
  id: string;
  name: string;
  type: string;
  status: JobStatus;
  priority: JobPriority;
  payload: any;
  progress: number;
  result?: any;
  error?: string;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  retries: number;
  maxRetries: number;
  timeout: number;
  metadata: Record<string, any>;
  
  constructor(data: JobData) {
    this.id = data.id || uuidv4();
    this.name = data.name;
    this.type = data.type;
    this.status = data.status || JobStatus.PENDING;
    this.priority = data.priority || JobPriority.NORMAL;
    this.payload = data.payload;
    this.progress = data.progress || 0;
    this.result = data.result;
    this.error = data.error;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.startedAt = data.startedAt;
    this.completedAt = data.completedAt;
    this.retries = data.retries || 0;
    this.maxRetries = data.maxRetries || 3;
    this.timeout = data.timeout || 30 * 60 * 1000; // 30 minutes
    this.metadata = data.metadata || {};
  }
  
  /**
   * Start a job
   */
  start(): Job {
    this.status = JobStatus.RUNNING;
    this.startedAt = new Date().toISOString();
    this.progress = 0;
    return this;
  }
  
  /**
   * Complete a job successfully
   */
  complete(result?: any): Job {
    this.status = JobStatus.COMPLETED;
    this.completedAt = new Date().toISOString();
    this.progress = 100;
    this.result = result;
    return this;
  }
  
  /**
   * Mark a job as failed
   */
  fail(error: Error | string): Job {
    this.status = JobStatus.FAILED;
    this.completedAt = new Date().toISOString();
    this.error = typeof error === 'string' ? error : error.message;
    
    // Check if we should retry
    if (this.retries < this.maxRetries) {
      this.status = JobStatus.PENDING;
      this.retries += 1;
      this.startedAt = undefined;
      this.completedAt = undefined;
    }
    
    return this;
  }
  
  /**
   * Cancel a job
   */
  cancel(): Job {
    this.status = JobStatus.CANCELLED;
    this.completedAt = new Date().toISOString();
    return this;
  }
  
  /**
   * Update job progress
   */
  updateProgress(progress: number): Job {
    this.progress = Math.min(Math.max(progress, 0), 100);
    return this;
  }
  
  /**
   * Check if job is active (pending or running)
   */
  isActive(): boolean {
    return this.status === JobStatus.PENDING || this.status === JobStatus.RUNNING;
  }
  
  /**
   * Check if job has completed (successfully or not)
   */
  isComplete(): boolean {
    return [JobStatus.COMPLETED, JobStatus.FAILED, JobStatus.CANCELLED].includes(this.status);
  }
  
  /**
   * Check if job has timed out
   */
  hasTimedOut(): boolean {
    if (!this.startedAt) return false;
    
    const startTime = new Date(this.startedAt).getTime();
    const currentTime = Date.now();
    
    return currentTime - startTime > this.timeout;
  }
  
  /**
   * Serialize job to JSON
   */
  toJSON(): JobData {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      status: this.status,
      priority: this.priority,
      payload: this.payload,
      progress: this.progress,
      result: this.result,
      error: this.error,
      createdAt: this.createdAt,
      startedAt: this.startedAt,
      completedAt: this.completedAt,
      retries: this.retries,
      maxRetries: this.maxRetries,
      timeout: this.timeout,
      metadata: this.metadata
    };
  }
  
  /**
   * Create a job from JSON
   */
  static fromJSON(data: JobData): Job {
    return new Job(data);
  }
}

export default Job;