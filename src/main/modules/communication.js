import {ipcMain} from 'electron'
import {
  createFile,
  removeFile,
  buildPath
} from './utils'
import settings from 'electron-settings'
import hasha from 'hasha'

export class Communication {
  ipcLogin () {
    ipcMain.on('login', (event, arg) => {
      if (arg !== null) {
        // Remember current user
        settings.set('currentUser', {
          username: arg,
          hash: hasha(arg, {
            algorithm: 'md5'
          })
        })

        let user = settings.get('currentUser')

        // Create cookie file
        let path = buildPath(user.hash)
        createFile(path)

        // Reply
        event.sender.send('login:res', path)
      }
    })
  }

  ipcProfile () {
    ipcMain.on('profile', (event, action) => {
      if (action !== null && action.type !== null) {
        if (action.type === 'remove') {
          removeFile(action.path)
          event.sender.send('profile:rem', true)
        }

        if (action.type === 'get') {
          let user = settings.get('currentUser')
          user.path = buildPath(user.hash)
          event.sender.send('profile:res', user)
        }
      }
    })
  }

  ipcSetup () {
    this.ipcLogin()
    this.ipcProfile()
  }
}
