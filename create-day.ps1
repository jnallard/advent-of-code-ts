param (
  [string]$day = $( Read-Host "Input day" ),
  [string]$year = (Get-Date).Year
)

Write-Host "Creating problem files for $year Day $day"

$inputName = "input-day$day"
$inputPath = "./src/$year/input/$inputName"
$inputTemplate = Get-Content -Path .\src\templates\input\INPUT_TEMPLATE.ts -Raw
$inputTemplate | Out-File -FilePath "$inputPath.ts"

$dayPath = "./src/$year/day$day.ts"
$dayTemplate = Get-Content -Path .\src\templates\DAY_TEMPLATE.ts -Raw
$dayTemplate.Replace('INPUT_TEMPLATE', $inputName) | Out-File -FilePath "$dayPath"