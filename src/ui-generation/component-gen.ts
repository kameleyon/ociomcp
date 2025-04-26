/**
 * Component Generator
 * 
 * Creates reusable UI components with specified styles
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { z } from 'zod';

/**
 * Component style enum
 */
export enum ComponentStyle {
  BASIC = 'basic',
  CARD = 'card',
  FORM = 'form',
  LIST = 'list',
  TABLE = 'table',
  HERO = 'hero',
  FEATURE = 'feature',
  PRICING = 'pricing',
  CTA = 'cta',
  FOOTER = 'footer'
}

/**
 * Schema for ComponentGen
 */
export const GenerateComponentSchema = z.object({
  name: z.string(),
  framework: z.enum(['react', 'vue', 'angular', 'svelte', 'solid']).default('react'),
  type: z.enum(['functional', 'class', 'hook']).default('functional'),
  features: z.array(z.enum([
    'props', 'state', 'effects', 'context', 'events', 'styles', 'animation',
    'accessibility', 'i18n', 'theme', 'responsive', 'form', 'list', 'modal',
    'navigation', 'auth', 'data-fetching', 'error-handling'
  ])).optional(),
  styling: z.enum(['css', 'scss', 'less', 'styled-components', 'emotion', 'tailwind', 'none']).default('css'),
  typescript: z.boolean().default(true),
  outputDir: z.string().optional(),
  description: z.string().optional(),
  props: z.array(z.object({
    name: z.string(),
    type: z.string(),
    required: z.boolean().optional().default(false),
    defaultValue: z.any().optional(),
    description: z.string().optional()
  })).optional(),
  storybook: z.boolean().optional().default(false),
  test: z.boolean().optional().default(false),
});

/**
 * Component template interface
 */
interface ComponentTemplate {
  generateComponent: (options: ComponentOptions) => string;
  generateStyles?: (options: ComponentOptions) => string;
  generateTypes?: (options: ComponentOptions) => string;
  generateStorybook?: (options: ComponentOptions) => string;
  generateTest?: (options: ComponentOptions) => string;
  getFileExtension: (typescript: boolean) => string;
  getStyleExtension: (styling: string) => string;
}

/**
 * Component options interface
 */
interface ComponentOptions {
  name: string;
  framework: 'react' | 'vue' | 'angular' | 'svelte' | 'solid';
  type: 'functional' | 'class' | 'hook';
  features?: Array<string>;
  styling: 'css' | 'scss' | 'less' | 'styled-components' | 'emotion' | 'tailwind' | 'none';
  typescript: boolean;
  outputDir?: string;
  description?: string;
  props?: Array<{
    name: string;
    type: string;
    required?: boolean;
    defaultValue?: any;
    description?: string;
  }>;
  storybook?: boolean;
  test?: boolean;
}

/**
 * Format component name to PascalCase
 * 
 * @param name Component name
 * @returns Formatted component name
 */
function formatComponentName(name: string): string {
  return name
    .split(/[-_\s]+/)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('');
}

/**
 * Convert string to kebab-case
 * 
 * @param str String to convert
 * @returns Kebab-case string
 */
function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

/**
 * Map TypeScript type to Vue prop type
 * 
 * @param type TypeScript type
 * @returns Vue prop type
 */
function mapTypeToVuePropType(type: string): string {
  if (type.includes('string')) return 'String';
  if (type.includes('number')) return 'Number';
  if (type.includes('boolean')) return 'Boolean';
  if (type.includes('[]') || type.includes('Array')) return 'Array';
  if (type.includes('{}') || type.includes('object')) return 'Object';
  if (type.includes('Function')) return 'Function';
  return 'null';
}

/**
 * React component template
 */
const reactTemplate: ComponentTemplate = {
  generateComponent: (options: ComponentOptions): string => {
    const {
      name,
      type,
      features = [],
      styling,
      typescript,
      props = [],
      description
    } = options;

    const componentName = formatComponentName(name);
    const hasProps = props.length > 0 || features.includes('props');
    const hasState = features.includes('state');
    const hasEffects = features.includes('effects');
    const hasContext = features.includes('context');
    const hasEvents = features.includes('events');
    const hasAccessibility = features.includes('accessibility');
    const hasI18n = features.includes('i18n');
    const hasTheme = features.includes('theme');
    const hasDataFetching = features.includes('data-fetching');
    const hasErrorHandling = features.includes('error-handling');

    // Generate imports
    let imports = `import React${hasState ? ', { useState' : ''}${hasEffects ? ', useEffect' : ''}${hasContext ? ', useContext' : ''} from 'react';\n`;
    
    // Add styling imports
    if (styling === 'styled-components') {
      imports += `import styled from 'styled-components';\n`;
    } else if (styling === 'emotion') {
      imports += `import { css } from '@emotion/react';\n`;
      imports += `import styled from '@emotion/styled';\n`;
    } else if (styling !== 'none') {
      imports += `import './${componentName}.${reactTemplate.getStyleExtension(styling)}';\n`;
    }

    // Add other feature imports
    if (hasI18n) {
      imports += `import { useTranslation } from 'react-i18n';\n`;
    }
    
    if (hasTheme) {
      imports += `import { useTheme } from '../theme';\n`;
    }

    // Generate props interface
    let propsInterface = '';
    if (typescript && hasProps) {
      propsInterface = `interface ${componentName}Props {\n`;
      
      if (props.length > 0) {
        props.forEach(prop => {
          const required = prop.required ? '' : '?';
          const comment = prop.description ? `  // ${prop.description}\n` : '';
          propsInterface += `${comment}  ${prop.name}${required}: ${prop.type};\n`;
        });
      } else {
        propsInterface += '  // Add your props here\n';
        propsInterface += '  className?: string;\n';
        propsInterface += '  children?: React.ReactNode;\n';
      }
      
      propsInterface += '}\n\n';
    }

    // Generate component based on type
    let component = '';
    
    if (type === 'functional') {
      // Functional component
      component = `${description ? `/**\n * ${description}\n */\n` : ''}`;
      component += typescript && hasProps
        ? `const ${componentName} = (${hasProps ? `props: ${componentName}Props` : ''}): JSX.Element => {\n`
        : `const ${componentName} = (${hasProps ? 'props' : ''}) => {\n`;
      
      // Add state hooks
      if (hasState) {
        component += `  const [state, setState] = useState();\n`;
      }
      
      // Add effect hooks
      if (hasEffects) {
        component += `  useEffect(() => {\n`;
        component += `    // Effect logic here\n`;
        component += `    return () => {\n`;
        component += `      // Cleanup logic here\n`;
        component += `    };\n`;
        component += `  }, []);\n`;
      }
      
      // Add context hooks
      if (hasContext) {
        component += `  const context = useContext(MyContext);\n`;
      }
      
      // Add i18n hooks
      if (hasI18n) {
        component += `  const { t } = useTranslation();\n`;
      }
      
      // Add theme hooks
      if (hasTheme) {
        component += `  const theme = useTheme();\n`;
      }
      
      // Add data fetching
      if (hasDataFetching) {
        component += `  const [data, setData] = useState(null);\n`;
        component += `  const [loading, setLoading] = useState(false);\n`;
        
        if (hasErrorHandling) {
          component += `  const [error, setError] = useState(null);\n`;
        }
        
        component += `\n  useEffect(() => {\n`;
        component += `    const fetchData = async () => {\n`;
        component += `      setLoading(true);\n`;
        component += `      try {\n`;
        component += `        // Replace with actual API call\n`;
        component += `        const response = await fetch('https://api.example.com/data');\n`;
        component += `        const result = await response.json();\n`;
        component += `        setData(result);\n`;
        component += `      } catch (err) {\n`;
        
        if (hasErrorHandling) {
          component += `        setError(err);\n`;
        }
        
        component += `        console.error('Error fetching data:', err);\n`;
        component += `      } finally {\n`;
        component += `        setLoading(false);\n`;
        component += `      }\n`;
        component += `    };\n\n`;
        component += `    fetchData();\n`;
        component += `  }, []);\n`;
      }
      
      // Add event handlers
      if (hasEvents) {
        component += `\n  const handleClick = (event) => {\n`;
        component += `    console.log('Clicked', event);\n`;
        component += `  };\n`;
      }
      
      // Add render
      component += `\n  return (\n`;
      
      if (hasDataFetching && hasErrorHandling) {
        component += `    <div className="${componentName.toLowerCase()}">\n`;
        component += `      {loading && <div>Loading...</div>}\n`;
        component += `      {error && <div>Error: {error.message}</div>}\n`;
        component += `      {!loading && !error && data && (\n`;
        component += `        <div>\n`;
        component += `          {/* Render your data here */}\n`;
        component += `        </div>\n`;
        component += `      )}\n`;
        component += `    </div>\n`;
      } else {
        component += `    <div className="${componentName.toLowerCase()}"${hasEvents ? ' onClick={handleClick}' : ''}${hasAccessibility ? ' role="region" aria-label="Component description"' : ''}>\n`;
        component += `      {/* Component content */}\n`;
        component += `      ${hasI18n ? '{t(\'component.greeting\')}' : componentName}\n`;
        component += `    </div>\n`;
      }
      
      component += `  );\n`;
      component += `};\n\n`;
      
      // Add export
      component += `export default ${componentName};\n`;
    } else if (type === 'class') {
      // Class component
      component = `${description ? `/**\n * ${description}\n */\n` : ''}`;
      component += typescript && hasProps
        ? `class ${componentName} extends React.Component<${componentName}Props${hasState ? ', { [key: string]: any }' : ''}> {\n`
        : `class ${componentName} extends React.Component {\n`;
      
      // Add constructor for state
      if (hasState) {
        component += `  constructor(props${typescript ? `: ${componentName}Props` : ''}) {\n`;
        component += `    super(props);\n`;
        component += `    this.state = {\n`;
        component += `      // Initialize state here\n`;
        component += `    };\n`;
        component += `  }\n\n`;
      }
      
      // Add lifecycle methods
      if (hasEffects) {
        component += `  componentDidMount() {\n`;
        component += `    // Mount logic here\n`;
        component += `  }\n\n`;
        
        component += `  componentWillUnmount() {\n`;
        component += `    // Cleanup logic here\n`;
        component += `  }\n\n`;
      }
      
      // Add event handlers
      if (hasEvents) {
        component += `  handleClick = (event) => {\n`;
        component += `    console.log('Clicked', event);\n`;
        component += `  };\n\n`;
      }
      
      // Add render method
      component += `  render() {\n`;
      component += `    return (\n`;
      component += `      <div className="${componentName.toLowerCase()}"${hasEvents ? ' onClick={this.handleClick}' : ''}${hasAccessibility ? ' role="region" aria-label="Component description"' : ''}>\n`;
      component += `        {/* Component content */}\n`;
      component += `        ${componentName}\n`;
      component += `      </div>\n`;
      component += `    );\n`;
      component += `  }\n`;
      component += `}\n\n`;
      
      // Add export
      component += `export default ${componentName};\n`;
    } else if (type === 'hook') {
      // Custom hook
      component = `${description ? `/**\n * ${description}\n */\n` : ''}`;
      component += `function use${componentName}(${typescript ? 'initialValue?: any' : ''}) {\n`;
      
      // Add state
      component += `  const [value, setValue] = useState(initialValue);\n`;
      
      // Add effect
      component += `  useEffect(() => {\n`;
      component += `    // Effect logic here\n`;
      component += `    return () => {\n`;
      component += `      // Cleanup logic here\n`;
      component += `    };\n`;
      component += `  }, []);\n\n`;
      
      // Add custom logic
      component += `  const updateValue = (newValue${typescript ? ': any' : ''}) => {\n`;
      component += `    setValue(newValue);\n`;
      component += `  };\n\n`;
      
      // Return hook values
      component += `  return { value, updateValue };\n`;
      component += `}\n\n`;
      
      // Add export
      component += `export default use${componentName};\n`;
    }
    
    return imports + propsInterface + component;
  },
  
  generateStyles: (options: ComponentOptions): string => {
    const { name, styling, features = [] } = options;
    const componentName = formatComponentName(name);
    const hasResponsive = features.includes('responsive');
    const hasAnimation = features.includes('animation');
    const hasTheme = features.includes('theme');
    
    let styles = '';
    
    if (styling === 'css' || styling === 'scss' || styling === 'less') {
      styles = `.${componentName.toLowerCase()} {\n`;
      styles += `  display: flex;\n`;
      styles += `  flex-direction: column;\n`;
      styles += `  padding: 1rem;\n`;
      
      if (hasTheme) {
        styles += `  color: var(--text-color);\n`;
        styles += `  background-color: var(--bg-color);\n`;
      } else {
        styles += `  color: #333;\n`;
        styles += `  background-color: #fff;\n`;
      }
      
      styles += `}\n`;
      
      if (hasResponsive) {
        styles += `\n/* Responsive styles */\n`;
        styles += `@media (max-width: 768px) {\n`;
        styles += `  .${componentName.toLowerCase()} {\n`;
        styles += `    padding: 0.5rem;\n`;
        styles += `  }\n`;
        styles += `}\n`;
      }
      
      if (hasAnimation) {
        styles += `\n/* Animation */\n`;
        styles += `@keyframes fadeIn {\n`;
        styles += `  from { opacity: 0; }\n`;
        styles += `  to { opacity: 1; }\n`;
        styles += `}\n\n`;
        styles += `.${componentName.toLowerCase()} {\n`;
        styles += `  animation: fadeIn 0.3s ease-in-out;\n`;
        styles += `}\n`;
      }
    } else if (styling === 'styled-components' || styling === 'emotion') {
      styles = `import styled from '${styling === 'styled-components' ? 'styled-components' : '@emotion/styled'}';\n\n`;
      
      styles += `export const ${componentName}Container = styled.div\`\n`;
      styles += `  display: flex;\n`;
      styles += `  flex-direction: column;\n`;
      styles += `  padding: 1rem;\n`;
      
      if (hasTheme) {
        styles += `  color: \${props => props.theme.textColor};\n`;
        styles += `  background-color: \${props => props.theme.bgColor};\n`;
      } else {
        styles += `  color: #333;\n`;
        styles += `  background-color: #fff;\n`;
      }
      
      if (hasResponsive) {
        styles += `\n  /* Responsive styles */\n`;
        styles += `  @media (max-width: 768px) {\n`;
        styles += `    padding: 0.5rem;\n`;
        styles += `  }\n`;
      }
      
      if (hasAnimation) {
        styles += `\n  /* Animation */\n`;
        styles += `  animation: fadeIn 0.3s ease-in-out;\n`;
        styles += `  @keyframes fadeIn {\n`;
        styles += `    from { opacity: 0; }\n`;
        styles += `    to { opacity: 1; }\n`;
        styles += `  }\n`;
      }
      
      styles += `\`;\n`;
    } else if (styling === 'tailwind') {
      // For Tailwind, we just return a comment since the classes will be applied directly in the component
      styles = `/* Tailwind classes will be applied directly in the component */\n`;
      styles += `/* Example classes for ${componentName}:\n`;
      styles += `   flex flex-col p-4 text-gray-800 bg-white\n`;
      
      if (hasResponsive) {
        styles += `   md:p-6 lg:p-8\n`;
      }
      
      if (hasAnimation) {
        styles += `   animate-fade-in\n`;
      }
      
      styles += `*/\n`;
    }
    
    return styles;
  },
  
  generateTypes: (options: ComponentOptions): string => {
    const { name, props = [] } = options;
    const componentName = formatComponentName(name);
    
    let types = `import React from 'react';\n\n`;
    types += `export interface ${componentName}Props {\n`;
    
    if (props.length > 0) {
      props.forEach(prop => {
        const required = prop.required ? '' : '?';
        const comment = prop.description ? `  // ${prop.description}\n` : '';
        types += `${comment}  ${prop.name}${required}: ${prop.type};\n`;
      });
    } else {
      types += '  // Add your props here\n';
      types += '  className?: string;\n';
      types += '  children?: React.ReactNode;\n';
    }
    
    types += '}\n';
    
    return types;
  },
  
  generateStorybook: (options: ComponentOptions): string => {
    const { name, props = [], typescript } = options;
    const componentName = formatComponentName(name);
    const extension = reactTemplate.getFileExtension(typescript);
    
    let story = `import React from 'react';\n`;
    story += `import { Story, Meta } from '@storybook/react';\n\n`;
    story += `import ${componentName}${typescript ? `, { ${componentName}Props }` : ''} from './${componentName}';\n\n`;
    
    story += `export default {\n`;
    story += `  title: 'Components/${componentName}',\n`;
    story += `  component: ${componentName},\n`;
    story += `  argTypes: {\n`;
    
    // Add argTypes for props
    if (props.length > 0) {
      props.forEach(prop => {
        story += `    ${prop.name}: {\n`;
        
        if (prop.description) {
          story += `      description: '${prop.description}',\n`;
        }
        
        // Add control type based on prop type
        if (prop.type === 'string') {
          story += `      control: 'text',\n`;
        } else if (prop.type === 'number') {
          story += `      control: 'number',\n`;
        } else if (prop.type === 'boolean') {
          story += `      control: 'boolean',\n`;
        } else if (prop.type.includes('string[]')) {
          story += `      control: 'array',\n`;
        } else if (prop.type.includes('|')) {
          story += `      control: 'select',\n`;
          story += `      options: [${prop.type.replace(/['"]/g, '').split('|').map(t => `'${t.trim()}'`).join(', ')}],\n`;
        }
        
        story += `    },\n`;
      });
    }
    
    story += `  },\n`;
    story += `} as Meta;\n\n`;
    
    // Create template
    story += typescript
      ? `const Template: Story<${componentName}Props> = (args) => <${componentName} {...args} />;\n\n`
      : `const Template = (args) => <${componentName} {...args} />;\n\n`;
    
    // Create default story
    story += `export const Default = Template.bind({});\n`;
    story += `Default.args = {\n`;
    
    // Add default args for props
    if (props.length > 0) {
      props.forEach(prop => {
        if (prop.defaultValue !== undefined) {
          if (typeof prop.defaultValue === 'string') {
            story += `  ${prop.name}: '${prop.defaultValue}',\n`;
          } else {
            story += `  ${prop.name}: ${JSON.stringify(prop.defaultValue)},\n`;
          }
        }
      });
    }
    
    story += `};\n`;
    
    return story;
  },
  
  generateTest: (options: ComponentOptions): string => {
    const { name, typescript } = options;
    const componentName = formatComponentName(name);
    const extension = reactTemplate.getFileExtension(typescript);
    
    let test = `import React from 'react';\n`;
    test += `import { render, screen } from '@testing-library/react';\n`;
    test += `import userEvent from '@testing-library/user-event';\n`;
    test += `import ${componentName} from './${componentName}';\n\n`;
    
    test += `describe('${componentName}', () => {\n`;
    test += `  test('renders correctly', () => {\n`;
    test += `    render(<${componentName} />);\n`;
    test += `    // Add your assertions here\n`;
    test += `    expect(screen.getByText(/${componentName}/i)).toBeInTheDocument();\n`;
    test += `  });\n\n`;
    
    test += `  test('handles interactions', async () => {\n`;
    test += `    render(<${componentName} />);\n`;
    test += `    // Add your interaction tests here\n`;
    test += `    // Example: await userEvent.click(screen.getByRole('button'));\n`;
    test += `    // expect(screen.getByText(/clicked/i)).toBeInTheDocument();\n`;
    test += `  });\n`;
    test += `});\n`;
    
    return test;
  },
  
  getFileExtension: (typescript: boolean): string => {
    return typescript ? 'tsx' : 'jsx';
  },
  
  getStyleExtension: (styling: string): string => {
    switch (styling) {
      case 'scss':
        return 'scss';
      case 'less':
        return 'less';
      default:
        return 'css';
    }
  }
};

/**
 * Vue component template
 */
const vueTemplate: ComponentTemplate = {
  generateComponent: (options: ComponentOptions): string => {
    const {
      name,
      features = [],
      styling,
      typescript,
      props = [],
      description
    } = options;

    const componentName = formatComponentName(name);
    const hasProps = props.length > 0 || features.includes('props');
    const hasState = features.includes('state');
    const hasEffects = features.includes('effects');
    const hasEvents = features.includes('events');
    const hasAccessibility = features.includes('accessibility');
    const hasI18n = features.includes('i18n');
    const hasTheme = features.includes('theme');
    
    let component = '';
    
    // Add template section
    component += `<template>\n`;
    component += `  <div class="${componentName.toLowerCase()}"${hasAccessibility ? ' role="region" aria-label="Component description"' : ''}>\n`;
    component += `    <!-- Component content -->\n`;
    component += `    ${hasI18n ? '{{ $t(\'component.greeting\') }}' : componentName}\n`;
    component += `  </div>\n`;
    component += `</template>\n\n`;
    
    // Add script section
    component += `<script${typescript ? ' lang="ts"' : ''}>\n`;
    
    if (typescript) {
      component += `import { defineComponent${hasProps ? ', PropType' : ''} } from 'vue';\n\n`;
      component += `export default defineComponent({\n`;
    } else {
      component += `export default {\n`;
    }
    
    // Add component name
    component += `  name: '${componentName}',\n\n`;
    
    // Add props
    if (hasProps) {
      component += `  props: {\n`;
      
      if (props.length > 0) {
        props.forEach(prop => {
          component += `    ${prop.name}: {\n`;
          
          if (typescript) {
            component += `      type: ${mapTypeToVuePropType(prop.type)} as PropType<${prop.type}>,\n`;
          } else {
            component += `      type: ${mapTypeToVuePropType(prop.type)},\n`;
          }
          
          if (prop.required) {
            component += `      required: true,\n`;
          }
          
          if (prop.defaultValue !== undefined) {
            component += `      default: ${JSON.stringify(prop.defaultValue)},\n`;
          }
          
          component += `    },\n`;
        });
      } else {
        component += `    // Add your props here\n`;
      }
      
      component += `  },\n\n`;
    }
    
    // Add data for state
    if (hasState) {
      component += `  data() {\n`;
      component += `    return {\n`;
      component += `      // Add your state here\n`;
      component += `    };\n`;
      component += `  },\n\n`;
    }
    
    // Add computed properties
    component += `  computed: {\n`;
    component += `    // Add your computed properties here\n`;
    component += `  },\n\n`;
    
    // Add methods
    component += `  methods: {\n`;
    
    if (hasEvents) {
      component += `    handleClick(event) {\n`;
      component += `      console.log('Clicked', event);\n`;
      component += `      this.$emit('click', event);\n`;
      component += `    },\n`;
    }
    
    component += `  },\n\n`;
    
    // Add lifecycle hooks
    if (hasEffects) {
      component += `  mounted() {\n`;
      component += `    // Mounted logic here\n`;
      component += `  },\n\n`;
      
      component += `  beforeUnmount() {\n`;
      component += `    // Cleanup logic here\n`;
      component += `  },\n`;
    }
    
    component += typescript ? `});\n` : `};\n`;
    component += `</script>\n\n`;
    
    // Add style section
    if (styling !== 'none') {
      component += `<style${styling !== 'css' ? ` lang="${styling}"` : ''} scoped>\n`;
      component += `.${componentName.toLowerCase()} {\n`;
      component += `  display: flex;\n`;
      component += `  flex-direction: column;\n`;
      component += `  padding: 1rem;\n`;
      
      if (hasTheme) {
        component += `  color: var(--text-color);\n`;
        component += `  background-color: var(--bg-color);\n`;
      } else {
        component += `  color: #333;\n`;
        component += `  background-color: #fff;\n`;
      }
      
      component += `}\n`;
      component += `</style>\n`;
    }
    
    return component;
  },
  
  getFileExtension: (typescript: boolean): string => {
    return 'vue';
  },
  
  getStyleExtension: (styling: string): string => {
    return styling;
  }
};

/**
 * Angular component template
 */
const angularTemplate: ComponentTemplate = {
  generateComponent: (options: ComponentOptions): string => {
    const {
      name,
      features = [],
      styling,
      typescript,
      props = [],
      description
    } = options;

    const componentName = formatComponentName(name);
    const kebabCaseName = toKebabCase(componentName);
    const hasProps = props.length > 0 || features.includes('props');
    const hasState = features.includes('state');
    const hasEffects = features.includes('effects');
    const hasEvents = features.includes('events');
    const hasAccessibility = features.includes('accessibility');
    const hasI18n = features.includes('i18n');
    const hasTheme = features.includes('theme');
    
    let component = '';
    
    // Add imports
    component += `import { Component${hasProps ? ', Input' : ''}${hasEvents ? ', Output, EventEmitter' : ''}${hasEffects ? ', OnInit, OnDestroy' : ''} } from '@angular/core';\n`;
    
    if (hasI18n) {
      component += `import { TranslateService } from '@ngx-translate/core';\n`;
    }
    
    component += `\n`;
    
    // Add component decorator
    component += `@Component({\n`;
    component += `  selector: 'app-${kebabCaseName}',\n`;
    component += `  templateUrl: './${kebabCaseName}.component.html',\n`;
    component += `  styleUrls: ['./${kebabCaseName}.component.css']\n`;
    component += `})\n`;
    component += `export class ${componentName}Component {\n`;
    
    // Add properties
    if (options.props && options.props.length > 0) {
      options.props.forEach(prop => {
        component += `  @Input() ${prop.name}: ${prop.type || 'any'}${prop.required === false ? ' | undefined' : ''}${prop.defaultValue ? ` = ${prop.defaultValue}` : ''};\n`;
      });
      component += '\n';
    }
    
    // Add constructor
    component += `  constructor() {}\n`;
    
    // Close class
    component += `}\n`;
    
    return component;
  },
  
  getFileExtension: (typescript: boolean): string => {
    return 'ts';
  },
  
  getStyleExtension: (styling: string): string => {
    switch (styling) {
      case 'scss':
        return 'scss';
      case 'less':
        return 'less';
      default:
        return 'css';
    }
  }
}

/**
 * Generates a React component with the given name and properties.
 * @param name - The name of the component.
 * @param props - The properties for the component.
 * @returns The generated React component code as a string.
 */
export function generateReactComponent(name: string, props: Record<string, any>): string {
  const propsString = Object.keys(props).map(key => `${key}: ${props[key]}`).join(', ');
  return `
import React from 'react';

interface Props {
  ${propsString}
}

const \${name}: React.FC<Props> = ({ ${Object.keys(props).join(', ')} }) => {
  return (
    <div>
      {/* Component implementation */}
    </div>
  );
};

export default \${name};
`;
}
