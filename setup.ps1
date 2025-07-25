# Create required directories
mkdir -Force utils, components, downloads

# Download project files
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/futureofworktraining/vide_coding_webautomation/with-images-and-video/automation_template.js" -OutFile "./automation.js"
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/futureofworktraining/vide_coding_webautomation/with-images-and-video/package.json" -OutFile "./package.json"

# Download utility scripts
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/futureofworktraining/vide_coding_webautomation/with-images-and-video/get_cleared_HTML_code.js" -OutFile "./utils/get_cleared_HTML_code.js"
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/futureofworktraining/vide_coding_webautomation/with-images-and-video/video_recorder.js" -OutFile "./utils/video_recorder.js"
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/futureofworktraining/vide_coding_webautomation/with-images-and-video/dialog_handler.js" -OutFile "./utils/dialog_handler.js"

# Install dependencies
Write-Host "Installing dependencies..."
npm i

Write-Host "Setup complete. Removing setup script..."

# Clean up the setup script by removing itself. This is the last command to be executed.
Remove-Item -Path $MyInvocation.MyCommand.Path -Force

Write-Host "Setup complete."
