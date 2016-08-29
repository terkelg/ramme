'use strict';
const path     = require('path');
const electron = require('electron');

const app   = electron.app;
const shell = electron.shell;
const Tray  = electron.Tray;
const Menu  = electron.Menu;

const rammeTrayDefaultIcon = path.join(__dirname, 'static/icon-18x18.png');
const rammeTrayWindowsIcon = path.join(__dirname, 'static/icon.ico');
let tray = null;

exports.create = (win) => {
  let icon = rammeTrayDefaultIcon;

  if (process.platform === 'win32') {
    icon = rammeTrayWindowsIcon;
  }

  // Create toolbar
  tray = new Tray(icon);

  const contextMenu = [{
    label: 'Show / Hide',
    click() {
      !win.isMinimized() ? win.minimize() : win.show();
    }
  }, {
    label: 'GitHub',
    click() {
      shell.openExternal('https://github.com/terkelg/ramme');
    }
  }, {
    label: 'Issue',
    click() {
      shell.openExternal('https://github.com/terkelg/ramme/issues');
    }
  }, {
    label: 'Quit',
    click() {
      app.quit();
    }
  }];

  tray.setToolTip('ramme');
  tray.setContextMenu(Menu.buildFromTemplate(contextMenu));
  tray.on('click', () => {
    win.isVisible() ? win.hide() : win.show();
  });
};
