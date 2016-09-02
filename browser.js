const https = require('https');
const fs = require('fs');
const electron = require('electron');
const { dialog } = require('electron').remote;
const config = require('./config');
const elementReady = require('element-ready');

const ipcRenderer = electron.ipcRenderer;
const $ = document.querySelector.bind(document);

const selectors = {
  root: '#react-root ._onabe',
  loginButton: '#react-root ._fcn8k'
};


ipcRenderer.on('toggle-dark-mode', () => {
  config.set('darkMode', !config.get('darkMode'));
  setDarkMode();
});

ipcRenderer.on('navigate-home', () => {
  const home = $('._n7q2c ._r1svv:nth-child(1) a');
  if (home) {
    home.click();
  }
});


ipcRenderer.on('navigate-discover', () => {
  const discover = $('._n7q2c ._r1svv:nth-child(2) a');
  if (discover) {
    discover.click();
  }
});


ipcRenderer.on('navigate-notifications', () => {
  const notifications = $('._n7q2c ._r1svv:nth-child(3) a');
  if (notifications) {
    notifications.click();
  }
});


ipcRenderer.on('navigate-profile', () => {
  const profile = $('._n7q2c ._r1svv:nth-child(4) a');
  if (profile) {
    profile.click();
  }
});


function backButton() {
  const body = $('body');
  const link = document.createElement('a');
  const element = document.createElement('div');
  link.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22.84 17.39">'
    + '<polygon points="22.84 8.22 1.82 8.22 9.37 0.67 8.7 0 0 8.7 8.7 17.39 '
    + '9.37 16.72 1.82 9.17 22.84 9.17 22.84 8.22"/>'
    + '</svg>';
  element.classList.add('back-btn', 'inactive');
  element.appendChild(link);
  body.appendChild(element);

  link.addEventListener('click', () => {
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


function login(elm) {
  elm.addEventListener('click', () => {
    elm.classList.toggle('goback');
    process.nextTick(() => {
      if (elm.classList.contains('goback')) {
        elm.innerText = 'Go back';
      } else {
        elm.innerText = 'Log In';
      }
    });
  });
}


function setDarkMode() {
  document.documentElement.classList.toggle('dark-mode', config.get('darkMode'));
}

function init() {
  backButton();
  setDarkMode();

  // Prevent flash of white on startup when in dark mode
  // TODO: Find solution to this with pure css
  if (config.get('darkMode')) {
    document.documentElement.style.backgroundColor = '#192633';
  }
}


document.addEventListener('DOMContentLoaded', () => {
  // enable OS specific styles
  document.documentElement.classList.add(`os-${process.platform}`);

  elementReady(selectors.root).then(init);
  elementReady(selectors.loginButton).then(login);
});

window.addEventListener('load', () => {
  document.getElementById('react-root').addEventListener('contextmenu', (e) => {
    const targetName = e.target.className;
    if (targetName === '_ovg3g') {
      picCover(e);
    }
    if (targetName === '_c2kdw') {
      videoCover(e);
    }
  });
});

const removeCover = (div) => {
  document.body.removeChild(div);
  document.body.style.overflow = 'auto';
};

const savePicOrVideo = (src, fileType) => {
  const title = `save ${fileType}`;
  const options = {
    title,
    defaultPath: __dirname,
  };
  const choosePath = dialog.showSaveDialog(options);
  if (choosePath) {
    download(src, `${choosePath}.${fileType}`)
      .then((done, error) => {
        let body;
        if (done) {
          body = done;
        }
        if (error) {
          body = done;
        }
        const notificationOptions = {
          title,
          body,
          icon: './static/icon.png'
        };
        const notification = new Notification(title, notificationOptions);
        notification();
      });
  }
};

const concat1 = (buf1, buf2) => {
  const tmp = new Buffer(buf1.length + buf2.length);
  buf1.copy(tmp, 0);
  buf2.copy(tmp, buf1.length);
  return tmp;
};

const download = (url, path) => new Promise((resolve, reject) => {
  https.get(url, (res) => {
    let picData = new Buffer(0);
    res.on('data', (chunk) => {
      picData = concat1(picData, chunk);
    });
    res.on('end', () => {
      fs.writeFile(path, picData, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve('save pictures is done');
        }
      });
    });
  }).on('error', (e) => {
    reject(e.message);
  });
});

const videoCover = (e) => {
  const target = e.target;
  const trueTarget = target.previousSibling;
  const src = trueTarget.querySelectorAll('video')[0].src;
  const video = document.createElement('video');
  video.src = src;
  video.style.width = '90%';
  video.setAttribute('autoplay', true);
  video.setAttribute('controls', true);
  const div = document.createElement('div');
  div.appendChild(video);
  div.className = 'electron_pic_cover';
  document.body.style.overflow = 'hidden';
  video.addEventListener('click', () => removeCover(div));
  video.addEventListener('contextmenu', () => savePicOrVideo(src, 'mp4'));
  document.body.appendChild(div);
};

const picCover = (e) => {
  const trueTarget = e.target.previousSibling.previousSibling;
  const src = trueTarget.querySelectorAll('img._icyx7')[0].src;
  const img = document.createElement('img');
  img.src = src;
  img.style.width = '90%';
  img.style.cursor = 'pointer';
  const div = document.createElement('div');
  div.appendChild(img);
  div.className = 'electron_pic_cover';
  document.body.style.overflow = 'hidden';
  img.addEventListener('click', () => removeCover(div));
  img.addEventListener('contextmenu', () => savePicOrVideo(src, 'jpg'));
  document.body.appendChild(div);
};
