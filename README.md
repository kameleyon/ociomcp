# OptimusCode MCP

A powerful Model Context Protocol (MCP) server for Claude Desktop that transforms it into a fully automated app generator.

## Overview

OptimusCode MCP enhances Claude Desktop with advanced capabilities for autonomous application development. It allows users to generate complete, production-ready applications from start to finish using natural language prompts, without requiring deep technical expertise.

## Core Functionality

OptimusCode MCP enables Claude Desktop to:

- Generate entire applications based on user requirements
- Handle the complete development lifecycle from planning to deployment
- Create modular, maintainable code with proper architecture
- Implement best practices and design patterns automatically
- Ensure type safety with TypeScript integration
- Build responsive and accessible UIs using component-based architecture

## Key Features

### App Generation
- **End-to-End Development**: Generate complete applications from a single prompt
- **Multiple Framework Support**: Create apps using React, Next.js, Vue, Angular, and more
- **Database Integration**: Connect to various databases including MongoDB, PostgreSQL, MySQL
- **API Development**: Build RESTful or GraphQL APIs with proper authentication and validation

### Code Quality
- **TypeScript Enforcement**: Generate properly typed code with full TypeScript support
- **Component Architecture**: Create modular, reusable components with clean separation of concerns
- **File Size Management**: Maintain files under 500 lines for better maintainability
- **Error Prevention**: Proactively identify and fix potential issues during generation

### Project Management
- **Context Management**: Track context size and create new chats when needed
- **Persistence**: Save and restore session state across chats
- **Project Planning**: Generate detailed project plans with phases and tasks
- **Version Control**: Track changes to files for comprehensive history

### Development Tools
- **Code Analysis**: Identify and resolve errors, complexity issues, and performance bottlenecks
- **Documentation Generation**: Create comprehensive documentation for projects
- **Testing Framework**: Generate tests for ensuring application reliability
- **Dependency Management**: Add, remove, and update project dependencies

## Usage Instructions

### Activating the MCP

To activate OptimusCode MCP, use the following command in your Claude Desktop chat:

```
Claude, unleash optimuscode mcp power
```

This activates all MCP tools with their default settings.

### Tool Categories

OptimusCode MCP provides several categories of tools:

1. **Core Development Tools**: Generate components, pages, and full projects
2. **Project Management Tools**: Plan, track, and visualize project progress
3. **Code Quality Tools**: Analyze and improve code quality
4. **Automated Tools**: Functionality that runs in the background

The automated tools remain active once enabled, while other tools must be explicitly called.

### Configuration

You can configure certain tools with custom settings:

- **ToneAdjuster**: Set the tone of responses (formal, casual, technical, friendly, professional)
- **AutoContinue**: Enable automatic continuation of sessions based on context

### Example Workflow

1. **Project Specification**:
   ```
   Create a React e-commerce app with product listings, shopping cart, and checkout.
   ```

2. **Project Planning**:
   OptimusCode MCP will generate a detailed plan with project structure and components.

3. **App Generation**:
   The MCP will create the complete application based on the plan, including:
   - Project structure
   - Component hierarchy
   - API integration
   - State management
   - Styling

4. **Review and Refinement**:
   OptimusCode MCP can make targeted adjustments based on feedback.

## Development Principles

OptimusCode MCP follows these core principles:

- **Modularity**: Build apps with small, manageable components
- **Maintainability**: Generate clean, well-structured code
- **Efficiency**: Create only what's needed, without unnecessary files or code
- **Type Safety**: Ensure proper TypeScript usage throughout
- **Best Practices**: Follow industry standards and design patterns

## Technical Requirements

- Node.js 18 or higher
- Claude Desktop application
- Windows, macOS, or Linux operating system

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/optimuscode-mcp.git
   cd optimuscode-mcp
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Build the project:
   ```
   npm run build
   ```

4. Configure Claude Desktop:
   - Edit the Claude configuration file at:
     - Windows: `%APPDATA%\Claude\claude_desktop_config.json`
     - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
     - Linux: `~/.config/Claude/claude_desktop_config.json`
   - Add the following entry:
     ```json
     "optimuscode": {
       "command": "C:/path/to/your/optimuscode-mcp/run-optimuscode-v2.bat",
       "args": []
     }
     ```
   - Restart Claude Desktop

## Project Structure

```
optimuscode-mcp/
├── src/                       # Source code
│   ├── context-management/    # Context tracking and chat transition
│   ├── persistence/           # Session state management
│   ├── project-planning/      # Project planning functionality
│   ├── code-generation/       # Code generation tools
│   ├── ui-generation/         # UI component generation
│   ├── version-control/       # Change tracking
│   ├── custom-stdio.ts        # Custom transport implementation
│   └── index.ts               # Main entry point
├── dist/                      # Compiled JavaScript files
├── run-optimuscode-v2.bat     # Batch file to run the server
├── package.json               # Project configuration
└── tsconfig.json              # TypeScript configuration
```

## License

MIT

## Acknowledgements

This project builds upon the Desktop Commander MCP by Eduard Ruzga, enhancing it with autonomous app generation capabilities.