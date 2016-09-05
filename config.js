const Config = require('electron-config');

module.exports = new Config({
  defaults: {
    darkMode: false,
    zoomFactor: 1,
    lastWindowState: {
      width: 414,
      height: 700
    }
  }
});
