/**
 * Test script for the Post-Boot Activation System
 */

// Use direct import with .js extension for ESM compatibility
import { activateTools } from './lib/postBootActivator.js';

// Display start message
console.log('===== Testing Post-Boot Activation System =====');

// Call the activateTools function directly
activateTools()
  .then(results => {
    console.log('\n===== Activation Results =====');
    results.forEach(result => {
      const icon = result.status === 'Activated' ? '✅' : 
                  result.status === 'Fallback' ? '⚠️' : '❌';
      
      console.log(`${icon} ${result.toolName}: ${result.status}`);
      if (result.message) {
        console.log(`   Message: ${result.message}`);
      }
    });
    
    console.log('\n===== Statistics =====');
    const activated = results.filter(r => r.status === 'Activated').length;
    const fallback = results.filter(r => r.status === 'Fallback').length;
    const failed = results.filter(r => r.status === 'Failed').length;
    
    console.log(`Total tools processed: ${results.length}`);
    console.log(`Successfully activated: ${activated}`);
    console.log(`Fallback mode: ${fallback}`);
    console.log(`Failed: ${failed}`);
  })
  .catch(error => {
    console.error('Error during test:', error);
  });
