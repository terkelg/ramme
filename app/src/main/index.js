import * as path from 'path'
import * as fs from 'fs'
import { BrowserWindow, app, Menu, ipcMain, shell } from 'electron'

import createTray from './tray'
import appMenu from './menus'

import config from './config'
import updater from './updater'
import * as analytics from './analytics'
import isPlatform from './../common/is-platform'

let mainWindow
const renderer = {
  styles: '../renderer/styles',
  js: '../renderer/js'
}

require('electron-debug')({showDevTools: true})

/**
 * Singleton
 */
let shouldQuit = app.makeSingleInstance(() => {
  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
  }
})

if (shouldQuit) {
  app.quit()
}

/**
 * Kick off!
 */
app.on('ready', () => {
  // Create window
  mainWindow = createMainWindow()

  // Create menus
  Menu.setApplicationMenu(appMenu)
  createTray(mainWindow)

  // Update and analytics
  updater(mainWindow)
  analytics.init()

  // Setup events
  setupWebContentsEvents(mainWindow.webContents)
})

app.on('activate', () => {
  mainWindow.show()
})

app.on('before-quit', () => {
  shouldQuit = true
  config.set('lastWindowState', mainWindow.getBounds())
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
 * CreateMainWindow
 **/
function createMainWindow () {
  const lastWindowState = config.get('lastWindowState')
  const isDarkMode = config.get('darkMode')
  const userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1'
  const rammeDesktopIcon = path.join(__dirname, '../static/icon.png')
  const maxWidthValue = 550
  const minWidthValue = 460

  // Create the browser window.
  const win = new BrowserWindow({
    title: app.getName(),
    show: false,
    x: lastWindowState.x,
    y: lastWindowState.y,
    minHeight: 400,
    minWidth: minWidthValue,
    maxWidth: maxWidthValue,
    width: lastWindowState.width,
    height: lastWindowState.height,
    maximizable: false,
    fullscreenable: false,
    icon: isPlatform('linux') && rammeDesktopIcon,
    titleBarStyle: 'hidden-inset',
    darkTheme: isDarkMode,
    backgroundColor: isDarkMode ? '#192633' : '#fff',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, renderer.js, 'index.js'),
      nodeIntegration: false
    }
  })

  // Fake user agent to get mobile version of the site
  win.webContents.setUserAgent(userAgent)
  win.loadURL('https://www.instagram.com/')

  // Create eventd
  setupWindowEvents(win)

  return win
}

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
    mainWindow.show()
  })

  // Open links in external applications
  page.on('new-window', (e, url) => {
    e.preventDefault()
    shell.openExternal(url)
  })
}
