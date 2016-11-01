'use strict'
const electron = require('electron')
const config = require('./config')
const elementReady = require('element-ready')

const ipcRenderer = electron.ipcRenderer
const $ = document.querySelector.bind(document)

var post = 0
var scrollCount = 0

const selectors = {
  root: '#react-root ._onabe',
  loginButton: '#react-root ._fcn8k'
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

function backButton () {
  const button = $('.back-btn')

  button.addEventListener('click', event => {
    ipcRenderer.send('back')
  })

  ipcRenderer.on('set-button-state', (event, enabled) => {
    if (enabled) {
      button.classList.remove('inactive')
    } else {
      button.classList.add('inactive')
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

function refresh () {
  const refreshArrow = $('.refresh-arrow')

  document.addEventListener('mousewheel', (e) => {
    if (e.wheelDelta >= 0 && window.pageYOffset === 0) {
      scrollCount += 1
    } else {
      scrollCount = 0 // Resets counter if user doesn't scroll up 3 times in a row
    }

    // If user scrolls up 3 times in a row refresh the page
    if (scrollCount === 3) {
      ipcRenderer.send('refresh')
      scrollCount = 0
    }
    switch (scrollCount) {
      case 2:
        refreshArrow.classList.remove('hidden')
        refreshArrow.classList.add('fadeIn')
        break
      case 3:
        ipcRenderer.send('refresh')
        scrollCount = 0
        break
      default:
        refreshArrow.classList.add('hidden')
        refreshArrow.classList.remove('fadeIn')
    }
  })
}

function injectHtml () {
  const body = $('body')

  const refreshArrowSymbol = document.createElement('span')
  const refreshArrow = document.createElement('div')

  const backButtonLink = document.createElement('a')
  const backButtonDiv = document.createElement('div')

  refreshArrowSymbol.innerHTML = '<h3>↑</h3></br><h4>Scroll up to refresh</h4>'
  refreshArrow.classList.add('refresh-arrow', 'hidden')
  refreshArrow.appendChild(refreshArrowSymbol)

  backButtonLink.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22.84 17.39"><polygon points="22.84 8.22 1.82 8.22 9.37 0.67 8.7 0 0 8.7 8.7 17.39 9.37 16.72 1.82 9.17 22.84 9.17 22.84 8.22"/></svg>'
  backButtonDiv.classList.add('back-btn', 'inactive')
  backButtonDiv.appendChild(backButtonLink)

  body.appendChild(refreshArrow)
  body.appendChild(backButtonDiv)
}

function init () {
  injectHtml()
  setDarkMode()
  backButton()
  refresh()

  // Prevent flash of white on startup when in dark mode
  // TODO: Find solution to this with pure css
  if (config.get('darkMode')) {
    document.documentElement.style.backgroundColor = '#192633'
  }
}

document.addEventListener('DOMContentLoaded', (event) => {
  // enable OS specific styles
  document.documentElement.classList.add(`os-${process.platform}`)

  elementReady(selectors.root).then(init)
  elementReady(selectors.loginButton).then(login)
})
