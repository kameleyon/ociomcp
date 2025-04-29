# OptimusCode MCP Tools Specification

## Automated Tools (Always Active)

1. **AutoContinue**
   - Task: Monitors context limits and triggers new chat sessions automatically
   - How it does it: Implements context window monitoring with token counting
   - Need which app: API integration for context window metrics

2. **ChatInitiator**
   - Task: Creates new chat sessions while maintaining project context
   - How it does it: Implements keyboard shortcut handling and context passing
   - Need which app: SessionState, ContextTracker

3. **ToneAdjuster**
   - Task: Uses natural, casual language with urban touches while remaining professional
   - How it does it: Implements tone-aware communication patterns
   - Need which app: None

4. **PathEnforcer**
   - Task: Ensures all content is written within specified project directories
   - How it does it: Implements path validation and directory enforcement
   - Need which app: Filesystem tools

5. **CodeSplitter**
   - Task: Keeps files under 500 lines
   - How it does it: Implements code structure validation and organization
   - Need which app: CodeFormatter

6. **CodeFixer**
   - Task: Automatically fixes common code issues across languages
   - How it does it: Implements code analysis and repair with language-specific rules
   - Need which app: Language-specific error fixers

7. **PlanCreator**
   - Task: Creates detailed project plans with phases, steps, and tasks
   - How it does it: Implements template system with dynamic content generation
   - Need which app: Documentation tools

## On-Demand Tools (Available When Needed)

### File and Code Management

8. **FileReader**
   - Task: Reads file contents from filesystem or URLs
   - How it does it: Implements using standard file system APIs and HTTP clients
   - Need which app: None

9. **BatchReader**
   - Task: Batch reads multiple files simultaneously
   - How it does it: Implements using parallel processing or async operations
   - Need which app: FileReader

10. **FileWriter**
    - Task: Creates or overwrites files with new content
    - How it does it: Implements with file system write operations and error handling
    - Need which app: None

11. **DirCreator**
    - Task: Creates new directories or ensures directories exist
    - How it does it: Implements using recursive directory creation with permissions handling
    - Need which app: Filesystem tools

12. **DirLister**
    - Task: Lists all files and directories in specified paths
    - How it does it: Implements with file system enumeration and filtering
    - Need which app: None

13. **FileMover**
    - Task: Moves or renames files and directories
    - How it does it: Implements with file system operations and proper error handling
    - Need which app: Filesystem tools

14. **InfoGetter**
    - Task: Gets detailed metadata about files and directories
    - How it does it: Implements using file system stat operations
    - Need which app: None

15. **FileSearch**
    - Task: Finds files by name using case-insensitive matching
    - How it does it: Implements with recursive directory scanning and pattern matching
    - Need which app: DirLister

16. **CodeSearch**
    - Task: Searches for patterns within file contents
    - How it does it: Implements using regex and contextual code parsing
    - Need which app: None

17. **BlockEditor**
    - Task: Makes targeted changes to specific sections of files
    - How it does it: Implements using string replacement with context awareness
    - Need which app: FileReader, FileWriter

18. **DiffApplier**
    - Task: Applies code changes in patch/diff format
    - How it does it: Implements diff parsing and application algorithms
    - Need which app: None

19. **CodeFormatter**
    - Task: Formats code according to project style guidelines
    - How it does it: Implements by integrating with language-specific formatters
    - Need which app: Prettier/ESLint integrations

20. **MarkdownTool**
    - Task: Converts content between formats to Markdown
    - How it does it: Implements with Markdown parsing libraries
    - Need which app: None

21. **DependencyTool**
    - Task: Adds/removes/updates project dependencies
    - How it does it: Implements with package manager integration
    - Need which app: npm, pip, or other package managers

22. **GitTool**
    - Task: Manages version control operations
    - How it does it: Implements with Git command line or library integration
    - Need which app: Git CLI

23. **SchemaChecker**
    - Task: Validates data structures against specifications
    - How it does it: Implements with JSON Schema validation
    - Need which app: None

24. **VersionManager**
    - Task: Handles semantic versioning principles
    - How it does it: Implements with Git history analysis
    - Need which app: GitTool

### UI and Design

25. **ComponentGen**
    - Task: Creates reusable UI components
    - How it does it: Implements using framework-specific templates
    - Need which app: React, Vue, or other framework templates

26. **PageGen**
    - Task: Creates complete web pages
    - How it does it: Implements using composable section templates
    - Need which app: ComponentGen

27. **ProjectGen**
    - Task: Generates entire UI projects
    - How it does it: Implements with project scaffolding
    - Need which app: ComponentGen, PageGen

28. **FlowDesigner**
    - Task: Establishes navigation flows
    - How it does it: Implements with UX best practices
    - Need which app: ComponentGen

29. **ResponsiveUI**
    - Task: Ensures responsive design
    - How it does it: Implements with responsive patterns
    - Need which app: None

30. **IconManager**
    - Task: Uses appropriate icon libraries
    - How it does it: Implements with configurable icon system
    - Need which app: Icon libraries (Font Awesome, etc.)

31. **TokenExtractor**
    - Task: Extracts design tokens
    - How it does it: Implements with design file parsing
    - Need which app: Design tools API

32. **PWAConverter**
    - Task: Transforms web apps into PWAs
    - How it does it: Implements service worker generation
    - Need which app: None

33. **BrowserChecker**
    - Task: Analyzes cross-browser compatibility
    - How it does it: Implements with compatibility databases
    - Need which app: None

34. **EnhancementTool**
    - Task: Adds browser-specific enhancements
    - How it does it: Implements with feature detection
    - Need which app: None

### Documentation and Content

35. **DocsGenerator**
    - Task: Creates documentation files
    - How it does it: Implements with templating system
    - Need which app: None

36. **LegalCreator**
    - Task: Creates legal content
    - How it does it: Implements with legally sound templates
    - Need which app: None

37. **SEOTool**
    - Task: Includes metadata and keywords
    - How it does it: Implements with SEO best practices
    - Need which app: None

38. **APIDocsTool**
    - Task: Generates API documentation
    - How it does it: Implements with OpenAPI/Swagger
    - Need which app: API documentation tools

39. **DocsUpdater**
    - Task: Keeps documentation in sync
    - How it does it: Implements with code parsing
    - Need which app: CodeSearch

40. **CMSConnector**
    - Task: Integrates with CMS platforms
    - How it does it: Implements with CMS API integrations
    - Need which app: CMS APIs

41. **TranslationGen**
    - Task: Generates translation files
    - How it does it: Implements with i18n framework integration
    - Need which app: i18n libraries

### System and Command Management

42. **CmdExecutor**
    - Task: Runs terminal commands
    - How it does it: Implements with process spawning
    - Need which app: System shell

43. **OutputReader**
    - Task: Monitors terminal output
    - How it does it: Implements with stream handling
    - Need which app: CmdExecutor

44. **SessionKiller**
    - Task: Terminates terminal sessions
    - How it does it: Implements with process killing
    - Need which app: ProcessLister

45. **SessionLister**
    - Task: Lists active terminal sessions
    - How it does it: Implements with process tracking
    - Need which app: None

46. **ProcessLister**
    - Task: Lists running processes
    - How it does it: Implements with system enumeration
    - Need which app: None

47. **ProcessKiller**
    - Task: Terminates processes by PID
    - How it does it: Implements with system termination
    - Need which app: None

48. **BrowserLaunch**
    - Task: Opens applications in browser
    - How it does it: Implements with system launching
    - Need which app: Default browser

49. **EnvManager**
    - Task: Manages environments
    - How it does it: Implements with config handling
    - Need which app: dotenv-style libraries

### Database and API

50. **SchemaGen**
    - Task: Creates database schemas
    - How it does it: Implements with modeling tools
    - Need which app: ORM tools

51. **GraphQLGen**
    - Task: Generates GraphQL schemas
    - How it does it: Implements with code generation
    - Need which app: GraphQL tools

52. **ServiceBuilder**
    - Task: Creates microservice boilerplate
    - How it does it: Implements with service templates
    - Need which app: Orchestration tools

53. **WasmTool**
    - Task: Incorporates WebAssembly modules
    - How it does it: Implements with compile toolchains
    - Need which app: WebAssembly compilers

### Testing and Quality

54. **TestManager**
    - Task: Manages testing checkpoints
    - How it does it: Implements event-driven checkpoints
    - Need which app: None

55. **ErrorResolver**
    - Task: Attempts multiple error fixes
    - How it does it: Implements cascading error handling
    - Need which app: Fallback LLM APIs

56. **AccessChecker**
    - Task: Ensures accessibility standards
    - How it does it: Implements with WCAG guidelines
    - Need which app: None

57. **TestGenerator**
    - Task: Creates automated tests
    - How it does it: Implements with test framework integration
    - Need which app: Testing frameworks

58. **ComplexityTool**
    - Task: Identifies complex code
    - How it does it: Implements with static analysis
    - Need which app: Linting tools

59. **DebugAssist**
    - Task: Helps identify and fix bugs
    - How it does it: Implements with error pattern recognition
    - Need which app: None

60. **PerfProfiler**
    - Task: Identifies performance bottlenecks
    - How it does it: Implements with runtime analysis
    - Need which app: Benchmark tools

61. **CodeReviewer**
    - Task: Provides code quality feedback
    - How it does it: Implements with linting tools
    - Need which app: Linting integrations

62. **MockDataGen**
    - Task: Creates test data
    - How it does it: Implements with data generation libraries
    - Need which app: None

### Project Organization

63. **DirStructure**
    - Task: Creates folder structures
    - How it does it: Implements with predefined templates
    - Need which app: None

64. **TaskReverter**
    - Task: Allows undoing actions
    - How it does it: Implements command pattern with history
    - Need which app: None

65. **StateSnapshot**
    - Task: Creates project state snapshots
    - How it does it: Implements differential storage
    - Need which app: None

66. **ChangeTracker**
    - Task: Records file changes
    - How it does it: Implements observer pattern
    - Need which app: None

67. **UserPrefs**
    - Task: Records user preferences
    - How it does it: Implements learning system
    - Need which app: None

68. **InfraGenerator**
    - Task: Creates cloud infrastructure specs
    - How it does it: Implements IaC template generation
    - Need which app: Terraform, CloudFormation

## API-Dependent Tools

69. **ModelSwitcher**
    - Task: Switches to alternative LLMs
    - How it does it: Implements model switching capabilities
    - Need which app: API integration for model switching

70. **CollabSystem**
    - Task: Enables real-time collaboration
    - How it does it: Implements collaborative editing protocols
    - Need which app: Multi-user session APIs

71. **CodeAnalyzer**
    - Task: Provides refactoring suggestions
    - How it does it: Implements code analysis and pattern recognition
    - Need which app: Deep code analysis APIs

72. **DeployTool**
    - Task: Connects with deployment systems
    - How it does it: Implements CI/CD pipeline integration
    - Need which app: Deployment service APIs

73. **AIConnector**
    - Task: Integrates various AI models
    - How it does it: Implements API wrappers for AI services
    - Need which app: External AI service APIs

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