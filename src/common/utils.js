import {
  app,
  remote
} from 'electron'
import { exec } from 'child_process'
import { join } from 'path'

// Access App from both main and renderer
const main = app || remote.app

// Create file give a path
async function createFile (path) {
  await exec(`touch ${path}`)
  return path
}

// Remove file given a path
async function removeFile (path) {
  await exec(`rm ${path}`)
  return true
}

// Create path string for filename
function buildPath (file) {
  return join(main.getPath('userData'), `${file}.json`)
}

export default {
  createFile,
  removeFile,
  buildPath
}
