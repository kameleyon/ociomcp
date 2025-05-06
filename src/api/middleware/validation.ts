/**
 * Validation Middleware
 * 
 * This middleware validates request payloads against tool schemas
 * from the plugin manager to ensure the data is valid before processing.
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { getPluginManager } from '../../tools/code-tools/plugin-manager.js';

/**
 * Middleware to validate request body against a tool's schema
 * @param toolName Name of the tool to validate against
 */
export const validateToolInput = (toolName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const pluginManager = getPluginManager();
    const tool = pluginManager.getTool(toolName);
    
    if (!tool) {
      return res.status(404).json({
        error: {
          message: `Tool '${toolName}' not found`,
          code: 'VALIDATION_TOOL_NOT_FOUND'
        }
      });
    }
    
    // If the tool has no schema, skip validation
    if (!tool.inputSchema) {
      return next();
    }
    
    try {
      // Parse the request body against the tool's schema
      const result = tool.inputSchema.safeParse(req.body.args);
      
      if (!result.success) {
        return res.status(400).json({
          error: {
            message: 'Invalid input parameters',
            code: 'VALIDATION_FAILED',
            details: result.error.format()
          }
        });
      }
      
      // Replace the request args with the validated and transformed data
      req.body.args = result.data;
      next();
    } catch (error: any) {
      return res.status(500).json({
        error: {
          message: 'Validation error',
          code: 'VALIDATION_ERROR',
          details: error.message
        }
      });
    }
  };
};

/**
 * Generic validation middleware that can validate against any Zod schema
 * @param schema Zod schema to validate against
 * @param source Where to find the data to validate (default: 'body')
 */
export const validate = (schema: z.ZodType<any>, source: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = source === 'body' ? req.body : 
                   source === 'query' ? req.query : req.params;
      
      const result = schema.safeParse(data);
      
      if (!result.success) {
        return res.status(400).json({
          error: {
            message: 'Validation failed',
            code: 'VALIDATION_FAILED',
            details: result.error.format()
          }
        });
      }
      
      // Replace the data with the validated and transformed data
      if (source === 'body') {
        req.body = result.data;
      } else if (source === 'query') {
        req.query = result.data;
      } else {
        req.params = result.data;
      }
      
      next();
    } catch (error: any) {
      return res.status(500).json({
        error: {
          message: 'Validation error',
          code: 'VALIDATION_ERROR',
          details: error.message
        }
      });
    }
  };
};

// Common validation schemas
export const schemas = {
  toolExecution: z.object({
    name: z.string(),
    args: z.any()
  }),
  
  pagination: z.object({
    page: z.number().int().positive().default(1),
    limit: z.number().int().positive().max(100).default(20)
  }),
  
  id: z.object({
    id: z.string().uuid()
  }),
  
  jobId: z.object({
    jobId: z.string().uuid()
  })
};

export default {
  validateToolInput,
  validate,
  schemas
};