/**
 * API Configuration Settings
 * 
 * This file contains all configuration options for the OptimusCode API wrapper.
 */

// Load environment variables from .env file if available
import dotenv from 'dotenv';
dotenv.config();

// API Server configuration
export const config = {
  // Server settings
  port: process.env.API_PORT ? parseInt(process.env.API_PORT) : 3001,
  host: process.env.API_HOST || '0.0.0.0',
  env: process.env.NODE_ENV || 'development',
  
  // CORS settings
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  },
  
  // Authentication settings
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'optimuscode-dev-secret-key-change-in-production',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
    apiKeys: (process.env.API_KEYS || 'dev-api-key-1,dev-api-key-2').split(',')
  },
  
  // Rate limiting
  rateLimit: {
    windowMs: process.env.RATE_LIMIT_WINDOW ? parseInt(process.env.RATE_LIMIT_WINDOW) : 15 * 60 * 1000, // 15 minutes
    max: process.env.RATE_LIMIT_MAX ? parseInt(process.env.RATE_LIMIT_MAX) : 100 // 100 requests per windowMs
  },
  
  // Storage settings
  storage: {
    type: process.env.STORAGE_TYPE || 'file', // 'file' or 'mongodb'
    filePath: process.env.STORAGE_FILE_PATH || './data',
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/optimuscode'
  },
  
  // Job queue settings
  jobQueue: {
    concurrency: process.env.JOB_QUEUE_CONCURRENCY ? parseInt(process.env.JOB_QUEUE_CONCURRENCY) : 2,
    timeout: process.env.JOB_QUEUE_TIMEOUT ? parseInt(process.env.JOB_QUEUE_TIMEOUT) : 30 * 60 * 1000, // 30 minutes
    retries: process.env.JOB_QUEUE_RETRIES ? parseInt(process.env.JOB_QUEUE_RETRIES) : 3,
    autostart: process.env.JOB_QUEUE_AUTOSTART !== 'false'
  },
  
  // Logging settings
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'dev' // 'dev', 'combined', 'common', 'short', 'tiny'
  },
  
  // Tool visibility settings
  tools: {
    defaultVisibility: process.env.TOOL_DEFAULT_VISIBILITY || 'public', // 'public' or 'internal'
    // List of tools explicitly marked as internal (not exposed via API)
    internalTools: (process.env.INTERNAL_TOOLS || 'tool-suggester,metadata-reader').split(',')
  }
};

// Export types for TypeScript support
export type Config = typeof config;

// Export default config
export default config;