# UXE-MQTT-Publish
In HUB problem  js version is old change -> v20.15.0
npm version -> 10.7.0
```bash
 # Remove old version 
 sudo apt-get remove nodejs 
 # Using nvm (Node Version Manager)
 curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
 source ~/.bashrc
 nvm install 20.15.0
 nvm use 20.15.0
 # Verify the installation
 node -v
 npm -v
 # Install MQTT & axios
 npm list mqtt axios
 #Run the App
 node app.js
 


 
 