const path = require('path')
const fs = require('fs')
const {app, Menu, shell, ipcMain} = require('electron')
const tray = require('./tray')
const appMenu = require('./menus')

const updater = require('./updater')
const analytics = require('./analytics')
const isPlatform = require('./../common/is-platform')
const window = require('./window.js')

const renderer = {
  styles: '../../dist/renderer/styles',
  js: '../../dist/renderer/js'
}

/**
 * Singleton
 */
let shouldQuit = app.makeSingleInstance(() => {
  // Someone tried to run a second instance, we should focus our window.
  window.each(win => {
    if (win) {
      if (!win.isVisible()) {
        win.show()
      } else {
        if (win.isMinimized()) win.restore()
        win.focus()
      }
    }
  })
})

if (shouldQuit) {
  app.quit()
}

/**
 * Register Windows
 */

window.register('main', {
  url: 'https://www.instagram.com/',
  useLastState: true,
  fakeUserAgent: true,
  defaultWindowEvents: false,
  show: false,
  minHeight: 400,
  minWidth: 460,
  maxWidth: 550,
  maximizable: false,
  fullscreenable: false,
  titleBarStyle: 'hidden-inset',
  autoHideMenuBar: true,
  webPreferences: {
    preload: path.join(__dirname, renderer.js, 'index.js'),
    nodeIntegration: false
  }
})

window.register('preload', {
  url: path.join('file://', __dirname, '../renderer/html/preload.html'),
  useLastState: true,
  width: 200,
  height: 400,
  resizable: false,
  fullscreenable: false,
  maximizable: false,
  frame: false
})

/**
 * Kick off!
 */
app.on('ready', () => {
  // Open preload window
  window.open('preload')

  // Open main window
  let mainWindow = window.open('main')
  setupWindowEvents(mainWindow)

  // Create menus
  Menu.setApplicationMenu(appMenu)
  tray.createTray(mainWindow)

  // Update and analytics
  updater.init(mainWindow)
  analytics.init()

  // Setup events
  setupWebContentsEvents(mainWindow.webContents)
})

app.on('activate', () => {
  window.get('main').show()
})

app.on('before-quit', () => {
  shouldQuit = true
})

/**
 * Communicate with renderer process (web page)
 */
ipcMain.on('back', (e, arg) => {
  let page = e.sender.webContents
  if (page.canGoBack()) {
    page.goBack()
  }
})

ipcMain.on('home', (e, arg) => {
  let page = e.sender.webContents
  page.loadURL('https://www.instagram.com/')
  page.clearHistory()
})

/**
 * setupWindowEvents
 */
function setupWindowEvents (win) {
  win.on('close', e => {
    if (!shouldQuit) {
      e.preventDefault()

      if (isPlatform('macOS')) {
        app.hide()
      } else {
        win.hide()
      }
    }
  })

  win.on('page-title-updated', e => {
    e.preventDefault()
  })
}

/**
 * mainWindowEvents
 */
function setupWebContentsEvents (page) {
  page.on('did-navigate-in-page', (event, arg) => {
    // Get back menu item and disable/enable it
    const menuBackBtn = appMenu.items[1].submenu.items[0]
    menuBackBtn.enabled = page.canGoBack()
    // Notify back-button in sidebar about the state change
    page.send('set-button-state', menuBackBtn.enabled)
  })

  // Inject styles when dom is ready
  page.on('dom-ready', () => {
    page.insertCSS(fs.readFileSync(path.join(__dirname, renderer.styles, 'app.css'), 'utf8'))
    page.insertCSS(fs.readFileSync(path.join(__dirname, renderer.styles, 'theme-dark/main.css'), 'utf8'))

    window.close('preload') // Close preload window
    window.get('main').show() // Show main window
  })

  // Open links in external applications
  page.on('new-window', (e, url) => {
    e.preventDefault()
    shell.openExternal(url)
  })
}
