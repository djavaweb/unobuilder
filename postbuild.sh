#!/bin/bash

####### Modify this script depends on your environment #######

# Why we not using webpack uglifyjs plugin? I don't know, compiled version not running when I was trying to run it
sudo uglifyjs dist/js/unobuilder.js -o dist/js/unobuilder.js
sudo uglifyjs dist/js/viewer.js -o dist/js/viewer.js

# Copy distribution into github pages
sudo mkdir -p ../unobuilder-page/unobuilder/dist/
sudo cp -R dist/ ../unobuilder-page/unobuilder/dist/
sudo cp index.html ../unobuilder-page/unobuilder/index.html

# Remove distribtion source, except jquery and uikit
cd dist
sudo rm -rf *.woff
sudo rm -rf *.ttf
sudo rm -rf *.woff2
sudo rm -rf *.svg
sudo rm -rf unobuilder.js

# Okay, done
echo "Finish"