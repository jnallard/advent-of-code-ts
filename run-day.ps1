param (
  [string]$day = $( Read-Host "Input day" ),
  [string]$year = (Get-Date).Year
)

Write-Host "Running problem for $year Day $day"

$path = "./src/$year/day$day.ts"
if (Test-Path -Path $path) {
  npx ts-node $path
} else {
    Write-Output "Day does not exist."
    exit(-1)
}
