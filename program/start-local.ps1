# Local web server for this folder (program).
# Usage: powershell -NoProfile -ExecutionPolicy Bypass -File start-local.ps1 [-Port 8756]
# Opens the browser automatically. Close this window to stop the server.
param([int]$Port = 8756)

$root = $PSScriptRoot
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
try {
  $listener.Start()
} catch {
  Write-Output "Port $Port is already in use. The app may already be running."
  Start-Process "http://localhost:$Port/"
  exit
}
Write-Output "Serving $root at http://localhost:$Port/"
Write-Output "Close this window to stop."
Start-Process "http://localhost:$Port/"

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
    # keep serving even if one request fails
  }
}
