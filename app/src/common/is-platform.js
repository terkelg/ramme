const isPlatform = name => {
  let handle

  switch (name) {
   
    case 'macOS':
      handle = 'darwin'
      break
    case 'windows':
      handle = 'win32'
      break
    default:
      handle = name
  }

  return process.platform === handle
}

module.exports = isPlatform
