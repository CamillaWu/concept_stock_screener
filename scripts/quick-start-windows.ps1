# æ¦‚å¿µ?¡ç¯©?¸ç³»çµ?- Windows å¿«é€Ÿå??•è…³??
# ?©ç”¨??Windows 10/11 + PowerShell 5.1+

param(
    [switch]$SkipChecks,
    [switch]$SkipInstall,
    [switch]$SkipBuild,
    [switch]$SkipTest,
    [switch]$Help
)

# é¡¯ç¤ºå¹«åŠ©ä¿¡æ¯
if ($Help) {
    Write-Host @"
æ¦‚å¿µ?¡ç¯©?¸ç³»çµ?- Windows å¿«é€Ÿå??•è…³??

?¨æ?:
    .\quick-start-windows.ps1 [?¸é?]

?¸é?:
    -SkipChecks    è·³é??°å?æª¢æŸ¥
    -SkipInstall   è·³é?ä¾è³´å®‰è?
    -SkipBuild     è·³é?å°ˆæ?æ§‹å»º
    -SkipTest      è·³é?æ¸¬è©¦?·è?
    -Help          é¡¯ç¤ºæ­¤å¹«?©ä¿¡??

ç¤ºä?:
    .\quick-start-windows.ps1                    # å®Œæ•´æµç?
    .\quick-start-windows.ps1 -SkipChecks        # è·³é??°å?æª¢æŸ¥
    .\quick-start-windows.ps1 -SkipInstall       # è·³é?ä¾è³´å®‰è?
"@
    exit 0
}

# é¡è‰²å®šç¾©
$Colors = @{
    Info = "Cyan"
    Success = "Green"
    Warning = "Yellow"
    Error = "Red"
}

# ?¥è??½æ•¸
function Write-Log {
    param(
        [string]$Message,
        [string]$Level = "Info"
    )
    
    $timestamp = Get-Date -Format "HH:mm:ss"
    $color = $Colors[$Level]
    Write-Host "[$timestamp] $Message" -ForegroundColor $color
}

# æª¢æŸ¥?·è?ç­–ç•¥
function Test-ExecutionPolicy {
    Write-Log "æª¢æŸ¥ PowerShell ?·è?ç­–ç•¥..." "Info"
    
    $policy = Get-ExecutionPolicy
    if ($policy -eq "Restricted") {
        Write-Log "?·è?ç­–ç•¥?æ–¼?´æ ¼ï¼Œå?è©¦è¨­ç½®ç‚º RemoteSigned..." "Warning"
        try {
            Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
            Write-Log "?·è?ç­–ç•¥å·²è¨­ç½®ç‚º RemoteSigned" "Success"
        }
        catch {
            Write-Log "?¡æ?è¨­ç½®?·è?ç­–ç•¥ï¼Œè??‹å??·è?: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser" "Error"
            return $false
        }
    }
    else {
        Write-Log "?·è?ç­–ç•¥: $policy" "Success"
    }
    return $true
}

# æª¢æŸ¥ Node.js
function Test-NodeJS {
    Write-Log "æª¢æŸ¥ Node.js..." "Info"
    
    try {
        $nodeVersion = node --version
        $npmVersion = npm --version
        Write-Log "Node.js ?ˆæœ¬: $nodeVersion" "Success"
        Write-Log "npm ?ˆæœ¬: $npmVersion" "Success"
        return $true
    }
    catch {
        Write-Log "Node.js ?ªå?è£æ?ä¸åœ¨ PATH ä¸? "Error"
        Write-Log "è«‹å? https://nodejs.org/ ä¸‹è?ä¸¦å?è£?Node.js" "Error"
        return $false
    }
}

# æª¢æŸ¥ pnpm
function Test-Pnpm {
    Write-Log "æª¢æŸ¥ pnpm..." "Info"
    
    try {
        $pnpmVersion = pnpm --version
        Write-Log "pnpm ?ˆæœ¬: $pnpmVersion" "Success"
        return $true
    }
    catch {
        Write-Log "pnpm ?ªå?è£ï?æ­?œ¨å®‰è?..." "Warning"
        try {
            npm install -g pnpm
            Write-Log "pnpm å®‰è??å?" "Success"
            return $true
        }
        catch {
            Write-Log "pnpm å®‰è?å¤±æ?" "Error"
            return $false
        }
    }
}

# æª¢æŸ¥ Git
function Test-Git {
    Write-Log "æª¢æŸ¥ Git..." "Info"
    
    try {
        $gitVersion = git --version
        Write-Log "Git ?ˆæœ¬: $gitVersion" "Success"
        return $true
    }
    catch {
        Write-Log "Git ?ªå?è£æ?ä¸åœ¨ PATH ä¸? "Warning"
        Write-Log "å»ºè­°å¾?https://git-scm.com/ ä¸‹è?ä¸¦å?è£?Git" "Warning"
        return $false
    }
}

# ?°å?æª¢æŸ¥
function Start-EnvironmentCheck {
    if ($SkipChecks) {
        Write-Log "è·³é??°å?æª¢æŸ¥" "Warning"
        return $true
    }
    
    Write-Log "?‹å??°å?æª¢æŸ¥..." "Info"
    
    $checks = @(
        @{ Name = "PowerShell ?·è?ç­–ç•¥"; Function = "Test-ExecutionPolicy" },
        @{ Name = "Node.js"; Function = "Test-NodeJS" },
        @{ Name = "pnpm"; Function = "Test-Pnpm" },
        @{ Name = "Git"; Function = "Test-Git" }
    )
    
    $allPassed = $true
    foreach ($check in $checks) {
        Write-Log "æª¢æŸ¥: $($check.Name)" "Info"
        $result = & $check.Function
        if (-not $result) {
            $allPassed = $false
        }
        Write-Host ""
    }
    
    if ($allPassed) {
        Write-Log "?€?‰ç’°å¢ƒæª¢?¥é€šé?ï¼? "Success"
    }
    else {
        Write-Log "?¨å??°å?æª¢æŸ¥å¤±æ?ï¼Œè?è§?±º?é?å¾Œé?è©? "Error"
    }
    
    return $allPassed
}

# å®‰è?ä¾è³´
function Start-DependencyInstall {
    if ($SkipInstall) {
        Write-Log "è·³é?ä¾è³´å®‰è?" "Warning"
        return $true
    }
    
    Write-Log "?‹å?å®‰è?ä¾è³´..." "Info"
    
    try {
        # æ¸…ç??Šç?ä¾è³´
        if (Test-Path "node_modules") {
            Write-Log "æ¸…ç??Šç?ä¾è³´..." "Info"
            Remove-Item -Recurse -Force "node_modules" -ErrorAction SilentlyContinue
        }
        
        if (Test-Path "packages/*/node_modules") {
            Write-Log "æ¸…ç??…ç?ä¾è³´..." "Info"
            Get-ChildItem "packages" -Directory | ForEach-Object {
                if (Test-Path "$($_.FullName)/node_modules") {
                    Remove-Item -Recurse -Force "$($_.FullName)/node_modules" -ErrorAction SilentlyContinue
                }
            }
        }
        
        # å®‰è?ä¾è³´
        Write-Log "å®‰è?å°ˆæ?ä¾è³´..." "Info"
        & "$PSScriptRoot/setup/configure-pnpm-linker.ps1"
        pnpm install
        
        if ($LASTEXITCODE -eq 0) {
            Write-Log "ä¾è³´å®‰è??å?ï¼? "Success"
            return $true
        }
        else {
            Write-Log "ä¾è³´å®‰è?å¤±æ?" "Error"
            return $false
        }
    }
    catch {
        Write-Log "ä¾è³´å®‰è??ç?ä¸­ç™¼?ŸéŒ¯èª? $($_.Exception.Message)" "Error"
        return $false
    }
}

# æ§‹å»ºå°ˆæ?
function Start-ProjectBuild {
    if ($SkipBuild) {
        Write-Log "è·³é?å°ˆæ?æ§‹å»º" "Warning"
        return $true
    }
    
    Write-Log "?‹å?æ§‹å»ºå°ˆæ?..." "Info"
    
    try {
        # æ§‹å»ºé¡å?å®šç¾©
        Write-Log "æ§‹å»ºé¡å?å®šç¾©..." "Info"
        pnpm build:types
        if ($LASTEXITCODE -ne 0) {
            Write-Log "é¡å?å®šç¾©æ§‹å»ºå¤±æ?" "Error"
            return $false
        }
        
        # æ§‹å»º UI çµ„ä»¶
        Write-Log "æ§‹å»º UI çµ„ä»¶..." "Info"
        pnpm build:ui
        if ($LASTEXITCODE -ne 0) {
            Write-Log "UI çµ„ä»¶æ§‹å»ºå¤±æ?" "Error"
            return $false
        }
        
        # æ§‹å»º?ç«¯
        Write-Log "æ§‹å»º?ç«¯..." "Info"
        pnpm build:web
        if ($LASTEXITCODE -ne 0) {
            Write-Log "?ç«¯æ§‹å»ºå¤±æ?" "Error"
            return $false
        }
        
        # æ§‹å»º API
        Write-Log "æ§‹å»º API..." "Info"
        pnpm build:api
        if ($LASTEXITCODE -ne 0) {
            Write-Log "API æ§‹å»ºå¤±æ?" "Error"
            return $false
        }
        
        Write-Log "å°ˆæ?æ§‹å»º?å?ï¼? "Success"
        return $true
    }
    catch {
        Write-Log "å°ˆæ?æ§‹å»º?ç?ä¸­ç™¼?ŸéŒ¯èª? $($_.Exception.Message)" "Error"
        return $false
    }
}

# ?‹è?æ¸¬è©¦
function Start-Testing {
    if ($SkipTest) {
        Write-Log "è·³é?æ¸¬è©¦?·è?" "Warning"
        return $true
    }
    
    Write-Log "?‹å??‹è?æ¸¬è©¦..." "Info"
    
    try {
        # é¡å?æª¢æŸ¥
        Write-Log "?‹è?é¡å?æª¢æŸ¥..." "Info"
        pnpm type-check:types
        pnpm type-check:ui
        pnpm type-check:web
        
        # ?ºç?æ¸¬è©¦
        Write-Log "?‹è??ºç?æ¸¬è©¦..." "Info"
        pnpm test:basic
        
        Write-Log "æ¸¬è©¦å®Œæ?ï¼? "Success"
        return $true
    }
    catch {
        Write-Log "æ¸¬è©¦?ç?ä¸­ç™¼?ŸéŒ¯èª? $($_.Exception.Message)" "Error"
        return $false
    }
}

# é¡¯ç¤ºå®Œæ?ä¿¡æ¯
function Show-CompletionMessage {
    Write-Host ""
    Write-Log "?? æ¦‚å¿µ?¡ç¯©?¸ç³»çµ±è¨­ç½®å??ï?" "Success"
    Write-Host ""
    Write-Log "ä¸‹ä?æ­¥æ?ä½?" "Info"
    Write-Log "1. ?Ÿå??‹ç™¼?°å?: pnpm start" "Info"
    Write-Log "2. ?‹è?å®Œæ•´æ¸¬è©¦: pnpm test" "Info"
    Write-Log "3. ?¥ç?å°ˆæ??€?? .\scripts\maintenance\status-check.ps1" "Info"
    Write-Host ""
    Write-Log "å°ˆæ??‡æ?ä½æ–¼ docs/ ?®é?" "Info"
    Write-Log "å¿«é€Ÿé?å§‹æ??? docs/quick-start/QUICK_START_GUIDE.md" "Info"
}

# ä¸»å‡½??
function Main {
    Write-Host ""
    Write-Log "?? æ¦‚å¿µ?¡ç¯©?¸ç³»çµ?- Windows å¿«é€Ÿå??? "Info"
    Write-Log "?‹å??‚é?: $(Get-Date)" "Info"
    Write-Host ""
    
    # æª¢æŸ¥å·¥ä??®é?
    if (-not (Test-Path "package.json")) {
        Write-Log "?¯èª¤ï¼šè??¨å?æ¡ˆæ ¹?®é??·è?æ­¤è…³?? "Error"
        exit 1
    }
    
    # ?·è??„é?æ®?
    $stages = @(
        @{ Name = "?°å?æª¢æŸ¥"; Function = "Start-EnvironmentCheck" },
        @{ Name = "ä¾è³´å®‰è?"; Function = "Start-DependencyInstall" },
        @{ Name = "å°ˆæ?æ§‹å»º"; Function = "Start-ProjectBuild" },
        @{ Name = "æ¸¬è©¦?·è?"; Function = "Start-Testing" }
    )
    
    foreach ($stage in $stages) {
        Write-Log "=== $($stage.Name) ===" "Info"
        $result = & $stage.Function
        
        if (-not $result) {
            Write-Log "$($stage.Name) å¤±æ?ï¼Œå?æ­¢åŸ·è¡? "Error"
            exit 1
        }
        
        Write-Host ""
    }
    
    # é¡¯ç¤ºå®Œæ?ä¿¡æ¯
    Show-CompletionMessage
}

# ?·è?ä¸»å‡½??
try {
    Main
}
catch {
    Write-Log "?³æœ¬?·è??ç?ä¸­ç™¼?Ÿæœª?æ??„éŒ¯èª? $($_.Exception.Message)" "Error"
    Write-Log "è«‹æª¢?¥éŒ¯èª¤ä¿¡?¯ä¸¦?è©¦" "Error"
    exit 1
}


