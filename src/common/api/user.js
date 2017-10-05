import { V1 as api } from 'instagram-private-api'
import { flatten } from 'lodash'
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
const isLoggedIn = async () => {
  if (user) {
    let session = await loadSession(user)
    let account = await session.getAccount()
    return account.hasOwnProperty('_params')
  }
}

// Get user data
const getUser = async () => {
  if (user) {
    let session = await loadSession(user)
    let account = await session.getAccount()
    return account._params
  }
}

// Get user data
const getUserMedia = async (page = 1, limit = 1) => {
  if (user) {
    let session = await loadSession(user)
    let account = await session.getAccount()
    let feed = new api.Feed.UserMedia(session, account._params.id)
    let media = []

    feed.setCursor(page)

    for (let i = page; i <= limit; i++) {
      media.push(await feed.get())
      if (!feed.isMoreAvailable()) break
    }

    media = flatten(media)

    let urls = media.map(medium => {
      return {
        images: medium._params.images,
        id: medium._params.id,
        url: medium._params.webLink
      }
    })

    return urls
  }
}

export {
  isLoggedIn,
  getUser,
  getUserMedia
}
