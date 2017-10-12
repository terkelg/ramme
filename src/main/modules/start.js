import {
  app,
  globalShortcut,
  ipcMain,
  Tray,
  nativeImage
} from 'electron'
import utilsWindowLib from './window'
import communication from './communication'

class Startapp {
  constructor (options = {}) {
    const opt = {
      queueConcurrency: 3,
      settingsWindow: null,
      window: null
    }

    this.options = Object.assign({}, opt, options)

    this._window = this.options.window
    this.shouldQuit = false
    this.appIcon = null

    this.utilsWindow = utilsWindowLib()
  }

  get window () {
    return this._window
  }

  set window (value) {
    this._window = value
  }

  init () {
    this.appReady()
    this.appWindowAllClosed()
    this.appActivate()
    this.appOpenUrl()
    this.ipcSetup()
    this.traySetup()

    communication()
  }

  makeSingleInstance () {
    this.shouldQuit = app.makeSingleInstance((commandLine) => {
      if (this.window) {
        if (this.window.isVisible()) {
          this.window.focus()
        }
      }
      return true
    })
    if (process.platform !== 'win32' && this.shouldQuit) {
      app.exit()
    }

    if (process.platform === 'win32') {
      if (this.shouldQuit) {
        app.exit()
      }
    }
  }

  ipcSetup () {
    ipcMain.on('minimize', event => {
      this.window.isVisible() ? this.window.hide() : this.window.show()
    })
    ipcMain.on('close', event => {
      console.log(event)
    })
  }

  traySetup () {
    let size = process.platform === 'win32' ? '64x64.png' : '32x32.png'
    let icon = require('path').join(__dirname, '/../../../build/icons', size)
    let nicon = nativeImage.createFromPath(icon)

    app.on('ready', () => {
      this.options.tray = new Tray(nicon)
      this.options.tray.on('click', () => {
        this.window.isVisible() ? this.window.hide() : this.window.show()
      })
    })
  }

  appBeforeQuit () {
    app.on('before-quit', () => {
      // this.quitting = true
    })
  }

  appReady () {
    app.on('ready', () => {
      this.window = this.utilsWindow.create(this.appIcon)

      globalShortcut.register('CmdOrCtrl+Q', () => {
        app.exit()
      })
    })
  }

  appWindowAllClosed () {
    app.on('window-all-closed', () => {
      if (this.appIcon) {
        this.appIcon.destroy()
      }
      app.quit()
    })
  }

  appActivate () {
    app.on('activate', () => {
      if (this.window === null) {
        this.window = this.utilsWindow.create(this.appIcon)
      }
      if (this.window) {
        this.window.show()
      }
    })
  }

  appOpenUrl () {
    app.on('open-url', (event, url) => {
      event.preventDefault()
      if (this.window) {
        this.window.webContents.send('log', 'open-url', [event, url])
      }
    })
  }
}

export default function (opts) {
  return new Startapp(opts)
}
