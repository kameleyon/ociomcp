/**
 * Markdown Tool
 * 
 * Converts content between formats (HTML, plain text) to Markdown
 * Ensures consistent Markdown styling
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { z } from 'zod';

/**
 * Schema for MarkdownTool
 */
export const ConvertToMarkdownSchema = z.object({
  content: z.string(),
  sourceFormat: z.enum(['html', 'text', 'json']).default('html'),
  options: z.object({
    headingStyle: z.enum(['atx', 'setext']).default('atx'),
    bulletListMarker: z.enum(['*', '-', '+']).default('-'),
    codeBlockStyle: z.enum(['fenced', 'indented']).default('fenced'),
    fence: z.enum(['```', '~~~']).default('```'),
    emDelimiter: z.enum(['*', '_']).default('*'),
    strongDelimiter: z.enum(['**', '__']).default('**'),
    linkStyle: z.enum(['inlined', 'referenced']).default('inlined'),
    includeImageAlt: z.boolean().default(true),
  }).optional(),
});

export const FormatMarkdownSchema = z.object({
  path: z.string(),
  options: z.object({
    headingStyle: z.enum(['atx', 'setext']).default('atx'),
    bulletListMarker: z.enum(['*', '-', '+']).default('-'),
    codeBlockStyle: z.enum(['fenced', 'indented']).default('fenced'),
    fence: z.enum(['```', '~~~']).default('```'),
    emDelimiter: z.enum(['*', '_']).default('*'),
    strongDelimiter: z.enum(['**', '__']).default('**'),
    linkStyle: z.enum(['inlined', 'referenced']).default('inlined'),
    includeImageAlt: z.boolean().default(true),
  }).optional(),
});

/**
 * Converts HTML to Markdown
 * 
 * @param html HTML content to convert
 * @param options Conversion options
 * @returns Markdown content
 */
function htmlToMarkdown(html: string, options: any = {}): string {
  // In a real implementation, we would use a library like turndown
  // Here, we'll implement a simple version
  
  let markdown = html;
  
  // Replace <h1> - <h6> tags
  if (options.headingStyle === 'atx') {
    markdown = markdown.replace(/<h1>(.*?)<\/h1>/gi, '# $1');
    markdown = markdown.replace(/<h2>(.*?)<\/h2>/gi, '## $1');
    markdown = markdown.replace(/<h3>(.*?)<\/h3>/gi, '### $1');
    markdown = markdown.replace(/<h4>(.*?)<\/h4>/gi, '#### $1');
    markdown = markdown.replace(/<h5>(.*?)<\/h5>/gi, '##### $1');
    markdown = markdown.replace(/<h6>(.*?)<\/h6>/gi, '###### $1');
  } else {
    markdown = markdown.replace(/<h1>(.*?)<\/h1>/gi, '$1\n==========');
    markdown = markdown.replace(/<h2>(.*?)<\/h2>/gi, '$1\n----------');
    markdown = markdown.replace(/<h3>(.*?)<\/h3>/gi, '### $1');
    markdown = markdown.replace(/<h4>(.*?)<\/h4>/gi, '#### $1');
    markdown = markdown.replace(/<h5>(.*?)<\/h5>/gi, '##### $1');
    markdown = markdown.replace(/<h6>(.*?)<\/h6>/gi, '###### $1');
  }
  
  // Replace <p> tags
  markdown = markdown.replace(/<p>(.*?)<\/p>/gi, '$1\n\n');
  
  // Replace <br> tags
  markdown = markdown.replace(/<br\s*\/?>/gi, '\n');
  
  // Replace <strong> or <b> tags
  const strongDelimiter = options.strongDelimiter || '**';
  markdown = markdown.replace(/<(strong|b)>(.*?)<\/(strong|b)>/gi, `${strongDelimiter}$2${strongDelimiter}`);
  
  // Replace <em> or <i> tags
  const emDelimiter = options.emDelimiter || '*';
  markdown = markdown.replace(/<(em|i)>(.*?)<\/(em|i)>/gi, `${emDelimiter}$2${emDelimiter}`);
  
  // Replace <a> tags
  if (options.linkStyle === 'inlined') {
    markdown = markdown.replace(/<a href="(.*?)">(.*?)<\/a>/gi, '[$2]($1)');
  } else {
    // For referenced links, we would need to collect all links and add them at the end
    // This is a simplified version
    markdown = markdown.replace(/<a href="(.*?)">(.*?)<\/a>/gi, '[$2][$2]\n\n[$2]: $1');
  }
  
  // Replace <img> tags
  if (options.includeImageAlt) {
    markdown = markdown.replace(/<img src="(.*?)" alt="(.*?)".*?>/gi, '![$2]($1)');
  } else {
    markdown = markdown.replace(/<img src="(.*?)".*?>/gi, '![]($1)');
  }
  
  // Replace <ul> and <li> tags
  const bulletListMarker = options.bulletListMarker || '-';
  markdown = markdown.replace(/<ul>(.*?)<\/ul>/gis, (match, p1) => {
    return p1.replace(/<li>(.*?)<\/li>/gi, `${bulletListMarker} $1\n`);
  });
  
  // Replace <ol> and <li> tags
  markdown = markdown.replace(/<ol>(.*?)<\/ol>/gis, (match, p1) => {
    let index = 1;
    return p1.replace(/<li>(.*?)<\/li>/gi, () => {
      return `${index++}. $1\n`;
    });
  });
  
  // Replace <code> tags
  if (options.codeBlockStyle === 'fenced') {
    const fence = options.fence || '```';
    markdown = markdown.replace(/<pre><code>(.*?)<\/code><\/pre>/gis, `${fence}\n$1\n${fence}`);
    markdown = markdown.replace(/<code>(.*?)<\/code>/gi, '`$1`');
  } else {
    markdown = markdown.replace(/<pre><code>(.*?)<\/code><\/pre>/gis, (match, p1) => {
      return p1.split('\n').map((line: string) => `    ${line}`).join('\n');
    });
    markdown = markdown.replace(/<code>(.*?)<\/code>/gi, '`$1`');
  }
  
  // Replace <blockquote> tags
  markdown = markdown.replace(/<blockquote>(.*?)<\/blockquote>/gis, (match, p1) => {
    return p1.split('\n').map((line: string) => `> ${line}`).join('\n');
  });
  
  // Replace <hr> tags
  markdown = markdown.replace(/<hr\s*\/?>/gi, '---\n\n');
  
  // Remove all other HTML tags
  markdown = markdown.replace(/<[^>]*>/g, '');
  
  // Decode HTML entities
  markdown = markdown.replace(/&lt;/g, '<');
  markdown = markdown.replace(/&gt;/g, '>');
  markdown = markdown.replace(/&amp;/g, '&');
  markdown = markdown.replace(/&quot;/g, '"');
  markdown = markdown.replace(/&#39;/g, "'");
  
  // Clean up extra whitespace
  markdown = markdown.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  return markdown;
}

/**
 * Converts plain text to Markdown
 * 
 * @param text Plain text content to convert
 * @param options Conversion options
 * @returns Markdown content
 */
function textToMarkdown(text: string, options: any = {}): string {
  // In a real implementation, we would use more sophisticated text analysis
  // Here, we'll implement a simple version that looks for common patterns
  
  let markdown = text;
  
  // Detect and convert headings (lines followed by blank lines)
  const lines = markdown.split('\n');
  const newLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const nextLine = i < lines.length - 1 ? lines[i + 1] : '';
    const prevLine = i > 0 ? lines[i - 1] : '';
    
    // Check for potential headings (short lines followed by blank lines)
    if (line.trim().length > 0 && line.trim().length <= 50 && 
        nextLine.trim().length === 0 && prevLine.trim().length === 0) {
      if (options.headingStyle === 'atx') {
        newLines.push(`# ${line}`);
      } else {
        newLines.push(line);
        newLines.push('='.repeat(line.length));
      }
    } else {
      newLines.push(line);
    }
  }
  
  markdown = newLines.join('\n');
  
    // Detect and convert bullet points (lines starting with * or - or •)
    const bulletListMarker = options.bulletListMarker || '-';
    markdown = markdown.replace(/^(\s*)[\*\-\•]\s+(.+)$/gm, `$1${bulletListMarker} $2`);
  
  // Detect and convert numbered lists (lines starting with 1., 2., etc.)
  markdown = markdown.replace(/^\s*(\d+)\.\s+(.+)$/gm, '$1. $2');
  
  // Detect and convert URLs
  markdown = markdown.replace(/(\s|^)(https?:\/\/[^\s]+)(\s|$)/g, '$1<$2>$3');
  
  // Detect and convert emphasized text (text between * or _)
  const emDelimiter = options.emDelimiter || '*';
  markdown = markdown.replace(/(\s|^)\*([^\*]+)\*(\s|$)/g, `$1${emDelimiter}$2${emDelimiter}$3`);
  markdown = markdown.replace(/(\s|^)_([^_]+)_(\s|$)/g, `$1${emDelimiter}$2${emDelimiter}$3`);
  
  // Detect and convert strong text (text between ** or __)
  const strongDelimiter = options.strongDelimiter || '**';
  markdown = markdown.replace(/(\s|^)\*\*([^\*]+)\*\*(\s|$)/g, `$1${strongDelimiter}$2${strongDelimiter}$3`);
  markdown = markdown.replace(/(\s|^)__([^_]+)__(\s|$)/g, `$1${strongDelimiter}$2${strongDelimiter}$3`);
  
  return markdown;
}

/**
 * Converts JSON to Markdown
 * 
 * @param jsonContent JSON content to convert
 * @param options Conversion options
 * @returns Markdown content
 */
function jsonToMarkdown(jsonContent: string, options: any = {}): string {
  try {
    const data = JSON.parse(jsonContent);
    return objectToMarkdown(data, options);
  } catch (error) {
    return `Error parsing JSON: ${error instanceof Error ? error.message : String(error)}`;
  }
}

/**
 * Converts a JavaScript object to Markdown
 * 
 * @param obj Object to convert
 * @param options Conversion options
 * @param level Current nesting level
 * @returns Markdown content
 */
function objectToMarkdown(obj: any, options: any = {}, level: number = 1): string {
  if (obj === null || obj === undefined) {
    return 'null';
  }
  
  if (typeof obj !== 'object') {
    return String(obj);
  }
  
  if (Array.isArray(obj)) {
    const bulletListMarker = options.bulletListMarker || '-';
    return obj.map(item => `${bulletListMarker} ${objectToMarkdown(item, options, level + 1)}`).join('\n');
  }
  
  const headingPrefix = '#'.repeat(Math.min(level, 6)) + ' ';
  const result: string[] = [];
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object' && value !== null) {
      result.push(`${headingPrefix}${key}\n\n${objectToMarkdown(value, options, level + 1)}`);
    } else {
      result.push(`${headingPrefix}${key}\n\n${value}`);
    }
  }
  
  return result.join('\n\n');
}

/**
 * Formats a Markdown file according to the specified options
 * 
 * @param filePath Path to the Markdown file
 * @param options Formatting options
 * @returns Object indicating success or failure with messages
 */
export async function formatMarkdown(
  filePath: string,
  options: any = {}
): Promise<{ success: boolean, message: string, output?: string }> {
  try {
    // Normalize the file path
    filePath = path.resolve(filePath);
    
    // Check if the file exists
    try {
      await fs.access(filePath, fs.constants.F_OK);
    } catch (error) {
      return { 
        success: false, 
        message: `File does not exist: ${filePath}` 
      };
    }
    
    // Read the file content
    const content = await fs.readFile(filePath, 'utf8');
    
    // Format the Markdown
    const formattedContent = formatMarkdownContent(content, options);
    
    // Check if content has changed
    if (content === formattedContent) {
      return {
        success: true,
        message: `File is already formatted according to the specified style.`
      };
    }
    
    // Write the formatted content back to the file
    await fs.writeFile(filePath, formattedContent, 'utf8');
    
    return {
      success: true,
      message: `File formatted successfully.`
    };
  } catch (error) {
    return {
      success: false,
      message: `Error formatting file: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * Formats Markdown content according to the specified options
 * 
 * @param content Markdown content to format
 * @param options Formatting options
 * @returns Formatted Markdown content
 */
function formatMarkdownContent(content: string, options: any = {}): string {
  let formatted = content;
  
  // Format headings
  if (options.headingStyle === 'atx') {
    // Convert setext headings to ATX
    formatted = formatted.replace(/^(.+)\n=+\s*$/gm, '# $1');
    formatted = formatted.replace(/^(.+)\n-+\s*$/gm, '## $1');
    
    // Ensure consistent ATX headings (no trailing #)
    formatted = formatted.replace(/^(#+)\s*(.+?)\s*#+\s*$/gm, '$1 $2');
  } else if (options.headingStyle === 'setext') {
    // Convert ATX headings to setext (only for h1 and h2)
    formatted = formatted.replace(/^# (.+)$/gm, (match, p1) => {
      return `${p1}\n${'='.repeat(p1.length)}`;
    });
    formatted = formatted.replace(/^## (.+)$/gm, (match, p1) => {
      return `${p1}\n${'-'.repeat(p1.length)}`;
    });
  }
  
  // Format bullet lists
  const bulletListMarker = options.bulletListMarker || '-';
  formatted = formatted.replace(/^(\s*)[\*\-\+]\s+/gm, `$1${bulletListMarker} `);
  
  // Format code blocks
  if (options.codeBlockStyle === 'fenced') {
    const fence = options.fence || '```';
    // Convert indented code blocks to fenced
    formatted = formatted.replace(/(?:^|\n)((?: {4}|\t).*(?:\n|$))+/g, (match) => {
      const code = match.replace(/^(?: {4}|\t)/gm, '');
      return `\n${fence}\n${code}${fence}\n`;
    });
    
    // Ensure consistent fence style
    formatted = formatted.replace(/^```|~~~$/gm, fence);
  } else if (options.codeBlockStyle === 'indented') {
    // Convert fenced code blocks to indented
    formatted = formatted.replace(/(?:^|\n)(?:```|~~~).*\n([\s\S]*?)(?:^|\n)(?:```|~~~)(?:\n|$)/g, (match, p1) => {
      return p1.split('\n').map((line: string) => `    ${line}`).join('\n');
    });
  }
  
  // Format emphasis
  const emDelimiter = options.emDelimiter || '*';
  formatted = formatted.replace(/(\*|_)(.*?)\1/g, `${emDelimiter}$2${emDelimiter}`);
  
  // Format strong emphasis
  const strongDelimiter = options.strongDelimiter || '**';
  formatted = formatted.replace(/(\*\*|__)(.*?)\1/g, `${strongDelimiter}$2${strongDelimiter}`);
  
  // Format links
  if (options.linkStyle === 'inlined') {
    // Convert reference links to inline links
    const referenceLinks: Record<string, string> = {};
    
    // Extract reference link definitions
    formatted = formatted.replace(/^\[([^\]]+)\]:\s*(.+)$/gm, (match, p1, p2) => {
      referenceLinks[p1] = p2;
      return '';
    });
    
    // Replace reference links with inline links
    formatted = formatted.replace(/\[([^\]]+)\]\[([^\]]*)\]/g, (match, p1, p2) => {
      const ref = p2 || p1;
      const url = referenceLinks[ref] || '';
      return `[${p1}](${url})`;
    });
  } else if (options.linkStyle === 'referenced') {
    // Convert inline links to reference links
    const inlineLinks: Record<string, string> = {};
    let linkCounter = 1;
    
    // Extract inline links
    formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, p1, p2) => {
      const ref = p1.toLowerCase().replace(/\s+/g, '-');
      inlineLinks[ref] = p2;
      return `[${p1}][${ref}]`;
    });
    
    // Add reference link definitions at the end
    formatted = formatted.trim() + '\n\n';
    for (const [ref, url] of Object.entries(inlineLinks)) {
      formatted += `[${ref}]: ${url}\n`;
    }
  }
  
  return formatted;
}

/**
 * Converts content to Markdown
 * 
 * @param content Content to convert
 * @param sourceFormat Source format of the content
 * @param options Conversion options
 * @returns Markdown content
 */
export function convertToMarkdown(
  content: string,
  sourceFormat: 'html' | 'text' | 'json' = 'html',
  options: any = {}
): string {
  switch (sourceFormat) {
    case 'html':
      return htmlToMarkdown(content, options);
    case 'text':
      return textToMarkdown(content, options);
    case 'json':
      return jsonToMarkdown(content, options);
    default:
      return content;
  }
}

/**
 * Handle convert_to_markdown command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleConvertToMarkdown(args: any): Promise<{
  content: Array<{ type: string; text: string }>;
  isError?: boolean;
}> {
  try {
    const { content, sourceFormat, options } = args;
    
    // Convert the content to Markdown
    const markdown = convertToMarkdown(content, sourceFormat, options);
    
    return {
      content: [{ 
        type: "text",
        text: markdown
      }],
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error converting to Markdown: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Handle format_markdown command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleFormatMarkdown(args: any): Promise<{
  content: Array<{ type: string; text: string }>;
  isError?: boolean;
}> {
  try {
    const { path, options } = args;
    
    // Format the Markdown file
    const result = await formatMarkdown(path, options);
    
    if (result.success) {
      return {
        content: [{ 
          type: "text",
          text: result.output
            ? `${result.message}\n\n${result.output}`
            : result.message
        }],
      };
    } else {
      return {
        content: [{ 
          type: "text",
          text: result.output
            ? `${result.message}\n\n${result.output}`
            : result.message
        }],
        isError: true,
      };
    }
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error formatting Markdown: ${error}` }],
      isError: true,
    };
  }
}
