# ??? ?? ?? ?? (????): powershell -File scripts/dev-server.ps1 [port]
param([int]$Port = 8756)

$root = Join-Path (Split-Path -Parent $PSScriptRoot) 'program'
if (-not (Test-Path $root)) { $root = Join-Path (Split-Path -Parent (Split-Path -Parent $PSScriptRoot)) 'program' }
if (-not (Test-Path $root)) { $root = Split-Path -Parent $PSScriptRoot }
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Output "Serving $root at http://localhost:$Port/"

$mime = @{
  ".html"="text/html; charset=utf-8"; ".css"="text/css; charset=utf-8"; ".js"="text/javascript; charset=utf-8"
  ".json"="application/json"; ".png"="image/png"; ".jpg"="image/jpeg"; ".jpeg"="image/jpeg"; ".gif"="image/gif"
  ".webp"="image/webp"; ".svg"="image/svg+xml"; ".mp4"="video/mp4"; ".mp3"="audio/mpeg"; ".wav"="audio/wav"
  ".woff"="font/woff"; ".woff2"="font/woff2"; ".ico"="image/x-icon"
}

while ($listener.IsListening) {
  try {
    $ctx = $listener.GetContext()
    $rawPath = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath)
    if ($rawPath -eq "/") { $rawPath = "/index.html" }
    $file = Join-Path $root ($rawPath -replace "/", "\")
    $resolved = [IO.Path]::GetFullPath($file)
    if ($resolved.StartsWith($root, [StringComparison]::OrdinalIgnoreCase) -and (Test-Path $resolved -PathType Leaf)) {
      $bytes = [IO.File]::ReadAllBytes($resolved)
      $ext = [IO.Path]::GetExtension($resolved).ToLower()
      $ctx.Response.ContentType = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { "application/octet-stream" }
      $ctx.Response.ContentLength64 = $bytes.Length
      $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $ctx.Response.StatusCode = 404
    }
    $ctx.Response.Close()
  } catch {
    # ?????? ??? ?? ?? ?? ???? ?? ???
  }
}
