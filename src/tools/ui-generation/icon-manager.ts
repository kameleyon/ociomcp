// Auto-generated safe fallback for icon-manager

export function activate() {
    console.log("[TOOL] icon-manager activated (passive mode)");
}

export function onFileWrite(filePath: string, content: string) {
  console.log(`[TOOL] Icon manager processing file: ${filePath}`);
  
  // Check if the file is an icon file (SVG) or related to icon management
  const isIconFile = filePath.endsWith('.svg') || filePath.includes('icon-manager');
  
  if (isIconFile) {
    console.log(`[TOOL] Detected change in icon-related file: ${filePath}`);
    // In a real implementation, we might update the icon database or regenerate icon components
  }
}

export function onSessionStart(sessionId: string) {
  console.log(`[TOOL] Icon manager initialized for session: ${sessionId}`);
  
  // Check for existing icon configurations or custom icons
  setTimeout(() => {
    console.log('[TOOL] Checking for existing icon configurations...');
    checkExistingConfigurations();
  }, 3000); // Delay to ensure project files are loaded
}

export async function onCommand(command: string, args: any[]) {
  if (command === 'generate-icon-manager') {
    console.log('[TOOL] Generating icon manager...');
    
    const options = args[0];
    
    return handleGenerateIconManager(options);
  } else if (command === 'list-icons') {
    console.log('[TOOL] Listing available icons...');
    
    const library = args[0] || 'lucide';
    const query = args[1];
    const limit = args[2] || 20;
    
    return handleListIcons(library, query, limit);
  } else if (command === 'get-icon-svg') {
    console.log('[TOOL] Getting icon SVG...');
    
    const iconName = args[0];
    const library = args[1] || 'lucide';
    
    return handleGetIconSvg(iconName, library);
  } else if (command === 'add-custom-icon') {
    console.log('[TOOL] Adding custom icon...');
    
    const iconName = args[0];
    const iconSvg = args[1];
    
    return handleAddCustomIcon(iconName, iconSvg);
  } else if (command === 'remove-custom-icon') {
    console.log('[TOOL] Removing custom icon...');
    
    const iconName = args[0];
    
    return handleRemoveCustomIcon(iconName);
  }
  
  return null;
}

/**
 * Checks for existing icon configurations or custom icons
 */
function checkExistingConfigurations() {
  console.log('[TOOL] Checking for existing icon configurations...');
  
  // This is a placeholder - in a real implementation, this would scan the filesystem
  // For now, we'll just log a message
  console.log('[TOOL] Recommendation: Use the "generate-icon-manager" command to create an icon manager for your project');
  console.log('[TOOL] Common icon management tasks:');
  console.log('- Listing available icons from libraries');
  console.log('- Getting SVG code for a specific icon');
  console.log('- Adding and removing custom icons');
  console.log('- Generating icon manager components for different frameworks');
}

/**
 * Handles the list-icons command
 */
async function handleListIcons(library: string, query?: string, limit: number = 20): Promise<any> {
  console.log(`[TOOL] Handling list-icons command for library: ${library}, query: ${query}, limit: ${limit}`);
  // Placeholder implementation
  return { success: true, icons: ['activity', 'bell', 'box', 'camera', 'cloud'].filter(icon => query ? icon.includes(query) : true).slice(0, limit) };
}

/**
 * Handles the get-icon-svg command
 */
async function handleGetIconSvg(iconName: string, library: string): Promise<any> {
  console.log(`[TOOL] Handling get-icon-svg command for icon: ${iconName}, library: ${library}`);
  // Placeholder implementation
  return { success: true, svg: '<svg>...</svg>' };
}

/**
 * Handles the add-custom-icon command
 */
async function handleAddCustomIcon(iconName: string, iconSvg: string): Promise<any> {
  console.log(`[TOOL] Handling add-custom-icon command for icon: ${iconName}`);
  // Placeholder implementation
  return { success: true, message: `Custom icon "${iconName}" added (mock)` };
}

/**
 * Handles the remove-custom-icon command
 */
async function handleRemoveCustomIcon(iconName: string): Promise<any> {
  console.log(`[TOOL] Handling remove-custom-icon command for icon: ${iconName}`);
  // Placeholder implementation
  return { success: true, message: `Custom icon "${iconName}" removed (mock)` };
}
/**
 * Icon Manager Module
 *
 * This module provides tools for generating icon manager components for various frameworks.
 *
 * The implementation has been split into multiple files to keep each file under 500 lines.
 * See the icon-manager directory for the full implementation.
 */

export * from './icon-manager/index';
import { z } from 'zod';
import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * Schema for IconManager
 */
export const IconManagerSchema = z.object({
  name: z.string(),
  framework: z.enum(['react', 'vue', 'angular', 'svelte']).default('react'),
  typescript: z.boolean().default(true),
  icons: z.array(z.string()).optional(),
  customIcons: z.array(z.object({
    name: z.string(),
    svg: z.string()
  })).optional(),
  options: z.object({
    size: z.string().optional(),
    color: z.string().optional(),
    stroke: z.string().optional(),
    includeAll: z.boolean().optional(),
    lazyLoad: z.boolean().optional(),
    optimizeSVG: z.boolean().optional()
  }).optional(),
  outputPath: z.string().optional()
});

// Interface for IconManager options
interface IconManagerOptions {
  name: string;
  framework: 'react' | 'vue' | 'angular' | 'svelte' | 'solid';
  library: 'lucide' | 'heroicons' | 'feather' | 'bootstrap' | 'material' | 'custom';
  styling: 'css' | 'styled-components' | 'emotion' | 'tailwind' | 'scss';
  typescript: boolean;
  icons?: string[];
  customIcons?: Array<{ name: string; svg: string }>;
  options?: {
    size?: string;
    color?: string;
    stroke?: string;
    includeAll?: boolean;
    lazyLoad?: boolean;
    optimizeSVG?: boolean;
  };
  outputPath?: string;
}

/**
 * Generates an icon manager component for the specified framework
 */
export async function handleGenerateIconManager(args: any) {
  if (args && typeof args === 'object') {
    try {
      const {
        name = 'IconManager',
        framework = 'react',
        library = 'lucide',
        styling = 'css',
        typescript = true,
        icons = [],
        customIcons = [],
        options = {
          size: '24',
          stroke: '2',
          includeAll: false,
          lazyLoad: true,
          optimizeSVG: true
        },
        outputPath
      } = args;

      // Create a map to store the generated files
      const iconFiles = new Map<string, string>();

      // Generate the icon manager based on the framework
      const iconManagerOptions: IconManagerOptions = {
        name,
        framework,
        library,
        styling,
        typescript,
        icons,
        customIcons,
        options
      };

      switch (framework) {
        case 'react':
          generateReactIconManager(iconFiles, iconManagerOptions);
          break;
        case 'vue':
          generateVueIconManager(iconFiles, iconManagerOptions);
          break;
        case 'angular':
          generateAngularIconManager(iconFiles, iconManagerOptions);
          break;
        case 'svelte':
          // Import and use the Svelte generator
          import('./icon-manager/svelte-generator').then(module => {
            module.generateSvelteIconManager(iconFiles, iconManagerOptions);
          });
          break;
        case 'solid':
          // Import and use the Solid generator
          import('./icon-manager/solid-generator').then(module => {
            module.generateSolidIconManager(iconFiles, iconManagerOptions);
          });
          break;
        default:
          return {
            content: [{ type: "text", text: `Error: Unsupported framework: ${framework}` }],
            isError: true,
          };
      }

      // Write the files to disk if an output path is provided
      if (outputPath) {
        // Create the output directory if it doesn't exist
        await fs.mkdir(outputPath, { recursive: true });

        // Write each file to disk
        for (const [filePath, content] of iconFiles.entries()) {
          const fullPath = path.join(outputPath, filePath);
          
          // Create the directory if it doesn't exist
          const dirPath = path.dirname(fullPath);
          await fs.mkdir(dirPath, { recursive: true });
          
          // Write the file
          await fs.writeFile(fullPath, content);
        }

        return {
          content: [{
            type: "text",
            text: `Icon manager generated successfully and saved to ${outputPath}`
          }],
        };
      }

      // Return the generated files
      return {
        content: [{
          type: "text",
          text: `Icon manager generated successfully. Generated ${iconFiles.size} files.`
        }],
        files: Object.fromEntries(iconFiles)
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error generating icon manager: ${error}`
        }],
        isError: true,
      };
    }
  }
  
  return {
    content: [{ type: "text", text: "Error: Invalid arguments for generate_icon_manager" }],
    isError: true,
  };
}

/**
 * Formats a component name to PascalCase
 */
function formatComponentName(name: string): string {
  return name
    .replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '')
    .replace(/^(.)/, (_, c) => c.toUpperCase());
}

/**
 * Converts a string to kebab-case
 */
function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

/**
 * Generate React Icon Manager
 * 
 * @param iconFiles Map of file paths to content
 * @param options Icon Manager options
 */
function generateReactIconManager(iconFiles: Map<string, string>, options: IconManagerOptions): void {
  const {
    name,
    library,
    styling,
    typescript,
    icons = [],
    customIcons = [],
    options: iconOptions = {
      size: '24',
      stroke: '2',
      includeAll: false,
      lazyLoad: true,
      optimizeSVG: true
    }
  } = options;

  const managerName = formatComponentName(name);
  const hasTypescript = typescript;
  const fileExtension = hasTypescript ? '.tsx' : '.jsx';
  const includeAll = iconOptions.includeAll;
  const lazyLoad = iconOptions.lazyLoad;
  const iconSize = iconOptions.size || '24';
  const iconColor = iconOptions.color;
  const iconStroke = iconOptions.stroke || '2';
  
  // Generate types file
  if (hasTypescript) {
    let typesContent = `import { SVGProps } from 'react';

export type IconName = ${includeAll ? 
        '// All icons will be available' : 
        icons.length > 0 ? 
          `'${icons.join(`' | '`)}'` : 
          "'icon1' | 'icon2' | 'icon3' | 'icon4'"};

export interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: string | number;
  color?: string;
  strokeWidth?: string | number;
}
`;
    
    iconFiles.set(`types.ts`, typesContent);
  }
  
  // Generate custom icons file if using custom library
  if (library === 'custom') {
    let customIconsContent = `${hasTypescript ? `export interface IconMap {
  [key: string]: string;
}

` : ''}// Custom SVG icons
const icons${hasTypescript ? ': IconMap' : ''} = {
${customIcons.map(icon => `  '${icon.name}': \`${icon.svg}\``).join(',\n')}
};

export default icons;`;
    
    iconFiles.set(`custom-icons${hasTypescript ? '.ts' : '.js'}`, customIconsContent);
  }
  
  // Generate icon component
  let iconComponentContent = '';
  
  if (library === 'lucide') {
    iconComponentContent = `import React from 'react';
${hasTypescript ? `import { IconProps } from './types';
import * as LucideIcons from 'lucide-react';` : `import * as LucideIcons from 'lucide-react';

/**
 * @typedef {Object} IconProps
 * @property {string} name - Name of the icon
 * @property {string|number} [size=${iconSize}] - Size of the icon
 * @property {string} [color=${iconColor ? `'${iconColor}'` : 'currentColor'}] - Color of the icon
 * @property {string|number} [strokeWidth=${iconStroke}] - Stroke width of the icon
 */`}

/**
 * Icon component that renders Lucide icons
 */
const ${managerName} = (${hasTypescript ? 'props: IconProps' : 'props'}) => {
  const { name, size = ${iconSize}, color = ${iconColor ? `'${iconColor}'` : 'currentColor'}, strokeWidth = ${iconStroke}, ...rest } = props;
  
  // Get the icon component
  const IconComponent = (LucideIcons as any)[name] || LucideIcons.HelpCircle;
  
  return (
    <IconComponent
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      {...rest}
    />
  );
};

export default ${managerName};`;
  } else if (library === 'custom') {
    iconComponentContent = `import React, { useEffect, useState } from 'react';
${hasTypescript ? `import { IconProps } from './types';` : ''}
import customIcons from './custom-icons';

${hasTypescript ? '' : `/**
 * @typedef {Object} IconProps
 * @property {string} name - Name of the icon
 * @property {string|number} [size=${iconSize}] - Size of the icon
 * @property {string} [color=${iconColor ? `'${iconColor}'` : 'currentColor'}] - Color of the icon
 * @property {string|number} [strokeWidth=${iconStroke}] - Stroke width of the icon
 */`}

/**
 * Icon component that renders custom SVG icons
 */
const ${managerName} = (${hasTypescript ? 'props: IconProps' : 'props'}) => {
  const { name, size = ${iconSize}, color = ${iconColor ? `'${iconColor}'` : 'currentColor'}, strokeWidth = ${iconStroke}, ...rest } = props;
  const [viewBox, setViewBox] = useState('0 0 24 24');
  const [svgContent, setSvgContent] = useState('');
  
  useEffect(() => {
    const iconSvg = customIcons[name] || '';
    
    if (!iconSvg) {
      console.warn(\`Icon "\${name}" not found\`);
      setSvgContent('');
      return;
    }
    
    // Parse SVG string to get attributes and content
    const parser = new DOMParser();
    const doc = parser.parseFromString(iconSvg, 'image/svg+xml');
    const svgElement = doc.querySelector('svg');
    
    if (!svgElement) {
      console.warn(\`Invalid SVG for icon "\${name}"\`);
      setSvgContent('');
      return;
    }
    
    // Get SVG content (everything inside the svg tag)
    setSvgContent(svgElement.innerHTML);
    
    // Get original viewBox
    const svgViewBox = svgElement.getAttribute('viewBox');
    if (svgViewBox) {
      setViewBox(svgViewBox);
    }
  }, [name]);
  
  const sizeValue = typeof size === 'number' ? \`\${size}px\` : size;
  
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={sizeValue}
      height={sizeValue}
      viewBox={viewBox}
      stroke={color}
      strokeWidth={strokeWidth}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: svgContent }}
      {...rest}
    />
  );
};

export default ${managerName};`;
  } else {
    // Generic implementation for other libraries
    iconComponentContent = `import React from 'react';
${hasTypescript ? `import { IconProps } from './types';` : ''}

${hasTypescript ? '' : `/**
 * @typedef {Object} IconProps
 * @property {string} name - Name of the icon
 * @property {string|number} [size=${iconSize}] - Size of the icon
 * @property {string} [color=${iconColor ? `'${iconColor}'` : 'currentColor'}] - Color of the icon
 * @property {string|number} [strokeWidth=${iconStroke}] - Stroke width of the icon
 */`}

/**
 * Icon component that renders SVG icons
 */
const ${managerName} = (${hasTypescript ? 'props: IconProps' : 'props'}) => {
  const { name, size = ${iconSize}, color = ${iconColor ? `'${iconColor}'` : 'currentColor'}, strokeWidth = ${iconStroke}, ...rest } = props;
  
  const sizeValue = typeof size === 'number' ? \`\${size}px\` : size;
  
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={sizeValue}
      height={sizeValue}
      viewBox="0 0 24 24"
      stroke={color}
      strokeWidth={strokeWidth}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {/* This is a placeholder implementation */}
      {/* Replace with the actual implementation for the selected library */}
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
};

export default ${managerName};`;
  }
  
  iconFiles.set(`${managerName}${fileExtension}`, iconComponentContent);
  
  // Generate index file
  let indexContent = `${hasTypescript ? `import ${managerName} from './${managerName}';
export type { IconProps, IconName } from './types';
export default ${managerName};` : `import ${managerName} from './${managerName}';
export default ${managerName};`}`;
  
  iconFiles.set(`index${hasTypescript ? '.ts' : '.js'}`, indexContent);
  
  // Generate example usage file
  let exampleContent = `${hasTypescript ? `import React from 'react';
import ${managerName} from './${managerName}';` : `import React from 'react';
import ${managerName} from './${managerName}';`}

const IconExample = () => {
  return (
    <div>
      <h1>Icon Examples</h1>
      
      {/* Basic usage */}
      <div className="example-section">
        <h2>Basic Usage</h2>
        <${managerName} name="${icons.length > 0 ? icons[0] : 'activity'}" />
      </div>
      
      {/* Custom size */}
      <div className="example-section">
        <h2>Custom Size</h2>
        <${managerName} name="${icons.length > 0 ? icons[0] : 'activity'}" size={32} />
      </div>
      
      {/* Custom color */}
      <div className="example-section">
        <h2>Custom Color</h2>
        <${managerName} name="${icons.length > 0 ? icons[0] : 'activity'}" color="red" />
      </div>
      
      {/* Custom stroke width */}
      <div className="example-section">
        <h2>Custom Stroke Width</h2>
        <${managerName} name="${icons.length > 0 ? icons[0] : 'activity'}" strokeWidth={1} />
      </div>
      
      {/* Multiple icons */}
      <div className="example-section">
        <h2>Multiple Icons</h2>
        <div className="icon-grid">
          ${icons.slice(0, 5).map(icon => `<${managerName} name="${icon}" />`).join('\n          ')}
        </div>
      </div>
      
      <style jsx>{\`
        .example-section {
          margin-bottom: 20px;
        }
        
        .icon-grid {
          display: flex;
          gap: 10px;
        }
      \`}</style>
    </div>
  );
};

export default IconExample;`;
  
  iconFiles.set(`Example${fileExtension}`, exampleContent);
}

/**
 * Generate Vue Icon Manager
 * 
 * @param iconFiles Map of file paths to content
 * @param options Icon Manager options
 */
function generateVueIconManager(iconFiles: Map<string, string>, options: IconManagerOptions): void {
  const {
    name,
    library,
    styling,
    typescript,
    icons = [],
    customIcons = [],
    options: iconOptions = {
      size: '24',
      stroke: '2',
      includeAll: false,
      lazyLoad: true,
      optimizeSVG: true
    }
  } = options;

  const managerName = formatComponentName(name);
  const hasTypescript = typescript;
  const includeAll = iconOptions.includeAll;
  const lazyLoad = iconOptions.lazyLoad;
  const iconSize = iconOptions.size || '24';
  const iconColor = iconOptions.color;
  const iconStroke = iconOptions.stroke || '2';
  
  // Generate icon component
  let iconComponentContent = '';
  
  if (library === 'lucide') {
    iconComponentContent = `<template>
  <component :is="iconComponent" :size="size" :color="color" :stroke-width="strokeWidth" v-bind="$attrs" />
</template>

<script${hasTypescript ? ' lang="ts"' : ''}>
${hasTypescript ? `import { defineComponent, PropType, computed, h } from 'vue';
import * as LucideIcons from 'lucide-vue-next';` : `import { defineComponent, computed, h } from 'vue';
import * as LucideIcons from 'lucide-vue-next';`}

export default defineComponent({
  name: '${managerName}',
  
  props: {
    name: {
      type: String,
      required: true
    },
    size: {
      type: [String, Number],
      default: ${iconSize}
    },
    color: {
      type: String,
      default: ${iconColor ? `'${iconColor}'` : "'currentColor'"}
    },
    strokeWidth: {
      type: [String, Number],
      default: ${iconStroke}
    }
  },
  
  setup(props) {
    const iconComponent = computed(() => {
      return (LucideIcons as any)[props.name] || LucideIcons.HelpCircle;
    });
    
    return {
      iconComponent
    };
  }
});
</script>`;
  } else if (library === 'custom') {
    // Generate custom icons file
    let customIconsContent = `${hasTypescript ? `export interface IconMap {
  [key: string]: string;
}

` : ''}// Custom SVG icons
export const icons${hasTypescript ? ': IconMap' : ''} = {
${customIcons.map(icon => `  '${icon.name}': \`${icon.svg}\``).join(',\n')}
};
`;
    
    iconFiles.set(`custom-icons${hasTypescript ? '.ts' : '.js'}`, customIconsContent);
    
    // Generate icon component
    iconComponentContent = `<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="sizeValue"
    :height="sizeValue"
    :viewBox="viewBox"
    :stroke="color"
    :stroke-width="strokeWidth"
    fill="none"
    stroke-linecap="round"
    stroke-linejoin="round"
    v-bind="$attrs"
    v-html="svgContent"
  ></svg>
</template>

<script${hasTypescript ? ' lang="ts"' : ''}>
${hasTypescript ? `import { defineComponent, PropType, ref, computed, onMounted, watch } from 'vue';
import { icons } from './custom-icons';` : `import { defineComponent, ref, computed, onMounted, watch } from 'vue';
import { icons } from './custom-icons';`}

export default defineComponent({
  name: '${managerName}',
  
  props: {
    name: {
      type: String,
      required: true
    },
    size: {
      type: [String, Number],
      default: ${iconSize}
    },
    color: {
      type: String,
      default: ${iconColor ? `'${iconColor}'` : "'currentColor'"}
    },
    strokeWidth: {
      type: [String, Number],
      default: ${iconStroke}
    }
  },
  
  setup(props) {
    const viewBox = ref('0 0 24 24');
    const svgContent = ref('');
    
    const updateIcon = () => {
      const iconSvg = icons[props.name] || '';
      
      if (!iconSvg) {
        console.warn(\`Icon "\${props.name}" not found\`);
        svgContent.value = '';
        return;
      }
      
      // Parse SVG string to get attributes and content
      const parser = new DOMParser();
      const doc = parser.parseFromString(iconSvg, 'image/svg+xml');
      const svgElement = doc.querySelector('svg');
      
      if (!svgElement) {
        console.warn(\`Invalid SVG for icon "\${props.name}"\`);
        svgContent.value = '';
        return '';
      }
      
      // Get SVG content (everything inside the svg tag)
      const content = svgElement.innerHTML;
      
      // Get original viewBox
      const svgViewBox = svgElement.getAttribute('viewBox');
      if (svgViewBox) {
        viewBox.value = svgViewBox;
      }
      
      return content;
    };
    
    // Call updateIcon when component is mounted or when name changes
    onMounted(() => {
      svgContent.value = updateIcon() || '';
    });
    
    watch(() => props.name, () => {
      svgContent.value = updateIcon() || '';
    });
    
    const sizeValue = computed(() => {
      return typeof props.size === 'number' ? \`\${props.size}px\` : props.size;
    });
    
    return {
      viewBox,
      svgContent,
      sizeValue
    };
  }
});
</script>`;
  } else {
    // Generic implementation for other libraries
    iconComponentContent = `<template>
  <div class="icon-wrapper">
    <!-- This is a placeholder implementation -->
    <!-- Replace with the actual implementation for the selected library -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
      :width="sizeValue"
      :height="sizeValue"
      viewBox="0 0 24 24"
      :stroke="color"
      :stroke-width="strokeWidth"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
      v-bind="$attrs"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  </div>
</template>

<script${hasTypescript ? ' lang="ts"' : ''}>
${hasTypescript ? `import { defineComponent, PropType, computed } from 'vue';` : `import { defineComponent, computed } from 'vue';`}

export default defineComponent({
  name: '${managerName}',
  
  props: {
    name: {
      type: String,
      required: true
    },
    size: {
      type: [String, Number],
      default: ${iconSize}
    },
    color: {
      type: String,
      default: ${iconColor ? `'${iconColor}'` : "'currentColor'"}
    },
    strokeWidth: {
      type: [String, Number],
      default: ${iconStroke}
    }
  },
  
  setup(props) {
    const sizeValue = computed(() => {
      return typeof props.size === 'number' ? \`\${props.size}px\` : props.size;
    });
    
    return {
      sizeValue
    };
  }
});
</script>`;
  }
  
  iconFiles.set(`${managerName}.vue`, iconComponentContent);
  
  // Generate index file
  let indexContent = `${hasTypescript ? `import { App } from 'vue';
import ${managerName} from './${managerName}.vue';

export { ${managerName} };

export default {
  install: (app: App): void => {
    app.component('${managerName}', ${managerName});
  }
};` : `import ${managerName} from './${managerName}.vue';

export { ${managerName} };

export default {
  install: (app) => {
    app.component('${managerName}', ${managerName});
  }
};`}`;
  
  iconFiles.set(`index${hasTypescript ? '.ts' : '.js'}`, indexContent);
  
  // Generate example usage file
  let exampleContent = `<template>
  <div>
    <h1>Icon Examples</h1>
    
    <!-- Basic usage -->
    <div class="example-section">
      <h2>Basic Usage</h2>
      <${managerName} name="${icons.length > 0 ? icons[0] : 'activity'}" />
    </div>
    
    <!-- Custom size -->
    <div class="example-section">
      <h2>Custom Size</h2>
      <${managerName} name="${icons.length > 0 ? icons[0] : 'activity'}" :size="32" />
    </div>
    
    <!-- Custom color -->
    <div class="example-section">
      <h2>Custom Color</h2>
      <${managerName} name="${icons.length > 0 ? icons[0] : 'activity'}" color="red" />
    </div>
    
    <!-- Custom stroke width -->
    <div class="example-section">
      <h2>Custom Stroke Width</h2>
      <${managerName} name="${icons.length > 0 ? icons[0] : 'activity'}" :stroke-width="1" />
    </div>
    
    <!-- Multiple icons -->
    <div class="example-section">
      <h2>Multiple Icons</h2>
      <div class="icon-grid">
        ${icons.slice(0, 5).map(icon => `<${managerName} name="${icon}" />`).join('\n        ')}
      </div>
    </div>
  </div>
</template>

<script${hasTypescript ? ' lang="ts"' : ''}>
${hasTypescript ? `import { defineComponent } from 'vue';` : ''}
import ${managerName} from './${managerName}.vue';

export default ${hasTypescript ? 'defineComponent({' : '{'}
  name: 'IconExample',
  components: {
    ${managerName}
  }
${hasTypescript ? '});' : '};'}
</script>

<style scoped>
.example-section {
  margin-bottom: 20px;
}

.icon-grid {
  display: flex;
  gap: 10px;
}
</style>`;
  
  iconFiles.set(`Example.vue`, exampleContent);
}

/**
 * Generate Angular Icon Manager
 * 
 * @param iconFiles Map of file paths to content
 * @param options Icon Manager options
 */
function generateAngularIconManager(iconFiles: Map<string, string>, options: IconManagerOptions): void {
  const {
    name,
    library,
    styling,
    typescript,
    icons = [],
    customIcons = [],
    options: iconOptions = {
      size: '24',
      stroke: '2',
      includeAll: false,
      lazyLoad: true,
      optimizeSVG: true
    }
  } = options;

  const managerName = formatComponentName(name);
  const kebabName = toKebabCase(name);
  const hasTypescript = typescript; // Angular always uses TypeScript
  const includeAll = iconOptions.includeAll;
  const lazyLoad = iconOptions.lazyLoad;
  const iconSize = iconOptions.size || '24';
  const iconColor = iconOptions.color;
  const iconStroke = iconOptions.stroke || '2';
  
  // Generate module file
  let moduleContent = `import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ${managerName}Component } from './${kebabName}.component';

@NgModule({
  declarations: [${managerName}Component],
  imports: [CommonModule],
  exports: [${managerName}Component]
})
export class ${managerName}Module { }
`;
  
  iconFiles.set(`${kebabName}.module.ts`, moduleContent);
  
  // Generate component file
  let componentContent = '';
  
  if (library === 'lucide') {
    componentContent = `import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as LucideIcons from 'lucide-angular';

@Component({
  selector: 'app-${kebabName}',
  template: \`
    <ng-container *ngIf="iconComponent">
      <ng-container *ngComponentOutlet="iconComponent; injector: iconInjector"></ng-container>
    </ng-container>
  \`,
  styles: []
})
export class ${managerName}Component implements OnChanges {
  @Input() name: string = '';
  @Input() size: string | number = ${iconSize};
  @Input() color: string = ${iconColor ? `'${iconColor}'` : 'undefined'};
  @Input() strokeWidth: string | number = ${iconStroke};
  
  iconComponent: any;
  iconInjector: any;
  
  ngOnChanges(changes: SimpleChanges): void {
    this.updateIcon();
  }
  
  private updateIcon(): void {
    // This is a placeholder implementation
    // Replace with the actual implementation for Lucide Angular
    this.iconComponent = LucideIcons[this.name] || LucideIcons.HelpCircle;
    
    // Create injector with the icon properties
    // This is a placeholder and should be replaced with the actual implementation
    this.iconInjector = {
      size: this.size,
      color: this.color,
      strokeWidth: this.strokeWidth
    };

    }
}
`;
  } else if (library === 'custom') {
    // Generate custom icons file
    let customIconsContent = `// Custom SVG icons
export const icons: { [key: string]: string } = {
${customIcons.map(icon => `  '${icon.name}': '${icon.svg}'`).join(',\n')}
};
`;
    
    // Add the custom icons file to the output
    iconFiles.set('icons.ts', customIconsContent);
  }
}
