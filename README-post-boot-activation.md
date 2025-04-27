# Post-Boot Activation System for Tools

## Overview

The Post-Boot Activation System is a mechanism that automatically activates tools after the server has fully started. This ensures that tools are properly initialized without blocking server startup.

## Key Features

- **Dynamic Tool Loading**: Tools are loaded dynamically based on their configuration in `tools-config.json` and `ocioconfig.json`
- **Activation Statuses**: Tools can have three possible activation states:
  - **Activated**: Tool has an `activate()` function that was successfully called
  - **Fallback**: Tool has no `activate()` function, so it runs in passive mode
  - **Failed**: Tool activation failed with a specific error
- **Configuration Merging**: Settings are merged from both configuration files
- **Error Handling**: Robust error handling ensures server stability even if tool activation fails
- **Activation Reports**: Detailed activation reports are generated with tool statuses

## Implementation Details

### Directory Structure

```
/lib
  /postBootActivator.js   - Main activation system
/tools
  /ToolName               - Each tool has its own directory
    /index.js             - Main entry point for the tool
```

### Tool Configuration

Tools are configured in two places:

1. **tools-config.json**: Main tool configuration
   ```json
   {
     "tools": {
       "ToolName": {
         "enabled": true,
         "settings": {
           "settingName": "value"
         }
       }
     }
   }
   ```

2. **ocioconfig.json**: Additional tool configuration (in the `mcp.tools` section)

### Tool Activation API

Tools can provide an `activate()` function which is called during activation:

```javascript
/**
 * Activate function for the tool
 * @param {Object} settings - Settings from configuration
 * @returns {Promise<boolean>} - Success status
 */
export async function activate(settings) {
  console.log(`Tool activating with settings:`, settings);
  
  // Tool initialization code here
  
  return true;
}
```

If a tool doesn't have an `activate()` function, it still works in "passive mode".

### Server Integration

The activation system is integrated into the server startup process:

```javascript
// In index.ts
import { setupPostBootActivation } from '../lib/postBootActivator.js';

// Inside runServer function, after server.connect()
setupPostBootActivation();
console.error("Post-boot tool activation scheduled");
```

## Activation Results

The activation process produces detailed results:

```
[POST-BOOT ACTIVATOR] Activation Summary:
Tool Name         | Status
------------------|----------------
SnapshotCreator   | Activated
CodeFixer         | Fallback
ResponsiveUI      | Failed
```

## Usage Examples

### Adding a New Tool

1. Create a directory for your tool in `/tools`
2. Implement an `index.js` file with an optional `activate()` function
3. Add the tool to `tools-config.json` with `enabled: true`

### Tool with Activation

```javascript
// /tools/MyTool/index.js
export async function activate(settings) {
  console.log('MyTool activating with settings:', settings);
  // Setup and initialize tool resources
  return true;
}

export function toolFunction() {
  // Tool functionality
}
```

### Tool without Activation (Passive Mode)

```javascript
// /tools/PassiveTool/index.js
export function toolFunction() {
  // Tool functionality that doesn't need activation
}
```

## Troubleshooting

- **Missing activate() function**: This is normal for passive tools - they'll work in fallback mode
- **Activation failed errors**: Check the specific error message and fix the tool's dependencies
- **Tool directory not found**: Ensure the tool directory name matches exactly the name in configuration
