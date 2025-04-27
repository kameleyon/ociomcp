// Auto-generated safe fallback for page-templates

export function activate() {
    console.log("[TOOL] page-templates activated (passive mode)");
}

export function onFileWrite() { /* no-op */ }
export function onSessionStart() { /* no-op */ }
export function onCommand() { /* no-op */ }
/**
 * Page Templates
 * Provides templates for generating React pages with various layouts and sections
 */

import { ComponentStyle } from './component-templates.js';

/**
 * Page type definitions
 */
export enum PageType {
  LANDING = 'landing',
  DASHBOARD = 'dashboard',
  AUTH = 'auth',
  PROFILE = 'profile',
  SETTINGS = 'settings',
  DOCUMENTATION = 'documentation',
  BLOG = 'blog',
  PRODUCT = 'product',
  CHECKOUT = 'checkout',
  ERROR = 'error',
}

/**
 * Page section definitions
 */
export interface PageSection {
  type: ComponentStyle;
  name: string;
  props?: Record<string, any>;
}

/**
 * Page options
 */
export interface PageOptions {
  name: string;
  type: PageType;
  sections: PageSection[];
  meta?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  imports?: string[];
  withNavbar?: boolean;
  withFooter?: boolean;
  withSidebar?: boolean;
  withAuth?: boolean;
  withDarkMode?: boolean;
  withAnimation?: boolean;
  withResponsive?: boolean;
}

/**
 * Default page options
 */
export const DEFAULT_PAGE_OPTIONS: Partial<PageOptions> = {
  withNavbar: true,
  withFooter: true,
  withDarkMode: true,
  withAnimation: true,
  withResponsive: true,
};

/**
 * Default landing page sections
 */
export const DEFAULT_LANDING_PAGE_SECTIONS: PageSection[] = [
  {
    type: ComponentStyle.HERO,
    name: 'Hero',
    props: {
      title: 'Build beautiful UIs with OptimusCode',
      subtitle: 'A modern UI generation system for React applications',
      ctaText: 'Get Started',
      ctaLink: '#',
      secondaryCtaText: 'Learn More',
      secondaryCtaLink: '#',
      backgroundPattern: true,
    },
  },
  {
    type: ComponentStyle.FEATURE,
    name: 'Features',
    props: {
      title: 'Features',
      subtitle: 'Everything you need to build amazing applications',
      features: [
        {
          title: 'Component Generation',
          description: 'Generate React components with a single command',
          icon: 'Code',
        },
        {
          title: 'Responsive Design',
          description: 'All components are fully responsive out of the box',
          icon: 'Smartphone',
        },
        {
          title: 'Dark Mode',
          description: 'Built-in dark mode support for all components',
          icon: 'Moon',
        },
        {
          title: 'Accessibility',
          description: 'Accessible components that follow WAI-ARIA guidelines',
          icon: 'Accessibility',
        },
        {
          title: 'Customizable',
          description: 'Easily customize components to match your brand',
          icon: 'Palette',
        },
        {
          title: 'TypeScript',
          description: 'Full TypeScript support for type safety',
          icon: 'FileCode',
        },
      ],
    },
  },
  {
    type: ComponentStyle.PRICING,
    name: 'Pricing',
    props: {
      title: 'Pricing',
      subtitle: 'Simple, transparent pricing for everyone',
      plans: [
        {
          name: 'Free',
          price: 'Free',
          description: 'Perfect for personal projects and learning',
          features: [
            { name: 'Up to 3 projects', included: true },
            { name: 'Basic components', included: true },
            { name: 'Community support', included: true },
            { name: 'Dark mode', included: true },
            { name: 'Custom components', included: false },
            { name: 'Priority support', included: false },
          ],
          ctaText: 'Get Started',
          ctaLink: '#',
        },
        {
          name: 'Pro',
          price: '$29',
          description: 'For professional developers and small teams',
          features: [
            { name: 'Unlimited projects', included: true },
            { name: 'All components', included: true },
            { name: 'Email support', included: true },
            { name: 'Dark mode', included: true },
            { name: 'Custom components', included: true },
            { name: 'Priority support', included: false },
          ],
          ctaText: 'Start Free Trial',
          ctaLink: '#',
          popular: true,
        },
        {
          name: 'Enterprise',
          price: '$99',
          description: 'For large teams and organizations',
          features: [
            { name: 'Unlimited projects', included: true },
            { name: 'All components', included: true },
            { name: 'Priority support', included: true },
            { name: 'Dark mode', included: true },
            { name: 'Custom components', included: true },
            { name: 'Dedicated account manager', included: true },
          ],
          ctaText: 'Contact Sales',
          ctaLink: '#',
        },
      ],
    },
  },
  {
    type: ComponentStyle.CTA,
    name: 'CTA',
    props: {
      title: 'Ready to get started?',
      description: 'Join thousands of developers building with OptimusCode',
      ctaText: 'Get Started',
      ctaLink: '#',
    },
  },
];

/**
 * Generates a React landing page
 */
export function generateLandingPage(options: PageOptions): string {
  const {
    name,
    sections,
    meta = {},
    imports = [],
    withNavbar = true,
    withFooter = true,
    withDarkMode = true,
  } = options;

  // Generate imports
  const defaultImports = [
    "import React from 'react';",
    "import { ArrowRight, Menu, X, Moon, Sun } from 'lucide-react';",
  ];

  if (withDarkMode) {
    defaultImports.push("import { useState, useEffect } from 'react';");
  }

  // Add section component imports
  const sectionImports = sections.map(section => {
    return `import { ${section.name} } from '../components/${section.name.toLowerCase()}.js';`;
  });

  const allImports = [...defaultImports, ...sectionImports, ...imports].join('\n');

  // Generate navbar
  const navbar = withNavbar ? `
  {/* Navbar */}
  <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16">
        <div className="flex">
          <div className="flex-shrink-0 flex items-center">
            <img className="h-8 w-auto" src="/logo.svg" alt="${name} logo" />
          </div>
          <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
            <a href="#" className="border-primary text-gray-900 dark:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
              Home
            </a>
            <a href="#" className="border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 hover:text-gray-700 dark:hover:text-gray-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
              Features
            </a>
            <a href="#" className="border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 hover:text-gray-700 dark:hover:text-gray-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
              Pricing
            </a>
            <a href="#" className="border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 hover:text-gray-700 dark:hover:text-gray-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
              Documentation
            </a>
          </nav>
        </div>
        <div className="hidden sm:ml-6 sm:flex sm:items-center">
          {darkModeToggle}
          <div className="ml-4">
            <a href="#" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              Sign In
            </a>
          </div>
        </div>
        <div className="-mr-2 flex items-center sm:hidden">
          <button
            type="button"
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            aria-controls="mobile-menu"
            aria-expanded="false"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {mobileMenuOpen ? (
              <X className="block h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="block h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </div>

    {/* Mobile menu, show/hide based on menu state */}
    <div className={mobileMenuOpen ? 'sm:hidden' : 'hidden sm:hidden'} id="mobile-menu">
      <div className="pt-2 pb-3 space-y-1">
        <a href="#" className="bg-primary-50 dark:bg-gray-800 border-primary text-primary dark:text-white block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
          Home
        </a>
        <a href="#" className="border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:text-gray-700 dark:hover:text-gray-200 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
          Features
        </a>
        <a href="#" className="border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:text-gray-700 dark:hover:text-gray-200 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
          Pricing
        </a>
        <a href="#" className="border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:text-gray-700 dark:hover:text-gray-200 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
          Documentation
        </a>
      </div>
      <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center px-4">
          {darkModeToggle}
          <div className="ml-auto">
            <a href="#" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              Sign In
            </a>
          </div>
        </div>
      </div>
    </div>
  </header>
` : '';

  // Generate footer
  const footer = withFooter ? `
  {/* Footer */}
  <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="xl:grid xl:grid-cols-3 xl:gap-8">
        <div className="space-y-8 xl:col-span-1">
          <img className="h-10" src="/logo.svg" alt="${name} logo" />
          <p className="text-gray-500 dark:text-gray-400 text-base">
            Making the world a better place through innovative solutions.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              <span className="sr-only">Twitter</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              <span className="sr-only">GitHub</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
          <div className="md:grid md:grid-cols-2 md:gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-200 tracking-wider uppercase">
                Product
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                    Guides
                  </a>
                </li>
              </ul>
            </div>
            <div className="mt-12 md:mt-0">
              <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-200 tracking-wider uppercase">
                Company
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="md:grid md:grid-cols-2 md:gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-200 tracking-wider uppercase">
                Legal
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
            <div className="mt-12 md:mt-0">
              <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-200 tracking-wider uppercase">
                Support
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                    Status
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                    Community
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
        <p className="text-base text-gray-400 dark:text-gray-500 text-center">
          &copy; ${new Date().getFullYear()} ${name}. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
` : '';

  // Generate dark mode toggle
  const darkModeToggle = withDarkMode ? `
  <button
    type="button"
    className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
    onClick={() => setDarkMode(!darkMode)}
  >
    <span className="sr-only">Toggle dark mode</span>
    {darkMode ? (
      <Sun className="h-5 w-5" aria-hidden="true" />
    ) : (
      <Moon className="h-5 w-5" aria-hidden="true" />
    )}
  </button>
` : '';

  // Generate sections
  const sectionComponents = sections.map(section => {
    const propsString = section.props ? ` ${Object.entries(section.props).map(([key, value]) => {
      if (typeof value === 'string') {
        return `${key}="${value}"`;
      } else if (typeof value === 'boolean') {
        return value ? key : '';
      } else if (Array.isArray(value)) {
        return `${key}={${JSON.stringify(value)}}`;
      } else if (typeof value === 'object') {
        return `${key}={${JSON.stringify(value)}}`;
      }
      return `${key}={${value}}`;
    }).join(' ')}` : '';
    
    return `  <${section.name}${propsString} />`;
  }).join('\n\n');

  // Generate meta tags
  const metaTags = `
  <title>${meta.title || name}</title>
  <meta name="description" content="${meta.description || `${name} - A modern React application`}" />
  ${meta.keywords ? `<meta name="keywords" content="${meta.keywords.join(', ')}" />` : ''}
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
`;

  // Generate the page
  return `${allImports}

/**
 * ${name} Landing Page
 */
export const ${name}Page = () => {
  ${withDarkMode ? `const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);` : `const [mobileMenuOpen, setMobileMenuOpen] = useState(false);`}

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <head>
        ${metaTags}
      </head>
      
      ${navbar}
      
      <main>
${sectionComponents}
      </main>
      
      ${footer}
    </div>
  );
};
`;
}

/**
 * Generates a page based on the specified options
 */
export function generatePage(options: PageOptions): string {
  const mergedOptions = { ...DEFAULT_PAGE_OPTIONS, ...options };

  // Generate the page based on the type
  switch (mergedOptions.type) {
    case PageType.LANDING:
      return generateLandingPage(mergedOptions);
    // Add more page types here
    default:
      return generateLandingPage(mergedOptions);
  }
}
