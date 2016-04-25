#!/bin/bash

####### Modify this script depends on your environment #######

# Why we not using webpack uglifyjs plugin? I don't know, compiled version not running when I was trying to run it
sudo uglifyjs app/unobuilder.js -o app/unobuilder.js
sudo uglifyjs app/unobuilder.viewer.js -o app/unobuilder.viewer.js

# Copy distribution into github pages
sudo mkdir -p ../unobuilder-page/unobuilder
sudo cp -R app/ ../unobuilder-page/unobuilder/app/
sudo cp index.html ../unobuilder-page/unobuilder/index.html
sudo cp viewer.html ../unobuilder-page/unobuilder/viewer.html

# Remove distribtion source, except jquery and uikit
sudo rm -rf app

# Okay, done
echo "Finish"