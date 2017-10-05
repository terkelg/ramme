import {app} from 'electron'
import {exec} from 'child_process'
import {join} from 'path'

async function createFile (path) {
  await exec(`touch ${path}`)
  return path
}

async function removeFile (path) {
  await exec(`rm ${path}`)
  return true
}

function buildPath (file) {
  return join(app.getPath('userData'), `${file}.json`)
}

export {
  createFile,
  removeFile,
  buildPath
}
