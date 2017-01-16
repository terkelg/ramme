import { autoUpdater, ipcMain } from 'electron'
import isDev from 'electron-is-dev'
import ms from 'ms'
import { version } from '../../package'
import isPlatform from './../common/is-platform'

const FEED_URL = `https://nuts-serve-gapvnvvtee.now.sh/update/${process.platform}/${version}`

function createInterval () {
  return setInterval(() => {
    autoUpdater.checkForUpdates()
  }, ms('30m'))
}

function init (window) {
  if (isDev || isPlatform('linux')) {
    return
  }

  autoUpdater.setFeedURL(FEED_URL)

  setTimeout(() => {
    autoUpdater.checkForUpdates()
  }, ms('5s')) // at this point the app is fully started and ready for updating

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
export { init as default }
