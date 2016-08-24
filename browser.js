'use strict';
const electron = require('electron');
const config = require('./config');
const elementReady = require('element-ready');

const ipcRenderer = electron.ipcRenderer;
const $ = document.querySelector.bind(document);

const selectors = {
  root: '#react-root ._onabe',
  loginButton: '#react-root ._fcn8k'
};

/**
 * Sidebar back button
 */
function backButton() {
  const body = $('body');
  const link = document.createElement('a');
  const element = document.createElement('div');

  link.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22.84 17.39"><polygon points="22.84 8.22 1.82 8.22 9.37 0.67 8.7 0 0 8.7 8.7 17.39 9.37 16.72 1.82 9.17 22.84 9.17 22.84 8.22"/></svg>'
  element.classList.add('back-btn', 'inactive');
  element.appendChild(link);
  body.appendChild(element);

  link.addEventListener('click', event => {
    ipcRenderer.send('back');
  });

  ipcRenderer.on('set-button-state', (event, enabled) => {
    if (enabled) {
      element.classList.remove('inactive');
    } else {
      element.classList.add('inactive');
    }
  });
}


/**
 * Login Button
 */
function login(elm) {
  elm.addEventListener('click', (e) => {
    console.log(elm);
    elm.classList.toggle('goback');
    process.nextTick(() => {
      console.log(elm.classList.contains('goback'));
      if (elm.classList.contains('goback')) {
        elm.innerText = 'Go back';
      } else {
        elm.innerText = 'Log In';
      }
    });
  });
}


/**
 * Init
 */
function init() {
  backButton();
}

function setDarkMode() {
	document.documentElement.classList.toggle('dark-mode', config.get('darkMode'));
    console.log(document.documentElement);
}

ipcRenderer.on('toggle-dark-mode', () => {
	config.set('darkMode', !config.get('darkMode'));
	setDarkMode();
});

document.addEventListener('DOMContentLoaded', (event) => {
  // enable OS specific styles
  document.documentElement.classList.add(`os-${process.platform}`);

  elementReady(selectors.root).then(init);
  elementReady(selectors.loginButton).then(login);

  setDarkMode();

  // prevent flash of white on startup when in dark mode
  // TODO: find a CSS only solution
  if (config.get('darkMode')) {
      document.documentElement.style.backgroundColor = '#192633';
  }

});
