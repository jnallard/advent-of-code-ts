param (
  [string]$day = $( Read-Host "Input day" ),
  [string]$year = (Get-Date).Year
)

Write-Host "Creating problem files for $year Day $day"

$inputName = "input-day$day"
$inputPath = "./src/$year/input/$inputName"
$dayPath = "./src/$year/day$day.ts"

if (Test-Path -Path $dayPath) {
    Write-Output "Day already exists"
    exit(-1)
}

$inputTemplate = Get-Content -Encoding ASCII -Path .\src\templates\input\INPUT_TEMPLATE.ts -Raw
$inputTemplate | Out-File -Encoding ASCII -FilePath "$inputPath.ts"

$dayTemplate = Get-Content -Encoding ASCII -Path .\src\templates\DAY_TEMPLATE.ts -Raw
$dayTemplate.Replace('INPUT_TEMPLATE', $inputName) | Out-File -Encoding ASCII -FilePath "$dayPath"