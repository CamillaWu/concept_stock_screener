param(
    [switch]$Quiet
)

function Write-Info {
    param([string]$Message)
    if (-not $Quiet) {
        Write-Host $Message
    }
}

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot '..')

$pnpmCmd = Get-Command pnpm -ErrorAction SilentlyContinue
if (-not $pnpmCmd) {
    $corepackCmd = Get-Command corepack -ErrorAction SilentlyContinue
    if ($corepackCmd) {
        Write-Info "pnpm not found, attempting to enable via corepack"
        try {
            corepack enable pnpm | Out-Null
            $pnpmCmd = Get-Command pnpm -ErrorAction SilentlyContinue
        }
        catch {
            if (-not $Quiet) {
                Write-Warning "corepack failed to enable pnpm: $($_.Exception.Message)"
            }
        }
    }
    else {
        if (-not $Quiet) {
            Write-Warning "pnpm not found. Install pnpm or run 'corepack enable pnpm'."
        }
    }
}

if (-not $pnpmCmd) {
    return
}

$npmrcPath = Join-Path $projectRoot '.npmrc'
if (Test-Path $npmrcPath) {
    $content = Get-Content $npmrcPath -Raw
    if ($content -notmatch 'node-linker=hoisted') {
        Add-Content -Path $npmrcPath -Value 'node-linker=hoisted'
        Write-Info "Added node-linker=hoisted to $npmrcPath"
    }
    else {
        Write-Info "node-linker=hoisted already present in $npmrcPath"
    }
}
else {
    'node-linker=hoisted' | Set-Content -Path $npmrcPath -Encoding utf8
    Write-Info "Created $npmrcPath with node-linker=hoisted"
}

try {
    pnpm config set node-linker hoisted --global | Out-Null
    Write-Info "Configured pnpm global node-linker=hoisted"
}
catch {
    if (-not $Quiet) {
        Write-Warning "Failed to set global pnpm node-linker: $($_.Exception.Message)"
    }
}
