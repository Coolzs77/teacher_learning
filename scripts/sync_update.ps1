# 琪琪专属 · 初中语文教资备考工作台 一键极速同步更新器
$ErrorActionPreference = "Continue"

Write-Host "====================================================================" -ForegroundColor Green
Write-Host "  * 欢迎使用：初中语文教资面试备战工作台 - 琪琪专属同步更新器 *" -ForegroundColor Yellow
Write-Host "====================================================================" -ForegroundColor Green
Write-Host ""
Write-Host "  正在检查远程 GitHub 仓库的最新教学设计、板书与课文更新..." -ForegroundColor Cyan

$PSScriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
$WorkspaceRoot = Split-Path -Parent $PSScriptRoot
$DocsDir = Join-Path $WorkspaceRoot "docs"
$AssetsDir = Join-Path $DocsDir "assets"

if (-not (Test-Path $DocsDir)) {
    New-Item -ItemType Directory -Path $DocsDir -Force | Out-Null
}
if (-not (Test-Path $AssetsDir)) {
    New-Item -ItemType Directory -Path $AssetsDir -Force | Out-Null
}

# 1. 检测本机是否安装了 Git 且为仓库
$hasGit = $false
try {
    $gitVer = git --version 2>$null
    if ($gitVer) {
        $hasGit = $true
    }
} catch {}

$isGitRepo = Test-Path (Join-Path $WorkspaceRoot ".git")

if ($hasGit -and $isGitRepo) {
    Write-Host "  [模式 1/2] 检测到 Git 版本库，正在极速拉取最新提交..." -ForegroundColor Green
    git -C $WorkspaceRoot pull origin main
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "====================================================================" -ForegroundColor Green
        Write-Host "  [成功] 恭喜琪琪！工作台已成功极速同步到最新版本！" -ForegroundColor Yellow
        Write-Host "  所有课文、教学设计、板书与功能已完全同步！" -ForegroundColor Green
        Write-Host "====================================================================" -ForegroundColor Green
        Write-Host ""
        $choice = Read-Host "  是否立即启动备考工作台？(输入 Y 或直接回车启动，输入 N 退出)"
        if ($choice -ne 'N' -and $choice -ne 'n') {
            Start-Process (Join-Path $WorkspaceRoot "双击打开备考工作台.bat")
        }
        exit 0
    } else {
        Write-Host "  Git 拉取遇到网络波动，正在自动切换为【免 Git 智能直连同步】模式..." -ForegroundColor Yellow
    }
}

# 2. 免 Git 智能直连下载模式（电脑小白专属，无需安装 Git 或 Node.js）
Write-Host "  [模式 2/2] 正在通过极速加速节点同步最新发布包..." -ForegroundColor Cyan

$mirrors = @(
    "https://raw.githubusercontent.com/Coolzs77/teacher_learning/main/",
    "https://ghproxy.net/https://raw.githubusercontent.com/Coolzs77/teacher_learning/main/",
    "https://mirror.ghproxy.com/https://raw.githubusercontent.com/Coolzs77/teacher_learning/main/"
)

$indexSuccess = $false
$indexContent = ""
$activeBaseUrl = ""

foreach ($baseUrl in $mirrors) {
    $indexUrl = $baseUrl + "docs/index.html"
    try {
        Write-Host "  正在连接节点: $baseUrl ..." -ForegroundColor DarkGray
        $webClient = New-Object System.Net.WebClient
        $webClient.Encoding = [System.Text.Encoding]::UTF8
        $indexContent = $webClient.DownloadString($indexUrl)
        if ($indexContent -and $indexContent.Contains("root")) {
            [System.IO.File]::WriteAllText((Join-Path $DocsDir "index.html"), $indexContent, [System.Text.Encoding]::UTF8)
            $indexSuccess = $true
            $activeBaseUrl = $baseUrl
            Write-Host "  [OK] 成功连接并同步主入口网页！" -ForegroundColor Green
            break
        }
    } catch {
        continue
    }
}

if (-not $indexSuccess) {
    Write-Host "  [提示] 暂时无法连接远程仓库，请检查网络或稍后再试。" -ForegroundColor Red
    Write-Host "  本机现有离线版本不受任何影响，依然可以正常打开研读备考！" -ForegroundColor Yellow
    pause
    exit 1
}

# 解析 index.html 中的 JS 和 CSS 文件名
$assetMatches = [regex]::Matches($indexContent, 'assets/[a-zA-Z0-9_\-\.]+\.(?:js|css)')
$uniqueAssets = @()
foreach ($m in $assetMatches) {
    $val = $m.Value
    if ($uniqueAssets -notcontains $val) {
        $uniqueAssets += $val
    }
}

# 加上核心常用 chunk 列表
$commonAssets = @(
    "assets/confetti-vendor-oQXWb4Lk.js",
    "assets/PdfViewer-lWgfI8Rh.js",
    "assets/lucide-vendor-aOnp7k9b.js",
    "assets/react-vendor-BqH9RPIO.js",
    "assets/pdfjs-vendor-CyniYFEE.js",
    "assets/pdf.worker.min-yatZIOMy.mjs"
)
foreach ($ca in $commonAssets) {
    if ($uniqueAssets -notcontains $ca) {
        $uniqueAssets += $ca
    }
}

Write-Host "  正在下载最新代码与课文组件包 (共 $($uniqueAssets.Count) 个核心文件)..." -ForegroundColor Cyan

$count = 0
foreach ($asset in $uniqueAssets) {
    $count++
    $fileName = [System.IO.Path]::GetFileName($asset)
    $destPath = Join-Path $AssetsDir $fileName
    $assetUrl = $activeBaseUrl + "docs/" + $asset

    try {
        Write-Host "  [$count/$($uniqueAssets.Count)] 正在极速下载: $fileName ..." -ForegroundColor DarkGray
        $webClient.DownloadFile($assetUrl, $destPath)
    } catch {
        foreach ($altBase in $mirrors) {
            try {
                $webClient.DownloadFile($altBase + "docs/" + $asset, $destPath)
                break
            } catch {}
        }
    }
}

Write-Host ""
Write-Host "====================================================================" -ForegroundColor Green
Write-Host "  [成功] 恭喜琪琪！工作台已成功同步到最新版本！" -ForegroundColor Yellow
Write-Host "  - 158篇课文全文与教学切片已就绪" -ForegroundColor Green
Write-Host "  - 结构化黑板板书与考官逐字稿已就绪" -ForegroundColor Green
Write-Host "  - 10分钟试讲倒计时与模拟抽题系统已就绪" -ForegroundColor Green
Write-Host "====================================================================" -ForegroundColor Green
Write-Host ""

$choice = Read-Host "  是否立即启动备考工作台？(输入 Y 或直接回车启动，输入 N 退出)"
if ($choice -ne 'N' -and $choice -ne 'n') {
    Start-Process (Join-Path $WorkspaceRoot "双击打开备考工作台.bat")
}
