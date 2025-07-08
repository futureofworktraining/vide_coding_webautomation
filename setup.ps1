# Create required directories
mkdir -Force utils, components, downloads

# Download project files
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/futureofworktraining/vide_coding_webautomation/with-images-and-video/automation_template.js" -OutFile "./automation.js"
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/futureofworktraining/vide_coding_webautomation/with-images-and-video/package.json" -OutFile "./package.json"

# Download utility scripts
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/futureofworktraining/vide_coding_webautomation/with-images-and-video/get_cleared_HTML_code.js" -OutFile "./utils/get_cleared_HTML_code.js"
Invoke-WebRequest -Uri "https://raw.githubusercontent.comcom/futureofworktraining/vide_coding_webautomation/with-images-and-video/video_recorder.js" -OutFile "./utils/video_recorder.js"

# Install dependencies
Write-Host "Installing dependencies..."
npm install puppeteer xlsx

Write-Host "Setup complete."
