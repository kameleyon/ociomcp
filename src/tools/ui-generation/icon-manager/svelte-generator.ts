// Auto-generated safe fallback for svelte-generator

export function activate() {
    console.log("[TOOL] svelte-generator activated (passive mode)");
}

export function onFileWrite() { /* no-op */ }
export function onSessionStart() { /* no-op */ }
export function onCommand() { /* no-op */ }
import type { IconManagerOptions } from '../icon-manager';

/**
 * Generate Svelte Icon Manager
 * 
 * @param iconFiles Map of file paths to content
 * @param options Icon Manager options
 */
export function generateSvelteIconManager(iconFiles: Map<string, string>, options: IconManagerOptions): void {
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
    iconComponentContent = `<script${hasTypescript ? ' lang="ts"' : ''}>
  ${hasTypescript ? `import type { IconProps } from './types';
  import * as LucideIcons from 'lucide-svelte';` : `import * as LucideIcons from 'lucide-svelte';`}
  
  export let name${hasTypescript ? ': string' : ''};
  export let size${hasTypescript ? ': string | number' : ''} = ${iconSize};
  export let color${hasTypescript ? ': string' : ''} = ${iconColor ? `'${iconColor}'` : "'currentColor'"};
  export let strokeWidth${hasTypescript ? ': string | number' : ''} = ${iconStroke};
  
  $: IconComponent = LucideIcons[name] || LucideIcons.HelpCircle;
</script>

<svelte:component this={IconComponent} {size} {color} strokeWidth={strokeWidth} {...$$restProps} />`;
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
    iconComponentContent = `<script${hasTypescript ? ' lang="ts"' : ''}>
  ${hasTypescript ? `import { onMount } from 'svelte';
  import { icons } from './custom-icons';` : `import { onMount } from 'svelte';
  import { icons } from './custom-icons';`}
  
  export let name${hasTypescript ? ': string' : ''};
  export let size${hasTypescript ? ': string | number' : ''} = ${iconSize};
  export let color${hasTypescript ? ': string' : ''} = ${iconColor ? `'${iconColor}'` : "'currentColor'"};
  export let strokeWidth${hasTypescript ? ': string | number' : ''} = ${iconStroke};
  
  let viewBox = '0 0 24 24';
  let svgContent = '';
  
  $: sizeValue = typeof size === 'number' ? \`\${size}px\` : size;
  
  function updateIcon() {
    const iconSvg = icons[name] || '';
    
    if (!iconSvg) {
      console.warn(\`Icon "\${name}" not found\`);
      svgContent = '';
      return;
    }
    
    // Parse SVG string to get attributes and content
    const parser = new DOMParser();
    const doc = parser.parseFromString(iconSvg, 'image/svg+xml');
    const svgElement = doc.querySelector('svg');
    
    if (!svgElement) {
      console.warn(\`Invalid SVG for icon "\${name}"\`);
      svgContent = '';
      return;
    }
    
    // Get SVG content (everything inside the svg tag)
    svgContent = svgElement.innerHTML;
    
    // Get original viewBox
    const svgViewBox = svgElement.getAttribute('viewBox');
    if (svgViewBox) {
      viewBox = svgViewBox;
    }
  }
  
  $: {
    // Update icon when name changes
    name;
    updateIcon();
  }
  
  onMount(updateIcon);
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width={sizeValue}
  height={sizeValue}
  {viewBox}
  stroke={color}
  stroke-width={strokeWidth}
  fill="none"
  stroke-linecap="round"
  stroke-linejoin="round"
  {...$$restProps}
>
  {@html svgContent}
</svg>`;
  } else {
    // Generic implementation for other libraries
    iconComponentContent = `<script${hasTypescript ? ' lang="ts"' : ''}>
  export let name${hasTypescript ? ': string' : ''};
  export let size${hasTypescript ? ': string | number' : ''} = ${iconSize};
  export let color${hasTypescript ? ': string' : ''} = ${iconColor ? `'${iconColor}'` : "'currentColor'"};
  export let strokeWidth${hasTypescript ? ': string | number' : ''} = ${iconStroke};
  
  $: sizeValue = typeof size === 'number' ? \`\${size}px\` : size;
</script>

<div class="icon-wrapper">
  <!-- This is a placeholder implementation -->
  <!-- Replace with the actual implementation for the selected library -->
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={sizeValue}
    height={sizeValue}
    viewBox="0 0 24 24"
    stroke={color}
    stroke-width={strokeWidth}
    fill="none"
    stroke-linecap="round"
    stroke-linejoin="round"
    {...$$restProps}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
</div>`;
  }
  
  iconFiles.set(`${managerName}.svelte`, iconComponentContent);
  
  // Generate types file if using TypeScript
  if (hasTypescript) {
    let typesContent = `export type IconName = ${includeAll ? 
      '// All icons will be available' : 
      icons.length > 0 ? 
        `'${icons.join(`' | '`)}'` : 
        "'icon1' | 'icon2' | 'icon3' | 'icon4'"};

export interface IconProps {
  name: IconName;
  size?: string | number;
  color?: string;
  strokeWidth?: string | number;
}
`;
    
    iconFiles.set(`types.ts`, typesContent);
  }
  
  // Generate index file
  let indexContent = `${hasTypescript ? `import ${managerName} from './${managerName}.svelte';
${hasTypescript ? `import type { IconProps, IconName } from './types';

export type { IconProps, IconName };` : ''}
export default ${managerName};` : `import ${managerName} from './${managerName}.svelte';
export default ${managerName};`}`;
  
  iconFiles.set(`index${hasTypescript ? '.ts' : '.js'}`, indexContent);
  
  // Generate example usage file
  let exampleContent = `<script${hasTypescript ? ' lang="ts"' : ''}>
  import ${managerName} from './${managerName}.svelte';
</script>

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
    <${managerName} name="${icons.length > 0 ? icons[0] : 'activity'}" size={32} />
  </div>
  
  <!-- Custom color -->
  <div class="example-section">
    <h2>Custom Color</h2>
    <${managerName} name="${icons.length > 0 ? icons[0] : 'activity'}" color="red" />
  </div>
  
  <!-- Custom stroke width -->
  <div class="example-section">
    <h2>Custom Stroke Width</h2>
    <${managerName} name="${icons.length > 0 ? icons[0] : 'activity'}" strokeWidth={1} />
  </div>
  
  <!-- Multiple icons -->
  <div class="example-section">
    <h2>Multiple Icons</h2>
    <div class="icon-grid">
      ${icons.slice(0, 5).map(icon => `<${managerName} name="${icon}" />`).join('\n      ')}
    </div>
  </div>
</div>

<style>
  .example-section {
    margin-bottom: 20px;
  }
  
  .icon-grid {
    display: flex;
    gap: 10px;
  }
</style>`;
  
  iconFiles.set(`Example.svelte`, exampleContent);
}

/**
 * Formats a component name to PascalCase
 */
function formatComponentName(name: string): string {
  return name
    .replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '')
    .replace(/^(.)/, (_, c) => c.toUpperCase());
}
