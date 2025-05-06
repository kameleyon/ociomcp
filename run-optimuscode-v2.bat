@echo off
cd %~dp0
echo Starting OptimusCode MCP server with comprehensive development assistant functionality... 1>&2
echo Phase 1 (Core Infrastructure), Phase 2 (Project Planning), Phase 3 (Testing), Phase 4 (UI/UX), Phase 5 (Project Organization), and Phase 6 (Advanced Features) completed! 1>&2
echo Memory System, Performance Optimization, and Icon Library Integration from Phase 7 (Enhanced Development Experience) now implemented! 1>&2
echo Only remaining features from Phase 7 and Phase 8 (Distribution and Community) remain on the roadmap! 1>&2

echo Activating all configured tools from tools-config.json... 1>&2
node activate-tools.js activate all

echo Setting environment variables... 1>&2
set ENCRYPTION_KEY=optimuscode-mcp-encryption-key
set ENABLE_AUTOMATED_TOOLS=true

echo Starting MCP Server... 1>&2
node dist/src/index.js