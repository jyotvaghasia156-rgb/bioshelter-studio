# BioShelter Studio - Auto Push to GitHub for jyotvaghasia156-rgb
Set-Location -Path $PSScriptRoot

Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host "  BioShelter Studio - Auto Push to GitHub (jyotvaghasia156-rgb)" -ForegroundColor Cyan
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host ""

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "[!] Git is not installed on this system." -ForegroundColor Yellow
    Write-Host "Please download Git from: https://git-scm.com/download/win" -ForegroundColor White
    Write-Host "Once installed, run this script again." -ForegroundColor White
    Read-Host "Press Enter to exit..."
    exit 1
}

Write-Host "[1/4] Initializing Git Repository..." -ForegroundColor Green
if (-not (Test-Path ".git")) {
    git init
    git branch -M main
}

Write-Host "[2/4] Staging files..." -ForegroundColor Green
git add .

Write-Host "[3/4] Creating initial commit..." -ForegroundColor Green
git commit -m "Initial release of BioShelter Studio - Thermal Comfort & Shelter Modeling Suite"

Write-Host "[4/4] Setting remote origin..." -ForegroundColor Green
git remote remove origin 2>$null
git remote add origin https://github.com/jyotvaghasia156-rgb/bioshelter-studio.git

Write-Host ""
Write-Host "Pushing to https://github.com/jyotvaghasia156-rgb/bioshelter-studio.git..." -ForegroundColor Yellow
Write-Host "(Sign into your GitHub account jyotvaghasia156-rgb if prompted)" -ForegroundColor Gray
git push -u origin main

Write-Host ""
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host "  Successfully published to GitHub!" -ForegroundColor Green
Write-Host "  https://github.com/jyotvaghasia156-rgb/bioshelter-studio" -ForegroundColor Cyan
Write-Host "=====================================================================" -ForegroundColor Cyan
Read-Host "Press Enter to finish..."
