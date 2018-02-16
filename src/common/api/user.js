import { V1 as api } from 'instagram-private-api'
import settings from 'electron-settings'
import hasha from 'hasha'
import { inspect } from 'util'
import utils from '../utils'

let user = settings.get('currentUser')

// Set session from cookie file
const loadSession = async user => {
  let path = utils.buildPath(user.hash)
  let device = new api.Device(user.username)
  let storage = new api.CookieFileStorage(path)
  if (storage) {
    return new api.Session(device, storage)
  } else {
    let file = await createSessionFile(user)
    if (file) console.log('Session File Created')
    return false
  }
}

const createSession = async (user, password) => {
  let path = utils.buildPath(user.hash)
  let device = new api.Device(user.username)
  let storage = new api.CookieFileStorage(path)
  if (storage) {
    try {
      let conn = await api.Session.create(device, storage, user.username, password)
      return conn
    } catch (e) {
      return e
    }
  } else {
    try {
      let file = await createSessionFile(user)
      if (!file) {
        console.log('error')
      }
      return false
    } catch (e) {
      console.log('here', e)
    }
  }
}

const createSessionFile = async user => {
  user.hash = hasha(user)
  let path = await utils.createFile(utils.buildPath(user.hash))
  return path
}

// Check if user logged in
const isLoggedIn = async () => {
  if (user) {
    try {
      let session = await loadSession(user)
      let account = await session.getAccount()
      return account.hasOwnProperty('_params')
    } catch (e) {
      return false
    }
  }
}

// Perform login
const doLogin = async (username, password) => {
  if (typeof user === 'undefined' || !user.hasOwnProperty('hash')) {
    let userData = {
      username: username,
      hash: hasha(username, {
        algorithm: 'md5'
      })
    }
    settings.set('currentUser', userData)
    user = settings.get('currentUser')
  }

  let session = await createSession(user, password)
  return session
}

// Do 2FA login
const do2FALogin = async (session, code) => {
  return api.Web.Challenge.code(code)
}

// Get user data
const get = async () => {
  if (user) {
    try {
      let session = await loadSession(user)
      let account = await session.getAccount()
      let profile = await api.Account.showProfile(session)
      return Object.assign({}, account._params, profile)
    } catch (e) {
      return false
    }
  }
}

// Get user data
const getMedia = async (cursor = null) => {
  if (user) {
    try {
      let session = await loadSession(user)
      let account = await session.getAccount()
      let feed = new api.Feed.UserMedia(session, account._params.id)

      if (cursor) feed.setCursor(cursor)

      let q = await feed.get()

      return q.map(el => {
        return {
          images: el._params.images,
          id: el.id,
          url: el._params.webLink
        }
      })
    } catch (e) {
      return false
    }
  }
}

// Get activity
const getFollowers = async (cursor = null) => {
  if (user) {
    try {
      let session = await loadSession(user)
      let account = await session.getAccount()
      let feed = new api.Feed.AccountFollowers(session, account._params.id)

      if (cursor) feed.setCursor(cursor)

      let q = await feed.get()

      return q.map(el => {
        return {
          events: el._events,
          eventsCount: el._eventsCount,
          params: el._params
        }
      })
    } catch (e) {
      return false
    }
  }
}

// Get activity
const getActivity = async (cursor = null) => {
  if (user) {
    try {
      let session = await loadSession(user)
      // let account = await session.getAccount()
      return new api.Request(session)
        .setMethod('GET')
        .setResource('news')
        .send()
        .then(function (json) {
          console.log(inspect(json))
          return inspect(json)
        })
    } catch (e) {
      return false
    }
  }
}

export default {
  isLoggedIn,
  doLogin,
  do2FALogin,
  get,
  getMedia,
  getFollowers,
  getActivity
}
