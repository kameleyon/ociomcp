import axios from 'axios';
/**
 * Map field type to platform-specific type
 * 
 * @param type Generic field type
 * @param platform Target platform
 * @returns Platform-specific field type
 */
function mapFieldType(type: string, platform: string): string {
  const typeMap: Record<string, Record<string, string>> = {
    contentful: {
      text: 'Symbol',
      richText: 'RichText',
      number: 'Number',
      boolean: 'Boolean',
      date: 'Date',
      location: 'Location',
      media: 'Asset',
      reference: 'Link',
      array: 'Array',
      object: 'Object',
      json: 'Object'
    },
    strapi: {
      text: 'string',
      richText: 'richtext',
      number: 'integer',
      boolean: 'boolean',
      date: 'datetime',
      location: 'json',
      media: 'media',
      reference: 'relation',
      array: 'component',
      object: 'component',
      json: 'json'
    },
    sanity: {
      text: 'string',
      richText: 'array',
      number: 'number',
      boolean: 'boolean',
      date: 'datetime',
      location: 'geopoint',
      media: 'image',
      reference: 'reference',
      array: 'array',
      object: 'object',
      json: 'object'
    },
    prismic: {
      text: 'Text',
      richText: 'StructuredText',
      number: 'Number',
      boolean: 'Boolean',
      date: 'Date',
      location: 'GeoPoint',
      media: 'Image',
      reference: 'Link',
      array: 'Group',
      object: 'Slice',
      json: 'Json'
    },
    wordpress: {
      text: 'string',
      richText: 'string',
      number: 'number',
      boolean: 'boolean',
      date: 'string',
      location: 'object',
      media: 'object',
      reference: 'number',
      array: 'array',
      object: 'object',
      json: 'object'
    }
  };
  
  if (!typeMap[platform]) {
    return type;
  }
  
  return typeMap[platform][type] || type;
}

/**
 * CMS Connection interface
 */
interface CMSConnection {
  platform: 'contentful' | 'strapi' | 'sanity' | 'prismic' | 'wordpress' | 'custom';
  apiUrl: string;
  apiKey: string;
  apiSecret?: string;
  spaceId?: string;
  environmentId?: string;
  projectId?: string;
  datasetId?: string;
  options: {
    previewMode: boolean;
    cacheResults: boolean;
    cacheDuration: number;
    timeout: number;
  };
}

/**
 * Content Model Field
 */
interface ContentModelField {
  name: string;
  type: string;
  displayName?: string;
  description?: string;
  required?: boolean;
  unique?: boolean;
  localized?: boolean;
  validations?: Array<Record<string, any>>;
  defaultValue?: any;
  settings?: Record<string, any>;
}

/**
 * Content Model
 */
interface ContentModel {
  name: string;
  displayName?: string;
  description?: string;
  fields: ContentModelField[];
}

/**
 * Cache item
 */
interface CacheItem {
  data: any;
  timestamp: number;
}

// Cache for CMS data
const cmsCache: Record<string, CacheItem> = {};

/**
 * Connect to a CMS platform
 * 
 * @param options Connection options
 * @returns Connection result
 */
export async function connectCMS(
  options: {
    platform: 'contentful' | 'strapi' | 'sanity' | 'prismic' | 'wordpress' | 'custom';
    apiUrl: string;
    apiKey: string;
    apiSecret?: string;
    spaceId?: string;
    environmentId?: string;
    projectId?: string;
    datasetId?: string;
    options?: {
      previewMode?: boolean;
      cacheResults?: boolean;
      cacheDuration?: number;
      timeout?: number;
    };
  }
): Promise<{
  success: boolean;
  message: string;
  connection?: CMSConnection;
  error?: string;
}> {
  try {
    // Default options
    const defaultOptions = {
      previewMode: false,
      cacheResults: true,
      cacheDuration: 300, // 5 minutes
      timeout: 10000, // 10 seconds
    };
    
    const connectionOptions = {
      ...options,
      options: {
        ...defaultOptions,
        ...options.options,
      },
    };
    
    // Validate the connection
    const validationResult = await validateCMSConnection(connectionOptions);
    
    if (!validationResult.success) {
      return {
        success: false,
        message: `Failed to connect to ${options.platform} CMS: ${validationResult.error}`,
        error: validationResult.error,
      };
    }
    
    // Return the connection
    return {
      success: true,
      message: `Successfully connected to ${options.platform} CMS`,
      connection: connectionOptions,
    };
  } catch (error) {
    return {
      success: false,
      message: `Error connecting to CMS: ${error instanceof Error ? error.message : String(error)}`,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Validate a CMS connection
 * 
 * @param connection CMS connection
 * @returns Validation result
 */
async function validateCMSConnection(
  connection: CMSConnection
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    // Create an API client based on the platform
    const client = createCMSClient(connection);
    
    // Test the connection
    await client.testConnection();
    
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Create a CMS client
 * 
 * @param connection CMS connection
 * @returns CMS client
 */
function createCMSClient(connection: CMSConnection): CMSClient {
  switch (connection.platform) {
    case 'contentful':
      return new ContentfulClient(connection);
    case 'strapi':
      return new StrapiClient(connection);
    case 'sanity':
      return new SanityClient(connection);
    case 'prismic':
      return new PrismicClient(connection);
    case 'wordpress':
      return new WordPressClient(connection);
    case 'custom':
    default:
      return new CustomCMSClient(connection);
  }
}

/**
 * CMS Client interface
 */
interface CMSClient {
  testConnection(): Promise<boolean>;
  fetchContent(options: {
    contentType: string;
    query?: Record<string, any>;
    limit?: number;
    skip?: number;
    sort?: string;
    fields?: string[];
    locale?: string;
    includeReferences?: boolean;
  }): Promise<any>;
  createContentModel(model: ContentModel): Promise<any>;
  createContent(options: {
    contentType: string;
    fields: Record<string, any>;
    locale?: string;
    publish?: boolean;
  }): Promise<any>;
  updateContent(options: {
    contentType: string;
    id: string;
    fields: Record<string, any>;
    locale?: string;
    publish?: boolean;
  }): Promise<any>;
  deleteContent(options: {
    contentType: string;
    id: string;
  }): Promise<any>;
}

/**
 * Base CMS Client
 */
abstract class BaseCMSClient implements CMSClient {
  protected connection: CMSConnection;
  
  constructor(connection: CMSConnection) {
    this.connection = connection;
  }
  
  /**
   * Test the connection to the CMS
   */
  abstract testConnection(): Promise<boolean>;
  
  /**
   * Fetch content from the CMS
   */
  abstract fetchContent(options: {
    contentType: string;
    query?: Record<string, any>;
    limit?: number;
    skip?: number;
    sort?: string;
    fields?: string[];
    locale?: string;
    includeReferences?: boolean;
  }): Promise<any>;
  
  /**
   * Create a content model in the CMS
   */
  abstract createContentModel(model: ContentModel): Promise<any>;
  
  /**
   * Create content in the CMS
   */
  abstract createContent(options: {
    contentType: string;
    fields: Record<string, any>;
    locale?: string;
    publish?: boolean;
  }): Promise<any>;
  
  /**
   * Update content in the CMS
   */
  abstract updateContent(options: {
    contentType: string;
    id: string;
    fields: Record<string, any>;
    locale?: string;
    publish?: boolean;
  }): Promise<any>;
  
  /**
   * Delete content from the CMS
   */
  abstract deleteContent(options: {
    contentType: string;
    id: string;
  }): Promise<any>;
  
  /**
   * Get a cached value
   */
  protected getCachedValue(key: string): any | null {
    if (!this.connection.options.cacheResults) {
      return null;
    }
    
    const cacheItem = cmsCache[key];
    
    if (!cacheItem) {
      return null;
    }
    
    const now = Date.now();
    const expirationTime = cacheItem.timestamp + this.connection.options.cacheDuration * 1000;
    
    if (now > expirationTime) {
      delete cmsCache[key];
      return null;
    }
    
    return cacheItem.data;
  }
  
  /**
   * Set a cached value
   */
  protected setCachedValue(key: string, value: any): void {
    if (!this.connection.options.cacheResults) {
      return;
    }
    
    cmsCache[key] = {
      data: value,
      timestamp: Date.now(),
    };
  }
  
  /**
   * Create a cache key
   */
  protected createCacheKey(method: string, params: Record<string, any>): string {
    return `${this.connection.platform}:${method}:${JSON.stringify(params)}`;
  }
}

/**
 * Contentful Client
 */
class ContentfulClient extends BaseCMSClient {
  /**
   * Test the connection to Contentful
   */
  async testConnection(): Promise<boolean> {
    try {
      const url = `${this.connection.apiUrl}/spaces/${this.connection.spaceId}`;
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${this.connection.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: this.connection.options.timeout,
      });
      
      return response.status === 200;
    } catch (error) {
      throw new Error(`Failed to connect to Contentful: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Fetch content from Contentful
   */
  async fetchContent(options: {
    contentType: string;
    query?: Record<string, any>;
    limit?: number;
    skip?: number;
    sort?: string;
    fields?: string[];
    locale?: string;
    includeReferences?: boolean;
  }): Promise<any> {
    try {
      // Check cache
      const cacheKey = this.createCacheKey('fetchContent', options);
      const cachedValue = this.getCachedValue(cacheKey);
      
      if (cachedValue) {
        return cachedValue;
      }
      
      // Build the query
      const query: Record<string, any> = {
        content_type: options.contentType,
        limit: options.limit || 10,
        skip: options.skip || 0,
      };
      
      if (options.sort) {
        query.order = options.sort;
      }
      
      if (options.locale) {
        query.locale = options.locale;
      }
      
      if (options.fields) {
        query.select = options.fields.join(',');
      }
      
      if (options.includeReferences) {
        query.include = 10;
      }
      
      if (options.query) {
        Object.assign(query, options.query);
      }
      
      // Make the request
      const url = `${this.connection.apiUrl}/spaces/${this.connection.spaceId}/environments/${this.connection.environmentId || 'master'}/entries`;
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${this.connection.apiKey}`,
          'Content-Type': 'application/json',
        },
        params: query,
        timeout: this.connection.options.timeout,
      });
      
      // Cache the result
      this.setCachedValue(cacheKey, response.data);
      
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch content from Contentful: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Create a content model in Contentful
   */
  async createContentModel(model: ContentModel): Promise<any> {
    try {
      // Convert the model to Contentful format
      const contentfulModel = {
        name: model.displayName || model.name,
        description: model.description || '',
        displayField: model.fields.find(field => field.type === 'text')?.name || model.fields[0].name,
        fields: model.fields.map(field => ({
          id: field.name,
          name: field.displayName || field.name,
          type: mapFieldType(field.type, 'contentful'),
          required: field.required || false,
          localized: field.localized || false,
          validations: field.validations || [],
        })),
      };
      
      // Make the request
      const url = `${this.connection.apiUrl}/spaces/${this.connection.spaceId}/environments/${this.connection.environmentId || 'master'}/content_types`;
      
      const response = await axios.post(url, {
        ...contentfulModel,
        sys: {
          id: model.name,
        },
      }, {
        headers: {
          'Authorization': `Bearer ${this.connection.apiKey}`,
          'Content-Type': 'application/json',
          'X-Contentful-Content-Type': 'application/vnd.contentful.management.v1+json',
        },
        timeout: this.connection.options.timeout,
      });
      
      // Publish the content type
      const publishUrl = `${this.connection.apiUrl}/spaces/${this.connection.spaceId}/environments/${this.connection.environmentId || 'master'}/content_types/${model.name}/published`;
      
      await axios.put(publishUrl, {}, {
        headers: {
          'Authorization': `Bearer ${this.connection.apiKey}`,
          'Content-Type': 'application/json',
          'X-Contentful-Version': response.data.sys.version,
        },
        timeout: this.connection.options.timeout,
      });
      
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create content model in Contentful: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Create content in Contentful
   */
  async createContent(options: {
    contentType: string;
    fields: Record<string, any>;
    locale?: string;
    publish?: boolean;
  }): Promise<any> {
    try {
      // Convert the fields to Contentful format
      const contentfulFields: Record<string, Record<string, any>> = {};
      const locale = options.locale || 'en-US';
      
      for (const [key, value] of Object.entries(options.fields)) {
        contentfulFields[key] = {
          [locale]: value,
        };
      }
      
      // Make the request
      const url = `${this.connection.apiUrl}/spaces/${this.connection.spaceId}/environments/${this.connection.environmentId || 'master'}/entries`;
      
      const response = await axios.post(url, {
        fields: contentfulFields,
      }, {
        headers: {
          'Authorization': `Bearer ${this.connection.apiKey}`,
          'Content-Type': 'application/json',
          'X-Contentful-Content-Type': options.contentType,
        },
        timeout: this.connection.options.timeout,
      });
      
      // Publish the entry if requested
      if (options.publish !== false) {
        const publishUrl = `${this.connection.apiUrl}/spaces/${this.connection.spaceId}/environments/${this.connection.environmentId || 'master'}/entries/${response.data.sys.id}/published`;
        
        await axios.put(publishUrl, {}, {
          headers: {
            'Authorization': `Bearer ${this.connection.apiKey}`,
            'Content-Type': 'application/json',
            'X-Contentful-Version': response.data.sys.version,
          },
          timeout: this.connection.options.timeout,
        });
      }
      
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create content in Contentful: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Update content in Contentful
   */
  async updateContent(options: {
    contentType: string;
    id: string;
    fields: Record<string, any>;
    locale?: string;
    publish?: boolean;
  }): Promise<any> {
    try {
      // Get the current entry
      const getUrl = `${this.connection.apiUrl}/spaces/${this.connection.spaceId}/environments/${this.connection.environmentId || 'master'}/entries/${options.id}`;
      
      const getResponse = await axios.get(getUrl, {
        headers: {
          'Authorization': `Bearer ${this.connection.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: this.connection.options.timeout,
      });
      
      // Convert the fields to Contentful format
      const contentfulFields: Record<string, Record<string, any>> = getResponse.data.fields;
      const locale = options.locale || 'en-US';
      
      for (const [key, value] of Object.entries(options.fields)) {
        if (!contentfulFields[key]) {
          contentfulFields[key] = {};
        }
        
        contentfulFields[key][locale] = value;
      }
      
      // Make the request
      const url = `${this.connection.apiUrl}/spaces/${this.connection.spaceId}/environments/${this.connection.environmentId || 'master'}/entries/${options.id}`;
      
      const response = await axios.put(url, {
        fields: contentfulFields,
      }, {
        headers: {
          'Authorization': `Bearer ${this.connection.apiKey}`,
          'Content-Type': 'application/json',
          'X-Contentful-Content-Type': options.contentType,
          'X-Contentful-Version': getResponse.data.sys.version,
        },
        timeout: this.connection.options.timeout,
      });
      
      // Publish the entry if requested
      if (options.publish !== false) {
        const publishUrl = `${this.connection.apiUrl}/spaces/${this.connection.spaceId}/environments/${this.connection.environmentId || 'master'}/entries/${options.id}/published`;
        
        await axios.put(publishUrl, {}, {
          headers: {
            'Authorization': `Bearer ${this.connection.apiKey}`,
            'Content-Type': 'application/json',
            'X-Contentful-Version': response.data.sys.version,
          },
          timeout: this.connection.options.timeout,
        });
      }
      
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update content in Contentful: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Delete content from Contentful
   */
  async deleteContent(options: {
    contentType: string;
    id: string;
  }): Promise<any> {
    try {
      // Unpublish the entry first
      const unpublishUrl = `${this.connection.apiUrl}/spaces/${this.connection.spaceId}/environments/${this.connection.environmentId || 'master'}/entries/${options.id}/published`;
      
      try {
        await axios.delete(unpublishUrl, {
          headers: {
            'Authorization': `Bearer ${this.connection.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: this.connection.options.timeout,
        });
      } catch (error) {
        // Ignore errors if the entry is not published
      }
      
      // Delete the entry
      const url = `${this.connection.apiUrl}/spaces/${this.connection.spaceId}/environments/${this.connection.environmentId || 'master'}/entries/${options.id}`;
      
      await axios.delete(url, {
        headers: {
          'Authorization': `Bearer ${this.connection.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: this.connection.options.timeout,
      });
      
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to delete content from Contentful: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

/**
 * Strapi Client
 */
class StrapiClient extends BaseCMSClient {
  /**
   * Test the connection to Strapi
   */
  async testConnection(): Promise<boolean> {
    try {
      const url = `${this.connection.apiUrl}/content-types`;
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${this.connection.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: this.connection.options.timeout,
      });
      
      return response.status === 200;
    } catch (error) {
      throw new Error(`Failed to connect to Strapi: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Fetch content from Strapi
   */
  async fetchContent(options: {
    contentType: string;
    query?: Record<string, any>;
    limit?: number;
    skip?: number;
    sort?: string;
    fields?: string[];
    locale?: string;
    includeReferences?: boolean;
  }): Promise<any> {
    try {
      // Check cache
      const cacheKey = this.createCacheKey('fetchContent', options);
      const cachedValue = this.getCachedValue(cacheKey);
      
      if (cachedValue) {
        return cachedValue;
      }
      
      // Build the query
      const query: Record<string, any> = {
        _limit: options.limit || 10,
        _start: options.skip || 0,
      };
      
      if (options.sort) {
        query._sort = options.sort;
      }
      
      if (options.locale) {
        query._locale = options.locale;
      }
      
      if (options.fields) {
        query._fields = options.fields.join(',');
      }
      
      if (options.query) {
        Object.assign(query, options.query);
      }
      
      // Make the request
      const url = `${this.connection.apiUrl}/${options.contentType}`;
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${this.connection.apiKey}`,
          'Content-Type': 'application/json',
        },
        params: query,
        timeout: this.connection.options.timeout,
      });
      
      // Cache the result
      this.setCachedValue(cacheKey, response.data);
      
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch content from Strapi: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Create a content model in Strapi
   */
  async createContentModel(model: ContentModel): Promise<any> {
    try {
      // Convert the model to Strapi format
      const strapiModel = {
        name: model.name,
        description: model.description || '',
        attributes: model.fields.reduce((acc, field) => {
          acc[field.name] = {
            type: mapFieldType(field.type, 'strapi'),
            required: field.required || false,
            unique: field.unique || false,
            private: false,
            configurable: true,
            pluginOptions: {
              i18n: {
                localized: field.localized || false,
              },
            },
          };
          
          return acc;
        }, {} as Record<string, any>),
      };
      
      // Make the request
      const url = `${this.connection.apiUrl}/content-types`;
      
      const response = await axios.post(url, {
        contentType: strapiModel,
      }, {
        headers: {
          'Authorization': `Bearer ${this.connection.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: this.connection.options.timeout,
      });
      
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create content model in Strapi: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Create content in Strapi
   */
  async createContent(options: {
    contentType: string;
    fields: Record<string, any>;
    locale?: string;
    publish?: boolean;
  }): Promise<any> {
    try {
      // Build the data
      const data = { ...options.fields };
      
      if (options.locale) {
        data.locale = options.locale;
      }
      
      // Make the request
      const url = `${this.connection.apiUrl}/${options.contentType}`;
      
      const response = await axios.post(url, data, {
        headers: {
          'Authorization': `Bearer ${this.connection.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: this.connection.options.timeout,
      });
      
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create content in Strapi: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Update content in Strapi
   */
  async updateContent(options: {
    contentType: string;
    id: string;
    fields: Record<string, any>;
    locale?: string;
    publish?: boolean;
  }): Promise<any> {
    try {
      // Build the data
      const data = { ...options.fields };
      
      if (options.locale) {
        data.locale = options.locale;
      }
      
      // Make the request
      const url = `${this.connection.apiUrl}/${options.contentType}/${options.id}`;
      
      const response = await axios.put(url, data, {
        headers: {
          'Authorization': `Bearer ${this.connection.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: this.connection.options.timeout,
      });
      
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update content in Strapi: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Delete content from Strapi
   */
  async deleteContent(options: {
    contentType: string;
    id: string;
  }): Promise<any> {
    try {
      // Make the request
      const url = `${this.connection.apiUrl}/${options.contentType}/${options.id}`;
      
      const response = await axios.delete(url, {
        headers: {
          'Authorization': `Bearer ${this.connection.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: this.connection.options.timeout,
      });
      
      return response.data;
    } catch (error) {
      throw new Error(`Failed to delete content from Strapi: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

/**
 * Sanity Client
 */
class SanityClient extends BaseCMSClient {
  /**
   * Test the connection to Sanity
   */
  async testConnection(): Promise<boolean> {
    try {
      const url = `https://${this.connection.projectId}.api.sanity.io/v1/data/query/${this.connection.datasetId || 'production'}?query=*[_type=="system.group"][0]`;
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${this.connection.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: this.connection.options.timeout,
      });
      
      return response.status === 200;
    } catch (error) {
      throw new Error(`Failed to connect to Sanity: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Fetch content from Sanity
   */
  async fetchContent(options: {
    contentType: string;
    query?: Record<string, any>;
    limit?: number;
    skip?: number;
    sort?: string;
    fields?: string[];
    locale?: string;
    includeReferences?: boolean;
  }): Promise<any> {
    try {
      // Check cache
      const cacheKey = this.createCacheKey('fetchContent', options);
      const cachedValue = this.getCachedValue(cacheKey);
      
      if (cachedValue) {
        return cachedValue;
      }
      
      // Build the query
      let query = `*[_type=="${options.contentType}"`;
      
      if (options.query) {
        const conditions = Object.entries(options.query)
          .map(([key, value]) => {
            if (typeof value === 'string') {
              return `${key}=="${value}"`;
            } else if (typeof value === 'number' || typeof value === 'boolean') {
              return `${key}==${value}`;
            } else {
              return `${key}==${JSON.stringify(value)}`;
            }
          })
          .join(' && ');
        
        if (conditions) {
          query += ` && ${conditions}`;
        }
      }
      
      query += ']';
      
      if (options.sort) {
        query += ` | order(${options.sort})`;
      }
      
      if (options.limit) {
        query += ` | limit(${options.limit})`;
      }
      
      if (options.skip && options.skip > 0) {
        query += ` | offset(${options.skip})`;
      }
      
      // Make the request
      const url = `https://${this.connection.projectId}.api.sanity.io/v1/data/query/${this.connection.datasetId || 'production'}`;
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${this.connection.apiKey}`,
          'Content-Type': 'application/json',
        },
        params: {
          query,
        },
        timeout: this.connection.options.timeout,
      });
      
      // Cache the result
      this.setCachedValue(cacheKey, response.data);
      
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch content from Sanity: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Create a content model in Sanity
   */
  async createContentModel(model: ContentModel): Promise<any> {
    try {
      // Convert the model to Sanity format
      const sanityModel = {
        name: model.name,
        type: 'document',
        title: model.displayName || model.name,
        description: model.description || '',
        fields: model.fields.map(field => ({
          name: field.name,
          type: mapFieldType(field.type, 'sanity'),
          title: field.displayName || field.name,
          description: field.description || '',
          validation: field.required ? 'required' : undefined,
        })),
      };
      
      // Make the request
      const url = `https://${this.connection.projectId}.api.sanity.io/v1/data/mutate/${this.connection.datasetId || 'production'}`;
      
      const response = await axios.post(url, {
        mutations: [
          {
            create: {
              _type: 'schema.type',
              ...sanityModel,
            },
          },
        ],
      }, {
        headers: {
          'Authorization': `Bearer ${this.connection.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: this.connection.options.timeout,
      });
      
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create content model in Sanity: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Create content in Sanity
   */
  async createContent(options: {
    contentType: string;
    fields: Record<string, any>;
    locale?: string;
    publish?: boolean;
  }): Promise<any> {
    try {
      // Build the data
      const data: Record<string, any> = {
        _type: options.contentType,
        ...options.fields,
      };
      
      if (options.locale) {
        data._lang = options.locale;
      }
      
      // Make the request
      const url = `https://${this.connection.projectId}.api.sanity.io/v1/data/mutate/${this.connection.datasetId || 'production'}`;
      
      const response = await axios.post(url, {
        mutations: [
          {
            create: data,
          },
        ],
      }, {
        headers: {
          'Authorization': `Bearer ${this.connection.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: this.connection.options.timeout,
      });
      
      return {
        id: response.data.results[0].id,
      };
    } catch (error) {
      throw new Error(`Failed to create content in Sanity: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Update content in Sanity
   */
  async updateContent(options: {
    contentType: string;
    id: string;
    fields: Record<string, any>;
    locale?: string;
    publish?: boolean;
  }): Promise<any> {
    try {
      // Build the data
      const data: Record<string, any> = {
        _id: options.id,
        _type: options.contentType,
        ...options.fields,
      };
      
      if (options.locale) {
        data._lang = options.locale;
      }
      
      // Make the request
      const url = `https://${this.connection.projectId}.api.sanity.io/v1/data/mutate/${this.connection.datasetId || 'production'}`;
      
      const response = await axios.post(url, {
        mutations: [
          {
            patch: {
              id: options.id,
              set: options.fields,
            },
          },
        ],
      }, {
        headers: {
          'Authorization': `Bearer ${this.connection.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: this.connection.options.timeout,
      });
      
      return {
        id: options.id,
      };
    } catch (error) {
      throw new Error(`Failed to update content in Sanity: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Delete content from Sanity
   */
  async deleteContent(options: {
    contentType: string;
    id: string;
  }): Promise<any> {
    try {
      // Make the request
      const url = `https://${this.connection.projectId}.api.sanity.io/v1/data/mutate/${this.connection.datasetId || 'production'}`;
      
      const response = await axios.post(url, {
        mutations: [
          {
            delete: {
              id: options.id,
            },
          },
        ],
      }, {
        headers: {
          'Authorization': `Bearer ${this.connection.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: this.connection.options.timeout,
      });
      
      return true;
    } catch (error) {
      throw new Error(`Failed to delete content from Sanity: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

/**
 * Prismic Client
 */
class PrismicClient extends BaseCMSClient {
  /**
   * Test the connection to Prismic
   */
  async testConnection(): Promise<boolean> {
    try {
      const url = `${this.connection.apiUrl}/api/v2`;
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${this.connection.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: this.connection.options.timeout,
      });
      
      return response.status === 200;
    } catch (error) {
      throw new Error(`Failed to connect to Prismic: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Fetch content from Prismic
   */
  async fetchContent(options: {
    contentType: string;
    query?: Record<string, any>;
    limit?: number;
    skip?: number;
    sort?: string;
    fields?: string[];
    locale?: string;
    includeReferences?: boolean;
  }): Promise<any> {
    try {
      // Check cache
      const cacheKey = this.createCacheKey('fetchContent', options);
      const cachedValue = this.getCachedValue(cacheKey);
      
      if (cachedValue) {
        return cachedValue;
      }
      
      // Build the query
      const query: Record<string, any> = {
        ref: this.connection.options.previewMode ? 'master' : 'master',
        q: `[[at(document.type, "${options.contentType}")]]`,
        pageSize: options.limit || 10,
        page: options.skip ? Math.floor(options.skip / (options.limit || 10)) + 1 : 1,
      };
      
      if (options.sort) {
        query.orderings = `[${options.sort}]`;
      }
      
      if (options.locale) {
        query.lang = options.locale;
      }
      
      if (options.query) {
        // Convert query to Prismic predicates
        const predicates = Object.entries(options.query).map(([key, value]) => {
          if (typeof value === 'string') {
            return `[[at(my.${options.contentType}.${key}, "${value}")]]`;
          } else {
            return `[[at(my.${options.contentType}.${key}, ${JSON.stringify(value)})]]`;
          }
        });
        
        if (predicates.length > 0) {
          query.q = `[[at(document.type, "${options.contentType}")][${predicates.join('')}]]`;
        }
      }
      
      // Make the request
      const url = `${this.connection.apiUrl}/api/v2/documents/search`;
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${this.connection.apiKey}`,
          'Content-Type': 'application/json',
        },
        params: query,
        timeout: this.connection.options.timeout,
      });
      
      // Cache the result
      this.setCachedValue(cacheKey, response.data);
      
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch content from Prismic: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Create a content model in Prismic
   */
  async createContentModel(model: ContentModel): Promise<any> {
    try {
      // Convert the model to Prismic format
      const prismicModel = {
        id: model.name,
        name: model.displayName || model.name,
        repeatable: true,
        json: {
          Main: {
            ...model.fields.reduce((acc, field) => {
              acc[field.name] = {
                type: mapFieldType(field.type, 'prismic'),
                config: {
                  label: field.displayName || field.name,
                  placeholder: field.description || '',
                  required: field.required || false,
                },
              };
              
              return acc;
            }, {} as Record<string, any>),
          },
        },
      };
      
      // Make the request
      const url = `${this.connection.apiUrl}/customtypes`;
      
      const response = await axios.post(url, prismicModel, {
        headers: {
          'Authorization': `Bearer ${this.connection.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: this.connection.options.timeout,
      });
      
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create content model in Prismic: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Create content in Prismic
   */
  async createContent(options: {
    contentType: string;
    fields: Record<string, any>;
    locale?: string;
    publish?: boolean;
  }): Promise<any> {
    try {
      // Build the data
      const data: Record<string, any> = {
        type: options.contentType,
        data: {
          ...options.fields,
        },
      };
      
      if (options.locale) {
        data.lang = options.locale;
      }
      
      // Make the request
      const url = `${this.connection.apiUrl}/documents`;
      
      const response = await axios.post(url, data, {
        headers: {
          'Authorization': `Bearer ${this.connection.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: this.connection.options.timeout,
      });
      
      return {
        id: response.data.id,
      };
    } catch (error) {
      throw new Error(`Failed to create content in Prismic: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Update content in Prismic
   */
  async updateContent(options: {
    contentType: string;
    id: string;
    fields: Record<string, any>;
    locale?: string;
    publish?: boolean;
  }): Promise<any> {
    try {
      // Build the data
      const data: Record<string, any> = {
        id: options.id,
        type: options.contentType,
        data: {
          ...options.fields,
        },
      };
      
      if (options.locale) {
        data.lang = options.locale;
      }
      
      // Make the request
      const url = `${this.connection.apiUrl}/documents/update`;
      
      const response = await axios.put(url, data, {
        headers: {
          'Authorization': `Bearer ${this.connection.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: this.connection.options.timeout,
      });
      
      return {
        id: options.id,
      };
    } catch (error) {
      throw new Error(`Failed to update content in Prismic: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Delete content from Prismic
   */
  async deleteContent(options: {
    contentType: string;
    id: string;
  }): Promise<any> {
    try {
      // Make the request
      const url = `${this.connection.apiUrl}/documents/${options.id}`;
      
      await axios.delete(url, {
        headers: {
          'Authorization': `Bearer ${this.connection.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: this.connection.options.timeout,
      });
      
      return true;
    } catch (error) {
      throw new Error(`Failed to delete content from Prismic: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

/**
 * WordPress Client
 */
class WordPressClient extends BaseCMSClient {
  /**
   * Test the connection to WordPress
   */
  async testConnection(): Promise<boolean> {
    try {
      const url = `${this.connection.apiUrl}/wp-json/wp/v2/types`;
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${this.connection.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: this.connection.options.timeout,
      });
      
      return response.status === 200;
    } catch (error) {
      throw new Error(`Failed to connect to WordPress: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Fetch content from WordPress
   */
  async fetchContent(options: {
    contentType: string;
    query?: Record<string, any>;
    limit?: number;
    skip?: number;
    sort?: string;
    fields?: string[];
    locale?: string;
    includeReferences?: boolean;
  }): Promise<any> {
    try {
      // Check cache
      const cacheKey = this.createCacheKey('fetchContent', options);
      const cachedValue = this.getCachedValue(cacheKey);
      
      if (cachedValue) {
        return cachedValue;
      }
      
      // Build the query
      const query: Record<string, any> = {
        per_page: options.limit || 10,
        offset: options.skip || 0,
      };
      
      if (options.sort) {
        const [field, order] = options.sort.split(' ');
        query.orderby = field;
        query.order = order === 'desc' ? 'desc' : 'asc';
      }
      
      if (options.locale) {
        query.lang = options.locale;
      }
      
      if (options.fields) {
        query._fields = options.fields.join(',');
      }
      
      if (options.query) {
        Object.assign(query, options.query);
      }
      
      // Make the request
      const url = `${this.connection.apiUrl}/wp-json/wp/v2/${options.contentType}`;
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${this.connection.apiKey}`,
          'Content-Type': 'application/json',
        },
        params: query,
        timeout: this.connection.options.timeout,
      });
      
      // Cache the result
      this.setCachedValue(cacheKey, response.data);
      
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch content from WordPress: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Create a content model in WordPress
   */
  async createContentModel(model: ContentModel): Promise<any> {
    try {
      // Convert the model to WordPress format
      const wordpressModel = {
        name: model.name,
        label: model.displayName || model.name,
        description: model.description || '',
        public: true,
        hierarchical: false,
        show_ui: true,
        show_in_menu: true,
        show_in_nav_menus: true,
        show_in_rest: true,
        supports: ['title', 'editor', 'thumbnail'],
      };
      
      // Make the request
      const url = `${this.connection.apiUrl}/wp-json/wp/v2/types`;
      
      const response = await axios.post(url, wordpressModel, {
        headers: {
          'Authorization': `Bearer ${this.connection.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: this.connection.options.timeout,
      });
      
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create content model in WordPress: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Create content in WordPress
   */
  async createContent(options: {
    contentType: string;
    fields: Record<string, any>;
    locale?: string;
    publish?: boolean;
  }): Promise<any> {
    try {
      // Build the data
      const data = { ...options.fields };
      
      if (options.locale) {
        data.lang = options.locale;
      }
      
      if (options.publish !== false) {
        data.status = 'publish';
      } else {
        data.status = 'draft';
      }
      
      // Make the request
      const url = `${this.connection.apiUrl}/wp-json/wp/v2/${options.contentType}`;
      
      const response = await axios.post(url, data, {
        headers: {
          'Authorization': `Bearer ${this.connection.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: this.connection.options.timeout,
      });
      
      return {
        id: response.data.id,
      };
    } catch (error) {
      throw new Error(`Failed to create content in WordPress: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Update content in WordPress
   */
  async updateContent(options: {
    contentType: string;
    id: string;
    fields: Record<string, any>;
    locale?: string;
    publish?: boolean;
  }): Promise<any> {
    try {
      // Build the data
      const data = { ...options.fields };
      
      if (options.locale) {
        data.lang = options.locale;
      }
      
      if (options.publish !== false) {
        data.status = 'publish';
      } else {
        data.status = 'draft';
      }
      
      // Make the request
      const url = `${this.connection.apiUrl}/wp-json/wp/v2/${options.contentType}/${options.id}`;
      
      const response = await axios.put(url, data, {
        headers: {
          'Authorization': `Bearer ${this.connection.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: this.connection.options.timeout,
      });
      
      return {
        id: options.id,
      };
    } catch (error) {
      throw new Error(`Failed to update content in WordPress: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Delete content from WordPress
   */
  async deleteContent(options: {
    contentType: string;
    id: string;
  }): Promise<any> {
    try {
      // Make the request
      const url = `${this.connection.apiUrl}/wp-json/wp/v2/${options.contentType}/${options.id}`;
      
      await axios.delete(url, {
        headers: {
          'Authorization': `Bearer ${this.connection.apiKey}`,
          'Content-Type': 'application/json',
        },
        params: {
          force: true,
        },
        timeout: this.connection.options.timeout,
      });
      
      return true;
    } catch (error) {
      throw new Error(`Failed to delete content from WordPress: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

/**
 * Custom CMS Client
 */
class CustomCMSClient extends BaseCMSClient {
  /**
   * Test the connection to the custom CMS
   */
  async testConnection(): Promise<boolean> {
    try {
      const url = `${this.connection.apiUrl}/status`;
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${this.connection.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: this.connection.options.timeout,
      });
      
      return response.status === 200;
    } catch (error) {
      throw new Error(`Failed to connect to custom CMS: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Fetch content from the custom CMS
   */
  async fetchContent(options: {
    contentType: string;
    query?: Record<string, any>;
    limit?: number;
    skip?: number;
    sort?: string;
    fields?: string[];
    locale?: string;
    includeReferences?: boolean;
  }): Promise<any> {
    try {
      // Check cache
      const cacheKey = this.createCacheKey('fetchContent', options);
      const cachedValue = this.getCachedValue(cacheKey);
      
      if (cachedValue) {
        return cachedValue;
      }
      
      // Build the query
      const query: Record<string, any> = {
        limit: options.limit || 10,
        offset: options.skip || 0,
      };
      
      if (options.sort) {
        query.sort = options.sort;
      }
      
      if (options.locale) {
        query.locale = options.locale;
      }
      
      if (options.fields) {
        query.fields = options.fields.join(',');
      }
      
      if (options.includeReferences) {
        query.include = 'references';
      }
      
      if (options.query) {
        Object.assign(query, options.query);
      }
      
      // Make the request
      const url = `${this.connection.apiUrl}/content/${options.contentType}`;
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${this.connection.apiKey}`,
          'Content-Type': 'application/json',
        },
        params: query,
        timeout: this.connection.options.timeout,
      });
      
      // Cache the result
      this.setCachedValue(cacheKey, response.data);
      
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch content from custom CMS: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Create a content model in the custom CMS
   */
  async createContentModel(model: ContentModel): Promise<any> {
    try {
      // Make the request
      const url = `${this.connection.apiUrl}/models`;
      
      const response = await axios.post(url, model, {
        headers: {
          'Authorization': `Bearer ${this.connection.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: this.connection.options.timeout,
      });
      
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create content model in custom CMS: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Create content in the custom CMS
   */
  async createContent(options: {
    contentType: string;
    fields: Record<string, any>;
    locale?: string;
    publish?: boolean;
  }): Promise<any> {
    try {
      // Build the data
      const data = { ...options.fields };
      
      if (options.locale) {
        data.locale = options.locale;
      }
      
      if (options.publish !== false) {
        data.status = 'published';
      } else {
        data.status = 'draft';
      }
      
      // Make the request
      const url = `${this.connection.apiUrl}/content/${options.contentType}`;
      
      const response = await axios.post(url, data, {
        headers: {
          'Authorization': `Bearer ${this.connection.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: this.connection.options.timeout,
      });
      
      return {
        id: response.data.id,
      };
    } catch (error) {
      throw new Error(`Failed to create content in custom CMS: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Update content in the custom CMS
   */
  async updateContent(options: {
    contentType: string;
    id: string;
    fields: Record<string, any>;
    locale?: string;
    publish?: boolean;
  }): Promise<any> {
    try {
      // Build the data
      const data = { ...options.fields };
      
      if (options.locale) {
        data.locale = options.locale;
      }
      
      if (options.publish !== false) {
        data.status = 'published';
      } else {
        data.status = 'draft';
      }
      
      // Make the request
      const url = `${this.connection.apiUrl}/content/${options.contentType}/${options.id}`;
      
      const response = await axios.put(url, data, {
        headers: {
          'Authorization': `Bearer ${this.connection.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: this.connection.options.timeout,
      });
      
      return {
        id: options.id,
      };
    } catch (error) {
      throw new Error(`Failed to update content in custom CMS: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Delete content from the custom CMS
   */
  async deleteContent(options: {
    contentType: string;
    id: string;
  }): Promise<any> {
    try {
      // Make the request
      const url = `${this.connection.apiUrl}/content/${options.contentType}/${options.id}`;
      
      await axios.delete(url, {
        headers: {
          'Authorization': `Bearer ${this.connection.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: this.connection.options.timeout,
      });
      
      return true;
    } catch (error) {
      throw new Error(`Failed to delete content from custom CMS: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
