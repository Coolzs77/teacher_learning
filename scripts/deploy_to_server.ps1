# UTF-8 BOM for PowerShell 5.1 compatibility
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host "  初中语文教资备考工作台 - 一键部署至阿里云服务器 (47.93.28.243)" -ForegroundColor Yellow
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host ""

$WorkspaceDir = (Get-Item $PSScriptRoot).Parent.FullName
$DocsDir = Join-Path $WorkspaceDir "docs"
$ServerIP = "47.93.28.243"
$ServerUser = "root"
$RemoteDir = "/var/www/teacher_learning"
$ArchiveName = "site_deploy.tar.gz"
$ArchivePath = Join-Path $WorkspaceDir $ArchiveName

if (-not (Test-Path $DocsDir)) {
    Write-Host "[错误] 未找到 docs 目录！" -ForegroundColor Red
    Pause
    exit 1
}

Write-Host "[1/4] 正在打包压缩 docs 目录为单个归档（加速上传）..." -ForegroundColor Green
Set-Location $WorkspaceDir
if (Test-Path $ArchivePath) { Remove-Item $ArchivePath -Force }

cmd.exe /c "tar -czf site_deploy.tar.gz -C docs ."

if (-not (Test-Path $ArchivePath)) {
    Write-Host "[错误] 打包失败！" -ForegroundColor Red
    Pause
    exit 1
}

$fileSizeMB = [math]::Round((Get-Item $ArchivePath).Length / 1MB, 2)
Write-Host "[2/4] 打包完成 (${fileSizeMB} MB)，正在高速传输至服务器..." -ForegroundColor Green
scp -o StrictHostKeyChecking=no $ArchivePath "${ServerUser}@${ServerIP}:/var/www/${ArchiveName}"

Write-Host "[3/4] 正在服务器端解压并发布至 $RemoteDir ..." -ForegroundColor Green
$cmd = "mkdir -p /var/www/teacher_learning && tar -xzf /var/www/site_deploy.tar.gz -C /var/www/teacher_learning && rm -f /var/www/site_deploy.tar.gz && chown -R www-data:www-data /var/www/teacher_learning && chmod -R 755 /var/www/teacher_learning && nginx -t && systemctl reload nginx"
ssh -o StrictHostKeyChecking=no "${ServerUser}@${ServerIP}" $cmd

Write-Host "[4/4] 清理本地临时压缩包..." -ForegroundColor Green
if (Test-Path $ArchivePath) { Remove-Item $ArchivePath -Force }

Write-Host ""
Write-Host "====================================================================" -ForegroundColor Green
Write-Host "  ★ 阿里云服务器部署成功！" -ForegroundColor Green
Write-Host "  阿里云服务器 200Mbps 极速公网访问地址：" -ForegroundColor White
Write-Host "  主入口 (80端口):   http://47.93.28.243/" -ForegroundColor Yellow
Write-Host "  备用口 (8899端口): http://47.93.28.243:8899/" -ForegroundColor Yellow
Write-Host "====================================================================" -ForegroundColor Green
Write-Host ""
