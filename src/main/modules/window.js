'use strict'

import { BrowserWindow } from 'electron'
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
      x: mainWindowState.x,
      y: mainWindowState.y,
      width: mainWindowState.width,
      height: mainWindowState.height,
      useContentSize: true,
      minWidth: 440,
      minHeight: 580,
      backgroundColor: '#ffffff',
      show: false,
      frame: false
    }

    let mainWindow = new BrowserWindow(mainWindowOptions)

    const positioner = new Positioner(mainWindow)

    if (!mainWindowState.x && !mainWindowState.y) {
      positioner.move('center')
    }

    mainWindowState.manage(mainWindow)
    mainWindow.loadURL(this.winURL)

    mainWindow.on('closed', () => {
      mainWindow = null
    })

    mainWindow.once('ready-to-show', () => {
      mainWindow.show()
      if (process.env.NODE_ENV === 'development') {
        mainWindow.webContents.openDevTools()
      }
    })

    return mainWindow
  }
}

export default function (opts) {
  return new WindowUtils(opts)
}
