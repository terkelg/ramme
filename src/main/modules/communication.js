import { ipcMain } from 'electron'
import api from '../../common/api'

export default function () {
  ipcMain.on('doLogin', async (event, arg) => {
    let user = await api.user.doLogin(arg.account.username, arg.account.password)
    event.sender.send('doLogin:res', user)
  })

  ipcMain.on('getUser', async (event, arg) => {
    let user = await api.user.getUser()
    event.sender.send('getUser:res', user)
  })

  ipcMain.on('getUserFeed', async (event, arg) => {
    let media = await api.user.getUserFeed()
    event.sender.send('getUserFeed:res', media)
  })

  ipcMain.on('getUserMedia', async (event, arg) => {
    let media = await api.user.getUserMedia()
    event.sender.send('getUserMedia:res', media)
  })

  ipcMain.on('getMedia', async (event, post) => {
    let media = await api.media.getPost(post)
    event.sender.send('getMedia:res', media)
  })
}
