@echo off
echo OptimusCode MCP - Auto-Fix Tool
echo ==============================
echo.
echo This tool will automatically fix TypeScript errors in your project.
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
  echo ERROR: Node.js is not installed or not in the PATH.
  echo Please install Node.js and try again.
  exit /b 1
)

REM Activate the auto-fix tool
echo Activating auto-fix tool...
node activate-auto-fix.js
if %ERRORLEVEL% neq 0 (
  echo ERROR: Failed to activate auto-fix tool.
  exit /b 1
)

REM Run the auto-fix tool
echo Running auto-fix tool...
node run-auto-fix.js
if %ERRORLEVEL% neq 0 (
  echo ERROR: Failed to run auto-fix tool.
  exit /b 1
)

echo.
echo Auto-fix tool completed successfully!
echo Results have been saved to auto-fix-results.txt
echo.
echo Fixed file saved to test-typescript-errors.ts.fixed
echo.
echo Press any key to exit...
pause >nul
