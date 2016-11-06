import babel from 'gulp-babel'
import gulp from 'gulp'
import sass from 'gulp-sass'
// import injectSvg from 'gulp-inject-svg'

gulp.task('build:js:main', () =>
  gulp.src('app/src/main/*.js')
    .pipe(babel())
    .pipe(gulp.dest('app/dist/main')))

gulp.task('build:js:renderer', () =>
  gulp.src('app/src/renderer/js/*.js')
    .pipe(babel())
    .pipe(gulp.dest('app/dist/renderer/js')))

gulp.task('build:scss', () =>
  gulp.src('app/src/renderer/styles/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('app/dist/renderer/styles')))

gulp.task('build', ['build:js:main', 'build:scss', 'build:js:renderer'])

gulp.task('default', ['build'])

gulp.task('watch', ['build'], () => {
  gulp.watch('app/src/main/*.js', ['build:js:main'])
  gulp.watch('app/src/renderer/*.js', ['build:js:renderer'])
  gulp.watch('app/src/renderer/styles/*', ['build:scss'])
})
