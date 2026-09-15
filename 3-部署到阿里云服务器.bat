@echo off
chcp 65001 >nul
title 部署到阿里云服务器 - 初中语文教资备考工作台
cls
echo ====================================================================
echo   初中语文教师资格证面试（10分钟试讲专项）备战工作台
echo   【管理员专属·一键极速部署至阿里云服务器】
echo ====================================================================
echo.
echo   目标服务器: 47.93.28.243 (阿里云轻量应用服务器 - 200Mbps 峰值带宽)
echo   目标目录:   /var/www/teacher_learning
echo.
echo   [提示] 此操作将把本地最新的 158 篇课文、板书、逐字稿及教材 PDF 同步至服务器。
echo   琪琪或考生在任何地方只需打开浏览器即可 0.2 秒极速研读。
echo ====================================================================
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\deploy_to_server.ps1"

echo.
echo 请按任意键退出...
pause >nul
