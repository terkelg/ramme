'use strict';
const path     = require('path');
const fs       = require('fs');
const electron = require('electron');
const appMenu  = require('./menu');
const config   = require('./config');

const app      = electron.app;
const ipcMain  = electron.ipcMain;
const shell    = electron.shell;
const Tray     = electron.Tray;
const Menu     = electron.Menu;

require('electron-debug')();

const BrowserWindow = electron.BrowserWindow;

let mainWindow;
let isQuitting = false;
let tray = null;

const isAlreadyRunning = app.makeSingleInstance(() => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }

    mainWindow.show();
  }
});

if (isAlreadyRunning) {
  app.quit();
}

function createMainWindow() {
  const lastWindowState = config.get('lastWindowState');
  const isDarkMode = config.get('darkMode');
  const userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1';
  const rammeDesktopIcon = path.join(__dirname, 'static/icon.png');
  const rammeTrayDefaultIcon = path.join(__dirname, 'static/icon-18x18.png');
  const rammeTrayWindowsIcon = path.join(__dirname, 'static/icon.ico');
  const maxWidthValue = 550;
  const minWidthValue = 400;

  // Create the browser window.
  const win = new BrowserWindow({
    title: app.getName(),
    show: false,
    x: lastWindowState.x,
    y: lastWindowState.y,
    minHeight: 400,
    minWidth: minWidthValue,
    maxWidth: maxWidthValue,
    width: lastWindowState.width,
    height: lastWindowState.height,
    maximizable: false,
    fullscreenable: false,
    icon: process.platform === 'linux' && rammeDesktopIcon,
    titleBarStyle: 'hidden-inset',
    darkTheme: isDarkMode,
    backgroundColor: isDarkMode ? '#192633' : '#fff',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'browser.js'),
      nodeIntegration: false
    }
  });

  win.webContents.setUserAgent(userAgent);
  win.loadURL(`https://www.instagram.com`);

  win.on('close', e => {
    if (!isQuitting) {
      e.preventDefault();

      if (process.platform === 'darwin') {
        app.hide();
      } else {
        win.hide();
      }
    }
  });

  win.on('page-title-updated', e => {
    e.preventDefault();
    let icon = rammeTrayDefaultIcon;

    if (process.platform === 'win32') {
      icon = rammeTrayWindowsIcon;
    }

    // Create toolbar
    tray = new Tray(icon);

    const trayMenu = [{
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
    tray.setContextMenu(Menu.buildFromTemplate(trayMenu));
    tray.on('click', () => {
      win.isVisible() ? win.hide() : win.show();
    });
  });

  return win;
}

function sendAction(action) {
  const win = BrowserWindow.getAllWindows()[0];

  if (process.platform === 'darwin') {
    win.restore();
  }

  win.webContents.send(action);
}


app.on('ready', () => {
  electron.Menu.setApplicationMenu(appMenu);
  mainWindow = createMainWindow();

  const page = mainWindow.webContents;

  ipcMain.on('back', (event, arg) => {
    if (page.canGoBack()) {
      page.goBack();
    }
  });

  page.on('did-navigate-in-page', (event, arg) => {
    const menuBackBtn = appMenu.items[1].submenu.items[0];
    page.canGoBack() ? menuBackBtn.enabled = true : menuBackBtn.enabled = false;
    page.send('set-button-state', menuBackBtn.enabled);
  });

  page.on('dom-ready', () => {
    page.insertCSS(fs.readFileSync(path.join(__dirname, 'browser.css'), 'utf8'));
    page.insertCSS(fs.readFileSync(path.join(__dirname, 'dark-browser.css'), 'utf8'));
    mainWindow.show();
  });

  page.on('new-window', (e, url) => {
    e.preventDefault();
    electron.shell.openExternal(url);
  });
});

app.on('activate', () => {
  mainWindow.show();
});

app.on('before-quit', () => {
  isQuitting = true;

  config.set('lastWindowState', mainWindow.getBounds());
});
