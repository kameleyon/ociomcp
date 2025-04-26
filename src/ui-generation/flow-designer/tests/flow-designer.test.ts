/**
 * Flow Designer Tests
 * 
 * Integration tests for the Flow Designer system
 */

import * as path from 'path';
import * as fs from 'fs/promises';
import { FlowDesigner, validateFlowOptions, FlowOptions, generateReactFlowDesigner } from '../index';

// Test validation
async function testValidation(): Promise<boolean> {
  console.log('Testing validation...');
  
  // Valid case
  const validOptions = {
    name: 'Test Flow',
    framework: 'react',
    flowType: 'wizard',
    steps: [
      {
        id: 'step1',
        title: 'Step 1',
        isInitial: true
      },
      {
        id: 'step2',
        title: 'Step 2',
        isFinal: true
      }
    ],
    styling: 'css',
    typescript: true,
    responsive: true
  };
  
  const validResult = validateFlowOptions(validOptions);
  
  if (!validResult.valid) {
    console.error('Validation failed for valid options:', validResult);
    return false;
  }
  
  // Invalid case - missing required fields
  const invalidOptions = {
    name: 'Test Flow',
    framework: 'react',
    steps: [] // Missing required steps
  };
  
  const invalidResult = validateFlowOptions(invalidOptions);
  
  if (invalidResult.valid) {
    console.error('Validation passed for invalid options');
    return false;
  }
  
  // Invalid case - duplicate step IDs
  const duplicateStepOptions = {
    name: 'Test Flow',
    framework: 'react',
    flowType: 'wizard',
    steps: [
      {
        id: 'step1',
        title: 'Step 1'
      },
      {
        id: 'step1', // Duplicate ID
        title: 'Step 2'
      }
    ],
    styling: 'css',
    typescript: true,
    responsive: true
  };
  
  const duplicateResult = validateFlowOptions(duplicateStepOptions);
  
  if (duplicateResult.valid) {
    console.error('Validation passed for options with duplicate step IDs');
    return false;
  }
  
  console.log('Validation tests passed!');
  return true;
}

// Test React generator
async function testReactGenerator(): Promise<boolean> {
  console.log('Testing React generator...');
  
  const flowOptions: FlowOptions = {
    name: 'TestFlow',
    framework: 'react',
    flowType: 'wizard',
    steps: [
      {
        id: 'personal',
        title: 'Personal Information',
        isInitial: true,
        validationRules: [
          {
            field: 'name',
            rule: 'required',
            message: 'Name is required'
          }
        ]
      },
      {
        id: 'address',
        title: 'Address'
      },
      {
        id: 'confirmation',
        title: 'Confirmation',
        isFinal: true
      }
    ],
    styling: 'css',
    typescript: true,
    responsive: true,
    features: ['breadcrumbs', 'validation', 'back-button']
  };
  
  const result = generateReactFlowDesigner(flowOptions);
  
  if (!result.success || !result.files || result.files.length === 0) {
    console.error('React generator failed:', result.message);
    return false;
  }
  
  // Check that we have the expected files
  const expectedFileCount = 7; // Main component, styles, 3 step components, index.ts, validation
  if (result.files.length < expectedFileCount) {
    console.error(`Expected at least ${expectedFileCount} files, but got ${result.files.length}`);
    return false;
  }
  
  console.log('React generator tests passed!');
  return true;
}

// Test file writing
async function testFileWriting(): Promise<boolean> {
  console.log('Testing file writing...');
  
  const tempDir = path.join(__dirname, 'temp');
  
  try {
    // Create temp directory
    await fs.mkdir(tempDir, { recursive: true });
    
    const flowOptions: FlowOptions = {
      name: 'MiniFlow',
      framework: 'react',
      flowType: 'wizard',
      steps: [
        {
          id: 'step1',
          title: 'Step 1',
          isInitial: true
        },
        {
          id: 'step2',
          title: 'Step 2',
          isFinal: true
        }
      ],
      styling: 'css',
      typescript: true,
      responsive: true,
      outputDir: tempDir
    };
    
    // Generate and write files
    const result = await FlowDesigner.createFlowDesigner(flowOptions, tempDir);
    
    if (!result.success || !result.files || result.files.length === 0) {
      console.error('File writing failed:', result.message);
      return false;
    }
    
    // Check if files were created
    for (const filePath of result.files) {
      try {
        await fs.access(filePath);
      } catch (error) {
        console.error(`Failed to access written file: ${filePath}`);
        return false;
      }
    }
    
    console.log('File writing tests passed!');
    return true;
  } catch (error) {
    console.error('Error in file writing test:', error);
    return false;
  } finally {
    // Clean up temp directory
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch (error) {
      console.warn('Failed to clean up temp directory:', error);
    }
  }
}

// Run all tests
async function runTests(): Promise<void> {
  let passed = true;
  
  passed = await testValidation() && passed;
  passed = await testReactGenerator() && passed;
  passed = await testFileWriting() && passed;
  
  if (passed) {
    console.log('All tests passed!');
  } else {
    console.error('Some tests failed.');
    process.exit(1);
  }
}

// Execute when called directly
if (require.main === module) {
  runTests();
}

export {
  testValidation,
  testReactGenerator,
  testFileWriting,
  runTests
};
