# /scripts/dev-restart.ps1
# Kills existing Next.js/Node processes and restarts the dev server cleanly.

Write-Host "--- Stopping existing development processes ---" -ForegroundColor Cyan

# Find current and parent processes for Next.js
$processes = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object {
    $cmd = (Get-CimInstance Win32_Process -Filter "ProcessId = $($_.Id)").CommandLine
    $cmd -like "*next dev*" -or $cmd -like "*nitro*" -or $cmd -like "*million-chances*"
}

if ($processes) {
    foreach ($p in $processes) {
        Write-Host "Killing process: $($p.Id) ($($p.ProcessName))" -ForegroundColor Yellow
        Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue
    }
} else {
    Write-Host "No relevant Next.js processes found." -ForegroundColor DarkGray
}

Write-Host "--- Cleaning Next.js cache ---" -ForegroundColor Cyan
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
    Write-Host ".next cache cleared." -ForegroundColor Green
}

Write-Host "--- Restarting Dev Server ---" -ForegroundColor Cyan
npm run dev
