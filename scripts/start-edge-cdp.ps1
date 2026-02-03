$edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
$profilePath = Join-Path (Get-Location) ".cdp-profile\edge"

if (-not (Test-Path $edgePath)) {
    Write-Error "Edge not found at $edgePath. Please update the path in this script."
    exit 1
}

if (-not (Test-Path $profilePath)) {
    New-Item -ItemType Directory -Path $profilePath -Force | Out-Null
}

Write-Host "Starting Edge CDP..."
Write-Host "Path: $edgePath"
Write-Host "Profile: $profilePath"
Write-Host "Debug URL: http://localhost:9222/json/version"

Start-Process -FilePath $edgePath -ArgumentList @(
    "--remote-debugging-port=9222",
    "--user-data-dir=`"$profilePath`"",
    "--no-first-run",
    "--no-default-browser-check"
)
