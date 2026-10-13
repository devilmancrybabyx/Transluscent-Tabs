@echo off
title TranslucentTabs Studio (Administrator)
cd /d "%~dp0"

:: Check for administrative rights and elevate if needed
fsutil dirty query %systemdrive% >nul 2>&1
if %errorlevel% neq 0 (
    echo Requesting Administrator privileges...
    powershell -NoProfile -Command "Start-Process cmd.exe -ArgumentList '/c cd /d \"%~dp0\" && \"%~s0\"' -Verb RunAs"
    exit /b
)

echo Starting TranslucentTabs Studio with Administrator privileges...
python app.py
if %errorlevel% neq 0 (
    echo.
    echo Launch failed. Press any key to exit.
    pause >nul
)
