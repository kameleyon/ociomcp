/**
 * Storage System
 * 
 * This module provides a unified interface for persistent storage,
 * supporting both file-based and MongoDB storage backends.
 */

import { config } from '../config.js';
import FileStorage from './file-storage.js';
// Import MongoDB storage when implemented
// import MongoStorage from './mongo-storage.js';

// Define the storage interface
export interface Storage {
  create<T extends Record<string, any>>(collection: string, data: T): Promise<T>;
  findById<T>(collection: string, id: string): Promise<T | null>;
  find<T>(collection: string, filter?: Partial<T>): Promise<T[]>;
  updateById<T>(collection: string, id: string, data: Partial<T>): Promise<T | null>;
  deleteById(collection: string, id: string): Promise<boolean>;
  deleteAll(collection: string): Promise<boolean>;
}

// Factory function to create the appropriate storage instance
export function initializeStorage(): Storage {
  const storageType = config.storage.type.toLowerCase();
  
  switch (storageType) {
    case 'mongodb':
      // When MongoDB implementation is ready, use it
      // return new MongoStorage(config.storage.mongoUri);
      console.warn('MongoDB storage requested but not implemented yet. Using file storage instead.');
      return new FileStorage();
      
    case 'file':
    default:
      return new FileStorage();
  }
}

// Export the storage implementation types
export { FileStorage };

// Export default for ESM compatibility
export default {
  initializeStorage
};