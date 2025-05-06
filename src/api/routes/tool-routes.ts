/**
 * Tool Routes
 * 
 * This file defines the API routes for interacting with MCP tools.
 */

import express, { Router } from 'express';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { Storage } from '../storage/index.js';
import { JobQueue, JobPriority, JobCreationParams } from '../queue/index.js';
import { auth, validation } from '../middleware/index.js';
import { config } from '../config.js';

/**
 * Create tool routes
 */
export default function toolRoutes(
  pluginManager: any,
  storage: Storage,
  jobQueue: JobQueue
): Router {
  const router = express.Router();
  
  // Apply authentication middleware to all tool routes
  router.use(auth.authenticate);
  
  /**
   * List all available tools
   * GET /api/tools
   */
  router.get('/', async (req, res) => {
    try {
      // Get all tools from plugin manager
      const allTools = Array.from(pluginManager.getAllTools().entries()) as [string, any][];
      
      // Filter out internal tools if user is not an admin
      const isAdmin = req.user?.permissions?.includes('admin');
      const tools = allTools.filter(([name]: [string, any]) => {
        const isInternal = config.tools.internalTools.includes(name);
        return isAdmin || !isInternal;
      });
      
      // Format the response
      const formattedTools = tools.map(([name, tool]: [string, any]) => ({
        name,
        description: tool.description || `${name} tool`,
        inputSchema: tool.inputSchema ? zodToJsonSchema(tool.inputSchema) : {},
        hasSchema: !!tool.inputSchema
      }));
      
      res.json({
        tools: formattedTools,
        count: formattedTools.length
      });
    } catch (error: any) {
      console.error('Error listing tools:', error);
      res.status(500).json({
        error: {
          message: 'Failed to list tools',
          details: error.message
        }
      });
    }
  });
  
  /**
   * Get tool schema
   * GET /api/tools/:name/schema
   */
  router.get('/:name/schema', (req, res) => {
    const { name } = req.params;
    
    try {
      // Get the tool
      const tool = pluginManager.getTool(name);
      
      if (!tool) {
        return res.status(404).json({
          error: {
            message: `Tool '${name}' not found`,
            code: 'TOOL_NOT_FOUND'
          }
        });
      }
      
      // Check if it's an internal tool
      const isInternal = config.tools.internalTools.includes(name);
      const isAdmin = req.user?.permissions?.includes('admin');
      
      if (isInternal && !isAdmin) {
        return res.status(403).json({
          error: {
            message: `Tool '${name}' is not accessible`,
            code: 'TOOL_ACCESS_DENIED'
          }
        });
      }
      
      // Get the schema
      const inputSchema = tool.inputSchema ? zodToJsonSchema(tool.inputSchema) : null;
      
      res.json({
        name,
        description: tool.description || `${name} tool`,
        schema: inputSchema || {},
        hasSchema: !!inputSchema
      });
    } catch (error: any) {
      console.error(`Error getting schema for tool '${req.params.name}':`, error);
      res.status(500).json({
        error: {
          message: 'Failed to get tool schema',
          details: error.message
        }
      });
    }
  });
  
  /**
   * Execute a tool directly
   * POST /api/tools/:name/execute
   */
  router.post('/:name/execute', async (req, res) => {
    const { name } = req.params;
    let args = req.body;
    
    try {
      // Get the tool
      const tool = pluginManager.getTool(name);
      
      if (!tool) {
        return res.status(404).json({
          error: {
            message: `Tool '${name}' not found`,
            code: 'TOOL_NOT_FOUND'
          }
        });
      }
      
      // Check if it's an internal tool
      const isInternal = config.tools.internalTools.includes(name);
      const isAdmin = req.user?.permissions?.includes('admin');
      
      if (isInternal && !isAdmin) {
        return res.status(403).json({
          error: {
            message: `Tool '${name}' is not accessible`,
            code: 'TOOL_ACCESS_DENIED'
          }
        });
      }
      
      // Validate input if schema exists
      if (tool.inputSchema) {
        const validationResult = tool.inputSchema.safeParse(args);
        
        if (!validationResult.success) {
          return res.status(400).json({
            error: {
              message: 'Invalid arguments',
              code: 'INVALID_INPUT',
              details: validationResult.error.format()
            }
          });
        }
        
        // Use the validated data
        args = validationResult.data;
      }
      
      // Execute the tool
      const result = await tool.onCommand({
        name: `${name}:execute`,
        args
      });
      
      // Log the execution
      await storage.create('toolExecutions', {
        toolName: name,
        args,
        result,
        userId: req.user?.id || 'api-key',
        timestamp: new Date().toISOString()
      });
      
      res.json(result);
    } catch (error: any) {
      console.error(`Error executing tool '${name}':`, error);
      res.status(500).json({
        error: {
          message: 'Failed to execute tool',
          details: error.message
        }
      });
    }
  });
  
  /**
   * Create a job for asynchronous tool execution
   * POST /api/tools/:name/job
   */
  router.post('/:name/job', async (req, res) => {
    const { name } = req.params;
    let { args, priority } = req.body;
    
    try {
      // Get the tool
      const tool = pluginManager.getTool(name);
      
      if (!tool) {
        return res.status(404).json({
          error: {
            message: `Tool '${name}' not found`,
            code: 'TOOL_NOT_FOUND'
          }
        });
      }
      
      // Check if it's an internal tool
      const isInternal = config.tools.internalTools.includes(name);
      const isAdmin = req.user?.permissions?.includes('admin');
      
      if (isInternal && !isAdmin) {
        return res.status(403).json({
          error: {
            message: `Tool '${name}' is not accessible`,
            code: 'TOOL_ACCESS_DENIED'
          }
        });
      }
      
      // Validate input if schema exists
      if (tool.inputSchema) {
        const validationResult = tool.inputSchema.safeParse(args);
        
        if (!validationResult.success) {
          return res.status(400).json({
            error: {
              message: 'Invalid arguments',
              code: 'INVALID_INPUT',
              details: validationResult.error.format()
            }
          });
        }
        
        // Use the validated data
        args = validationResult.data;
      }
      
      // Create a job
      const job = await jobQueue.createJob({
        name: `${name} execution`,
        type: name,
        priority: priority || JobPriority.NORMAL,
        payload: args,
        metadata: {
          userId: req.user?.id || 'api-key',
          apiKey: req.apiKey
        }
      });
      
      res.status(202).json({
        jobId: job.id,
        status: job.status,
        message: 'Job created successfully'
      });
    } catch (error: any) {
      console.error(`Error creating job for tool '${name}':`, error);
      res.status(500).json({
        error: {
          message: 'Failed to create job',
          details: error.message
        }
      });
    }
  });
  
  /**
   * Generate app (combined tool execution)
   * POST /api/tools/generate-app
   */
  router.post('/generate-app', validation.validate(z.object({
    name: z.string(),
    description: z.string(),
    type: z.enum(['web', 'mobile', 'api']),
    features: z.array(z.string()),
    prompt: z.string()
  })), async (req, res) => {
    try {
      // Create a job for app generation
      const job = await jobQueue.createJob({
        name: `Generate ${req.body.name} app`,
        type: 'generate-app',
        priority: JobPriority.NORMAL,
        payload: {
          ...req.body,
          appId: req.body.name.toLowerCase().replace(/[^a-z0-9]/g, '-')
        },
        metadata: {
          userId: req.user?.id || 'api-key',
          apiKey: req.apiKey
        }
      });
      
      res.status(202).json({
        jobId: job.id,
        status: job.status,
        message: 'App generation job created successfully'
      });
    } catch (error: any) {
      console.error('Error creating app generation job:', error);
      res.status(500).json({
        error: {
          message: 'Failed to create app generation job',
          details: error.message
        }
      });
    }
  });
  
  return router;
}