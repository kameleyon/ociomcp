import type { IconManagerOptions } from '../icon-manager';

/**
 * Generate Solid.js Icon Manager
 * 
 * @param iconFiles Map of file paths to content
 * @param options Icon Manager options
 */
export function generateSolidIconManager(iconFiles: Map<string, string>, options: IconManagerOptions): void {
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
    let typesContent = `import { JSX } from 'solid-js';

export type IconName = ${includeAll ? 
      '// All icons will be available' : 
      icons.length > 0 ? 
        `'${icons.join(`' | '`)}'` : 
        "'icon1' | 'icon2' | 'icon3' | 'icon4'"};

export interface IconProps extends JSX.SvgSVGAttributes<SVGSVGElement> {
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
    iconComponentContent = `import { createMemo } from 'solid-js';
${hasTypescript ? `import { IconProps } from './types';
import * as LucideIcons from '@lucide/solid';` : `import * as LucideIcons from '@lucide/solid';

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
  const iconProps = createMemo(() => {
    const { name, size = ${iconSize}, color = ${iconColor ? `'${iconColor}'` : 'currentColor'}, strokeWidth = ${iconStroke}, ...rest } = props;
    return {
      size,
      color,
      strokeWidth,
      ...rest
    };
  });
  
  // Get the icon component
  const IconComponent = createMemo(() => {
    return (LucideIcons as any)[props.name] || LucideIcons.HelpCircle;
  });
  
  return (
    <IconComponent {...iconProps()} />
  );
};

export default ${managerName};`;
  } else if (library === 'custom') {
    iconComponentContent = `import { createSignal, createMemo, createEffect, onMount } from 'solid-js';
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
  const [viewBox, setViewBox] = createSignal('0 0 24 24');
  const [svgContent, setSvgContent] = createSignal('');
  
  const updateIcon = () => {
    const iconSvg = customIcons[props.name] || '';
    
    if (!iconSvg) {
      console.warn(\`Icon "\${props.name}" not found\`);
      setSvgContent('');
      return;
    }
    
    // Parse SVG string to get attributes and content
    const parser = new DOMParser();
    const doc = parser.parseFromString(iconSvg, 'image/svg+xml');
    const svgElement = doc.querySelector('svg');
    
    if (!svgElement) {
      console.warn(\`Invalid SVG for icon "\${props.name}"\`);
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
  };
  
  // Update icon when name changes
  createEffect(() => {
    props.name;
    updateIcon();
  });
  
  // Update icon on mount
  onMount(updateIcon);
  
  const sizeValue = createMemo(() => {
    const { size = ${iconSize} } = props;
    return typeof size === 'number' ? \`\${size}px\` : size;
  });
  
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={sizeValue()}
      height={sizeValue()}
      viewBox={viewBox()}
      stroke={props.color || ${iconColor ? `'${iconColor}'` : 'currentColor'}}
      stroke-width={props.strokeWidth || ${iconStroke}}
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
      innerHTML={svgContent()}
      {...props}
    />
  );
};

export default ${managerName};`;
  } else {
    // Generic implementation for other libraries
    iconComponentContent = `import { createMemo } from 'solid-js';
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
  const sizeValue = createMemo(() => {
    const { size = ${iconSize} } = props;
    return typeof size === 'number' ? \`\${size}px\` : size;
  });
  
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={sizeValue()}
      height={sizeValue()}
      viewBox="0 0 24 24"
      stroke={props.color || ${iconColor ? `'${iconColor}'` : 'currentColor'}}
      stroke-width={props.strokeWidth || ${iconStroke}}
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
      {...props}
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
  let exampleContent = `${hasTypescript ? `import type { Component } from 'solid-js';
import ${managerName} from './${managerName}';` : `import ${managerName} from './${managerName}';`}

const IconExample${hasTypescript ? ': Component' : ''} = () => {
  return (
    <div>
      <h1>Icon Examples</h1>
      
      {/* Basic usage */}
      <div class="example-section">
        <h2>Basic Usage</h2>
        <${managerName} name="${icons.length > 0 ? icons[0] : 'activity'}" />
      </div>
      
      {/* Custom size */}
      <div class="example-section">
        <h2>Custom Size</h2>
        <${managerName} name="${icons.length > 0 ? icons[0] : 'activity'}" size={32} />
      </div>
      
      {/* Custom color */}
      <div class="example-section">
        <h2>Custom Color</h2>
        <${managerName} name="${icons.length > 0 ? icons[0] : 'activity'}" color="red" />
      </div>
      
      {/* Custom stroke width */}
      <div class="example-section">
        <h2>Custom Stroke Width</h2>
        <${managerName} name="${icons.length > 0 ? icons[0] : 'activity'}" strokeWidth={1} />
      </div>
      
      {/* Multiple icons */}
      <div class="example-section">
        <h2>Multiple Icons</h2>
        <div class="icon-grid">
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
 * Formats a component name to PascalCase
 */
function formatComponentName(name: string): string {
  return name
    .replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '')
    .replace(/^(.)/, (_, c) => c.toUpperCase());
}