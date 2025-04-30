// Auto-generated safe fallback for file-monitor

export function activate() {
    console.log("[TOOL] file-monitor activated (passive mode)");
}

export function onFileWrite(filePath: string, content: string) {
  console.log(`[TOOL] File monitor processing file: ${filePath}`);
  
  // Get file size in bytes
  const fileSize = Buffer.from(content).length;
  const fileType = getFileType(filePath);
  const severity = getFileSizeSeverity(fileType, fileSize);
  
  // Log file size information
  console.log(`[TOOL] File size: ${formatFileSize(fileSize)} (${severity})`);
  
  // Provide suggestions if file size exceeds warning threshold
  if (severity !== FileSizeSeverity.OK) {
    const thresholds = FILE_SIZE_THRESHOLDS[fileType];
    console.log(`[TOOL] File size exceeds recommended threshold of ${formatFileSize(thresholds.warning)}`);
    
    // Generate specific suggestions based on file type
    const suggestions = generateFileSizeSuggestions(fileType, filePath, fileSize);
    if (suggestions.length > 0) {
      console.log('[TOOL] Optimization suggestions:');
      suggestions.forEach(suggestion => console.log(`- ${suggestion}`));
    }
  }
}

export function onSessionStart(sessionId: string) {
  console.log(`[TOOL] File monitor initialized for session: ${sessionId}`);
  
  // Schedule a file size analysis for the project
  setTimeout(() => {
    console.log('[TOOL] Running project-wide file size analysis...');
    analyzeProjectFileSizes();
  }, 3000); // Delay to ensure project files are loaded
}

export function onCommand(command: string, args: any[]) {
  if (command === 'analyze-file-sizes') {
    console.log('[TOOL] Running file size analysis...');
    
    // If a specific path is provided, analyze only that path
    const path = args[0] || '.';
    const result = analyzeProjectFileSizes(path);
    
    return result;
  } else if (command === 'suggest-optimizations') {
    const filePath = args[0];
    const fileContent = args[1];
    
    if (!filePath || !fileContent) {
      return { error: 'File path and content are required' };
    }
    
    const fileType = getFileType(filePath);
    const fileSize = Buffer.from(fileContent).length;
    
    // Generate specific suggestions
    if (fileType === FileType.JAVASCRIPT || fileType === FileType.TYPESCRIPT) {
      return suggestCodeSplitting(filePath, fileContent);
    } else if (fileType === FileType.CSS) {
      return suggestCssOptimizations(filePath, fileContent);
    } else {
      const suggestions = generateFileSizeSuggestions(fileType, filePath, fileSize);
      return { suggestions };
    }
  }
  
  return null;
}

/**
 * Generates file size optimization suggestions based on file type
 */
function generateFileSizeSuggestions(fileType: FileType, filePath: string, fileSize: number): string[] {
  const suggestions: string[] = [];
  
  switch (fileType) {
    case FileType.JAVASCRIPT:
    case FileType.TYPESCRIPT:
      suggestions.push(
        'Consider code splitting to reduce initial load time',
        'Use tree shaking to eliminate unused code',
        'Minify the code to reduce file size',
        'Consider using dynamic imports for components not needed immediately'
      );
      break;
    
    case FileType.CSS:
      suggestions.push(
        'Remove unused CSS rules',
        'Consider using a CSS preprocessor to better organize styles',
        'Use CSS minification',
        'Consider CSS-in-JS or CSS Modules to scope styles'
      );
      break;
    
    case FileType.HTML:
      suggestions.push(
        'Minify HTML',
        'Remove unnecessary comments and whitespace',
        'Consider using lazy loading for images and scripts'
      );
      break;
    
    case FileType.IMAGE:
      suggestions.push(
        'Compress the image using tools like ImageOptim or TinyPNG',
        'Consider using WebP format for better compression',
        'Use responsive images with srcset to serve appropriate sizes',
        'Consider lazy loading for images not in the initial viewport'
      );
      break;
    
    case FileType.JSON:
      suggestions.push(
        'Remove unnecessary fields',
        'Consider paginating or chunking large JSON data',
        'Use a more efficient data format for large datasets'
      );
      break;
    
    default:
      suggestions.push(
        'Consider compressing the file',
        'Check if the file contains unnecessary data that can be removed'
      );
  }
  
  return suggestions;
}

/**
 * Analyzes file sizes for the entire project or a specific path
 */
function analyzeProjectFileSizes(path: string = '.'): any {
  // This is a placeholder - in a real implementation, this would scan the filesystem
  // For now, we'll just return a mock report
  
  console.log(`[TOOL] Analyzing file sizes in path: ${path}`);
  
  // Mock file list for demonstration
  const mockFiles = [
    { path: 'src/index.js', size: 50 * 1024, lastModified: new Date() },
    { path: 'src/components/App.js', size: 120 * 1024, lastModified: new Date() },
    { path: 'src/styles/main.css', size: 80 * 1024, lastModified: new Date() },
    { path: 'public/images/banner.jpg', size: 2 * 1024 * 1024, lastModified: new Date() },
    { path: 'data/config.json', size: 30 * 1024, lastModified: new Date() },
  ];
  
  // Generate report
  const report = analyzeFileSizes(mockFiles);
  
  // Log summary
  console.log(`[TOOL] Total size: ${formatFileSize(report.totalSize)}`);
  console.log(`[TOOL] Total files: ${report.totalFiles}`);
  console.log(`[TOOL] Large files: ${report.largeFiles.length}`);
  
  if (report.largeFiles.length > 0) {
    console.log('[TOOL] Large files:');
    report.largeFiles.forEach(file => {
      console.log(`- ${file.path}: ${formatFileSize(file.size)} (${file.severity})`);
    });
  }
  
  if (report.suggestions.length > 0) {
    console.log('[TOOL] Suggestions:');
    report.suggestions.forEach(suggestion => {
      console.log(`- ${suggestion}`);
    });
  }
  
  return report;
}
/**
 * File Monitor
 * Provides functionality for monitoring file sizes and suggesting optimizations
 */

/**
 * File size threshold definitions
 */
export enum FileSizeThreshold {
  SMALL = 10 * 1024, // 10 KB
  MEDIUM = 100 * 1024, // 100 KB
  LARGE = 1024 * 1024, // 1 MB
  VERY_LARGE = 5 * 1024 * 1024, // 5 MB
}

/**
 * File type definitions
 */
export enum FileType {
  JAVASCRIPT = 'javascript',
  TYPESCRIPT = 'typescript',
  CSS = 'css',
  HTML = 'html',
  JSON = 'json',
  MARKDOWN = 'markdown',
  IMAGE = 'image',
  FONT = 'font',
  VIDEO = 'video',
  AUDIO = 'audio',
  OTHER = 'other',
}

/**
 * File size severity levels
 */
export enum FileSizeSeverity {
  OK = 'ok',
  WARNING = 'warning',
  CRITICAL = 'critical',
}

/**
 * File information
 */
export interface FileInfo {
  path: string;
  size: number;
  type: FileType;
  lastModified?: Date;
  severity: FileSizeSeverity;
}

/**
 * File size report
 */
export interface FileSizeReport {
  totalSize: number;
  totalFiles: number;
  largeFiles: FileInfo[];
  filesByType: Record<FileType, { count: number; size: number }>;
  suggestions: string[];
}

/**
 * File size thresholds by type
 */
export const FILE_SIZE_THRESHOLDS: Record<FileType, { warning: number; critical: number }> = {
  [FileType.JAVASCRIPT]: {
    warning: 100 * 1024, // 100 KB
    critical: 500 * 1024, // 500 KB
  },
  [FileType.TYPESCRIPT]: {
    warning: 100 * 1024, // 100 KB
    critical: 500 * 1024, // 500 KB
  },
  [FileType.CSS]: {
    warning: 50 * 1024, // 50 KB
    critical: 250 * 1024, // 250 KB
  },
  [FileType.HTML]: {
    warning: 50 * 1024, // 50 KB
    critical: 250 * 1024, // 250 KB
  },
  [FileType.JSON]: {
    warning: 100 * 1024, // 100 KB
    critical: 1024 * 1024, // 1 MB
  },
  [FileType.MARKDOWN]: {
    warning: 100 * 1024, // 100 KB
    critical: 500 * 1024, // 500 KB
  },
  [FileType.IMAGE]: {
    warning: 1024 * 1024, // 1 MB
    critical: 5 * 1024 * 1024, // 5 MB
  },
  [FileType.FONT]: {
    warning: 1024 * 1024, // 1 MB
    critical: 2 * 1024 * 1024, // 2 MB
  },
  [FileType.VIDEO]: {
    warning: 10 * 1024 * 1024, // 10 MB
    critical: 50 * 1024 * 1024, // 50 MB
  },
  [FileType.AUDIO]: {
    warning: 5 * 1024 * 1024, // 5 MB
    critical: 20 * 1024 * 1024, // 20 MB
  },
  [FileType.OTHER]: {
    warning: 1024 * 1024, // 1 MB
    critical: 10 * 1024 * 1024, // 10 MB
  },
};

/**
 * Determines the file type based on the file extension
 */
export function getFileType(filePath: string): FileType {
  const extension = filePath.split('.').pop()?.toLowerCase() || '';
  
  switch (extension) {
    case 'js':
    case 'jsx':
    case 'mjs':
      return FileType.JAVASCRIPT;
    case 'ts':
    case 'tsx':
      return FileType.TYPESCRIPT;
    case 'css':
    case 'scss':
    case 'sass':
    case 'less':
      return FileType.CSS;
    case 'html':
    case 'htm':
    case 'xhtml':
      return FileType.HTML;
    case 'json':
      return FileType.JSON;
    case 'md':
    case 'markdown':
      return FileType.MARKDOWN;
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'svg':
    case 'webp':
    case 'ico':
      return FileType.IMAGE;
    case 'woff':
    case 'woff2':
    case 'ttf':
    case 'otf':
    case 'eot':
      return FileType.FONT;
    case 'mp4':
    case 'webm':
    case 'ogv':
    case 'mov':
      return FileType.VIDEO;
    case 'mp3':
    case 'ogg':
    case 'wav':
    case 'flac':
      return FileType.AUDIO;
    default:
      return FileType.OTHER;
  }
}

/**
 * Determines the severity of a file size based on its type and size
 */
export function getFileSizeSeverity(fileType: FileType, size: number): FileSizeSeverity {
  const thresholds = FILE_SIZE_THRESHOLDS[fileType];
  
  if (size >= thresholds.critical) {
    return FileSizeSeverity.CRITICAL;
  } else if (size >= thresholds.warning) {
    return FileSizeSeverity.WARNING;
  } else {
    return FileSizeSeverity.OK;
  }
}

/**
 * Formats a file size in a human-readable format
 */
export function formatFileSize(size: number): string {
  if (size < 1024) {
    return `${size} B`;
  } else if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KB`;
  } else if (size < 1024 * 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  } else {
    return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }
}

/**
 * Analyzes a list of files and generates a file size report
 */
export function analyzeFileSizes(files: { path: string; size: number; lastModified?: Date }[]): FileSizeReport {
  // Initialize report
  const report: FileSizeReport = {
    totalSize: 0,
    totalFiles: files.length,
    largeFiles: [],
    filesByType: Object.values(FileType).reduce((acc, type) => {
      acc[type] = { count: 0, size: 0 };
      return acc;
    }, {} as Record<FileType, { count: number; size: number }>),
    suggestions: [],
  };
  
  // Process each file
  for (const file of files) {
    const fileType = getFileType(file.path);
    const severity = getFileSizeSeverity(fileType, file.size);
    
    // Update total size
    report.totalSize += file.size;
    
    // Update files by type
    report.filesByType[fileType].count += 1;
    report.filesByType[fileType].size += file.size;
    
    // Add to large files if warning or critical
    if (severity !== FileSizeSeverity.OK) {
      report.largeFiles.push({
        path: file.path,
        size: file.size,
        type: fileType,
        lastModified: file.lastModified,
        severity,
      });
    }
  }
  
  // Sort large files by size (descending)
  report.largeFiles.sort((a, b) => b.size - a.size);
  
  // Generate suggestions
  report.suggestions = generateSuggestions(report);
  
  return report;
}

/**
 * Generates suggestions for optimizing file sizes
 */
function generateSuggestions(report: FileSizeReport): string[] {
  const suggestions: string[] = [];
  
  // Check for large JavaScript/TypeScript files
  const jsFiles = report.largeFiles.filter(file => 
    file.type === FileType.JAVASCRIPT || file.type === FileType.TYPESCRIPT
  );
  
  if (jsFiles.length > 0) {
    suggestions.push(
      'Consider code splitting for large JavaScript/TypeScript files to improve load times.',
      'Use dynamic imports for components that are not needed on initial page load.',
      'Implement lazy loading for routes and components.',
    );
    
    // Specific suggestions for very large files
    const veryLargeJsFiles = jsFiles.filter(file => file.size > FileSizeThreshold.LARGE);
    if (veryLargeJsFiles.length > 0) {
      suggestions.push(
        `Consider refactoring these large files into smaller modules: ${veryLargeJsFiles.slice(0, 3).map(f => f.path).join(', ')}${veryLargeJsFiles.length > 3 ? ', ...' : ''}`,
      );
    }
  }
  
  // Check for large CSS files
  const cssFiles = report.largeFiles.filter(file => file.type === FileType.CSS);
  if (cssFiles.length > 0) {
    suggestions.push(
      'Consider using CSS-in-JS or CSS Modules to scope styles and reduce duplication.',
      'Implement critical CSS extraction to improve initial load times.',
      'Use a CSS preprocessor like SASS or LESS to better organize your styles.',
    );
  }
  
  // Check for large image files
  const imageFiles = report.largeFiles.filter(file => file.type === FileType.IMAGE);
  if (imageFiles.length > 0) {
    suggestions.push(
      'Optimize images using tools like ImageOptim, TinyPNG, or Sharp.',
      'Consider using WebP format for better compression.',
      'Implement responsive images with srcset to serve appropriate sizes.',
      'Use lazy loading for images that are not in the initial viewport.',
    );
    
    // Specific suggestions for very large images
    const veryLargeImages = imageFiles.filter(file => file.size > FileSizeThreshold.VERY_LARGE);
    if (veryLargeImages.length > 0) {
      suggestions.push(
        `These images are particularly large and should be optimized: ${veryLargeImages.slice(0, 3).map(f => f.path).join(', ')}${veryLargeImages.length > 3 ? ', ...' : ''}`,
      );
    }
  }
  
  // Check for large font files
  const fontFiles = report.largeFiles.filter(file => file.type === FileType.FONT);
  if (fontFiles.length > 0) {
    suggestions.push(
      'Consider using variable fonts to reduce the number of font files.',
      'Use font-display: swap to improve perceived performance.',
      'Consider using system fonts or Google Fonts with font-display: swap.',
    );
  }
  
  // Check for large video files
  const videoFiles = report.largeFiles.filter(file => file.type === FileType.VIDEO);
  if (videoFiles.length > 0) {
    suggestions.push(
      'Use video compression tools to reduce file sizes.',
      'Consider using a video hosting service like YouTube or Vimeo.',
      'Implement lazy loading for videos that are not in the initial viewport.',
    );
  }
  
  // Check for large JSON files
  const jsonFiles = report.largeFiles.filter(file => file.type === FileType.JSON);
  if (jsonFiles.length > 0) {
    suggestions.push(
      'Consider paginating or chunking large JSON data.',
      'Use a more efficient data format like Protocol Buffers or MessagePack.',
      'Implement data compression for large JSON payloads.',
    );
  }
  
  // General suggestions
  if (report.totalSize > 10 * 1024 * 1024) { // 10 MB
    suggestions.push(
      'Implement code splitting and lazy loading to reduce initial bundle size.',
      'Use tree shaking to eliminate unused code.',
      'Consider implementing server-side rendering or static site generation.',
      'Use a CDN for static assets to improve load times.',
    );
  }
  
  return [...new Set(suggestions)]; // Remove duplicates
}

/**
 * Generates a markdown report of file sizes
 */
export function generateFileSizeReport(report: FileSizeReport): string {
  let markdown = '# File Size Report\n\n';
  
  // Add summary
  markdown += '## Summary\n\n';
  markdown += `- Total size: ${formatFileSize(report.totalSize)}\n`;
  markdown += `- Total files: ${report.totalFiles}\n`;
  markdown += `- Large files: ${report.largeFiles.length}\n\n`;
  
  // Add files by type
  markdown += '## Files by Type\n\n';
  markdown += '| Type | Count | Size |\n';
  markdown += '|------|-------|------|\n';
  
  for (const [type, { count, size }] of Object.entries(report.filesByType)) {
    if (count > 0) {
      markdown += `| ${type} | ${count} | ${formatFileSize(size)} |\n`;
    }
  }
  
  markdown += '\n';
  
  // Add large files
  if (report.largeFiles.length > 0) {
    markdown += '## Large Files\n\n';
    markdown += '| Path | Type | Size | Severity |\n';
    markdown += '|------|------|------|----------|\n';
    
    for (const file of report.largeFiles) {
      markdown += `| ${file.path} | ${file.type} | ${formatFileSize(file.size)} | ${file.severity} |\n`;
    }
    
    markdown += '\n';
  }
  
  // Add suggestions
  if (report.suggestions.length > 0) {
    markdown += '## Suggestions\n\n';
    
    for (const suggestion of report.suggestions) {
      markdown += `- ${suggestion}\n`;
    }
  }
  
  return markdown;
}

/**
 * Suggests code splitting for a large JavaScript/TypeScript file
 */
export function suggestCodeSplitting(filePath: string, fileContent: string): string {
  // Simple heuristic: look for React components or functions that could be split
  const componentMatches = fileContent.match(/(?:export\s+(?:default\s+)?(?:function|const)\s+(\w+)|class\s+(\w+)\s+extends\s+React\.Component)/g) || [];
  
  if (componentMatches.length <= 1) {
    return 'This file does not contain multiple components that can be easily split.';
  }
  
  let suggestion = `The file "${filePath}" contains multiple components that could be split into separate files:\n\n`;
  
  // Extract component names
  const componentNames = componentMatches.map(match => {
    const nameMatch = match.match(/(?:function|const|class)\s+(\w+)/) || [];
    return nameMatch[1] || 'UnknownComponent';
  });
  
  // Add suggestions for each component
  for (const name of componentNames) {
    suggestion += `- Move ${name} to a separate file: ${filePath.replace(/\.\w+$/, '')}-${name.toLowerCase()}.${filePath.split('.').pop()}\n`;
  }
  
  // Add dynamic import example
  suggestion += '\nConsider using dynamic imports for components that are not needed immediately:\n\n';
  suggestion += '```javascript\n';
  suggestion += `// Instead of: import { ${componentNames[0]} } from './${filePath}';\n\n`;
  suggestion += `// Use dynamic import:\nconst ${componentNames[0]} = React.lazy(() => import('./${filePath.replace(/\.\w+$/, '')}-${componentNames[0].toLowerCase()}'));\n\n`;
  suggestion += '// Then use with Suspense:\n';
  suggestion += '<React.Suspense fallback={<div>Loading...</div>}>\n';
  suggestion += `  <${componentNames[0]} />\n`;
  suggestion += '</React.Suspense>\n';
  suggestion += '```\n';
  
  return suggestion;
}

/**
 * Suggests optimizations for a large CSS file
 */
export function suggestCssOptimizations(filePath: string, fileContent: string): string {
  // Count selectors and rules
  const selectorCount = (fileContent.match(/[^}]*{/g) || []).length;
  const mediaQueryCount = (fileContent.match(/@media/g) || []).length;
  
  let suggestion = `The CSS file "${filePath}" contains ${selectorCount} selectors and ${mediaQueryCount} media queries.\n\n`;
  
  // Check for potential issues
  const hasImportant = fileContent.includes('!important');
  const hasDeepNesting = fileContent.includes('  ');
  const hasLongSelectors = /[^{]*{/.test(fileContent) && (fileContent.match(/[^{]*{/g) || []).some(s => s.length > 50);
  
  if (hasImportant) {
    suggestion += '- The file uses `!important` which can lead to specificity issues. Consider refactoring your CSS to avoid using `!important`.\n';
  }
  
  if (hasDeepNesting) {
    suggestion += '- The file appears to have deeply nested selectors. This can lead to specificity issues and larger CSS output. Consider flattening your selectors.\n';
  }
  
  if (hasLongSelectors) {
    suggestion += '- The file contains long selectors. This can lead to performance issues. Consider simplifying your selectors.\n';
  }
  
  // Add general suggestions
  suggestion += '\nConsider these optimizations:\n\n';
  suggestion += '1. Split the CSS into smaller, more focused files based on components or sections.\n';
  suggestion += '2. Use CSS Modules or CSS-in-JS to scope styles and reduce the risk of conflicts.\n';
  suggestion += '3. Implement critical CSS extraction to improve initial load times.\n';
  suggestion += '4. Use a CSS preprocessor like SASS or LESS to better organize your styles.\n';
  suggestion += '5. Consider using utility-first CSS frameworks like Tailwind CSS to reduce custom CSS.\n';
  
  return suggestion;
}
