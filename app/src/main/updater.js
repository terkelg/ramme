const {autoUpdater, ipcMain} = require('electron')
const isDev = require('electron-is-dev')
const ms = require('ms')
const {version} = require('../../package')
const isPlatform = require('./../common/is-platform')

const FEED_URL = `https://nuts-serve-gapvnvvtee.now.sh/update/${process.platform}/${version}`

function createInterval () {
  return setInterval(() => {
    autoUpdater.checkForUpdates()
  }, ms('30m'))
}

exports.init = window => {
  if (isDev || isPlatform('linux')) {
    return
  }

  autoUpdater.setFeedURL(FEED_URL)

  // at this point the app is fully started and ready for updating
  setTimeout(() => {
    autoUpdater.checkForUpdates()
  }, ms('5s'))

  let intervalId = createInterval()

  autoUpdater.on('update-available', () => {
    clearInterval(intervalId)
    intervalId = undefined
  })

  autoUpdater.on('update-downloaded', () => {
    window.webContents.send('update-downloaded')
  })

  ipcMain.on('install-update', () => {
    autoUpdater.quitAndInstall()
  })

  autoUpdater.on('error', err => {
    if (intervalId === undefined) { // if the error occurred during the download
      intervalId = createInterval()
    }

    console.log('Error fetching updates', err)
  })
}
