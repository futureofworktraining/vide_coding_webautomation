# Create required directories
mkdir -Force utils, components, downloads

# Download project files
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/futureofworktraining/vide_coding_webautomation/html_in_a_file/automation_template.js" -OutFile "./automation.js"
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/futureofworktraining/vide_coding_webautomation/html_in_a_filepackage.json" -OutFile "./package.json"

# Download utility scripts
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/futureofworktraining/vide_coding_webautomation/html_in_a_file/get_cleared_HTML_code.js" -OutFile "./utils/get_cleared_HTML_code.js"
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/futureofworktraining/vide_coding_webautomation/html_in_a_file/dialog_handler.js" -OutFile "./utils/dialog_handler.js"

# Install dependencies
Write-Host "Installing dependencies..."
npm install puppeteer xlsx

Write-Host "Setup complete. Removing setup script..."

# Clean up the setup script by removing itself. This is the last command to be executed.
Remove-Item -Path $MyInvocation.MyCommand.Path -Force

Write-Host "Setup complete."
