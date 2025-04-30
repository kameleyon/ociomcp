import { read_file } from './read_file.js';
import { write_file } from './write_file.js';

/**
 * Apply surgical text replacements to files
 * Best for small changes (<20% of file size)
 * 
 * Format: filepath <<<<<<< SEARCH content to find ======= new content >>>>>>> REPLACE
 * 
 * @param {Object} options - Options for the edit operation
 * @param {string} options.path - Path to the file to edit
 * @param {string} options.diff - Diff content in the specified format
 * @returns {Promise<Object>} - Result of the operation
 */
export async function edit_block({ path, diff }) {
  if (!path || !diff) {
    throw new Error('Path and diff are required parameters');
  }

  try {
    // Read the original file content
    const originalContent = await read_file({ path });
    
    // Parse the diff to get search and replace content
    const parsedDiff = _parseDiff(diff);
    
    if (!parsedDiff) {
      throw new Error('Invalid diff format');
    }
    
    // Apply the changes
    const newContent = _applyChanges(originalContent, parsedDiff);
    
    // Verify the search content was found
    if (newContent === originalContent) {
      return {
        success: false,
        message: 'Search content not found in the file',
        verificationResult: 'notFound'
      };
    }
    
    // Write the modified content back to the file
    await write_file({ path, content: newContent });
    
    // Verify the changes were applied correctly
    const verificationResult = await _verifyChanges(path, parsedDiff, newContent);
    
    return {
      success: true,
      message: 'Changes applied successfully',
      verificationResult
    };
  } catch (error) {
    console.error('Error in edit_block:', error);
    
    return {
      success: false,
      message: `Error applying changes: ${error.message}`,
      error: error.toString()
    };
  }
}

/**
 * Parse the diff to extract search and replace content
 * @param {string} diff - Diff content
 * @returns {Object|null} - Parsed diff or null if invalid
 * @private
 */
function _parseDiff(diff) {
  // Match the diff pattern
  const diffPattern = /<<<<<<< SEARCH([\s\S]*?)=======([\s\S]*?)>>>>>>> REPLACE/;
  const match = diff.match(diffPattern);
  
  if (!match) {
    return null;
  }
  
  return {
    search: match[1],
    replace: match[2]
  };
}

/**
 * Apply changes to the content
 * @param {string} content - Original content
 * @param {Object} diff - Parsed diff
 * @returns {string} - Modified content
 * @private
 */
function _applyChanges(content, diff) {
  // Simple string replacement
  // For more complex cases, a better diffing algorithm would be needed
  return content.replace(diff.search, diff.replace);
}

/**
 * Verify that changes were applied correctly
 * @param {string} path - Path to the file
 * @param {Object} diff - Parsed diff
 * @param {string} expectedContent - Expected content after changes
 * @returns {Promise<string>} - Verification result
 * @private
 */
async function _verifyChanges(path, diff, expectedContent) {
  try {
    // Read the file again to verify changes
    const currentContent = await read_file({ path });
    
    // Check if the content matches the expected content
    if (currentContent === expectedContent) {
      return 'success';
    }
    
    // Check if the search content is still present
    if (currentContent.includes(diff.search)) {
      return 'searchStillPresent';
    }
    
    return 'contentMismatch';
  } catch (error) {
    console.error('Error verifying changes:', error);
    return 'verificationError';
  }
}
