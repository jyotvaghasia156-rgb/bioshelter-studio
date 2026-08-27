@echo off
title BioShelter Studio - GitHub Publisher
color 0b
echo =====================================================================
echo    BioShelter Studio - Automated GitHub Publisher
echo    Target: https://github.com/jyotvaghasia156-rgb/bioshelter-studio
echo =====================================================================
echo.

cd /d "%~dp0"

set "GIT_EXE=%~dp0tools\mingit\cmd\git.exe"
if not exist "%GIT_EXE%" (
    where git >nul 2>nul
    if %errorlevel% equ 0 (
        set "GIT_EXE=git"
    ) else (
        echo [ERROR] Git was not found.
        pause
        exit /b 1
    )
)

echo [1/4] Checking local Git repository...
if not exist .git (
    "%GIT_EXE%" init
    "%GIT_EXE%" branch -M main
)

"%GIT_EXE%" config user.name "jyotvaghasia156-rgb"
"%GIT_EXE%" config user.email "jyotvaghasia156@users.noreply.github.com"

echo [2/4] Staging all files...
"%GIT_EXE%" add .

echo [3/4] Committing code...
"%GIT_EXE%" commit -m "Initial release of BioShelter Studio platform"

echo [4/4] Configuring remote and pushing...
"%GIT_EXE%" remote remove origin >nul 2>nul
"%GIT_EXE%" remote add origin https://github.com/jyotvaghasia156-rgb/bioshelter-studio.git

echo.
echo =====================================================================
echo  Enter your GitHub Token or Password when prompted below:
echo  (Tip: If you use a Personal Access Token, paste it as the password)
echo =====================================================================
echo.

"%GIT_EXE%" push -u origin main

echo.
if %errorlevel% equ 0 (
    color 0a
    echo =====================================================================
    echo  [SUCCESS] All files published successfully to:
    echo  https://github.com/jyotvaghasia156-rgb/bioshelter-studio
    echo =====================================================================
) else (
    color 0c
    echo =====================================================================
    echo  [NOTICE] If authentication failed or the repository does not exist yet:
    echo  1. Create the repository at: https://github.com/new (Name: bioshelter-studio)
    echo  2. Generate a token at: https://github.com/settings/tokens (repo scope)
    echo  3. Re-run this script and paste your token as the password.
    echo =====================================================================
)
echo.
pause
