'use strict';
const path = require('path');
const electron = require('electron');

const app = electron.app;
const appName = app.getName();

let trayicon = path.join(__dirname, 'static/icon-18x18.png');
if (process.platform === 'win32') {
  trayicon = path.join(__dirname, 'static/icon.ico');
}
let tray = null;

exports.create = win => {
  tray = new electron.Tray(trayicon)
  const contextMenu = electron.Menu.buildFromTemplate([
    {label: `Show ${appName}`, click: function () {win.show();}},
    {label: `Quit ${appName}`, click: function () {app.quit();}}
  ])
  tray.setToolTip(appName)
  tray.setContextMenu(contextMenu)
  tray.on('click', function handleClicked () {
    if (win.isMinimized()) {
      win.restore();
    } else if (win.isVisible()) {
      win.close();
    } else {
      win.show();
    }
  });
};
