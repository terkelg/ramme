'use strict'
const electron = require('electron')
const https = require('https')

const shell = electron.shell
const app = electron.app

function updateDialog (newVersion) {
  let versionMessage = electron.dialog.showMessageBox({
    type: 'info',
    title: `Update available`,
    message: `${app.getName()} ${newVersion} is available`,
    buttons: [`Download now`, 'Remind me later'],
    cancelId: 3
  })

  if (versionMessage === 0) {
    shell.openExternal('https://github.com/terkelg/ramme/releases')
  }

  if (versionMessage === 1) {
    // TODO: Ask user in like 7 days. Don't ask every time
  }
}

function errorDialog () {
  electron.dialog.showMessageBox({
    type: 'error',
    title: `Ups, Something went wrong`,
    message: `Unable to check for new updates at the moment`,
    buttons: ['Try later']
  })
}

exports.check = () => {
  https.get('https://raw.githubusercontent.com/terkelg/ramme/master/package.json', res => {
    if (!res.error && res.statusCode === 200) {
      let body = ''
      res.on('data', d => { body += d })
      res.on('end', () => {
        let json = JSON.parse(body)
        let newestVersion = json.version
        if (newestVersion > app.getVersion()) {
          updateDialog(newestVersion)
        }
      })
    } else {
      errorDialog()
    }
  })
}
