import Config from 'electron-config'

const config = new Config({
  defaults: {
    darkMode: false,
    zoomFactor: 1,
    lastWindowState: {
      width: 414,
      height: 700
    }
  }
})

export { config as default }
