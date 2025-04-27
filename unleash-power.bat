@echo off
cd %~dp0
echo Unleashing OptimusCode MCP Power...
node unleash-power.js
if %ERRORLEVEL% NEQ 0 (
  echo Failed to unleash power! Error code: %ERRORLEVEL%
  exit /b %ERRORLEVEL%
)
echo Power unleashed successfully! OptimusCode MCP is ready to generate applications.
