// Auto-generated safe fallback for env-manager

export function activate() {
    console.log("[TOOL] env-manager activated (passive mode)");
}

export function onFileWrite() { /* no-op */ }
export function onSessionStart() { /* no-op */ }
export function onCommand() { /* no-op */ }
/**
 * Environment Manager
 * 
 * Sets up development, testing, and production environments
 * Manages environment variables and configuration files
 */

import * as fs from 'fs/promises';
import { existsSync } from 'fs';
import * as path from 'path';
import { z } from 'zod';
import * as dotenv from 'dotenv';
import * as crypto from 'crypto';
// Using interface instead of importing potentially missing type
interface DotenvConfigOutput {
  parsed?: { [key: string]: string };
  error?: Error;
}

/**
 * Schema for EnvManager
 */
export const CreateEnvFileSchema = z.object({
  filePath: z.string(),
  variables: z.record(z.string()).optional(),
  template: z.string().optional(),
  environment: z.enum(['development', 'testing', 'production', 'custom']).optional().default('development'),
  overwrite: z.boolean().optional().default(false),
});

export const LoadEnvFileSchema = z.object({
  filePath: z.string(),
  override: z.boolean().optional().default(false),
});

export const GetEnvVariableSchema = z.object({
  name: z.string(),
  defaultValue: z.string().optional(),
});

export const SetEnvVariableSchema = z.object({
  name: z.string(),
  value: z.string(),
  filePath: z.string().optional(),
  overwrite: z.boolean().optional().default(true),
});

export const GenerateSecretSchema = z.object({
  length: z.number().optional().default(32),
  type: z.enum(['hex', 'base64', 'url-safe', 'uuid']).optional().default('hex'),
});

export const EncryptValueSchema = z.object({
  value: z.string(),
  key: z.string(),
  algorithm: z.enum(['aes-256-gcm', 'aes-256-cbc']).optional().default('aes-256-gcm'),
});

export const DecryptValueSchema = z.object({
  encrypted: z.string(),
  key: z.string(),
  algorithm: z.enum(['aes-256-gcm', 'aes-256-cbc']).optional().default('aes-256-gcm'),
  iv: z.string().optional(),
  authTag: z.string().optional(),
});

/**
 * Create an environment file
 * 
 * @param filePath Path to the environment file
 * @param variables Environment variables
 * @param template Template file path
 * @param environment Environment type
 * @param overwrite Whether to overwrite an existing file
 * @returns Whether the file was created successfully
 */
export async function createEnvFile(
  filePath: string,
  variables?: Record<string, string>,
  template?: string,
  environment: 'development' | 'testing' | 'production' | 'custom' = 'development',
  overwrite: boolean = false,
): Promise<boolean> {
  try {
    // Check if the file already exists
    try {
      await fs.access(filePath);
      
      // If the file exists and overwrite is false, return false
      if (!overwrite) {
        return false;
      }
    } catch (error) {
      // File doesn't exist, which is fine
    }
    
    // Create the directory if it doesn't exist
    const directory = path.dirname(filePath);
    await fs.mkdir(directory, { recursive: true });
    
    // Initialize the content
    let content = '';
    
    // If a template is provided, use it
    if (template) {
      try {
        content = await fs.readFile(template, 'utf-8');
      } catch (error) {
        // Template file doesn't exist, ignore
      }
    }
    
    // If no template or template file doesn't exist, use default templates
    if (!content) {
      switch (environment) {
        case 'development':
          content = `# Development Environment Variables
NODE_ENV=development
DEBUG=true
LOG_LEVEL=debug
PORT=3000
DATABASE_URL=postgres://localhost:5432/dev_db
API_URL=http://localhost:3000/api
`;
          break;
        
        case 'testing':
          content = `# Testing Environment Variables
NODE_ENV=testing
DEBUG=true
LOG_LEVEL=info
PORT=3001
DATABASE_URL=postgres://localhost:5432/test_db
API_URL=http://localhost:3001/api
`;
          break;
        
        case 'production':
          content = `# Production Environment Variables
NODE_ENV=production
DEBUG=false
LOG_LEVEL=error
PORT=8080
DATABASE_URL=postgres://user:password@host:5432/prod_db
API_URL=https://api.example.com
`;
          break;
        
        case 'custom':
        default:
          content = `# Custom Environment Variables
NODE_ENV=custom
`;
          break;
      }
    }
    
    // Add variables
    if (variables) {
      // Parse existing content to avoid duplicates
      const existingVars = dotenv.parse(content);
      
      // Add new variables
      for (const [key, value] of Object.entries(variables)) {
        if (!(key in existingVars)) {
          content += `${key}=${value}\n`;
        }
      }
    }
    
    // Write the file
    await fs.writeFile(filePath, content, 'utf-8');
    
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Load an environment file
 * 
 * @param filePath Path to the environment file
 * @param override Whether to override existing environment variables
 * @returns Whether the file was loaded successfully
 */
export function loadEnvFile(filePath: string, override: boolean = false): boolean {
  try {
    // Check if the file exists
    if (!existsSync(filePath)) {
      return false;
    }
    
    // Load the environment file
    const result: DotenvConfigOutput = dotenv.config({ path: filePath, override });
    
    return !result.error;
  } catch (error) {
    return false;
  }
}

/**
 * Get an environment variable
 * 
 * @param name Variable name
 * @param defaultValue Default value
 * @returns Variable value
 */
export function getEnvVariable(name: string, defaultValue?: string): string | undefined {
  return process.env[name] || defaultValue;
}

/**
 * Set an environment variable
 * 
 * @param name Variable name
 * @param value Variable value
 * @param filePath Path to the environment file
 * @param overwrite Whether to overwrite an existing variable
 * @returns Whether the variable was set successfully
 */
export async function setEnvVariable(
  name: string,
  value: string,
  filePath?: string,
  overwrite: boolean = true,
): Promise<boolean> {
  try {
    // Set the environment variable
    if (overwrite || !(name in process.env)) {
      process.env[name] = value;
    }
    
    // If a file path is provided, update the file
    if (filePath) {
      try {
        // Check if the file exists
        await fs.access(filePath);
        
        // Read the file
        let content = await fs.readFile(filePath, 'utf-8');
        
        // Parse the file
        const envVars = dotenv.parse(content);
        
        // Check if the variable exists
        if (name in envVars) {
          // If overwrite is false, don't update the file
          if (!overwrite) {
            return true;
          }
          
          // Update the variable
          const regex = new RegExp(`^${name}=.*$`, 'm');
          content = content.replace(regex, `${name}=${value}`);
        } else {
          // Add the variable
          content += `\n${name}=${value}`;
        }
        
        // Write the file
        await fs.writeFile(filePath, content, 'utf-8');
      } catch (error) {
        // File doesn't exist, create it
        await createEnvFile(filePath, { [name]: value }, undefined, 'custom', true);
      }
    }
    
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Generate a secret
 * 
 * @param length Secret length
 * @param type Secret type
 * @returns Generated secret
 */
export function generateSecret(
  length: number = 32,
  type: 'hex' | 'base64' | 'url-safe' | 'uuid' = 'hex',
): string {
  switch (type) {
    case 'hex':
      return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
    
    case 'base64':
      return crypto.randomBytes(Math.ceil(length * 3 / 4)).toString('base64').slice(0, length);
    
    case 'url-safe':
      return crypto.randomBytes(Math.ceil(length * 3 / 4))
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '')
        .slice(0, length);
    
    case 'uuid':
      return crypto.randomUUID();
  }
}

/**
 * Encrypt a value
 * 
 * @param value Value to encrypt
 * @param key Encryption key
 * @param algorithm Encryption algorithm
 * @returns Encrypted value
 */
export function encryptValue(
  value: string,
  key: string,
  algorithm: 'aes-256-gcm' | 'aes-256-cbc' = 'aes-256-gcm',
): { encrypted: string; iv: string; authTag?: string } {
  // Derive a key from the provided key
  const derivedKey = crypto.createHash('sha256').update(key).digest();
  
  // Generate a random initialization vector
  const iv = crypto.randomBytes(16);
  
  let cipher: crypto.CipherGCM | crypto.Cipher;
  
  if (algorithm === 'aes-256-gcm') {
    // Create a cipher using AES-256-GCM
    cipher = crypto.createCipheriv(algorithm, derivedKey, iv) as crypto.CipherGCM;
  } else {
    // Create a cipher using AES-256-CBC
    cipher = crypto.createCipheriv(algorithm, derivedKey, iv);
  }
  
  // Encrypt the value
  let encrypted = cipher.update(value, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  // Get the authentication tag for GCM
  const authTag = algorithm === 'aes-256-gcm'
    ? (cipher as crypto.CipherGCM).getAuthTag().toString('hex')
    : undefined;
  
  return {
    encrypted,
    iv: iv.toString('hex'),
    authTag,
  };
}

/**
 * Decrypt a value
 * 
 * @param encrypted Encrypted value
 * @param key Encryption key
 * @param algorithm Encryption algorithm
 * @param iv Initialization vector
 * @param authTag Authentication tag
 * @returns Decrypted value
 */
export function decryptValue(
  encrypted: string,
  key: string,
  algorithm: 'aes-256-gcm' | 'aes-256-cbc' = 'aes-256-gcm',
  iv?: string,
  authTag?: string,
): string {
  if (!iv) {
    throw new Error('Initialization vector is required');
  }
  
  // Derive a key from the provided key
  const derivedKey = crypto.createHash('sha256').update(key).digest();
  
  // Convert the IV from hex to Buffer
  const ivBuffer = Buffer.from(iv, 'hex');
  
  let decipher: crypto.DecipherGCM | crypto.Decipher;
  
  if (algorithm === 'aes-256-gcm') {
    if (!authTag) {
      throw new Error('Authentication tag is required for AES-256-GCM');
    }
    
    // Create a decipher using AES-256-GCM
    decipher = crypto.createDecipheriv(algorithm, derivedKey, ivBuffer) as crypto.DecipherGCM;
    
    // Set the authentication tag
    (decipher as crypto.DecipherGCM).setAuthTag(Buffer.from(authTag, 'hex'));
  } else {
    // Create a decipher using AES-256-CBC
    decipher = crypto.createDecipheriv(algorithm, derivedKey, ivBuffer);
  }
  
  // Decrypt the value
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

/**
 * Handle create_env_file command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleCreateEnvFile(args: any): Promise<{
  content: Array<{ type: string; text: string }>;
  isError: boolean;
}> {
  try {
    const { filePath, variables, template, environment, overwrite } = args;
    const result = await createEnvFile(filePath, variables, template, environment, overwrite);
    
    if (result) {
      return {
        content: [{ type: "text", text: `Environment file created: ${filePath}` }],
        isError: false,
      };
    } else {
      return {
        content: [{ type: "text", text: `Failed to create environment file: ${filePath}` }],
        isError: true,
      };
    }
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error creating environment file: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Handle load_env_file command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleLoadEnvFile(args: any): Promise<{
  content: Array<{ type: string; text: string }>;
  isError: boolean;
}> {
  try {
    const { filePath, override } = args;
    const result = loadEnvFile(filePath, override);
    
    if (result) {
      return {
        content: [{ type: "text", text: `Environment file loaded: ${filePath}` }],
        isError: false,
      };
    } else {
      return {
        content: [{ type: "text", text: `Failed to load environment file: ${filePath}` }],
        isError: true,
      };
    }
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error loading environment file: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Handle get_env_variable command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleGetEnvVariable(args: any): Promise<{
  content: Array<{ type: string; text: string }>;
  isError: boolean;
}> {
  try {
    const { name, defaultValue } = args;
    const value = getEnvVariable(name, defaultValue);
    
    if (value !== undefined) {
      return {
        content: [{ type: "text", text: `${name}=${value}` }],
        isError: false,
      };
    } else {
      return {
        content: [{ type: "text", text: `Environment variable not found: ${name}` }],
        isError: true,
      };
    }
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error getting environment variable: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Handle set_env_variable command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleSetEnvVariable(args: any): Promise<{
  content: Array<{ type: string; text: string }>;
  isError: boolean;
}> {
  try {
    const { name, value, filePath, overwrite } = args;
    const result = await setEnvVariable(name, value, filePath, overwrite);
    
    if (result) {
      return {
        content: [{ type: "text", text: `Environment variable set: ${name}=${value}` }],
        isError: false,
      };
    } else {
      return {
        content: [{ type: "text", text: `Failed to set environment variable: ${name}` }],
        isError: true,
      };
    }
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error setting environment variable: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Handle generate_secret command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleGenerateSecret(args: any): Promise<{
  content: Array<{ type: string; text: string }>;
  isError: boolean;
}> {
  try {
    const { length, type } = args;
    const secret = generateSecret(length, type);
    
    return {
      content: [{ type: "text", text: `Generated secret: ${secret}` }],
      isError: false,
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error generating secret: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Handle encrypt_value command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleEncryptValue(args: any): Promise<{
  content: Array<{ type: string; text: string }>;
  isError: boolean;
}> {
  try {
    const { value, key, algorithm } = args;
    const result = encryptValue(value, key, algorithm);
    
    return {
      content: [
        { type: "text", text: `Encrypted value: ${result.encrypted}` },
        { type: "text", text: `Initialization vector: ${result.iv}` },
        ...(result.authTag ? [{ type: "text", text: `Authentication tag: ${result.authTag}` }] : []),
      ],
      isError: false,
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error encrypting value: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Handle decrypt_value command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleDecryptValue(args: any): Promise<{
  content: Array<{ type: string; text: string }>;
  isError: boolean;
}> {
  try {
    const { encrypted, key, algorithm, iv, authTag } = args;
    const decrypted = decryptValue(encrypted, key, algorithm, iv, authTag);
    
    return {
      content: [{ type: "text", text: `Decrypted value: ${decrypted}` }],
      isError: false,
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error decrypting value: ${error}` }],
      isError: true,
    };
  }
}

