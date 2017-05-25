const path = require('path')
const {app, shell, nativeImage, Tray, Menu} = require('electron')

const isPlatform = require('./../common/is-platform')

let tray = null

/**
 * Create a tray for Windows and Linux users
 * @param win { BrowserWindow } - window instance
 * @returns tray
 */
exports.createTray = win => {
  if (isPlatform('macOS') || tray) {
    return
  }

  let iconName = null
  // Set tray icon
  if (isPlatform('windows')) {
    iconName = 'icon.icon'
  } else {
    iconName = 'icon-18x18.png'
  }

  const iconPath = nativeImage.createFromPath(path.join(__dirname, 'assets/' + iconName))
  const toggleWin = () => {
    if (isPlatform('windows')) {
      if (win.isMinimized()) {
        win.restore()
      } else if (win.isVisible()) {
        win.hide()
      } else {
        win.show()
      }
    } else {
      win.isVisible() ? win.hide() : win.show()
    }
  }

  // Create tray
  tray = new Tray(iconPath)

  const contextMenu = [
    {
      label: 'Toggle',
      click () {
        toggleWin()
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'GitHub',
      click () {
        shell.openExternal('https://github.com/terkelg/ramme')
      }
    },
    {
      label: 'Issue',
      click () {
        shell.openExternal('https://github.com/terkelg/ramme/issues')
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Quit',
      click () {
        app.quit()
      }
    }
  ]

  tray.setToolTip(`${app.getName()}`)
  tray.setContextMenu(Menu.buildFromTemplate(contextMenu))
  tray.on('click', () => {
    toggleWin()
  })

  // return tray
}
