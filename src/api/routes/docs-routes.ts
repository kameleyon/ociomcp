/**
 * Documentation Routes
 * 
 * This file sets up the API documentation using Swagger/OpenAPI.
 */

import express, { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

/**
 * Create documentation routes
 */
export default function docsRoutes(): Router {
  const router = express.Router();
  
  // Swagger setup
  const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'OptimusCode API',
        version: '1.0.0',
        description: 'API wrapper for MCP tools in OptimusCode',
        contact: {
          name: 'OptimusCode',
          url: 'https://github.com/optimuscode/optimuscode',
        },
        license: {
          name: 'MIT',
          url: 'https://opensource.org/licenses/MIT',
        },
      },
      servers: [
        {
          url: 'http://localhost:3001',
          description: 'Development server',
        },
        {
          url: 'https://api.optimuscode.ai',
          description: 'Production server',
        },
      ],
      components: {
        securitySchemes: {
          ApiKeyAuth: {
            type: 'apiKey',
            in: 'header',
            name: 'X-API-Key',
          },
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [
        { ApiKeyAuth: [] },
        { BearerAuth: [] },
      ],
      tags: [
        {
          name: 'tools',
          description: 'MCP tool operations',
        },
        {
          name: 'jobs',
          description: 'Job queue operations',
        },
        {
          name: 'metadata',
          description: 'Metadata storage operations',
        },
      ],
    },
    apis: ['./src/api/routes/*.ts'], // Path to the API docs
  };
  
  // Initialize swagger-jsdoc
  const swaggerSpec = swaggerJsdoc(swaggerOptions);
  
  // Serve swagger docs
  router.use('/', swaggerUi.serve);
  router.get('/', swaggerUi.setup(swaggerSpec));
  
  // Export OpenAPI spec as JSON
  router.get('/spec.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  
  // Add some basic documentation
  router.get('/readme', (req, res) => {
    res.send(`
      <html>
        <head>
          <title>OptimusCode API Documentation</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; max-width: 800px; margin: 0 auto; }
            h1 { color: #333; }
            h2 { color: #444; margin-top: 20px; }
            code { background: #f4f4f4; padding: 2px 5px; border-radius: 3px; }
            pre { background: #f4f4f4; padding: 10px; border-radius: 5px; overflow-x: auto; }
          </style>
        </head>
        <body>
          <h1>OptimusCode API</h1>
          <p>This API provides access to OptimusCode MCP tools for AI-powered development.</p>
          
          <h2>Authentication</h2>
          <p>All API requests require authentication using either an API key or a JWT token.</p>
          <p>To use an API key, include it in the <code>X-API-Key</code> header:</p>
          <pre>X-API-Key: your-api-key</pre>
          <p>To use JWT authentication, include a bearer token in the <code>Authorization</code> header:</p>
          <pre>Authorization: Bearer your-jwt-token</pre>
          
          <h2>Key Endpoints</h2>
          <ul>
            <li><code>GET /api/tools</code> - List all available tools</li>
            <li><code>POST /api/tools/:name/execute</code> - Execute a tool directly</li>
            <li><code>POST /api/tools/:name/job</code> - Create a job for asynchronous tool execution</li>
            <li><code>GET /api/jobs</code> - List all jobs</li>
            <li><code>GET /api/jobs/:id</code> - Get job details</li>
            <li><code>GET /api/jobs/:id/status</code> - Get job status</li>
            <li><code>GET /api/metadata</code> - List metadata</li>
          </ul>
          
          <h2>API Documentation</h2>
          <p>Interactive API documentation is available at <a href="/docs">/docs</a> using Swagger UI.</p>
          <p>The OpenAPI specification is available at <a href="/docs/spec.json">/docs/spec.json</a>.</p>
          
          <h2>Rate Limiting</h2>
          <p>The API implements rate limiting to prevent abuse. If you exceed the rate limit, you will receive a 429 Too Many Requests response.</p>
          
          <h2>Error Handling</h2>
          <p>All errors follow a standard format:</p>
          <pre>{
  "error": {
    "message": "Description of the error",
    "code": "ERROR_CODE",
    "details": "Additional error details or validation errors"
  }
}</pre>
        </body>
      </html>
    `);
  });
  
  return router;
}