// Test script for directory validation in code-fixer
import * as codeFixer from './code-fixer-wrapper.js';

async function testDirectoryValidation() {
  console.log('Testing directory validation...');
  
  // Test handleFixCode with a directory path
  console.log('\nTesting handleFixCode with directory path:');
  const fixResult = await codeFixer.handleFixCode({ 
    path: './src' 
  });
  console.log(JSON.stringify(fixResult, null, 2));
  
  // Test handleAnalyzeCode with a directory path
  console.log('\nTesting handleAnalyzeCode with directory path:');
  const analyzeResult = await codeFixer.handleAnalyzeCode({ 
    path: './src' 
  });
  console.log(JSON.stringify(analyzeResult, null, 2));
  
  // Test handleFixProject with a non-existent directory
  console.log('\nTesting handleFixProject with non-existent directory:');
  const projectResult = await codeFixer.handleFixProject({ 
    directory: './non-existent-directory' 
  });
  console.log(JSON.stringify(projectResult, null, 2));
}

testDirectoryValidation().catch(error => {
  console.error('Test failed:', error);
});