import firstRun from 'first-run'
import Insight from 'insight'

const pkg = require('../../package')

const trackingCode = 'UA-87371303-1'

const insight = new Insight({trackingCode, pkg})

function init () {
  if (firstRun()) {
    insight.track('install')
  }

  if (firstRun({name: `${pkg.name}-${pkg.version}`})) {
  }
}

function track (...paths) {
  insight.track(...paths)
}

export {init, track}
