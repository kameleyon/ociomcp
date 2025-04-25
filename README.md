# OptimusCode MCP ✅

An enhanced MCP server for AI-powered development with Claude, based on the Desktop Commander MCP. Successfully integrated and working with Claude Desktop!

## Overview

OptimusCode MCP is a Model Context Protocol (MCP) server that extends Claude's capabilities for software development. It provides advanced features for project planning, context management, persistence, and more.

## Features

### Working Features ✅

- **Context Management**: Automatically track context size and create new chats when needed
  - Use the `track_context_size` tool to monitor token usage
  - Automatically detect when to transition to a new chat
  - Preserve context between chat sessions
  
- **Persistence**: Save and restore session state across chats
  - Store project state, active files, and current tasks
  - Seamlessly continue work across multiple chat sessions

- **Project Planning**: Generate detailed project plans with phases and tasks
  - Use the `generate_project_plan` tool to create comprehensive project plans
  - Update task status with the `update_task_status` tool
  - Visualize plans in different formats (Markdown, Gantt charts, HTML)

- **Testing and Error Handling**: Generate tests and analyze errors
  - Use the `generate_test` tool to create unit and integration tests
  - Analyze errors with the `analyze_error` tool to get solutions
  - Find the best LLM model for specific tasks with the `switch_model` tool

- **UI/UX Generation**: Create UI components, pages, and projects
  - Generate React components with the `generate_component` tool
  - Create complete pages with the `generate_page` tool
  - Build full projects with the `generate_project` tool

- **Project Organization**: Organize and document your projects
  - Generate directory structures with the `generate_directory_structure` tool
  - Create documentation with the `generate_documentation` tool
  - Analyze file sizes and get optimization suggestions with the `analyze_file_sizes` tool

- **Advanced Features**: Enhance your development workflow
  - Track changes with the `track_version_changes` tool
  - Generate content with the `generate_content` tool
  - Create translations with the `generate_translations` tool

### Planned Features 🚧

- **Distribution and Community**: Share your work with others
  - Package distribution
  - Plugin system
  - Community contributions

## Project Structure

```
optimuscode-mcp/
├── src/
│   ├── context-management/    # Context tracking and chat transition
│   ├── persistence/           # Session state management
│   ├── project-planning/      # Project planning functionality
│   ├── testing/               # Testing framework integration
│   ├── ui-generation/         # UI component generation
│   ├── version-control/       # Change tracking and state snapshots
│   ├── custom-stdio.ts        # Custom transport implementation
│   └── index.ts               # Main entry point
├── dist/                      # Compiled JavaScript files
├── run-optimuscode-v2.bat     # Batch file to run the server
├── package.json               # Project configuration
└── tsconfig.json              # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm

### Installation

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

4. Set up the MCP server with Claude:
   ```
   npm run setup
   ```

5. Configure Claude Desktop:
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

### Development

1. Make changes to the TypeScript files in the `src` directory
2. Build the project:
   ```
   npm run build
   ```
3. Start the server:
   ```
   npm start
   ```

## Current Status

This project is in active development and **successfully integrated with Claude Desktop**. The following components have been implemented:

- [x] Basic project structure
- [x] Context tracking and management (working with Claude!)
- [x] Session state persistence
- [x] Custom transport implementation
- [x] Claude Desktop integration
- [x] Project planning functionality
- [x] Testing framework integration
- [x] Error analysis and resolution
- [x] LLM model switching
- [x] UI generation capabilities
- [x] Project organization tools
- [x] Documentation generation
- [x] File size monitoring
- [x] Version control integration
- [x] Content generation
- [x] API integration
- [x] Internationalization support

## Coming Soon

### Phase 7: Enhanced Development Experience
- [x] Enhanced memory system for user preferences
- [x] Performance monitoring and optimization
- [x] Strict no-emoji policy enforcement
- [ ] Comprehensive accessibility compliance
- [ ] Dependency vulnerability scanning
- [ ] AI-assisted refactoring suggestions
- [ ] Interactive documentation and tutorials

### Phase 8: Distribution and Community
- [ ] Package publishing
- [ ] Documentation website
- [ ] Community tools
- [ ] Plugin system

### Using the Features

#### Context Tracking

You can use the context tracking feature by asking Claude:
```
Can you use the track_context_size tool from the OptimusCode MCP?
```

This will show you:
- The current token count in your conversation
- Whether a new chat should be created based on context size

#### Project Planning

You can generate a project plan by asking Claude:
```
Can you use the generate_project_plan tool from the OptimusCode MCP to create a plan for a web application?
```

You'll need to provide:
- Project name and description
- Project type (web-application, mobile-app, api-service, desktop-application, custom)
- List of features
- Optional timeline and team size information

You can then visualize the plan in different formats:
```
Can you use the visualize_project_plan tool to show the plan as a Gantt chart?
```

And update task status:
```
Can you use the update_task_status tool to mark the "Design" task as completed?
```

#### Testing and Error Handling

You can generate tests for your code:
```
Can you use the generate_test tool from the OptimusCode MCP to create a test for this function?
```

You can analyze errors and get solutions:
```
Can you use the analyze_error tool to help me fix this error message?
```

You can find the best LLM model for a specific task:
```
Can you use the switch_model tool to find the best model for code generation?
```

#### UI/UX Generation

You can generate UI components:
```
Can you use the generate_component tool to create a hero section for my landing page?
```

You can generate complete pages:
```
Can you use the generate_page tool to create a landing page with hero, features, and pricing sections?
```

You can generate full projects:
```
Can you use the generate_project tool to create a React Vite project with Tailwind CSS?
```

#### Project Organization

You can generate directory structures:
```
Can you use the generate_directory_structure tool to create a structure for my React web app?
```

You can generate documentation:
```
Can you use the generate_documentation tool to create a README for my project?
```

You can analyze file sizes:
```
Can you use the analyze_file_sizes tool to check if any of my files are too large?
```

#### Advanced Features

You can track version changes:
```
Can you use the track_version_changes tool to record the changes I made to my code?
```

#### Memory System

You can get your current preferences:
```
Can you use the get_user_preferences tool to show my current preferences?
```

You can update your preferences:
```
Can you use the update_user_preferences tool to set my coding style to use spaces instead of tabs?
```

You can analyze code to infer preferences:
```
Can you use the analyze_code_style tool to analyze this code and learn my preferences?
```

You can adapt code to match your preferences:
```
Can you use the adapt_code tool to format this code according to my preferences?
```

#### Performance Optimization

You can analyze bundle sizes:
```
Can you use the analyze_bundle tool to analyze my bundle.js file?
```

You can analyze a directory of files:
```
Can you use the analyze_directory tool to analyze my src directory?
```

You can generate a performance report:
```
Can you use the generate_performance_report tool to create a performance report for my project?
```

You can create snapshots:
```
Can you use the create_snapshot tool to save the current state of my project?
```

You can revert to previous snapshots:
```
Can you use the revert_to_snapshot tool to go back to a previous version of my project?
```

You can generate content:
```
Can you use the generate_content tool to create a privacy policy for my website?
```

You can generate translations:
```
Can you use the generate_translations tool to translate my app's UI strings into Spanish and French?
```

## Next Steps

1. Implement the project planning functionality (Phase 2 in ROADMAP.md)
2. Develop the testing framework integration
3. Add UI generation capabilities
4. Implement version control and history features
5. Create comprehensive documentation
6. Publish to npm for easier installation

See the [ROADMAP.md](ROADMAP.md) file for a detailed development plan.

## License

MIT

## Acknowledgements

This project is based on the Desktop Commander MCP by Eduard Ruzga.#   o c i o m c p  
 