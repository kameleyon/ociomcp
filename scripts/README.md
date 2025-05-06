# OptimusCode MCP Server Configuration

This directory contains scripts for configuring the OptimusCode MCP server for Claude Desktop.

## Recent Changes

- Disabled the AutoContinue and ChatInitiator tools as requested
- All other MCP tools remain with their default settings
- The server is now configured to focus on app generation functionality

## Tool Statuses

- **AutoContinue**: Disabled
- **ChatInitiator**: Disabled
- All other tools: Enabled with default settings

## Configuration Path

The main configuration file is located at:
`C:\Users\Administrator\myAPP\ociomcp\ocioconfig.json`

## Scripts

- `disable-tools.js`: Script to disable specific tools in the MCP server

## Development Guidelines

- No emoji usage allowed; use Lucide React icons or other icon libraries
- Keep files under 500 lines
- Build apps in small manageable components
- Ensure TypeScript correctness
- Avoid unnecessary test environments, files, folders, scripts, examples, simulations, reports, interfaces, graphs, or UI
- Always store API keys in .env files, never hardcode them
- All requests and code should be contained within this directory

## Next Steps

To modify other settings or enable/disable additional tools, you can edit the existing script or create new ones following the same pattern.
