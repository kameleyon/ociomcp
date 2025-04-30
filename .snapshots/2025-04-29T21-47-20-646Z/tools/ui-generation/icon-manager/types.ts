// Auto-generated safe fallback for types

export function activate() {
    console.log("[TOOL] types activated (passive mode)");
}

export function onFileWrite() { /* no-op */ }
export function onSessionStart() { /* no-op */ }
export function onCommand() { /* no-op */ }
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

