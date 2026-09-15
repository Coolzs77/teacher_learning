@echo off
chcp 65001 >nul
title 初中语文教资面试备考台 - 琪琪专属一键同步更新器
cls
echo ====================================================================
echo   欢迎使用：初中语文教师资格证面试（10分钟试讲专项）备战工作台
echo   【琪琪专属 · 一键极速同步更新】
echo ====================================================================
echo.
echo   [1/2] 正在连接 GitHub 远程仓库获取最新教学设计与修改...
echo   [2/2] 自动同步覆盖本地离线文件...
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\sync_update.ps1"

pause
