$adb = "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe"

& $adb reverse tcp:8080 tcp:8080
& $adb reverse tcp:5107 tcp:5107
& $adb reverse tcp:8081 tcp:8081

Write-Host "ADB reverse ports set: 8080 (Keycloak), 5107 (API Gateway), 8081 (Metro)"
