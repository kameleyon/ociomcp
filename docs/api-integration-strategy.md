# OptimusCode MCP API Integration Strategy

This document outlines the strategy for integrating external APIs with the OptimusCode MCP server, focusing on the tools that require API access to function properly.

## OpenRouter API Integration

### Overview

OpenRouter provides a unified API for accessing various AI models, including Claude-3.7-Sonnet. We'll use OpenRouter as our primary API gateway for all AI-dependent tools.

### API Key

```
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
```

### Base URL

```
https://openrouter.ai/api/v1
```

### Primary Model

```
anthropic/claude-3.7-sonnet
```

### Fallback Models

1. `anthropic/claude-3-opus`
2. `openai/gpt-4o`
3. `google/gemini-pro`

## API Client Implementation

### Core API Client

Create a reusable API client that handles:

- Authentication
- Rate limiting
- Error handling
- Retries
- Logging

```typescript
// src/api-integration/openrouter-client.ts

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export class OpenRouterClient {
  private client: AxiosInstance;
  private rateLimiter: RateLimiter;
  
  constructor(apiKey: string) {
    this.client = axios.create({
      baseURL: 'https://openrouter.ai/api/v1',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    this.rateLimiter = new RateLimiter({
      maxRequests: 10,
      perTimeWindow: 60 * 1000 // 1 minute
    });
    
    this.setupInterceptors();
  }
  
  private setupInterceptors() {
    // Add request interceptors for logging, rate limiting
    // Add response interceptors for error handling
  }
  
  async chat(params: ChatParams): Promise<ChatResponse> {
    await this.rateLimiter.waitForCapacity();
    
    try {
      const response = await this.client.post('/chat/completions', params);
      return response.data;
    } catch (error) {
      // Handle errors, implement retries
      throw this.handleError(error);
    }
  }
  
  // Additional methods for other API endpoints
}
```

### Rate Limiter

Implement a rate limiter to prevent API rate limit errors:

```typescript
// src/api-integration/rate-limiter.ts

interface RateLimiterOptions {
  maxRequests: number;
  perTimeWindow: number;
}

export class RateLimiter {
  private options: RateLimiterOptions;
  private requestTimestamps: number[] = [];
  
  constructor(options: RateLimiterOptions) {
    this.options = options;
  }
  
  async waitForCapacity(): Promise<void> {
    const now = Date.now();
    
    // Remove timestamps outside the current time window
    this.requestTimestamps = this.requestTimestamps.filter(
      timestamp => now - timestamp < this.options.perTimeWindow
    );
    
    if (this.requestTimestamps.length >= this.options.maxRequests) {
      // Wait until the oldest request exits the time window
      const oldestTimestamp = this.requestTimestamps[0];
      const waitTime = oldestTimestamp + this.options.perTimeWindow - now;
      
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return this.waitForCapacity(); // Recursively check again
    }
    
    // Add current request timestamp
    this.requestTimestamps.push(now);
  }
}
```

## API-Dependent Tools Implementation

### AutoContinue

The AutoContinue tool needs to track token usage accurately to manage context window limitations and trigger new chat sessions automatically.

```typescript
// src/context-management/token-counter.ts

import { OpenRouterClient } from '../api-integration/openrouter-client';

export class TokenCounter {
  private apiClient: OpenRouterClient;
  
  constructor(apiClient: OpenRouterClient) {
    this.apiClient = apiClient;
  }
  
  async countTokens(text: string): Promise<number> {
    try {
      const response = await this.apiClient.tokenCount({
        model: 'anthropic/claude-3.7-sonnet',
        text
      });
      
      return response.tokenCount;
    } catch (error) {
      // Fallback to local estimation if API fails
      return this.estimateTokenCount(text);
    }
  }
  
  private estimateTokenCount(text: string): number {
    // Simple estimation: ~4 characters per token
    return Math.ceil(text.length / 4);
  }
}
```

### ModelSwitcher

The ModelSwitcher tool needs to track model performance and switch models when necessary.

```typescript
// src/api-integration/model-switcher.ts

import { OpenRouterClient } from './openrouter-client';

interface ModelConfig {
  id: string;
  name: string;
  provider: string;
  contextWindow: number;
  costPer1kTokens: number;
  successRate: number;
  attemptCount: number;
}

export class ModelSwitcher {
  private apiClient: OpenRouterClient;
  private models: ModelConfig[];
  private currentModelIndex: number = 0;
  
  constructor(apiClient: OpenRouterClient) {
    this.apiClient = apiClient;
    this.models = [
      {
        id: 'anthropic/claude-3.7-sonnet',
        name: 'Claude 3.7 Sonnet',
        provider: 'Anthropic',
        contextWindow: 200000,
        costPer1kTokens: 0.03,
        successRate: 1.0,
        attemptCount: 0
      },
      {
        id: 'anthropic/claude-3-opus',
        name: 'Claude 3 Opus',
        provider: 'Anthropic',
        contextWindow: 200000,
        costPer1kTokens: 0.15,
        successRate: 1.0,
        attemptCount: 0
      },
      {
        id: 'openai/gpt-4o',
        name: 'GPT-4o',
        provider: 'OpenAI',
        contextWindow: 128000,
        costPer1kTokens: 0.05,
        successRate: 1.0,
        attemptCount: 0
      }
    ];
  }
  
  getCurrentModel(): ModelConfig {
    return this.models[this.currentModelIndex];
  }
  
  recordSuccess(): void {
    const model = this.models[this.currentModelIndex];
    model.attemptCount++;
    model.successRate = ((model.attemptCount - 1) * model.successRate + 1) / model.attemptCount;
  }
  
  recordFailure(): void {
    const model = this.models[this.currentModelIndex];
    model.attemptCount++;
    model.successRate = ((model.attemptCount - 1) * model.successRate) / model.attemptCount;
    
    // Switch model if success rate drops below threshold
    if (model.successRate < 0.7 && model.attemptCount > 5) {
      this.switchToNextModel();
    }
  }
  
  private switchToNextModel(): void {
    this.currentModelIndex = (this.currentModelIndex + 1) % this.models.length;
  }
  
  async executeWithFallback(task: (modelId: string) => Promise<any>): Promise<any> {
    const maxAttempts = this.models.length * 2;
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      const currentModel = this.getCurrentModel();
      
      try {
        const result = await task(currentModel.id);
        this.recordSuccess();
        return result;
      } catch (error) {
        this.recordFailure();
        attempts++;
      }
    }
    
    throw new Error(`Failed to execute task after ${maxAttempts} attempts with different models`);
  }
}
```

### CodeAnalyzer

The CodeAnalyzer tool uses AI to analyze code and suggest improvements.

```typescript
// src/code-analysis/code-analyzer.ts

import { OpenRouterClient } from '../api-integration/openrouter-client';
import { ModelSwitcher } from '../api-integration/model-switcher';

export class CodeAnalyzer {
  private apiClient: OpenRouterClient;
  private modelSwitcher: ModelSwitcher;
  
  constructor(apiClient: OpenRouterClient, modelSwitcher: ModelSwitcher) {
    this.apiClient = apiClient;
    this.modelSwitcher = modelSwitcher;
  }
  
  async analyzeCode(code: string, language: string): Promise<string> {
    const prompt = `
      Analyze the following ${language} code and suggest improvements:
      
      \`\`\`${language}
      ${code}
      \`\`\`
      
      Focus on:
      1. Code quality and best practices
      2. Potential bugs or issues
      3. Performance optimizations
      4. Architectural improvements
      
      Provide specific, actionable suggestions with code examples.
    `;
    
    return this.modelSwitcher.executeWithFallback(async (modelId) => {
      const response = await this.apiClient.chat({
        model: modelId,
        messages: [
          { role: 'system', content: 'You are an expert code reviewer and software architect.' },
          { role: 'user', content: prompt }
        ]
      });
      
      return response.choices[0].message.content;
    });
  }
  
  async suggestRefactoring(code: string, language: string): Promise<string> {
    const prompt = `
      Suggest refactoring for the following ${language} code to improve its structure and maintainability:
      
      \`\`\`${language}
      ${code}
      \`\`\`
      
      Provide a complete refactored version of the code with explanations for the changes.
    `;
    
    return this.modelSwitcher.executeWithFallback(async (modelId) => {
      const response = await this.apiClient.chat({
        model: modelId,
        messages: [
          { role: 'system', content: 'You are an expert software engineer specializing in code refactoring.' },
          { role: 'user', content: prompt }
        ]
      });
      
      return response.choices[0].message.content;
    });
  }
}
```

### AIConnector

The AIConnector tool provides a unified interface for accessing various AI models.

```typescript
// src/ai-integration/ai-connector.ts

import { OpenRouterClient } from '../api-integration/openrouter-client';

export enum AITaskType {
  TEXT_GENERATION = 'text_generation',
  CODE_GENERATION = 'code_generation',
  CODE_ANALYSIS = 'code_analysis',
  IMAGE_GENERATION = 'image_generation',
  TRANSLATION = 'translation'
}

interface AITaskOptions {
  type: AITaskType;
  prompt: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  additionalParams?: Record<string, any>;
}

export class AIConnector {
  private apiClient: OpenRouterClient;
  
  constructor(apiClient: OpenRouterClient) {
    this.apiClient = apiClient;
  }
  
  async executeTask(options: AITaskOptions): Promise<any> {
    const { type, prompt, model, maxTokens, temperature, additionalParams } = options;
    
    // Default model based on task type
    const defaultModel = this.getDefaultModelForTask(type);
    const selectedModel = model || defaultModel;
    
    switch (type) {
      case AITaskType.TEXT_GENERATION:
      case AITaskType.CODE_GENERATION:
      case AITaskType.CODE_ANALYSIS:
        return this.generateText(prompt, selectedModel, maxTokens, temperature, additionalParams);
        
      case AITaskType.IMAGE_GENERATION:
        return this.generateImage(prompt, selectedModel, additionalParams);
        
      case AITaskType.TRANSLATION:
        return this.translateText(prompt, selectedModel, additionalParams);
        
      default:
        throw new Error(`Unsupported task type: ${type}`);
    }
  }
  
  private getDefaultModelForTask(taskType: AITaskType): string {
    switch (taskType) {
      case AITaskType.TEXT_GENERATION:
        return 'anthropic/claude-3.7-sonnet';
      case AITaskType.CODE_GENERATION:
      case AITaskType.CODE_ANALYSIS:
        return 'anthropic/claude-3.7-sonnet';
      case AITaskType.IMAGE_GENERATION:
        return 'stability/sdxl';
      case AITaskType.TRANSLATION:
        return 'anthropic/claude-3.7-sonnet';
      default:
        return 'anthropic/claude-3.7-sonnet';
    }
  }
  
  private async generateText(
    prompt: string,
    model: string,
    maxTokens?: number,
    temperature?: number,
    additionalParams?: Record<string, any>
  ): Promise<string> {
    const response = await this.apiClient.chat({
      model,
      messages: [
        { role: 'user', content: prompt }
      ],
      max_tokens: maxTokens,
      temperature,
      ...additionalParams
    });
    
    return response.choices[0].message.content;
  }
  
  private async generateImage(
    prompt: string,
    model: string,
    additionalParams?: Record<string, any>
  ): Promise<string> {
    // Implementation depends on the image generation API
    throw new Error('Image generation not yet implemented');
  }
  
  private async translateText(
    text: string,
    model: string,
    additionalParams?: Record<string, any>
  ): Promise<string> {
    const targetLanguage = additionalParams?.targetLanguage || 'en';
    
    const response = await this.apiClient.chat({
      model,
      messages: [
        { 
          role: 'system', 
          content: `You are a professional translator. Translate the following text to ${targetLanguage}.` 
        },
        { role: 'user', content: text }
      ]
    });
    
    return response.choices[0].message.content;
  }
}
```

## Error Handling and Resilience

### Error Types

Define specific error types for API-related issues:

```typescript
// src/api-integration/errors.ts

export class APIError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
  }
}

export class RateLimitError extends APIError {
  retryAfter?: number;
  
  constructor(message: string, retryAfter?: number) {
    super(message, 429);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}

export class AuthenticationError extends APIError {
  constructor(message: string) {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

export class ModelNotAvailableError extends APIError {
  model: string;
  
  constructor(message: string, model: string) {
    super(message, 404);
    this.name = 'ModelNotAvailableError';
    this.model = model;
  }
}
```

### Retry Strategy

Implement an exponential backoff retry strategy:

```typescript
// src/api-integration/retry-strategy.ts

interface RetryOptions {
  maxRetries: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffFactor: number;
}

export class RetryStrategy {
  private options: RetryOptions;
  
  constructor(options?: Partial<RetryOptions>) {
    this.options = {
      maxRetries: 3,
      initialDelayMs: 1000,
      maxDelayMs: 30000,
      backoffFactor: 2,
      ...options
    };
  }
  
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 0; attempt < this.options.maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on authentication errors
        if (error instanceof AuthenticationError) {
          throw error;
        }
        
        // Calculate delay with exponential backoff
        const delay = Math.min(
          this.options.initialDelayMs * Math.pow(this.options.backoffFactor, attempt),
          this.options.maxDelayMs
        );
        
        // Add jitter to prevent thundering herd
        const jitteredDelay = delay * (0.8 + Math.random() * 0.4);
        
        // If rate limited with retry-after header, use that instead
        if (error instanceof RateLimitError && error.retryAfter) {
          await new Promise(resolve => setTimeout(resolve, error.retryAfter * 1000));
        } else {
          await new Promise(resolve => setTimeout(resolve, jitteredDelay));
        }
      }
    }
    
    throw lastError;
  }
}
```

## Cost Management

Implement cost tracking to monitor API usage:

```typescript
// src/api-integration/cost-tracker.ts

interface CostRecord {
  timestamp: number;
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  cost: number;
}

export class CostTracker {
  private records: CostRecord[] = [];
  private modelCosts: Record<string, { prompt: number; completion: number }> = {
    'anthropic/claude-3.7-sonnet': { prompt: 0.003, completion: 0.015 },
    'anthropic/claude-3-opus': { prompt: 0.015, completion: 0.075 },
    'openai/gpt-4o': { prompt: 0.01, completion: 0.03 }
  };
  
  recordUsage(
    model: string,
    promptTokens: number,
    completionTokens: number
  ): void {
    const modelCost = this.modelCosts[model] || { prompt: 0.01, completion: 0.03 };
    const cost = 
      (promptTokens / 1000) * modelCost.prompt + 
      (completionTokens / 1000) * modelCost.completion;
    
    this.records.push({
      timestamp: Date.now(),
      model,
      promptTokens,
      completionTokens,
      totalTokens: promptTokens + completionTokens,
      cost
    });
  }
  
  getTotalCost(): number {
    return this.records.reduce((total, record) => total + record.cost, 0);
  }
  
  getCostByModel(): Record<string, number> {
    return this.records.reduce((result, record) => {
      result[record.model] = (result[record.model] || 0) + record.cost;
      return result;
    }, {} as Record<string, number>);
  }
  
  getCostByTimeRange(startTime: number, endTime: number): number {
    return this.records
      .filter(record => record.timestamp >= startTime && record.timestamp <= endTime)
      .reduce((total, record) => total + record.cost, 0);
  }
  
  getUsageSummary(): any {
    const totalTokens = this.records.reduce((sum, record) => sum + record.totalTokens, 0);
    const totalCost = this.getTotalCost();
    const costByModel = this.getCostByModel();
    
    return {
      totalTokens,
      totalCost,
      costByModel,
      recordCount: this.records.length
    };
  }
}
```

## Conclusion

This API integration strategy provides a robust framework for implementing the API-dependent tools in the OptimusCode MCP server. By following these guidelines, we can ensure reliable, cost-effective, and efficient integration with external AI services through the OpenRouter API.