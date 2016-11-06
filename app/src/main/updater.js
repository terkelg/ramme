import { autoUpdater, ipcMain } from 'electron'
import isDev from 'electron-is-dev'
import ms from 'ms'
import * as os from 'os'
import { version } from '../../package'

const FEED_URL = `https://nuts-serve-gapvnvvtee.now.sh/update/${os.platform()}/${version}`

function createInterval () {
  return setInterval(() => {
    autoUpdater.checkForUpdates()
  }, ms('30m'))
}

function init (window) {
  if (isDev) {
    return
  }

  autoUpdater.setFeedURL(FEED_URL)

  setTimeout(() => {
    //console.log('checking')
    autoUpdater.checkForUpdates()
  }, ms('5s')) // at this point the app is fully started and ready for everything

  let intervalId = createInterval()

  autoUpdater.on('update-available', () => {
    clearInterval(intervalId)
    intervalId = undefined
    //console.log('update available, starting download')
  })

  autoUpdater.on('update-downloaded', () => {
    //console.log('update downloaded, will notify the user')
    window.webContents.send('update-downloaded')
  })

  ipcMain.on('install-update', () => {
    autoUpdater.quitAndInstall()
  })

  autoUpdater.on('error', err => {
    if (intervalId === undefined) { // if the error occurred during the download
      intervalId = createInterval()
    }

    // console.log('Error fetching updates', err)
    // reporter.report(err)
  })
}
export { init as default }
