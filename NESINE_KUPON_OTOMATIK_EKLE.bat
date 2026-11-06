@echo off
setlocal
cd /d "%~dp0"
title SportAnaliz Pro - Nesine 00:15 Otomatik Kupon Servisi

:: ELECTRON_RUN_AS_NODE ortam değişkenini temizle
set ELECTRON_RUN_AS_NODE=
set ELECTRON_NO_ATTACH_CONSOLE=
set NESINE_BACKGROUND=1

echo ===================================================================
echo   SPORTANALIZ PRO - NESINE 00:15 OTOMATIK SERVER SERVISI
echo   Tarih: %date% ^| Saat: %time%
echo   Uye: 14410079556
echo ===================================================================
echo.

:: 1. Canli bulteni cek ve reytingli seans kuponlarini hazirla
echo [1/2] Gunun canli bulteni ve reytingli seans kuponlari hazirlaniyor...
call node scripts\build_and_sync_all_data.js

echo.
:: 2. Nesine hesabina arka planda otomatik kaydet
echo [2/2] Nesine hesabina kuponlar arka planda otonom kaydediliyor...
if exist "node_modules\electron\dist\electron.exe" (
    call "node_modules\electron\dist\electron.exe" "scripts\nesine_login_and_add_coupons.js" --background
) else (
    call npx electron scripts\nesine_login_and_add_coupons.js --background
)

echo.
echo ===================================================================
echo   [TAMAMLANDI] Nesine kuponlari hesaba islendi: %date% %time%
echo ===================================================================
timeout /t 5 >nul 2>&1
