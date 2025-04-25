# OptimusCode MCP Server Tools

This document provides a comprehensive list of all tools available in the OptimusCode MCP server, organized by category. Each tool is described with its purpose, functionality, and input parameters.

## Filesystem Tools

### read_file
**Purpose:** Read the complete contents of a file from the file system or a URL.
**Description:** This tool allows Claude to access and read the contents of files in the user's filesystem. It can handle both text files and URLs, making it versatile for accessing local and remote content.
**Parameters:**
- `path`: The path to the file to be read (required)
- `isUrl`: Boolean flag indicating if the path is a URL (optional)

### read_multiple_files
**Purpose:** Read the contents of multiple files simultaneously.
**Description:** This tool enables batch reading of multiple files, improving efficiency when Claude needs to analyze several files at once. Each file's content is returned with its path as a reference.
**Parameters:**
- `paths`: Array of file paths to read (required)

### write_file
**Purpose:** Completely replace file contents.
**Description:** This tool allows Claude to create new files or overwrite existing ones with new content. It's particularly useful for large changes or when creating files from scratch.
**Parameters:**
- `path`: The path where the file should be written (required)
- `content`: The content to write to the file (required)

### create_directory
**Purpose:** Create a new directory or ensure a directory exists.
**Description:** This tool allows Claude to create directory structures needed for organizing files. It can create multiple nested directories in one operation.
**Parameters:**
- `path`: The path of the directory to create (required)

### list_directory
**Purpose:** Get a detailed listing of all files and directories in a specified path.
**Description:** This tool provides Claude with the ability to explore directory contents, helping it understand the structure of projects and locate relevant files.
**Parameters:**
- `path`: The path of the directory to list (required)
- `recursive`: Boolean flag to list subdirectories recursively (optional)

### move_file
**Purpose:** Move or rename files and directories.
**Description:** This tool enables Claude to reorganize files and directories by moving them to new locations or renaming them.
**Parameters:**
- `source`: The source path of the file or directory (required)
- `destination`: The destination path (required)

### get_file_info
**Purpose:** Retrieve detailed metadata about a file or directory.
**Description:** This tool provides Claude with information about files and directories, including size, creation time, last modified time, permissions, and type.
**Parameters:**
- `path`: The path of the file or directory (required)

### search_files
**Purpose:** Find files by name using case-insensitive substring matching.
**Description:** This tool helps Claude locate files across directories based on their names, making it easier to find relevant files in large projects.
**Parameters:**
- `path`: The starting path for the search (required)
- `pattern`: The search pattern (required)
- `timeoutMs`: Maximum time in milliseconds for the search (optional)

### search_code
**Purpose:** Search for text/code patterns within file contents.
**Description:** This tool enables Claude to find specific code patterns, function definitions, or text within files, helping it understand and navigate codebases.
**Parameters:**
- `path`: The starting path for the search (required)
- `pattern`: The search pattern (required)
- `filePattern`: Pattern to filter files (optional)
- `contextLines`: Number of context lines to include (optional)
- `timeoutMs`: Maximum time in milliseconds for the search (optional)

### edit_block
**Purpose:** Apply surgical text replacements to files.
**Description:** This tool allows Claude to make precise, targeted changes to specific sections of files without modifying the entire file. It's ideal for small to medium changes.
**Parameters:**
- `path`: The path of the file to edit (required)
- `searchBlock`: The text to search for (required)
- `replaceBlock`: The text to replace with (required)

## Command Execution Tools

### execute_command
**Purpose:** Execute a terminal command with timeout.
**Description:** This tool allows Claude to run shell commands on the user's system, enabling it to perform system operations, run build processes, start servers, and more.
**Parameters:**
- `command`: The command to execute (required)
- `timeoutMs`: Maximum time in milliseconds for the command to run (optional)

### read_output
**Purpose:** Read new output from a running terminal session.
**Description:** This tool enables Claude to monitor the output of long-running commands, helping it track progress and respond to command results.
**Parameters:**
- `sessionId`: The ID of the terminal session (required)

### force_terminate
**Purpose:** Force terminate a running terminal session.
**Description:** This tool allows Claude to stop long-running or stuck processes, ensuring system resources are freed up when commands are no longer needed.
**Parameters:**
- `sessionId`: The ID of the terminal session to terminate (required)

### list_sessions
**Purpose:** List all active terminal sessions.
**Description:** This tool helps Claude keep track of all running terminal sessions, allowing it to manage multiple concurrent processes.
**Parameters:** None

### list_processes
**Purpose:** List all running processes.
**Description:** This tool provides Claude with information about all processes running on the system, including their PIDs, names, CPU usage, and memory usage.
**Parameters:** None

### kill_process
**Purpose:** Terminate a running process by PID.
**Description:** This tool allows Claude to stop specific processes using their Process ID, providing fine-grained control over system resources.
**Parameters:**
- `pid`: The Process ID to terminate (required)

## Context Management Tools

### track_context_size
**Purpose:** Track the current context size and determine if a new chat should be created.
**Description:** This tool helps manage the context window by tracking token usage and determining when a conversation should be split into multiple sessions.
**Parameters:**
- `message`: The message to track (required)

### trigger_continuation
**Purpose:** Trigger a new chat with the current context preserved.
**Description:** This tool enables seamless transitions between chat sessions by preserving context and state, ensuring continuity in long conversations.
**Parameters:**
- `state`: The state to preserve (required)
- `summary`: A summary of the current context (required)

## Project Planning Tools

### generate_project_plan
**Purpose:** Generate a detailed project plan with phases and tasks based on requirements.
**Description:** This tool helps Claude create comprehensive project plans with structured phases and tasks, timelines, and resource allocations.
**Parameters:**
- `name`: Project name (required)
- `description`: Project description (required)
- `type`: Project type (web-application, mobile-app, api-service, desktop-application, custom) (required)
- `features`: Array of project features (required)
- `timeline`: Object with optional startDate and endDate (optional)
- `teamSize`: Number of team members (optional)
- `customPhases`: Array of custom phase names (optional)

### visualize_project_plan
**Purpose:** Visualize a project plan in different formats.
**Description:** This tool allows Claude to present project plans in various formats (markdown, Gantt charts, HTML) for better visualization and understanding.
**Parameters:**
- `planId`: ID of the project plan to visualize (required)
- `format`: Output format (markdown, gantt, html) (optional, defaults to markdown)

### update_task_status
**Purpose:** Update the status of a task in a project plan.
**Description:** This tool enables Claude to track project progress by updating the status of individual tasks within a project plan.
**Parameters:**
- `planId`: ID of the project plan (required)
- `phaseId`: ID of the phase containing the task (required)
- `taskId`: ID of the task to update (required)
- `status`: New status (not-started, in-progress, completed) (required)

## UI Generation Tools

### generate_component
**Purpose:** Generate a UI component with specified options.
**Description:** This tool allows Claude to create reusable UI components for web applications, with various styles and properties.
**Parameters:**
- `name`: Component name (required)
- `style`: Component style (basic, card, form, list, table, hero, feature, pricing, cta, footer) (optional)
- `props`: Array of component properties (optional)
- `description`: Component description (optional)

### generate_page
**Purpose:** Generate a UI page with specified options.
**Description:** This tool enables Claude to create complete web pages with various sections and metadata, suitable for different purposes.
**Parameters:**
- `name`: Page name (required)
- `type`: Page type (landing, dashboard, auth, profile, settings, documentation, blog, product, checkout, error) (optional)
- `sections`: Array of page sections with type, name, and props (optional)
- `meta`: Object with title, description, and keywords (optional)

### generate_project
**Purpose:** Generate a complete UI project with specified options.
**Description:** This tool allows Claude to create entire web application projects with multiple pages, styling frameworks, and database integrations.
**Parameters:**
- `name`: Project name (required)
- `type`: Project type (landing-page, marketing-site, dashboard, e-commerce, blog, documentation, portfolio, saas) (optional)
- `framework`: Frontend framework (react-vite, next-js, remix, gatsby) (optional)
- `styling`: CSS approach (tailwind, styled-components, emotion, css-modules) (optional)
- `database`: Database type (supabase, firebase, mongodb, postgresql, mysql, none) (optional)
- `pages`: Array of pages with name, type, and path (optional)

## Project Organization Tools

### generate_directory_structure
**Purpose:** Generate a directory structure for a project.
**Description:** This tool helps Claude create organized folder structures for different types of projects, following best practices and conventions.
**Parameters:**
- `name`: Project name (required)
- `type`: Project type (web-app, mobile-app, api, library, monorepo, desktop-app, static-site, documentation) (required)
- `framework`: Framework to use (react, next-js, vue, angular, express, nest-js, django, flask, spring-boot, laravel, electron, react-native, flutter) (optional)
- `features`: Array of project features (optional)

### generate_documentation
**Purpose:** Generate documentation for a project.
**Description:** This tool enables Claude to create various types of documentation for projects, helping users understand and use the software.
**Parameters:**
- `projectName`: Name of the project (required)
- `projectDescription`: Description of the project (required)
- `type`: Documentation type (readme, api-docs, user-guide, developer-guide, contributing, code-of-conduct, changelog) (required)
- `format`: Output format (markdown, html, asciidoc, rst) (optional)

### analyze_file_sizes
**Purpose:** Analyze file sizes and suggest optimizations.
**Description:** This tool helps Claude identify large files and suggest ways to optimize them, improving application performance.
**Parameters:**
- `files`: Array of file objects with path, size, and optional lastModified (required)

## Advanced Features Tools

### track_version_changes
**Purpose:** Track changes to files for version control.
**Description:** This tool allows Claude to record changes made to files, enabling version tracking and history management.
**Parameters:**
- `path`: Path of the file (required)
- `type`: Change type (add, modify, delete, rename) (required)
- `content`: New content (optional)
- `oldContent`: Previous content (optional)
- `oldPath`: Previous path (for rename operations) (optional)
- `message`: Change message (optional)

### create_snapshot
**Purpose:** Create a snapshot of the current state.
**Description:** This tool enables Claude to save the current state of a project, creating a point-in-time snapshot that can be reverted to later.
**Parameters:**
- `name`: Snapshot name (required)
- `description`: Snapshot description (optional)
- `author`: Snapshot author (optional)
- `tags`: Array of tags (optional)

### revert_to_snapshot
**Purpose:** Revert to a previous snapshot.
**Description:** This tool allows Claude to restore a project to a previously saved state, undoing changes made since the snapshot was created.
**Parameters:**
- `snapshotId`: ID of the snapshot to revert to (required)

### generate_content
**Purpose:** Generate content for various purposes.
**Description:** This tool helps Claude create different types of content, such as legal documents, SEO text, marketing copy, documentation, emails, and social media posts.
**Parameters:**
- `type`: Content type (legal, seo, marketing, documentation, email, social) (required)
- `subtype`: Content subtype (required)
- `company`: Company information with name, description, optional website and industry (optional)
- `website`: Website information with URL, title, description, and optional keywords (optional)
- `legal`: Legal information with optional jurisdiction, effectiveDate, and contactEmail (optional)

### generate_translations
**Purpose:** Generate translation files for multiple locales.
**Description:** This tool enables Claude to create translations for text in multiple languages, supporting internationalization of applications.
**Parameters:**
- `keys`: Array of translation keys (required)
- `locales`: Array of locale codes (required)
- `baseTranslations`: Record of base translations (optional)