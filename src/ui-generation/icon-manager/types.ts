/**
 * Types for the IconManager tool
 */

/**
 * Interface for IconManager options
 */
export interface IconManagerOptions {
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
