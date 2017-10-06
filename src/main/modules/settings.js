'use strict'

import {app} from 'electron'
import {join} from 'path'
import mkdirp from 'mkdirp'
import settings from 'electron-settings'

export function initSettings () {
  if (!settings.get('sessionsPath')) {
    let path = join(app.getPath('appData'), 'sessions')

    mkdirp(path, error => {
      if (!error) settings.set('sessionsPath', path)
      else console.log(error)
    })
  }
}
