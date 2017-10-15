const os = require('os')
const path = require('path')
const isPlatform = require('./../common/is-platform')
const {app, BrowserWindow, Menu, shell, dialog, nativeImage} = require('electron')
const config = require('./config')
const win = BrowserWindow.getAllWindows()[0]
const appName = app.getName()

function sendAction (action) {
  const win = BrowserWindow.getAllWindows()[0]
  if (isPlatform('macOS')) {
    win.restore()
  }

  win.webContents.send(action)
}

const helpSubmenu = [
  {
    label: `${appName} Website`,
    click () {
      shell.openExternal('https://github.com/terkelg/ramme')
    }
  },
  {
    label: 'Report an Issue...',
    click () {
      const body = `
            <!-- Please succinctly describe your issue and steps to reproduce it. -->

            -

            ${app.getName()} ${app.getVersion()}
            Electron ${process.versions.electron}
            ${process.platform} ${process.arch} ${os.release()}`

      shell.openExternal(`https://github.com/terkelg/ramme/issues/new?body=${encodeURIComponent(body)}`)
    }
  }
]

if (process.platform !== 'darwin') {
  helpSubmenu.push({
    type: 'separator'
  }, {
    role: 'about',
    click () {
      console.log(nativeImage.createFromPath(path.join(__dirname, 'assets/logo.png')))
      dialog.showMessageBox({
        title: `About ${appName}`,
        message: `${appName} ${app.getVersion()}`,
        detail: 'Created by Terkel Gjervig',
        icon: nativeImage.createFromPath(path.join(__dirname, 'assets/logo.png')),
        buttons: []
      })
    }
  })
}

const template = [{
  label: 'Edit',
  submenu: [{
    label: 'Back',
    accelerator: 'Backspace',
    enabled: false,
    click () {
      sendAction('go-back')
      const win = BrowserWindow.getAllWindows()[0]
      if (win.webContents.canGoBack()) {
        win.webContents.goBack()
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
  submenu: [{
    label: 'Reload',
    accelerator: 'CmdOrCtrl+R',
    click (item, focusedWindow) {
      if (focusedWindow) focusedWindow.reload()
    }
  },
  {
    label: 'Clear cache',
    click (item, focusedWindow) {
      if (focusedWindow) {
        focusedWindow.webContents.session.clearCache(() => {
          dialog.showMessageBox({
            message: 'Cache cleared correctly!'
          })
          focusedWindow.reload()
        })
      }
    }
  },
  {
    type: 'separator'
  },
  {
    label: 'Home',
    accelerator: 'CmdOrCtrl+1',
    click () {
      sendAction('navigate-home')
    }
  },
  {
    label: 'Discover',
    accelerator: 'CmdOrCtrl+2',
    click () {
      sendAction('navigate-discover')
    }
  },
  {
    label: 'Upload',
    accelerator: 'CmdOrCtrl+3',
    click () {
      sendAction('navigate-upload')
    }
  },
  {
    label: 'Notifications',
    accelerator: 'CmdOrCtrl+4',
    click () {
      sendAction('navigate-notifications')
    }
  },
  {
    label: 'Profile',
    accelerator: 'CmdOrCtrl+5',
    click () {
      sendAction('navigate-profile')
    }
  },
  {
    type: 'separator'
  },
  {
    label: 'Scroll a post up',
    accelerator: 'Shift+Up',
    click () {
      sendAction('navigate-up')
    }
  },
  {
    label: 'Scroll a post down',
    accelerator: 'Shift+Down',
    click () {
      sendAction('navigate-down')
    }
  },
  {
    type: 'separator'
  },
  {
    label: 'Logout',
    click () {
      win.webContents.session.clearStorageData(() => {
        win.webContents.loadURL('https://www.instagram.com/')
        dialog.showMessageBox({
          message: 'Logged out successfully!'
        })
      })
    }
  },
  {
    type: 'separator'
  },
  {
    type: 'checkbox',
    checked: config.get('darkMode'),
    label: 'Toggle Dark Mode',
    accelerator: 'CmdOrCtrl+D',
    click () {
      sendAction('toggle-dark-mode')
    }
  },
  {
    label: 'Toggle Developer Tools',
    type: 'checkbox',
    accelerator: (function () {
      if (process.platform === 'darwin') {
        return 'Alt+Command+I'
      } else {
        return 'Ctrl+Shift+I'
      }
    })(),
    click: function (item, focusedWindow) {
      if (focusedWindow) {
        focusedWindow.toggleDevTools()
      }
    }
  }
  ]
},
{
  role: 'window',
  submenu: [{
    role: 'minimize'
  }, {
    role: 'close'
  }, {
    role: 'quit'
  }]
},
{
  role: 'help',
  submenu: helpSubmenu
}
]

if (process.platform === 'darwin') {
  template.unshift({
    label: appName,
    submenu: [{
      role: 'about'
    },
    {
      type: 'separator'
    },
    {
      label: 'Toggle Dark Mode',
      accelerator: 'CmdOrCtrl+D',
      click () {
        sendAction('toggle-dark-mode')
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
  })
  // Edit menu.
  template[1].submenu.push({
    type: 'separator'
  }, {
    label: 'Speech',
    submenu: [{
      role: 'startspeaking'
    },
    {
      role: 'stopspeaking'
    }
    ]
  })
  // Window menu.
  template[3].submenu = [{
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
  ]
}

module.exports = Menu.buildFromTemplate(template)
