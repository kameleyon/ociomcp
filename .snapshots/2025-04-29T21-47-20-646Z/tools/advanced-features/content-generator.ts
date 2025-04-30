// Auto-generated safe fallback for content-generator

export function activate() {
    console.log("[TOOL] content-generator activated (passive mode)");
}

export function onFileWrite() { /* no-op */ }
export function onSessionStart() { /* no-op */ }
export function onCommand() { /* no-op */ }
/**
 * Content Generator
 * Provides functionality for generating various types of content
 */

/**
 * Content type definitions
 */
export enum ContentType {
  LEGAL = 'legal',
  SEO = 'seo',
  MARKETING = 'marketing',
  DOCUMENTATION = 'documentation',
  EMAIL = 'email',
  SOCIAL = 'social',
}

/**
 * Legal content type definitions
 */
export enum LegalContentType {
  PRIVACY_POLICY = 'privacy-policy',
  TERMS_OF_SERVICE = 'terms-of-service',
  COOKIE_POLICY = 'cookie-policy',
  DISCLAIMER = 'disclaimer',
  EULA = 'eula',
}

/**
 * SEO content type definitions
 */
export enum SeoContentType {
  META_TAGS = 'meta-tags',
  SCHEMA_MARKUP = 'schema-markup',
  SITEMAP = 'sitemap',
  ROBOTS_TXT = 'robots-txt',
  OG_TAGS = 'og-tags',
}

/**
 * Content options
 */
export interface ContentOptions {
  type: ContentType;
  subtype?: string;
  company?: {
    name: string;
    description: string;
    website?: string;
    industry?: string;
  };
  product?: {
    name: string;
    description: string;
    features?: string[];
  };
  website?: {
    url: string;
    title: string;
    description: string;
    keywords?: string[];
  };
  legal?: {
    jurisdiction?: string;
    effectiveDate?: string;
    contactEmail?: string;
  };
  tone?: 'formal' | 'casual' | 'professional' | 'friendly';
  format?: 'html' | 'markdown' | 'text' | 'json';
  length?: 'short' | 'medium' | 'long';
}

/**
 * Content template
 */
export interface ContentTemplate {
  type: ContentType;
  subtype: string;
  template: string;
  variables: string[];
  description: string;
}

/**
 * Generates legal content
 */
export function generateLegalContent(options: ContentOptions): string {
  const { subtype, company, legal, format = 'markdown' } = options;
  
  if (!company || !company.name) {
    throw new Error('Company name is required for legal content');
  }
  
  let content = '';
  
  switch (subtype) {
    case LegalContentType.PRIVACY_POLICY:
      content = generatePrivacyPolicy(company.name, legal);
      break;
    case LegalContentType.TERMS_OF_SERVICE:
      content = generateTermsOfService(company.name, legal);
      break;
    case LegalContentType.COOKIE_POLICY:
      content = generateCookiePolicy(company.name, legal);
      break;
    case LegalContentType.DISCLAIMER:
      content = generateDisclaimer(company.name, legal);
      break;
    case LegalContentType.EULA:
      content = generateEULA(company.name, legal);
      break;
    default:
      throw new Error(`Unsupported legal content subtype: ${subtype}`);
  }
  
  return content;
}

/**
 * Generates SEO content
 */
export function generateSeoContent(options: ContentOptions): string {
  const { subtype, website, format = 'html' } = options;
  
  if (!website || !website.url || !website.title || !website.description) {
    throw new Error('Website URL, title, and description are required for SEO content');
  }
  
  let content = '';
  
  switch (subtype) {
    case SeoContentType.META_TAGS:
      content = generateMetaTags(website);
      break;
    case SeoContentType.SCHEMA_MARKUP:
      content = generateSchemaMarkup(website);
      break;
    case SeoContentType.SITEMAP:
      content = generateSitemap(website);
      break;
    case SeoContentType.ROBOTS_TXT:
      content = generateRobotsTxt(website);
      break;
    case SeoContentType.OG_TAGS:
      content = generateOgTags(website);
      break;
    default:
      throw new Error(`Unsupported SEO content subtype: ${subtype}`);
  }
  
  return content;
}

/**
 * Generates a privacy policy
 */
function generatePrivacyPolicy(companyName: string, legal?: ContentOptions['legal']): string {
  const effectiveDate = legal?.effectiveDate || new Date().toLocaleDateString();
  const contactEmail = legal?.contactEmail || 'privacy@example.com';
  
  return `# Privacy Policy

## Introduction

Welcome to ${companyName}. We respect your privacy and are committed to protecting your personal data.

## The Data We Collect About You

We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:

- Identity Data includes first name, last name, username or similar identifier.
- Contact Data includes billing address, delivery address, email address and telephone numbers.
- Technical Data includes internet protocol (IP) address, your login data, browser type and version.
- Usage Data includes information about how you use our website, products and services.

## How We Use Your Personal Data

We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:

- Where we need to perform the contract we are about to enter into or have entered into with you.
- Where it is necessary for our legitimate interests and your interests do not override those interests.
- Where we need to comply with a legal obligation.

## Contact Us

If you have any questions about this privacy policy, please contact us at ${contactEmail}.

## Effective Date

This privacy policy was last updated on ${effectiveDate}.`;
}

/**
 * Generates terms of service
 */
function generateTermsOfService(companyName: string, legal?: ContentOptions['legal']): string {
  const effectiveDate = legal?.effectiveDate || new Date().toLocaleDateString();
  
  return `# Terms of Service

## Introduction

Welcome to ${companyName}. These terms and conditions outline the rules and regulations for the use of our website and services.

## Intellectual Property Rights

Other than the content you own, ${companyName} and/or its licensors own all the intellectual property rights and materials contained in this website.

## Restrictions

You are specifically restricted from all of the following:

- Publishing any website material in any other media
- Selling, sublicensing and/or otherwise commercializing any website material
- Using this website in any way that is or may be damaging to this website

## Effective Date

These terms of service were last updated on ${effectiveDate}.`;
}

/**
 * Generates a cookie policy
 */
function generateCookiePolicy(companyName: string, legal?: ContentOptions['legal']): string {
  const effectiveDate = legal?.effectiveDate || new Date().toLocaleDateString();
  
  return `# Cookie Policy

## Introduction

This Cookie Policy explains how ${companyName} uses cookies and similar technologies to recognize you when you visit our website.

## What are cookies?

Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.

## How we use cookies

We use cookies for the following purposes:

- To enable certain functions of the website
- To provide analytics
- To store your preferences

## Effective Date

This cookie policy was last updated on ${effectiveDate}.`;
}

/**
 * Generates a disclaimer
 */
function generateDisclaimer(companyName: string, legal?: ContentOptions['legal']): string {
  const effectiveDate = legal?.effectiveDate || new Date().toLocaleDateString();
  
  return `# Disclaimer

## Introduction

The information provided by ${companyName} on our website is for general informational purposes only. All information on the site is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability or completeness of any information on the site.

## No Liability

In no event shall ${companyName} be liable for any special, direct, indirect, consequential, or incidental damages or any damages whatsoever, whether in an action of contract, negligence or other tort, arising out of or in connection with the use of the Service or the contents of the Service.

## Effective Date

This disclaimer was last updated on ${effectiveDate}.`;
}

/**
 * Generates an End User License Agreement (EULA)
 */
function generateEULA(companyName: string, legal?: ContentOptions['legal']): string {
  const effectiveDate = legal?.effectiveDate || new Date().toLocaleDateString();
  
  return `# End User License Agreement (EULA)

## Introduction

This End User License Agreement ("EULA") is a legal agreement between you and ${companyName}.

## License Grant

${companyName} grants you a revocable, non-exclusive, non-transferable, limited license to download, install and use the application strictly in accordance with the terms of this Agreement.

## Restrictions

You agree not to, and you will not permit others to:

- License, sell, rent, lease, assign, distribute, transmit, host, outsource, disclose or otherwise commercially exploit the application or make the application available to any third party.
- Modify, make derivative works of, disassemble, decrypt, reverse compile or reverse engineer any part of the application.
- Remove, alter or obscure any proprietary notice (including any notice of copyright or trademark) of ${companyName} or its affiliates, partners, suppliers or the licensors of the application.

## Effective Date

This EULA was last updated on ${effectiveDate}.`;
}

/**
 * Generates meta tags
 */
function generateMetaTags(website: ContentOptions['website']): string {
  if (!website) return '';
  
  const { title, description, keywords } = website;
  const keywordsString = keywords ? keywords.join(', ') : '';
  
  return `<meta name="title" content="${title}">
<meta name="description" content="${description}">
<meta name="keywords" content="${keywordsString}">
<meta name="robots" content="index, follow">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta name="language" content="English">
<meta name="author" content="${website.url}">`;
}

/**
 * Generates schema markup
 */
function generateSchemaMarkup(website: ContentOptions['website']): string {
  if (!website) return '';
  
  const { url, title, description } = website;
  
  return `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "url": "${url}",
  "name": "${title}",
  "description": "${description}"
}
</script>`;
}

/**
 * Generates a sitemap
 */
function generateSitemap(website: ContentOptions['website']): string {
  if (!website) return '';
  
  const { url } = website;
  const date = new Date().toISOString();
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${url}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${url}/about</loc>
    <lastmod>${date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${url}/contact</loc>
    <lastmod>${date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;
}

/**
 * Generates a robots.txt file
 */
function generateRobotsTxt(website: ContentOptions['website']): string {
  if (!website) return '';
  
  const { url } = website;
  
  return `User-agent: *
Allow: /
Sitemap: ${url}/sitemap.xml`;
}

/**
 * Generates Open Graph tags
 */
function generateOgTags(website: ContentOptions['website']): string {
  if (!website) return '';
  
  const { url, title, description } = website;
  
  return `<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${url}">
<meta property="og:type" content="website">
<meta property="og:image" content="${url}/og-image.jpg">`;
}

