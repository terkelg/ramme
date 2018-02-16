import { ipcMain } from 'electron'
import api from '../../common/api'

export default function () {
  ipcMain.on('doLogin', async (event, arg) => {
    let user = await api.user.doLogin(arg.account.username, arg.account.password)
    event.sender.send('doLogin:res', user)
  })

  ipcMain.on('do2FALogin', async (event, arg) => {
    let user = await api.user.do2FALogin(arg.account.session, arg.account.code)
    event.sender.send('doLogin:res', user)
  })

  ipcMain.on('getUser', async (event, arg) => {
    let user = await api.user.get()
    event.sender.send('getUser:res', user)
  })

  ipcMain.on('getUserFeed', async (event, cursor) => {
    let media = await api.media.getFeed(cursor)
    event.sender.send('getUserFeed:res', media)
  })

  ipcMain.on('getUserMedia', async (event, cursor) => {
    let media = await api.user.getMedia(cursor)
    event.sender.send('getUserMedia:res', media)
  })

  ipcMain.on('getActivity', async (event, cursor) => {
    let activity = await api.user.getActivity(cursor)
    event.sender.send('getActivity:res', activity)
  })

  ipcMain.on('getMedia', async (event, post) => {
    let media = await api.media.get(post)
    event.sender.send('getMedia:res', media)
  })

  ipcMain.on('likeMedia', async (event, post) => {
    let media = await api.media.like(post)
    event.sender.send('likeMedia:res', media)
  })

  ipcMain.on('getMediaComments', async (event, id) => {
    let comments = await api.media.getComments(id)
    event.sender.send('getMediaComments:res', comments)
  })
}
