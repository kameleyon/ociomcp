/**
 * Test script for Tool Layer Enhancement
 * 
 * Tests the activation and fallback functionality for tools
 */

import { activateTools, broadcastSessionStart, broadcastFileWrite, broadcastCommand } from './activatedTools/index.js';

async function runTest() {
  console.log('=== Tool Layer Enhancement Test ===');
  
  // Test tool activation
  console.log('\n[Test] Activating all tools...');
  const activationResults = await activateTools({
    // Example tool-specific settings
    CodeFixer: { enableAutoFix: true },
    ResponsiveUI: { defaultBreakpoints: ['sm', 'md', 'lg'] },
    SnapshotCreator: { createAfterEachFile: true }
  });
  
  console.log('\n[Test] Tool activation results:', activationResults);
  
  // Test event broadcasts
  console.log('\n[Test] Broadcasting session start event...');
  broadcastSessionStart({ id: 'test-session-123', startTime: new Date() });
  
  console.log('\n[Test] Broadcasting file write event...');
  broadcastFileWrite({ path: 'test/path/file.js', content: '// Test content' });
  
  console.log('\n[Test] Broadcasting command event...');
  broadcastCommand('test-command --with-args');
  
  console.log('\n=== Tool Layer Enhancement Test Complete ===');
}

runTest().catch(error => {
  console.error('Test failed with error:', error);
});
