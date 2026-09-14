param (
    [int]$Port = 8899
)

$PSScriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
$WorkspaceRoot = Split-Path -Parent $PSScriptRoot
$Root = Join-Path $WorkspaceRoot "docs"

if (-not (Test-Path $Root)) {
    $Root = Join-Path $WorkspaceRoot "dist"
}

Write-Host "============================================================" -ForegroundColor Green
Write-Host "  初中语文教资面试（10分钟试讲专项）备战工作台 - 琪琪专属离线版" -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Green
Write-Host "  正在启动极速本地静态服务，端口: $Port" -ForegroundColor Cyan
Write-Host "  课文与教材存储路径: $Root" -ForegroundColor DarkGray
Write-Host "  已为您自动唤起系统浏览器..." -ForegroundColor Green
Write-Host "  【温馨提示】：使用时请保留本窗口；用完后关闭本窗口即可退出。" -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Green

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://127.0.0.1:$Port/")

try {
    $listener.Start()
} catch {
    $Port = $Port + 1
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://127.0.0.1:$Port/")
    $listener.Start()
}

Start-Process "http://127.0.0.1:$Port/"

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $req = $context.Request
        $res = $context.Response

        $rawPath = [System.Uri]::UnescapeDataString($req.Url.LocalPath.TrimStart('/'))
        if ([string]::IsNullOrEmpty($rawPath)) {
            $rawPath = "index.html"
        }

        if ($rawPath.StartsWith("teacher_learning/")) {
            $rawPath = $rawPath.Substring("teacher_learning/".Length)
        }
        if ([string]::IsNullOrEmpty($rawPath)) {
            $rawPath = "index.html"
        }

        $filePath = Join-Path $Root $rawPath
        if (-not (Test-Path $filePath -PathType Leaf)) {
            $filePath = Join-Path $Root "index.html"
        }

        $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
        $mime = switch ($ext) {
            '.html' { 'text/html; charset=utf-8' }
            '.js'   { 'application/javascript; charset=utf-8' }
            '.mjs'  { 'application/javascript; charset=utf-8' }
            '.css'  { 'text/css; charset=utf-8' }
            '.svg'  { 'image/svg+xml' }
            '.pdf'  { 'application/pdf' }
            '.json' { 'application/json; charset=utf-8' }
            '.png'  { 'image/png' }
            '.jpg'  { 'image/jpeg' }
            '.jpeg' { 'image/jpeg' }
            '.ico'  { 'image/x-icon' }
            default { 'application/octet-stream' }
        }

        $res.ContentType = $mime
        $res.AddHeader("Access-Control-Allow-Origin", "*")
        $res.AddHeader("Accept-Ranges", "bytes")

        try {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $res.ContentLength64 = $bytes.Length
            $res.OutputStream.Write($bytes, 0, $bytes.Length)
        } catch {
            $res.StatusCode = 500
        } finally {
            $res.OutputStream.Close()
        }
    }
} finally {
    $listener.Stop()
    $listener.Close()
}
