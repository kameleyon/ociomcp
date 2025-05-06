/**
 * Middleware Index
 * 
 * This file exports all middleware components and provides a setup function
 * to configure them on an Express application instance.
 */

import { Express } from 'express';
import rateLimit from 'express-rate-limit';
import { config } from '../config.js';
import auth from './auth.js';
import validation from './validation.js';
import logging from './logging.js';

// Export all middleware modules
export { auth, validation, logging };

// Type for the setup options
interface SetupOptions {
  storage: any;
}

/**
 * Configure middleware for the Express application
 */
export function setupMiddleware(app: Express, options: SetupOptions): void {
  const { storage } = options;
  
  // Setup HTTP request logging
  app.use(logging.requestLogger);
  
  // Enable detailed request/response logging in debug mode
  if (config.logging.level === 'debug') {
    app.use(logging.detailedLogger);
  }
  
  // Configure rate limiting
  const limiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      error: {
        message: 'Too many requests, please try again later',
        code: 'RATE_LIMIT_EXCEEDED'
      }
    }
  });
  
  // Apply rate limiting to all routes
  app.use(limiter);
  
  // Log all tool calls
  app.use(logging.toolCallLogger);
  
  // Set up error logging as the last middleware
  app.use(logging.errorLogger);
}

// Export default for ESM compatibility
export default {
  setupMiddleware,
  auth,
  validation,
  logging
};