const fs = require('fs')

function createFile (path) {
  let f = fs.open(path, 'w')
  return f
}

export {
  createFile
}
