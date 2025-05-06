/**
 * Authentication Middleware
 * 
 * This middleware handles API key and JWT token validation.
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';

// Extend Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        permissions: string[];
      };
      apiKey?: string;
    }
  }
}

/**
 * Verifies API key from request headers
 */
export const apiKeyAuth = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'] as string;
  
  if (!apiKey) {
    return res.status(401).json({
      error: {
        message: 'API Key is required',
        code: 'AUTH_MISSING_API_KEY'
      }
    });
  }

  // Check if API key is valid
  if (!config.auth.apiKeys.includes(apiKey)) {
    return res.status(401).json({
      error: {
        message: 'Invalid API Key',
        code: 'AUTH_INVALID_API_KEY'
      }
    });
  }

  // Store API key in request object for later use
  req.apiKey = apiKey;
  next();
};

/**
 * Verifies JWT token from Authorization header
 */
export const jwtAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({
      error: {
        message: 'Authorization header is required',
        code: 'AUTH_MISSING_HEADER'
      }
    });
  }

  const parts = authHeader.split(' ');
  
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      error: {
        message: 'Authorization header format must be "Bearer {token}"',
        code: 'AUTH_INVALID_FORMAT'
      }
    });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, config.auth.jwtSecret);
    req.user = decoded as any;
    next();
  } catch (error) {
    return res.status(401).json({
      error: {
        message: 'Invalid or expired token',
        code: 'AUTH_INVALID_TOKEN'
      }
    });
  }
};

/**
 * Middleware that allows either API key or JWT token
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'] as string;
  const authHeader = req.headers.authorization;

  // Check if API key is provided
  if (apiKey) {
    return apiKeyAuth(req, res, next);
  }

  // Check if Authorization header is provided
  if (authHeader) {
    return jwtAuth(req, res, next);
  }

  // Neither API key nor Authorization header provided
  return res.status(401).json({
    error: {
      message: 'Authentication required - provide API key or JWT token',
      code: 'AUTH_REQUIRED'
    }
  });
};

export default {
  apiKeyAuth,
  jwtAuth,
  authenticate
};