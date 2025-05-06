/**
 * Metadata Routes
 * 
 * This file defines the API routes for managing metadata like prompts,
 * app configurations, and other persistent data.
 */

import express, { Router } from 'express';
import { z } from 'zod';
import { Storage } from '../storage/index.js';
import { auth, validation } from '../middleware/index.js';

// Define metadata item interface
interface MetadataItem {
  id: string;
  name: string;
  type: string;
  data: Record<string, any>;
  tags?: string[];
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

// Define validation schemas
const metadataQuerySchema = z.object({
  collection: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20)
});

const metadataSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  type: z.string().min(1),
  data: z.record(z.any()),
  tags: z.array(z.string()).optional(),
  userId: z.string().optional()
});

/**
 * Create metadata routes
 */
export default function metadataRoutes(storage: Storage): Router {
  const router = express.Router();
  
  // Apply authentication middleware to all metadata routes
  router.use(auth.authenticate);
  
  /**
   * List metadata
   * GET /api/metadata
   */
  router.get('/', validation.validate(metadataQuerySchema, 'query'), async (req, res) => {
    try {
      const { collection, page, limit } = req.query as any;
      const skip = (page - 1) * limit;
      
      // Get metadata from the specified collection
      const metadataCollection = collection || 'metadata';
      
      // Add user filter for non-admin users
      const isAdmin = req.user?.permissions?.includes('admin');
      const filter: Record<string, any> = isAdmin ? {} : { userId: req.user?.id || 'anonymous' };
      
      // Get items with type casting
      const items = await storage.find<MetadataItem>(metadataCollection, filter as any);
      
      // Apply pagination
      const paginatedItems = items.slice(skip, skip + limit);
      
      res.json({
        items: paginatedItems,
        page,
        limit,
        totalItems: items.length,
        totalPages: Math.ceil(items.length / limit)
      });
    } catch (error: any) {
      console.error('Error listing metadata:', error);
      res.status(500).json({
        error: {
          message: 'Failed to list metadata',
          details: error.message
        }
      });
    }
  });
  
  /**
   * Get metadata by ID
   * GET /api/metadata/:id
   */
  router.get('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      
      // Get metadata from the generic metadata collection
      const item = await storage.findById<MetadataItem>('metadata', id);
      
      if (!item) {
        return res.status(404).json({
          error: {
            message: `Metadata with ID '${id}' not found`,
            code: 'METADATA_NOT_FOUND'
          }
        });
      }
      
      // Check if user has access
      const isAdmin = req.user?.permissions?.includes('admin');
      const hasAccess = isAdmin || item.userId === req.user?.id || item.userId === 'anonymous';
      
      if (!hasAccess) {
        return res.status(403).json({
          error: {
            message: 'You do not have permission to access this metadata',
            code: 'PERMISSION_DENIED'
          }
        });
      }
      
      res.json(item);
    } catch (error: any) {
      console.error(`Error getting metadata '${req.params.id}':`, error);
      res.status(500).json({
        error: {
          message: 'Failed to get metadata',
          details: error.message
        }
      });
    }
  });
  
  /**
   * Create metadata
   * POST /api/metadata
   */
  router.post('/', validation.validate(metadataSchema), async (req, res) => {
    try {
      // Add user information to the metadata
      const metadata = {
        ...req.body,
        userId: req.user?.id || 'anonymous'
      };
      
      // Create the metadata item
      const item = await storage.create<MetadataItem>('metadata', metadata);
      
      res.status(201).json({
        message: 'Metadata created successfully',
        item
      });
    } catch (error: any) {
      console.error('Error creating metadata:', error);
      res.status(500).json({
        error: {
          message: 'Failed to create metadata',
          details: error.message
        }
      });
    }
  });
  
  /**
   * Update metadata
   * PUT /api/metadata/:id
   */
  router.put('/:id', validation.validate(metadataSchema), async (req, res) => {
    try {
      const { id } = req.params;
      
      // Check if metadata exists
      const existingItem = await storage.findById<MetadataItem>('metadata', id);
      
      if (!existingItem) {
        return res.status(404).json({
          error: {
            message: `Metadata with ID '${id}' not found`,
            code: 'METADATA_NOT_FOUND'
          }
        });
      }
      
      // Check if user has access
      const isAdmin = req.user?.permissions?.includes('admin');
      const hasAccess = isAdmin || existingItem.userId === req.user?.id;
      
      if (!hasAccess) {
        return res.status(403).json({
          error: {
            message: 'You do not have permission to update this metadata',
            code: 'PERMISSION_DENIED'
          }
        });
      }
      
      // Update the metadata
      const updatedItem = await storage.updateById<MetadataItem>('metadata', id, {
        ...req.body,
        userId: existingItem.userId, // Preserve the original user ID
        updatedAt: new Date().toISOString()
      });
      
      res.json({
        message: 'Metadata updated successfully',
        item: updatedItem
      });
    } catch (error: any) {
      console.error(`Error updating metadata '${req.params.id}':`, error);
      res.status(500).json({
        error: {
          message: 'Failed to update metadata',
          details: error.message
        }
      });
    }
  });
  
  /**
   * Delete metadata
   * DELETE /api/metadata/:id
   */
  router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      
      // Check if metadata exists
      const existingItem = await storage.findById<MetadataItem>('metadata', id);
      
      if (!existingItem) {
        return res.status(404).json({
          error: {
            message: `Metadata with ID '${id}' not found`,
            code: 'METADATA_NOT_FOUND'
          }
        });
      }
      
      // Check if user has access
      const isAdmin = req.user?.permissions?.includes('admin');
      const hasAccess = isAdmin || existingItem.userId === req.user?.id;
      
      if (!hasAccess) {
        return res.status(403).json({
          error: {
            message: 'You do not have permission to delete this metadata',
            code: 'PERMISSION_DENIED'
          }
        });
      }
      
      // Delete the metadata
      await storage.deleteById('metadata', id);
      
      res.json({
        message: 'Metadata deleted successfully'
      });
    } catch (error: any) {
      console.error(`Error deleting metadata '${req.params.id}':`, error);
      res.status(500).json({
        error: {
          message: 'Failed to delete metadata',
          details: error.message
        }
      });
    }
  });
  
  return router;
}