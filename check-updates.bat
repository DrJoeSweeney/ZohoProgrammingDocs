@echo off
REM Zoho Documentation Update Checker - Windows Batch Script
REM
REM Usage:
REM   check-updates.bat                  - Check all products
REM   check-updates.bat crm books desk   - Check specific products
REM   check-updates.bat --full-report    - Generate detailed report

echo.
echo ========================================
echo  Zoho Documentation Update Checker
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM Check if Playwright is installed
if not exist "node_modules\playwright" (
    echo WARNING: Playwright not found. Installing...
    echo.
    call npm install playwright
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Failed to install Playwright
        echo.
        pause
        exit /b 1
    )
    echo.
    echo Playwright installed successfully!
    echo.
)

REM Run the update checker with all arguments passed through
node update-zoho-docs.js %*

echo.
echo ========================================
echo Check complete! Review the report above.
echo ========================================
echo.

REM If running without arguments, pause so user can see results
if "%~1"=="" (
    pause
)
