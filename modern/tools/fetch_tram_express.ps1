# Fetch official Tram Express T11/T12/T13 logos from Wikimedia Commons.
# Runs in background with long backoff because Wikimedia rate-limits per IP
# (HTTP 429). Idempotent: skips a file that is already official.
#
# Usage:
#   powershell -ExecutionPolicy Bypass -File tools/fetch_tram_express.ps1

param(
  [string]$TargetDir = (Join-Path $PSScriptRoot "..\public\logos"),
  [int]$MaxTries = 60,
  [int]$BackoffMs = 30000
)

$resolved = (Resolve-Path $TargetDir).Path
$targets = @("Tram_11", "Tram_12", "Tram_13")
$api = "https://commons.wikimedia.org/w/api.php"

function Get-DirectUrl([string]$label) {
  $fn = "File:Paris_transit_icons_-_" + $label + ".svg"
  $q = "action=query&format=json&prop=imageinfo&iiprop=url&titles=" + [uri]::EscapeDataString($fn)
  $r = Invoke-RestMethod -Uri ($api + "?" + $q) -Headers @{ "User-Agent" = "plidf-modern/1.0 (logo import)" } -TimeoutSec 40
  $pi = $r.query.pages.PSObject.Properties.Value | Where-Object { $_.imageinfo } | Select-Object -First 1
  if ($pi) { return $pi.imageinfo[0].url }
  return $null
}

foreach ($label in $targets) {
  $file = $label.ToLower() + ".svg"
  $p = Join-Path $resolved $file
  if (Test-Path $p) {
    $c = Get-Content $p -Raw -ErrorAction SilentlyContinue
    if ($c -like "*Paris transit icons*") {
      Write-Output ("Already official: " + $file)
      continue
    }
    Remove-Item $p -Force -ErrorAction SilentlyContinue
  }
  $done = $false
  for ($i = 1; $i -le $MaxTries -and -not $done; $i++) {
    try {
      $url = Get-DirectUrl $label
      if ($url) {
        curl.exe -sSL -A "Mozilla/5.0 (plidf-modern import)" -o $p $url
        $sz = (Get-Item $p).Length
        $c = Get-Content $p -Raw -ErrorAction SilentlyContinue
        if ($sz -gt 200 -and $c -like "*<svg*") {
          $done = $true
          Write-Output ("OK  " + $file + " (" + $sz + ")")
        } else {
          Remove-Item $p -Force -ErrorAction SilentlyContinue
          Write-Output ("try " + $i + ": invalid content, backing off")
          Start-Sleep -Milliseconds $BackoffMs
        }
      } else {
        Write-Output ("try " + $i + ": no url, backing off")
        Start-Sleep -Milliseconds $BackoffMs
      }
    } catch {
      Write-Output ("try " + $i + ": error, backing off")
      Start-Sleep -Milliseconds $BackoffMs
    }
  }
  if (-not $done) { Write-Output ("FAILED after " + $MaxTries + " tries: " + $file) }
  Start-Sleep -Milliseconds 3000
}
Write-Output "Done."
