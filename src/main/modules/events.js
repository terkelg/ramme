import {
  app,
  ipcMain,
  BrowserWindow,
  globalShortcut
} from 'electron'
import utilsWindowLib from './window'
import {createFile from './utils'
const join = require('path').join

class Events {
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
    this.initIpc()
    this.initApp()
  }

  initApp () {
    this.appReady()
    this.appWindowAllClosed()
    this.appActivate()
    this.appOpenUrl()
  }

  initIpc () {
    this.ipcStore()
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

  toggleTray (vis) {
    if (!vis) {
      this.appIcon.destroy()
    } else {
      this.utilsTray.window = this.window
      this.appIcon = this.utilsTray.addIcon()
    }
  }

  toggleDock (vis) {
    if (process.platform === 'win32') {
      return
    }
    if (!vis) {
      app.dock.hide()
    } else {
      app.dock.show()
    }
  }

  ipcStore () {
    ipcMain.on('store', (event, arg) => {
      if (arg !== null) {
        let path = join(app.getPath('userData'), `${arg}.json`)
        createFile(path)
        event.sender.send('store:res', path)
      } else {
        event.sender.send('store:res', null)
      }
    })
  }

  ipcOpenSettingsWindow () {
    ipcMain.on('open-settings-window', function () {
      if (this.options.settingsWindow) {
        return
      }

      const settingsWindowOptions = {
        frame: false,
        height: 580,
        width: 440,
        minWidth: 440,
        minHeight: 580,
        resizable: true,
        minimizable: false,
        maximizable: false,
        useContentSize: true,
        backgroundColor: '#232421',
        parent: this.window || null,
        modal: true,
        show: false
      }

      this.options.settingsWindow = new BrowserWindow(settingsWindowOptions)
      const settingsURL = process.env.NODE_ENV === 'development'
        ? 'http://localhost:9080/#/settings'
        : `file://${__dirname}/index.html#settings`

      this.options.settingsWindow.loadURL(settingsURL)
      this.options.settingsWindow.setMenuBarVisibility(false)

      this.options.settingsWindow.on('closed', function () {
        this.options.settingsWindow = null
      })

      this.options.settingsWindow.once('ready-to-show', () => {
        this.options.settingsWindow.show()
      })
    })
  }

  ipcShowTray () {
    ipcMain.on('show-tray', (event, vis) => {
      this.toggleTray(vis)
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
  return new Events(opts)
}
