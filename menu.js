'use strict'
const os = require('os')
const fs = require('fs')
const path = require('path')
const electron = require('electron')
const version = require('./version')

const app = electron.app
const BrowserWindow = electron.BrowserWindow
const shell = electron.shell
const appName = app.getName()


function sendAction (action) {
  const win = BrowserWindow.getAllWindows()[0]

  if (process.platform === 'darwin') {
    win.restore()
  }

  win.webContents.send(action)
}

function changeProfile (from, to) {
  // Get Window objext
  const win = BrowserWindow.getAllWindows()[0]

  // Build storage paths
  const pathBase = app.getPath('userData') + '/profile-'
  let readFrom = pathBase + from + '.json'
  let writeTo = pathBase + to + '.json'

  // Get Session data
  const ses = win.webContents.session

  // Get Session Cookies
  ses.cookies.get({}, (error, cookies) => {
    if (error) throw error

    // Save them to a file
    fs.writeFile(writeTo, JSON.stringify(cookies))

    // Remove each Cookie
    cookies.forEach(function (cookie) {
      ses.cookies.remove('https://www.instagram.com', cookie.name, (error) => {
        if (error) console.error('Removing: ' + error)
      })
    })
  })

  // Check if other profile was already set
  fs.exists(readFrom, function (exists) {
    if (exists) {
      // Try reading from new profile
      fs.readFile(readFrom, 'utf8', function (error, data) {
        if (error) throw error

        // Check if any data in profile
        if (data.length > 0) {
          // Try parsing cookies
          let cookies = JSON.parse(data)

          // Check again to see if any cookie there
          if (cookies.length > 0) {
            // Set cookies for current session
            cookies.forEach(function (cookie) {
              // Make sure they match current domain to avoid errors
              if (cookie.domain.match(/instagram.com/g)) {
                // Really set them
                ses.cookies.set({
                  url: 'https://www.instagram.com',
                  domain: cookie.domain,
                  name: cookie.name,
                  value: cookie.value,
                  path: cookie.path,
                  secure: cookie.secure,
                  httpOnly: cookie.httpOnly,
                  expirationDate: cookie.expirationDate
                }, (error) => {
                  if (error) console.error('Setting: ' + error)
                })
              }
            })
          }
        }
      })
    }
  })

  // Go back to home
  win.loadURL('https://www.instagram.com')
}

const helpSubmenu = [
  {
    label: 'Check for Updates...',
    click () {
      version.check()
    }
  },
  {
    type: 'separator'
  },
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
      electron.dialog.showMessageBox({
        title: `About ${appName}`,
        message: `${appName} ${app.getVersion()}`,
        detail: 'Created by Terkel Gjervig',
        icon: path.join(__dirname, 'static/icon.png'),
        buttons: []
      })
    }
  })
}

const template = [
  {
    label: 'Edit',
    submenu: [
      {
        label: 'Back',
        accelerator: 'Backspace',
        enabled: false,
        click () {
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
    submenu: [
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click (item, focusedWindow) {
          if (focusedWindow) focusedWindow.reload()
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
        label: 'Notifications',
        accelerator: 'CmdOrCtrl+3',
        click () {
          sendAction('navigate-notifications')
        }
      },
      {
        label: 'Profile',
        accelerator: 'CmdOrCtrl+4',
        click () {
          sendAction('navigate-profile')
        }
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
        role: 'resetzoom'
      },
      {
        role: 'zoomin'
      },
      {
        role: 'zoomout'
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
      }
    ]
  },
  {
    label: 'Profile',
    submenu: [
      {
        label: 'Profile 1',
        click () {
          changeProfile(1, 2)
        }
      },
      {
        label: 'Profile 2',
        click () {
          changeProfile(2, 1)
        }
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
]

if (process.platform === 'darwin') {
  template.unshift({
    label: appName,
    submenu: [
      {
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
  )
  // Window menu.
  template[4].submenu = [
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
  ]
}

// const darwinTpl = [{}];
// const otherTpl = [{}];

// const tpl = process.platform === 'darwin' ? darwinTpl : otherTpl;

module.exports = electron.Menu.buildFromTemplate(template)
