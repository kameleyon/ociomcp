// Auto-generated safe fallback for legal-creator

export function activate() {
    console.log("[TOOL] legal-creator activated (passive mode)");
}

/**
 * Handles file write events for legal config or template files.
 * If a relevant file changes, triggers regeneration of legal content.
 */
export async function onFileWrite(event?: { path: string; content?: string }) {
  if (!event || !event.path) {
    console.warn("[legal-creator] onFileWrite called without event data.");
    return;
  }
  try {
    if (event.path.endsWith('.legal-config.json')) {
      console.log(`[legal-creator] Detected legal config file change: ${event.path}`);
      const config = JSON.parse(event.content || await (await import('fs/promises')).readFile(event.path, 'utf-8'));
      const content = generateLegalContent(
        config.type,
        config.company,
        config.outputFormat,
        config.options
      );
      // Optionally write to file or log
      console.log(`[legal-creator] Legal content regenerated for ${event.path}`);
    } else if (event.path.endsWith('.legal-template.md')) {
      console.log(`[legal-creator] Detected legal template file change: ${event.path}`);
      // Optionally reload or re-apply template
      // ... actual logic could go here
    }
  } catch (err) {
    console.error(`[legal-creator] Error during file-triggered legal content generation:`, err);
  }
}

/**
 * Initializes or resets legal creator state at the start of a session.
 */
export function onSessionStart(session?: { id?: string }) {
  console.log(`[legal-creator] Session started${session && session.id ? `: ${session.id}` : ""}. Preparing legal creator environment.`);
  // Example: clear temp files, reset state, etc.
  // ... actual reset logic
}

/**
 * Handles legal creator commands.
 * Supports dynamic invocation of legal content generation or validation.
 */
export async function onCommand(command?: { name: string; args?: any }) {
  if (!command || !command.name) {
    console.warn("[legal-creator] onCommand called without command data.");
    return;
  }
  switch (command.name) {
    case "generate-legal-content":
      console.log("[legal-creator] Generating legal content...");
      try {
        await handleGenerateLegalContent(command.args);
        console.log("[legal-creator] Legal content generation complete.");
      } catch (err) {
        console.error("[legal-creator] Legal content generation failed:", err);
      }
      break;
    case "validate-legal-schema":
      console.log("[legal-creator] Validating legal content schema...");
      try {
        GenerateLegalContentSchema.parse(command.args);
        console.log("[legal-creator] Legal content schema validation successful.");
      } catch (err) {
        console.error("[legal-creator] Legal content schema validation failed:", err);
      }
      break;
    default:
      console.warn(`[legal-creator] Unknown command: ${command.name}`);
  }
}
/**
 * Legal Creator
 * 
 * Creates content for About, Policy, Terms sections
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { z } from 'zod';

/**
 * Schema for LegalCreator tool
 */
export const GenerateLegalContentSchema = z.object({
  type: z.enum(['privacy-policy', 'terms-of-service', 'cookie-policy', 'disclaimer', 'eula', 'refund-policy', 'about-us']),
  company: z.object({
    name: z.string(),
    address: z.string().optional(),
    country: z.string().optional(),
    email: z.string().optional(),
    website: z.string().optional(),
    phone: z.string().optional(),
    description: z.string().optional(),
  }),
  outputFormat: z.enum(['markdown', 'html', 'text']).default('markdown'),
  options: z.object({
    includeEffectiveDate: z.boolean().optional().default(true),
    includeContactInfo: z.boolean().optional().default(true),
    includeDisclaimer: z.boolean().optional().default(true),
    customSections: z.array(
      z.object({
        title: z.string(),
        content: z.string(),
      })
    ).optional(),
    jurisdiction: z.string().optional(),
    dataCollectionPractices: z.array(z.string()).optional(),
    services: z.array(z.string()).optional(),
    refundTimeframe: z.string().optional(),
    refundConditions: z.array(z.string()).optional(),
    teamMembers: z.array(
      z.object({
        name: z.string(),
        role: z.string().optional(),
        bio: z.string().optional(),
      })
    ).optional(),
  }).optional(),
});

/**
 * Legal Content Type
 */
export enum LegalContentType {
  PRIVACY_POLICY = 'privacy-policy',
  TERMS_OF_SERVICE = 'terms-of-service',
  COOKIE_POLICY = 'cookie-policy',
  DISCLAIMER = 'disclaimer',
  EULA = 'eula',
  REFUND_POLICY = 'refund-policy',
  ABOUT_US = 'about-us',
}

/**
 * Output Format
 */
export enum OutputFormat {
  MARKDOWN = 'markdown',
  HTML = 'html',
  TEXT = 'text',
}

/**
 * Legal Content Options
 */
interface LegalContentOptions {
  includeEffectiveDate?: boolean;
  includeContactInfo?: boolean;
  includeDisclaimer?: boolean;
  customSections?: Array<{
    title: string;
    content: string;
  }>;
  jurisdiction?: string;
  dataCollectionPractices?: string[];
  services?: string[];
  refundTimeframe?: string;
  refundConditions?: string[];
  teamMembers?: Array<{
    name: string;
    role?: string;
    bio?: string;
  }>;
}

/**
 * Legal Content Templates
 */
const LEGAL_CONTENT_TEMPLATES: Record<LegalContentType, (companyName: string, options: LegalContentOptions) => string> = {
  [LegalContentType.PRIVACY_POLICY]: generatePrivacyPolicy,
  [LegalContentType.TERMS_OF_SERVICE]: generateTermsOfService,
  [LegalContentType.COOKIE_POLICY]: generateCookiePolicy,
  [LegalContentType.DISCLAIMER]: generateDisclaimer,
  [LegalContentType.EULA]: generateEULA,
  [LegalContentType.REFUND_POLICY]: generateRefundPolicy,
  [LegalContentType.ABOUT_US]: generateAboutUs,
};

/**
 * Generates legal content based on the provided options
 * 
 * @param type Type of legal content to generate
 * @param company Company information
 * @param outputFormat Format to output the content in
 * @param options Additional options for generating the content
 * @returns Generated legal content
 */
export function generateLegalContent(
  type: LegalContentType,
  company: {
    name: string;
    address?: string;
    country?: string;
    email?: string;
    website?: string;
    phone?: string;
    description?: string;
  },
  outputFormat: OutputFormat = OutputFormat.MARKDOWN,
  options: LegalContentOptions = {}
): string {
  // Get the template function for the requested legal content type
  const templateFn = LEGAL_CONTENT_TEMPLATES[type];
  if (!templateFn) {
    throw new Error(`Unknown legal content type: ${type}`);
  }

  // Generate the content in markdown format
  let content = templateFn(company.name, {
    ...options,
    jurisdiction: options.jurisdiction || (company.country || 'your jurisdiction'),
  });

  // Add effective date if requested
  if (options.includeEffectiveDate !== false) {
    const today = new Date();
    const formattedDate = `${today.toLocaleString('default', { month: 'long' })} ${today.getDate()}, ${today.getFullYear()}`;
    content += `\n\nLast updated: ${formattedDate}`;
  }

  // Add contact information if requested
  if (options.includeContactInfo !== false && (company.email || company.address || company.phone)) {
    content += '\n\n## Contact Information\n\n';
    content += `If you have any questions about this ${formatContentType(type)}, please contact us:\n\n`;
    
    if (company.email) {
      content += `- Email: ${company.email}\n`;
    }
    if (company.address) {
      content += `- Address: ${company.address}\n`;
    }
    if (company.phone) {
      content += `- Phone: ${company.phone}\n`;
    }
    if (company.website) {
      content += `- Website: ${company.website}\n`;
    }
  }

  // Add custom sections if provided
  if (options.customSections && options.customSections.length > 0) {
    for (const section of options.customSections) {
      content += `\n\n## ${section.title}\n\n${section.content}`;
    }
  }

  // Add disclaimer if requested
  if (options.includeDisclaimer !== false) {
    content += '\n\n## Disclaimer\n\n';
    content += `This ${formatContentType(type)} is provided for informational purposes only. It does not constitute legal advice and should not be relied upon as such. `;
    content += `We recommend consulting with a legal professional for advice specific to your situation.`;
  }

  // Convert to the requested format
  switch (outputFormat) {
    case OutputFormat.HTML:
      return markdownToHtml(content);
    case OutputFormat.TEXT:
      return markdownToPlainText(content);
    case OutputFormat.MARKDOWN:
    default:
      return content;
  }
}

/**
 * Formats the content type for display
 * 
 * @param type Content type to format
 * @returns Formatted content type
 */
function formatContentType(type: LegalContentType): string {
  switch (type) {
    case LegalContentType.PRIVACY_POLICY:
      return 'Privacy Policy';
    case LegalContentType.TERMS_OF_SERVICE:
      return 'Terms of Service';
    case LegalContentType.COOKIE_POLICY:
      return 'Cookie Policy';
    case LegalContentType.DISCLAIMER:
      return 'Disclaimer';
    case LegalContentType.EULA:
      return 'End User License Agreement';
    case LegalContentType.REFUND_POLICY:
      return 'Refund Policy';
    case LegalContentType.ABOUT_US:
      return 'About Us';
    default:
      return (type as string).replace(/-/g, ' ').replace(/\b\w/g, (char: string) => char.toUpperCase());


  }
}

/**
 * Converts markdown to HTML
 * 
 * @param markdown Markdown content to convert
 * @returns HTML content
 */
function markdownToHtml(markdown: string): string {
  // This is a simple converter - in a real implementation, use a library like marked or showdown
  return markdown
    // Headers
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Lists
    .replace(/^\s*[-*+]\s+(.*$)/gm, '<li>$1</li>')
    // Paragraphs
    .replace(/^(?!<h|<li)(.+)$/gm, '<p>$1</p>')
    // Clean up consecutive breaks
    .replace(/<\/p>\n<p>/g, '</p><p>')
    .replace(/<\/li>\n<li>/g, '</li><li>')
    // Wrap lists
    .replace(/(<li>.*?<\/li>)/gs, '<ul>$1</ul>')
    .replace(/<\/ul>\n<ul>/g, '');
}

/**
 * Converts markdown to plain text
 * 
 * @param markdown Markdown content to convert
 * @returns Plain text content
 */
function markdownToPlainText(markdown: string): string {
  // This is a simple converter - in a real implementation, use a more robust solution
  return markdown
    // Headers
    .replace(/^# (.*$)/gm, '$1\n='.repeat(80))
    .replace(/^## (.*$)/gm, '$1\n-'.repeat(80))
    .replace(/^### (.*$)/gm, '$1\n')
    // Bold and Italic
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    // Lists
    .replace(/^\s*[-*+]\s+(.*$)/gm, '  • $1');
}

/**
 * Generates a privacy policy
 * 
 * @param companyName Company name
 * @param options Additional options
 * @returns Privacy policy content
 */
function generatePrivacyPolicy(companyName: string, options: LegalContentOptions): string {
  const dataItems = options.dataCollectionPractices || [
    "Information you provide to us directly",
    "Information we collect automatically",
    "Information we receive from third parties"
  ];

  return `# Privacy Policy

## Introduction

This Privacy Policy describes how ${companyName} ("we", "our", or "us") collects, uses, and discloses your personal information when you visit our website, use our services, or otherwise interact with us.

## Information We Collect

We may collect the following types of information:

${dataItems.map(item => `- ${item}`).join('\n')}

## How We Use Your Information

We use your information for various purposes, including:

- To provide and maintain our services
- To notify you about changes to our services
- To provide customer support
- To gather analysis or valuable information so that we can improve our services
- To monitor the usage of our services
- To detect, prevent and address technical issues

## Data Retention

We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy.

## Data Security

We value your trust in providing us your personal information, and we are striving to use commercially acceptable means of protecting it. However, no method of transmission over the internet or method of electronic storage is 100% secure, and we cannot guarantee its absolute security.

## Your Data Protection Rights

Depending on your location and applicable laws, you may have various rights regarding your personal information, such as the right to access, correct, delete, or restrict processing of your personal data.

## Third-Party Services

Our service may contain links to other websites that are not operated by us. If you click on a third-party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit.

## Changes to This Privacy Policy

We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.

## Governing Law

This Privacy Policy is governed by the laws of ${options.jurisdiction}, without regard to its conflict of law provisions.`;
}

/**
 * Generates terms of service
 * 
 * @param companyName Company name
 * @param options Additional options
 * @returns Terms of service content
 */
function generateTermsOfService(companyName: string, options: LegalContentOptions): string {
  const services = options.services || ["our website", "our mobile application", "our API"];
  
  return `# Terms of Service

## Introduction

These Terms of Service ("Terms") govern your use of the services provided by ${companyName} ("we", "our", or "us"), including ${services.join(', ')}.

By accessing or using our services, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access our services.

## Use of Our Services

Our services are intended for users who are at least 18 years of age. By using our services, you represent and warrant that you are at least 18 years of age.

You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer or device. You agree to accept responsibility for all activities that occur under your account.

## Intellectual Property

The service and its original content, features, and functionality are and will remain the exclusive property of ${companyName} and its licensors. Our service is protected by copyright, trademark, and other laws of both the ${options.jurisdiction} and foreign countries.

## User-Generated Content

You may provide content to our services, such as comments, feedback, or other materials. By providing content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, distribute, and display such content.

You represent and warrant that your content does not violate the rights of any third party, including copyright, trademark, privacy, or other personal or proprietary rights.

## Termination

We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.

## Limitation of Liability

In no event shall ${companyName}, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.

## Changes to These Terms

We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page and updating the "Last updated" date.

## Governing Law

These Terms shall be governed and construed in accordance with the laws of ${options.jurisdiction}, without regard to its conflict of law provisions.`;
}

/**
 * Generates a cookie policy
 * 
 * @param companyName Company name
 * @param options Additional options
 * @returns Cookie policy content
 */
function generateCookiePolicy(companyName: string, options: LegalContentOptions): string {
  return `# Cookie Policy

## What Are Cookies

Cookies are small pieces of text sent to your web browser by a website you visit. A cookie file is stored in your web browser and allows our service or a third-party to recognize you and make your next visit easier and the service more useful to you.

## How ${companyName} Uses Cookies

When you use and access our service, we may place a number of cookie files in your web browser. We use cookies for the following purposes:

- To enable certain functions of the service
- To provide analytics
- To store your preferences
- To enable advertisements delivery, including behavioral advertising

## Types of Cookies We Use

### Essential Cookies

These cookies are necessary for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services, such as setting your privacy preferences, logging in or filling in forms.

### Performance Cookies

These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular and see how visitors move around the site.

### Functional Cookies

These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we have added to our pages.

### Targeting Cookies

These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant adverts on other sites.

## Your Choices Regarding Cookies

If you prefer to avoid the use of cookies on the website, first you must disable the use of cookies in your browser and then delete the cookies saved in your browser associated with this website. You may use this option for preventing the use of cookies at any time.

## Changes to This Cookie Policy

We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page and updating the "Last updated" date.`;
}

/**
 * Generates a disclaimer
 * 
 * @param companyName Company name
 * @param options Additional options
 * @returns Disclaimer content
 */
function generateDisclaimer(companyName: string, options: LegalContentOptions): string {
  return `# Disclaimer

## Introduction

The information provided by ${companyName} ("we," "us," or "our") on our website and services is for general informational purposes only. All information is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information.

## Not Professional Advice

The information contained on our website is not intended to be a substitute for professional advice. Before taking any actions based upon such information, we encourage you to consult with the appropriate professionals. The use or reliance of any information contained on this website is solely at your own risk.

## External Links Disclaimer

Our website may contain links to external websites that are not provided or maintained by or in any way affiliated with us. Please note that we do not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites.

## Errors and Omissions Disclaimer

The information given by us is for general guidance on matters of interest. Even though we have taken every precaution to ensure that the content is both current and accurate, errors can occur. Plus, given the changing nature of laws, rules and regulations, there may be delays, omissions or inaccuracies in the information contained.

## Fair Use Disclaimer

We may use copyrighted material which has not always been specifically authorized by the copyright owner. We are making such material available for criticism, comment, news reporting, teaching, scholarship, or research.

## Views Expressed Disclaimer

The views and opinions expressed in our content are those of the authors and do not necessarily reflect the official policy or position of any other agency, organization, employer or company. Assumptions made in the analysis are not reflective of the position of any entity other than the author(s).

## No Responsibility Disclaimer

The information on our website is provided on an "as is" basis. In no event shall we be liable for any loss or damage including without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits arising out of, or in connection with, the use of our website.

## "Use at Your Own Risk" Disclaimer

All information on our website is provided "as is", with no guarantee of completeness, accuracy, timeliness or of the results obtained from the use of this information, and without warranty of any kind, express or implied, including, but not limited to warranties of performance, merchantability, and fitness for a particular purpose.

${companyName} will not be liable to you or anyone else for any decision made or action taken in reliance on the information given by our services, or for any consequential, special or similar damages, even if advised of the possibility of such damages.`;
}

/**
 * Generates an End User License Agreement
 * 
 * @param companyName Company name
 * @param options Additional options
 * @returns EULA content
 */
function generateEULA(companyName: string, options: LegalContentOptions): string {
  return `# End User License Agreement (EULA)

This End User License Agreement ("Agreement") is a legal agreement between you (either an individual or a single entity) and ${companyName} for the software product identified above, which includes computer software and may include associated media, printed materials, and "online" or electronic documentation ("SOFTWARE PRODUCT").

By installing, copying, or otherwise using the SOFTWARE PRODUCT, you agree to be bound by the terms of this Agreement. If you do not agree to the terms of this Agreement, do not install or use the SOFTWARE PRODUCT.

## 1. GRANT OF LICENSE

${companyName} grants you the following rights provided that you comply with all terms and conditions of this Agreement:

Installation and Use: You may install and use the SOFTWARE PRODUCT on your devices.

## 2. DESCRIPTION OF OTHER RIGHTS AND LIMITATIONS

Maintenance of Copyright Notices: You must not remove or alter any copyright notices on any copies of the SOFTWARE PRODUCT.

Distribution: You may not distribute copies of the SOFTWARE PRODUCT to third parties.

Rental: You may not rent, lease, or lend the SOFTWARE PRODUCT.

Support Services: ${companyName} may provide you with support services related to the SOFTWARE PRODUCT. Any supplemental software code provided to you as part of the Support Services shall be considered part of the SOFTWARE PRODUCT and subject to the terms and conditions of this Agreement.

Compliance with Applicable Laws: You must comply with all applicable laws regarding use of the SOFTWARE PRODUCT.

## 3. TERMINATION

Without prejudice to any other rights, ${companyName} may terminate this Agreement if you fail to comply with the terms and conditions of this Agreement. In such event, you must destroy all copies of the SOFTWARE PRODUCT in your possession.

## 4. COPYRIGHT

All title, including but not limited to copyrights, in and to the SOFTWARE PRODUCT and any copies thereof are owned by ${companyName} or its suppliers. All title and intellectual property rights in and to the content which may be accessed through use of the SOFTWARE PRODUCT is the property of the respective content owner and may be protected by applicable copyright or other intellectual property laws and treaties.

## 5. NO WARRANTIES

${companyName} expressly disclaims any warranty for the SOFTWARE PRODUCT. The SOFTWARE PRODUCT is provided 'As Is' without any express or implied warranty of any kind, including but not limited to any warranties of merchantability, noninfringement, or fitness of a particular purpose.

## 6. LIMITATION OF LIABILITY

In no event shall ${companyName} be liable for any damages (including, without limitation, lost profits, business interruption, or lost information) rising out of use of or inability to use the SOFTWARE PRODUCT, even if ${companyName} has been advised of the possibility of such damages.

## 7. GOVERNING LAW

This Agreement is governed by the laws of ${options.jurisdiction}.`;
}

/**
 * Generates a refund policy
 * 
 * @param companyName Company name
 * @param options Additional options
 * @returns Refund policy content
 */
function generateRefundPolicy(companyName: string, options: LegalContentOptions): string {
  const timeframe = options.refundTimeframe || '30 days';
  const conditions = options.refundConditions || [
    "The product is defective or damaged upon receipt",
    "The product received significantly differs from its description",
    "The order was incorrectly processed"
  ];

  return `# Refund Policy

## Overview

At ${companyName}, we strive to ensure your satisfaction with our products and services. This Refund Policy outlines our procedures and conditions for refunds.

## Refund Timeframe

We offer refunds within ${timeframe} of purchase, provided the conditions outlined below are met.

## Conditions for Refunds

We will issue a refund if:

${conditions.map(condition => `- ${condition}`).join('\n')}

## How to Request a Refund

To request a refund, please contact our customer support team with your order details and the reason for your refund request.

## Processing Time

Once your refund request is approved, we will process the refund within 5-10 business days. The time it takes for the refund to appear in your account depends on your payment method and financial institution.

## Exceptions

Certain products or services may have specific refund conditions that differ from this general policy. These exceptions will be clearly noted at the time of purchase.

## Digital Products

For digital products, special conditions may apply:

- Digital downloads may be eligible for refunds only if you have not downloaded the item.
- Subscription services may be refunded on a prorated basis for the unused portion.

## Cancellation Rights

For ongoing services, you may have the right to cancel and receive a refund for the unused portion of the service, subject to the terms of the specific service agreement.

## Changes to This Policy

We reserve the right to modify this Refund Policy at any time. Changes will take effect immediately upon posting on our website.`;
}

/**
 * Generates an About Us page
 * 
 * @param companyName Company name
 * @param options Additional options
 * @returns About Us content
 */
function generateAboutUs(companyName: string, options: LegalContentOptions): string {
  const teamMembers = options.teamMembers || [];

  return `# About ${companyName}

## Our Story

${companyName} was founded with a vision to [company vision or founding story]. We are dedicated to [company mission or purpose].

## What We Do

We specialize in providing [description of products or services]. Our goal is to [company goal or objective], ensuring that [value proposition for customers].

## Our Values

- **Innovation**: We constantly strive to improve and innovate in everything we do.
- **Quality**: We are committed to delivering the highest quality products and services.
- **Integrity**: We conduct our business with honesty, transparency, and respect for all stakeholders.
- **Customer Satisfaction**: Our customers' needs and satisfaction are at the heart of our business decisions.

${teamMembers.length > 0 ? `
## Our Team

${teamMembers.map(member => `
### ${member.name}${member.role ? ` - ${member.role}` : ''}

${member.bio || 'Team member at ' + companyName}
`).join('\n')}
` : ''}

## Our Commitment

At ${companyName}, we are committed to [describe commitment to customers, community, industry, etc.]. We believe in [company belief or philosophy] and strive to [company goal or mission].

## Connect With Us

We value communication with our customers, partners, and community. Follow us on social media or contact us directly to join the conversation.`;
}

/**
 * Handle generate_legal_content command
 * 
 * @param args Command arguments
 * @returns Command result
 */
export async function handleGenerateLegalContent(args: any) {
  try {
    const { type, company, outputFormat = 'markdown', options = {} } = args;
    
    // Validate type
    if (!Object.values(LegalContentType).includes(type)) {
      return {
        content: [{ type: "text", text: `Error: Invalid legal content type: ${type}` }],
        isError: true,
      };
    }
    
    // Generate the legal content
    const legalContent = generateLegalContent(
      type as LegalContentType,
      company,
      outputFormat as OutputFormat,
      options
    );
    
    return {
      content: [{ type: "text", text: legalContent }],
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error generating legal content: ${error}` }],
      isError: true,
    };
  }
}
