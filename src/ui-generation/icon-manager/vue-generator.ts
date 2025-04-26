import { IconManagerOptions } from './types';
import { formatComponentName } from './utils';

/**
 * Generate Vue Icon Manager
 * 
 * @param iconFiles Map of file paths to content
 * @param options Icon Manager options
 */
export function generateVueIconManager(iconFiles: Map<string, string>, options: IconManagerOptions): void {
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
        return;
      }
      
      // Get SVG content (everything inside the svg tag)
      const content = svgElement.innerHTML;
      
      // Get original viewBox
      const svgViewBox = svgElement.getAttribute('viewBox');
      if (svgViewBox) {
        viewBox.value = svgViewBox;
      }
      
      svgContent.value = content;
    };
    
    // Watch for changes to the name prop
    watch(() => props.name, updateIcon, { immediate: true });
    
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
