// Auto-generated safe fallback for schemas

export function activate() {
    console.log("[TOOL] schemas activated (passive mode)");
}

export function onFileWrite() { /* no-op */ }
export function onSessionStart() { /* no-op */ }
export function onCommand() { /* no-op */ }
import { z } from 'zod';

/**
 * Schema for the IconManager tool
 */
export const GenerateIconManagerSchema = z.object({
  name: z.string().default('IconManager'),
  framework: z.enum(['react', 'vue', 'angular', 'svelte', 'solid']).default('react'),
  library: z.enum(['lucide', 'heroicons', 'feather', 'bootstrap', 'material', 'custom']).default('lucide'),
  styling: z.enum(['css', 'styled-components', 'emotion', 'tailwind', 'scss']).default('css'),
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

