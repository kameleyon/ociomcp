# PowerShell script to update all TypeScript files in src/tools with standard template

# Get all TypeScript files in src/tools and its subdirectories
$files = Get-ChildItem -Path "src/tools" -Recurse -Filter "*.ts"

foreach ($file in $files) {
    # Get the filename without extension
    $filename = [System.IO.Path]::GetFileNameWithoutExtension($file.Name)
    
    # Read the current content of the file
    $content = Get-Content -Path $file.FullName -Raw
    
    # Create the template with the filename
    $template = @"
// Auto-generated safe fallback for $filename

export function activate() {
    console.log("[TOOL] $filename activated (passive mode)");
}

export function onFileWrite() { /* no-op */ }
export function onSessionStart() { /* no-op */ }
export function onCommand() { /* no-op */ }

"@

    # Check if the file already has the template
    if ($content -match "Auto-generated safe fallback for") {
        Write-Host "File $($file.FullName) already has the template. Skipping."
        continue
    }
    
    # Combine the template with the existing content
    $newContent = $template + $content
    
    # Write the new content back to the file
    Set-Content -Path $file.FullName -Value $newContent
    
    Write-Host "Updated $($file.FullName)"
}

Write-Host "All TypeScript files in src/tools have been updated."