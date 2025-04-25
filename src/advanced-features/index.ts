/**
 * Advanced Features Module
 * 
 * This module provides advanced functionality for version control, content generation,
 * API integration, and internationalization.
 */

// Export all types and functions from version-control.ts
export * from './version-control.js';

// Export all types and functions from content-generator.ts
export * from './content-generator.js';

// Export all types and functions from api-integration.ts
export * from './api-integration.js';

// Export all types and functions from internationalization.ts
export * from './internationalization.js';

// Export convenience functions

import {
  ChangeType,
  ChangeSeverity,
  FileChange,
  Snapshot,
  VersionControlState,
  createVersionControlState,
  recordChange,
  createSnapshot,
  revertToSnapshot,
  getChangesBetweenSnapshots,
  generateDiff,
  applyPatch,
  generateChangeSummary,
  generateSnapshotReport,
} from './version-control.js';

import {
  ContentType,
  LegalContentType,
  SeoContentType,
  ContentOptions,
  generateLegalContent,
  generateSeoContent,
} from './content-generator.js';

import {
  ApiAuthType,
  ApiRequestMethod,
  ApiResponseFormat,
  ApiConfig,
  ApiEndpoint,
  ApiClient,
  createApiClient,
  generateApiDocumentation,
} from './api-integration.js';

import {
  Locale,
  Translation,
  TranslationOptions,
  I18nService,
  createI18nService,
  generateTranslationFiles,
  detectMissingTranslations,
  generateLanguageSelector,
  COMMON_LOCALES,
} from './internationalization.js';

/**
 * Creates a version control system for tracking changes to files
 */
export function createVersionControl(): {
  state: VersionControlState;
  recordChange: (change: Omit<FileChange, 'timestamp'>) => VersionControlState;
  createSnapshot: (name: string, description?: string, author?: string, tags?: string[]) => VersionControlState;
  revertToSnapshot: (snapshotId: string) => VersionControlState;
  getChangesBetweenSnapshots: (fromSnapshotId: string, toSnapshotId: string) => FileChange[];
  generateReport: () => string;
} {
  let state = createVersionControlState();

  return {
    state,
    recordChange: (change) => {
      state = recordChange(state, change);
      return state;
    },
    createSnapshot: (name, description, author, tags) => {
      state = createSnapshot(state, name, description, author, tags);
      return state;
    },
    revertToSnapshot: (snapshotId) => {
      state = revertToSnapshot(state, snapshotId);
      return state;
    },
    getChangesBetweenSnapshots: (fromSnapshotId, toSnapshotId) => {
      return getChangesBetweenSnapshots(state, fromSnapshotId, toSnapshotId);
    },
    generateReport: () => {
      return generateSnapshotReport(state);
    },
  };
}

/**
 * Creates a content generator for generating various types of content
 */
export function createContentGenerator(): {
  generateLegal: (options: ContentOptions) => string;
  generateSeo: (options: ContentOptions) => string;
} {
  return {
    generateLegal: (options) => {
      return generateLegalContent(options);
    },
    generateSeo: (options) => {
      return generateSeoContent(options);
    },
  };
}

/**
 * Creates an API client for interacting with external APIs
 */
export function createApi(config: ApiConfig): {
  client: ApiClient;
  registerEndpoint: (endpoint: ApiEndpoint) => void;
  request: <T = any>(options: {
    endpoint: string | ApiEndpoint;
    pathParams?: Record<string, string | number>;
    queryParams?: Record<string, string | number | boolean | null>;
    body?: any;
    headers?: Record<string, string>;
  }) => Promise<T>;
  generateDocumentation: (endpoints: ApiEndpoint[]) => string;
} {
  const client = createApiClient(config);

  return {
    client,
    registerEndpoint: (endpoint) => {
      client.registerEndpoint(endpoint);
    },
    request: async <T = any>(options: {
      endpoint: string | ApiEndpoint;
      pathParams?: Record<string, string | number>;
      queryParams?: Record<string, string | number | boolean | null>;
      body?: any;
      headers?: Record<string, string>;
    }) => {
      const response = await client.request<T>(options);
      return response.data;
    },
    generateDocumentation: (endpoints) => {
      return generateApiDocumentation(config, endpoints);
    },
  };
}

/**
 * Creates an internationalization service for handling translations and localization
 */
export function createI18n(options: TranslationOptions): {
  service: I18nService;
  translate: (key: string, options?: {
    locale?: string;
    namespace?: string;
    count?: number;
    defaultValue?: string;
    interpolation?: Record<string, any>;
  }) => string;
  setLocale: (locale: string) => void;
  getCurrentLocale: () => string;
  formatNumber: (value: number, options?: {
    locale?: string;
    style?: 'decimal' | 'percent' | 'currency';
    currency?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  }) => string;
  formatDate: (date: Date, options?: {
    locale?: string;
    format?: 'short' | 'medium' | 'long' | 'full' | string;
    timezone?: string;
  }) => string;
} {
  const service = createI18nService(options);

  return {
    service,
    translate: (key, options) => {
      return service.translate(key, options);
    },
    setLocale: (locale) => {
      service.setLocale(locale);
    },
    getCurrentLocale: () => {
      return service.getCurrentLocale();
    },
    formatNumber: (value, options) => {
      return service.formatNumber(value, options);
    },
    formatDate: (date, options) => {
      return service.formatDate(date, options);
    },
  };
}

/**
 * Generates a complete project with advanced features
 */
export function generateProjectWithAdvancedFeatures(options: {
  name: string;
  description: string;
  features: {
    versionControl?: boolean;
    contentGeneration?: boolean;
    apiIntegration?: boolean;
    internationalization?: boolean;
  };
  versionControlOptions?: {
    initialSnapshot?: string;
  };
  contentOptions?: {
    legalContent?: LegalContentType[];
    seoContent?: SeoContentType[];
  };
  apiOptions?: {
    baseUrl?: string;
    authType?: ApiAuthType;
    endpoints?: ApiEndpoint[];
  };
  i18nOptions?: {
    locales?: string[];
    defaultLocale?: string;
  };
}): {
  files: { path: string; content: string }[];
  documentation: string;
} {
  const {
    name,
    description,
    features,
    versionControlOptions = {},
    contentOptions = {},
    apiOptions = {},
    i18nOptions = {},
  } = options;

  const files: { path: string; content: string }[] = [];
  let documentation = `# ${name}\n\n${description}\n\n`;

  // Add version control
  if (features.versionControl) {
    documentation += '## Version Control\n\n';
    documentation += 'This project includes version control functionality for tracking changes to files.\n\n';
    
    files.push({
      path: 'src/version-control.ts',
      content: `import { createVersionControl } from '@optimuscode/mcp/advanced-features';

export const versionControl = createVersionControl();

// Example usage
export function recordFileChange(path: string, content: string, oldContent?: string) {
  versionControl.recordChange({
    path,
    type: oldContent ? 'modify' : 'add',
    content,
    oldContent,
  });
}

export function createVersionSnapshot(name: string, description?: string) {
  return versionControl.createSnapshot(name, description);
}

export function generateVersionReport() {
  return versionControl.generateReport();
}
`,
    });
    
    if (versionControlOptions.initialSnapshot) {
      files.push({
        path: 'src/version-control-init.ts',
        content: `import { versionControl } from './version-control';

// Initialize with initial snapshot
export function initializeVersionControl() {
  versionControl.createSnapshot('Initial snapshot', 'Initial project state');
}
`,
      });
    }
  }

  // Add content generation
  if (features.contentGeneration) {
    documentation += '## Content Generation\n\n';
    documentation += 'This project includes content generation functionality for creating various types of content.\n\n';
    
    files.push({
      path: 'src/content-generator.ts',
      content: `import { createContentGenerator, ContentType, LegalContentType, SeoContentType } from '@optimuscode/mcp/advanced-features';

export const contentGenerator = createContentGenerator();

// Example usage
export function generatePrivacyPolicy(companyName: string, contactEmail: string) {
  return contentGenerator.generateLegal({
    type: ContentType.LEGAL,
    subtype: LegalContentType.PRIVACY_POLICY,
    company: {
      name: companyName,
      description: \`${name} is a ${description}\`,
    },
    legal: {
      contactEmail,
      effectiveDate: new Date().toLocaleDateString(),
    },
  });
}

export function generateMetaTags(title: string, description: string, url: string) {
  return contentGenerator.generateSeo({
    type: ContentType.SEO,
    subtype: SeoContentType.META_TAGS,
    website: {
      title,
      description,
      url,
    },
  });
}
`,
    });
    
    if (contentOptions.legalContent?.length) {
      files.push({
        path: 'src/legal-content.ts',
        content: `import { contentGenerator } from './content-generator';
import { ContentType, LegalContentType } from '@optimuscode/mcp/advanced-features';

export const legalContent = {
${contentOptions.legalContent.map(type => `  ${type}: (companyName: string, contactEmail: string) => contentGenerator.generateLegal({
    type: ContentType.LEGAL,
    subtype: LegalContentType.${type.toUpperCase()},
    company: {
      name: companyName,
      description: \`${name} is a ${description}\`,
    },
    legal: {
      contactEmail,
      effectiveDate: new Date().toLocaleDateString(),
    },
  })`).join(',\n')}
};
`,
      });
    }
    
    if (contentOptions.seoContent?.length) {
      files.push({
        path: 'src/seo-content.ts',
        content: `import { contentGenerator } from './content-generator';
import { ContentType, SeoContentType } from '@optimuscode/mcp/advanced-features';

export const seoContent = {
${contentOptions.seoContent.map(type => `  ${type}: (title: string, description: string, url: string) => contentGenerator.generateSeo({
    type: ContentType.SEO,
    subtype: SeoContentType.${type.toUpperCase()},
    website: {
      title,
      description,
      url,
    },
  })`).join(',\n')}
};
`,
      });
    }
  }

  // Add API integration
  if (features.apiIntegration) {
    documentation += '## API Integration\n\n';
    documentation += 'This project includes API integration functionality for interacting with external APIs.\n\n';
    
    files.push({
      path: 'src/api-client.ts',
      content: `import { createApi, ApiAuthType, ApiRequestMethod } from '@optimuscode/mcp/advanced-features';

export const api = createApi({
  name: '${name} API',
  baseUrl: '${apiOptions.baseUrl || 'https://api.example.com'}',
  version: 'v1',
  description: '${description}',
  authType: ${apiOptions.authType ? `ApiAuthType.${apiOptions.authType.toUpperCase()}` : 'ApiAuthType.NONE'},
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 5000,
  retries: 3,
});

// Register endpoints
${apiOptions.endpoints?.map(endpoint => `api.registerEndpoint({
  name: '${endpoint.name}',
  path: '${endpoint.path}',
  method: ApiRequestMethod.${endpoint.method},
  description: '${endpoint.description || ''}',
});`).join('\n\n') || '// Add your endpoints here'}

// Example usage
export async function fetchData<T = any>(endpoint: string, params?: Record<string, any>) {
  return api.request<T>({
    endpoint,
    queryParams: params,
  });
}
`,
    });
    
    if (apiOptions.endpoints?.length) {
      files.push({
        path: 'src/api-documentation.ts',
        content: `import { api } from './api-client';

export function generateApiDocumentation() {
  return api.generateDocumentation([
    ${apiOptions.endpoints.map(endpoint => `{
      name: '${endpoint.name}',
      path: '${endpoint.path}',
      method: '${endpoint.method}',
      description: '${endpoint.description || ''}',
    }`).join(',\n    ')}
  ]);
}
`,
      });
    }
  }

  // Add internationalization
  if (features.internationalization) {
    documentation += '## Internationalization\n\n';
    documentation += 'This project includes internationalization functionality for handling translations and localization.\n\n';
    
    const locales = i18nOptions.locales || ['en-US', 'es-ES', 'fr-FR'];
    const defaultLocale = i18nOptions.defaultLocale || 'en-US';
    
    files.push({
      path: 'src/i18n.ts',
      content: `import { createI18n, COMMON_LOCALES } from '@optimuscode/mcp/advanced-features';

export const i18n = createI18n({
  defaultLocale: '${defaultLocale}',
  fallbackLocale: 'en-US',
  namespaces: ['common', 'errors', 'validation'],
});

// Add translations
i18n.service.addTranslations('en-US', 'common', {
  'welcome': 'Welcome to ${name}',
  'description': '${description}',
  'loading': 'Loading...',
  'error': 'An error occurred',
  'success': 'Success!',
});

i18n.service.addTranslations('es-ES', 'common', {
  'welcome': 'Bienvenido a ${name}',
  'description': '${description}',
  'loading': 'Cargando...',
  'error': 'Se produjo un error',
  'success': '¡Éxito!',
});

i18n.service.addTranslations('fr-FR', 'common', {
  'welcome': 'Bienvenue à ${name}',
  'description': '${description}',
  'loading': 'Chargement...',
  'error': 'Une erreur est survenue',
  'success': 'Succès!',
});

// Example usage
export function translate(key: string, params?: Record<string, any>) {
  return i18n.translate(key, { interpolation: params });
}

export function setLanguage(locale: string) {
  i18n.setLocale(locale);
}

export function getCurrentLanguage() {
  return i18n.getCurrentLocale();
}

export function formatDate(date: Date) {
  return i18n.formatDate(date);
}

export function formatNumber(value: number) {
  return i18n.formatNumber(value);
}
`,
    });
    
    files.push({
      path: 'src/language-selector.ts',
      content: `import { generateLanguageSelector, COMMON_LOCALES } from '@optimuscode/mcp/advanced-features';
import { setLanguage, getCurrentLanguage } from './i18n';

export function renderLanguageSelector() {
  const locales = [
    ${locales.map(locale => `COMMON_LOCALES['${locale}']`).join(',\n    ')}
  ];
  
  return generateLanguageSelector(locales, getCurrentLanguage(), setLanguage);
}
`,
    });
  }

  // Add index file
  files.push({
    path: 'src/index.ts',
    content: `/**
 * ${name}
 * ${description}
 */

${features.versionControl ? "import { versionControl, recordFileChange, createVersionSnapshot, generateVersionReport } from './version-control';" : ''}
${features.contentGeneration ? "import { contentGenerator, generatePrivacyPolicy, generateMetaTags } from './content-generator';" : ''}
${features.apiIntegration ? "import { api, fetchData } from './api-client';" : ''}
${features.internationalization ? "import { i18n, translate, setLanguage, getCurrentLanguage, formatDate, formatNumber } from './i18n';" : ''}

export {
  ${features.versionControl ? 'versionControl, recordFileChange, createVersionSnapshot, generateVersionReport,' : ''}
  ${features.contentGeneration ? 'contentGenerator, generatePrivacyPolicy, generateMetaTags,' : ''}
  ${features.apiIntegration ? 'api, fetchData,' : ''}
  ${features.internationalization ? 'i18n, translate, setLanguage, getCurrentLanguage, formatDate, formatNumber,' : ''}
};
`,
    });

  return {
    files,
    documentation,
  };
}