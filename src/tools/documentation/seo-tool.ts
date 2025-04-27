// Auto-generated safe fallback for seo-tool

export function activate() {
    console.log("[TOOL] seo-tool activated (passive mode)");
}

export function onFileWrite() { /* no-op */ }
export function onSessionStart() { /* no-op */ }
export function onCommand() { /* no-op */ }
/**
 * SEO Tool
 * 
 * Includes relevant metadata and keywords on pages
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { z } from 'zod';

/**
 * Schema for SEO Tool
 */
export const GenerateSEOMetadataSchema = z.object({
  title: z.string(),
  description: z.string(),
  url: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  type: z.enum(['website', 'article', 'product', 'profile']).default('website'),
  locale: z.string().optional(),
  image: z.string().optional(),
  siteName: z.string().optional(),
  twitterHandle: z.string().optional(),
  author: z.string().optional(),
  publishedTime: z.string().optional(),
  options: z.object({
    includeOpenGraph: z.boolean().optional().default(true),
    includeTwitterCard: z.boolean().optional().default(true),
    includeStructuredData: z.boolean().optional().default(true),
    includeCanonical: z.boolean().optional().default(true),
    includeRobots: z.boolean().optional().default(true),
    robotsDirectives: z.array(z.enum([
      'index', 'noindex', 'follow', 'nofollow', 'noarchive', 
      'nosnippet', 'notranslate', 'noimageindex'
    ])).optional(),
  }).optional(),
  socialMedia: z.object({
    facebook: z.object({
      appId: z.string().optional(),
      pageId: z.string().optional(),
    }).optional(),
    twitter: z.object({
      cardType: z.enum(['summary', 'summary_large_image', 'app', 'player']).optional(),
    }).optional(),
  }).optional(),
  outputFormat: z.enum(['html', 'json', 'react']).default('html'),
});

/**
 * SEO Metadata type
 */
export interface SEOMetadata {
  title: string;
  description: string;
  url?: string;
  keywords?: string[];
  type?: 'website' | 'article' | 'product' | 'profile';
  locale?: string;
  image?: string;
  siteName?: string;
  twitterHandle?: string;
  author?: string;
  publishedTime?: string;
  options?: {
    includeOpenGraph?: boolean;
    includeTwitterCard?: boolean;
    includeStructuredData?: boolean;
    includeCanonical?: boolean;
    includeRobots?: boolean;
    robotsDirectives?: Array<
      'index' | 'noindex' | 'follow' | 'nofollow' | 'noarchive' | 
      'nosnippet' | 'notranslate' | 'noimageindex'
    >;
  };
  socialMedia?: {
    facebook?: {
      appId?: string;
      pageId?: string;
    };
    twitter?: {
      cardType?: 'summary' | 'summary_large_image' | 'app' | 'player';
    };
  };
}

/**
 * Generates SEO metadata based on the provided options
 * 
 * @param metadata SEO metadata options
 * @param outputFormat Output format for the metadata
 * @returns Generated SEO metadata
 */
export function generateSEOMetadata(
  metadata: SEOMetadata,
  outputFormat: 'html' | 'json' | 'react' = 'html'
): string | Record<string, any> {
  const options = metadata.options || {};
  
  // Default all boolean options to true if not specified
  const includeOpenGraph = options.includeOpenGraph !== false;
  const includeTwitterCard = options.includeTwitterCard !== false;
  const includeStructuredData = options.includeStructuredData !== false;
  const includeCanonical = options.includeCanonical !== false;
  const includeRobots = options.includeRobots !== false;
  
  // Create the metadata object
  const metaTags: Array<{ tag: string; attrs: Record<string, string>; content?: string }> = [];
  
  // Basic metadata
  metaTags.push({ tag: 'title', attrs: {}, content: metadata.title });
  metaTags.push({ tag: 'meta', attrs: { name: 'description', content: metadata.description } });
  
  if (metadata.keywords && metadata.keywords.length > 0) {
    metaTags.push({ tag: 'meta', attrs: { name: 'keywords', content: metadata.keywords.join(', ') } });
  }
  
  // Canonical URL
  if (includeCanonical && metadata.url) {
    metaTags.push({ tag: 'link', attrs: { rel: 'canonical', href: metadata.url } });
  }
  
  // Robots directives
  if (includeRobots) {
    const robotsContent = options.robotsDirectives 
      ? options.robotsDirectives.join(', ') 
      : 'index, follow';
    metaTags.push({ tag: 'meta', attrs: { name: 'robots', content: robotsContent } });
  }
  
  // Open Graph metadata
  if (includeOpenGraph) {
    metaTags.push({ tag: 'meta', attrs: { property: 'og:title', content: metadata.title } });
    metaTags.push({ tag: 'meta', attrs: { property: 'og:description', content: metadata.description } });
    
    if (metadata.url) {
      metaTags.push({ tag: 'meta', attrs: { property: 'og:url', content: metadata.url } });
    }
    
    metaTags.push({ tag: 'meta', attrs: { property: 'og:type', content: metadata.type || 'website' } });
    
    if (metadata.image) {
      metaTags.push({ tag: 'meta', attrs: { property: 'og:image', content: metadata.image } });
    }
    
    if (metadata.locale) {
      metaTags.push({ tag: 'meta', attrs: { property: 'og:locale', content: metadata.locale } });
    }
    
    if (metadata.siteName) {
      metaTags.push({ tag: 'meta', attrs: { property: 'og:site_name', content: metadata.siteName } });
    }
    
    // Facebook specific
    if (metadata.socialMedia?.facebook?.appId) {
      metaTags.push({ tag: 'meta', attrs: { property: 'fb:app_id', content: metadata.socialMedia.facebook.appId } });
    }
    
    if (metadata.socialMedia?.facebook?.pageId) {
      metaTags.push({ tag: 'meta', attrs: { property: 'fb:page_id', content: metadata.socialMedia.facebook.pageId } });
    }
    
    // Article metadata
    if (metadata.type === 'article') {
      if (metadata.author) {
        metaTags.push({ tag: 'meta', attrs: { property: 'article:author', content: metadata.author } });
      }
      
      if (metadata.publishedTime) {
        metaTags.push({ tag: 'meta', attrs: { property: 'article:published_time', content: metadata.publishedTime } });
      }
    }
  }
  
  // Twitter Card metadata
  if (includeTwitterCard) {
    const cardType = metadata.socialMedia?.twitter?.cardType || 'summary';
    metaTags.push({ tag: 'meta', attrs: { name: 'twitter:card', content: cardType } });
    metaTags.push({ tag: 'meta', attrs: { name: 'twitter:title', content: metadata.title } });
    metaTags.push({ tag: 'meta', attrs: { name: 'twitter:description', content: metadata.description } });
    
    if (metadata.image) {
      metaTags.push({ tag: 'meta', attrs: { name: 'twitter:image', content: metadata.image } });
    }
    
    if (metadata.twitterHandle) {
      metaTags.push({ tag: 'meta', attrs: { name: 'twitter:site', content: metadata.twitterHandle } });
      
      if (metadata.type === 'article' && metadata.author) {
        metaTags.push({ tag: 'meta', attrs: { name: 'twitter:creator', content: metadata.twitterHandle } });
      }
    }
  }
  
  // Format the output
  if (outputFormat === 'json') {
    return metaTags;
  } else if (outputFormat === 'react') {
    return metaTags.map(tag => {
      if (tag.tag === 'title') {
        return `<title>${tag.content}</title>`;
      } else if (tag.tag === 'link') {
        const attrs = Object.entries(tag.attrs)
          .map(([key, value]) => `${key}="${value}"`)
          .join(' ');
        return `<link ${attrs} />`;
      } else {
        const attrs = Object.entries(tag.attrs)
          .map(([key, value]) => `${key}="${value}"`)
          .join(' ');
        return `<meta ${attrs} />`;
      }
    }).join('\n');
  } else {
    // HTML format
    return metaTags.map(tag => {
      if (tag.tag === 'title') {
        return `<title>${tag.content}</title>`;
      } else if (tag.tag === 'link') {
        const attrs = Object.entries(tag.attrs)
          .map(([key, value]) => `${key}="${value}"`)
          .join(' ');
        return `<link ${attrs}>`;
      } else {
        const attrs = Object.entries(tag.attrs)
          .map(([key, value]) => `${key}="${value}"`)
          .join(' ');
        return `<meta ${attrs}>`;
      }
    }).join('\n');
  }
}

/**
 * Generates JSON-LD structured data for a page
 * 
 * @param metadata SEO metadata
 * @returns JSON-LD structured data
 */
export function generateStructuredData(metadata: SEOMetadata): string {
  let structuredData: Record<string, any> = {};
  
  switch (metadata.type) {
    case 'article':
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        'headline': metadata.title,
        'description': metadata.description,
        'image': metadata.image || '',
        'author': {
          '@type': 'Person',
          'name': metadata.author || '',
        },
        'publisher': {
          '@type': 'Organization',
          'name': metadata.siteName || '',
          'logo': {
            '@type': 'ImageObject',
            'url': metadata.image || '',
          },
        },
        'datePublished': metadata.publishedTime || new Date().toISOString(),
        'mainEntityOfPage': {
          '@type': 'WebPage',
          '@id': metadata.url || '',
        },
      };
      break;
      
    case 'product':
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        'name': metadata.title,
        'description': metadata.description,
        'image': metadata.image || '',
      };
      break;
      
    case 'profile':
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        'name': metadata.title,
        'description': metadata.description,
        'image': metadata.image || '',
      };
      break;
      
    case 'website':
    default:
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'name': metadata.title,
        'description': metadata.description,
        'url': metadata.url || '',
      };
      break;
  }
  
  return `<script type="application/ld+json">${JSON.stringify(structuredData, null, 2)}</script>`;
}

/**
 * Analyzes a text for SEO optimization
 * 
 * @param text Text to analyze
 * @param targetKeywords Target keywords to optimize for
 * @returns SEO analysis
 */
export function analyzeSEO(
  text: string,
  targetKeywords: string[]
): {
  score: number;
  keywordDensity: Record<string, number>;
  suggestions: string[];
} {
  // Normalize text
  const normalizedText = text.toLowerCase();
  
  // Calculate keyword density
  const keywordDensity: Record<string, number> = {};
  const suggestions: string[] = [];
  let score = 0;
  
  // Count words
  const wordCount = normalizedText.split(/\s+/).length;
  
  if (wordCount < 300) {
    suggestions.push('Consider adding more content. Recommended minimum is 300 words.');
    score -= 10;
  } else if (wordCount > 1500) {
    suggestions.push('Content is quite long. Consider breaking it into multiple pages if appropriate.');
    score -= 5;
  } else {
    score += 10;
    suggestions.push('Content length is good.');
  }
  
  // Check keyword density
  for (const keyword of targetKeywords) {
    const regex = new RegExp(`\\b${keyword.toLowerCase()}\\b`, 'g');
    const matches = normalizedText.match(regex);
    const count = matches ? matches.length : 0;
    const density = (count / wordCount) * 100;
    
    keywordDensity[keyword] = density;
    
    if (density === 0) {
      suggestions.push(`Keyword "${keyword}" is not used. Consider including it.`);
      score -= 5;
    } else if (density < 0.5) {
      suggestions.push(`Keyword "${keyword}" density is low (${density.toFixed(2)}%). Consider using it more.`);
      score -= 2;
    } else if (density > 3) {
      suggestions.push(`Keyword "${keyword}" density is high (${density.toFixed(2)}%). This might be seen as keyword stuffing.`);
      score -= 5;
    } else {
      score += 5;
      suggestions.push(`Keyword "${keyword}" has good density (${density.toFixed(2)}%).`);
    }
  }
  
  // Check for title
  if (text.match(/^\s*<h1[^>]*>/i) || text.match(/^\s*# /m)) {
    score += 10;
    suggestions.push('Content has a title.');
    
    // Check for keyword in title
    const titleMatch = text.match(/<h1[^>]*>(.*?)<\/h1>/i) || text.match(/# (.*)/m);
    if (titleMatch && titleMatch[1]) {
      const title = titleMatch[1].toLowerCase();
      const keywordInTitle = targetKeywords.some(keyword => title.includes(keyword.toLowerCase()));
      
      if (keywordInTitle) {
        score += 15;
        suggestions.push('Title contains a target keyword. Great!');
      } else {
        suggestions.push('Consider including a target keyword in the title.');
        score -= 5;
      }
    }
  } else {
    suggestions.push('Content is missing a clear title (H1 or # heading).');
    score -= 10;
  }
  
  // Check for subtitles
  if (text.match(/<h2[^>]*>/i) || text.match(/## /m)) {
    score += 5;
    suggestions.push('Content has subtitles, which helps with readability and SEO.');
  } else {
    suggestions.push('Consider adding subtitles (H2 or ##) to structure your content better.');
    score -= 5;
  }
  
  // Check for images
  if (text.match(/<img[^>]*>/i) || text.match(/!\[.*?\]\(.*?\)/)) {
    score += 5;
    suggestions.push('Content includes images, which can improve engagement.');
    
    // Check for alt text
    if (text.match(/<img[^>]*alt=["'][^"']*["'][^>]*>/i) || text.match(/!\[.+?\]\(.*?\)/)) {
      score += 5;
      suggestions.push('Images have alt text. Good for accessibility and SEO.');
    } else {
      suggestions.push('Ensure all images have descriptive alt text.');
      score -= 5;
    }
  } else {
    suggestions.push('Consider adding relevant images to enhance your content.');
    score -= 5;
  }
  
  // Check for links
  if (text.match(/<a[^>]*>/i) || text.match(/\[.*?\]\(.*?\)/)) {
    score += 5;
    suggestions.push('Content includes links, which helps with SEO.');
  } else {
    suggestions.push('Consider adding internal or external links to relevant content.');
    score -= 5;
  }
  
  // Normalize score
  score = Math.min(Math.max(score, 0), 100);
  
  return {
    score,
    keywordDensity,
    suggestions,
  };
}

/**
 * Generate a robots.txt file
 * 
 * @param options Options for the robots.txt file
 * @returns Generated robots.txt content
 */
export function generateRobotsTxt(options: {
  allowAll?: boolean;
  disallowPaths?: string[];
  sitemapUrl?: string;
  userAgents?: Array<{
    name: string;
    allow?: string[];
    disallow?: string[];
  }>;
}): string {
  let content = '';
  
  // Default user agent
  if (!options.userAgents || options.userAgents.length === 0) {
    content += 'User-agent: *\n';
    
    if (options.allowAll) {
      content += 'Allow: /\n';
    } else if (options.disallowPaths && options.disallowPaths.length > 0) {
      for (const path of options.disallowPaths) {
        content += `Disallow: ${path}\n`;
      }
    } else {
      content += 'Disallow:\n'; // Allow all
    }
    
    content += '\n';
  } else {
    // Custom user agents
    for (const userAgent of options.userAgents) {
      content += `User-agent: ${userAgent.name}\n`;
      
      if (userAgent.allow && userAgent.allow.length > 0) {
        for (const path of userAgent.allow) {
          content += `Allow: ${path}\n`;
        }
      }
      
      if (userAgent.disallow && userAgent.disallow.length > 0) {
        for (const path of userAgent.disallow) {
          content += `Disallow: ${path}\n`;
        }
      }
      
      content += '\n';
    }
  }
  
  // Sitemap
  if (options.sitemapUrl) {
    content += `Sitemap: ${options.sitemapUrl}\n`;
  }
  
  return content;
}

/**
 * Generate a sitemap.xml file
 * 
 * @param urls URLs to include in the sitemap
 * @returns Generated sitemap.xml content
 */
export function generateSitemap(urls: Array<{
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}>): string {
  let content = '<?xml version="1.0" encoding="UTF-8"?>\n';
  content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  for (const url of urls) {
    content += '  <url>\n';
    content += `    <loc>${url.loc}</loc>\n`;
    
    if (url.lastmod) {
      content += `    <lastmod>${url.lastmod}</lastmod>\n`;
    }
    
    if (url.changefreq) {
      content += `    <changefreq>${url.changefreq}</changefreq>\n`;
    }
    
    if (url.priority !== undefined) {
      content += `    <priority>${url.priority.toFixed(1)}</priority>\n`;
    }
    
    content += '  </url>\n';
  }
  
  content += '</urlset>';
  
  return content;
}

/**
 * Handle generate_seo_metadata command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleGenerateSEOMetadata(args: any) {
  try {
    const { 
      title, 
      description, 
      url, 
      keywords, 
      type = 'website', 
      locale, 
      image, 
      siteName, 
      twitterHandle, 
      author, 
      publishedTime, 
      options = {},
      socialMedia = {},
      outputFormat = 'html'
    } = args;
    
    // Generate the SEO metadata
    const metadata: SEOMetadata = {
      title,
      description,
      url,
      keywords,
      type,
      locale,
      image,
      siteName,
      twitterHandle,
      author,
      publishedTime,
      options,
      socialMedia,
    };
    
    const result = generateSEOMetadata(metadata, outputFormat);
    
    // Add structured data if requested
    let output = typeof result === 'string' ? result : JSON.stringify(result, null, 2);
    
    if (options.includeStructuredData !== false && outputFormat !== 'json') {
      const structuredData = generateStructuredData(metadata);
      output += '\n\n' + structuredData;
    }
    
    return {
      content: [{ type: "text", text: output }],
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error generating SEO metadata: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Handle analyze_seo command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleAnalyzeSEO(args: any) {
  try {
    const { content, keywords } = args;
    
    // Analyze the content
    const analysis = analyzeSEO(content, keywords);
    
    // Format the output
    let output = `SEO Score: ${analysis.score}/100\n\n`;
    
    output += `## Keyword Density\n\n`;
    for (const [keyword, density] of Object.entries(analysis.keywordDensity)) {
      output += `- "${keyword}": ${density.toFixed(2)}%\n`;
    }
    
    output += `\n## Suggestions\n\n`;
    for (const suggestion of analysis.suggestions) {
      output += `- ${suggestion}\n`;
    }
    
    return {
      content: [{ type: "text", text: output }],
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error analyzing SEO: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Handle generate_robots_txt command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleGenerateRobotsTxt(args: any) {
  try {
    const { allowAll, disallowPaths, sitemapUrl, userAgents } = args;
    
    // Generate the robots.txt content
    const robotsTxt = generateRobotsTxt({
      allowAll,
      disallowPaths,
      sitemapUrl,
      userAgents,
    });
    
    return {
      content: [{ type: "text", text: robotsTxt }],
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error generating robots.txt: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Handle generate_sitemap command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleGenerateSitemap(args: any) {
  try {
    const { urls } = args;
    
    // Generate the sitemap.xml content
    const sitemap = generateSitemap(urls);
    
    return {
      content: [{ type: "text", text: sitemap }],
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error generating sitemap: ${error}` }],
      isError: true,
    };
  }
}

