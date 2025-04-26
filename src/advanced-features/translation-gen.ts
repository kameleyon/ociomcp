/**
 * Translation Generator
 * 
 * Generates translation files for multiple locales
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { z } from 'zod';

/**
 * Schema for TranslationGen
 */
export const GenerateTranslationsSchema = z.object({
  sourceLocale: z.string().default('en'),
  targetLocales: z.array(z.string()),
  keys: z.array(z.string()).optional(),
  keyValuePairs: z.record(z.string()).optional(),
  outputFormat: z.enum(['json', 'yaml', 'js', 'ts']).default('json'),
  outputDir: z.string(),
  fileName: z.string().optional(),
  namespaces: z.array(z.string()).optional(),
  placeholders: z.boolean().optional().default(true),
  autoTranslate: z.boolean().optional().default(false),
  apiKey: z.string().optional(),
});

export const ExtractTranslationKeysSchema = z.object({
  sourceFiles: z.array(z.string()),
  patterns: z.array(z.string()).optional(),
  outputFile: z.string().optional(),
  existingKeys: z.record(z.string()).optional(),
});

export const MergeTranslationsSchema = z.object({
  sourceFiles: z.array(z.string()),
  outputFile: z.string(),
  overwrite: z.boolean().optional().default(false),
});

/**
 * Translation format
 */
export enum TranslationFormat {
  JSON = 'json',
  YAML = 'yaml',
  JS = 'js',
  TS = 'ts',
}

/**
 * Translation namespace
 */
export interface TranslationNamespace {
  [key: string]: string | TranslationNamespace;
}

/**
 * Translation file
 */
export interface TranslationFile {
  locale: string;
  namespace?: string;
  translations: TranslationNamespace;
}

/**
 * Generate translation files for multiple locales
 * 
 * @param options Generation options
 * @returns Generation result
 */
export async function generateTranslations(
  options: {
    sourceLocale: string;
    targetLocales: string[];
    keys?: string[];
    keyValuePairs?: Record<string, string>;
    outputFormat?: 'json' | 'yaml' | 'js' | 'ts';
    outputDir: string;
    fileName?: string;
    namespaces?: string[];
    placeholders?: boolean;
    autoTranslate?: boolean;
    apiKey?: string;
  }
): Promise<{
  success: boolean;
  message: string;
  files: string[];
  errors?: string[];
}> {
  try {
    // Default options
    const outputFormat = options.outputFormat || 'json';
    const placeholders = options.placeholders !== false;
    const autoTranslate = options.autoTranslate === true;
    const fileName = options.fileName || 'translations';
    
    // Validate options
    if (!options.keys && !options.keyValuePairs) {
      return {
        success: false,
        message: 'Either keys or keyValuePairs must be provided',
        files: [],
        errors: ['Either keys or keyValuePairs must be provided'],
      };
    }
    
    if (autoTranslate && !options.apiKey) {
      return {
        success: false,
        message: 'API key is required for auto-translation',
        files: [],
        errors: ['API key is required for auto-translation'],
      };
    }
    
    // Create the output directory if it doesn't exist
    await fs.mkdir(options.outputDir, { recursive: true });
    
    // Generate translations
    const files: string[] = [];
    const errors: string[] = [];
    
    // Create source locale translations
    const sourceTranslations: Record<string, TranslationNamespace> = {};
    
    if (options.namespaces && options.namespaces.length > 0) {
      // Create namespaced translations
      for (const namespace of options.namespaces) {
        sourceTranslations[namespace] = {};
        
        if (options.keys) {
          for (const key of options.keys) {
            sourceTranslations[namespace][key] = placeholders ? `[${options.sourceLocale}] ${key}` : key;
          }
        }
        
        if (options.keyValuePairs) {
          for (const [key, value] of Object.entries(options.keyValuePairs)) {
            sourceTranslations[namespace][key] = value;
          }
        }
      }
    } else {
      // Create default namespace translations
      sourceTranslations['default'] = {};
      
      if (options.keys) {
        for (const key of options.keys) {
          sourceTranslations['default'][key] = placeholders ? `[${options.sourceLocale}] ${key}` : key;
        }
      }
      
      if (options.keyValuePairs) {
        for (const [key, value] of Object.entries(options.keyValuePairs)) {
          sourceTranslations['default'][key] = value;
        }
      }
    }
    
    // Write source locale translations
    for (const [namespace, translations] of Object.entries(sourceTranslations)) {
      const outputFileName = options.namespaces && options.namespaces.length > 0
        ? `${fileName}.${namespace}.${options.sourceLocale}.${outputFormat}`
        : `${fileName}.${options.sourceLocale}.${outputFormat}`;
      
      const outputFilePath = path.join(options.outputDir, outputFileName);
      
      try {
        await writeTranslationFile(outputFilePath, translations, outputFormat);
        files.push(outputFilePath);
      } catch (error) {
        errors.push(`Error writing ${outputFilePath}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    
    // Generate target locale translations
    for (const targetLocale of options.targetLocales) {
      const targetTranslations: Record<string, TranslationNamespace> = {};
      
      for (const [namespace, sourceNamespaceTranslations] of Object.entries(sourceTranslations)) {
        targetTranslations[namespace] = {};
        
        for (const [key, value] of Object.entries(sourceNamespaceTranslations)) {
          if (typeof value === 'string') {
            if (autoTranslate) {
              try {
                targetTranslations[namespace][key] = await translateText(value, options.sourceLocale, targetLocale, options.apiKey!);
              } catch (error) {
                targetTranslations[namespace][key] = placeholders ? `[${targetLocale}] ${key}` : key;
                errors.push(`Error translating ${key} to ${targetLocale}: ${error instanceof Error ? error.message : String(error)}`);
              }
            } else {
              targetTranslations[namespace][key] = placeholders ? `[${targetLocale}] ${key}` : key;
            }
          } else {
            targetTranslations[namespace][key] = value;
          }
        }
      }
      
      // Write target locale translations
      for (const [namespace, translations] of Object.entries(targetTranslations)) {
        const outputFileName = options.namespaces && options.namespaces.length > 0
          ? `${fileName}.${namespace}.${targetLocale}.${outputFormat}`
          : `${fileName}.${targetLocale}.${outputFormat}`;
        
        const outputFilePath = path.join(options.outputDir, outputFileName);
        
        try {
          await writeTranslationFile(outputFilePath, translations, outputFormat);
          files.push(outputFilePath);
        } catch (error) {
          errors.push(`Error writing ${outputFilePath}: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    }
    
    return {
      success: errors.length === 0,
      message: errors.length === 0
        ? `Successfully generated ${files.length} translation files`
        : `Generated ${files.length} translation files with ${errors.length} errors`,
      files,
      errors: errors.length > 0 ? errors : undefined,
    };
  } catch (error) {
    return {
      success: false,
      message: `Error generating translations: ${error instanceof Error ? error.message : String(error)}`,
      files: [],
      errors: [`Error generating translations: ${error instanceof Error ? error.message : String(error)}`],
    };
  }
}

/**
 * Extract translation keys from source files
 * 
 * @param options Extraction options
 * @returns Extraction result
 */
export async function extractTranslationKeys(
  options: {
    sourceFiles: string[];
    patterns?: string[];
    outputFile?: string;
    existingKeys?: Record<string, string>;
  }
): Promise<{
  success: boolean;
  message: string;
  keys: Record<string, string>;
  errors?: string[];
}> {
  try {
    // Default options
    const patterns = options.patterns || [
      't\\([\'"`](.*?)[\'"`]\\)',
      'i18n\\.t\\([\'"`](.*?)[\'"`]\\)',
      'useTranslation\\([\'"`](.*?)[\'"`]\\)',
      'Trans[\\s\\n]*i18nKey=[\'"`](.*?)[\'"`]',
      '<Trans>([^<]+)</Trans>',
    ];
    
    // Compile the patterns
    const regexPatterns = patterns.map(pattern => new RegExp(pattern, 'g'));
    
    // Extract keys from source files
    const keys: Record<string, string> = { ...options.existingKeys };
    const errors: string[] = [];
    
    for (const sourceFile of options.sourceFiles) {
      try {
        const content = await fs.readFile(sourceFile, 'utf8');
        
        for (const regex of regexPatterns) {
          let match;
          while ((match = regex.exec(content)) !== null) {
            const key = match[1];
            
            if (!keys[key]) {
              keys[key] = key;
            }
          }
        }
      } catch (error) {
        errors.push(`Error reading ${sourceFile}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    
    // Write the keys to the output file if specified
    if (options.outputFile) {
      try {
        await writeTranslationFile(options.outputFile, keys, getFormatFromExtension(options.outputFile));
      } catch (error) {
        errors.push(`Error writing ${options.outputFile}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    
    return {
      success: errors.length === 0,
      message: errors.length === 0
        ? `Successfully extracted ${Object.keys(keys).length} translation keys`
        : `Extracted ${Object.keys(keys).length} translation keys with ${errors.length} errors`,
      keys,
      errors: errors.length > 0 ? errors : undefined,
    };
  } catch (error) {
    return {
      success: false,
      message: `Error extracting translation keys: ${error instanceof Error ? error.message : String(error)}`,
      keys: {},
      errors: [`Error extracting translation keys: ${error instanceof Error ? error.message : String(error)}`],
    };
  }
}

/**
 * Merge translation files
 * 
 * @param options Merge options
 * @returns Merge result
 */
export async function mergeTranslations(
  options: {
    sourceFiles: string[];
    outputFile: string;
    overwrite?: boolean;
  }
): Promise<{
  success: boolean;
  message: string;
  errors?: string[];
}> {
  try {
    // Default options
    const overwrite = options.overwrite === true;
    
    // Read and merge translations
    const mergedTranslations: Record<string, any> = {};
    const errors: string[] = [];
    
    for (const sourceFile of options.sourceFiles) {
      try {
        const format = getFormatFromExtension(sourceFile);
        const content = await fs.readFile(sourceFile, 'utf8');
        const translations = parseTranslationFile(content, format);
        
        // Merge translations
        for (const [key, value] of Object.entries(translations)) {
          if (!mergedTranslations[key] || overwrite) {
            mergedTranslations[key] = value;
          }
        }
      } catch (error) {
        errors.push(`Error reading ${sourceFile}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    
    // Write the merged translations to the output file
    try {
      await writeTranslationFile(options.outputFile, mergedTranslations, getFormatFromExtension(options.outputFile));
    } catch (error) {
      errors.push(`Error writing ${options.outputFile}: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    return {
      success: errors.length === 0,
      message: errors.length === 0
        ? `Successfully merged ${options.sourceFiles.length} translation files`
        : `Merged ${options.sourceFiles.length} translation files with ${errors.length} errors`,
      errors: errors.length > 0 ? errors : undefined,
    };
  } catch (error) {
    return {
      success: false,
      message: `Error merging translations: ${error instanceof Error ? error.message : String(error)}`,
      errors: [`Error merging translations: ${error instanceof Error ? error.message : String(error)}`],
    };
  }
}

/**
 * Write a translation file
 * 
 * @param filePath File path
 * @param translations Translations
 * @param format Output format
 */
async function writeTranslationFile(
  filePath: string,
  translations: Record<string, any>,
  format: string
): Promise<void> {
  let content: string;
  
  switch (format) {
    case 'json':
      content = JSON.stringify(translations, null, 2);
      break;
    case 'yaml':
      content = convertToYaml(translations);
      break;
    case 'js':
      content = `module.exports = ${JSON.stringify(translations, null, 2)};`;
      break;
    case 'ts':
      content = `export default ${JSON.stringify(translations, null, 2)} as const;`;
      break;
    default:
      content = JSON.stringify(translations, null, 2);
      break;
  }
  
  await fs.writeFile(filePath, content, 'utf8');
}

/**
 * Parse a translation file
 * 
 * @param content File content
 * @param format File format
 * @returns Parsed translations
 */
function parseTranslationFile(
  content: string,
  format: string
): Record<string, any> {
  switch (format) {
    case 'json':
      return JSON.parse(content);
    case 'yaml':
      return parseYaml(content);
    case 'js':
      // This is a simplified approach and not secure for production
      // eslint-disable-next-line no-eval
      return eval(`(${content.replace('module.exports = ', '')})`);
    case 'ts':
      // This is a simplified approach and not secure for production
      // eslint-disable-next-line no-eval
      return eval(`(${content.replace('export default ', '').replace(' as const;', '')})`);
    default:
      return JSON.parse(content);
  }
}

/**
 * Get the format from a file extension
 * 
 * @param filePath File path
 * @returns Format
 */
function getFormatFromExtension(filePath: string): string {
  const extension = path.extname(filePath).toLowerCase();
  
  switch (extension) {
    case '.json':
      return 'json';
    case '.yaml':
    case '.yml':
      return 'yaml';
    case '.js':
      return 'js';
    case '.ts':
      return 'ts';
    default:
      return 'json';
  }
}

/**
 * Convert an object to YAML
 * 
 * @param obj Object to convert
 * @returns YAML string
 */
function convertToYaml(obj: Record<string, any>): string {
  const lines: string[] = [];
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object' && value !== null) {
      lines.push(`${key}:`);
      const nestedYaml = convertToYaml(value);
      lines.push(nestedYaml.split('\n').map(line => `  ${line}`).join('\n'));
    } else {
      const formattedValue = typeof value === 'string'
        ? `"${value.replace(/"/g, '\\"')}"`
        : String(value);
      lines.push(`${key}: ${formattedValue}`);
    }
  }
  
  return lines.join('\n');
}

/**
 * Parse YAML
 * 
 * @param yaml YAML string
 * @returns Parsed object
 */
function parseYaml(yaml: string): Record<string, any> {
  // This is a very simplified YAML parser and not suitable for production
  const result: Record<string, any> = {};
  const lines = yaml.split('\n');
  
  let currentKey: string | null = null;
  let currentIndent = 0;
  let currentObject = result;
  const stack: Array<{ key: string; object: Record<string, any>; indent: number }> = [];
  
  for (const line of lines) {
    const trimmedLine = line.trimEnd();
    if (!trimmedLine || trimmedLine.startsWith('#')) {
      continue;
    }
    
    const indent = line.length - line.trimStart().length;
    const keyValueMatch = trimmedLine.match(/^(\S+):\s*(.*)$/);
    
    if (keyValueMatch) {
      const [, key, value] = keyValueMatch;
      
      if (indent < currentIndent) {
        while (stack.length > 0 && stack[stack.length - 1].indent >= indent) {
          const popped = stack.pop();
          if (popped && stack.length > 0) {
            currentObject = stack[stack.length - 1].object;
          } else {
            currentObject = result;
          }
        }
        currentIndent = indent;
      } else if (indent > currentIndent) {
        if (currentKey) {
          currentObject[currentKey] = {};
          stack.push({ key: currentKey, object: currentObject, indent: currentIndent });
          currentObject = currentObject[currentKey];
          currentIndent = indent;
        }
      }
      
      if (value.trim()) {
        // Handle quoted strings
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          currentObject[key] = value.slice(1, -1);
        } else if (value === 'true') {
          currentObject[key] = true;
        } else if (value === 'false') {
          currentObject[key] = false;
        } else if (value === 'null') {
          currentObject[key] = null;
        } else if (!isNaN(Number(value))) {
          currentObject[key] = Number(value);
        } else {
          currentObject[key] = value;
        }
        currentKey = null;
      } else {
        currentKey = key;
      }
    }
  }
  
  return result;
}

/**
 * Translate text using an external API
 * 
 * @param text Text to translate
 * @param sourceLocale Source locale
 * @param targetLocale Target locale
 * @param apiKey API key
 * @returns Translated text
 */
async function translateText(
  text: string,
  sourceLocale: string,
  targetLocale: string,
  apiKey: string
): Promise<string> {
  // This is a placeholder for an actual translation API integration
  // In a real implementation, you would use a service like Google Translate, DeepL, etc.
  
  // For now, we'll just return a placeholder
  return `[${targetLocale}] ${text}`;
}

/**
 * Handle generate_translations command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleGenerateTranslations(args: any) {
  try {
    const {
      sourceLocale,
      targetLocales,
      keys,
      keyValuePairs,
      outputFormat,
      outputDir,
      fileName,
      namespaces,
      placeholders,
      autoTranslate,
      apiKey,
    } = args;
    
    // Generate translations
    const result = await generateTranslations({
      sourceLocale,
      targetLocales,
      keys,
      keyValuePairs,
      outputFormat,
      outputDir,
      fileName,
      namespaces,
      placeholders,
      autoTranslate,
      apiKey,
    });
    
    if (result.success) {
      return {
        content: [{ 
          type: "text",
          text: `${result.message}\n\nGenerated files:\n${result.files.join('\n')}`
        }],
      };
    } else {
      return {
        content: [{ 
          type: "text",
          text: `${result.message}\n\nErrors:\n${result.errors?.join('\n')}`
        }],
        isError: true,
      };
    }
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error generating translations: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Handle extract_translation_keys command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleExtractTranslationKeys(args: any) {
  try {
    const {
      sourceFiles,
      patterns,
      outputFile,
      existingKeys,
    } = args;
    
    // Extract translation keys
    const result = await extractTranslationKeys({
      sourceFiles,
      patterns,
      outputFile,
      existingKeys,
    });
    
    if (result.success) {
      return {
        content: [{ 
          type: "text",
          text: `${result.message}\n\nExtracted keys:\n${JSON.stringify(result.keys, null, 2)}`
        }],
      };
    } else {
      return {
        content: [{ 
          type: "text",
          text: `${result.message}\n\nErrors:\n${result.errors?.join('\n')}`
        }],
        isError: true,
      };
    }
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error extracting translation keys: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Handle merge_translations command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleMergeTranslations(args: any) {
  try {
    const {
      sourceFiles,
      outputFile,
      overwrite,
    } = args;
    
    // Merge translations
    const result = await mergeTranslations({
      sourceFiles,
      outputFile,
      overwrite,
    });
    
    if (result.success) {
      return {
        content: [{ 
          type: "text",
          text: result.message
        }],
      };
    } else {
      return {
        content: [{ 
          type: "text",
          text: `${result.message}\n\nErrors:\n${result.errors?.join('\n')}`
        }],
        isError: true,
      };
    }
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error merging translations: ${error}` }],
      isError: true,
    };
  }
}
