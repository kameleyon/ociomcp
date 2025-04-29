// Auto-generated safe fallback for api-integration

export function activate() {
    console.log("[TOOL] api-integration activated (passive mode)");
}

/**
 * Called when a file is written
 * - Can be used to automatically update API documentation when API-related files change
 * - Can trigger API schema validation for modified files
 * - Can update API client code when API definitions change
 */
export function onFileWrite(event: { path: string; content: string }) {
  // Check if the file is API-related
  if (event.path.includes('api') || event.path.includes('endpoints') || event.path.endsWith('.api.ts')) {
    console.log(`[API Integration] Detected changes in API-related file: ${event.path}`);
    
    // Could automatically update API documentation
    // generateApiDocumentation(event.path, event.content);
    
    // Could validate API schema
    // validateApiSchema(event.path, event.content);
  }
}

/**
 * Called when a new session starts
 * - Can initialize API clients with proper authentication
 * - Can check API availability and status
 * - Can refresh API tokens or credentials
 */
export function onSessionStart(session: { id: string; startTime: number }) {
  console.log(`[API Integration] New session started: ${session.id}`);
  
  // Could initialize API clients
  // initializeApiClients();
  
  // Could check API availability
  // checkApiAvailability();
  
  // Could refresh API tokens
  // refreshApiTokens();
}

/**
 * Called when a command is executed
 * - Can handle API-specific commands
 * - Can log API-related operations
 * - Can provide API status information
 */
export function onCommand(command: { name: string; args: any[] }) {
  if (command.name === 'api:status') {
    console.log('[API Integration] Checking API status...');
    // Return API status information
    // return getApiStatus();
  }
  
  if (command.name === 'api:test') {
    console.log('[API Integration] Running API tests...');
    // Run API tests
    // return runApiTests(command.args);
  }
  
  if (command.name === 'api:generate-client') {
    console.log('[API Integration] Generating API client...');
    // Generate API client code
    // return generateApiClient(command.args);
  }
}
/**
 * API Integration
 * Provides functionality for integrating with external APIs
 */

/**
 * API authentication type definitions
 */
export enum ApiAuthType {
  NONE = 'none',
  API_KEY = 'api-key',
  BEARER_TOKEN = 'bearer-token',
  BASIC_AUTH = 'basic-auth',
  OAUTH2 = 'oauth2',
  CUSTOM = 'custom',
}

/**
 * API request method definitions
 */
export enum ApiRequestMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS',
}

/**
 * API response format definitions
 */
export enum ApiResponseFormat {
  JSON = 'json',
  XML = 'xml',
  TEXT = 'text',
  BINARY = 'binary',
}

/**
 * API configuration
 */
export interface ApiConfig {
  name: string;
  baseUrl: string;
  version?: string;
  description?: string;
  authType: ApiAuthType;
  authConfig?: {
    apiKey?: string;
    apiKeyName?: string;
    apiKeyLocation?: 'header' | 'query' | 'cookie';
    username?: string;
    password?: string;
    token?: string;
    clientId?: string;
    clientSecret?: string;
    tokenUrl?: string;
    authorizationUrl?: string;
    scope?: string;
    customAuth?: Record<string, any>;
  };
  headers?: Record<string, string>;
  defaultParams?: Record<string, string>;
  timeout?: number;
  retries?: number;
  rateLimiting?: {
    requestsPerMinute?: number;
    requestsPerHour?: number;
    requestsPerDay?: number;
  };
}

/**
 * API endpoint
 */
export interface ApiEndpoint {
  name: string;
  path: string;
  method: ApiRequestMethod;
  description?: string;
  parameters?: {
    path?: Record<string, {
      type: string;
      required: boolean;
      description?: string;
    }>;
    query?: Record<string, {
      type: string;
      required: boolean;
      description?: string;
    }>;
    body?: {
      type: string;
      required: boolean;
      schema?: Record<string, any>;
      description?: string;
    };
  };
  responses?: Record<string, {
    description: string;
    schema?: Record<string, any>;
  }>;
  authentication?: boolean;
  rateLimit?: {
    requestsPerMinute?: number;
    requestsPerHour?: number;
    requestsPerDay?: number;
  };
}

/**
 * API request options
 */
export interface ApiRequestOptions {
  endpoint: string | ApiEndpoint;
  pathParams?: Record<string, string | number>;
  queryParams?: Record<string, string | number | boolean | null>;
  body?: any;
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
  responseFormat?: ApiResponseFormat;
}

/**
 * API response
 */
export interface ApiResponse<T = any> {
  status: number;
  statusText: string;
  data: T;
  headers: Record<string, string>;
  request: {
    url: string;
    method: ApiRequestMethod;
    headers: Record<string, string>;
    body?: any;
  };
  timing: {
    startTime: number;
    endTime: number;
    duration: number;
  };
}

/**
 * API client
 */
export class ApiClient {
  private config: ApiConfig;
  private endpoints: Record<string, ApiEndpoint> = {};
  private rateLimiters: Record<string, {
    lastRequest: number;
    requestsThisMinute: number;
    requestsThisHour: number;
    requestsThisDay: number;
    minuteReset: number;
    hourReset: number;
    dayReset: number;
  }> = {};

  constructor(config: ApiConfig) {
    this.config = config;
    this.initializeRateLimiters();
  }

  /**
   * Initializes rate limiters
   */
  private initializeRateLimiters(): void {
    const now = Date.now();
    this.rateLimiters['global'] = {
      lastRequest: now,
      requestsThisMinute: 0,
      requestsThisHour: 0,
      requestsThisDay: 0,
      minuteReset: now + 60 * 1000,
      hourReset: now + 60 * 60 * 1000,
      dayReset: now + 24 * 60 * 60 * 1000,
    };
  }

  /**
   * Registers an API endpoint
   */
  registerEndpoint(endpoint: ApiEndpoint): void {
    this.endpoints[endpoint.name] = endpoint;
    
    // Initialize rate limiter for this endpoint if it has specific rate limits
    if (endpoint.rateLimit) {
      const now = Date.now();
      this.rateLimiters[endpoint.name] = {
        lastRequest: now,
        requestsThisMinute: 0,
        requestsThisHour: 0,
        requestsThisDay: 0,
        minuteReset: now + 60 * 1000,
        hourReset: now + 60 * 60 * 1000,
        dayReset: now + 24 * 60 * 60 * 1000,
      };
    }
  }

  /**
   * Gets an API endpoint by name
   */
  getEndpoint(name: string): ApiEndpoint | undefined {
    return this.endpoints[name];
  }

  /**
   * Makes an API request
   */
  async request<T = any>(options: ApiRequestOptions): Promise<ApiResponse<T>> {
    const {
      endpoint,
      pathParams = {},
      queryParams = {},
      body,
      headers = {},
      timeout = this.config.timeout,
      retries = this.config.retries,
      responseFormat = ApiResponseFormat.JSON,
    } = options;

    // Get the endpoint configuration
    const endpointConfig = typeof endpoint === 'string' ? this.getEndpoint(endpoint) : endpoint;
    
    if (!endpointConfig) {
      throw new Error(`Endpoint not found: ${endpoint}`);
    }

    // Check rate limits
    this.checkRateLimits(endpointConfig.name);

    // Build the URL
    const url = this.buildUrl(endpointConfig, pathParams, queryParams);

    // Build the headers
    const requestHeaders = this.buildHeaders(headers, endpointConfig);

    // Build the request options
    const requestOptions: RequestInit = {
      method: endpointConfig.method,
      headers: requestHeaders,
    };

    // Add body if needed
    if (body && ['POST', 'PUT', 'PATCH'].includes(endpointConfig.method)) {
      requestOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    // Make the request
    const startTime = Date.now();
    let response: Response;
    let retryCount = 0;

    while (true) {
      try {
        response = await fetch(url, requestOptions);
        break;
      } catch (error) {
        if (retryCount >= (retries || 0)) {
          throw error;
        }
        retryCount++;
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
      }
    }

    const endTime = Date.now();

    // Update rate limit counters
    this.updateRateLimitCounters(endpointConfig.name);

    // Parse the response
    let data: T;
    
    switch (responseFormat) {
      case ApiResponseFormat.JSON:
        data = await response.json();
        break;
      case ApiResponseFormat.TEXT:
        data = await response.text() as unknown as T;
        break;
      case ApiResponseFormat.BINARY:
        data = await response.arrayBuffer() as unknown as T;
        break;
      case ApiResponseFormat.XML:
        const text = await response.text();
        // Simple XML to JSON conversion (for demonstration purposes)
        data = this.parseXml(text) as unknown as T;
        break;
      default:
        data = await response.json();
    }

    // Build the response object
    const apiResponse: ApiResponse<T> = {
      status: response.status,
      statusText: response.statusText,
      data,
      headers: this.parseHeaders(response.headers),
      request: {
        url,
        method: endpointConfig.method,
        headers: requestHeaders,
        body,
      },
      timing: {
        startTime,
        endTime,
        duration: endTime - startTime,
      },
    };

    return apiResponse;
  }

  /**
   * Builds the URL for an API request
   */
  private buildUrl(
    endpoint: ApiEndpoint,
    pathParams: Record<string, string | number>,
    queryParams: Record<string, string | number | boolean | null>
  ): string {
    // Start with the base URL
    let url = this.config.baseUrl;
    
    // Add version if specified
    if (this.config.version) {
      url = url.endsWith('/') ? `${url}${this.config.version}` : `${url}/${this.config.version}`;
    }
    
    // Add endpoint path
    let path = endpoint.path;
    
    // Replace path parameters
    for (const [key, value] of Object.entries(pathParams)) {
      path = path.replace(`{${key}}`, encodeURIComponent(String(value)));
    }
    
    // Add path to URL
    url = url.endsWith('/') ? `${url}${path.startsWith('/') ? path.substring(1) : path}` : `${url}${path.startsWith('/') ? path : `/${path}`}`;
    
    // Add query parameters
    const allQueryParams = { ...this.config.defaultParams, ...queryParams };
    
    if (Object.keys(allQueryParams).length > 0) {
      const queryString = Object.entries(allQueryParams)
        .filter(([_, value]) => value !== null && value !== undefined)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
        .join('&');
      
      url = `${url}${url.includes('?') ? '&' : '?'}${queryString}`;
    }
    
    return url;
  }

  /**
   * Builds the headers for an API request
   */
  private buildHeaders(
    customHeaders: Record<string, string>,
    endpoint: ApiEndpoint
  ): Record<string, string> {
    // Start with default headers
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...this.config.headers,
    };
    
    // Add authentication headers
    if (endpoint.authentication !== false) {
      switch (this.config.authType) {
        case ApiAuthType.API_KEY:
          if (this.config.authConfig?.apiKey && this.config.authConfig?.apiKeyName) {
            if (this.config.authConfig.apiKeyLocation === 'header') {
              headers[this.config.authConfig.apiKeyName] = this.config.authConfig.apiKey;
            }
          }
          break;
        case ApiAuthType.BEARER_TOKEN:
          if (this.config.authConfig?.token) {
            headers['Authorization'] = `Bearer ${this.config.authConfig.token}`;
          }
          break;
        case ApiAuthType.BASIC_AUTH:
          if (this.config.authConfig?.username && this.config.authConfig?.password) {
            const credentials = btoa(`${this.config.authConfig.username}:${this.config.authConfig.password}`);
            headers['Authorization'] = `Basic ${credentials}`;
          }
          break;
        case ApiAuthType.OAUTH2:
          if (this.config.authConfig?.token) {
            headers['Authorization'] = `Bearer ${this.config.authConfig.token}`;
          }
          break;
        case ApiAuthType.CUSTOM:
          // Custom authentication is handled by the user
          break;
      }
    }
    
    // Add custom headers
    return { ...headers, ...customHeaders };
  }

  /**
   * Parses response headers
   */
  private parseHeaders(headers: Headers): Record<string, string> {
    const result: Record<string, string> = {};
    
    headers.forEach((value, key) => {
      result[key] = value;
    });
    
    return result;
  }

  /**
   * Parses XML to JSON (simplified)
   */
  private parseXml(xml: string): Record<string, any> {
    // This is a very simplified XML parser for demonstration purposes
    // In a real implementation, you would use a proper XML parser
    const result: Record<string, any> = {};
    
    // Extract tags and content
    const tagRegex = /<(\w+)>(.*?)<\/\1>/g;
    let match;
    
    while ((match = tagRegex.exec(xml)) !== null) {
      const [_, tag, content] = match;
      result[tag] = content;
    }
    
    return result;
  }

  /**
   * Checks rate limits before making a request
   */
  private checkRateLimits(endpointName: string): void {
    const now = Date.now();
    
    // Check global rate limits
    const globalLimiter = this.rateLimiters['global'];
    this.updateRateLimitTimers(globalLimiter, now);
    
    if (
      (this.config.rateLimiting?.requestsPerMinute && globalLimiter.requestsThisMinute >= this.config.rateLimiting.requestsPerMinute) ||
      (this.config.rateLimiting?.requestsPerHour && globalLimiter.requestsThisHour >= this.config.rateLimiting.requestsPerHour) ||
      (this.config.rateLimiting?.requestsPerDay && globalLimiter.requestsThisDay >= this.config.rateLimiting.requestsPerDay)
    ) {
      throw new Error('Rate limit exceeded');
    }
    
    // Check endpoint-specific rate limits
    const endpoint = this.endpoints[endpointName];
    if (endpoint?.rateLimit && this.rateLimiters[endpointName]) {
      const endpointLimiter = this.rateLimiters[endpointName];
      this.updateRateLimitTimers(endpointLimiter, now);
      
      if (
        (endpoint.rateLimit.requestsPerMinute && endpointLimiter.requestsThisMinute >= endpoint.rateLimit.requestsPerMinute) ||
        (endpoint.rateLimit.requestsPerHour && endpointLimiter.requestsThisHour >= endpoint.rateLimit.requestsPerHour) ||
        (endpoint.rateLimit.requestsPerDay && endpointLimiter.requestsThisDay >= endpoint.rateLimit.requestsPerDay)
      ) {
        throw new Error(`Rate limit exceeded for endpoint: ${endpointName}`);
      }
    }
  }

  /**
   * Updates rate limit timers
   */
  private updateRateLimitTimers(
    limiter: {
      lastRequest: number;
      requestsThisMinute: number;
      requestsThisHour: number;
      requestsThisDay: number;
      minuteReset: number;
      hourReset: number;
      dayReset: number;
    },
    now: number
  ): void {
    // Reset minute counter if needed
    if (now >= limiter.minuteReset) {
      limiter.requestsThisMinute = 0;
      limiter.minuteReset = now + 60 * 1000;
    }
    
    // Reset hour counter if needed
    if (now >= limiter.hourReset) {
      limiter.requestsThisHour = 0;
      limiter.hourReset = now + 60 * 60 * 1000;
    }
    
    // Reset day counter if needed
    if (now >= limiter.dayReset) {
      limiter.requestsThisDay = 0;
      limiter.dayReset = now + 24 * 60 * 60 * 1000;
    }
  }

  /**
   * Updates rate limit counters after making a request
   */
  private updateRateLimitCounters(endpointName: string): void {
    // Update global counters
    const globalLimiter = this.rateLimiters['global'];
    globalLimiter.lastRequest = Date.now();
    globalLimiter.requestsThisMinute++;
    globalLimiter.requestsThisHour++;
    globalLimiter.requestsThisDay++;
    
    // Update endpoint-specific counters
    if (this.rateLimiters[endpointName]) {
      const endpointLimiter = this.rateLimiters[endpointName];
      endpointLimiter.lastRequest = Date.now();
      endpointLimiter.requestsThisMinute++;
      endpointLimiter.requestsThisHour++;
      endpointLimiter.requestsThisDay++;
    }
  }
}

/**
 * Creates an API client
 */
export function createApiClient(config: ApiConfig): ApiClient {
  return new ApiClient(config);
}

/**
 * Generates API documentation
 */
export function generateApiDocumentation(
  config: ApiConfig,
  endpoints: ApiEndpoint[]
): string {
  let markdown = `# ${config.name} API Documentation\n\n`;
  
  // Add description
  if (config.description) {
    markdown += `${config.description}\n\n`;
  }
  
  // Add base URL and version
  markdown += `**Base URL:** ${config.baseUrl}\n`;
  
  if (config.version) {
    markdown += `**Version:** ${config.version}\n`;
  }
  
  markdown += '\n';
  
  // Add authentication
  markdown += '## Authentication\n\n';
  
  switch (config.authType) {
    case ApiAuthType.NONE:
      markdown += 'This API does not require authentication.\n';
      break;
    case ApiAuthType.API_KEY:
      markdown += `This API uses API key authentication. Include your API key in the ${config.authConfig?.apiKeyLocation || 'header'} as \`${config.authConfig?.apiKeyName || 'X-API-Key'}\`.\n`;
      break;
    case ApiAuthType.BEARER_TOKEN:
      markdown += 'This API uses Bearer token authentication. Include your token in the Authorization header as `Bearer YOUR_TOKEN`.\n';
      break;
    case ApiAuthType.BASIC_AUTH:
      markdown += 'This API uses Basic authentication. Include your credentials in the Authorization header as `Basic BASE64_ENCODED_CREDENTIALS`.\n';
      break;
    case ApiAuthType.OAUTH2:
      markdown += 'This API uses OAuth 2.0 authentication.\n';
      
      if (config.authConfig?.authorizationUrl) {
        markdown += `**Authorization URL:** ${config.authConfig.authorizationUrl}\n`;
      }
      
      if (config.authConfig?.tokenUrl) {
        markdown += `**Token URL:** ${config.authConfig.tokenUrl}\n`;
      }
      
      if (config.authConfig?.scope) {
        markdown += `**Scope:** ${config.authConfig.scope}\n`;
      }
      break;
    case ApiAuthType.CUSTOM:
      markdown += 'This API uses custom authentication.\n';
      break;
  }
  
  markdown += '\n';
  
  // Add endpoints
  markdown += '## Endpoints\n\n';
  
  for (const endpoint of endpoints) {
    markdown += `### ${endpoint.name}\n\n`;
    
    if (endpoint.description) {
      markdown += `${endpoint.description}\n\n`;
    }
    
    markdown += `**URL:** ${endpoint.path}\n`;
    markdown += `**Method:** ${endpoint.method}\n`;
    
    if (endpoint.authentication === false) {
      markdown += '**Authentication:** Not required\n';
    }
    
    markdown += '\n';
    
    // Add parameters
    if (endpoint.parameters) {
      if (endpoint.parameters.path && Object.keys(endpoint.parameters.path).length > 0) {
        markdown += '**Path Parameters:**\n\n';
        markdown += '| Name | Type | Required | Description |\n';
        markdown += '|------|------|----------|-------------|\n';
        
        for (const [name, param] of Object.entries(endpoint.parameters.path)) {
          markdown += `| ${name} | ${param.type} | ${param.required ? 'Yes' : 'No'} | ${param.description || ''} |\n`;
        }
        
        markdown += '\n';
      }
      
      if (endpoint.parameters.query && Object.keys(endpoint.parameters.query).length > 0) {
        markdown += '**Query Parameters:**\n\n';
        markdown += '| Name | Type | Required | Description |\n';
        markdown += '|------|------|----------|-------------|\n';
        
        for (const [name, param] of Object.entries(endpoint.parameters.query)) {
          markdown += `| ${name} | ${param.type} | ${param.required ? 'Yes' : 'No'} | ${param.description || ''} |\n`;
        }
        
        markdown += '\n';
      }
      
      if (endpoint.parameters.body) {
        markdown += '**Request Body:**\n\n';
        markdown += `Type: ${endpoint.parameters.body.type}\n`;
        markdown += `Required: ${endpoint.parameters.body.required ? 'Yes' : 'No'}\n`;
        
        if (endpoint.parameters.body.description) {
          markdown += `Description: ${endpoint.parameters.body.description}\n`;
        }
        
        if (endpoint.parameters.body.schema) {
          markdown += '\n**Schema:**\n\n';
          markdown += '```json\n';
          markdown += JSON.stringify(endpoint.parameters.body.schema, null, 2);
          markdown += '\n```\n';
        }
        
        markdown += '\n';
      }
    }
    
    // Add responses
    if (endpoint.responses && Object.keys(endpoint.responses).length > 0) {
      markdown += '**Responses:**\n\n';
      
      for (const [status, response] of Object.entries(endpoint.responses)) {
        markdown += `**${status}**: ${response.description}\n`;
        
        if (response.schema) {
          markdown += '\n```json\n';
          markdown += JSON.stringify(response.schema, null, 2);
          markdown += '\n```\n';
        }
        
        markdown += '\n';
      }
    }
    
    // Add rate limiting
    if (endpoint.rateLimit) {
      markdown += '**Rate Limiting:**\n\n';
      
      if (endpoint.rateLimit.requestsPerMinute) {
        markdown += `- ${endpoint.rateLimit.requestsPerMinute} requests per minute\n`;
      }
      
      if (endpoint.rateLimit.requestsPerHour) {
        markdown += `- ${endpoint.rateLimit.requestsPerHour} requests per hour\n`;
      }
      
      if (endpoint.rateLimit.requestsPerDay) {
        markdown += `- ${endpoint.rateLimit.requestsPerDay} requests per day\n`;
      }
      
      markdown += '\n';
    }
  }
  
  return markdown;
}
