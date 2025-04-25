# OptimusCode MCP Architecture

This document outlines the architecture of the OptimusCode MCP server, focusing on how the different components interact with each other and how the tools are organized.

## System Overview

The OptimusCode MCP (Model Context Protocol) server is designed to turn Claude Desktop into a fully automated app generator. It provides a suite of tools that Claude can use to generate complete applications from start to finish based on user requests.

The system is organized into several key components:

1. **Core MCP Server**: Handles communication with Claude Desktop using the Model Context Protocol
2. **Tool Registry**: Manages the registration and discovery of available tools
3. **Tool Implementations**: Individual tools organized by category
4. **API Integration Layer**: Manages communication with external APIs
5. **Filesystem Layer**: Handles file and directory operations
6. **Command Execution Layer**: Manages terminal commands and processes
7. **Context Management Layer**: Handles chat context and session management

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      Claude Desktop Client                       │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        MCP Protocol Layer                        │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                         OptimusCode MCP Server                   │
│                                                                  │
│  ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐ │
│  │   Tool Registry  │◄──┤  Request Router │◄──┤  Response Builder│ │
│  └────────┬────────┘   └─────────────────┘   └─────────────────┘ │
│           │                                                       │
│           ▼                                                       │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                        Tool Implementations                  │ │
│  │                                                              │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │ │
│  │  │  Automated  │  │  On-Demand  │  │     API     │          │ │
│  │  │    Tools    │  │    Tools    │  │ Dependent   │          │ │
│  │  │             │  │             │  │    Tools    │          │ │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘          │ │
│  └─────────┼───────────────┼───────────────┼─────────────────┘ │
│            │               │               │                     │
│  ┌─────────▼───────┐ ┌─────▼───────┐ ┌─────▼───────┐            │
│  │   Filesystem    │ │   Command   │ │     API     │            │
│  │      Layer      │ │    Layer    │ │    Layer    │            │
│  └─────────────────┘ └─────────────┘ └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
```

## Component Details

### Core MCP Server

The core server handles the communication with Claude Desktop using the Model Context Protocol. It's responsible for:

- Receiving requests from Claude Desktop
- Routing requests to the appropriate tools
- Returning responses to Claude Desktop

Key files:
- `src/index.ts`: Main entry point for the server
- `src/custom-stdio.ts`: Custom transport layer for MCP communication

### Tool Registry

The Tool Registry manages the registration and discovery of available tools. It provides a centralized registry where tools can be registered, discovered, and accessed.

Key files:
- `src/tool-registry/registry.ts`: Central registry for all tools
- `src/tool-registry/tool-loader.ts`: Dynamically loads tool implementations

### Tool Implementations

Tools are organized into three main categories:

1. **Automated Tools**: Always active and running in the background
2. **On-Demand Tools**: Available when needed and explicitly called by Claude
3. **API-Dependent Tools**: Require external API access to function

Each tool category has its own directory structure and implementation patterns.

#### Automated Tools

Located in `src/automated-tools/`, these tools are always active and monitor the system continuously.

Key files:
- `src/automated-tools/context-manager/`: Context window management
- `src/automated-tools/chat-initiator/`: New chat session creation
- `src/automated-tools/tone-adjuster/`: Communication tone adjustment
- `src/automated-tools/path-enforcer/`: Directory enforcement
- `src/automated-tools/code-splitter/`: Component-based architecture enforcement
- `src/automated-tools/code-fixer/`: Automatic code issue resolution
- `src/automated-tools/plan-creator/`: Project plan generation

#### On-Demand Tools

Located in various directories based on their functionality, these tools are called explicitly by Claude when needed.

Key directories:
- `src/filesystem/`: File and directory operations
- `src/command/`: Terminal command execution
- `src/project-planning/`: Project planning and visualization
- `src/ui-generation/`: UI component and page generation
- `src/project-organization/`: Project structure and documentation
- `src/advanced-features/`: Version control and content generation

#### API-Dependent Tools

Located in `src/api-integration/`, these tools require external API access to function.

Key files:
- `src/api-integration/model-switcher.ts`: LLM model switching
- `src/api-integration/code-analyzer.ts`: AI-assisted code analysis
- `src/api-integration/ai-connector.ts`: Integration with various AI models

### API Integration Layer

The API Integration Layer manages communication with external APIs, particularly the OpenRouter API for accessing various AI models.

Key files:
- `src/api-integration/openrouter-client.ts`: Client for OpenRouter API
- `src/api-integration/rate-limiter.ts`: Rate limiting for API calls
- `src/api-integration/retry-strategy.ts`: Retry logic for failed API calls
- `src/api-integration/cost-tracker.ts`: Tracking API usage costs

### Filesystem Layer

The Filesystem Layer handles file and directory operations, providing a consistent interface for working with the filesystem.

Key files:
- `src/filesystem/filesystem.ts`: Core filesystem operations
- `src/filesystem/handlers.ts`: Handlers for filesystem tools
- `src/filesystem/search.ts`: File and code search functionality
- `src/filesystem/types.ts`: Type definitions for filesystem operations

### Command Execution Layer

The Command Execution Layer manages terminal commands and processes, allowing Claude to execute commands and monitor their output.

Key files:
- `src/command/command-manager.ts`: Manages command execution
- `src/command/handlers.ts`: Handlers for command execution tools
- `src/command/types.ts`: Type definitions for command execution

### Context Management Layer

The Context Management Layer handles chat context and session management, ensuring seamless transitions between chat sessions.

Key files:
- `src/context-management/chat-transition.ts`: Manages chat transitions
- `src/context-management/context-tracker.ts`: Tracks context size
- `src/persistence/session-state.ts`: Manages session state persistence

## Data Flow

1. Claude Desktop sends a request to the OptimusCode MCP server using the MCP protocol
2. The server receives the request and routes it to the appropriate tool
3. The tool executes the requested operation, potentially using the filesystem, command execution, or API integration layers
4. The tool returns a response to the server
5. The server formats the response according to the MCP protocol and sends it back to Claude Desktop

## Tool Registration and Discovery

Tools are registered with the Tool Registry during server initialization. Each tool provides:

- Name: A unique identifier for the tool
- Description: A description of what the tool does
- Input Schema: A schema defining the expected input parameters
- Handler: A function that implements the tool's functionality

The Tool Registry makes these tools available to Claude Desktop through the MCP protocol's `tools/list` method.

## Error Handling

The system implements a comprehensive error handling strategy:

1. **Tool-level errors**: Each tool handles its own errors and returns appropriate error messages
2. **Server-level errors**: The server catches any unhandled errors and returns a generic error message
3. **API-level errors**: The API Integration Layer implements retry logic and fallback mechanisms for API failures
4. **Filesystem errors**: The Filesystem Layer handles filesystem errors and provides meaningful error messages
5. **Command execution errors**: The Command Execution Layer handles command execution errors and provides detailed error information

## Configuration Management

The system uses a configuration management approach that allows for:

- Environment-specific configuration (development, production)
- Tool-specific configuration
- API key management
- Feature flags for enabling/disabling specific tools or categories

Key files:
- `src/config/config-manager.ts`: Manages configuration loading and access
- `src/config/default-config.ts`: Default configuration values
- `src/config/environment-config.ts`: Environment-specific configuration

## Extensibility

The architecture is designed to be extensible, allowing for:

1. **New tools**: Adding new tools without modifying existing code
2. **New API integrations**: Adding new API providers and models
3. **New tool categories**: Creating new categories of tools as needed
4. **Custom tool implementations**: Replacing default implementations with custom ones

## Security Considerations

The system implements several security measures:

1. **Path validation**: Ensuring file operations only occur within allowed directories
2. **API key protection**: Securely managing API keys and credentials
3. **Command validation**: Validating commands before execution to prevent malicious commands
4. **Rate limiting**: Preventing excessive API usage
5. **Error message sanitization**: Ensuring error messages don't leak sensitive information

## Performance Optimization

The architecture includes several performance optimizations:

1. **Caching**: Caching frequently used data to reduce API calls and filesystem operations
2. **Parallel processing**: Executing independent operations in parallel
3. **Lazy loading**: Loading tools and components only when needed
4. **Resource pooling**: Reusing expensive resources like API clients
5. **Efficient context management**: Minimizing context size to reduce token usage

## Conclusion

The OptimusCode MCP server architecture provides a robust, extensible, and efficient foundation for turning Claude Desktop into a fully automated app generator. By organizing tools into categories, implementing a layered architecture, and providing comprehensive error handling and security measures, the system can reliably generate complete applications based on user requests.