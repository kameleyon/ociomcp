// Auto-generated safe fallback for component-templates

export function activate() {
    console.log("[TOOL] component-templates activated (passive mode)");
}

export function onFileWrite(filePath: string, content: string) {
  console.log(`[TOOL] Component templates processing file: ${filePath}`);
  
  // Check if the file is a component template file
  const isTemplateFile = filePath.includes('component-templates') || filePath.endsWith('.template.ts');
  
  if (isTemplateFile) {
    console.log(`[TOOL] Detected change in component template file: ${filePath}`);
    // In a real implementation, we might reload or update the templates
  }
}

export function onSessionStart(sessionId: string) {
  console.log(`[TOOL] Component templates initialized for session: ${sessionId}`);
  
  // Check for existing component templates
  setTimeout(() => {
    console.log('[TOOL] Checking for existing component templates...');
    checkExistingTemplates();
  }, 3000); // Delay to ensure project files are loaded
}

export function onCommand(command: string, args: any[]) {
  if (command === 'list-component-templates') {
    console.log('[TOOL] Listing component templates...');
    
    return handleListComponentTemplates();
  } else if (command === 'get-component-template') {
    console.log('[TOOL] Getting component template...');
    
    const templateName = args[0];
    const framework = args[1] || 'react';
    
    return handleGetComponentTemplate(templateName, framework);
  } else if (command === 'generate-component-from-template') {
    console.log('[TOOL] Generating component from template...');
    
    const templateName = args[0];
    const options = args[1];
    
    return handleGenerateComponentFromTemplate(templateName, options);
  }
  
  return null;
}

/**
 * Checks for existing component templates
 */
function checkExistingTemplates() {
  console.log('[TOOL] Checking for existing component templates...');
  
  // This is a placeholder - in a real implementation, this would scan the filesystem
  // For now, we'll just log a message
  console.log('[TOOL] Recommendation: Use the "list-component-templates" command to see available templates');
  console.log('[TOOL] Common template tasks:');
  console.log('- Listing available templates');
  console.log('- Getting a specific template');
  console.log('- Generating a component from a template');
}

/**
 * Handles the list-component-templates command
 */
async function handleListComponentTemplates(): Promise<any> {
  console.log('[TOOL] Handling list-component-templates command');
  // Placeholder implementation
  return { success: true, templates: ['basic', 'card', 'form', 'list', 'table', 'hero', 'feature', 'pricing', 'cta', 'footer'] };
}

/**
 * Handles the get-component-template command
 */
async function handleGetComponentTemplate(templateName: string, framework: string): Promise<any> {
  console.log(`[TOOL] Handling get-component-template command for ${templateName} (${framework})`);
  // Placeholder implementation
  return { success: true, template: { name: templateName, framework: framework, content: 'Mock template content' } };
}

/**
 * Handles the generate-component-from-template command
 */
async function handleGenerateComponentFromTemplate(templateName: string, options: any): Promise<any> {
  console.log(`[TOOL] Handling generate-component-from-template command for ${templateName} with options:`, options);
  // Placeholder implementation
  return { success: true, message: `Component generated from template ${templateName} (mock)` };
}
/**
 * Component Templates
 * Provides templates for generating React components with various styles and configurations
 */

/**
 * Component type definitions
 */
export enum ComponentType {
  FUNCTIONAL = 'functional',
  CLASS = 'class',
  HOOK = 'hook',
  PAGE = 'page',
  LAYOUT = 'layout',
}

/**
 * Component style definitions
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
  FOOTER = 'footer',
}

/**
 * Component framework definitions
 */
export enum ComponentFramework {
  REACT = 'react',
  NEXT = 'next',
  REMIX = 'remix',
  VUE = 'vue',
  SVELTE = 'svelte',
}

/**
 * Component styling framework definitions
 */
export enum StylingFramework {
  TAILWIND = 'tailwind',
  CSS_MODULES = 'css-modules',
  STYLED_COMPONENTS = 'styled-components',
  EMOTION = 'emotion',
  VANILLA_CSS = 'vanilla-css',
}

/**
 * Component options
 */
export interface ComponentOptions {
  name: string;
  type: ComponentType;
  style: ComponentStyle;
  framework: ComponentFramework;
  styling: StylingFramework;
  props?: string[];
  state?: string[];
  hooks?: string[];
  imports?: string[];
  description?: string;
  withTests?: boolean;
  withStories?: boolean;
  responsive?: boolean;
  darkMode?: boolean;
  animations?: boolean;
  accessibility?: boolean;
}

/**
 * Default component options
 */
export const DEFAULT_COMPONENT_OPTIONS: Partial<ComponentOptions> = {
  type: ComponentType.FUNCTIONAL,
  framework: ComponentFramework.REACT,
  styling: StylingFramework.TAILWIND,
  responsive: true,
  darkMode: true,
  animations: true,
  accessibility: true,
};

/**
 * Generates a React functional component with Tailwind CSS
 */
export function generateReactFunctionalComponent(options: ComponentOptions): string {
  const {
    name,
    props = [],
    hooks = [],
    imports = [],
    description = `${name} component`,
  } = options;

  // Generate props interface
  const propsInterface = props.length > 0
    ? `interface ${name}Props {
  ${props.map(prop => `${prop}: any;`).join('\n  ')}
}`
    : '';

  // Generate imports
  const defaultImports = [
    "import React from 'react';",
    "import { LucideIcon } from 'lucide-react';",
  ];

  if (hooks.includes('useState')) {
    defaultImports[0] = "import React, { useState } from 'react';";
  }
  if (hooks.includes('useEffect')) {
    defaultImports[0] = defaultImports[0].replace('react\'', 'react\', useEffect');
  }
  if (hooks.includes('useRef')) {
    defaultImports[0] = defaultImports[0].replace('react\'', 'react\', useRef');
  }

  const allImports = [...defaultImports, ...imports].join('\n');

  // Generate state hooks
  const stateHooks = options.state?.map(state => {
    const stateName = state.split(':')[0].trim();
    const stateType = state.includes(':') ? state.split(':')[1].trim() : 'any';
    const stateInitial = stateType === 'string' ? "''" : stateType === 'number' ? '0' : stateType === 'boolean' ? 'false' : '{}';
    return `const [${stateName}, set${stateName.charAt(0).toUpperCase() + stateName.slice(1)}] = useState<${stateType}>(${stateInitial});`;
  }).join('\n  ') || '';

  // Generate component
  return `${allImports}

/**
 * ${description}
 */
${propsInterface ? propsInterface + '\n\n' : ''}export const ${name} = (${props.length > 0 ? `props: ${name}Props` : ''}) => {
  ${stateHooks ? stateHooks + '\n\n  ' : ''}return (
    <div className="rounded-xl shadow-sm p-4">
      <h2 className="text-xl font-semibold">${name}</h2>
      <p>Your component content here</p>
    </div>
  );
};
`;
}

/**
 * Generates a React card component with Tailwind CSS
 */
export function generateReactCardComponent(options: ComponentOptions): string {
  const {
    name,
    props = [],
    description = `${name} card component`,
  } = options;

  // Add default card props if not provided
  if (!props.includes('title')) props.push('title: string');
  if (!props.includes('description')) props.push('description: string');
  if (!props.includes('icon')) props.push('icon?: LucideIcon');

  // Generate props interface
  const propsInterface = `interface ${name}Props {
  ${props.map(prop => `${prop};`).join('\n  ')}
}`;

  // Generate imports
  const imports = [
    "import React from 'react';",
    "import { LucideIcon } from 'lucide-react';",
  ];

  // Generate component
  return `${imports.join('\n')}

/**
 * ${description}
 */
${propsInterface}

export const ${name} = ({ title, description, icon: Icon, ...props }: ${name}Props) => {
  return (
    <div className="rounded-xl shadow-sm p-6 bg-white dark:bg-gray-800 transition-all duration-200 hover:shadow-md">
      {Icon && (
        <div className="mb-4 text-primary">
          <Icon className="h-6 w-6" />
        </div>
      )}
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  );
};
`;
}

/**
 * Generates a React hero section component with Tailwind CSS
 */
export function generateReactHeroComponent(options: ComponentOptions): string {
  const {
    name,
    props = [],
    description = `${name} hero component`,
  } = options;

  // Add default hero props if not provided
  if (!props.includes('title')) props.push('title: string');
  if (!props.includes('subtitle')) props.push('subtitle: string');
  if (!props.includes('ctaText')) props.push('ctaText: string');
  if (!props.includes('ctaLink')) props.push('ctaLink: string');
  if (!props.includes('secondaryCtaText')) props.push('secondaryCtaText?: string');
  if (!props.includes('secondaryCtaLink')) props.push('secondaryCtaLink?: string');
  if (!props.includes('backgroundPattern')) props.push('backgroundPattern?: boolean');

  // Generate props interface
  const propsInterface = `interface ${name}Props {
  ${props.map(prop => `${prop};`).join('\n  ')}
}`;

  // Generate imports
  const imports = [
    "import React from 'react';",
    "import { ArrowRight } from 'lucide-react';",
  ];

  // Generate component
  return `${imports.join('\n')}

/**
 * ${description}
 */
${propsInterface}

export const ${name} = ({
  title,
  subtitle,
  ctaText,
  ctaLink,
  secondaryCtaText,
  secondaryCtaLink,
  backgroundPattern = true,
  ...props
}: ${name}Props) => {
  return (
    <div className="relative overflow-hidden bg-white dark:bg-gray-900">
      {backgroundPattern && (
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute inset-0 bg-grid-gray-900/[0.2] [mask-image:linear-gradient(0deg,white,transparent)]" />
        </div>
      )}
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300">
            {subtitle}
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <a
              href={ctaLink}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {ctaText}
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
            {secondaryCtaText && secondaryCtaLink && (
              <a
                href={secondaryCtaLink}
                className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-700 text-base font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                {secondaryCtaText}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
`;
}

/**
 * Generates a React features section component with Tailwind CSS
 */
export function generateReactFeaturesComponent(options: ComponentOptions): string {
  const {
    name,
    props = [],
    description = `${name} features component`,
  } = options;

  // Add default features props if not provided
  if (!props.includes('title')) props.push('title: string');
  if (!props.includes('subtitle')) props.push('subtitle: string');
  if (!props.includes('features')) props.push('features: Feature[]');

  // Generate props interface
  const propsInterface = `interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
}

interface ${name}Props {
  ${props.map(prop => `${prop};`).join('\n  ')}
}`;

  // Generate imports
  const imports = [
    "import React from 'react';",
    "import { LucideIcon } from 'lucide-react';",
  ];

  // Generate component
  return `${imports.join('\n')}

/**
 * ${description}
 */
${propsInterface}

export const ${name} = ({
  title,
  subtitle,
  features,
  ...props
}: ${name}Props) => {
  return (
    <div className="py-16 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300">
            {subtitle}
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="pt-6">
                  <div className="rounded-xl shadow-sm px-6 py-8 h-full bg-white dark:bg-gray-800 transition-all duration-200 hover:shadow-md">
                    <div className="text-primary">
                      <Icon className="h-8 w-8" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
`;
}

/**
 * Generates a React pricing section component with Tailwind CSS
 */
export function generateReactPricingComponent(options: ComponentOptions): string {
  const {
    name,
    props = [],
    description = `${name} pricing component`,
  } = options;

  // Add default pricing props if not provided
  if (!props.includes('title')) props.push('title: string');
  if (!props.includes('subtitle')) props.push('subtitle: string');
  if (!props.includes('plans')) props.push('plans: PricingPlan[]');

  // Generate props interface
  const propsInterface = `interface PricingFeature {
  name: string;
  included: boolean;
}

interface PricingPlan {
  name: string;
  price: string;
  description: string;
  features: PricingFeature[];
  ctaText: string;
  ctaLink: string;
  popular?: boolean;
}

interface ${name}Props {
  ${props.map(prop => `${prop};`).join('\n  ')}
}`;

  // Generate imports
  const imports = [
    "import React from 'react';",
    "import { Check, X } from 'lucide-react';",
  ];

  // Generate component
  return `${imports.join('\n')}

/**
 * ${description}
 */
${propsInterface}

export const ${name} = ({
  title,
  subtitle,
  plans,
  ...props
}: ${name}Props) => {
  return (
    <div className="py-16 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300">
            {subtitle}
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={\`rounded-xl shadow-sm p-8 bg-white dark:bg-gray-800 border \${
                plan.popular 
                  ? 'border-primary ring-2 ring-primary' 
                  : 'border-gray-200 dark:border-gray-700'
              } relative flex flex-col\`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary text-white">
                    Popular
                  </span>
                </div>
              )}
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">{plan.name}</h3>
              <p className="mt-4 text-gray-500 dark:text-gray-400">{plan.description}</p>
              <div className="mt-6 flex items-baseline">
                <span className="text-4xl font-extrabold text-gray-900 dark:text-white">{plan.price}</span>
                {plan.price !== 'Free' && <span className="ml-1 text-xl font-medium text-gray-500 dark:text-gray-400">/mo</span>}
              </div>
              <ul className="mt-6 space-y-4 flex-1">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <div className="flex-shrink-0">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <X className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    <p className="ml-3 text-base text-gray-500 dark:text-gray-400">
                      {feature.name}
                    </p>
                  </li>
                ))}
              </ul>
              <a
                href={plan.ctaLink}
                className={\`mt-8 block w-full px-4 py-2 rounded-md text-center font-medium \${
                  plan.popular
                    ? 'bg-primary text-white hover:bg-primary/90'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                }\`}
              >
                {plan.ctaText}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
`;
}

/**
 * Generates a React CTA section component with Tailwind CSS
 */
export function generateReactCTAComponent(options: ComponentOptions): string {
  const {
    name,
    props = [],
    description = `${name} CTA component`,
  } = options;

  // Add default CTA props if not provided
  if (!props.includes('title')) props.push('title: string');
  if (!props.includes('description')) props.push('description: string');
  if (!props.includes('ctaText')) props.push('ctaText: string');
  if (!props.includes('ctaLink')) props.push('ctaLink: string');

  // Generate props interface
  const propsInterface = `interface ${name}Props {
  ${props.map(prop => `${prop};`).join('\n  ')}
}`;

  // Generate imports
  const imports = [
    "import React from 'react';",
    "import { ArrowRight } from 'lucide-react';",
  ];

  // Generate component
  return `${imports.join('\n')}

/**
 * ${description}
 */
${propsInterface}

export const ${name} = ({
  title,
  description,
  ctaText,
  ctaLink,
  ...props
}: ${name}Props) => {
  return (
    <div className="bg-primary">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          <span className="block">{title}</span>
          <span className="block text-primary-100">{description}</span>
        </h2>
        <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          <div className="inline-flex rounded-md shadow">
            <a
              href={ctaLink}
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-primary-50"
            >
              {ctaText}
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
`;
}

/**
 * Generates a React footer component with Tailwind CSS
 */
export function generateReactFooterComponent(options: ComponentOptions): string {
  const {
    name,
    props = [],
    description = `${name} footer component`,
  } = options;

  // Add default footer props if not provided
  if (!props.includes('logo')) props.push('logo: string');
  if (!props.includes('navigation')) props.push('navigation: FooterNavigation[]');
  if (!props.includes('socialLinks')) props.push('socialLinks: SocialLink[]');
  if (!props.includes('copyright')) props.push('copyright: string');

  // Generate props interface
  const propsInterface = `interface FooterNavigation {
  title: string;
  links: {
    name: string;
    href: string;
  }[];
}

interface SocialLink {
  name: string;
  href: string;
  icon: LucideIcon;
}

interface ${name}Props {
  ${props.map(prop => `${prop};`).join('\n  ')}
}`;

  // Generate imports
  const imports = [
    "import React from 'react';",
    "import { LucideIcon } from 'lucide-react';",
  ];

  // Generate component
  return `${imports.join('\n')}

/**
 * ${description}
 */
${propsInterface}

export const ${name} = ({
  logo,
  navigation,
  socialLinks,
  copyright,
  ...props
}: ${name}Props) => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <img className="h-10" src={logo} alt="Company logo" />
            <p className="text-gray-500 dark:text-gray-400 text-base">
              Making the world a better place through innovative solutions.
            </p>
            <div className="flex space-x-6">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a key={item.name} href={item.href} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                    <span className="sr-only">{item.name}</span>
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              {navigation.slice(0, 2).map((item) => (
                <div key={item.title} className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-200 tracking-wider uppercase">
                    {item.title}
                  </h3>
                  <ul className="mt-4 space-y-4">
                    {item.links.map((link) => (
                      <li key={link.name}>
                        <a href={link.href} className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              {navigation.slice(2).map((item) => (
                <div key={item.title} className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-200 tracking-wider uppercase">
                    {item.title}
                  </h3>
                  <ul className="mt-4 space-y-4">
                    {item.links.map((link) => (
                      <li key={link.name}>
                        <a href={link.href} className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
          <p className="text-base text-gray-400 dark:text-gray-500 text-center">
            {copyright}
          </p>
        </div>
      </div>
    </footer>
  );
};
`;
}

/**
 * Generates a component based on the specified options
 */
export function generateComponent(options: ComponentOptions): string {
  const mergedOptions = { ...DEFAULT_COMPONENT_OPTIONS, ...options };

  // Generate the component based on the style
  switch (mergedOptions.style) {
    case ComponentStyle.CARD:
      return generateReactCardComponent(mergedOptions);
    case ComponentStyle.HERO:
      return generateReactHeroComponent(mergedOptions);
    case ComponentStyle.FEATURE:
      return generateReactFeaturesComponent(mergedOptions);
    case ComponentStyle.PRICING:
      return generateReactPricingComponent(mergedOptions);
    case ComponentStyle.CTA:
      return generateReactCTAComponent(mergedOptions);
    case ComponentStyle.FOOTER:
      return generateReactFooterComponent(mergedOptions);
    case ComponentStyle.BASIC:
    default:
      return generateReactFunctionalComponent(mergedOptions);
  }
}
