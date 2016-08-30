const os = require('os');
const path = require('path');
const electron = require('electron');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const shell = electron.shell;
const appName = app.getName();

function sendAction(action) {
  const win = BrowserWindow.getAllWindows()[0];

  if (process.platform === 'darwin') {
    win.restore();
  }

  win.webContents.send(action);
}

const helpSubmenu = [
  {
    label: `${appName} Website`,
    click() {
      shell.openExternal('https://github.com/terkelg/ramme');
    }
  },
  {
    label: 'Report an Issue...',
    click() {
      const body = `
            <!-- Please succinctly describe your issue and steps to reproduce it. -->

            -

            ${app.getName()} ${app.getVersion()}
            Electron ${process.versions.electron}
            ${process.platform} ${process.arch} ${os.release()}`;

      shell.openExternal(`https://github.com/terkelg/ramme/issues/new?body=${encodeURIComponent(body)}`);
    }
  }
];


if (process.platform !== 'darwin') {
  helpSubmenu.push({
    type: 'separator'
  }, {
    role: 'about',
    click() {
      electron.dialog.showMessageBox({
        title: `About ${appName}`,
        message: `${appName} ${app.getVersion()}`,
        detail: 'Created by Terkel Gjervig',
        icon: path.join(__dirname, 'static/icon.png'),
        buttons: []
      });
    }
  });
}


const template = [
  {
    label: 'Edit',
    submenu: [
      {
        label: 'Back',
        accelerator: 'Backspace',
        enabled: false,
        click() {
          const win = BrowserWindow.getAllWindows()[0];
          if (win.webContents.canGoBack()) {
            win.webContents.goBack();
          }
        }
      },
      {
        type: 'separator'
      },
      {
        role: 'undo'
      },
      {
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        role: 'cut'
      },
      {
        role: 'copy'
      },
      {
        role: 'paste'
      },
      {
        role: 'pasteandmatchstyle'
      },
      {
        role: 'delete'
      },
      {
        role: 'selectall'
      }
    ]
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click(item, focusedWindow) {
          if (focusedWindow) focusedWindow.reload();
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Home',
        accelerator: 'CmdOrCtrl+1',
        click() {
          sendAction('navigate-home');
        }
      },
      {
        label: 'Discover',
        accelerator: 'CmdOrCtrl+2',
        click() {
          sendAction('navigate-discover');
        }
      },
      {
        label: 'Notifications',
        accelerator: 'CmdOrCtrl+3',
        click() {
          sendAction('navigate-notifications');
        }
      },
      {
        label: 'Profile',
        accelerator: 'CmdOrCtrl+4',
        click() {
          sendAction('navigate-profile');
        }
      },
      {
        label: 'Toggle Dark Mode',
        accelerator: 'CmdOrCtrl+D',
        click() {
          sendAction('toggle-dark-mode');
        }
      },
      {
        type: 'separator'
      },
      {
        role: 'resetzoom'
      },
      {
        role: 'zoomin'
      },
      {
        role: 'zoomout'
      }
    ]
  },
  {
    role: 'window',
    submenu: [
      {
        role: 'minimize'
      },
      {
        role: 'close'
      }
    ]
  },
  {
    role: 'help',
    submenu: helpSubmenu
  }
];

if (process.platform === 'darwin') {
  template.unshift({
    label: appName,
    submenu: [
      {
        role: 'about',
      },
      {
        type: 'separator'
      },
      {
        label: 'Toggle Dark Mode',
        accelerator: 'CmdOrCtrl+D',
        click() {
          sendAction('toggle-dark-mode');
        }
      },
      {
        label: 'Refresh',
        accelerator: 'CmdOrCtrl+R',
        click() {
          sendAction('refresh-page');
        }
      },
      {
        type: 'separator'
      },
      {
        role: 'services',
        submenu: []
      },
      {
        type: 'separator'
      },
      {
        role: 'hide'
      },
      {
        role: 'hideothers'
      },
      {
        role: 'unhide'
      },
      {
        type: 'separator'
      },
      {
        role: 'quit'
      }
    ]
  });
  // Edit menu.
  template[1].submenu.push(
    {
      type: 'separator'
    },
    {
      label: 'Speech',
      submenu: [
        {
          role: 'startspeaking'
        },
        {
          role: 'stopspeaking'
        }
      ]
    }
  );
  // Window menu.
  template[3].submenu = [
    {
      label: 'Close',
      accelerator: 'CmdOrCtrl+W',
      role: 'close'
    },
    {
      label: 'Minimize',
      accelerator: 'CmdOrCtrl+M',
      role: 'minimize'
    },
    {
      label: 'Zoom',
      role: 'zoom'
    },
    {
      type: 'separator'
    },
    {
      label: 'Bring All to Front',
      role: 'front'
    }
  ];
}


// const darwinTpl = [{}];
// const otherTpl = [{}];

// const tpl = process.platform === 'darwin' ? darwinTpl : otherTpl;

module.exports = electron.Menu.buildFromTemplate(template);
