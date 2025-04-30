/**
 * Register the snapshot tool from the automated-tools directory
 * This ensures we use only one snapshot tool in the project
 */

// This script registers the snapshot tool from the automated-tools directory

// Import the snapshot tool
import * as Snapshot from './src/tools/automated-tools/snapshot.js';

// Log that the tool is registered
console.log('[TOOL] Snapshot tool registered from automated-tools directory');

// Test creating a snapshot
Snapshot.createSnapshot()
  .then(path => console.log(`Test snapshot created at: ${path}`))
  .catch(err => console.error('Error creating test snapshot:', err));

// No need to register with toolRegistry directly
// The tool will be picked up by the system through the automated-tools/index.ts exports