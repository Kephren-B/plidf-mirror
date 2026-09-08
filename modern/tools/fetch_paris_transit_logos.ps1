# Récupère les logos de lignes « Paris transit icons » (Wikimedia Commons)
# pour les lignes existantes, et les place dans public/logos/.
#
# Usage :
#   powershell -ExecutionPolicy Bypass -File tools/fetch_paris_transit_logos.ps1
#
# Le script est idempotent : il saute les fichiers déjà remplacés (qui
# contiennent déjà l'icône officielle). Wikimedia limite fortement le débit
# (HTTP 429) : relancez simplement le script plus tard pour finir le travail.
#
# Source : https://commons.wikimedia.org/wiki/Template:Paris_transit_icons

param(
  [string]$TargetDir = (Join-Path $PSScriptRoot "..\public\logos"),
  [int]$DelayMs = 4000,
  [int]$MaxRetries = 5
)

$resolved = (Resolve-Path $TargetDir).Path

# mapping  fichier_cible -> libellé Wikimedia
$map = [ordered]@{}
1..18 | ForEach-Object { $map["m_$_.svg"] = "Métro $_" }
$map["m_3bis.svg"] = "Métro 3bis"
$map["m_7bis.svg"] = "Métro 7bis"
"A", "B", "C", "D", "E" | ForEach-Object { $map["rer_$_.svg"] = "RER $_" }
"H", "J", "K", "L", "N", "P", "R", "U" | ForEach-Object { $map["transilien_$_.svg"] = "Train $_" }
1..10 | ForEach-Object { $map["tram_$_.svg"] = "Tram $_" }
$map["tram_3a.svg"] = "Tram 3a"
$map["tram_3b.svg"] = "Tram 3b"

$base = "https://commons.wikimedia.org/wiki/Special:FilePath/Paris_transit_icons_-_"

function Is-Official([string]$file) {
  $p = Join-Path $resolved $file
  if (-not (Test-Path $p)) { return $false }
  $c = Get-Content $p -Raw -ErrorAction SilentlyContinue
  return ($c -like '*Paris transit icons*')
}

$todo = @()
foreach ($k in $map.Keys) {
  if (-not (Is-Official $k)) { $todo += ,@($k, $map[$k]) }
}
Write-Output ("À télécharger : {0} / {1}" -f $todo.Count, $map.Count)

$ok = 0; $fail = @()
foreach ($pr in $todo) {
  $file = $pr[0]; $label = $pr[1]
  $target = Join-Path $resolved $file
  $url = $base + [uri]::EscapeDataString($label) + ".svg"
  $done = $false
  for ($try = 1; $try -le $MaxRetries -and -not $done; $try++) {
    curl.exe -sSL -A "Mozilla/5.0 (plidf-modern import)" -o $target $url 2>$null
    if (Test-Path $target) {
      $sz = (Get-Item $target).Length
      $c = Get-Content $target -Raw -ErrorAction SilentlyContinue
      if ($sz -gt 300 -and $c -like '*<svg*') { $done = $true }
      else { Remove-Item $target -Force -ErrorAction SilentlyContinue; Start-Sleep -Milliseconds 20000 }
    } else {
      Start-Sleep -Milliseconds 20000
    }
  }
  if ($done) { $ok++; Write-Output "OK  $file" }
  else { $fail += $file; Write-Output "FAIL $file (429 probable)" }
  Start-Sleep -Milliseconds $DelayMs
}

Write-Output ("Résultat : OK={0} ÉCHECS={1}" -f $ok, $fail.Count)
if ($fail.Count -gt 0) {
  Write-Output "Réessayez plus tard (Wikimedia limite le débit) :"
  $fail | ForEach-Object { Write-Output "  - $_" }
  exit 1
}
