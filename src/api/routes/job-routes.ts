/**
 * Job Routes
 * 
 * This file defines the API routes for interacting with the job queue system.
 */

import express, { Router } from 'express';
import { z } from 'zod';
import { JobQueue, JobStatus } from '../queue/index.js';
import { Storage } from '../storage/index.js';
import { auth, validation } from '../middleware/index.js';

/**
 * Create job routes
 */
export default function jobRoutes(
  jobQueue: JobQueue,
  storage: Storage
): Router {
  const router = express.Router();
  
  // Apply authentication middleware to all job routes
  router.use(auth.authenticate);
  
  /**
   * List all jobs
   * GET /api/jobs
   */
  router.get('/', async (req, res) => {
    try {
      // Parse query parameters
      const status = req.query.status as JobStatus | undefined;
      
      // Get jobs
      const jobs = await jobQueue.getJobs(status);
      
      res.json({
        jobs,
        count: jobs.length
      });
    } catch (error: any) {
      console.error('Error listing jobs:', error);
      res.status(500).json({
        error: {
          message: 'Failed to list jobs',
          details: error.message
        }
      });
    }
  });
  
  /**
   * Get job by ID
   * GET /api/jobs/:id
   */
  router.get('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      
      const job = await jobQueue.getJob(id);
      
      if (!job) {
        return res.status(404).json({
          error: {
            message: `Job with ID '${id}' not found`,
            code: 'JOB_NOT_FOUND'
          }
        });
      }
      
      res.json(job);
    } catch (error: any) {
      console.error(`Error getting job '${req.params.id}':`, error);
      res.status(500).json({
        error: {
          message: 'Failed to get job',
          details: error.message
        }
      });
    }
  });
  
  /**
   * Cancel job
   * POST /api/jobs/:id/cancel
   */
  router.post('/:id/cancel', async (req, res) => {
    try {
      const { id } = req.params;
      
      const job = await jobQueue.cancelJob(id);
      
      if (!job) {
        return res.status(404).json({
          error: {
            message: `Job with ID '${id}' not found`,
            code: 'JOB_NOT_FOUND'
          }
        });
      }
      
      res.json({
        message: `Job '${id}' cancelled successfully`,
        job
      });
    } catch (error: any) {
      console.error(`Error cancelling job '${req.params.id}':`, error);
      res.status(500).json({
        error: {
          message: 'Failed to cancel job',
          details: error.message
        }
      });
    }
  });
  
  /**
   * Get job status
   * GET /api/jobs/:id/status
   */
  router.get('/:id/status', async (req, res) => {
    try {
      const { id } = req.params;
      
      const job = await jobQueue.getJob(id);
      
      if (!job) {
        return res.status(404).json({
          error: {
            message: `Job with ID '${id}' not found`,
            code: 'JOB_NOT_FOUND'
          }
        });
      }
      
      res.json({
        id: job.id,
        name: job.name,
        status: job.status,
        progress: job.progress,
        createdAt: job.createdAt,
        startedAt: job.startedAt,
        completedAt: job.completedAt,
        error: job.error
      });
    } catch (error: any) {
      console.error(`Error getting job status '${req.params.id}':`, error);
      res.status(500).json({
        error: {
          message: 'Failed to get job status',
          details: error.message
        }
      });
    }
  });
  
  /**
   * Get job result
   * GET /api/jobs/:id/result
   */
  router.get('/:id/result', async (req, res) => {
    try {
      const { id } = req.params;
      
      const job = await jobQueue.getJob(id);
      
      if (!job) {
        return res.status(404).json({
          error: {
            message: `Job with ID '${id}' not found`,
            code: 'JOB_NOT_FOUND'
          }
        });
      }
      
      if (job.status !== JobStatus.COMPLETED) {
        return res.status(400).json({
          error: {
            message: `Job '${id}' is not completed (status: ${job.status})`,
            code: 'JOB_NOT_COMPLETED'
          }
        });
      }
      
      res.json({
        id: job.id,
        result: job.result
      });
    } catch (error: any) {
      console.error(`Error getting job result '${req.params.id}':`, error);
      res.status(500).json({
        error: {
          message: 'Failed to get job result',
          details: error.message
        }
      });
    }
  });
  
  /**
   * Clear all jobs (admin only)
   * DELETE /api/jobs
   */
  router.delete('/', (req, res) => {
    // Check if user is admin
    const isAdmin = req.user?.permissions?.includes('admin');
    
    if (!isAdmin) {
      return res.status(403).json({
        error: {
          message: 'Only admins can clear all jobs',
          code: 'PERMISSION_DENIED'
        }
      });
    }
    
    jobQueue.clearJobs()
      .then(() => {
        res.json({
          message: 'All jobs cleared successfully'
        });
      })
      .catch((error) => {
        console.error('Error clearing jobs:', error);
        res.status(500).json({
          error: {
            message: 'Failed to clear jobs',
            details: error.message
          }
        });
      });
  });
  
  return router;
}