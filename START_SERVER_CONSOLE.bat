@echo off
setlocal
cd /d "%~dp0"
title SportAnaliz Pro — 7/24 Otonom Sunucu Konsolu

echo ===================================================================
echo   SPORTANALIZ PRO — 7/24 OTONOM NESINE SUNUCUSU
echo   Her Gece Saat 00:15'te Otonom Kupon Ekler
echo   Web Panel: http://localhost:3333
echo ===================================================================
echo.
node scripts\server_daemon.js
pause

