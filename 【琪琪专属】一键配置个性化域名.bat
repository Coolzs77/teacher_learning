@echo off
chcp 65001 >nul
title 为琪琪电脑一键配置专属域名 (qiqi.study)
cls

:: 检查并自动获取管理员权限
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [提示] 正在请求管理员权限以配置系统 hosts 域名解析...
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

echo ====================================================================
echo   初中语文教师资格证面试（10分钟试讲专项）备战工作台
echo   【琪琪专属·一键配置个性化域名免 IP 访问】
echo ====================================================================
echo.
echo   此脚本将为琪琪的电脑注入专属免记 IP 域名：
echo   ★ 访问网址：http://qiqi.study:8099/
echo   ★ 对应服务器：47.93.28.243 (阿里云 200Mbps 高速机房)
echo   ★ 永久免费、无需备案、不花一分钱！
echo.
echo ====================================================================
echo.

set "HOSTS_FILE=%WINDIR%\System32\drivers\etc\hosts"
set "IP=47.93.28.243"
set "DOMAIN=qiqi.study"

findstr /i "%DOMAIN%" "%HOSTS_FILE%" >nul 2>&1
if %errorlevel% equ 0 (
    echo [状态] 琪琪的电脑已经配置过 %DOMAIN% 域名，无需重复添加。
) else (
    echo [1/2] 正在向系统写入域名解析规则...
    echo. >> "%HOSTS_FILE%"
    echo %IP% %DOMAIN% >> "%HOSTS_FILE%"
    echo [成功] 已成功将 %DOMAIN% 绑定至 %IP%！
)

echo [2/2] 正在刷新本地 DNS 缓存...
ipconfig /flushdns >nul

echo.
echo ====================================================================
echo   ★ 恭喜！专属域名配置完成！
echo   现在您可以直接在浏览器中打开：http://qiqi.study:8099/
echo ====================================================================
echo.

start http://qiqi.study:8099/

pause
