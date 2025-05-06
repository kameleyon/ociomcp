/**
 * Job Queue Manager
 * 
 * This file implements the JobQueue class that manages job execution,
 * persistence, and concurrency control.
 */

import { EventEmitter } from 'events';
import { Job, JobStatus, JobPriority } from './job.js';
import { Storage } from '../storage/index.js';
import { config } from '../config.js';
import { JobCreationParams } from './index.js';

// Job handler type
export type JobHandler = (job: Job) => Promise<any>;

/**
 * Job Queue Manager
 */
export class JobQueue extends EventEmitter {
  private storage: Storage;
  private handlers: Map<string, JobHandler>;
  private activeJobs: Map<string, Promise<any>>;
  private maxConcurrency: number;
  private running: boolean;
  private interval: NodeJS.Timeout | null;
  
  constructor(storage: Storage) {
    super();
    this.storage = storage;
    this.handlers = new Map();
    this.activeJobs = new Map();
    this.maxConcurrency = config.jobQueue.concurrency;
    this.running = false;
    this.interval = null;
  }
  
  /**
   * Start the job queue processing
   */
  start(): void {
    if (this.running) return;
    
    this.running = true;
    this.interval = setInterval(() => this.processJobs(), 1000);
    
    console.log(`[JobQueue] Started with concurrency of ${this.maxConcurrency}`);
  }
  
  /**
   * Stop the job queue processing
   */
  stop(): void {
    if (!this.running) return;
    
    this.running = false;
    
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    
    console.log('[JobQueue] Stopped');
  }
  
  /**
   * Register a job handler
   */
  registerHandler(jobType: string, handler: JobHandler): void {
    this.handlers.set(jobType, handler);
    console.log(`[JobQueue] Registered handler for job type: ${jobType}`);
  }
  
  /**
   * Create a new job
   */
  async createJob(params: JobCreationParams): Promise<Job> {
    // Convert JobCreationParams to full Job data
    const jobData = {
      ...params,
      status: JobStatus.PENDING,
      progress: 0,
      createdAt: new Date().toISOString()
    };
    
    const job = new Job(jobData as any);
    
    // Check if a handler exists for this job type
    if (!this.handlers.has(job.type)) {
      throw new Error(`No handler registered for job type: ${job.type}`);
    }
    
    // Save the job to storage
    await this.storage.create('jobs', job.toJSON());
    
    // Emit an event for job creation
    this.emit('job:created', job);
    
    console.log(`[JobQueue] Created job: ${job.id} (${job.name})`);
    
    return job;
  }
  
  /**
   * Process pending jobs
   */
  private async processJobs(): Promise<void> {
    if (!this.running) return;
    
    // Check how many slots are available for new jobs
    const availableSlots = this.maxConcurrency - this.activeJobs.size;
    
    if (availableSlots <= 0) return;
    
    try {
      // Get pending jobs from storage
      const pendingJobs = await this.storage.find<Job>('jobs', { status: JobStatus.PENDING });
      
      if (pendingJobs.length === 0) return;
      
      // Sort jobs by priority (higher number = higher priority)
      const sortedJobs = pendingJobs.sort((a, b) => (b.priority || 0) - (a.priority || 0));
      
      // Process jobs up to the available slots
      for (let i = 0; i < Math.min(availableSlots, sortedJobs.length); i++) {
        const job = Job.fromJSON(sortedJobs[i]);
        
        // Skip jobs that are already being processed
        if (this.activeJobs.has(job.id)) continue;
        
        // Execute the job
        this.executeJob(job);
      }
    } catch (error) {
      console.error('[JobQueue] Error processing jobs:', error);
    }
  }
  
  /**
   * Execute a single job
   */
  private executeJob(job: Job): void {
    // Mark the job as running
    job.start();
    
    // Update the job in storage
    this.storage.updateById('jobs', job.id, job.toJSON());
    
    // Emit an event for job start
    this.emit('job:started', job);
    
    console.log(`[JobQueue] Starting job: ${job.id} (${job.name})`);
    
    // Get the handler for this job type
    const handler = this.handlers.get(job.type);
    
    if (!handler) {
      job.fail(`No handler registered for job type: ${job.type}`);
      this.storage.updateById('jobs', job.id, job.toJSON());
      this.emit('job:failed', job);
      return;
    }
    
    // Execute the handler
    const promise = handler(job)
      .then((result) => {
        // Mark the job as completed
        job.complete(result);
        
        // Update the job in storage
        this.storage.updateById('jobs', job.id, job.toJSON());
        
        // Emit an event for job completion
        this.emit('job:completed', job);
        
        console.log(`[JobQueue] Completed job: ${job.id} (${job.name})`);
        
        return result;
      })
      .catch((error) => {
        // Mark the job as failed
        job.fail(error);
        
        // Update the job in storage
        this.storage.updateById('jobs', job.id, job.toJSON());
        
        // Emit an event for job failure
        this.emit('job:failed', job);
        
        console.error(`[JobQueue] Failed job: ${job.id} (${job.name})`, error);
        
        return null;
      })
      .finally(() => {
        // Remove the job from active jobs
        this.activeJobs.delete(job.id);
      });
    
    // Add the job to active jobs
    this.activeJobs.set(job.id, promise);
    
    // Set a timeout for the job
    setTimeout(() => {
      // Check if the job is still active
      if (this.activeJobs.has(job.id) && job.status === JobStatus.RUNNING) {
        // Mark the job as failed due to timeout
        job.fail(`Job timed out after ${job.timeout}ms`);
        
        // Update the job in storage
        this.storage.updateById('jobs', job.id, job.toJSON());
        
        // Emit an event for job timeout
        this.emit('job:timeout', job);
        
        console.error(`[JobQueue] Job timed out: ${job.id} (${job.name})`);
        
        // Do not remove from activeJobs map as the Promise will do that when it resolves
      }
    }, job.timeout);
  }
  
  /**
   * Get a job by ID
   */
  async getJob(id: string): Promise<Job | null> {
    const jobData = await this.storage.findById<Job>('jobs', id);
    return jobData ? Job.fromJSON(jobData) : null;
  }
  
  /**
   * Cancel a job
   */
  async cancelJob(id: string): Promise<Job | null> {
    const job = await this.getJob(id);
    
    if (!job) return null;
    
    // Can only cancel pending jobs
    if (job.status !== JobStatus.PENDING) {
      return job;
    }
    
    // Mark the job as cancelled
    job.cancel();
    
    // Update the job in storage
    await this.storage.updateById('jobs', job.id, job.toJSON());
    
    // Emit an event for job cancellation
    this.emit('job:cancelled', job);
    
    console.log(`[JobQueue] Cancelled job: ${job.id} (${job.name})`);
    
    return job;
  }
  
  /**
   * Get all jobs, optionally filtered by status
   */
  async getJobs(status?: JobStatus): Promise<Job[]> {
    const filter = status ? { status } : undefined;
    const jobsData = await this.storage.find<Job>('jobs', filter);
    return jobsData.map(jobData => Job.fromJSON(jobData));
  }
  
  /**
   * Clear all jobs
   */
  async clearJobs(): Promise<void> {
    await this.storage.deleteAll('jobs');
    console.log('[JobQueue] Cleared all jobs');
  }
}

export default JobQueue;