/**
 * Content Generator Tool
 * Provides functionality for generating various types of content
 */

// Configuration for auto-generation
const AUTO_GENERATE_INTERVAL = 10 * 60 * 1000; // 10 minutes
let lastGenerationTime = 0;

// Store for generated content templates
const contentTemplates = [];

// Content type definitions
const ContentType = {
  LEGAL: 'legal',
  SEO: 'seo',
  MARKETING: 'marketing',
  DOCUMENTATION: 'documentation',
  EMAIL: 'email',
  SOCIAL: 'social',
};

// Legal content type definitions
const LegalContentType = {
  PRIVACY_POLICY: 'privacy-policy',
  TERMS_OF_SERVICE: 'terms-of-service',
  COOKIE_POLICY: 'cookie-policy',
  DISCLAIMER: 'disclaimer',
  EULA: 'eula',
};

// SEO content type definitions
const SeoContentType = {
  META_TAGS: 'meta-tags',
  SCHEMA_MARKUP: 'schema-markup',
  SITEMAP: 'sitemap',
  ROBOTS_TXT: 'robots-txt',
  OG_TAGS: 'og-tags',
};

export function activate() {
  console.log("[TOOL] content-generator activated ✅");
  // Initialize content templates
  loadContentTemplates();
}

export function onFileWrite(event) {
  // Check if this is a content-related file
  if (isContentFile(event.path)) {
    console.log(`[Content Generator] Content file modified: ${event.path}`);
    
    // Auto-generate related content if needed
    const now = Date.now();
    if (now - lastGenerationTime > AUTO_GENERATE_INTERVAL) {
      generateRelatedContent(event.path, event.content)
        .then(result => {
          lastGenerationTime = now;
          console.log(`[Content Generator] Generated related content for ${event.path}`);
        })
        .catch(err => {
          console.error('[Content Generator Error]', err);
        });
    }
  }
}

export function onSessionStart() {
  console.log("[Content Generator] Session started, refreshing content templates");
  // Refresh content templates at session start
  loadContentTemplates()
    .then(() => console.log(`[Content Generator] Loaded ${contentTemplates.length} templates`))
    .catch(err => console.error('[Content Generator Error]', err));
}

export function onCommand(cmd) {
  const [action, ...args] = cmd.trim().split(/\s+/);

  if (action === "generate") {
    const type = args[0];
    const subtype = args[1];
    
    if (!type) {
      return { error: "Content type is required" };
    }
    
    try {
      const options = {
        type,
        subtype,
        format: 'markdown'
      };
      
      let content = '';
      
      switch (type) {
        case ContentType.LEGAL:
          content = generateLegalContent({
            ...options,
            company: { name: "Example Company", description: "An example company" }
          });
          break;
        case ContentType.SEO:
          content = generateSeoContent({
            ...options,
            website: { 
              url: "https://example.com", 
              title: "Example Website", 
              description: "An example website" 
            }
          });
          break;
        default:
          return { error: `Unsupported content type: ${type}` };
      }
      
      return { content };
    } catch (error) {
      return { error: String(error) };
    }
  }
  
  if (action === "list-templates") {
    return { templates: contentTemplates.map(t => `${t.type}/${t.subtype}: ${t.description}`) };
  }
  
  return { error: `Unknown command: ${action}` };
}

/**
 * Generates legal content
 */
export function generateLegalContent(options) {
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
export function generateSeoContent(options) {
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
function generatePrivacyPolicy(companyName, legal) {
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
function generateTermsOfService(companyName, legal) {
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
function generateCookiePolicy(companyName, legal) {
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
function generateDisclaimer(companyName, legal) {
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
function generateEULA(companyName, legal) {
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
function generateMetaTags(website) {
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
function generateSchemaMarkup(website) {
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
function generateSitemap(website) {
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
function generateRobotsTxt(website) {
  if (!website) return '';
  
  const { url } = website;
  
  return `User-agent: *
Allow: /
Sitemap: ${url}/sitemap.xml`;
}

/**
 * Generates Open Graph tags
 */
function generateOgTags(website) {
  if (!website) return '';
  
  const { url, title, description } = website;
  
  return `<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${url}">
<meta property="og:type" content="website">
<meta property="og:image" content="${url}/og-image.jpg">`;
}

/**
 * Checks if a file is a content-related file
 * @param filePath Path to the file
 * @returns True if the file is content-related
 */
function isContentFile(filePath) {
  // Check file extensions and paths that are content-related
  const contentExtensions = ['.md', '.html', '.txt', '.json'];
  const contentPaths = ['content', 'docs', 'legal', 'marketing', 'seo'];
  
  const ext = filePath.substring(filePath.lastIndexOf('.')).toLowerCase();
  
  // Check if the file has a content-related extension
  if (contentExtensions.includes(ext)) {
    return true;
  }
  
  // Check if the file is in a content-related directory
  for (const path of contentPaths) {
    if (filePath.toLowerCase().includes(`/${path}/`)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Loads content templates from predefined sources
 * @returns Promise that resolves when templates are loaded
 */
async function loadContentTemplates() {
  try {
    // Clear existing templates
    contentTemplates.length = 0;
    
    // Add legal templates
    contentTemplates.push({
      type: ContentType.LEGAL,
      subtype: LegalContentType.PRIVACY_POLICY,
      template: 'privacy-policy-template',
      variables: ['companyName', 'effectiveDate', 'contactEmail'],
      description: 'Privacy Policy template'
    });
    
    contentTemplates.push({
      type: ContentType.LEGAL,
      subtype: LegalContentType.TERMS_OF_SERVICE,
      template: 'terms-of-service-template',
      variables: ['companyName', 'effectiveDate'],
      description: 'Terms of Service template'
    });
    
    // Add SEO templates
    contentTemplates.push({
      type: ContentType.SEO,
      subtype: SeoContentType.META_TAGS,
      template: 'meta-tags-template',
      variables: ['title', 'description', 'keywords'],
      description: 'Meta tags template'
    });
    
    contentTemplates.push({
      type: ContentType.SEO,
      subtype: SeoContentType.SCHEMA_MARKUP,
      template: 'schema-markup-template',
      variables: ['url', 'title', 'description'],
      description: 'Schema markup template'
    });
    
    console.log(`[Content Generator] Loaded ${contentTemplates.length} templates`);
  } catch (error) {
    console.error('[Content Generator] Error loading templates:', error);
    throw error;
  }
}

/**
 * Generates content related to a modified file
 * @param filePath Path to the modified file
 * @param content Content of the modified file
 * @returns Promise that resolves with the generated content
 */
async function generateRelatedContent(filePath, content) {
  try {
    // Determine what type of content to generate based on the file
    let contentType;
    let subtype;
    
    if (filePath.includes('/legal/')) {
      contentType = ContentType.LEGAL;
      
      if (filePath.includes('privacy')) {
        subtype = LegalContentType.PRIVACY_POLICY;
      } else if (filePath.includes('terms')) {
        subtype = LegalContentType.TERMS_OF_SERVICE;
      } else if (filePath.includes('cookie')) {
        subtype = LegalContentType.COOKIE_POLICY;
      }
    } else if (filePath.includes('/seo/') || filePath.includes('/meta/')) {
      contentType = ContentType.SEO;
      
      if (filePath.includes('meta')) {
        subtype = SeoContentType.META_TAGS;
      } else if (filePath.includes('schema')) {
        subtype = SeoContentType.SCHEMA_MARKUP;
      } else if (filePath.includes('sitemap')) {
        subtype = SeoContentType.SITEMAP;
      }
    }
    
    if (!contentType) {
      return '';
    }
    
    // Extract company name or website URL from content if possible
    const companyNameMatch = content.match(/company[:\s]+([A-Za-z0-9\s]+)/i);
    const companyName = companyNameMatch ? companyNameMatch[1].trim() : 'Example Company';
    
    const urlMatch = content.match(/https?:\/\/[A-Za-z0-9.-]+\.[A-Za-z]{2,}/);
    const url = urlMatch ? urlMatch[0] : 'https://example.com';
    
    // Generate appropriate content
    if (contentType === ContentType.LEGAL) {
      return generateLegalContent({
        type: ContentType.LEGAL,
        subtype,
        company: {
          name: companyName,
          description: `${companyName} is a company that provides services.`
        },
        legal: {
          effectiveDate: new Date().toLocaleDateString(),
          contactEmail: `contact@${url.replace(/^https?:\/\//, '').replace(/\/.*$/, '')}`
        }
      });
    } else if (contentType === ContentType.SEO) {
      return generateSeoContent({
        type: ContentType.SEO,
        subtype,
        website: {
          url,
          title: `${companyName} - Official Website`,
          description: `${companyName} provides high-quality services to customers worldwide.`
        }
      });
    }
    
    return '';
  } catch (error) {
    console.error('[Content Generator] Error generating related content:', error);
    throw error;
  }
}