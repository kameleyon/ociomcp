// Auto-generated safe fallback for browser-checker

export function activate() {
    console.log("[TOOL] browser-checker activated (passive mode)");
}

export function onFileWrite(filePath: string, content: string) {
  console.log(`[TOOL] Browser checker processing file: ${filePath}`);
  
  // Check if the file is a web-related file
  const isWebFile = filePath.endsWith('.html') || 
                    filePath.endsWith('.htm') || 
                    filePath.endsWith('.css') || 
                    filePath.endsWith('.scss') || 
                    filePath.endsWith('.less') || 
                    filePath.endsWith('.js') || 
                    filePath.endsWith('.jsx') || 
                    filePath.endsWith('.ts') || 
                    filePath.endsWith('.tsx');
  
  if (isWebFile) {
    try {
      // Check the file for browser compatibility issues
      const issues = checkFileForCompatibility(filePath, content, {
        projectPath: '.', // Assuming current directory is project root
        browsers: [
          { name: 'chrome', version: 'latest' },
          { name: 'firefox', version: 'latest' },
          { name: 'safari', version: 'latest' },
          { name: 'edge', version: 'latest' },
          { name: 'ie11', version: '*' } // Check for IE11 compatibility
        ],
        minify: false,
        checkCss: filePath.endsWith('.css') || filePath.endsWith('.scss') || filePath.endsWith('.less'),
        checkJs: filePath.endsWith('.js') || filePath.endsWith('.jsx') || filePath.endsWith('.ts') || filePath.endsWith('.tsx'),
        checkHtml: filePath.endsWith('.html') || filePath.endsWith('.htm'),
        generatePolyfills: true,
        generateFixes: true
      });
      
      // Log issues
      if (issues.issues.length > 0) {
        console.log(`[TOOL] Found ${issues.issues.length} browser compatibility issues in ${filePath}:`);
        issues.issues.forEach((issue, index) => {
          console.log(`${index + 1}. ${issue.description} (${issue.severity})`);
          console.log(`   Rule: ${issue.rule}`);
          console.log(`   Affected Browsers: ${issue.browsers.map(b => `${b.name} ${b.versions.join(',')}`).join(', ')}`);
          if (issue.suggestion) {
            console.log(`   Suggestion: ${issue.suggestion}`);
          }
        });
      } else {
        console.log(`[TOOL] No browser compatibility issues found in ${filePath}`);
      }
    } catch (error) {
      console.error(`[TOOL] Error checking file for compatibility: ${error}`);
    }
  }
}

export function onSessionStart(sessionId: string) {
  console.log(`[TOOL] Browser checker initialized for session: ${sessionId}`);
  
  // Check for common browser compatibility issues in the project
  setTimeout(() => {
    console.log('[TOOL] Checking for common browser compatibility issues...');
    checkCommonCompatibilityIssues();
  }, 3000); // Delay to ensure project files are loaded
}

export function onCommand(command: string, args: any[]) {
  if (command === 'check-browser-compatibility') {
    console.log('[TOOL] Checking browser compatibility...');
    
    const projectPath = args[0] || '.';
    const browsers = args[1] || ['chrome', 'firefox', 'safari', 'edge'];
    const minVersions = args[2];
    const checkCss = args[3] !== false;
    const checkJs = args[4] !== false;
    const checkHtml = args[5] !== false;
    const generatePolyfills = args[6] !== false;
    const generateFixes = args[7] !== false;
    const outputFormat = args[8] || 'markdown';
    const outputPath = args[9];
    const ignoreFiles = args[10];
    const ignoreRules = args[11];
    const customRules = args[12];
    
    return checkBrowserCompatibility({
      projectPath,
      browsers: browsers.map((name: string) => ({ name, version: 'latest' })), // Assuming latest version unless minVersions is provided
      minVersions,
      minify: false, // Minification is not handled by this tool
      checkCss,
      checkJs,
      checkHtml,
      generatePolyfills,
      generateFixes,
      outputFormat,
      outputPath,
      ignoreFiles,
      ignoreRules,
      customRules
    });
  } else if (command === 'generate-polyfills') {
    console.log('[TOOL] Generating polyfills list...');
    
    const issues = args[0];
    const options = args[1] || {};
    
    return {
      content: [{
        type: "text",
        text: generatePolyfillsList(issues, options)
      }],
    };
  } else if (command === 'generate-compatibility-report') {
    console.log('[TOOL] Generating compatibility report...');
    
    const result = args[0];
    const options = args[1] || {};
    
    return {
      content: [{
        type: "text",
        text: generateReport(result, options)
      }],
    };
  }
  
  return null;
}

/**
 * Checks a file for browser compatibility issues
 */
function checkFileForCompatibility(filePath: string, content: string, options: BrowserCheckerOptions): {
  issues: CompatibilityIssue[];
  polyfills: string[];
  fixes: Map<string, string>;
} {
  const issues: CompatibilityIssue[] = [];
  
  // Determine file type
  const fileExtension = path.extname(filePath).toLowerCase();
  
  // Check CSS
  if (options.checkCss && (fileExtension === '.css' || fileExtension === '.scss' || fileExtension === '.less')) {
    issues.push(...checkCssContent(content, filePath, options));
  }
  
  // Check JS
  if (options.checkJs && (fileExtension === '.js' || fileExtension === '.jsx' || fileExtension === '.ts' || fileExtension === '.tsx')) {
    issues.push(...checkJsContent(content, filePath, options));
  }
  
  // Check HTML
  if (options.checkHtml && (fileExtension === '.html' || fileExtension === '.htm')) {
    issues.push(...checkHtmlContent(content, filePath, options));
  }
  
  // Filter issues based on ignored rules
  const filteredIssues = issues.filter(issue => !options.ignoreRules?.includes(issue.rule));
  
  // Generate polyfills and fixes based on filtered issues
  const polyfills = options.generatePolyfills ? generatePolyfillsList(filteredIssues, options) : [];
  const fixes = options.generateFixes ? generateFixesMap(filteredIssues) : new Map<string, string>();
  
  return { issues: filteredIssues, polyfills, fixes };
}

/**
 * Checks CSS content for compatibility issues
 */
function checkCssContent(content: string, filePath: string, options: BrowserCheckerOptions): CompatibilityIssue[] {
  const issues: CompatibilityIssue[] = [];
  
  // Simple regex-based check for known incompatible CSS properties
  for (const [property, data] of Object.entries(browserCompatibilityDatabase.css) as [string, any][]) {
    const regex = new RegExp(property.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g');
    let match;
    
    while ((match = regex.exec(content)) !== null) {
      // Check if the property is supported in the target browsers
      const affectedBrowsers = data.browsers.filter((b: any) => 
        options.browsers.some(targetBrowser => 
          targetBrowser.name === b.name && 
          (b.versions[0] === '*' || b.versions.some((v: string) => isVersionOlder(targetBrowser.version, v)))
        )
      );
      
      if (affectedBrowsers.length > 0) {
        issues.push({
          file: filePath,
          line: getLineNumber(content, match.index),
          column: getColumnNumber(content, match.index),
          code: match[0],
          rule: property,
          description: data.description,
          severity: data.severity || 'warning',
          browsers: affectedBrowsers,
          suggestion: data.suggestion,
          fix: data.fix
        });
      }
    }
  }
  
  return issues;
}

/**
 * Checks JavaScript content for compatibility issues
 */
function checkJsContent(content: string, filePath: string, options: BrowserCheckerOptions): CompatibilityIssue[] {
  const issues: CompatibilityIssue[] = [];
  
  // Simple regex-based check for known incompatible JS features
  for (const [feature, data] of Object.entries(browserCompatibilityDatabase.js) as [string, any][]) {
    const regex = new RegExp(feature.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g');
    let match;
    
    while ((match = regex.exec(content)) !== null) {
      // Check if the feature is supported in the target browsers
      const affectedBrowsers = data.browsers.filter((b: any) => 
        options.browsers.some(targetBrowser => 
          targetBrowser.name === b.name && 
          (b.versions[0] === '*' || b.versions.some((v: string) => isVersionOlder(targetBrowser.version, v)))
        )
      );
      
      if (affectedBrowsers.length > 0) {
        issues.push({
          file: filePath,
          line: getLineNumber(content, match.index),
          column: getColumnNumber(content, match.index),
          code: match[0],
          rule: feature,
          description: data.description,
          severity: data.severity || 'warning',
          browsers: affectedBrowsers,
          suggestion: data.suggestion,
          fix: data.fix
        });
      }
    }
  }
  
  return issues;
}

/**
 * Checks HTML content for compatibility issues
 */
function checkHtmlContent(content: string, filePath: string, options: BrowserCheckerOptions): CompatibilityIssue[] {
  const issues: CompatibilityIssue[] = [];
  
  // Simple regex-based check for known incompatible HTML elements or attributes
  for (const [element, data] of Object.entries(browserCompatibilityDatabase.html) as [string, any][]) {
    const regex = new RegExp(element.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g');
    let match;
    
    while ((match = regex.exec(content)) !== null) {
      // Check if the element is supported in the target browsers
      const affectedBrowsers = data.browsers.filter((b: any) => 
        options.browsers.some(targetBrowser => 
          targetBrowser.name === b.name && 
          (b.versions[0] === '*' || b.versions.some((v: string) => isVersionOlder(targetBrowser.version, v)))
        )
      );
      
      if (affectedBrowsers.length > 0) {
        issues.push({
          file: filePath,
          line: getLineNumber(content, match.index),
          column: getColumnNumber(content, match.index),
          code: match[0],
          rule: element,
          description: data.description,
          severity: data.severity || 'warning',
          browsers: affectedBrowsers,
          suggestion: data.suggestion,
          fix: data.fix
        });
      }
    }
  }
  
  return issues;
}

/**
 * Checks for common browser compatibility issues in the project
 */
function checkCommonCompatibilityIssues() {
  console.log('[TOOL] Checking for common browser compatibility issues...');
  
  // This is a placeholder - in a real implementation, this would scan the project
  // For now, we'll just log a message
  console.log('[TOOL] Recommendation: Use the "check-browser-compatibility" command to scan your project for issues');
  console.log('[TOOL] Common compatibility issues to watch for:');
  console.log('- Using new CSS properties without fallbacks or prefixes');
  console.log('- Using new JavaScript features without transpilation or polyfills');
  console.log('- Using new HTML5 elements without polyfills');
  console.log('- Browser-specific bugs or rendering differences');
}

/**
 * Checks if a version is older than another version
 */
function isVersionOlder(currentVersion: string, targetVersion: string): boolean {
  // Simple version comparison (e.g., "1.2.3" vs "1.2")
  const currentParts = currentVersion.split('.').map(Number);
  const targetParts = targetVersion.split('.').map(Number);
  
  for (let i = 0; i < Math.max(currentParts.length, targetParts.length); i++) {
    const current = currentParts[i] || 0;
    const target = targetParts[i] || 0;
    
    if (current < target) return true;
    if (current > target) return false;
  }
  
  return false; // Versions are the same or target is older
}

/**
 * Gets the line number from content and index
 */
function getLineNumber(content: string, index: number): number {
  return content.substring(0, index).split('\n').length;
}

/**
 * Gets the column number from content and index
 */
function getColumnNumber(content: string, index: number): number {
  const lastNewlineIndex = content.lastIndexOf('\n', index - 1);
  return index - lastNewlineIndex;
}

/**
 * Generates a map of fixes by file
 */
function generateFixesMap(issues: CompatibilityIssue[]): Map<string, string> {
  const fixes = new Map<string, string>();
  
  issues.forEach(issue => {
    if (issue.fix) {
      const existingFix = fixes.get(issue.file) || '';
      fixes.set(issue.file, existingFix + `\n\n/* Fix for ${issue.rule} at line ${issue.line} */\n${issue.fix}`);
    }
  });
  
  return fixes;
}
/**
 * Browser Checker
 * 
 * Analyzes code for cross-browser compatibility issues
 * Suggests fixes for browser-specific problems
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { z } from 'zod';

/**
 * Schema for BrowserChecker
 */
export const GenerateBrowserCheckerSchema = z.object({
  projectPath: z.string(),
  browsers: z.array(
    z.enum(['chrome', 'firefox', 'safari', 'edge', 'ie11', 'opera', 'samsung', 'uc'])
  ).default(['chrome', 'firefox', 'safari', 'edge']),
  minVersions: z.record(z.string(), z.string()).optional(),
  checkCss: z.boolean().default(true),
  checkJs: z.boolean().default(true),
  checkHtml: z.boolean().default(true),
  generatePolyfills: z.boolean().default(true),
  generateFixes: z.boolean().default(true),
  outputFormat: z.enum(['json', 'markdown', 'html']).default('markdown'),
  outputPath: z.string().optional(),
  ignoreFiles: z.array(z.string()).optional(),
  ignoreRules: z.array(z.string()).optional(),
  customRules: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      test: z.string(),
      browsers: z.array(z.string()),
      fix: z.string().optional()
    })
  ).optional()
});

/**
 * Browser compatibility issue interface
 */
export interface CompatibilityIssue {
  file: string;
  line: number;
  column: number;
  code: string;
  rule: string;
  description: string;
  severity: 'error' | 'warning' | 'info';
  browsers: Array<{
    name: string;
    versions: string[];
  }>;
  suggestion?: string;
  fix?: string;
}

/**
 * Browser checker options interface
 */
export interface BrowserCheckerOptions {
  projectPath: string;
  browsers: Array<{
    name: 'chrome' | 'firefox' | 'safari' | 'edge' | 'ie11' | 'opera' | 'samsung' | 'uc';
    version: string;
  }>;
  minify: boolean;
  checkCss: boolean;
  checkJs: boolean;
  checkHtml: boolean;
  generatePolyfills: boolean;
  // Optional stuff (nice to have, not breaking anything if not used)
  generateFixes?: boolean;
  outputFormat?: 'json' | 'markdown' | 'html';
  outputPath?: string;
  minVersions?: Record<string, string>;
  ignoreFiles?: string[];
  ignoreRules?: string[];
  customRules?: Array<{
    name: string;
    description: string;
    test: string;
    browsers: string[];
    fix?: string;
  }>;
}


/**
 * Browser compatibility database
 */
const browserCompatibilityDatabase: Record<string, any> = {
  css: {
    'display: grid': {
      description: 'CSS Grid Layout',
      browsers: [
        { name: 'ie11', versions: ['*'], partial: true },
        { name: 'edge', versions: ['<16'] },
        { name: 'safari', versions: ['<10.1'] },
        { name: 'chrome', versions: ['<57'] },
        { name: 'firefox', versions: ['<52'] }
      ],
      suggestion: 'Consider using a fallback layout for older browsers or use a grid polyfill',
      fix: `/* Add this fallback for IE11 and older browsers */
.grid-container {
  display: -ms-grid; /* IE11 */
  display: grid;
}

/* Or use Flexbox as a fallback */
@supports not (display: grid) {
  .grid-container {
    display: flex;
    flex-wrap: wrap;
  }
}`
    },
    'display: flex': {
      description: 'CSS Flexbox Layout',
      browsers: [
        { name: 'ie11', versions: ['*'], partial: true },
        { name: 'edge', versions: ['<12'] },
        { name: 'safari', versions: ['<9'] },
        { name: 'chrome', versions: ['<29'] },
        { name: 'firefox', versions: ['<28'] }
      ],
      suggestion: 'Add vendor prefixes for older browsers',
      fix: `/* Add these prefixes for older browsers */
.flex-container {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}`
    },
    'position: sticky': {
      description: 'CSS Sticky Positioning',
      browsers: [
        { name: 'ie11', versions: ['*'] },
        { name: 'edge', versions: ['<16'] },
        { name: 'safari', versions: ['<6.1'] },
        { name: 'chrome', versions: ['<56'] },
        { name: 'firefox', versions: ['<59'] }
      ],
      suggestion: 'Use a JavaScript polyfill for sticky positioning in older browsers',
      fix: `/* Add this for better browser support */
.sticky-element {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
}

/* Consider using a JS polyfill like stickyfill for IE11 */
/* npm install stickyfill */
/* 
  const elements = document.querySelectorAll('.sticky-element');
  Stickyfill.add(elements);
*/`
    },
    'gap:': {
      description: 'CSS Gap Property in Flexbox',
      browsers: [
        { name: 'ie11', versions: ['*'] },
        { name: 'edge', versions: ['<84'] },
        { name: 'safari', versions: ['<14.1'] },
        { name: 'chrome', versions: ['<84'] },
        { name: 'firefox', versions: ['<63'] }
      ],
      suggestion: 'Use margins instead of gap for flexbox in older browsers',
      fix: `/* Instead of using gap in flexbox, use this approach */
.flex-container {
  display: flex;
  margin: -10px; /* Negative margin to counteract item margins */
}

.flex-item {
  margin: 10px; /* This creates the gap effect */
}`
    },
    'aspect-ratio:': {
      description: 'CSS aspect-ratio Property',
      browsers: [
        { name: 'ie11', versions: ['*'] },
        { name: 'edge', versions: ['<88'] },
        { name: 'safari', versions: ['<15'] },
        { name: 'chrome', versions: ['<88'] },
        { name: 'firefox', versions: ['<89'] }
      ],
      suggestion: 'Use the padding-bottom technique for aspect ratios in older browsers',
      fix: `/* Instead of aspect-ratio, use this technique */
.element-with-aspect-ratio {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; /* For 16:9 aspect ratio */
}

.element-with-aspect-ratio > * {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}`
    },
    'backdrop-filter:': {
      description: 'CSS backdrop-filter Property',
      browsers: [
        { name: 'ie11', versions: ['*'] },
        { name: 'edge', versions: ['<17'] },
        { name: 'safari', versions: ['<9'] },
        { name: 'chrome', versions: ['<76'] },
        { name: 'firefox', versions: ['<70'] }
      ],
      suggestion: 'Use a solid background color as fallback for backdrop-filter',
      fix: `/* Add fallback for browsers that don't support backdrop-filter */
.blur-background {
  background-color: rgba(255, 255, 255, 0.8); /* Fallback */
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
}`
    }
  },
  js: {
    'const ': {
      description: 'ES6 const declaration',
      browsers: [
        { name: 'ie11', versions: ['*'] },
        { name: 'edge', versions: ['<14'] },
        { name: 'safari', versions: ['<10'] },
        { name: 'chrome', versions: ['<49'] },
        { name: 'firefox', versions: ['<36'] }
      ],
      suggestion: 'Use var instead of const for older browsers or use a transpiler like Babel',
      fix: `// Replace const with var for older browsers
// Or better, use Babel to transpile your code
// npm install @babel/core @babel/preset-env
// Create a .babelrc file with:
// {
//   "presets": ["@babel/preset-env"]
// }`
    },
    'let ': {
      description: 'ES6 let declaration',
      browsers: [
        { name: 'ie11', versions: ['*'] },
        { name: 'edge', versions: ['<14'] },
        { name: 'safari', versions: ['<10'] },
        { name: 'chrome', versions: ['<49'] },
        { name: 'firefox', versions: ['<36'] }
      ],
      suggestion: 'Use var instead of let for older browsers or use a transpiler like Babel',
      fix: `// Replace let with var for older browsers
// Or better, use Babel to transpile your code
// npm install @babel/core @babel/preset-env
// Create a .babelrc file with:
// {
//   "presets": ["@babel/preset-env"]
// }`
    },
    '=>': {
      description: 'ES6 Arrow Functions',
      browsers: [
        { name: 'ie11', versions: ['*'] },
        { name: 'edge', versions: ['<14'] },
        { name: 'safari', versions: ['<10'] },
        { name: 'chrome', versions: ['<49'] },
        { name: 'firefox', versions: ['<45'] }
      ],
      suggestion: 'Use traditional function expressions for older browsers or use a transpiler like Babel',
      fix: `// Replace arrow functions with traditional functions
// Instead of:
// const add = (a, b) => a + b;

// Use:
// var add = function(a, b) {
//   return a + b;
// };

// Or use Babel to transpile your code`
    },
    '...': {
      description: 'ES6 Spread Operator',
      browsers: [
        { name: 'ie11', versions: ['*'] },
        { name: 'edge', versions: ['<14'] },
        { name: 'safari', versions: ['<10'] },
        { name: 'chrome', versions: ['<46'] },
        { name: 'firefox', versions: ['<36'] }
      ],
      suggestion: 'Use Object.assign() or Array.prototype.concat() instead of spread operator for older browsers',
      fix: `// Instead of object spread:
// const newObj = { ...obj, prop: value };

// Use:
// var newObj = Object.assign({}, obj, { prop: value });

// Instead of array spread:
// const newArray = [...array, item];

// Use:
// var newArray = array.concat([item]);

// Or use Babel to transpile your code`
    },
    'async': {
      description: 'ES8 Async/Await',
      browsers: [
        { name: 'ie11', versions: ['*'] },
        { name: 'edge', versions: ['<15'] },
        { name: 'safari', versions: ['<10.1'] },
        { name: 'chrome', versions: ['<55'] },
        { name: 'firefox', versions: ['<52'] }
      ],
      suggestion: 'Use Promises or callbacks instead of async/await for older browsers or use a transpiler like Babel',
      fix: `// Instead of async/await:
// async function fetchData() {
//   const response = await fetch('/api/data');
//   const data = await response.json();
//   return data;
// }

// Use Promises:
// function fetchData() {
//   return fetch('/api/data')
//     .then(function(response) {
//       return response.json();
//     })
//     .then(function(data) {
//       return data;
//     });
// }

// Or use Babel with @babel/plugin-transform-runtime`
    },
    'fetch(': {
      description: 'Fetch API',
      browsers: [
        { name: 'ie11', versions: ['*'] },
        { name: 'edge', versions: ['<14'] },
        { name: 'safari', versions: ['<10.1'] },
        { name: 'chrome', versions: ['<42'] },
        { name: 'firefox', versions: ['<39'] }
      ],
      suggestion: 'Use XMLHttpRequest instead of fetch() for older browsers or include a fetch polyfill',
      fix: `// Add a fetch polyfill for older browsers
// npm install whatwg-fetch
// Import it at the top of your entry file:
// import 'whatwg-fetch';

// Or use XMLHttpRequest:
// function fetchData(url) {
//   return new Promise(function(resolve, reject) {
//     var xhr = new XMLHttpRequest();
//     xhr.open('GET', url);
//     xhr.onload = function() {
//       if (xhr.status >= 200 && xhr.status < 300) {
//         resolve(JSON.parse(xhr.responseText));
//       } else {
//         reject(xhr.statusText);
//       }
//     };
//     xhr.onerror = function() {
//       reject(xhr.statusText);
//     };
//     xhr.send();
//   });
// }`
    }
  },
  html: {
    '<picture>': {
      description: 'HTML Picture Element',
      browsers: [
        { name: 'ie11', versions: ['*'] },
        { name: 'edge', versions: ['<13'] },
        { name: 'safari', versions: ['<9.1'] },
        { name: 'chrome', versions: ['<38'] },
        { name: 'firefox', versions: ['<38'] }
      ],
      suggestion: 'Use a polyfill like picturefill for older browsers',
      fix: `<!-- Add picturefill for older browsers -->
<!-- npm install picturefill -->
<!-- Add this to your HTML head: -->
<!-- <script src="path/to/picturefill.min.js"></script> -->

<!-- Or provide a fallback img: -->
<picture>
  <source srcset="large.jpg" media="(min-width: 800px)">
  <source srcset="medium.jpg" media="(min-width: 400px)">
  <img src="small.jpg" alt="Description"> <!-- Fallback for browsers that don't support picture -->
</picture>`
    },
    '<template>': {
      description: 'HTML Template Element',
      browsers: [
        { name: 'ie11', versions: ['*'] },
        { name: 'edge', versions: ['<13'] },
        { name: 'safari', versions: ['<8'] },
        { name: 'chrome', versions: ['<26'] },
        { name: 'firefox', versions: ['<22'] }
      ],
      suggestion: 'Use a hidden div with a script-based template system for older browsers',
      fix: `<!-- Instead of template element, use a hidden div -->
<div id="template-container" style="display: none;">
  <div id="my-template">
    <!-- Template content here -->
  </div>
</div>

<!-- Or use a template library like Handlebars or Mustache -->`
    },
    '<details>': {
      description: 'HTML Details Element',
      browsers: [
        { name: 'ie11', versions: ['*'] },
        { name: 'edge', versions: ['<79'] },
        { name: 'safari', versions: ['<6'] },
        { name: 'chrome', versions: ['<12'] },
        { name: 'firefox', versions: ['<49'] }
      ],
      suggestion: 'Use a custom implementation with divs and JavaScript for older browsers',
      fix: `<!-- Add a polyfill for details/summary -->
<!-- npm install details-element-polyfill -->
<!-- Add this to your HTML head: -->
<!-- <script src="path/to/details-element-polyfill.js"></script> -->

<!-- Or create a custom implementation: -->
<div class="custom-details">
  <div class="custom-summary" onclick="this.parentNode.classList.toggle('open')">Summary text</div>
  <div class="custom-content">
    Details content here
  </div>
</div>

<style>
  .custom-details .custom-content {
    display: none;
  }
  .custom-details.open .custom-content {
    display: block;
  }
  .custom-summary {
    cursor: pointer;
  }
</style>`
    },
    'type="module"': {
      description: 'ES6 Modules in Browser',
      browsers: [
        { name: 'ie11', versions: ['*'] },
        { name: 'edge', versions: ['<16'] },
        { name: 'safari', versions: ['<10.1'] },
        { name: 'chrome', versions: ['<61'] },
        { name: 'firefox', versions: ['<60'] }
      ],
      suggestion: 'Use a bundler like Webpack or Rollup for older browsers',
      fix: `<!-- Instead of using ES modules directly in the browser: -->
<!-- <script type="module" src="main.js"></script> -->

<!-- Use a bundled version with a bundler like Webpack: -->
<script src="bundle.js"></script>

<!-- Or use a nomodule fallback: -->
<script type="module" src="module.js"></script>
<script nomodule src="fallback.js"></script>`
    }
  }
};

/**
 * Check a project for browser compatibility issues
 * 
 * @param options Browser checker options
 * @returns Compatibility issues and fixes
 */
function checkBrowserCompatibility(options: BrowserCheckerOptions): {
  issues: CompatibilityIssue[];
  polyfills: string[];
  fixes: Map<string, string>;
} {
  const issues: CompatibilityIssue[] = [];
  const polyfills: string[] = [];
  const fixes = new Map<string, string>();
  
  // Get all files in the project
  const files = getProjectFiles(options.projectPath, options.ignoreFiles || []);
  
  // Check each file for compatibility issues
  files.forEach(file => {
    const fileExtension = path.extname(file).toLowerCase();
    
    // Check CSS files
    if (options.checkCss && (fileExtension === '.css' || fileExtension === '.scss' || fileExtension === '.less')) {
      const cssIssues = checkCssFile(file, options);
      issues.push(...cssIssues);
    }
    
    // Check JS files
    if (options.checkJs && (fileExtension === '.js' || fileExtension === '.jsx' || fileExtension === '.ts' || fileExtension === '.tsx')) {
      const jsIssues = checkJsFile(file, options);
      issues.push(...jsIssues);
    }
    
    // Check HTML files
    if (options.checkHtml && (fileExtension === '.html' || fileExtension === '.htm')) {
      const htmlIssues = checkHtmlFile(file, options);
      issues.push(...htmlIssues);
    }
  });
  
  // Generate polyfills if enabled
  if (options.generatePolyfills) {
    polyfills.push(...generatePolyfillsList(issues, options));
  }
  
  // Generate fixes if enabled
  if (options.generateFixes) {
    issues.forEach(issue => {
      if (issue.fix) {
        const existingFix = fixes.get(issue.file) || '';
        fixes.set(issue.file, existingFix + `\n\n/* Fix for ${issue.rule} at line ${issue.line} */\n${issue.fix}`);
      }
    });
  }
  
  return { issues, polyfills, fixes };
}

/**
 * Get all files in a project
 * 
 * @param projectPath Project path
 * @param ignoreFiles Files to ignore
 * @returns Array of file paths
 */
function getProjectFiles(projectPath: string, ignoreFiles: string[]): string[] {
  // This is a simplified implementation
  // In a real implementation, this would recursively scan the directory
  return [
    path.join(projectPath, 'styles.css'),
    path.join(projectPath, 'main.js'),
    path.join(projectPath, 'index.html')
  ].filter(file => !ignoreFiles.some(ignore => file.includes(ignore)));
}

/**
 * Check a CSS file for compatibility issues
 * 
 * @param filePath File path
 * @param options Browser checker options
 * @returns Compatibility issues
 */
function checkCssFile(filePath: string, options: BrowserCheckerOptions): CompatibilityIssue[] {
  const issues: CompatibilityIssue[] = [];
  
  // This is a simplified implementation
  // In a real implementation, this would parse the CSS and check for issues
  
  // Example issue
  issues.push({
    file: filePath,
    line: 10,
    column: 5,
    code: 'display: grid;',
    rule: 'css-grid',
    description: 'CSS Grid Layout is not supported in some older browsers',
    severity: 'warning',
    browsers: [
      { name: 'ie11', versions: ['*'] },
      { name: 'edge', versions: ['<16'] }
    ],
    suggestion: 'Consider using a fallback layout for older browsers',
    fix: `/* Add this fallback for IE11 and older browsers */
.grid-container {
  display: -ms-grid; /* IE11 */
  display: grid;
}`
  });
  
  return issues;
}

/**
 * Check a JavaScript file for compatibility issues
 * 
 * @param filePath File path
 * @param options Browser checker options
 * @returns Compatibility issues
 */
function checkJsFile(filePath: string, options: BrowserCheckerOptions): CompatibilityIssue[] {
  const issues: CompatibilityIssue[] = [];
  
  // This is a simplified implementation
  // In a real implementation, this would parse the JS and check for issues
  
  // Example issue
  issues.push({
    file: filePath,
    line: 15,
    column: 10,
    code: 'const x = 5;',
    rule: 'es6-const',
    description: 'const declarations are not supported in IE11',
    severity: 'error',
    browsers: [
      { name: 'ie11', versions: ['*'] }
    ],
    suggestion: 'Use var instead of const for older browsers or use a transpiler like Babel',
    fix: `// Replace const with var for older browsers
// Or better, use Babel to transpile your code
// npm install @babel/core @babel/preset-env
// Create a .babelrc file with:
// {
//   "presets": ["@babel/preset-env"]
// }`
  });
  
  return issues;
}

/**
 * Check an HTML file for compatibility issues
 * 
 * @param filePath File path
 * @param options Browser checker options
 * @returns Compatibility issues
 */
function checkHtmlFile(filePath: string, options: BrowserCheckerOptions): CompatibilityIssue[] {
  const issues: CompatibilityIssue[] = [];
  
  // This is a simplified implementation
  // In a real implementation, this would parse the HTML and check for issues
  
  // Example issue
  issues.push({
    file: filePath,
    line: 20,
    column: 3,
    code: '<picture><source srcset="large.jpg" media="(min-width: 800px)"><img src="small.jpg" alt=""></picture>',
    rule: 'html-picture',
    description: 'The picture element is not supported in IE11',
    severity: 'warning',
    browsers: [
      { name: 'ie11', versions: ['*'] }
    ],
    suggestion: 'Use a polyfill like picturefill for older browsers',
    fix: `<!-- Add picturefill for older browsers -->
<!-- npm install picturefill -->
<!-- Add this to your HTML head: -->
<!-- <script src="path/to/picturefill.min.js"></script> -->`
  });
  
  return issues;
}

/**
 * Generate a list of polyfills based on issues
 * 
 * @param issues Compatibility issues
 * @param options Browser checker options
 * @returns Array of polyfill recommendations
 */
export function generatePolyfillsList(issues: CompatibilityIssue[], options: BrowserCheckerOptions): string[] {
  const polyfills: string[] = [];
  
  // Check for CSS Grid issues
  if (issues.some(issue => issue.rule === 'css-grid')) {
    polyfills.push('css-grid-polyfill: npm install css-grid-polyfill');
  }
  
  // Check for Fetch API issues
  if (issues.some(issue => issue.rule === 'fetch-api')) {
    polyfills.push('whatwg-fetch: npm install whatwg-fetch');
  }
  
  // Check for ES6 features
  if (issues.some(issue => issue.rule.startsWith('es6-'))) {
    polyfills.push('babel: npm install @babel/core @babel/preset-env');
  }
  
  // Check for HTML5 elements
  if (issues.some(issue => issue.rule === 'html-picture')) {
    polyfills.push('picturefill: npm install picturefill');
  }
  
  return polyfills;
}

/**
 * Generate a report of compatibility issues
 * 
 * @param result Check result
 * @param options Browser checker options
 * @returns Report content
 */
function generateReport(
  result: {
    issues: CompatibilityIssue[];
    polyfills: string[];
    fixes: Map<string, string>;
  },
  options: BrowserCheckerOptions
): string {
  switch (options.outputFormat) {
    case 'json':
      return generateJsonReport(result);
    case 'html':
      return generateHtmlReport(result);
    case 'markdown':
    default:
      return generateMarkdownReport(result);
  }
}

/**
 * Generate a JSON report
 * 
 * @param result Check result
 * @returns JSON report
 */
function generateJsonReport(
  result: {
    issues: CompatibilityIssue[];
    polyfills: string[];
    fixes: Map<string, string>;
  }
): string {
  const fixesObject: Record<string, string> = {};
  result.fixes.forEach((value, key) => {
    fixesObject[key] = value;
  });
  
  return JSON.stringify({
    issues: result.issues,
    polyfills: result.polyfills,
    fixes: fixesObject
  }, null, 2);
}

/**
 * Generate a Markdown report
 * 
 * @param result Check result
 * @returns Markdown report
 */
function generateMarkdownReport(
  result: {
    issues: CompatibilityIssue[];
    polyfills: string[];
    fixes: Map<string, string>;
  }
): string {
  let report = '# Browser Compatibility Report\n\n';
  
  // Summary
  report += '## Summary\n\n';
  report += `- Total issues: ${result.issues.length}\n`;
  report += `- Errors: ${result.issues.filter(issue => issue.severity === 'error').length}\n`;
  report += `- Warnings: ${result.issues.filter(issue => issue.severity === 'warning').length}\n`;
  report += `- Info: ${result.issues.filter(issue => issue.severity === 'info').length}\n\n`;
  
  // Issues
  report += '## Issues\n\n';
  
  if (result.issues.length === 0) {
    report += 'No compatibility issues found.\n\n';
  } else {
    result.issues.forEach((issue, index) => {
      report += `### Issue ${index + 1}: ${issue.rule}\n\n`;
      report += `- **File**: ${issue.file}\n`;
      report += `- **Line**: ${issue.line}, **Column**: ${issue.column}\n`;
      report += `- **Code**: \`${issue.code}\`\n`;
      report += `- **Description**: ${issue.description}\n`;
      report += `- **Severity**: ${issue.severity}\n`;
      report += `- **Affected Browsers**:\n`;
      
      issue.browsers.forEach(browser => {
        report += `  - ${browser.name}: ${browser.versions.join(', ')}\n`;
      });
      
      if (issue.suggestion) {
        report += `- **Suggestion**: ${issue.suggestion}\n`;
      }
      
      if (issue.fix) {
        report += `- **Fix**:\n\n\`\`\`\n${issue.fix}\n\`\`\`\n`;
      }
      
      report += '\n';
    });
  }
  
  // Polyfills
  report += '## Recommended Polyfills\n\n';
  
  if (result.polyfills.length === 0) {
    report += 'No polyfills needed.\n\n';
  } else {
    result.polyfills.forEach(polyfill => {
      report += `- ${polyfill}\n`;
    });
    report += '\n';
  }
  
  // Fixes
  report += '## Fixes by File\n\n';
  
  if (result.fixes.size === 0) {
    report += 'No fixes generated.\n\n';
  } else {
    result.fixes.forEach((fix, file) => {
      report += `### ${file}\n\n`;
      report += '```\n' + fix + '\n```\n\n';
    });
  }
  
  return report;
}

/**
 * Generate an HTML report
 * 
 * @param result Check result
 * @returns HTML report
 */
function generateHtmlReport(
  result: {
    issues: CompatibilityIssue[];
    polyfills: string[];
    fixes: Map<string, string>;
  }
): string {
  // Create the HTML header and style
  let report = '<!DOCTYPE html>\n<html lang="en">\n<head>\n';
  report += '  <meta charset="UTF-8">\n';
  report += '  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n';
  report += '  <title>Browser Compatibility Report</title>\n';
  report += '  <style>\n';
  report += '    body {\n';
  report += '      font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Oxygen, Ubuntu, Cantarell, \'Open Sans\', \'Helvetica Neue\', sans-serif;\n';
  report += '      line-height: 1.6;\n';
  report += '      color: #333;\n';
  report += '      max-width: 1200px;\n';
  report += '      margin: 0 auto;\n';
  report += '      padding: 20px;\n';
  report += '    }\n';
  report += '    h1, h2, h3 {\n';
  report += '      color: #2c3e50;\n';
  report += '    }\n';
  report += '    .summary {\n';
  report += '      display: flex;\n';
  report += '      gap: 20px;\n';
  report += '      margin-bottom: 30px;\n';
  report += '    }\n';
  report += '    .summary-item {\n';
  report += '      background-color: #f8f9fa;\n';
  report += '      border-radius: 5px;\n';
  report += '      padding: 15px;\n';
  report += '      flex: 1;\n';
  report += '    }\n';
  report += '    .issue {\n';
  report += '      margin-bottom: 20px;\n';
  report += '      padding: 15px;\n';
  report += '      border-left: 4px solid #dc3545;\n';
  report += '      background-color: #f8f9fa;\n';
  report += '    }\n';
  report += '    .warning {\n';
  report += '      border-left-color: #ffc107;\n';
  report += '    }\n';
  report += '    .info {\n';
  report += '      border-left-color: #17a2b8;\n';
  report += '    }\n';
  report += '    .polyfill {\n';
  report += '      background-color: #e9ecef;\n';
  report += '      padding: 10px;\n';
  report += '      border-radius: 5px;\n';
  report += '      margin-bottom: 10px;\n';
  report += '    }\n';
  report += '    code {\n';
  report += '      background-color: #f1f1f1;\n';
  report += '      padding: 2px 4px;\n';
  report += '      border-radius: 3px;\n';
  report += '      font-family: \'Courier New\', Courier, monospace;\n';
  report += '    }\n';
  report += '  </style>\n';
  report += '</head>\n<body>\n';
  report += '  <h1>Browser Compatibility Report</h1>\n\n';
  
  // Add summary section
  report += '  <div class="summary">\n';
  report += '    <div class="summary-item">\n';
  report += '      <h3>Issues Found</h3>\n';
  report += '      <p>' + result.issues.length + '</p>\n';
  report += '    </div>\n';
  report += '    <div class="summary-item">\n';
  report += '      <h3>Polyfills Needed</h3>\n';
  report += '      <p>' + result.polyfills.length + '</p>\n';
  report += '    </div>\n';
  report += '    <div class="summary-item">\n';
  report += '      <h3>Fixes Available</h3>\n';
  report += '      <p>' + result.fixes.size + '</p>\n';
  report += '    </div>\n';
  report += '  </div>\n';

  // Add issues section
  if (result.issues.length > 0) {
    report += '  <h2>Compatibility Issues</h2>\n';
    
    result.issues.forEach((issue, index) => {
      const severityClass = issue.severity === 'error' ? 'issue' :
                           issue.severity === 'warning' ? 'issue warning' : 'issue info';
      
      report += '  <div class="' + severityClass + '">\n';
      report += '    <h3>' + (index + 1) + '. ' + (issue.rule || "unknown") + '</h3>\n';
      report += '    <p><strong>Browser:</strong> ' + (issue.browsers[0]?.name || "unknown") + '</p>\n';
      report += '    <p><strong>Description:</strong> ' + issue.description + '</p>\n';
      report += '    <p><strong>Impact:</strong> ' + issue.severity + '</p>\n';
      
      if (issue.suggestion) {
        report += '    <p><strong>Solution:</strong> ' + issue.suggestion + '</p>\n';
      }
      
      report += '  </div>\n';
    });
  }
  
  // Add polyfills section
  if (result.polyfills.length > 0) {
    report += '  <h2>Required Polyfills</h2>\n';
    
    result.polyfills.forEach(polyfill => {
      report += '  <div class="polyfill">\n';
      report += '    <code>' + polyfill + '</code>\n';
      report += '  </div>\n';
    });
  }
  
  // Add fixes section
  if (result.fixes.size > 0) {
    report += '  <h2>Available Fixes</h2>\n';
    report += '  <ul>\n';
    
    result.fixes.forEach((fix, feature) => {
      report += '    <li><strong>' + feature + ':</strong> ' + fix + '</li>\n';
    });
    
    report += '  </ul>\n';
  }
  
  // Close HTML tags
  report += '</body>\n</html>';

  return report;
}
