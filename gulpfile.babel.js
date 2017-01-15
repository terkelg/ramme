import {src, dest, watch as watchSrc, parallel, series} from 'gulp'
import babel from 'gulp-babel'
import del from 'del'
import sass from 'gulp-sass'

// Directories
const SRC_DIR = 'app/src'
const DIST_DIR = 'app/dist'

// Source files
const JS_GLOB = `${SRC_DIR}/**/*.js`
const CSS_GLOB = `${SRC_DIR}/**/*.scss`

// Clean DIST directory
export function clean () {
  return del([DIST_DIR])
}

// JS Task
export function scripts () {
  return src(JS_GLOB, {base: SRC_DIR})
    .pipe(babel())
    .pipe(dest(DIST_DIR))
}

export function styles () {
  return src(CSS_GLOB, {base: SRC_DIR})
    .pipe(sass().on('error', sass.logError))
    .pipe(dest(DIST_DIR))
}

export function watch () {
  watchSrc(JS_GLOB, scripts)
  watchSrc(CSS_GLOB, styles)
}

const mainTasks = parallel(scripts, styles)
export const build = series(clean, mainTasks)
export const dev = series(clean, mainTasks, watch)

// Set default task
export default build
