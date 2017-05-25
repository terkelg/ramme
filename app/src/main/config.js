const Config = require('electron-config')

const config = new Config({
  defaults: {
    darkMode: false,
    zoomFactor: 1,
    lastWindowState: {
      width: 460,
      height: 700
    }
  }
})
module.exports = config
