const gulp = require('gulp')
const _$ = require('gulp-load-plugins')()
const runs = require('run-sequence')
const ts = _$.typescript.createProject('tsconfig.json')
const winInstall = require('electron-windows-installer')
const packager = require('electron-packager')
// const webpack = require('webpack-stream')

const config = {
  origin: 'src/scripts/',
  out: 'dist/scripts/',
  js: [
    ['browser/', '*.js'],
    ['browser/services/', '*.js'],
    ['browser/webView/', '*.js'],
    ['preload/', '*.js'],
    ['manager/', '*.js'],
    ['/', 'browserWindow.js'],
    ['/', 'init.js']
  ]
}

gulp.task('ts', () => {
  return ts.src()
  .pipe(ts())
  .js.pipe(gulp.dest('src/scripts'))
})

gulp.task('js', ['ts'], () => {
  // gulp.src('src/scripts/browser/index.js')
  // .pipe(webpack(require('./webpack.config')))
  // .pipe(gulp.dest('dist/scripts/browser'))

  config.js.forEach((item) => {
    gulp.src(config.origin + item[0] + item[1])
    .pipe(_$.uglify())
    .pipe(gulp.dest(config.out + item[0]))
  })
})

gulp.task('html', () => {
  return gulp.src('src/*.html')
  .pipe(gulp.dest('dist'))
})

gulp.task('node', () => {
  return gulp.src(
    [
      'src/node_modules/**/**/**/*',
      '!src/node_modules/**/README*',
      '!src/node_modules/**/example/**',
      '!src/node_modules/**/test/**'
    ]
  )
  .pipe(gulp.dest('dist/node_modules'))
})

gulp.task('package', () => {
  return gulp.src('src/package.json')
  .pipe(gulp.dest('dist'))
})

gulp.task('cpFiles', () => {
  runs('js', 'html', 'package', 'node')
})

gulp.task('build', (cb) => {
  runs('cpFiles', cb)
})

gulp.task('watch', () => {
  gulp.watch('src/*.html', ['html'])
  gulp.watch('src/scripts/**/**/*.ts', ['build'])
  gulp.watch('src/package.json', ['build'])
})

gulp.task('pack:win32', (done) => {
  return packager({
    dir: './dist',
    arch: 'x64',
    platform: 'win32',
    out: './build',
    overwrite: true,
    asar: false,
    packageManager: 'yarn',
    icon: './icons/win-icon.ico'
  }).then((pathFiles) => console.info(pathFiles))
})

gulp.task('dist:win32', ['pack:win32'], (done) => {
  if (process.platform !== 'win32') {
    return false
  }

  winInstall({
    appDirectory: './build/WhatsWrap-win32-x64',
    outputDirectory: './build',
    authors: 'Edgar Vaguencia',
    noMsi: true,
    exe: 'WhatsWrap.exe',
    iconUrl: 'https://raw.githubusercontent.com/EdgarVaguencia/WhatsWrap/master/icons/win-icon.ico',
    arch: 'ia32'
  }).then(done).catch(done)
})
