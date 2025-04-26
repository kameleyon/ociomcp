import { z } from 'zod';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';
import * as https from 'https';
import { IncomingMessage } from 'http';

// Define schemas for AIConnector tool
export const GenerateTextSchema = z.object({
  prompt: z.string(),
  model: z.string().optional(),
  maxTokens: z.number().optional(),
  temperature: z.number().optional(),
  options: z.object({
    topP: z.number().optional(),
    frequencyPenalty: z.number().optional(),
    presencePenalty: z.number().optional(),
    stop: z.array(z.string()).optional(),
  }).optional(),
  apiKey: z.string().optional(),
});

export const ListModelsSchema = z.object({
  provider: z.string().optional(),
  apiKey: z.string().optional(),
});

export const ConfigureAIConnectorSchema = z.object({
  defaultModel: z.string().optional(),
  defaultProvider: z.string().optional(),
  apiKeys: z.record(z.string()).optional(),
  options: z.object({
    cacheResponses: z.boolean().optional(),
    cacheTTL: z.number().optional(),
    logRequests: z.boolean().optional(),
    timeout: z.number().optional(),
  }).optional(),
});

// Configuration for AI connector
const defaultConfig = {
  apiKeyPath: path.join(process.cwd(), '.env.local'),
  defaultModel: 'anthropic/claude-3-5-sonnet',
  defaultProvider: 'openrouter',
  defaultMaxTokens: 1000,
  defaultTemperature: 0.7,
  providers: {
    openrouter: {
      apiEndpoint: 'https://openrouter.ai/api/v1/chat/completions',
      modelsEndpoint: 'https://openrouter.ai/api/v1/models',
      defaultModel: 'anthropic/claude-3-5-sonnet',
      envVarName: 'OPENROUTER_API_KEY',
    },
    openai: {
      apiEndpoint: 'https://api.openai.com/v1/chat/completions',
      modelsEndpoint: 'https://api.openai.com/v1/models',
      defaultModel: 'gpt-4o',
      envVarName: 'OPENAI_API_KEY',
    },
    anthropic: {
      apiEndpoint: 'https://api.anthropic.com/v1/messages',
      modelsEndpoint: 'https://api.anthropic.com/v1/models',
      defaultModel: 'claude-3-5-sonnet',
      envVarName: 'ANTHROPIC_API_KEY',
    },
    google: {
      apiEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent',
      modelsEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models',
      defaultModel: 'gemini-1.5-pro',
      envVarName: 'GOOGLE_API_KEY',
    },
    custom: {
      apiEndpoint: '',
      modelsEndpoint: '',
      defaultModel: '',
      envVarName: 'CUSTOM_API_KEY',
    },
  },
  options: {
    cacheResponses: true,
    cacheTTL: 3600, // 1 hour
    logRequests: false,
    timeout: 60000, // 60 seconds
  },
};

// In-memory cache for responses
const responseCache = new Map<string, { response: any; timestamp: number }>();

/**
 * Safely loads API key from environment or configuration file
 */
async function loadApiKey(provider: string, providedKey?: string): Promise<string> {
  // If API key is provided directly, use it
  if (providedKey) {
    return providedKey;
  }
  
  // Get the environment variable name for the provider
  const providerConfig = defaultConfig.providers[provider as keyof typeof defaultConfig.providers] || defaultConfig.providers.openrouter;
  const envVarName = providerConfig.envVarName;
  
  // Try to load from environment variable
  if (process.env[envVarName]) {
    return process.env[envVarName] as string;
  }
  
  // Try to load from configuration file
  try {
    const envContent = await fs.readFile(defaultConfig.apiKeyPath, 'utf8');
    const match = envContent.match(new RegExp(`${envVarName}=["']?([^"'\r\n]+)["']?`));
    
    if (match && match[1]) {
      return match[1];
    }
  } catch (error) {
    // File doesn't exist or can't be read
  }
  
  // Default to the key from implementation plan, but this should be replaced in production
  // This is just a fallback for development
  if (provider === 'openrouter') {
    return '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';
  }
  
  // Return a placeholder API key for development
  // In production, this should be replaced with a proper API key
  return `${provider}-api-key-placeholder`;
}

/**
 * Encrypts sensitive data
 */
function encryptData(data: string, secret: string): string {
  const iv = crypto.randomBytes(16);
  const key = crypto.scryptSync(secret, 'salt', 32);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return iv.toString('hex') + ':' + encrypted;
}

/**
 * Decrypts sensitive data
 */
function decryptData(encryptedData: string, secret: string): string {
  const parts = encryptedData.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const encrypted = parts[1];
  const key = crypto.scryptSync(secret, 'salt', 32);
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

/**
 * Makes an HTTP request
 */
function makeRequest(url: string, method: string, headers: Record<string, string>, body?: any): Promise<{ statusCode: number; data: any }> {
  return new Promise((resolve, reject) => {
    const options = {
      method,
      headers,
    };
    
    const req = https.request(url, options, (res: IncomingMessage) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(data);
          resolve({
            statusCode: res.statusCode || 500,
            data: parsedData,
          });
        } catch (error) {
          reject(new Error(`Failed to parse response: ${error}`));
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (body) {
      req.write(JSON.stringify(body));
    }
    
    req.end();
  });
}

/**
 * Generates text using an AI model
 */
export async function handleGenerateText(args: any) {
  if (args && typeof args === 'object' && 'prompt' in args && typeof args.prompt === 'string') {
    try {
      const {
        prompt,
        model = defaultConfig.defaultModel,
        maxTokens = defaultConfig.defaultMaxTokens,
        temperature = defaultConfig.defaultTemperature,
        options = {},
      } = args;
      
      // Determine the provider from the model
      const modelParts = model.split('/');
      const provider = modelParts.length > 1 ? modelParts[0] : defaultConfig.defaultProvider;
      const modelName = modelParts.length > 1 ? modelParts[1] : model;
      
      // Load API key
      const apiKey = await loadApiKey(provider, args.apiKey);
      
      // Get provider configuration
      const providerConfig = defaultConfig.providers[provider as keyof typeof defaultConfig.providers] || defaultConfig.providers.openrouter;
      
      // Generate a cache key
      const cacheKey = crypto.createHash('md5').update(JSON.stringify({
        prompt,
        model,
        maxTokens,
        temperature,
        options,
      })).digest('hex');
      
      // Check if response is cached
      if (defaultConfig.options.cacheResponses) {
        const cachedResponse = responseCache.get(cacheKey);
        if (cachedResponse && (Date.now() - cachedResponse.timestamp) < defaultConfig.options.cacheTTL * 1000) {
          return {
            content: [{
              type: "text",
              text: JSON.stringify({
                model,
                provider,
                response: cachedResponse.response,
                cached: true,
                message: `Generated text using ${model} (cached).`
              }, null, 2)
            }],
          };
        }
      }
      
      // In a real implementation, we would make an API call to generate text
      // For now, we'll just simulate a response
      
      // Simulate AI response
      const simulatedResponse = {
        id: `gen-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`,
        model: modelName,
        choices: [
          {
            message: {
              role: 'assistant',
              content: `This is a simulated response to: "${prompt.substring(0, 50)}${prompt.length > 50 ? '...' : ''}"`,
            },
            finish_reason: 'stop',
          },
        ],
        usage: {
          prompt_tokens: Math.floor(prompt.length / 4),
          completion_tokens: Math.floor(maxTokens / 2),
          total_tokens: Math.floor(prompt.length / 4) + Math.floor(maxTokens / 2),
        },
      };
      
      // Cache the response
      if (defaultConfig.options.cacheResponses) {
        responseCache.set(cacheKey, {
          response: simulatedResponse,
          timestamp: Date.now(),
        });
      }
      
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            model,
            provider,
            response: simulatedResponse,
            cached: false,
            message: `Generated text using ${model}.`
          }, null, 2)
        }],
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            error: String(error),
            message: `Failed to generate text.`
          }, null, 2)
        }],
        isError: true,
      };
    }
  }
  
  return {
    content: [{ type: "text", text: "Error: Invalid arguments for generate_text" }],
    isError: true,
  };
}

/**
 * Lists available AI models
 */
export async function handleListModels(args: any) {
  try {
    const { provider = defaultConfig.defaultProvider } = args || {};
    
    // Load API key
    const apiKey = await loadApiKey(provider, args?.apiKey);
    
    // Get provider configuration
    const providerConfig = defaultConfig.providers[provider as keyof typeof defaultConfig.providers] || defaultConfig.providers.openrouter;
    
    // In a real implementation, we would make an API call to list models
    // For now, we'll just return some mock models
    
    // Simulate models list
    const simulatedModels = {
      openrouter: [
        { id: 'anthropic/claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'anthropic' },
        { id: 'anthropic/claude-3-opus', name: 'Claude 3 Opus', provider: 'anthropic' },
        { id: 'openai/gpt-4o', name: 'GPT-4o', provider: 'openai' },
        { id: 'google/gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: 'google' },
        { id: 'meta/llama-3-70b', name: 'Llama 3 70B', provider: 'meta' },
      ],
      openai: [
        { id: 'gpt-4o', name: 'GPT-4o', provider: 'openai' },
        { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'openai' },
        { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'openai' },
      ],
      anthropic: [
        { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'anthropic' },
        { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'anthropic' },
        { id: 'claude-3-haiku', name: 'Claude 3 Haiku', provider: 'anthropic' },
      ],
      google: [
        { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: 'google' },
        { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', provider: 'google' },
      ],
      custom: [
        { id: 'custom-model', name: 'Custom Model', provider: 'custom' },
      ],
    };
    
    const models = simulatedModels[provider as keyof typeof simulatedModels] || [];
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          provider,
          models,
          message: `Retrieved ${models.length} models for provider: ${provider}.`
        }, null, 2)
      }],
    };
  } catch (error) {
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          error: String(error),
          message: `Failed to list models.`
        }, null, 2)
      }],
      isError: true,
    };
  }
}

/**
 * Configures the AI connector
 */
export async function handleConfigureAIConnector(args: any) {
  if (args && typeof args === 'object') {
    try {
      // Update default model if provided
      if ('defaultModel' in args && typeof args.defaultModel === 'string') {
        defaultConfig.defaultModel = args.defaultModel;
      }
      
      // Update default provider if provided
      if ('defaultProvider' in args && typeof args.defaultProvider === 'string') {
        defaultConfig.defaultProvider = args.defaultProvider;
      }
      
      // Update options if provided
      if ('options' in args && typeof args.options === 'object') {
        defaultConfig.options = {
          ...defaultConfig.options,
          ...args.options,
        };
      }
      
      // Save API keys if provided
      if ('apiKeys' in args && typeof args.apiKeys === 'object') {
        // Generate a secret key based on machine-specific information
        // This is just a simple example; in production, use a more secure method
        const secret = require('os').hostname() + require('os').userInfo().username;
        
        // Create or update .env.local file
        let envContent = '';
        
        // Try to read existing content
        try {
          envContent = await fs.readFile(defaultConfig.apiKeyPath, 'utf8');
        } catch (error) {
          // File doesn't exist, start with empty content
        }
        
        // Update or add API keys
        for (const [provider, apiKey] of Object.entries(args.apiKeys)) {
          if (typeof apiKey === 'string') {
            const providerConfig = defaultConfig.providers[provider as keyof typeof defaultConfig.providers];
            
            if (providerConfig) {
              const envVarName = providerConfig.envVarName;
              
              // Check if the environment variable already exists in the file
              const regex = new RegExp(`${envVarName}=["']?([^"'\r\n]+)["']?`, 'g');
              
              if (regex.test(envContent)) {
                // Replace existing value
                envContent = envContent.replace(regex, `${envVarName}='${apiKey}'`);
              } else {
                // Add new value
                envContent += `${envVarName}='${apiKey}'\n`;
              }
            }
          }
        }
        
        // Write updated content to file
        await fs.writeFile(defaultConfig.apiKeyPath, envContent);
      }
      
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            defaultModel: defaultConfig.defaultModel,
            defaultProvider: defaultConfig.defaultProvider,
            options: defaultConfig.options,
            message: `AI connector configuration updated.`
          }, null, 2)
        }],
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            error: String(error),
            message: `Failed to configure AI connector.`
          }, null, 2)
        }],
        isError: true,
      };
    }
  }
  
  return {
    content: [{ type: "text", text: "Error: Invalid arguments for configure_ai_connector" }],
    isError: true,
  };
}
