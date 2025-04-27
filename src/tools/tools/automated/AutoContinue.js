import { BaseAutomatedTool } from './BaseAutomatedTool.js';
import { track_context_size } from '../functions/track_context_size.js';
import { trigger_continuation } from '../functions/trigger_continuation.js';

/**
 * AutoContinue
 * Monitors context limits and triggers new chat sessions automatically
 * Provides summaries and next steps when continuing
 */
export class AutoContinue extends BaseAutomatedTool {
  constructor() {
    super(
      'AutoContinue',
      'Monitors context limits and triggers new chat sessions automatically'
    );
    
    this.contextThreshold = 0.85; // Threshold at which to trigger continuation (85% of max)
    this.lastCheckTime = Date.now();
    this.checkInterval = 5000; // Check context size every 5 seconds
  }

  /**
   * Set the context threshold (0.0 - 1.0)
   * @param {number} threshold - Value between 0 and 1 representing percentage of max context
   * @returns {AutoContinue} - This instance for chaining
   */
  setContextThreshold(threshold) {
    if (threshold < 0 || threshold > 1) {
      throw new Error('Context threshold must be between 0 and 1');
    }
    this.contextThreshold = threshold;
    return this;
  }

  /**
   * Process context monitoring
   * @param {Object} context - The context object
   * @returns {Promise<void>}
   */
  async process(context) {
    if (!this.isActive) return;
    
    const now = Date.now();
    if (now - this.lastCheckTime < this.checkInterval) {
      return; // Don't check too frequently
    }
    
    this.lastCheckTime = now;
    
    try {
      // Check context size
      const result = await track_context_size({ 
        message: context.currentMessage || '' 
      });
      
      if (result && result.sizeRatio > this.contextThreshold) {
        // Context is getting full, trigger continuation
        const summary = this._generateSummary(context);
        
        await trigger_continuation({
          summary: summary,
          state: context.state || {}
        });
      }
    } catch (error) {
      console.error('Error in AutoContinue:', error);
    }
  }

  /**
   * Generate a summary of the current context
   * @param {Object} context - The context object 
   * @returns {string} - Summary text
   * @private
   */
  _generateSummary(context) {
    // Extract key points from conversation
    const conversation = context.conversation || [];
    const lastMessages = conversation.slice(-5); // Last 5 messages
    
    let summary = 'Project Progress Summary:\n\n';
    
    // Add information about the current project
    if (context.project) {
      summary += `Project: ${context.project.name}\n`;
      summary += `Current goal: ${context.project.currentGoal || 'Not specified'}\n\n`;
    }
    
    // Add brief description of recent conversation
    summary += 'Recent discussion focused on: ';
    
    // Analyze last messages to determine focus
    const topics = this._extractTopics(lastMessages);
    summary += topics.join(', ') + '.\n\n';
    
    // Add next steps if available
    if (context.nextSteps && context.nextSteps.length > 0) {
      summary += 'Next steps:\n';
      context.nextSteps.forEach((step, index) => {
        summary += `${index + 1}. ${step}\n`;
      });
    } else {
      summary += 'Continuing project implementation.\n';
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
    // This is a simple implementation
    // A more advanced implementation could use NLP techniques
    const topics = new Set();
    
    const codeRelated = messages.some(m => 
      m.content && (
        m.content.includes('```') || 
        m.content.includes('function') ||
        m.content.includes('class') ||
        m.content.includes('const ')
      )
    );
    
    if (codeRelated) topics.add('code implementation');
    
    // Look for specific keywords
    for (const message of messages) {
      if (!message.content) continue;
      
      if (message.content.includes('plan') || message.content.includes('roadmap'))
        topics.add('project planning');
      
      if (message.content.includes('test') || message.content.includes('debug'))
        topics.add('testing and debugging');
      
      if (message.content.includes('design') || message.content.includes('UI') || message.content.includes('UX'))
        topics.add('design and user experience');
      
      if (message.content.includes('database') || message.content.includes('data model'))
        topics.add('data architecture');
    }
    
    return topics.size > 0 ? Array.from(topics) : ['general project discussion'];
  }
}
