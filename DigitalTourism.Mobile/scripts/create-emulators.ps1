# Create Android Emulators via CLI
# This script creates test emulators for different device sizes

$ANDROID_HOME = $env:ANDROID_HOME
if (-not $ANDROID_HOME) {
    $ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
}

Write-Host "`n=== Android Emulator Creator ===" -ForegroundColor Cyan

# Check if we need to install cmdline-tools
$avdmanagerPath = "$ANDROID_HOME\cmdline-tools\latest\bin\avdmanager.bat"
$toolsPath = "$ANDROID_HOME\tools\bin\avdmanager.bat"

if (-not (Test-Path $avdmanagerPath) -and -not (Test-Path $toolsPath)) {
    Write-Host "`n⚠ cmdline-tools not found. Installing..." -ForegroundColor Yellow
    
    # Create cmdline-tools directory
    $cmdlineDir = "$ANDROID_HOME\cmdline-tools"
    if (-not (Test-Path $cmdlineDir)) {
        New-Item -ItemType Directory -Path $cmdlineDir -Force | Out-Null
    }
    
    # Download cmdline-tools
    $toolsUrl = "https://dl.google.com/android/repository/commandlinetools-win-11076708_latest.zip"
    $toolsZip = "$env:TEMP\cmdline-tools.zip"
    
    Write-Host "Downloading cmdline-tools..." -ForegroundColor Gray
    try {
        Invoke-WebRequest -Uri $toolsUrl -OutFile $toolsZip -UseBasicParsing
        
        # Extract
        Write-Host "Extracting..." -ForegroundColor Gray
        Expand-Archive -Path $toolsZip -DestinationPath "$cmdlineDir\temp" -Force
        
        # Move to correct location (cmdline-tools expects to be in 'latest' folder)
        Move-Item -Path "$cmdlineDir\temp\cmdline-tools" -Destination "$cmdlineDir\latest" -Force
        Remove-Item -Path "$cmdlineDir\temp" -Recurse -Force
        Remove-Item -Path $toolsZip -Force
        
        Write-Host "✓ cmdline-tools installed" -ForegroundColor Green
        $avdmanagerPath = "$ANDROID_HOME\cmdline-tools\latest\bin\avdmanager.bat"
    } catch {
        Write-Host "✗ Failed to install cmdline-tools: $_" -ForegroundColor Red
        Write-Host "`nPlease install cmdline-tools manually:" -ForegroundColor Yellow
        Write-Host "1. Open Android Studio" -ForegroundColor White
        Write-Host "2. Tools → SDK Manager" -ForegroundColor White
        Write-Host "3. SDK Tools tab → Install 'Android SDK Command-line Tools'" -ForegroundColor White
        exit 1
    }
}

# Determine which avdmanager to use
if (Test-Path $avdmanagerPath) {
    $avdmanager = $avdmanagerPath
} elseif (Test-Path $toolsPath) {
    $avdmanager = $toolsPath
} else {
    Write-Host "✗ Could not find avdmanager" -ForegroundColor Red
    exit 1
}

Write-Host "Using: $avdmanager" -ForegroundColor Gray

# Check available system images
Write-Host "`nChecking available system images..." -ForegroundColor Yellow
$systemImages = Get-ChildItem -Path "$ANDROID_HOME\system-images" -Recurse -Directory | 
    Where-Object { $_.Name -match "^(x86_64|x86|arm64-v8a)$" } | 
    ForEach-Object { 
        "system-images;" + $_.Parent.Parent.Name + ";" + $_.Parent.Name + ";" + $_.Name 
    }

if ($systemImages.Count -eq 0) {
    Write-Host "✗ No system images found. Please install via Android Studio SDK Manager" -ForegroundColor Red
    exit 1
}

Write-Host "Available system images:" -ForegroundColor Cyan
$systemImages | ForEach-Object { Write-Host "  $_" -ForegroundColor White }

# Select the best system image (prefer playstore x86_64)
$selectedImage = $systemImages | Where-Object { $_ -match "google_apis_playstore.*x86_64" } | Select-Object -First 1
if (-not $selectedImage) {
    $selectedImage = $systemImages | Select-Object -First 1
}

Write-Host "`nUsing system image: $selectedImage" -ForegroundColor Green

# Function to create AVD
function Create-AVD {
    param(
        [string]$Name,
        [string]$Device,
        [string]$SystemImage
    )
    
    Write-Host "`nCreating $Name..." -ForegroundColor Yellow
    
    # Delete if exists
    $avdPath = "$env:USERPROFILE\.android\avd\$Name.avd"
    if (Test-Path $avdPath) {
        Write-Host "  Deleting existing AVD..." -ForegroundColor Gray
        & $avdmanager delete avd -n $Name
    }
    
    # Create AVD
    try {
        $output = echo "no" | & $avdmanager create avd -n $Name -k $SystemImage -d $Device -f 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  ✓ Created successfully" -ForegroundColor Green
            
            # Configure AVD for better performance
            $configFile = "$env:USERPROFILE\.android\avd\$Name.avd\config.ini"
            if (Test-Path $configFile) {
                Add-Content -Path $configFile -Value "`nhw.gpu.enabled=yes"
                Add-Content -Path $configFile -Value "hw.gpu.mode=auto"
                Write-Host "  ✓ Configured for hardware acceleration" -ForegroundColor Green
            }
            
            return $true
        } else {
            Write-Host "  ✗ Failed: $output" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "  ✗ Error: $_" -ForegroundColor Red
        return $false
    }
}

# List available device definitions
Write-Host "`nAvailable device definitions:" -ForegroundColor Cyan
& $avdmanager list device | Select-String "^id:" | ForEach-Object { 
    $_ -replace "^id:\s+(\d+)\s+or\s+", "  " 
} | Select-Object -First 10

Write-Host "`n=== Creating Test Emulators ===" -ForegroundColor Cyan

# Create emulators
$created = @()

# Small phone (Pixel 4a equivalent - 5.8")
if (Create-AVD -Name "TestPhone_Small" -Device "pixel_4a" -SystemImage $selectedImage) {
    $created += "TestPhone_Small (5.8`" - Small device testing)"
}

# Medium phone (Pixel 5 equivalent - 6.0") 
if (Create-AVD -Name "TestPhone_Medium" -Device "pixel_5" -SystemImage $selectedImage) {
    $created += "TestPhone_Medium (6.0`" - Standard device)"
}

# Large phone (Pixel 7 Pro equivalent - 6.7")
if (Create-AVD -Name "TestPhone_Large" -Device "pixel_7_pro" -SystemImage $selectedImage) {
    $created += "TestPhone_Large (6.7`" - Large phone testing)"
}

# Tablet (10.95" - for max scale testing)
if (Create-AVD -Name "TestTablet" -Device "pixel_tablet" -SystemImage $selectedImage) {
    $created += "TestTablet (10.95`" - Tablet/max scale testing)"
}

# Summary
Write-Host "`n=== Creation Complete ===" -ForegroundColor Green
Write-Host "Created $($created.Count) emulators:" -ForegroundColor Cyan
$created | ForEach-Object { Write-Host "  ✓ $_" -ForegroundColor White }

Write-Host "`nTo start an emulator:" -ForegroundColor Yellow
Write-Host "  & `"`$env:ANDROID_HOME\emulator\emulator.exe`" -avd TestPhone_Small" -ForegroundColor White

Write-Host "`nTo list all AVDs:" -ForegroundColor Yellow  
Write-Host "  & `"`$env:ANDROID_HOME\emulator\emulator.exe`" -list-avds" -ForegroundColor White

Write-Host "`nNext step: Run test script" -ForegroundColor Cyan
Write-Host "  .\scripts\test-emulators.ps1" -ForegroundColor White
