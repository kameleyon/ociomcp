/**
 * Documentation Generator
 * Provides functionality for generating project documentation
 */

/**
 * Documentation type definitions
 */
export enum DocumentationType {
  README = 'readme',
  API_DOCS = 'api-docs',
  USER_GUIDE = 'user-guide',
  CONTRIBUTING = 'contributing',
  CODE_OF_CONDUCT = 'code-of-conduct',
  CHANGELOG = 'changelog',
  LICENSE = 'license',
}

/**
 * Documentation format definitions
 */
export enum DocumentationFormat {
  MARKDOWN = 'markdown',
  HTML = 'html',
  ASCIIDOC = 'asciidoc',
  RST = 'rst',
}

/**
 * Documentation section
 */
export interface DocumentationSection {
  title: string;
  content: string;
  subsections?: DocumentationSection[];
}

/**
 * Documentation template
 */
export interface DocumentationTemplate {
  type: DocumentationType;
  format: DocumentationFormat;
  sections: DocumentationSection[];
}

/**
 * Documentation options
 */
export interface DocumentationOptions {
  projectName: string;
  projectDescription: string;
  type: DocumentationType;
  format?: DocumentationFormat;
  sections?: DocumentationSection[];
  includeInstallation?: boolean;
  includeUsage?: boolean;
  includeAPI?: boolean;
  includeContributing?: boolean;
  includeLicense?: boolean;
  licenseType?: string;
  repositoryUrl?: string;
  author?: string;
  customSections?: DocumentationSection[];
}

/**
 * Default README template
 */
export const DEFAULT_README_TEMPLATE: DocumentationTemplate = {
  type: DocumentationType.README,
  format: DocumentationFormat.MARKDOWN,
  sections: [
    {
      title: 'Project Name',
      content: 'A brief description of the project.',
    },
    {
      title: 'Features',
      content: 'List of key features.',
    },
    {
      title: 'Installation',
      content: 'Installation instructions.',
    },
    {
      title: 'Usage',
      content: 'Usage examples.',
    },
    {
      title: 'API',
      content: 'API documentation.',
    },
    {
      title: 'Contributing',
      content: 'Guidelines for contributing to the project.',
    },
    {
      title: 'License',
      content: 'License information.',
    },
  ],
};

/**
 * Default API documentation template
 */
export const DEFAULT_API_DOCS_TEMPLATE: DocumentationTemplate = {
  type: DocumentationType.API_DOCS,
  format: DocumentationFormat.MARKDOWN,
  sections: [
    {
      title: 'API Documentation',
      content: 'Documentation for the API.',
      subsections: [
        {
          title: 'Authentication',
          content: 'Authentication methods and requirements.',
        },
        {
          title: 'Endpoints',
          content: 'List of API endpoints.',
          subsections: [
            {
              title: 'GET /resource',
              content: 'Description of the GET /resource endpoint.',
            },
            {
              title: 'POST /resource',
              content: 'Description of the POST /resource endpoint.',
            },
            {
              title: 'PUT /resource/:id',
              content: 'Description of the PUT /resource/:id endpoint.',
            },
            {
              title: 'DELETE /resource/:id',
              content: 'Description of the DELETE /resource/:id endpoint.',
            },
          ],
        },
        {
          title: 'Models',
          content: 'Data models used by the API.',
        },
        {
          title: 'Error Handling',
          content: 'Error codes and handling.',
        },
        {
          title: 'Rate Limiting',
          content: 'Rate limiting information.',
        },
      ],
    },
  ],
};

/**
 * Default user guide template
 */
export const DEFAULT_USER_GUIDE_TEMPLATE: DocumentationTemplate = {
  type: DocumentationType.USER_GUIDE,
  format: DocumentationFormat.MARKDOWN,
  sections: [
    {
      title: 'User Guide',
      content: 'A guide for users of the project.',
      subsections: [
        {
          title: 'Getting Started',
          content: 'How to get started with the project.',
        },
        {
          title: 'Installation',
          content: 'Installation instructions.',
        },
        {
          title: 'Configuration',
          content: 'Configuration options.',
        },
        {
          title: 'Features',
          content: 'Detailed explanation of features.',
        },
        {
          title: 'Troubleshooting',
          content: 'Common issues and solutions.',
        },
        {
          title: 'FAQ',
          content: 'Frequently asked questions.',
        },
      ],
    },
  ],
};

/**
 * Default contributing guide template
 */
export const DEFAULT_CONTRIBUTING_TEMPLATE: DocumentationTemplate = {
  type: DocumentationType.CONTRIBUTING,
  format: DocumentationFormat.MARKDOWN,
  sections: [
    {
      title: 'Contributing',
      content: 'Guidelines for contributing to the project.',
      subsections: [
        {
          title: 'Code of Conduct',
          content: 'Code of conduct for contributors.',
        },
        {
          title: 'How to Contribute',
          content: 'Steps for contributing to the project.',
        },
        {
          title: 'Development Setup',
          content: 'Setting up the development environment.',
        },
        {
          title: 'Pull Request Process',
          content: 'Process for submitting pull requests.',
        },
        {
          title: 'Coding Standards',
          content: 'Coding standards and style guidelines.',
        },
        {
          title: 'Testing',
          content: 'Testing requirements and guidelines.',
        },
      ],
    },
  ],
};

/**
 * Collection of documentation templates
 */
export const DOCUMENTATION_TEMPLATES: Record<DocumentationType, DocumentationTemplate> = {
  [DocumentationType.README]: DEFAULT_README_TEMPLATE,
  [DocumentationType.API_DOCS]: DEFAULT_API_DOCS_TEMPLATE,
  [DocumentationType.USER_GUIDE]: DEFAULT_USER_GUIDE_TEMPLATE,
  [DocumentationType.CONTRIBUTING]: DEFAULT_CONTRIBUTING_TEMPLATE,
  [DocumentationType.CODE_OF_CONDUCT]: {
    type: DocumentationType.CODE_OF_CONDUCT,
    format: DocumentationFormat.MARKDOWN,
    sections: [
      {
        title: 'Code of Conduct',
        content: 'Code of conduct for the project.',
      },
    ],
  },
  [DocumentationType.CHANGELOG]: {
    type: DocumentationType.CHANGELOG,
    format: DocumentationFormat.MARKDOWN,
    sections: [
      {
        title: 'Changelog',
        content: 'Changes to the project.',
      },
    ],
  },
  [DocumentationType.LICENSE]: {
    type: DocumentationType.LICENSE,
    format: DocumentationFormat.MARKDOWN,
    sections: [
      {
        title: 'License',
        content: 'License information.',
      },
    ],
  },
};

/**
 * License templates
 */
export const LICENSE_TEMPLATES: Record<string, string> = {
  'MIT': `MIT License

Copyright (c) [year] [author]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`,

  'Apache-2.0': `                                 Apache License
                           Version 2.0, January 2004
                        http://www.apache.org/licenses/

   Copyright [yyyy] [name of copyright owner]

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.`,

  'GPL-3.0': `                    GNU GENERAL PUBLIC LICENSE
                       Version 3, 29 June 2007

 Copyright (C) 2007 Free Software Foundation, Inc. <https://fsf.org/>
 Everyone is permitted to copy and distribute verbatim copies
 of this license document, but changing it is not allowed.

                            Preamble

  The GNU General Public License is a free, copyleft license for
software and other kinds of works.

  The licenses for most software and other practical works are designed
to take away your freedom to share and change the works.  By contrast,
the GNU General Public License is intended to guarantee your freedom to
share and change all versions of a program--to make sure it remains free
software for all its users.  We, the Free Software Foundation, use the
GNU General Public License for most of our software; it applies also to
any other work released this way by its authors.  You can apply it to
your programs, too.

[... rest of GPL-3.0 license text ...]`,
};

/**
 * Generates documentation based on the specified options
 */
export function generateDocumentation(options: DocumentationOptions): string {
  const {
    projectName,
    projectDescription,
    type,
    format = DocumentationFormat.MARKDOWN,
    includeInstallation = true,
    includeUsage = true,
    includeAPI = false,
    includeContributing = true,
    includeLicense = true,
    licenseType = 'MIT',
    repositoryUrl = '',
    author = '',
    customSections = [],
  } = options;

  // Get the appropriate template
  const template = DOCUMENTATION_TEMPLATES[type];
  
  // Clone the template sections
  const sections = JSON.parse(JSON.stringify(template.sections)) as DocumentationSection[];
  
  // Update the sections with project-specific information
  updateSections(sections, {
    projectName,
    projectDescription,
    includeInstallation,
    includeUsage,
    includeAPI,
    includeContributing,
    includeLicense,
    licenseType,
    repositoryUrl,
    author,
  });
  
  // Add custom sections
  sections.push(...customSections);
  
  // Generate the documentation based on the format
  switch (format) {
    case DocumentationFormat.MARKDOWN:
      return generateMarkdownDocumentation(sections);
    case DocumentationFormat.HTML:
      return generateHtmlDocumentation(sections);
    case DocumentationFormat.ASCIIDOC:
      return generateAsciidocDocumentation(sections);
    case DocumentationFormat.RST:
      return generateRstDocumentation(sections);
    default:
      return generateMarkdownDocumentation(sections);
  }
}

/**
 * Updates documentation sections with project-specific information
 */
function updateSections(
  sections: DocumentationSection[],
  options: {
    projectName: string;
    projectDescription: string;
    includeInstallation: boolean;
    includeUsage: boolean;
    includeAPI: boolean;
    includeContributing: boolean;
    includeLicense: boolean;
    licenseType: string;
    repositoryUrl: string;
    author: string;
  }
): void {
  for (const section of sections) {
    // Update section content based on title
    if (section.title === 'Project Name') {
      section.title = options.projectName;
      section.content = options.projectDescription;
    } else if (section.title === 'Installation' && !options.includeInstallation) {
      section.content = '';
    } else if (section.title === 'Usage' && !options.includeUsage) {
      section.content = '';
    } else if (section.title === 'API' && !options.includeAPI) {
      section.content = '';
    } else if (section.title === 'Contributing' && !options.includeContributing) {
      section.content = '';
    } else if (section.title === 'License' && !options.includeLicense) {
      section.content = '';
    } else if (section.title === 'License' && options.includeLicense) {
      section.content = `This project is licensed under the ${options.licenseType} License - see the LICENSE file for details.`;
    }
    
    // Update subsections recursively
    if (section.subsections) {
      updateSections(section.subsections, options);
    }
  }
}

/**
 * Generates markdown documentation from sections
 */
export function generateMarkdownDocumentation(sections: DocumentationSection[], level: number = 1): string {
  let markdown = '';
  
  for (const section of sections) {
    // Skip empty sections
    if (!section.content && (!section.subsections || section.subsections.length === 0)) {
      continue;
    }
    
    // Add section title
    markdown += `${'#'.repeat(level)} ${section.title}\n\n`;
    
    // Add section content
    if (section.content) {
      markdown += `${section.content}\n\n`;
    }
    
    // Add subsections
    if (section.subsections) {
      markdown += generateMarkdownDocumentation(section.subsections, level + 1);
    }
  }
  
  return markdown;
}

/**
 * Generates HTML documentation from sections
 */
export function generateHtmlDocumentation(sections: DocumentationSection[], level: number = 1): string {
  let html = '';
  
  for (const section of sections) {
    // Skip empty sections
    if (!section.content && (!section.subsections || section.subsections.length === 0)) {
      continue;
    }
    
    // Add section title
    html += `<h${level}>${section.title}</h${level}>\n\n`;
    
    // Add section content
    if (section.content) {
      html += `<p>${section.content}</p>\n\n`;
    }
    
    // Add subsections
    if (section.subsections) {
      html += generateHtmlDocumentation(section.subsections, level + 1);
    }
  }
  
  return html;
}

/**
 * Generates AsciiDoc documentation from sections
 */
export function generateAsciidocDocumentation(sections: DocumentationSection[], level: number = 1): string {
  let asciidoc = '';
  
  for (const section of sections) {
    // Skip empty sections
    if (!section.content && (!section.subsections || section.subsections.length === 0)) {
      continue;
    }
    
    // Add section title
    asciidoc += `${'='.repeat(level)} ${section.title}\n\n`;
    
    // Add section content
    if (section.content) {
      asciidoc += `${section.content}\n\n`;
    }
    
    // Add subsections
    if (section.subsections) {
      asciidoc += generateAsciidocDocumentation(section.subsections, level + 1);
    }
  }
  
  return asciidoc;
}

/**
 * Generates reStructuredText documentation from sections
 */
export function generateRstDocumentation(sections: DocumentationSection[], level: number = 1): string {
  let rst = '';
  
  for (const section of sections) {
    // Skip empty sections
    if (!section.content && (!section.subsections || section.subsections.length === 0)) {
      continue;
    }
    
    // Add section title
    rst += `${section.title}\n`;
    
    const underlineChar = level === 1 ? '=' : level === 2 ? '-' : level === 3 ? '~' : '^';
    rst += `${underlineChar.repeat(section.title.length)}\n\n`;
    
    // Add section content
    if (section.content) {
      rst += `${section.content}\n\n`;
    }
    
    // Add subsections
    if (section.subsections) {
      rst += generateRstDocumentation(section.subsections, level + 1);
    }
  }
  
  return rst;
}

/**
 * Generates a README file for a project
 */
export function generateReadme(options: {
  projectName: string;
  projectDescription: string;
  features?: string[];
  installation?: string;
  usage?: string;
  api?: string;
  contributing?: string;
  license?: string;
  repositoryUrl?: string;
  author?: string;
}): string {
  const {
    projectName,
    projectDescription,
    features = [],
    installation = '',
    usage = '',
    api = '',
    contributing = '',
    license = 'MIT',
    repositoryUrl = '',
    author = '',
  } = options;
  
  // Create sections
  const sections: DocumentationSection[] = [
    {
      title: projectName,
      content: projectDescription,
    },
  ];
  
  // Add features section if provided
  if (features.length > 0) {
    sections.push({
      title: 'Features',
      content: features.map(feature => `- ${feature}`).join('\n'),
    });
  }
  
  // Add installation section if provided
  if (installation) {
    sections.push({
      title: 'Installation',
      content: installation,
    });
  }
  
  // Add usage section if provided
  if (usage) {
    sections.push({
      title: 'Usage',
      content: usage,
    });
  }
  
  // Add API section if provided
  if (api) {
    sections.push({
      title: 'API',
      content: api,
    });
  }
  
  // Add contributing section if provided
  if (contributing) {
    sections.push({
      title: 'Contributing',
      content: contributing,
    });
  }
  
  // Add license section
  sections.push({
    title: 'License',
    content: `This project is licensed under the ${license} License - see the LICENSE file for details.`,
  });
  
  // Generate markdown
  return generateMarkdownDocumentation(sections);
}

/**
 * Generates API documentation for a project
 */
export function generateApiDocs(options: {
  projectName: string;
  endpoints: {
    method: string;
    path: string;
    description: string;
    parameters?: { name: string; type: string; description: string; required: boolean }[];
    responses?: { status: number; description: string; schema?: string }[];
  }[];
  models?: {
    name: string;
    description: string;
    properties: { name: string; type: string; description: string; required: boolean }[];
  }[];
  authentication?: string;
  errorHandling?: string;
  rateLimiting?: string;
}): string {
  const {
    projectName,
    endpoints,
    models = [],
    authentication = '',
    errorHandling = '',
    rateLimiting = '',
  } = options;
  
  // Create sections
  const sections: DocumentationSection[] = [
    {
      title: `${projectName} API Documentation`,
      content: `API documentation for ${projectName}.`,
    },
  ];
  
  // Add authentication section if provided
  if (authentication) {
    sections.push({
      title: 'Authentication',
      content: authentication,
    });
  }
  
  // Add endpoints section
  if (endpoints.length > 0) {
    const endpointSections: DocumentationSection[] = endpoints.map(endpoint => {
      let content = `${endpoint.description}\n\n`;
      
      // Add parameters if provided
      if (endpoint.parameters && endpoint.parameters.length > 0) {
        content += '**Parameters:**\n\n';
        content += '| Name | Type | Description | Required |\n';
        content += '|------|------|-------------|----------|\n';
        
        for (const param of endpoint.parameters) {
          content += `| ${param.name} | ${param.type} | ${param.description} | ${param.required ? 'Yes' : 'No'} |\n`;
        }
        
        content += '\n';
      }
      
      // Add responses if provided
      if (endpoint.responses && endpoint.responses.length > 0) {
        content += '**Responses:**\n\n';
        content += '| Status | Description | Schema |\n';
        content += '|--------|-------------|--------|\n';
        
        for (const response of endpoint.responses) {
          content += `| ${response.status} | ${response.description} | ${response.schema || '-'} |\n`;
        }
        
        content += '\n';
      }
      
      return {
        title: `${endpoint.method} ${endpoint.path}`,
        content,
      };
    });
    
    sections.push({
      title: 'Endpoints',
      content: 'List of API endpoints.',
      subsections: endpointSections,
    });
  }
  
  // Add models section if provided
  if (models.length > 0) {
    const modelSections: DocumentationSection[] = models.map(model => {
      let content = `${model.description}\n\n`;
      
      // Add properties
      content += '**Properties:**\n\n';
      content += '| Name | Type | Description | Required |\n';
      content += '|------|------|-------------|----------|\n';
      
      for (const prop of model.properties) {
        content += `| ${prop.name} | ${prop.type} | ${prop.description} | ${prop.required ? 'Yes' : 'No'} |\n`;
      }
      
      return {
        title: model.name,
        content,
      };
    });
    
    sections.push({
      title: 'Models',
      content: 'Data models used by the API.',
      subsections: modelSections,
    });
  }
  
  // Add error handling section if provided
  if (errorHandling) {
    sections.push({
      title: 'Error Handling',
      content: errorHandling,
    });
  }
  
  // Add rate limiting section if provided
  if (rateLimiting) {
    sections.push({
      title: 'Rate Limiting',
      content: rateLimiting,
    });
  }
  
  // Generate markdown
  return generateMarkdownDocumentation(sections);
}