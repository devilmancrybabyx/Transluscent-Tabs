@echo off
title TranslucentTabs Studio
cd /d "%~dp0"
echo Starting TranslucentTabs Studio...
python app.py
if %errorlevel% neq 0 (
    echo.
    echo Python launch failed. Press any key to exit.
    pause >nul
)
