// Importing generatePolyfillsList from browser-checker
// Importing generateReadme from generators
// Implementing transformation functions
function transformFeaturesToCompatibilityIssues(features: string[]): CompatibilityIssue[] {
  // Placeholder implementation
  return features.map(feature => ({
    file: 'unknown',
    line: 0,
    column: 0,
    code: 'unknown',
    rule: 'unknown',
    description: 'unknown',
    severity: 'info',
    browsers: [],
    name: feature,
    status: 'unknown'
  }));
}

function transformEnhancementOptionsToServiceOptions(options: EnhancementOptions): ServiceOptions {
  // Placeholder implementation
  return {
    name: options.projectName || 'default',
    type: 'rest',
    framework: 'express',
    language: 'typescript',
    authentication: false,
    authorization: false,
    containerization: false,
    ...options
  };
}
import { generateReadme } from '../database-api/generators';

// Implementing missing functions
function generateCssFallbacks(cssFeatures: any, options: any): string {
  // Placeholder implementation
  return '';
}

function generateJsFallbacks(jsFeatures: any, options: any): string {
  // Placeholder implementation
  return '';
}

function generatePolyfillPackageJson(features: string[], options: EnhancementOptions): string {
  // Example implementation if you want
  const dependencies = features.map(feature => {
    // Map feature names to dummy polyfills (you can replace this logic later)
    return [feature, "latest"];
  }).reduce((acc, [feature, version]) => {
    acc[feature] = version;
    return acc;
  }, {} as Record<string, string>);

  return JSON.stringify({ dependencies }, null, 2);
}

import { generatePolyfillsList } from './browser-checker';
/**
 * Enhancement Tool
 * 
 * Adds fallbacks and enhancements based on browser capabilities
 * Ensures graceful degradation for older browsers
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { z } from 'zod';

/**
 * Schema for EnhancementTool
 */
export const GenerateEnhancementSchema = z.object({
  projectPath: z.string(),
  targetBrowsers: z.array(
    z.object({
      name: z.enum(['chrome', 'firefox', 'safari', 'edge', 'ie11', 'opera', 'samsung', 'uc']),
      version: z.string()
    })
  ).default([
    { name: 'chrome', version: '>=60' },
    { name: 'firefox', version: '>=60' },
    { name: 'safari', version: '>=12' },
    { name: 'edge', version: '>=16' }
  ]),
  features: z.array(
    z.enum([
      'css-grid',
      'css-flexbox',
      'css-variables',
      'css-sticky',
      'css-aspect-ratio',
      'css-backdrop-filter',
      'js-modules',
      'js-async-await',
      'js-fetch',
      'js-intersection-observer',
      'js-web-components',
      'html-picture',
      'html-details',
      'html-dialog',
      'webp',
      'webgl',
      'webrtc',
      'touch-events',
      'custom'
    ])
  ).default([]),
  customFeatures: z.array(
    z.object({
      name: z.string(),
      test: z.string(),
      fallback: z.string()
    })
  ).optional(),
  outputDir: z.string().optional(),
  generatePolyfills: z.boolean().default(true),
  generateFeatureDetection: z.boolean().default(true),
  bundlePolyfills: z.boolean().default(false),
  minify: z.boolean().default(false)
});

/**
 * Enhancement tool options interface
 */
import { CompatibilityIssue } from './browser-checker';
import { BrowserCheckerOptions } from './browser-checker'; // <-- ADD this
import { ServiceOptions } from '../database-api/types';

interface EnhancementOptions {
  projectPath: string;
  projectName: string; // Added projectName property
  targetBrowsers: Array<{
    name: 'chrome' | 'firefox' | 'safari' | 'edge' | 'ie11' | 'opera' | 'samsung' | 'uc';
    version: string;
  }>;
  features: Array<
    | 'css-grid'
    | 'css-flexbox'
    | 'css-variables'
    | 'css-sticky'
    | 'css-aspect-ratio'
    | 'css-backdrop-filter'
    | 'js-modules'
    | 'js-async-await'
    | 'js-fetch'
    | 'js-intersection-observer'
    | 'js-web-components'
    | 'html-picture'
    | 'html-details'
    | 'html-dialog'
    | 'webp'
    | 'webgl'
    | 'webrtc'
    | 'touch-events'
    | 'custom'
  >;
  customFeatures?: Array<{
    name: string;
    test: string;
    fallback: string;
  }>;
  outputDir?: string;
  generatePolyfills: boolean;
  generateFeatureDetection: boolean;
  bundlePolyfills: boolean;
  minify: boolean;
}

/**
 * Feature database with tests and fallbacks
 */
const featureDatabase: Record<string, {
  description: string;
  test: string;
  fallback: string;
  polyfill?: string;
}> = {
  'css-grid': {
    description: 'CSS Grid Layout',
    test: '@supports (display: grid)',
    fallback: `/* CSS Grid fallback using flexbox */
.grid-container {
  display: flex;
  flex-wrap: wrap;
}
.grid-container > * {
  flex: 1 1 var(--col-width, 300px);
  margin: var(--grid-gap, 1rem);
}

@supports (display: grid) {
  .grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(var(--col-width, 300px), 1fr));
    grid-gap: var(--grid-gap, 1rem);
  }
  .grid-container > * {
    margin: 0;
  }
}`,
    polyfill: 'npm install css-grid-polyfill'
  },
  'css-flexbox': {
    description: 'CSS Flexbox Layout',
    test: '@supports (display: flex)',
    fallback: `/* Flexbox fallback using float */
.flex-container {
  overflow: hidden;
}
.flex-container > * {
  float: left;
  margin: 10px;
}

@supports (display: flex) {
  .flex-container {
    display: flex;
    flex-wrap: wrap;
  }
  .flex-container > * {
    float: none;
  }
}`,
    polyfill: 'npm install flexboxpolyfill'
  },
  'css-variables': {
    description: 'CSS Custom Properties (Variables)',
    test: '@supports (--custom: property)',
    fallback: `/* CSS Variables fallback */
:root {
  --primary-color: #3498db;
  --secondary-color: #2ecc71;
  --text-color: #333;
  --spacing-unit: 16px;
}

/* Fallback values */
.element {
  color: #333; /* Fallback */
  color: var(--text-color);
  margin: 16px; /* Fallback */
  margin: var(--spacing-unit);
  background-color: #3498db; /* Fallback */
  background-color: var(--primary-color);
}`,
    polyfill: 'npm install css-vars-ponyfill'
  },
  'css-sticky': {
    description: 'CSS Sticky Positioning',
    test: '@supports (position: sticky)',
    fallback: `/* Sticky position fallback with JS */
.sticky-element {
  position: relative;
}

@supports (position: sticky) {
  .sticky-element {
    position: sticky;
    top: 0;
  }
}

/* JS Fallback:
document.addEventListener('DOMContentLoaded', function() {
  if (!CSS.supports('position', 'sticky')) {
    const stickyElements = document.querySelectorAll('.sticky-element');
    
    window.addEventListener('scroll', function() {
      stickyElements.forEach(function(element) {
        const rect = element.getBoundingClientRect();
        const parentRect = element.parentElement.getBoundingClientRect();
        
        if (rect.top <= 0 && parentRect.bottom > rect.height) {
          element.style.position = 'fixed';
          element.style.top = '0';
          element.style.width = parentRect.width + 'px';
        } else if (rect.top > 0 || parentRect.bottom <= rect.height) {
          element.style.position = 'relative';
          element.style.top = 'auto';
          element.style.width = 'auto';
        }
      });
    });
  }
});
*/`,
    polyfill: 'npm install stickyfilljs'
  },
  'css-aspect-ratio': {
    description: 'CSS aspect-ratio Property',
    test: '@supports (aspect-ratio: 16/9)',
    fallback: `/* aspect-ratio fallback using padding technique */
.aspect-ratio-box {
  position: relative;
  height: 0;
  padding-top: 56.25%; /* 16:9 Aspect Ratio */
  overflow: hidden;
}

.aspect-ratio-box > * {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

@supports (aspect-ratio: 16/9) {
  .aspect-ratio-box {
    aspect-ratio: 16/9;
    height: auto;
    padding-top: 0;
  }
  
  .aspect-ratio-box > * {
    position: static;
  }
}`
  },
  'css-backdrop-filter': {
    description: 'CSS backdrop-filter Property',
    test: '@supports (backdrop-filter: blur(10px))',
    fallback: `/* backdrop-filter fallback */
.blur-bg {
  background-color: rgba(255, 255, 255, 0.8); /* Fallback */
}

@supports (backdrop-filter: blur(10px)) or (-webkit-backdrop-filter: blur(10px)) {
  .blur-bg {
    background-color: rgba(255, 255, 255, 0.5);
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
  }
}`
  },
  'js-modules': {
    description: 'JavaScript ES Modules',
    test: '\'use strict\'; try { new Function(\'import("")\'); return true; } catch (err) { return false; }',
    fallback: `<!-- ES Modules with fallback -->
<script type="module" src="module.js"></script>
<script nomodule src="fallback.js"></script>

<!-- Or use a bundler like Webpack, Rollup, or Parcel -->`,
    polyfill: 'npm install systemjs'
  },
  'js-async-await': {
    description: 'JavaScript Async/Await',
    test: '\'use strict\'; try { new Function(\'async () => {}\'); return true; } catch (err) { return false; }',
    fallback: `// Async/await with Promise fallback
// Instead of:
// async function getData() {
//   const response = await fetch('/api/data');
//   const data = await response.json();
//   return data;
// }

// Use:
function getData() {
  return fetch('/api/data')
    .then(function(response) {
      return response.json();
    });
}`,
    polyfill: 'npm install regenerator-runtime'
  },
  'js-fetch': {
    description: 'Fetch API',
    test: '\'use strict\'; return typeof fetch !== \'undefined\'',
    fallback: `// Fetch API with XMLHttpRequest fallback
function fetchData(url) {
  // Use Fetch if available
  if (typeof fetch !== 'undefined') {
    return fetch(url)
      .then(function(response) {
        return response.json();
      });
  }
  
  // Fallback to XMLHttpRequest
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = function() {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(xhr.statusText);
      }
    };
    xhr.onerror = function() {
      reject(xhr.statusText);
    };
    xhr.send();
  });
}`,
    polyfill: 'npm install whatwg-fetch'
  },
  'js-intersection-observer': {
    description: 'Intersection Observer API',
    test: '\'use strict\'; return typeof IntersectionObserver !== \'undefined\'',
    fallback: `// Intersection Observer with scroll event fallback
function observeElements(elements, callback, options) {
  // Use Intersection Observer if available
  if (typeof IntersectionObserver !== 'undefined') {
    const observer = new IntersectionObserver(callback, options);
    elements.forEach(element => observer.observe(element));
    return observer;
  }
  
  // Fallback to scroll event
  const elementStates = new Map();
  elements.forEach(element => {
    elementStates.set(element, {
      visible: false
    });
  });
  
  function checkVisibility() {
    elements.forEach(element => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const isVisible = rect.top <= windowHeight && rect.bottom >= 0;
      const state = elementStates.get(element);
      
      if (isVisible !== state.visible) {
        state.visible = isVisible;
        const entry = {
          target: element,
          isIntersecting: isVisible,
          intersectionRatio: isVisible ? 1 : 0,
          boundingClientRect: rect
        };
        callback([entry]);
      }
    });
  }
  
  window.addEventListener('scroll', checkVisibility);
  window.addEventListener('resize', checkVisibility);
  checkVisibility();
  
  return {
    disconnect: function() {
      window.removeEventListener('scroll', checkVisibility);
      window.removeEventListener('resize', checkVisibility);
    }
  };
}`,
    polyfill: 'npm install intersection-observer'
  },
  'js-web-components': {
    description: 'Web Components',
    test: '\'use strict\'; return \'customElements\' in window',
    fallback: `// Web Components fallback using regular DOM elements
// Instead of:
// class MyComponent extends HTMLElement {
//   constructor() {
//     super();
//     this.attachShadow({ mode: 'open' });
//     this.shadowRoot.innerHTML = \`<style>...</style><div>...</div>\`;
//   }
// }
// customElements.define('my-component', MyComponent);

// Use:
function createMyComponent(container) {
  const template = document.createElement('template');
  template.innerHTML = \`<style>...</style><div>...</div>\`;
  
  const instance = template.content.cloneNode(true);
  container.appendChild(instance);
  
  // Add any event listeners or functionality here
  
  return container;
}

// Usage:
// const components = document.querySelectorAll('.my-component-container');
// components.forEach(createMyComponent);`,
    polyfill: 'npm install @webcomponents/webcomponentsjs'
  },
  'html-picture': {
    description: 'HTML Picture Element',
    test: '\'use strict\'; return \'HTMLPictureElement\' in window',
    fallback: `<!-- Picture element with img fallback -->
<picture>
  <source srcset="large.webp" type="image/webp">
  <source srcset="large.jpg" media="(min-width: 800px)">
  <source srcset="medium.jpg" media="(min-width: 400px)">
  <img src="small.jpg" alt="Description"> <!-- Fallback for browsers that don't support picture -->
</picture>`,
    polyfill: 'npm install picturefill'
  },
  'html-details': {
    description: 'HTML Details Element',
    test: '\'use strict\'; return \'HTMLDetailsElement\' in window',
    fallback: `<!-- Details element with JS fallback -->
<details>
  <summary>Click to expand</summary>
  <p>Hidden content</p>
</details>

<!-- Fallback script -->
<script>
  if (!('HTMLDetailsElement' in window)) {
    const details = document.querySelectorAll('details');
    details.forEach(function(detail) {
      const summary = detail.querySelector('summary');
      const content = Array.from(detail.childNodes).filter(node => node !== summary);
      
      // Hide content initially
      content.forEach(node => {
        if (node.style) {
          node.style.display = 'none';
        }
      });
      
      // Toggle on click
      summary.addEventListener('click', function() {
        const isOpen = detail.hasAttribute('open');
        if (isOpen) {
          detail.removeAttribute('open');
          content.forEach(node => {
            if (node.style) {
              node.style.display = 'none';
            }
          });
        } else {
          detail.setAttribute('open', '');
          content.forEach(node => {
            if (node.style) {
              node.style.display = '';
            }
          });
        }
      });
    });
  }
</script>`,
    polyfill: 'npm install details-element-polyfill'
  },
  'html-dialog': {
    description: 'HTML Dialog Element',
    test: '\'use strict\'; return \'HTMLDialogElement\' in window',
    fallback: `<!-- Dialog element with div fallback -->
<dialog id="myDialog">
  <h2>Dialog Title</h2>
  <p>Dialog content</p>
  <button id="closeDialog">Close</button>
</dialog>

<!-- Fallback script -->
<script>
  const dialog = document.getElementById('myDialog');
  const closeButton = document.getElementById('closeDialog');
  
  // Check if dialog is supported
  const isDialogSupported = typeof HTMLDialogElement !== 'undefined';
  
  // If not supported, add fallback styles and behavior
  if (!isDialogSupported) {
    dialog.style.display = 'none';
    dialog.style.position = 'fixed';
    dialog.style.top = '50%';
    dialog.style.left = '50%';
    dialog.style.transform = 'translate(-50%, -50%)';
    dialog.style.zIndex = '1000';
    dialog.style.backgroundColor = 'white';
    dialog.style.padding = '20px';
    dialog.style.borderRadius = '5px';
    dialog.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    
    // Create backdrop
    const backdrop = document.createElement('div');
    backdrop.style.position = 'fixed';
    backdrop.style.top = '0';
    backdrop.style.left = '0';
    backdrop.style.width = '100%';
    backdrop.style.height = '100%';
    backdrop.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    backdrop.style.zIndex = '999';
    backdrop.style.display = 'none';
    document.body.appendChild(backdrop);
    
    // Show dialog function
    window.showDialog = function() {
      dialog.style.display = 'block';
      backdrop.style.display = 'block';
    };
    
    // Close dialog function
    window.closeDialog = function() {
      dialog.style.display = 'none';
      backdrop.style.display = 'none';
    };
    
    // Close button event
    closeButton.addEventListener('click', window.closeDialog);
    
    // Close on backdrop click
    backdrop.addEventListener('click', window.closeDialog);
  } else {
    // Native dialog behavior
    window.showDialog = function() {
      dialog.showModal();
    };
    
    window.closeDialog = function() {
      dialog.close();
    };
    
    closeButton.addEventListener('click', window.closeDialog);
  }
</script>`,
    polyfill: 'npm install dialog-polyfill'
  },
  'webp': {
    description: 'WebP Image Format',
    test: `function checkWebP(callback) {
  const webP = new Image();
  webP.onload = webP.onerror = function() {
    callback(webP.height === 2);
  };
  webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
}`,
    fallback: `<!-- WebP with fallback -->
<picture>
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Description">
</picture>

<!-- Or use JS detection -->
<script>
  function checkWebP(callback) {
    const webP = new Image();
    webP.onload = webP.onerror = function() {
      callback(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  }
  
  checkWebP(function(support) {
    if (support) {
      document.documentElement.classList.add('webp');
    } else {
      document.documentElement.classList.add('no-webp');
    }
  });
</script>

<style>
  .webp .bg-image {
    background-image: url('image.webp');
  }
  .no-webp .bg-image {
    background-image: url('image.jpg');
  }
</style>`
  },
  'webgl': {
    description: 'WebGL',
    test: `function checkWebGL() {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  return gl instanceof WebGLRenderingContext;
}`,
    fallback: `// WebGL with canvas fallback
function initGraphics(container) {
  // Check for WebGL support
  const canvas = document.createElement('canvas');
  const hasWebGL = (function() {
    try {
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch(e) {
      return false;
    }
  })();
  
  if (hasWebGL) {
    // Initialize WebGL
    initWebGL(container);
  } else {
    // Fallback to Canvas
    initCanvas(container);
  }
}

function initWebGL(container) {
  const canvas = document.createElement('canvas');
  container.appendChild(canvas);
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  
  // WebGL initialization code here
}

function initCanvas(container) {
  const canvas = document.createElement('canvas');
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  
  // Canvas fallback code here
}`
  },
  'webrtc': {
    description: 'WebRTC',
    test: '\'use strict\'; return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)',
    fallback: `// WebRTC with fallback
function initVideoChat(container) {
  // Check for WebRTC support
  const hasWebRTC = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  
  if (hasWebRTC) {
    // Initialize WebRTC
    initWebRTC(container);
  } else {
    // Fallback to alternative solution
    initFallbackChat(container);
  }
}

function initWebRTC(container) {
  // WebRTC initialization code here
  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
      const videoElement = document.createElement('video');
      videoElement.srcObject = stream;
      videoElement.autoplay = true;
      container.appendChild(videoElement);
    })
    .catch(error => {
      console.error('Error accessing media devices:', error);
    });
}

function initFallbackChat(container) {
  // Fallback to text chat or other alternative
  const fallbackElement = document.createElement('div');
  fallbackElement.innerHTML = \`
    <p>Video chat is not supported in your browser.</p>
    <div class="text-chat">
      <div class="messages"></div>
      <input type="text" placeholder="Type a message...">
      <button>Send</button>
    </div>
  \`;
  container.appendChild(fallbackElement);
}`
  },
  'touch-events': {
    description: 'Touch Events',
    test: '\'use strict\'; return \'ontouchstart\' in window',
    fallback: `// Touch events with mouse fallback
function addDragSupport(element) {
  let isDragging = false;
  let startX, startY;
  let elementX = 0, elementY = 0;
  
  // Check for touch support
  const hasTouch = 'ontouchstart' in window;
  
  if (hasTouch) {
    // Touch events
    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchmove', handleTouchMove);
    element.addEventListener('touchend', handleTouchEnd);
  } else {
    // Mouse events
    element.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }
  
  function handleTouchStart(e) {
    const touch = e.touches[0];
    startDrag(touch.clientX, touch.clientY);
    e.preventDefault();
  }
  
  function handleTouchMove(e) {
    if (!isDragging) return;
    const touch = e.touches[0];
    updateDrag(touch.clientX, touch.clientY);
    e.preventDefault();
  }
  
  function handleTouchEnd() {
    endDrag();
  }
  
  function handleMouseDown(e) {
    startDrag(e.clientX, e.clientY);
    e.preventDefault();
  }
  
  function handleMouseMove(e) {
    if (!isDragging) return;
    updateDrag(e.clientX, e.clientY);
    e.preventDefault();
  }
  
  function handleMouseUp() {
    endDrag();
  }
  
  function startDrag(x, y) {
    isDragging = true;
    startX = x;
    startY = y;
    element.classList.add('dragging');
  }
  
  function updateDrag(x, y) {
    const deltaX = x - startX;
    const deltaY = y - startY;
    
    elementX += deltaX;
    elementY += deltaY;
    
    element.style.transform = \`translate(\${elementX}px, \${elementY}px)\`;
    
    startX = x;
    startY = y;
  }
  
  function endDrag() {
    isDragging = false;
    element.classList.remove('dragging');
  }
}`
  }
};

function transformEnhancementOptionsToBrowserCheckerOptions(options: EnhancementOptions): BrowserCheckerOptions {
  return {
    projectPath: options.projectPath, // <-- THIS was missing
    browsers: options.targetBrowsers.map(browser => ({
      name: browser.name,
      version: browser.version
    })),
    checkCss: true,
    checkJs: true,
    checkHtml: true,
    generatePolyfills: options.generatePolyfills,
    minify: options.minify
  };
}



/**
 * Generate enhancement files for a project
 * 
 * @param options Enhancement options
 * @returns Map of file paths to content
 */
function generateEnhancement(options: EnhancementOptions): Map<string, string> {
  const enhancementFiles = new Map<string, string>();
  
  // Determine output directory
  const outputDir = options.outputDir || path.join(options.projectPath, 'enhancements');
  
  // Generate feature detection script
  if (options.generateFeatureDetection) {
    enhancementFiles.set(
      path.join(outputDir, 'feature-detect.js'),
      generateFeatureDetectionScript(options)
    );
  }
  
  // Generate CSS fallbacks
  const cssFeatures = options.features.filter(feature => feature.startsWith('css-'));
  if (cssFeatures.length > 0) {
    enhancementFiles.set(
      path.join(outputDir, 'fallbacks.css'),
      generateCssFallbacks(cssFeatures, options)
    );
  }
  
  // Generate JS fallbacks
  const jsFeatures = options.features.filter(feature => 
    feature.startsWith('js-') || 
    feature.startsWith('html-') || 
    ['webp', 'webgl', 'webrtc', 'touch-events'].includes(feature)
  );
  if (jsFeatures.length > 0) {
    enhancementFiles.set(
      path.join(outputDir, 'fallbacks.js'),
      generateJsFallbacks(jsFeatures, options)
    );
  }
  
  // Generate polyfill list
  if (options.generatePolyfills) {
    enhancementFiles.set(
      path.join(outputDir, 'polyfills.md'),
      generatePolyfillsList(
        transformFeaturesToCompatibilityIssues(options.features),
        transformEnhancementOptionsToBrowserCheckerOptions(options)
      ).join('\n') // Join the array of strings into a single string with newlines
    );
    
    // Generate package.json with polyfills
    enhancementFiles.set(
      path.join(outputDir, 'package.json'),
      generatePolyfillPackageJson(options.features, options)
    );
  }
  
  // Generate README
  enhancementFiles.set(
    path.join(outputDir, 'README.md'),
    generateReadme(transformEnhancementOptionsToServiceOptions(options))
  );
  
  return enhancementFiles;
}

/**
 * Generate feature detection script
 * 
 * @param options Enhancement options
 * @returns Feature detection script content
 */
function generateFeatureDetectionScript(options: EnhancementOptions): string {
  let script = `/**
 * Feature Detection Script
 * Generated by EnhancementTool
 */

(function() {
  'use strict';
  
  // Feature detection results
  const features = {};
  
  // Add detection class to HTML element
  document.documentElement.classList.add('feature-detect');
  
`;

  // Add detection for each feature
  options.features.forEach(feature => {
    const featureInfo = featureDatabase[feature];
    if (!featureInfo) return;
    
    if (feature.startsWith('css-')) {
      // CSS feature detection
      script += `  // Detect ${featureInfo.description}
  features.${feature.replace(/-/g, '_')} = (function() {
    const dummy = document.createElement('div');
    return ${featureInfo.test.includes('@supports') 
      ? `CSS.supports('${featureInfo.test.replace('@supports ', '').replace(/[()]/g, '')}')`
      : featureInfo.test};
  })();
  document.documentElement.classList.add(features.${feature.replace(/-/g, '_')} ? '${feature}' : 'no-${feature}');
  
`;
    } else {
      // JS feature detection
      script += `  // Detect ${featureInfo.description}
  features.${feature.replace(/-/g, '_')} = (function() {
    try {
      return ${featureInfo.test};
    } catch (e) {
      return false;
    }
  })();
  document.documentElement.classList.add(features.${feature.replace(/-/g, '_')} ? '${feature}' : 'no-${feature}');
  
`;
    }
  });
  
  // Add custom feature detection
  if (options.customFeatures && options.customFeatures.length > 0) {
    options.customFeatures.forEach(customFeature => {
      script += `  // Detect custom feature: ${customFeature.name}
  features.${customFeature.name.replace(/-/g, '_')} = (function() {
    try {
      return ${customFeature.test};
    } catch (e) {
      return false;
    }
  })();
  document.documentElement.classList.add(features.${customFeature.name.replace(/-/g, '_')} ? '${customFeature.name}' : 'no-${customFeature.name}');
  
`;
    });
  }
  
  // Add feature object to window
  script += `  // Expose features object
  window.browserFeatures = features;
  
  // Log detected features
  if (window.console && window.console.log) {
    console.log('Detected browser features:', features);
  }
})();
`;

  return script;
}
