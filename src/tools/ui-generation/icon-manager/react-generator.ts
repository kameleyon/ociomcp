// Auto-generated safe fallback for react-generator

export function activate() {
    console.log("[TOOL] react-generator activated (passive mode)");
}

export function onFileWrite() { /* no-op */ }
export function onSessionStart() { /* no-op */ }
export function onCommand() { /* no-op */ }
import { IconManagerOptions } from './types';
import { formatComponentName } from './utils';

/**
 * Generate React Icon Manager
 * 
 * @param iconFiles Map of file paths to content
 * @param options Icon Manager options
 */
export function generateReactIconManager(iconFiles: Map<string, string>, options: IconManagerOptions): void {
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

