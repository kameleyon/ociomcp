# OptimusCode MCP Tool Suite for Claude Desktop

Here's a comprehensive, organized list of all tools for the OptimusCode MCP system:

## Automated Tools (Always Active)

**AutoContinue**
* Monitors context limits and triggers new chat sessions automatically
* Provides summaries and next steps when continuing
* *Implements context window monitoring with token counting*
* ***Requires API integration for context window metrics***

**ChatInitiator**
* Creates new chat sessions while maintaining project context
* Includes hotkey support (e.g., Ctrl+N) for quick session creation
* Ensures seamless transitions between chat sessions
* *Implements keyboard shortcut handling and context passing*

**ToneAdjuster**
* Uses natural, casual language with urban touches while remaining professional
* Adjusts tone based on conversation context
* Maintains professional approach for documentation
* *Implements tone-aware communication patterns*

**PathEnforcer**
* Ensures all content is written within specified project directories
* Requests directory information before starting if not provided
* *Implements path validation and directory enforcement*

**CodeSplitter**
* Keeps files under 500 lines
* Ensures code is broken into manageable components
* *Implements code structure validation and organization*

**CodeFixer**
* Automatically fixes common code issues across languages
* Handles syntax errors, formatting issues, and common bugs
* *Implements code analysis and repair with language-specific rules*

**PlanCreator**
* Creates detailed project plans with phases, steps, and tasks
* Establishes testing points and milestones
* Lists all libraries to be used
* *Implements template system with dynamic content generation*

## On-Demand Tools (Available When Needed)

### File and Code Management

**FileReader**
* Reads file contents from filesystem or URLs
* *Implements using standard file system APIs and HTTP clients*

**BatchReader**
* Batch reads multiple files simultaneously
* *Implements using parallel processing or async operations*

**FileWriter**
* Creates or overwrites files with new content
* *Implements with file system write operations and error handling*

**DirCreator**
* Creates new directories or ensures directories exist
* Creates nested directory structures
* *Implements using recursive directory creation with permissions handling*

**DirLister**
* Lists all files and directories in specified paths
* *Implements with file system enumeration and filtering*

**FileMover**
* Moves or renames files and directories
* *Implements with file system operations and proper error handling*

**InfoGetter**
* Gets detailed metadata about files and directories
* *Implements using file system stat operations*

**FileSearch**
* Finds files by name using case-insensitive matching
* *Implements with recursive directory scanning and pattern matching*

**CodeSearch**
* Searches for patterns within file contents
* *Implements using regex and contextual code parsing*

**BlockEditor**
* Makes targeted changes to specific sections of files
* *Implements using string replacement with context awareness*

**DiffApplier**
* Applies code changes in patch/diff format
* *Implements diff parsing and application algorithms*

**CodeFormatter**
* Formats code according to project style guidelines
* Supports multiple languages and formatting standards
* *Implements by integrating with language-specific formatters*

**MarkdownTool**
* Converts content between formats (HTML, plain text) to Markdown
* Ensures consistent Markdown styling
* *Implements with Markdown parsing libraries and transformation rules*

**DependencyTool**
* Adds, removes, and updates project dependencies
* Resolves version conflicts and ensures compatibility
* *Implements with package manager integration (npm, pip, etc.)*

**GitTool**
* Manages version control operations
* Creates commits, branches, and handles merges
* *Implements with Git command line or library integration*

**SchemaChecker**
* Validates data structures against defined schemas
* Ensures API payloads, configurations, and data models conform to specifications
* *Implements with JSON Schema or similar validation frameworks*

**VersionManager**
* Handles version numbers according to semantic versioning principles
* Manages changelog generation and release notes
* *Implements with Git history analysis and version parsing*

### UI and Design

**ComponentGen**
* Creates reusable UI components with specified styles
* *Implements using framework-specific component templates*

**PageGen**
* Creates complete web pages with various sections
* *Implements using composable section templates*

**ProjectGen**
* Generates entire UI projects with multiple pages and styling
* *Implements with project scaffolding and integration*

**FlowDesigner**
* Establishes user-friendly navigation flows
* *Implements using UX best practices and navigation patterns*

**ResponsiveUI**
* Ensures highly responsive, modern, clean UI/UX
* *Implements with responsive design patterns and validation*

**IconManager**
* Uses appropriate icon libraries instead of emojis
* *Implements with configurable icon system integration*

**TokenExtractor**
* Extracts design tokens from design systems or mockups
* Generates CSS variables, theme files, and design constants
* *Implements with design file parsing and token standardization*

**PWAConverter**
* Transforms web applications into PWAs
* Adds service workers, manifests, and offline capabilities
* *Implements with PWA best practices and service worker generation*

**BrowserChecker**
* Analyzes code for cross-browser compatibility issues
* Suggests fixes for browser-specific problems
* *Implements with compatibility databases and polyfill suggestions*

**EnhancementTool**
* Adds fallbacks and enhancements based on browser capabilities
* Ensures graceful degradation for older browsers
* *Implements with feature detection and conditional loading*

### Documentation and Content

**DocsGenerator**
* Creates READMEs, API docs, user guides, and developer guides
* *Implements using templating system with markdown generation*

**LegalCreator**
* Creates content for About, Policy, Terms sections
* *Implements using legally sound templates with customization*

**SEOTool**
* Includes relevant metadata and keywords on pages
* *Implements with SEO best practices and metadata generation*

**APIDocsTool**
* Automatically generates API documentation from code
* Creates interactive API reference documentation
* *Implements with code parsing and documentation standards like OpenAPI/Swagger*

**DocsUpdater**
* Keeps documentation in sync with code changes
* Updates examples and references automatically
* *Implements with code parsing and documentation patching*

**CMSConnector**
* Integrates with headless CMS platforms
* Sets up content models and retrieval methods
* *Implements with CMS API integrations*

**TranslationGen**
* Generates translation files for multiple locales
* *Implements with internationalization framework integration*

### System and Command Management

**CmdExecutor**
* Runs terminal commands with timeout capabilities
* *Implements using process spawning with timeout handling*

**OutputReader**
* Monitors output from running terminal sessions
* *Implements with process output stream handling*

**SessionKiller**
* Forces termination of running terminal sessions
* *Implements with process killing capabilities*

**SessionLister**
* Lists all active terminal sessions
* *Implements with process management tracking*

**ProcessLister**
* Lists all running processes on the system
* *Implements using system process enumeration*

**ProcessKiller**
* Terminates running processes by PID
* *Implements with system process termination capabilities*

**BrowserLaunch**
* Opens completed applications in the default browser
* *Implements using system browser launching capabilities*

**EnvManager**
* Sets up development, testing, and production environments
* Manages environment variables and configuration files
* *Implements with dotenv-style configuration handling*

### Database and API

**SchemaGen**
* Creates database schemas based on data requirements
* Generates migration scripts for schema changes
* *Implements with database modeling tools and ORM integration*

**GraphQLGen**
* Generates GraphQL schemas from data models
* Creates resolvers and type definitions
* *Implements with code generation from data models*

**ServiceBuilder**
* Creates boilerplate for microservice architectures
* Sets up inter-service communication and API gateways
* *Implements with service templates and orchestration tools*

**WasmTool**
* Incorporates WebAssembly modules for performance-critical code
* Handles the integration between JavaScript and WebAssembly
* *Implements with compile toolchains and binding generators*

### Testing and Quality

**TestManager**
* Establishes and manages testing checkpoints
* *Implements as event-driven checkpoints integrated with development*

**ErrorResolver**
* Attempts multiple approaches to fix errors
* Switches to fallback LLM after multiple failed attempts
* *Implements cascading error handling system*
* ***Requires API integration for fallback LLMs***

**AccessChecker**
* Ensures applications meet accessibility standards
* *Implements with WCAG guidelines checking and validation*

**TestGenerator**
* Creates unit, integration, and e2e tests automatically
* Ensures proper test coverage
* *Implements with test framework integration and code analysis*

**ComplexityTool**
* Identifies complex code that needs refactoring
* Provides metrics on code quality and maintainability
* *Implements with static analysis tools integration*

**DebugAssist**
* Helps identify and fix bugs by analyzing error messages and code
* Suggests potential solutions for common errors
* *Implements with error pattern recognition and solution database*

**PerfProfiler**
* Identifies performance bottlenecks in code
* Suggests optimizations for improved execution speed
* *Implements with runtime analysis and benchmark tools*

**CodeReviewer**
* Provides feedback on code quality and potential issues
* Suggests improvements based on best practices
* *Implements with linting tools and code analysis*

**MockDataGen**
* Creates realistic test data for development and testing
* Supports various data types and structures
* *Implements with data generation libraries and templates*

### Project Organization

**DirStructure**
* Creates organized folder structures for different project types
* *Implements using predefined templates with customization options*

**TaskReverter**
* Allows undoing of previous actions
* *Implements using a command pattern with history tracking*

**StateSnapshot**
* Creates and restores snapshots of project states
* *Implements using a version control-like system with differential storage*

**ChangeTracker**
* Records all changes made to project files
* *Implements as an observer pattern monitoring file system events*

**UserPrefs**
* Records user preferences and coding style choices
* *Implements as a learning system that evolves with user interactions*

**InfraGenerator**
* Creates cloud infrastructure specifications (Terraform, CloudFormation, etc.)
* Enables deployment to various cloud providers
* *Implements with IaC template generation*

## API-Dependent Tools

**ModelSwitcher**
* Switches to alternative LLMs after multiple failed attempts
* *Implements with model switching capabilities*
* ***Requires API integration for model switching***

**CollabSystem**
* Enables real-time collaboration features
* *Implements with collaborative editing protocols*
* ***Requires API integration for multi-user sessions***

**CodeAnalyzer**
* Provides AI-assisted refactoring suggestions
* *Implements with code analysis and pattern recognition*
* ***Requires API integration for deep code analysis***

**DeployTool**
* Connects with automated deployment systems
* *Implements with CI/CD pipeline integration*
* ***Requires API integration for deployment services***

**AIConnector**
* Integrates various AI models (text generation, image recognition, etc.)
* Provides unified interface for model selection and parameter configuration
* *Implements with API wrappers for different AI services*
* ***Requires API integration for external AI services***

## Tool Configuration

To disable specific on-demand tools:

1. Use the configuration command at the beginning of your conversation:
   ```
   /config disable-tools tool1,tool2,tool3
   ```

2. Disable tool categories:
   ```
   /config disable-category UI,Testing
   ```

3. Enable only specific tools:
   ```
   /config enable-only FileReader,CodeFormatter,BrowserLauncher
   ```

4. Reset to default configuration:
   ```
   /config reset
   ```

5. Save configuration for future use:
   ```
   /config save-as WebDevelopment
   ```

6. Load saved configuration:
   ```
   /config load WebDevelopment
   ```

This comprehensive tool suite enables OptimusCode MCP to generate complete full-stack applications based on user requests, with automated processes for all aspects of development.
