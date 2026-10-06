<#
.SYNOPSIS
Antigravity Ecosystem Installer (PowerShell)

.DESCRIPTION
Copies skills and workflows to a target project or globally, merges AGENTS_TEMPLATE.md, and updates .gitignore.
#>
param(
    [string]$Target = ".",
    [switch]$Global,
    [switch]$DryRun
)

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$RepoRoot = Split-Path -Parent $ScriptDir

if ($Global) {
    $AgentDir = Join-Path $HOME ".gemini\antigravity"
} else {
    $AgentDir = Join-Path $Target ".agent"
}

Write-Host "Installing Antigravity Ecosystem..."
Write-Host "Target Agent Directory: $AgentDir"
if ($DryRun) { Write-Host "--- DRY RUN MODE ---" -ForegroundColor Yellow }

# 1. Copy skills and workflows
$Dirs = @("skills", "workflows")
foreach ($d in $Dirs) {
    $Src = Join-Path $RepoRoot $d
    $Dst = Join-Path $AgentDir $d
    
    if (Test-Path $Src) {
        if ($DryRun) {
            Write-Host "[DRY RUN] Would copy $Src to $Dst"
        } else {
            if (!(Test-Path $Dst)) { New-Item -ItemType Directory -Force -Path $Dst | Out-Null }
            Copy-Item -Path "$Src\*" -Destination $Dst -Recurse -Force
            Write-Host "Copied $d to $Dst"
        }
    }
}

# 2. Merge AGENTS_TEMPLATE.md and update .gitignore
if (-not $Global) {
    $AgentsFile = Join-Path $Target "AGENTS.md"
    $TemplateFile = Join-Path $RepoRoot "AGENTS_TEMPLATE.md"
    
    if (Test-Path $TemplateFile) {
        if ($DryRun) {
            Write-Host "[DRY RUN] Would merge $TemplateFile into $AgentsFile"
        } else {
            if (!(Test-Path $Target)) { New-Item -ItemType Directory -Force -Path $Target | Out-Null }
            if (!(Test-Path $AgentsFile)) { New-Item -ItemType File -Force -Path $AgentsFile | Out-Null }
            
            $Content = Get-Content $AgentsFile -Raw -ErrorAction Ignore
            if ($null -eq $Content) { $Content = "" }
            
            if (-not $Content.Contains("<!-- ANTIGRAVITY ECOSYSTEM START -->")) {
                $TemplateContent = Get-Content $TemplateFile -Raw
                $NewContent = "`n<!-- ANTIGRAVITY ECOSYSTEM START -->`n$TemplateContent`n<!-- ANTIGRAVITY ECOSYSTEM END -->`n"
                Add-Content -Path $AgentsFile -Value $NewContent
                Write-Host "Merged AGENTS_TEMPLATE.md into $AgentsFile"
            } else {
                Write-Host "AGENTS.md already contains ecosystem block. Skipping."
            }
        }
    }

    $Gitignore = Join-Path $Target ".gitignore"
    if ($DryRun) {
        Write-Host "[DRY RUN] Would add .agent/context/ to $Gitignore"
    } else {
        if (!(Test-Path $Gitignore)) { New-Item -ItemType File -Force -Path $Gitignore | Out-Null }
        
        $IgContent = Get-Content $Gitignore -Raw -ErrorAction Ignore
        if ($null -eq $IgContent) { $IgContent = "" }
        
        # Simple string match. Regex might be better but this handles basics.
        if (-not ($IgContent -match "(?m)^\.agent/context/")) {
            Add-Content -Path $Gitignore -Value "`n.agent/context/"
            Write-Host "Added .agent/context/ to $Gitignore"
        } else {
            Write-Host ".agent/context/ already in $Gitignore"
        }
    }
}

Write-Host "Installation complete!"
