# OptimusCode MCP

A powerful app generator that transforms Claude Desktop into a fully automated independent application builder.

## Overview

OptimusCode MCP (Model Context Protocol) extends Claude Desktop capabilities to automatically generate complete applications from start to finish based solely on user requests. This system leverages Claude's AI capabilities and integrates them with a comprehensive set of development tools for code generation, project organization, and build automation.

## Key Features

- **Complete App Generation**: Build entire applications from natural language requests
- **Automated Code Management**: Automatic code splitting, fixing, and optimization
- **Project Planning and Organization**: Structured approach to application development
- **Comprehensive Tool Integration**: 60+ specialized tools for development
- **Claude Desktop Integration**: Seamless interaction with Claude's AI capabilities

## System Architecture

The system is organized into several key modules:

- **Core Engine** (`src/index.ts`): Central processing and coordination
- **Tool Management** (`src/tools/`): Specialized tools for various development tasks
- **Automated Utilities** (`src/tools/automated/`): Code analysis and optimization
- **UI Generation** (`src/tools/ui-generation/`): Component and interface creation
- **Project Planning** (`src/tools/project-planning/`): Application structure and organization
- **Context Management** (`src/tools/context-management/`): State and context tracking

## Tool Categories

OptimusCode MCP includes tools for:

- Code analysis, formatting, and fixing
- Project planning and organization
- UI component generation
- Documentation creation
- Database schema generation
- API integration and service building
- Testing and quality assurance
- Deployment and infrastructure

## Getting Started

1. Ensure Claude Desktop is installed
2. Configure API keys in the `.env` file
3. Run the activation script: `node unleash-power.js`
4. Start the MCP server: `npm run start`

## Configuration

Configuration is managed through:

- `.env`: API keys and server settings
- `ocioconfig.json`: Tool configuration and preferences
- `tools-config.json`: Tool activation settings

## Development Guidelines

- Files should not exceed 500 lines
- Components should be small and manageable
- Use Lucide React icons instead of emojis
- Always use environment variables for API keys
- TypeScript is preferred for type safety

## Command-Line Tools

- `npm run build`: Build the project
- `npm run start`: Start the MCP server
- `npm run setup`: Install dependencies and setup
- `node unleash-power.js`: Activate all tools

## License

MIT License - See LICENSE file for details.
