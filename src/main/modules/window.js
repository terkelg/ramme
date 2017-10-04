'use strict'

import { BrowserWindow, Menu } from 'electron'
import windowStateKeeper from 'electron-window-state'
import Positioner from 'electron-positioner'

class WindowUtils {
  constructor (options = {}) {
    const opt = {}

    this.options = Object.assign({}, opt, options)
    this.winURL = process.env.NODE_ENV === 'development'
      ? 'http://localhost:9080'
      : `file://${__dirname}/index.html`
  }

  create (appIcon) {
    const mainWindowState = windowStateKeeper({
      defaultWidth: 440,
      defaultHeight: 580
    })

    const mainWindowOptions = {
      'x': mainWindowState.x,
      'y': mainWindowState.y,
      'width': mainWindowState.width,
      'height': mainWindowState.height,
      useContentSize: true,
      'minWidth': 440,
      'minHeight': 580,
      backgroundColor: '#ffffff',
      show: false
    }

    if (process.platform === 'darwin') {
      mainWindowOptions.titleBarStyle = 'hidden'
      mainWindowOptions.fullscreen = false
      mainWindowOptions.fullscreenable = false
    } else if (['win32', 'linux'].includes(process.platform)) {
      mainWindowOptions.frame = false
    }

    let mainWindow = new BrowserWindow(mainWindowOptions)

    const positioner = new Positioner(mainWindow)

    if (!mainWindowState.x && !mainWindowState.y) {
      positioner.move('center')
    }

    mainWindowState.manage(mainWindow)
    mainWindow.loadURL(this.winURL)

    if (process.env.NODE_ENV === 'development') {
      mainWindow.webContents.openDevTools()
    }

    mainWindow.on('closed', () => {
      mainWindow = null
    })

    mainWindow.webContents.on('did-finish-load', () => {
      const origMenu = Menu.getApplicationMenu()
      mainWindow.webContents.send('log', 'menubar', [mainWindow.isMenuBarVisible(), mainWindow.isMenuBarAutoHide(), origMenu])
    })

    mainWindow.once('ready-to-show', () => {
      mainWindow.show()
    })

    return mainWindow
  }
}

export default function (opts) {
  return new WindowUtils(opts)
}
