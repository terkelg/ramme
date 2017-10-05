import { V1 as api } from 'instagram-private-api'
import settings from 'electron-settings'
import utils from '../utils'

const user = settings.get('currentUser')

// Set session from cookie file
const loadSession = async user => {
  let path = utils.buildPath(user.hash)
  let device = new api.Device(user.username)
  let storage = new api.CookieFileStorage(path)
  return new api.Session(device, storage)
}

// Check if user logged in
const getPost = async id => {
  if (user) {
    let session = await loadSession(user)
    let media = await api.Media.getById(session, id)
    return media
  }
}

export {
  getPost
}
