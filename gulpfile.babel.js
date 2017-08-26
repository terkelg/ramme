import {
  src,
  dest,
  watch as watchSrc,
  parallel,
  series
} from 'gulp'
import babel from 'gulp-babel'
import del from 'del'
import autoprefixer from 'gulp-autoprefixer'
import image from 'gulp-image'
import sass from 'gulp-sass'

// Directories
const SRC_DIR = 'app/src'
const DIST_DIR = 'app/dist'

// Source files
const JS_GLOB = `${SRC_DIR}/**/*.js`
const CSS_GLOB = `${SRC_DIR}/**/*.scss`
const HTML_GLOB = `${SRC_DIR}/**/*.html`
const ASSETS_GLOB = `app/src/assets/*.*`

// Clean DIST directory
export function clean () {
  return del([DIST_DIR])
}

// JS Task
export function scripts () {
  return src(JS_GLOB, {
    base: SRC_DIR
  })
    .pipe(babel({
      compact: true
    }))
    .pipe(dest(DIST_DIR))
}

export function html () {
  return src(HTML_GLOB, {
    base: SRC_DIR
  })
    .pipe(dest(DIST_DIR))
}

export function styles () {
  return src(CSS_GLOB, {
    base: SRC_DIR
  })
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(dest(DIST_DIR))
}

export function assets () {
  return src(ASSETS_GLOB, {
    base: SRC_DIR
  })
    .pipe(image())
    .pipe(dest(DIST_DIR))
}

export function watch () {
  watchSrc(JS_GLOB, scripts)
  watchSrc(HTML_GLOB, html)
  watchSrc(CSS_GLOB, styles)
  watchSrc(ASSETS_GLOB, assets)
}

const mainTasks = parallel(scripts, html, styles, assets)
export const build = series(clean, mainTasks)
export const dev = series(clean, mainTasks, watch)

// Set default task
export default build
