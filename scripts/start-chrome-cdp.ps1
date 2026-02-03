$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$profilePath = Join-Path (Get-Location) ".cdp-profile\chrome"

if (-not (Test-Path $chromePath)) {
    Write-Error "Chrome not found at $chromePath. Please update the path in this script."
    exit 1
}

if (-not (Test-Path $profilePath)) {
    New-Item -ItemType Directory -Path $profilePath -Force | Out-Null
}

Write-Host "Starting Chrome CDP..."
Write-Host "Path: $chromePath"
Write-Host "Profile: $profilePath"
Write-Host "Debug URL: http://localhost:9222/json/version"

Start-Process -FilePath $chromePath -ArgumentList @(
    "--remote-debugging-port=9222",
    "--user-data-dir=`"$profilePath`"",
    "--no-first-run",
    "--no-default-browser-check"
)
