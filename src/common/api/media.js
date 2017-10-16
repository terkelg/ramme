import { V1 as api } from 'instagram-private-api'
import settings from 'electron-settings'
import utils from '../utils'

const user = settings.get('currentUser')

// Set session from cookie file
const loadSession = user => {
  let path = utils.buildPath(user.hash)
  let device = new api.Device(user.username)
  let storage = new api.CookieFileStorage(path)
  return new api.Session(device, storage)
}

// Check if user logged in
const get = async id => {
  if (user) {
    let session = await loadSession(user)
    let media = await api.Media.getById(session, id)
    return media
  }
}

// Add like to post
const like = async post => {
  if (user) {
    let session = await loadSession(user)
    let media

    if (post.hasLiked) {
      media = await api.Like.destroy(session, post.id)
    } else {
      media = await api.Like.create(session, post.id)
    }

    if (media) {
      return get(post.id)
    }

    return false
  }
}

// Get post comments
const getComments = async id => {
  if (user) {
    let session = await loadSession(user)
    let comments = new api.Feed.MediaComments(session, id)
    let q = await comments.get()
    return q
  }
}

export default {
  get,
  like,
  getComments
}
