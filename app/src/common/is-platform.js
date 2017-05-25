const isPlatform = name => {
  let handle

  switch (name) {
    case 'windows':
      handle = 'win32'
      break
    case 'macOS':
      handle = 'darwin'
      break
    default:
      handle = name
  }

  return process.platform === handle
}

module.exports = isPlatform
