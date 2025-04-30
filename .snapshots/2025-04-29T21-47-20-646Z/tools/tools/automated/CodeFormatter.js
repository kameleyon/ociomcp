import { BaseAutomatedTool } from './BaseAutomatedTool.js';

/**
 * CodeFormatter
 * Formats code according to project style guidelines
 * Supports multiple languages and formatting standards
 */
export class CodeFormatter extends BaseAutomatedTool {
  constructor() {
    super(
      'CodeFormatter',
      'Formats code according to project style guidelines'
    );
    
    this.formatters = {
      javascript: this._formatJavaScript.bind(this),
      typescript: this._formatTypeScript.bind(this),
      html: this._formatHTML.bind(this),
      css: this._formatCSS.bind(this),
      python: this._formatPython.bind(this),
      java: this._formatJava.bind(this),
      csharp: this._formatCSharp.bind(this),
      go: this._formatGo.bind(this),
      rust: this._formatRust.bind(this),
      php: this._formatPHP.bind(this),
      ruby: this._formatRuby.bind(this)
    };
    
    this.defaultOptions = {
      tabSize: 2,
      insertSpaces: true,
      singleQuote: true,
      trailingComma: 'es5',
      bracketSpacing: true,
      semicolons: true,
      endOfLine: 'lf'
    };
    
    this.projectOptions = { ...this.defaultOptions };
  }

  /**
   * Set formatting options for the project
   * @param {Object} options - Formatting options
   * @returns {CodeFormatter} - This instance for chaining
   */
  setOptions(options) {
    this.projectOptions = { ...this.defaultOptions, ...options };
    return this;
  }
  
  /**
   * Format code according to language and options
   * @param {string} code - Code to format
   * @param {string} language - Language of the code
   * @param {Object} options - Formatting options (optional)
   * @returns {string} - Formatted code
   */
  formatCode(code, language, options = {}) {
    // Normalize language to lowercase
    const normalizedLanguage = language.toLowerCase();
    
    // Merge project options with custom options
    const mergedOptions = { ...this.projectOptions, ...options };
    
    // Get the appropriate formatter
    const formatter = this.formatters[normalizedLanguage];
    
    if (!formatter) {
      console.warn(`No formatter available for language: ${language}`);
      return code; // Return unformatted code
    }
    
    try {
      return formatter(code, mergedOptions);
    } catch (error) {
      console.error(`Error formatting ${language} code:`, error);
      return code; // Return original on error
    }
  }
  
  /**
   * Process formatting on content
   * @param {Object} context - The context object
   * @returns {void}
   */
  process(context) {
    if (!this.isActive) return;
    
    // Only format code in context if explicitly requested
    if (context.formatRequested) {
      try {
        // Get code blocks from the latest message
        if (context.currentMessage) {
          const codeBlocks = this._extractCodeBlocks(context.currentMessage);
          
          // Format each code block
          for (const { code, language } of codeBlocks) {
            const formattedCode = this.formatCode(code, language || 'javascript');
            
            // Replace original code with formatted code
            // Note: In a real implementation, you'd want to update the message
            // This is just a demonstration
            console.log(`Formatted ${language} code block`);
          }
        }
      } catch (error) {
        console.error('Error in CodeFormatter process:', error);
      }
    }
  }
  
  /**
   * Extract code blocks from markdown text
   * @param {string} text - Markdown text
   * @returns {Array} - Array of objects with code and language
   * @private
   */
  _extractCodeBlocks(text) {
    const codeBlockRegex = /```([\w-]*)\n([\s\S]*?)```/g;
    const codeBlocks = [];
    let match;
    
    while ((match = codeBlockRegex.exec(text)) !== null) {
      codeBlocks.push({
        language: match[1].trim().toLowerCase() || null,
        code: match[2]
      });
    }
    
    return codeBlocks;
  }
  
  // Language-specific formatters
  
  /**
   * Format JavaScript code
   * @param {string} code - Code to format
   * @param {Object} options - Formatting options
   * @returns {string} - Formatted code
   * @private
   */
  _formatJavaScript(code, options) {
    // Implement JavaScript formatting logic
    // In a real implementation, this would use a library like prettier
    // This is a simple placeholder implementation
    let formatted = code;
    
    // Add semicolons if enabled
    if (options.semicolons) {
      formatted = this._addSemicolons(formatted);
    }
    
    // Convert quotes if singleQuote is enabled
    if (options.singleQuote) {
      formatted = this._convertToSingleQuotes(formatted);
    }
    
    return formatted;
  }
  
  /**
   * Format TypeScript code
   * @param {string} code - Code to format
   * @param {Object} options - Formatting options
   * @returns {string} - Formatted code
   * @private
   */
  _formatTypeScript(code, options) {
    // TypeScript formatting is similar to JavaScript
    return this._formatJavaScript(code, options);
  }
  
  /**
   * Format HTML code
   * @param {string} code - Code to format
   * @param {Object} options - Formatting options
   * @returns {string} - Formatted code
   * @private
   */
  _formatHTML(code, options) {
    // Implement HTML formatting logic
    // Simple placeholder
    return code;
  }
  
  /**
   * Format CSS code
   * @param {string} code - Code to format
   * @param {Object} options - Formatting options
   * @returns {string} - Formatted code
   * @private
   */
  _formatCSS(code, options) {
    // Implement CSS formatting logic
    // Simple placeholder
    return code;
  }
  
  /**
   * Format Python code
   * @param {string} code - Code to format
   * @param {Object} options - Formatting options
   * @returns {string} - Formatted code
   * @private
   */
  _formatPython(code, options) {
    // Implement Python formatting logic
    // Simple placeholder
    return code;
  }
  
  /**
   * Format Java code
   * @param {string} code - Code to format
   * @param {Object} options - Formatting options
   * @returns {string} - Formatted code
   * @private
   */
  _formatJava(code, options) {
    // Implement Java formatting logic
    // Simple placeholder
    return code;
  }
  
  /**
   * Format C# code
   * @param {string} code - Code to format
   * @param {Object} options - Formatting options
   * @returns {string} - Formatted code
   * @private
   */
  _formatCSharp(code, options) {
    // Implement C# formatting logic
    // Simple placeholder
    return code;
  }
  
  /**
   * Format Go code
   * @param {string} code - Code to format
   * @param {Object} options - Formatting options
   * @returns {string} - Formatted code
   * @private
   */
  _formatGo(code, options) {
    // Implement Go formatting logic
    // Simple placeholder
    return code;
  }
  
  /**
   * Format Rust code
   * @param {string} code - Code to format
   * @param {Object} options - Formatting options
   * @returns {string} - Formatted code
   * @private
   */
  _formatRust(code, options) {
    // Implement Rust formatting logic
    // Simple placeholder
    return code;
  }
  
  /**
   * Format PHP code
   * @param {string} code - Code to format
   * @param {Object} options - Formatting options
   * @returns {string} - Formatted code
   * @private
   */
  _formatPHP(code, options) {
    // Implement PHP formatting logic
    // Simple placeholder
    return code;
  }
  
  /**
   * Format Ruby code
   * @param {string} code - Code to format
   * @param {Object} options - Formatting options
   * @returns {string} - Formatted code
   * @private
   */
  _formatRuby(code, options) {
    // Implement Ruby formatting logic
    // Simple placeholder
    return code;
  }
  
  /**
   * Add semicolons to statements
   * @param {string} code - JavaScript code
   * @returns {string} - Code with semicolons
   * @private
   */
  _addSemicolons(code) {
    // This is a very simple implementation
    // A real implementation would be more sophisticated
    const lines = code.split('\n');
    const result = [];
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (
        trimmed && 
        !trimmed.endsWith(';') && 
        !trimmed.endsWith('{') && 
        !trimmed.endsWith('}') && 
        !trimmed.endsWith(',') && 
        !trimmed.startsWith('//') &&
        !trimmed.startsWith('/*') &&
        !trimmed.endsWith('*/') &&
        !trimmed.endsWith(':')
      ) {
        result.push(line + ';');
      } else {
        result.push(line);
      }
    }
    
    return result.join('\n');
  }
  
  /**
   * Convert double quotes to single quotes in strings
   * @param {string} code - JavaScript code
   * @returns {string} - Code with single quotes
   * @private
   */
  _convertToSingleQuotes(code) {
    // This is a simplified implementation
    // A real implementation would need to handle escaping properly
    return code.replace(/"([^"]*)"/g, "'$1'");
  }
}
