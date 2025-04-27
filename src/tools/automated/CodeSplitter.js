import { BaseAutomatedTool } from './BaseAutomatedTool.js';

/**
 * CodeSplitter - Keeps files under 500 lines
 * - Ensures code is broken into manageable components
 * - Implements code structure validation and organization
 */
export class CodeSplitter extends BaseAutomatedTool {
  constructor() {
    super(
      'CodeSplitter',
      'Keeps files under 500 lines by splitting them into manageable components'
    );
    
    this.maxLines = 500; // Default maximum lines per file
    this.checkThreshold = 450; // Start suggesting splits at this threshold
    this.fileTypes = [
      '.js', '.jsx', '.ts', '.tsx',  // JavaScript/TypeScript
      '.py', '.rb', '.php', '.java', // Other languages
      '.c', '.cpp', '.cs', '.go',    // More languages
    ];
  }

  /**
   * Set the maximum lines per file
   * @param {number} maxLines - Maximum number of lines
   * @returns {CodeSplitter} this instance for chaining
   */
  setMaxLines(maxLines) {
    if (maxLines < 100) {
      throw new Error('Max lines cannot be less than 100');
    }
    this.maxLines = maxLines;
    this.checkThreshold = Math.floor(maxLines * 0.9); // 90% of max lines
    return this;
  }

  /**
   * Process files to check if they need splitting
   * @param {Object} context - The context object
   * @returns {Promise<void>}
   */
  async process(context) {
    if (!this.isActive) return;
    
    try {
      // Get current file being edited (if any)
      const currentFile = context.currentFile;
      if (!currentFile) return;
      
      // Check if this is a file type we should monitor
      if (!this._shouldMonitorFile(currentFile)) return;
      
      // Use existing functions to check file content
      const { read_file } = await import('../functions/read_file.js');
      const fileContent = await read_file({ path: currentFile });
      
      // Count lines
      const lineCount = this._countLines(fileContent);
      
      // If file is approaching max size, suggest splitting
      if (lineCount >= this.checkThreshold) {
        // Analyze the file to find logical split points
        const splitSuggestions = this._analyzeSplitPoints(fileContent, currentFile);
        
        // Add suggestions to context for the next response
        if (!context.suggestions) context.suggestions = {};
        context.suggestions.codeSplitting = {
          file: currentFile,
          lineCount,
          maxLines: this.maxLines,
          suggestedSplits: splitSuggestions
        };
        
        // If file exceeds max lines, create a snapshot before suggesting changes
        if (lineCount > this.maxLines) {
          // Use the existing create_snapshot function
          const { create_snapshot } = await import('../functions/create_snapshot.js');
          await create_snapshot({
            name: `Before splitting ${currentFile}`,
            description: `Automatic snapshot before splitting file exceeding ${this.maxLines} lines`,
            tags: ['auto-split', 'code-organization']
          });
        }
      }
    } catch (error) {
      console.error('Error in CodeSplitter processing:', error);
    }
  }

  /**
   * Check if the file type should be monitored
   * @param {string} filePath - Path to the file
   * @returns {boolean} - True if the file should be monitored
   * @private
   */
  _shouldMonitorFile(filePath) {
    const extension = filePath.substring(filePath.lastIndexOf('.')).toLowerCase();
    return this.fileTypes.includes(extension);
  }

  /**
   * Count the number of lines in content
   * @param {string} content - File content
   * @returns {number} - Line count
   * @private
   */
  _countLines(content) {
    return content.split('\n').length;
  }

  /**
   * Analyze file content to find logical split points
   * @param {string} content - File content
   * @param {string} filePath - Path to the file
   * @returns {Array} - Array of split suggestions
   * @private
   */
  _analyzeSplitPoints(content, filePath) {
    const suggestions = [];
    const lines = content.split('\n');
    const extension = filePath.substring(filePath.lastIndexOf('.')).toLowerCase();
    
    // Different analysis based on file type
    switch (extension) {
      case '.js':
      case '.jsx':
      case '.ts':
      case '.tsx':
        // For JS/TS files, look for class and function declarations
        suggestions.push(...this._analyzeJsFile(lines, filePath));
        break;
      
      case '.py':
        // For Python files, look for class and function definitions
        suggestions.push(...this._analyzePythonFile(lines, filePath));
        break;
      
      // Add more language-specific analyzers as needed
      
      default:
        // Generic analyzer for other file types
        suggestions.push(...this._analyzeGenericFile(lines, filePath));
        break;
    }
    
    return suggestions;
  }

  /**
   * Analyze JavaScript/TypeScript file for split points
   * @param {Array} lines - Array of file lines
   * @param {string} filePath - Path to the file
   * @returns {Array} - Split suggestions
   * @private
   */
  _analyzeJsFile(lines, filePath) {
    const suggestions = [];
    
    // Get base file name without extension
    const baseName = filePath.substring(
      filePath.lastIndexOf('/') + 1, 
      filePath.lastIndexOf('.')
    );
    
    // Track classes, components, and large functions
    const classes = [];
    const components = [];
    const largeFunctions = [];
    
    let currentClass = null;
    let currentFunction = null;
    let blockDepth = 0;
    let functionLineCount = 0;
    
    // Loop through each line
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Track block depth with braces
      if (line.includes('{')) blockDepth += line.split('{').length - 1;
      if (line.includes('}')) blockDepth -= line.split('}').length - 1;
      
      // Detect class declarations
      if (line.match(/^(export)?\s*(abstract)?\s*class\s+\w+/) && blockDepth === 0) {
        const className = line.match(/class\s+(\w+)/)[1];
        currentClass = {
          name: className,
          startLine: i,
          methods: []
        };
        classes.push(currentClass);
      }
      
      // Detect React components (function components)
      if (line.match(/^(export)?\s*(const|function)\s+\w+\s*=?\s*(:|=>|\()/) && 
          (line.includes('props') || line.includes('React.FC') || line.includes('React.Component'))) {
        const compName = line.match(/(?:const|function)\s+(\w+)/)[1];
        components.push({
          name: compName,
          startLine: i
        });
      }
      
      // Detect function declarations and track their size
      if (line.match(/^(export)?\s*(async)?\s*(function)?\s*\w+\s*\(/) || 
          line.match(/^(export)?\s*(const|let|var)\s+\w+\s*=\s*(async)?\s*\(/)) {
        
        const funcName = line.match(/(?:function)?\s*(\w+)\s*\(/) || 
                         line.match(/(?:const|let|var)\s+(\w+)\s*=/);
        
        if (funcName) {
          currentFunction = funcName[1];
          functionLineCount = 0;
        }
      }
      
      // Count lines in current function
      if (currentFunction) {
        functionLineCount++;
        
        // If function is large, add to largeFunctions
        if (functionLineCount > 100) { // Threshold for "large" functions
          largeFunctions.push({
            name: currentFunction,
            lines: functionLineCount
          });
          currentFunction = null;
        }
      }
      
      // End of function
      if (currentFunction && blockDepth === 0) {
        currentFunction = null;
      }
    }
    
    // Create suggestions based on analysis
    
    // 1. If there are multiple classes, suggest splitting into separate files
    if (classes.length > 1) {
      suggestions.push({
        type: 'multiple-classes',
        description: `Split ${classes.length} classes into separate files`,
        suggestion: `Create separate files for each class: ${classes.map(c => c.name).join(', ')}`,
        newFiles: classes.map(c => `${c.name}.js`)
      });
    }
    
    // 2. If there are multiple React components, suggest splitting
    if (components.length > 1) {
      suggestions.push({
        type: 'multiple-components',
        description: `Split ${components.length} React components into separate files`,
        suggestion: `Create separate component files in a components/ directory`,
        newFiles: components.map(c => `${c.name}.jsx`)
      });
    }
    
    // 3. If there are large functions, suggest extracting them
    if (largeFunctions.length > 0) {
      suggestions.push({
        type: 'large-functions',
        description: `Extract ${largeFunctions.length} large functions to utils or helpers`,
        suggestion: `Move functions (${largeFunctions.map(f => f.name).join(', ')}) to a separate utilities file`,
        newFiles: [`${baseName}Utils.js`]
      });
    }
    
    // 4. If file is too large but no specific splits found, suggest logical modules
    if (suggestions.length === 0) {
      suggestions.push({
        type: 'general-split',
        description: `Split ${baseName}.js into logical modules`,
        suggestion: `Consider reorganizing into separate modules based on functionality`,
        newFiles: [`${baseName}Core.js`, `${baseName}Utils.js`, `${baseName}Types.js`]
      });
    }
    
    return suggestions;
  }

  /**
   * Analyze Python file for split points
   * @param {Array} lines - Array of file lines
   * @param {string} filePath - Path to the file
   * @returns {Array} - Split suggestions
   * @private
   */
  _analyzePythonFile(lines, filePath) {
    const suggestions = [];
    
    // Basic Python analysis - look for classes and functions
    const classes = [];
    const functions = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Detect class definitions
      if (line.startsWith('class ')) {
        const className = line.match(/class\s+(\w+)/)[1];
        classes.push({
          name: className,
          startLine: i
        });
      }
      
      // Detect function definitions
      if (line.startsWith('def ')) {
        const funcName = line.match(/def\s+(\w+)/)[1];
        functions.push({
          name: funcName,
          startLine: i
        });
      }
    }
    
    // Create suggestions
    const baseName = filePath.substring(
      filePath.lastIndexOf('/') + 1, 
      filePath.lastIndexOf('.')
    );
    
    if (classes.length > 1) {
      suggestions.push({
        type: 'multiple-classes',
        description: `Split ${classes.length} classes into separate files`,
        suggestion: `Create separate files for each class: ${classes.map(c => c.name).join(', ')}`,
        newFiles: classes.map(c => `${c.name.toLowerCase()}.py`)
      });
    }
    
    if (functions.length > 5) {
      suggestions.push({
        type: 'many-functions',
        description: `Group ${functions.length} functions into logical modules`,
        suggestion: `Create a utils.py file for helper functions`,
        newFiles: [`${baseName}_utils.py`]
      });
    }
    
    return suggestions;
  }

  /**
   * Generic analysis for any file type
   * @param {Array} lines - Array of file lines
   * @param {string} filePath - Path to the file
   * @returns {Array} - Split suggestions
   * @private
   */
  _analyzeGenericFile(lines, filePath) {
    // Basic suggestion based on file size
    const baseName = filePath.substring(
      filePath.lastIndexOf('/') + 1, 
      filePath.lastIndexOf('.')
    );
    
    const extension = filePath.substring(filePath.lastIndexOf('.'));
    
    return [{
      type: 'size-based-split',
      description: `Split large file into smaller modules`,
      suggestion: `Divide ${baseName}${extension} into smaller logical parts`,
      newFiles: [
        `${baseName}_part1${extension}`, 
        `${baseName}_part2${extension}`
      ]
    }];
  }
}
