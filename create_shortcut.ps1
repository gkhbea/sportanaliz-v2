$desktop = [System.Environment]::GetFolderPath('Desktop')
$targetDir = $PSScriptRoot
$compiledExe = Join-Path $targetDir "dist\win-unpacked\SportAnaliz Pro.exe"
$portableExe = Join-Path $targetDir "dist\SportAnaliz Pro 1.0.0.exe"
$electronExe = Join-Path $targetDir "node_modules\electron\dist\electron.exe"
$iconFile = Join-Path $targetDir "icon.ico"

$ws = New-Object -ComObject WScript.Shell

# 1. SportAnaliz Pro Ana Masaüstü Kısayolu
$shortcut = $ws.CreateShortcut((Join-Path $desktop "SportAnaliz Pro.lnk"))

if (Test-Path $compiledExe) {
    $shortcut.TargetPath = $compiledExe
    $shortcut.Arguments = ""
    $shortcut.WorkingDirectory = (Join-Path $targetDir "dist\win-unpacked")
} elseif (Test-Path $portableExe) {
    $shortcut.TargetPath = $portableExe
    $shortcut.Arguments = ""
    $shortcut.WorkingDirectory = (Join-Path $targetDir "dist")
} elseif (Test-Path $electronExe) {
    $shortcut.TargetPath = $electronExe
    $shortcut.Arguments = "`"$targetDir`""
    $shortcut.WorkingDirectory = $targetDir
} else {
    $shortcut.TargetPath = (Join-Path $targetDir "SportAnaliz_Masaustu.vbs")
    $shortcut.WorkingDirectory = $targetDir
}

$shortcut.IconLocation = "$iconFile,0"
$shortcut.Description = "SportAnaliz Pro Masaüstü Uygulaması"
$shortcut.Save()

# 2. Nesine Otomatik Kupon Kaydedici Masaüstü Kısayolu
$nesineBat = Join-Path $targetDir "NESINE_KUPON_OTOMATIK_EKLE.bat"
if (Test-Path $nesineBat) {
    $nesineShortcut = $ws.CreateShortcut((Join-Path $desktop "Nesine Kupon Kaydedici.lnk"))
    $nesineShortcut.TargetPath = $nesineBat
    $nesineShortcut.WorkingDirectory = $targetDir
    $nesineShortcut.IconLocation = "$iconFile,0"
    $nesineShortcut.Description = "SportAnaliz Pro - Nesine Hesaba Otomatik Kupon Kaydedici"
    $nesineShortcut.Save()
}

# 3. 7/24 Server Kontrol Paneli Masaüstü Kısayolu
$serverBat = Join-Path $targetDir "START_SERVER_CONSOLE.bat"
if (Test-Path $serverBat) {
    $serverShortcut = $ws.CreateShortcut((Join-Path $desktop "SportAnaliz Server Paneli.lnk"))
    $serverShortcut.TargetPath = $serverBat
    $serverShortcut.WorkingDirectory = $targetDir
    $serverShortcut.IconLocation = "$iconFile,0"
    $serverShortcut.Description = "SportAnaliz Pro - 7/24 Sunucu ve Web Kontrol Paneli (localhost:3333)"
    $serverShortcut.Save()
}

Write-Host "✅ Masaüstü kısayolları başarıyla güncellendi: $desktop\SportAnaliz Pro.lnk"
