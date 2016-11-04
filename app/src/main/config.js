import Config from 'electron-config'

export const config = new Config({
  defaults: {
    darkMode: false,
    zoomFactor: 1,
    lastWindowState: {
      width: 414,
      height: 700
    }
  }
})

