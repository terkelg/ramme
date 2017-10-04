const app = require('electron').app
const join = require('path').join
const mkdir = require('fs').mkdir
const settings = require('electron-settings')

export function initSettings () {
  if (!settings.get('sessionsPath')) {
    let path = join(app.getPath('userData'), 'sessions')
    mkdir(path, 777, () => {
      settings.set('sessionsPath', path)
    })
  }
}
