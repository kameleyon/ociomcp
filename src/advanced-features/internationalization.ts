/**
 * Internationalization
 * Provides functionality for internationalization (i18n) and localization (l10n)
 */

/**
 * Locale definition
 */
export interface Locale {
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  dateFormat: string;
  timeFormat: string;
  numberFormat: {
    decimal: string;
    thousand: string;
    precision: number;
  };
  currencyFormat: {
    symbol: string;
    position: 'before' | 'after';
    space: boolean;
  };
}

/**
 * Translation definition
 */
export interface Translation {
  locale: string;
  namespace: string;
  key: string;
  value: string;
}

/**
 * Translation namespace
 */
export interface TranslationNamespace {
  [key: string]: string | TranslationNamespace;
}

/**
 * Translation options
 */
export interface TranslationOptions {
  defaultLocale: string;
  fallbackLocale?: string;
  namespaces?: string[];
  interpolation?: {
    prefix?: string;
    suffix?: string;
    escapeValue?: boolean;
  };
  pluralization?: {
    pluralSeparator?: string;
    zeroKey?: string;
    oneKey?: string;
    otherKey?: string;
  };
}

/**
 * Format options
 */
export interface FormatOptions {
  locale?: string;
  currency?: string;
  style?: 'decimal' | 'percent' | 'currency';
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

/**
 * Date format options
 */
export interface DateFormatOptions {
  locale?: string;
  format?: 'short' | 'medium' | 'long' | 'full' | string;
  timezone?: string;
}

/**
 * Common locales
 */
export const COMMON_LOCALES: Record<string, Locale> = {
  'en-US': {
    code: 'en-US',
    name: 'English (US)',
    nativeName: 'English (US)',
    direction: 'ltr',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: 'h:mm A',
    numberFormat: {
      decimal: '.',
      thousand: ',',
      precision: 2,
    },
    currencyFormat: {
      symbol: '$',
      position: 'before',
      space: false,
    },
  },
  'en-GB': {
    code: 'en-GB',
    name: 'English (UK)',
    nativeName: 'English (UK)',
    direction: 'ltr',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm',
    numberFormat: {
      decimal: '.',
      thousand: ',',
      precision: 2,
    },
    currencyFormat: {
      symbol: '£',
      position: 'before',
      space: false,
    },
  },
  'es-ES': {
    code: 'es-ES',
    name: 'Spanish (Spain)',
    nativeName: 'Español (España)',
    direction: 'ltr',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm',
    numberFormat: {
      decimal: ',',
      thousand: '.',
      precision: 2,
    },
    currencyFormat: {
      symbol: '€',
      position: 'after',
      space: true,
    },
  },
  'fr-FR': {
    code: 'fr-FR',
    name: 'French (France)',
    nativeName: 'Français (France)',
    direction: 'ltr',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm',
    numberFormat: {
      decimal: ',',
      thousand: ' ',
      precision: 2,
    },
    currencyFormat: {
      symbol: '€',
      position: 'after',
      space: true,
    },
  },
  'de-DE': {
    code: 'de-DE',
    name: 'German (Germany)',
    nativeName: 'Deutsch (Deutschland)',
    direction: 'ltr',
    dateFormat: 'DD.MM.YYYY',
    timeFormat: 'HH:mm',
    numberFormat: {
      decimal: ',',
      thousand: '.',
      precision: 2,
    },
    currencyFormat: {
      symbol: '€',
      position: 'after',
      space: true,
    },
  },
  'ja-JP': {
    code: 'ja-JP',
    name: 'Japanese',
    nativeName: '日本語',
    direction: 'ltr',
    dateFormat: 'YYYY/MM/DD',
    timeFormat: 'HH:mm',
    numberFormat: {
      decimal: '.',
      thousand: ',',
      precision: 0,
    },
    currencyFormat: {
      symbol: '¥',
      position: 'before',
      space: false,
    },
  },
  'ar-SA': {
    code: 'ar-SA',
    name: 'Arabic (Saudi Arabia)',
    nativeName: 'العربية (المملكة العربية السعودية)',
    direction: 'rtl',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm',
    numberFormat: {
      decimal: '٫',
      thousand: '٬',
      precision: 2,
    },
    currencyFormat: {
      symbol: 'ر.س.‏',
      position: 'after',
      space: true,
    },
  },
};

/**
 * Internationalization service
 */
export class I18nService {
  private locales: Record<string, Locale> = {};
  private translations: Record<string, Record<string, TranslationNamespace>> = {};
  private options: TranslationOptions;
  private currentLocale: string;

  constructor(options: TranslationOptions) {
    this.options = {
      ...options,
      interpolation: {
        prefix: '{{',
        suffix: '}}',
        escapeValue: true,
        ...options.interpolation,
      },
      pluralization: {
        pluralSeparator: '_',
        zeroKey: 'zero',
        oneKey: 'one',
        otherKey: 'other',
        ...options.pluralization,
      },
    };
    this.currentLocale = options.defaultLocale;
    
    // Add common locales
    for (const [code, locale] of Object.entries(COMMON_LOCALES)) {
      this.addLocale(locale);
    }
  }

  /**
   * Adds a locale
   */
  addLocale(locale: Locale): void {
    this.locales[locale.code] = locale;
  }

  /**
   * Gets a locale
   */
  getLocale(code: string): Locale | undefined {
    return this.locales[code];
  }

  /**
   * Gets all locales
   */
  getLocales(): Locale[] {
    return Object.values(this.locales);
  }

  /**
   * Sets the current locale
   */
  setLocale(code: string): void {
    if (!this.locales[code]) {
      throw new Error(`Locale not found: ${code}`);
    }
    this.currentLocale = code;
  }

  /**
   * Gets the current locale
   */
  getCurrentLocale(): string {
    return this.currentLocale;
  }

  /**
   * Adds translations
   */
  addTranslations(locale: string, namespace: string, translations: TranslationNamespace): void {
    if (!this.translations[locale]) {
      this.translations[locale] = {};
    }
    this.translations[locale][namespace] = translations;
  }

  /**
   * Gets translations
   */
  getTranslations(locale: string, namespace: string): TranslationNamespace | undefined {
    return this.translations[locale]?.[namespace];
  }

  /**
   * Translates a key
   */
  translate(key: string, options: {
    locale?: string;
    namespace?: string;
    count?: number;
    defaultValue?: string;
    interpolation?: Record<string, any>;
  } = {}): string {
    const {
      locale = this.currentLocale,
      namespace = 'common',
      count,
      defaultValue,
      interpolation = {},
    } = options;
    
    // Get the translation
    let translation = this.getTranslationValue(key, locale, namespace);
    
    // If not found, try fallback locale
    if (!translation && this.options.fallbackLocale && locale !== this.options.fallbackLocale) {
      translation = this.getTranslationValue(key, this.options.fallbackLocale, namespace);
    }
    
    // If still not found, use default value or key
    if (!translation) {
      translation = defaultValue || key;
    }
    
    // Handle pluralization
    if (count !== undefined) {
      translation = this.getPluralForm(translation, count);
    }
    
    // Handle interpolation
    if (Object.keys(interpolation).length > 0) {
      translation = this.interpolate(translation, interpolation);
    }
    
    return translation;
  }

  /**
   * Gets a translation value
   */
  private getTranslationValue(key: string, locale: string, namespace: string): string | undefined {
    const translations = this.translations[locale]?.[namespace];
    
    if (!translations) {
      return undefined;
    }
    
    // Handle nested keys
    const parts = key.split('.');
    let value: any = translations;
    
    for (const part of parts) {
      if (value === undefined) {
        return undefined;
      }
      value = value[part];
    }
    
    return typeof value === 'string' ? value : undefined;
  }

  /**
   * Gets the plural form of a translation
   */
  private getPluralForm(translation: string, count: number): string {
    const { pluralSeparator, zeroKey, oneKey, otherKey } = this.options.pluralization!;
    
    // Check if the translation has plural forms
    if (!translation.includes(pluralSeparator!)) {
      return translation;
    }
    
    // Split the translation into plural forms
    const forms: Record<string, string> = {};
    const parts = translation.split(pluralSeparator!);
    
    for (const part of parts) {
      const [key, value] = part.split('=');
      forms[key.trim()] = value.trim();
    }
    
    // Get the appropriate form
    if (count === 0 && forms[zeroKey!]) {
      return forms[zeroKey!];
    } else if (count === 1 && forms[oneKey!]) {
      return forms[oneKey!];
    } else if (forms[otherKey!]) {
      return forms[otherKey!];
    }
    
    return translation;
  }

  /**
   * Interpolates a translation
   */
  private interpolate(translation: string, values: Record<string, any>): string {
    const { prefix, suffix, escapeValue } = this.options.interpolation!;
    
    return translation.replace(new RegExp(`${prefix}([^${suffix}]+)${suffix}`, 'g'), (match, key) => {
      const value = values[key.trim()];
      
      if (value === undefined) {
        return match;
      }
      
      return escapeValue ? this.escapeHtml(String(value)) : String(value);
    });
  }

  /**
   * Escapes HTML
   */
  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Formats a number
   */
  formatNumber(value: number, options: FormatOptions = {}): string {
    const { locale = this.currentLocale, style = 'decimal', currency, minimumFractionDigits, maximumFractionDigits } = options;
    
    try {
      return new Intl.NumberFormat(locale, {
        style,
        currency,
        minimumFractionDigits,
        maximumFractionDigits,
      }).format(value);
    } catch (error) {
      // Fallback to manual formatting
      const localeObj = this.locales[locale];
      
      if (!localeObj) {
        return String(value);
      }
      
      const { decimal, thousand, precision } = localeObj.numberFormat;
      
      // Format the number
      const parts = value.toFixed(precision).split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousand);
      
      return parts.join(decimal);
    }
  }

  /**
   * Formats a currency
   */
  formatCurrency(value: number, options: FormatOptions = {}): string {
    const { locale = this.currentLocale, currency } = options;
    const localeObj = this.locales[locale];
    
    if (!localeObj) {
      return String(value);
    }
    
    const { symbol, position, space } = localeObj.currencyFormat;
    const formattedValue = this.formatNumber(value, { ...options, style: 'decimal' });
    
    if (position === 'before') {
      return `${symbol}${space ? ' ' : ''}${formattedValue}`;
    } else {
      return `${formattedValue}${space ? ' ' : ''}${symbol}`;
    }
  }

  /**
   * Formats a date
   */
  formatDate(date: Date, options: DateFormatOptions = {}): string {
    const { locale = this.currentLocale, format = 'medium', timezone } = options;
    
    try {
      if (format === 'short' || format === 'medium' || format === 'long' || format === 'full') {
        return new Intl.DateTimeFormat(locale, {
          dateStyle: format,
          timeZone: timezone,
        }).format(date);
      } else {
        // Custom format
        const localeObj = this.locales[locale];
        
        if (!localeObj) {
          return date.toLocaleDateString();
        }
        
        // Replace format tokens with actual values
        return format
          .replace('YYYY', date.getFullYear().toString())
          .replace('MM', (date.getMonth() + 1).toString().padStart(2, '0'))
          .replace('DD', date.getDate().toString().padStart(2, '0'))
          .replace('HH', date.getHours().toString().padStart(2, '0'))
          .replace('mm', date.getMinutes().toString().padStart(2, '0'))
          .replace('ss', date.getSeconds().toString().padStart(2, '0'));
      }
    } catch (error) {
      return date.toLocaleDateString();
    }
  }

  /**
   * Formats a time
   */
  formatTime(date: Date, options: DateFormatOptions = {}): string {
    const { locale = this.currentLocale, format = 'medium', timezone } = options;
    
    try {
      if (format === 'short' || format === 'medium' || format === 'long' || format === 'full') {
        return new Intl.DateTimeFormat(locale, {
          timeStyle: format,
          timeZone: timezone,
        }).format(date);
      } else {
        // Custom format
        const localeObj = this.locales[locale];
        
        if (!localeObj) {
          return date.toLocaleTimeString();
        }
        
        // Replace format tokens with actual values
        return format
          .replace('HH', date.getHours().toString().padStart(2, '0'))
          .replace('mm', date.getMinutes().toString().padStart(2, '0'))
          .replace('ss', date.getSeconds().toString().padStart(2, '0'))
          .replace('h', (date.getHours() % 12 || 12).toString())
          .replace('A', date.getHours() < 12 ? 'AM' : 'PM');
      }
    } catch (error) {
      return date.toLocaleTimeString();
    }
  }
}

/**
 * Creates an internationalization service
 */
export function createI18nService(options: TranslationOptions): I18nService {
  return new I18nService(options);
}

/**
 * Generates translation files for multiple locales
 */
export function generateTranslationFiles(
  keys: string[],
  locales: string[],
  baseTranslations: Record<string, string> = {}
): Record<string, Record<string, string>> {
  const translations: Record<string, Record<string, string>> = {};
  
  for (const locale of locales) {
    translations[locale] = { ...baseTranslations };
    
    for (const key of keys) {
      if (!translations[locale][key]) {
        translations[locale][key] = `[${locale}] ${key}`;
      }
    }
  }
  
  return translations;
}

/**
 * Detects missing translations
 */
export function detectMissingTranslations(
  translations: Record<string, Record<string, string>>,
  baseLocale: string
): Record<string, string[]> {
  const missingTranslations: Record<string, string[]> = {};
  const baseKeys = Object.keys(translations[baseLocale] || {});
  
  for (const locale of Object.keys(translations)) {
    if (locale === baseLocale) {
      continue;
    }
    
    missingTranslations[locale] = [];
    
    for (const key of baseKeys) {
      if (!translations[locale][key]) {
        missingTranslations[locale].push(key);
      }
    }
  }
  
  return missingTranslations;
}

/**
 * Generates a language selector component
 */
export function generateLanguageSelector(
  locales: Locale[],
  currentLocale: string,
  onChange: (locale: string) => void
): string {
  return `
<div class="language-selector">
  <select onchange="(${onChange.toString()})(this.value)" aria-label="Select language">
    ${locales.map(locale => `
      <option value="${locale.code}" ${locale.code === currentLocale ? 'selected' : ''}>
        ${locale.nativeName}
      </option>
    `).join('')}
  </select>
</div>
`;
}