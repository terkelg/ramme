const path = require('path')
const {app, BrowserWindow, ipcMain} = require('electron')
const config = require('./config')
const isPlatform = require('./../common/is-platform')

/**
 * API
 */

let registered_windows = {}
let current_windows = {}

// [function] Register Window
function registerWindow (name, def) {
  const url = def.url
  const useLastState = def.useLastState
  const fakeUserAgent = def.fakeUserAgent
  const defaultWindowEvents = def.defaultWindowEvents
  const isDarkMode = config.get('darkMode') || false
  const userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1'

  delete def.useLastState
  delete def.fakeUserAgent
  delete def.defaultWindowEvents
  delete def.url

  def.icon = isPlatform('linux') && path.join(__dirname, '../assets/icon.png'),
  def.title = def.title || app.getName()
  def.darkTheme = isDarkMode
  def.backgroundColor = isDarkMode ? '#192633' : '#fff'

  registered_windows[name] = {
    'def': def,
    'options': {
      url: url,
      agent: fakeUserAgent ? userAgent : null,
      defaultWindowEvents: defaultWindowEvents,
      useLastState: useLastState
    }
  }

  return true
}

// [function] Open Window
function openWindow (name) {
  if (registered_windows[name]) {
    const wanted = registered_windows[name]

    // Restore window size if useLastState
    if (wanted.options.useLastState) {
      const lastWindowState = config.get(name + "LastState")
      wanted.def.x = lastWindowState.x
      wanted.def.y = lastWindowState.y
      wanted.def.width = lastWindowState.width
      wanted.def.height = lastWindowState.height
    }

    const win = new BrowserWindow(wanted.def)

    if (win) {
      if (wanted.options.agent) {
        win.webContents.setUserAgent(wanted.options.agent)
      }

      // Create eventd if enabled
      if (wanted.options.defaultWindowEvents) {
        setupWindowEvents(win)
      }

      // Load URL
      if (wanted.options.url) {
        win.loadURL(wanted.options.url)
      }

      // Add save size event
      if (wanted.options.useLastState) {
        win.on('close', e => {
          config.set(name + "LastState", win.getBounds())
        })
      }

      // Add de-reference event
      win.on('closed', e => {
        delete current_windows[name]
      })

      // Setup reference
      current_windows[name] = win

      return win
    }
  }
}

// [function] Get window
function getWindow (name) {
  if (current_windows[name]) {
    return current_windows[name]
  }
}

// [function] Window(s) is/are open
function isOpen (name) {
  if (name && current_windows[name]) {
    return true
  }
}

// [function] Count open windows
function countOpen () {
  return Object.keys(current_windows).length
}

// [function] Close window
function closeWindow (name) {
  if (current_windows[name]) {
    current_windows[name].close()
    return true
  }
}

// [function] LoadURL
function loadURL (name, url) {
  if (current_windows[name] && url) {
    current_windows[name].loadURL(url)
  }
}

// [function] For each window
function each (func) {
  if (countOpen() > 0) {
    for (var name in current_windows) {
      if (current_windows.hasOwnProperty(name)) {
        func(current_windows[name])
      }
    }
    return true
  }
}

/**
 * IPC
 */

ipcMain.on('window-open', function (event, name) {
  openWindow(name)
})

ipcMain.on('window-close', function (event, name) {
  closeWindow(name)
})

ipcMain.on('window-load', function (event, name, url) {
  loadURL(name, url)
})

/**
 * Exposed Functions
 */

module.exports = {
  register: registerWindow,
  open: openWindow,
  get: getWindow,
  isOpen: isOpen,
  countOpen: countOpen,
  close: closeWindow,
  load: loadURL,
  each: each
}
