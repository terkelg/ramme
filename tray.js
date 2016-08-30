const path = require('path');
const electron = require('electron');

const app = electron.app;
const shell = electron.shell;
const Tray = electron.Tray;
const Menu = electron.Menu;

const trayIconDefault = path.join(__dirname, 'static/icon-18x18.png');
const trayIconWindows = path.join(__dirname, 'static/icon.ico');
let tray = null;

exports.create = win => {
  if (process.platform === 'darwin' || tray) {
    return;
  }

  let icon = trayIconDefault;

  if (process.platform === 'win32') {
    icon = trayIconWindows;
  }

  const toggleWin = () => {
    if (process.platform === 'win32') {
      if (win.isMinimized()) {
        win.restore();
      } else if (win.isVisible()) {
        win.hide();
      } else {
        win.show();
      }
    } else {
      win.isVisible() ? win.hide() : win.show();
    }
  };

  // Create toolbar
  tray = new Tray(icon);

  const contextMenu = [{
    label: 'Toggle',
    click() {
      toggleWin();
      if (!win.isMinimized()) {
        win.minimize();
      } else {
        win.show();
      }
    }
  },
    {
      type: 'separator'
    },
    {
      label: 'GitHub',
      click() {
        shell.openExternal('https://github.com/terkelg/ramme');
      }
    },
    {
      label: 'Issue',
      click() {
        shell.openExternal('https://github.com/terkelg/ramme/issues');
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Quit',
      click() {
        app.quit();
      }
    }
  ];

  tray.setToolTip(`${app.getName()}`);
  tray.setContextMenu(Menu.buildFromTemplate(contextMenu));
  tray.on('click', () => {
<<<<<<< f3a6dae7446b377f842df0cc1195c0d9733e3f34
    toggleWin();
=======
    if (win.isVisible()) {
      win.hide();
    } else {
      win.show();
    }
>>>>>>> package shell
  });
};
