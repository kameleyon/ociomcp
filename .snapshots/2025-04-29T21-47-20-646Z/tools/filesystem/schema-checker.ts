// Auto-generated safe fallback for schema-checker

export function activate() {
    console.log("[TOOL] schema-checker activated (passive mode)");
}

export function onFileWrite() { /* no-op */ }
export function onSessionStart() { /* no-op */ }
export function onCommand() { /* no-op */ }
/**
 * Schema Checker
 * 
 * Validates data structures against defined schemas
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { z } from 'zod';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
// Define JSONSchema7 type locally instead of importing
type JSONSchema7 = {
  $id?: string;
  $ref?: string;
  $schema?: string;
  $comment?: string;
  title?: string;
  description?: string;
  default?: any;
  readOnly?: boolean;
  writeOnly?: boolean;
  examples?: any[];
  multipleOf?: number;
  maximum?: number;
  exclusiveMaximum?: number;
  minimum?: number;
  exclusiveMinimum?: number;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  additionalItems?: JSONSchema7 | boolean;
  items?: JSONSchema7 | JSONSchema7[];
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  contains?: JSONSchema7;
  maxProperties?: number;
  minProperties?: number;
  required?: string[];
  additionalProperties?: JSONSchema7 | boolean;
  definitions?: {
    [key: string]: JSONSchema7;
  };
  properties?: {
    [key: string]: JSONSchema7;
  };
  patternProperties?: {
    [key: string]: JSONSchema7;
  };
  dependencies?: {
    [key: string]: JSONSchema7 | string[];
  };
  propertyNames?: JSONSchema7;
  const?: any;
  enum?: any[];
  type?: string | string[];
  format?: string;
  contentMediaType?: string;
  contentEncoding?: string;
  if?: JSONSchema7;
  then?: JSONSchema7;
  else?: JSONSchema7;
  allOf?: JSONSchema7[];
  anyOf?: JSONSchema7[];
  oneOf?: JSONSchema7[];
  not?: JSONSchema7;
};
import { existsSync } from 'fs';
// Define ValidateFunction type locally instead of importing
interface ValidateFunction<T = unknown> {
  (data: unknown): data is T;
  errors?: Array<{
    keyword: string;
    dataPath?: string;
    instancePath?: string;
    schemaPath: string;
    params: Record<string, any>;
    message?: string;
    schema?: any;
    parentSchema?: any;
    data?: any;
  }> | null;
}

/**
 * Schema for SchemaChecker
 */
export const ValidateJsonSchema = z.object({
  data: z.any(),
  schema: z.any(),
  format: z.enum(['zod', 'json-schema']).default('json-schema'),
});

export const ValidateFileSchema = z.object({
  filePath: z.string(),
  schemaPath: z.string(),
  format: z.enum(['zod', 'json-schema']).default('json-schema'),
});

export const GenerateSchemaSchema = z.object({
  data: z.any(),
  format: z.enum(['zod', 'json-schema', 'typescript']).default('json-schema'),
  options: z.object({
    required: z.boolean().optional().default(true),
    additionalProperties: z.boolean().optional().default(false),
    includeExamples: z.boolean().optional().default(false),
  }).optional(),
});

export const ValidateConfigSchema = z.object({
  configPath: z.string(),
  schemaPath: z.string(),
  format: z.enum(['zod', 'json-schema']).default('json-schema'),
  errorOnMissing: z.boolean().optional().default(false),
});

export const ValidateApiPayloadSchema = z.object({
  payload: z.any(),
  endpoint: z.string(),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']),
  schemaPath: z.string().optional(),
  schema: z.any().optional(),
});

/**
 * Validation result
 */
interface ValidationResult {
  valid: boolean;
  errors?: any[];
  message: string;
  generatedSchema?: JSONSchema7 | string;
}

/**
 * Schema generation options
 */
interface SchemaGenerationOptions {
  required?: boolean;
  additionalProperties?: boolean;
  includeExamples?: boolean;
}

/**
 * Validate data against a JSON Schema
 * 
 * @param data Data to validate
 * @param schema JSON Schema to validate against
 * @returns Validation result
 */
export function validateWithJsonSchema(data: any, schema: JSONSchema7): ValidationResult {
  try {
    const ajv = new Ajv({ allErrors: true, verbose: true });
    addFormats(ajv);
    
    const validate: ValidateFunction = ajv.compile(schema);
    const valid = validate(data);
    
    if (valid) {
      return {
        valid: true,
        message: 'Data is valid against the schema',
      };
    } else {
      return {
        valid: false,
        errors: validate.errors || [],
        message: 'Data is invalid against the schema',
      };
    }
  } catch (error) {
    return {
      valid: false,
      errors: [{ message: error instanceof Error ? error.message : String(error) }],
      message: `Error validating data: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

/**
 * Validate data against a Zod schema
 * 
 * @param data Data to validate
 * @param schema Zod schema to validate against
 * @returns Validation result
 */
export function validateWithZodSchema(data: any, schema: z.ZodType<any>): ValidationResult {
  try {
    const result = schema.safeParse(data);
    
    if (result.success) {
      return {
        valid: true,
        message: 'Data is valid against the schema',
      };
    } else {
      return {
        valid: false,
        errors: result.error.errors,
        message: 'Data is invalid against the schema',
      };
    }
  } catch (error) {
    return {
      valid: false,
      errors: [{ message: error instanceof Error ? error.message : String(error) }],
      message: `Error validating data: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

/**
 * Validate data against a schema
 * 
 * @param data Data to validate
 * @param schema Schema to validate against
 * @param format Schema format
 * @returns Validation result
 */
export function validateData(data: any, schema: any, format: 'zod' | 'json-schema' = 'json-schema'): ValidationResult {
  if (format === 'zod') {
    return validateWithZodSchema(data, schema);
  } else {
    return validateWithJsonSchema(data, schema);
  }
}

/**
 * Validate a file against a schema
 * 
 * @param filePath Path to the file to validate
 * @param schemaPath Path to the schema file
 * @param format Schema format
 * @returns Validation result
 */
export async function validateFile(filePath: string, schemaPath: string, format: 'zod' | 'json-schema' = 'json-schema'): Promise<ValidationResult> {
  try {
    // Read the file
    const fileContent = await fs.readFile(filePath, 'utf-8');
    let data: any;
    
    try {
      data = JSON.parse(fileContent);
    } catch (error) {
      return {
        valid: false,
        errors: [{ message: 'File is not valid JSON' }],
        message: `Error parsing file: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
    
    // Read the schema
    const schemaContent = await fs.readFile(schemaPath, 'utf-8');
    let schema: any;
    
    try {
      schema = JSON.parse(schemaContent);
    } catch (error) {
      return {
        valid: false,
        errors: [{ message: 'Schema is not valid JSON' }],
        message: `Error parsing schema: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
    
    // Validate the data against the schema
    return validateData(data, schema, format);
  } catch (error) {
    return {
      valid: false,
      errors: [{ message: error instanceof Error ? error.message : String(error) }],
      message: `Error validating file: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

/**
 * Generate a JSON Schema from data
 * 
 * @param data Data to generate schema from
 * @param options Schema generation options
 * @returns Generated JSON Schema
 */
export function generateJsonSchema(data: any, options: SchemaGenerationOptions = {}): JSONSchema7 {
  const { required = true, additionalProperties = false, includeExamples = false } = options;
  
  // Helper function to determine the type of a value
  function getType(value: any): string {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    return typeof value;
  }
  
  // Helper function to generate schema for an object
  function generateObjectSchema(obj: Record<string, any>): JSONSchema7 {
    const properties: Record<string, JSONSchema7> = {};
    const requiredProperties: string[] = [];
    
    for (const [key, value] of Object.entries(obj)) {
      properties[key] = generateSchemaForValue(value);
      
      if (required && value !== undefined && value !== null) {
        requiredProperties.push(key);
      }
    }
    
    const schema: JSONSchema7 = {
      type: 'object',
      properties,
      additionalProperties,
    };
    
    if (required && requiredProperties.length > 0) {
      schema.required = requiredProperties;
    }
    
    return schema;
  }
  
  // Helper function to generate schema for an array
  function generateArraySchema(arr: any[]): JSONSchema7 {
    if (arr.length === 0) {
      return {
        type: 'array',
        items: {},
      };
    }
    
    // Check if all items are of the same type
    const firstType = getType(arr[0]);
    const allSameType = arr.every(item => getType(item) === firstType);
    
    if (allSameType) {
      if (firstType === 'object') {
        // Merge all object schemas
        const mergedObj: Record<string, any> = {};
        
        for (const item of arr) {
          for (const [key, value] of Object.entries(item)) {
            if (!(key in mergedObj)) {
              mergedObj[key] = value;
            }
          }
        }
        
        return {
          type: 'array',
          items: generateObjectSchema(mergedObj),
        };
      } else {
        return {
          type: 'array',
          items: generateSchemaForValue(arr[0]),
        };
      }
    } else {
      // Mixed types, use oneOf
      const itemSchemas = arr.map(item => generateSchemaForValue(item));
      
      return {
        type: 'array',
        items: {
          oneOf: itemSchemas,
        },
      };
    }
  }
  
  // Helper function to generate schema for a value
  function generateSchemaForValue(value: any): JSONSchema7 {
    const type = getType(value);
    
    switch (type) {
      case 'object':
        if (Object.keys(value).length === 0) {
          return { type: 'object', additionalProperties };
        }
        return generateObjectSchema(value);
      
      case 'array':
        return generateArraySchema(value);
      
      case 'string':
        return includeExamples ? { type: 'string', examples: [value] } : { type: 'string' };
      
      case 'number':
        return includeExamples ? { type: 'number', examples: [value] } : { type: 'number' };
      
      case 'boolean':
        return { type: 'boolean' };
      
      case 'null':
        return { type: 'null' };
      
      default:
        return {};
    }
  }
  
  return generateSchemaForValue(data);
}

/**
 * Generate a Zod schema from data
 * 
 * @param data Data to generate schema from
 * @param options Schema generation options
 * @returns Generated Zod schema as string
 */
export function generateZodSchema(data: any, options: SchemaGenerationOptions = {}): string {
  const { required = true } = options;
  
  // Helper function to determine the type of a value
  function getType(value: any): string {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    return typeof value;
  }
  
  // Helper function to generate schema for an object
  function generateObjectSchema(obj: Record<string, any>): string {
    const properties: string[] = [];
    
    for (const [key, value] of Object.entries(obj)) {
      const propertySchema = generateSchemaForValue(value);
      
      if (required && value !== undefined && value !== null) {
        properties.push(`${key}: ${propertySchema}`);
      } else {
        properties.push(`${key}: ${propertySchema}.optional()`);
      }
    }
    
    return `z.object({\n  ${properties.join(',\n  ')}\n})`;
  }
  
  // Helper function to generate schema for an array
  function generateArraySchema(arr: any[]): string {
    if (arr.length === 0) {
      return 'z.array(z.unknown())';
    }
    
    // Check if all items are of the same type
    const firstType = getType(arr[0]);
    const allSameType = arr.every(item => getType(item) === firstType);
    
    if (allSameType) {
      if (firstType === 'object') {
        // Merge all object schemas
        const mergedObj: Record<string, any> = {};
        
        for (const item of arr) {
          for (const [key, value] of Object.entries(item)) {
            if (!(key in mergedObj)) {
              mergedObj[key] = value;
            }
          }
        }
        
        return `z.array(${generateObjectSchema(mergedObj)})`;
      } else {
        return `z.array(${generateSchemaForValue(arr[0])})`;
      }
    } else {
      // Mixed types, use union
      const itemSchemas = arr.map(item => generateSchemaForValue(item));
      
      return `z.array(z.union([${itemSchemas.join(', ')}]))`;
    }
  }
  
  // Helper function to generate schema for a value
  function generateSchemaForValue(value: any): string {
    const type = getType(value);
    
    switch (type) {
      case 'object':
        if (Object.keys(value).length === 0) {
          return 'z.object({})';
        }
        return generateObjectSchema(value);
      
      case 'array':
        return generateArraySchema(value);
      
      case 'string':
        return 'z.string()';
      
      case 'number':
        return Number.isInteger(value) ? 'z.number().int()' : 'z.number()';
      
      case 'boolean':
        return 'z.boolean()';
      
      case 'null':
        return 'z.null()';
      
      default:
        return 'z.unknown()';
    }
  }
  
  return `import { z } from 'zod';\n\nexport const schema = ${generateSchemaForValue(data)};`;
}

/**
 * Generate a TypeScript interface from data
 * 
 * @param data Data to generate interface from
 * @param options Schema generation options
 * @returns Generated TypeScript interface as string
 */
export function generateTypeScriptInterface(data: any, options: SchemaGenerationOptions = {}): string {
  const { required = true } = options;
  
  // Helper function to determine the type of a value
  function getType(value: any): string {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    return typeof value;
  }
  
  // Helper function to generate interface for an object
  function generateObjectInterface(obj: Record<string, any>, interfaceName: string = 'Root'): string {
    const properties: string[] = [];
    const nestedInterfaces: string[] = [];
    
    for (const [key, value] of Object.entries(obj)) {
      const propertyType = getTypeForValue(value, `${interfaceName}${key.charAt(0).toUpperCase() + key.slice(1)}`);
      
      if (propertyType.nestedInterface) {
        nestedInterfaces.push(propertyType.nestedInterface);
      }
      
      properties.push(`  ${key}${required || (value !== undefined && value !== null) ? '' : '?'}: ${propertyType.type};`);
    }
    
    const mainInterface = `export interface ${interfaceName} {\n${properties.join('\n')}\n}`;
    
    if (nestedInterfaces.length > 0) {
      return `${nestedInterfaces.join('\n\n')}\n\n${mainInterface}`;
    }
    
    return mainInterface;
  }
  
  // Helper function to get type for a value
  function getTypeForValue(value: any, interfaceName: string): { type: string; nestedInterface?: string } {
    const type = getType(value);
    
    switch (type) {
      case 'object':
        if (Object.keys(value).length === 0) {
          return { type: 'Record<string, unknown>' };
        }
        
        const nestedInterface = generateObjectInterface(value, interfaceName);
        return { type: interfaceName, nestedInterface };
      
      case 'array':
        if (value.length === 0) {
          return { type: 'unknown[]' };
        }
        
        // Check if all items are of the same type
        const firstType = getType(value[0]);
        const allSameType = value.every((item: any) => getType(item) === firstType);
        
        if (allSameType) {
          if (firstType === 'object') {
            // Merge all object schemas
            const mergedObj: Record<string, any> = {};
            
            for (const item of value as any[]) {
              for (const [key, val] of Object.entries(item)) {
                if (!(key in mergedObj)) {
                  mergedObj[key] = val;
                }
              }
            }
            
            const itemType = getTypeForValue(mergedObj, `${interfaceName}Item`);
            
            return {
              type: `${itemType.type}[]`,
              nestedInterface: itemType.nestedInterface,
            };
          } else {
            const itemType = getTypeForValue(value[0], `${interfaceName}Item`);
            
            return {
              type: `${itemType.type}[]`,
              nestedInterface: itemType.nestedInterface,
            };
          }
        } else {
          // Mixed types
          const uniqueTypes = new Set(value.map((item: any) => {
            const itemType = getTypeForValue(item, `${interfaceName}Item`);
            return itemType.type;
          }));
          
          return { type: `(${Array.from(uniqueTypes).join(' | ')})[]` };
        }
      
      case 'string':
        return { type: 'string' };
      
      case 'number':
        return { type: 'number' };
      
      case 'boolean':
        return { type: 'boolean' };
      
      case 'null':
        return { type: 'null' };
      
      default:
        return { type: 'unknown' };
    }
  }
  
  return generateObjectInterface(data);
}

/**
 * Generate a schema from data
 * 
 * @param data Data to generate schema from
 * @param format Schema format
 * @param options Schema generation options
 * @returns Generated schema
 */
export function generateSchema(data: any, format: 'zod' | 'json-schema' | 'typescript' = 'json-schema', options: SchemaGenerationOptions = {}): any {
  switch (format) {
    case 'zod':
      return generateZodSchema(data, options);
    
    case 'typescript':
      return generateTypeScriptInterface(data, options);
    
    case 'json-schema':
    default:
      return generateJsonSchema(data, options);
  }
}

/**
 * Validate a configuration file against a schema
 * 
 * @param configPath Path to the configuration file
 * @param schemaPath Path to the schema file
 * @param format Schema format
 * @param errorOnMissing Whether to error if the configuration file is missing
 * @returns Validation result
 */
export async function validateConfig(configPath: string, schemaPath: string, format: 'zod' | 'json-schema' = 'json-schema', errorOnMissing: boolean = false): Promise<ValidationResult> {
  try {
    // Check if the configuration file exists
    try {
      await fs.access(configPath);
    } catch (error) {
      if (errorOnMissing) {
        return {
          valid: false,
          errors: [{ message: 'Configuration file does not exist' }],
          message: `Configuration file does not exist: ${configPath}`,
        };
      } else {
        return {
          valid: true,
          message: `Configuration file does not exist: ${configPath}`,
        };
      }
    }
    
    // Validate the configuration file
    return validateFile(configPath, schemaPath, format);
  } catch (error) {
    return {
      valid: false,
      errors: [{ message: error instanceof Error ? error.message : String(error) }],
      message: `Error validating configuration: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

/**
 * Validate an API payload against a schema
 * 
 * @param payload API payload to validate
 * @param endpoint API endpoint
 * @param method HTTP method
 * @param schemaPath Path to the schema file
 * @param schema Schema to validate against
 * @returns Validation result
 */
export async function validateApiPayload(payload: any, endpoint: string, method: string, schemaPath?: string, schema?: any): Promise<ValidationResult> {
  try {
    // If a schema is provided, use it
    if (schema) {
      return validateData(payload, schema, 'json-schema');
    }
    
    // If a schema path is provided, load it
    if (schemaPath) {
      try {
        const schemaContent = await fs.readFile(schemaPath, 'utf-8');
        const loadedSchema = JSON.parse(schemaContent);
        
        return validateData(payload, loadedSchema, 'json-schema');
      } catch (error) {
        return {
          valid: false,
          errors: [{ message: `Error loading schema: ${error instanceof Error ? error.message : String(error)}` }],
          message: `Error loading schema: ${error instanceof Error ? error.message : String(error)}`,
        };
      }
    }
    
    // If no schema is provided, generate one from the payload
    const generatedSchema = generateJsonSchema(payload);
    
    return {
      valid: true,
      message: 'No schema provided, generated schema from payload',
      generatedSchema,
    };
  } catch (error) {
    return {
      valid: false,
      errors: [{ message: error instanceof Error ? error.message : String(error) }],
      message: `Error validating API payload: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

/**
 * Handle validate_json command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleValidateJson(args: any): Promise<{
  content: Array<{ type: string; text: string }>;
  isError: boolean;
}> {
  try {
    const { data, schema, format } = args;
    const result = validateData(data, schema, format);
    
    if (result.valid) {
      return {
        content: [{ type: "text", text: result.message }],
        isError: false,
      };
    } else {
      return {
        content: [
          { type: "text", text: result.message },
          { type: "text", text: `Errors:\n${JSON.stringify(result.errors, null, 2)}` },
        ],
        isError: true,
      };
    }
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error validating JSON: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Handle validate_file command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleValidateFile(args: any): Promise<{
  content: Array<{ type: string; text: string }>;
  isError: boolean;
}> {
  try {
    const { filePath, schemaPath, format } = args;
    const result = await validateFile(filePath, schemaPath, format);
    
    if (result.valid) {
      return {
        content: [{ type: "text", text: result.message }],
        isError: false,
      };
    } else {
      return {
        content: [
          { type: "text", text: result.message },
          { type: "text", text: `Errors:\n${JSON.stringify(result.errors, null, 2)}` },
        ],
        isError: true,
      };
    }
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error validating file: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Handle generate_schema command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleGenerateSchema(args: any): Promise<{
  content: Array<{ type: string; text: string }>;
  isError: boolean;
}> {
  try {
    const { data, format, options } = args;
    const schema = generateSchema(data, format, options);
    
    return {
      content: [
        { type: "text", text: `Schema generated successfully in ${format} format` },
        { type: "text", text: format === 'json-schema' ? JSON.stringify(schema, null, 2) : schema },
      ],
      isError: false,
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error generating schema: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Handle validate_config command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleValidateConfig(args: any): Promise<{
  content: Array<{ type: string; text: string }>;
  isError: boolean;
}> {
  try {
    const { configPath, schemaPath, format, errorOnMissing } = args;
    const result = await validateConfig(configPath, schemaPath, format, errorOnMissing);
    
    if (result.valid) {
      return {
        content: [{ type: "text", text: result.message }],
        isError: false,
      };
    } else {
      return {
        content: [
          { type: "text", text: result.message },
          { type: "text", text: `Errors:\n${JSON.stringify(result.errors, null, 2)}` },
        ],
        isError: true,
      };
    }
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error validating configuration: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Handle validate_api_payload command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleValidateApiPayload(args: any): Promise<{
  content: Array<{ type: string; text: string }>;
  isError: boolean;
}> {
  try {
    const { payload, endpoint, method, schemaPath, schema } = args;
    const result = await validateApiPayload(payload, endpoint, method, schemaPath, schema);
    
    if (result.valid) {
      const content: Array<{ type: string; text: string }> = [{ type: "text", text: result.message }];
      
      if (result.generatedSchema) {
        content.push({ type: "text", text: `Generated schema:\n${JSON.stringify(result.generatedSchema, null, 2)}` });
      }
      
      return {
        content,
        isError: false,
      };
    } else {
      return {
        content: [
          { type: "text", text: result.message },
          { type: "text", text: `Errors:\n${JSON.stringify(result.errors, null, 2)}` },
        ],
        isError: true,
      };
    }
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error validating API payload: ${error}` }],
      isError: true,
    };
  }
}
