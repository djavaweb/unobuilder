const copy = require('ncp')
const mkdirp = require('mkdirp')
const path = require('path')
const rootDirectory = path.resolve(__dirname, '../')
const modulesDirectory = path.join(rootDirectory, 'node_modules')
const assetsDirectory = path.join(rootDirectory, 'src', 'assets')

// Copy UIkit Dist to assets
const uikitSrcDir = path.join(modulesDirectory, 'uikit', 'dist')
const uikitDstDir = path.join(assetsDirectory, 'uikit')

// Copy css.min
mkdirp(path.join(uikitDstDir, 'css'), function (err) {
  if (err) return console.error(err)
  copy(path.join(uikitSrcDir, 'css'), path.join(uikitDstDir, 'css'), err => {
    if (err) return console.log(err)
    console.log('UIKit CSS was copied.')
  })
})
