import { BaseAutomatedTool } from './BaseAutomatedTool.js';

/**
 * AutoContinue - Monitors context limits and triggers new chat sessions automatically
 * - Provides summaries and next steps when continuing
 * - Implements context window monitoring with token counting
 */
export class AutoContinue extends BaseAutomatedTool {
  constructor() {
    super(
      'AutoContinue',
      'Monitors context limits and triggers new chat sessions automatically'
    );
    
    this.contextThreshold = 0.85; // Trigger at 85% of max context
    this.checkInterval = 5000; // Check every 5 seconds
    this.lastCheckTime = Date.now();
    this.isProcessing = false;
  }

  /**
   * Set the context threshold (0.0 - 1.0)
   * @param {number} threshold - Value between 0 and 1
   * @returns {AutoContinue} this instance for chaining
   */
  setContextThreshold(threshold) {
    if (threshold < 0 || threshold > 1) {
      throw new Error('Context threshold must be between 0 and 1');
    }
    this.contextThreshold = threshold;
    return this;
  }

  /**
   * Process the current context to check if continuation is needed
   * @param {Object} context - The context object
   * @returns {Promise<void>}
   */
  async process(context) {
    if (!this.isActive || this.isProcessing) return;
    
    const now = Date.now();
    if (now - this.lastCheckTime < this.checkInterval) {
      return; // Don't check too frequently
    }
    
    this.lastCheckTime = now;
    this.isProcessing = true;
    
    try {
      // Use the track_context_size function (which is already implemented)
      const { track_context_size } = await import('../functions/track_context_size.js');
      
      const message = context.currentMessage || '';
      const result = await track_context_size({ message });
      
      if (result && result.sizeRatio > this.contextThreshold) {
        // Context is getting full, trigger continuation
        const summary = this._generateSummary(context);
        const state = this._captureState(context);
        
        // Use the trigger_continuation function (which is already implemented)
        const { trigger_continuation } = await import('../functions/trigger_continuation.js');
        await trigger_continuation({ summary, state });
      }
    } catch (error) {
      console.error('Error in AutoContinue processing:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Generate a summary of the current context
   * @param {Object} context - The context object
   * @returns {string} - The summary text
   * @private
   */
  _generateSummary(context) {
    const project = context.project || {};
    const messages = (context.conversation || []).slice(-5); // Last 5 messages
    
    let summary = '## Project Continuation\n\n';
    
    // Project information
    if (project.name) {
      summary += `**Project:** ${project.name}\n`;
      summary += `**Current Task:** ${project.currentTask || 'Ongoing implementation'}\n\n`;
    }
    
    // Recent progress
    summary += '### Recent Progress\n\n';
    
    // Extract key topics from recent messages
    const topics = this._extractTopics(messages);
    if (topics.length > 0) {
      summary += `Recent discussion focused on: ${topics.join(', ')}.\n\n`;
    }
    
    // Next steps
    summary += '### Next Steps\n\n';
    
    if (context.nextSteps && context.nextSteps.length > 0) {
      context.nextSteps.forEach((step, index) => {
        summary += `${index + 1}. ${step}\n`;
      });
    } else {
      summary += '- Continue current implementation\n';
      summary += '- Review recent changes\n';
      summary += '- Proceed with testing\n';
    }
    
    return summary;
  }

  /**
   * Extract topics from recent messages
   * @param {Array} messages - Recent messages
   * @returns {Array} - List of topics
   * @private
   */
  _extractTopics(messages) {
    const topics = new Set();
    
    for (const message of messages) {
      const content = message.content || '';
      
      // Check for code-related content
      if (content.includes('```') || 
          content.includes('function') || 
          content.includes('class') ||
          content.includes('import ')) {
        topics.add('code implementation');
      }
      
      // Check for planning-related content
      if (content.includes('plan') || 
          content.includes('roadmap') || 
          content.includes('milestone')) {
        topics.add('project planning');
      }
      
      // Check for testing-related content
      if (content.includes('test') || 
          content.includes('debug') || 
          content.includes('error')) {
        topics.add('testing and debugging');
      }
      
      // Check for design-related content
      if (content.includes('design') || 
          content.includes('UI') || 
          content.includes('UX') ||
          content.includes('layout')) {
        topics.add('design and user experience');
      }
    }
    
    return topics.size > 0 ? Array.from(topics) : ['general project discussion'];
  }

  /**
   * Capture the current state for continuation
   * @param {Object} context - The context object
   * @returns {Object} - The state object
   * @private
   */
  _captureState(context) {
    // Create a clean state object for continuation
    return {
      project: context.project || {},
      files: context.files || [],
      lastCommands: (context.commands || []).slice(-5), // Last 5 commands
      currentTask: context.currentTask,
      nextSteps: context.nextSteps || []
    };
  }
}
