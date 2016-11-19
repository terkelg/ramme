import * as path from 'path'
import isPlatform from './../common/is-platform'
import {app, shell, Tray, Menu} from 'electron'

let tray = null

/**
 * Create a tray for Windows and Linux users
 * @param win { BrowserWindow } - window instance
 * @returns tray
 */
const createTray = win => {
  if (isPlatform('macOS') || tray) {
    return
  }

  // Set tray icon
  const trayIconDefault = path.join(__dirname, '../static/icon-18x18.png')
  const trayIconWindows = path.join(__dirname, '../static/icon.ico')
  let icon = isPlatform('windows') ? trayIconWindows : trayIconDefault

  // TODO: Remove from here, and use evennts instead
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
  tray = new Tray(icon)

  const contextMenu = [{
    label: 'Toggle', click () { toggleWin() } },
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
    }]

  tray.setToolTip(`${app.getName()}`)
  tray.setContextMenu(Menu.buildFromTemplate(contextMenu))
  tray.on('click', () => {
    toggleWin()
  })

  // return tray
}

export { createTray as default }
