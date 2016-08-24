'use strict';
const Config = require('electron-config');

module.exports = new Config({
  defaults: {
    darkMode: true,
    zoomFactor: 1,
    lastWindowState: {
      width: 414,
      height: 700
    }
  }
});
