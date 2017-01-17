import { ipcRenderer } from 'electron'
import config from '../../main/config'
import elementReady from 'element-ready'

const $ = document.querySelector.bind(document)

var post = 0

const selectors = {
  root: '#react-root ._onabe',
  loginButton: '#react-root ._fcn8k',
  notFoundPage: '.dialog-404'
}

ipcRenderer.on('toggle-dark-mode', () => {
  config.set('darkMode', !config.get('darkMode'))
  setDarkMode()
})

ipcRenderer.on('navigate-home', () => {
  const home = $('._n7q2c ._r1svv:nth-child(1) a')
  if (home) {
    home.click()
  }
})

ipcRenderer.on('navigate-discover', () => {
  const discover = $('._n7q2c ._r1svv:nth-child(2) a')
  if (discover) {
    discover.click()
  }
})

ipcRenderer.on('navigate-notifications', () => {
  const notifications = $('._n7q2c ._r1svv:nth-child(3) a')
  if (notifications) {
    notifications.click()
  }
})

ipcRenderer.on('navigate-profile', () => {
  const profile = $('._n7q2c ._r1svv:nth-child(4) a')
  console.log(profile)
  if (profile) {
    profile.click()
  }
})

ipcRenderer.on('navigate-up', () => {
  if (post > 1) {
    post -= 1
    var title = $('#react-root > section > main > section > div > div:nth-child(1) > article:nth-child(' + post + ') > header')
    var rect = title.getBoundingClientRect()
    window.scrollBy(0, rect.top)
  }
})

ipcRenderer.on('navigate-down', () => {
  post += 1
  var title = $('#react-root > section > main > section > div > div:nth-child(1) > article:nth-child(' + post + ') > header')
  var rect = title.getBoundingClientRect()
  window.scrollBy(0, rect.top)
})

function backHomeButton (location) {
  const body = $('body')
  const link = document.createElement('a')
  const element = document.createElement('div')

  link.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22.84 17.39"><polygon points="22.84 8.22 1.82 8.22 9.37 0.67 8.7 0 0 8.7 8.7 17.39 9.37 16.72 1.82 9.17 22.84 9.17 22.84 8.22"/></svg>'

  if ( location === 'home' )
    element.classList.add('back-btn')
  else
    element.classList.add('back-btn', 'inactive')

  element.appendChild(link)
  body.appendChild(element)

  link.addEventListener('click', event => {
    ipcRenderer.send(location)
  })

  ipcRenderer.on('set-button-state', (event, enabled) => {
    if (enabled) {
      element.classList.remove('inactive')
    } else {
      element.classList.add('inactive')
    }
  })
}

function login (elm) {
  elm.addEventListener('click', (e) => {
    elm.classList.toggle('goback')
    process.nextTick(() => {
      if (elm.classList.contains('goback')) {
        elm.innerText = 'Go back'
      } else {
        elm.innerText = 'Log In'
      }
    })
  })
}

function setDarkMode () {
  document.documentElement.classList.toggle('dark-mode', config.get('darkMode'))
}

function fix404() {
  // Add missing elements
  const span = $('.root')
  const section = $('.page')
  const nav = document.createElement('nav')

  let user = $('#link_profile a').href

  span.id = 'react-root'
  section.classList.add('_8f735')
  nav.classList.add('_onabe', '_5z3y6')

  nav.innerHTML = '<div class="_fjpuc _hykpq">\
        <div>\
          <div class="_bfc7q">\
            <div class="_4kdxu">\
              <div class="_n7q2c">\
                <div class="_r1svv">\
                  <a class="_gx3bg" href="/">\
                    <div class="_o5rm6 coreSpriteMobileNavHomeActive"></div>\
                  </a>\
                </div>\
                <div class="_r1svv">\
                  <a class="_gx3bg" href="/explore/">\
                    <div class="_o5rm6 coreSpriteMobileNavSearchInactive"></div>\
                  </a>\
                </div>\
                <div class="_r1svv">\
                  <a class="_gx3bg" href="/accounts/activity/">\
                    <div class="_o5rm6 coreSpriteMobileNavActivityInactive"></div>\
                  </a>\
                </div>\
                <div class="_r1svv">\
                  <a class="_gx3bg" href="' + user + '">\
                    <div class="_o5rm6 coreSpriteMobileNavProfileInactive"></div>\
                  </a>\
                </div>\
              </div>\
            </div>\
          </div>\
        </div>\
      </div>'

  section.appendChild(nav)

  $('.error-container p a').remove()

  // Add Back button
  backHomeButton('home')
}

function init () {

  setDarkMode()

  if (!$(selectors.notFoundPage)) {
    backHomeButton('back')
  }

  // Prevent flash of white on startup when in dark mode
  // TODO: Find solution to this with pure css
  if (config.get('darkMode')) {
    document.documentElement.style.backgroundColor = '#192633'
  }
}

document.addEventListener('DOMContentLoaded', (event) => {
  // enable OS specific styles
  document.documentElement.classList.add(`os-${process.platform}`)

  elementReady(selectors.notFoundPage).then(fix404)
  elementReady(selectors.root).then(init)
  elementReady(selectors.loginButton).then(login)
})
