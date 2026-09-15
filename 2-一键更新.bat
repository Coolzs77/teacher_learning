@echo off
chcp 65001 >nul
title 初中语文教资备考工作台 - 琪琪专属一键极速同步
cls
echo ====================================================================
echo   欢迎使用：初中语文教师资格证面试（10分钟试讲专项）备战工作台
echo   【琪琪专属 · 一键同步最新更新】
echo ====================================================================
echo.
echo   [1/2] 正在连接云端仓库检查最新教学设计、板书与课文更新...
echo   [2/2] 智能按需同步最新发布包...
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\sync_update.ps1"

pause
