const gulp = require('gulp')
const _$ = require('gulp-load-plugins')()
const runs = require('run-sequence')
const ts = _$.typescript.createProject('tsconfig.json')
const packager = require('electron-packager')
const manifest = require('./src/package.json')
let winInstall, debInstall
if (process.platform === 'linux') {
  debInstall = require('electron-installer-debian')
} else if (process.platform === 'win32') {
  winInstall = require('electron-windows-installer')
}
// const webpack = require('webpack-stream')

const config = {
  origin: 'src/scripts/',
  out: 'dist/scripts/',
  js: [
    ['browser/', '*.js'],
    ['browser/components/', '*.js'],
    ['browser/services/', '*.js'],
    ['browser/webView/', '*.js'],
    ['manager/', '*.js'],
    ['preload/', '*.js'],
    ['render/', '*.js'],
    ['tools/', '*.js'],
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
  return gulp.src('src/html/*.html')
  .pipe(gulp.dest('dist/html'))
})

gulp.task('stylus', () => {
  return gulp.src('src/style/*.styl')
  .pipe(_$.stylus())
  .pipe(gulp.dest('dist/style'))
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
  runs('js', 'html', 'stylus', 'package', 'node')
})

gulp.task('build', (cb) => {
  runs('cpFiles', cb)
})

gulp.task('watch', () => {
  gulp.watch('src/html/*.html', ['html'])
  gulp.watch('src/style/*.styl', ['stylus'])
  gulp.watch('src/scripts/**/**/*.ts', ['js'])
  gulp.watch('src/package.json', ['package', 'node'])
})

gulp.task('pack:win32', ['build'], (done) => {
  return packager({
    dir: './dist',
    arch: 'x64',
    platform: 'win32',
    out: './build',
    overwrite: true,
    asar: false,
    packageManager: 'yarn',
    icon: './icons/win-icon.ico',
    executableName: manifest.productName + '-' + manifest.version
  }).then((pathFiles) => console.info(`Create Pack: ${pathFiles[0]}`))
})

gulp.task('dist:win32', ['pack:win32'], (done) => {
  if (process.platform !== 'win32') {
    return false
  }

  winInstall({
    appDirectory: './build/' + manifest.productName + '-win32-x64',
    outputDirectory: './build',
    authors: 'Edgar Vaguencia',
    noMsi: true,
    exe: manifest.productName + '-' + manifest.version + '.exe',
    setupExe: manifest.productName + '-' + manifest.version + '.exe',
    iconUrl: 'https://raw.githubusercontent.com/EdgarVaguencia/WhatsWrap/master/icons/win-icon.ico',
    arch: 'ia32'
  }).then(() => console.info('Windows Success')).catch(done)
})

gulp.task('pack:linux64', ['build'], (done) => {
  return packager({
    dir: './dist',
    arch: 'x64',
    platform: 'linux',
    out: './build',
    overwrite: true,
    asar: false,
    packageManager: 'yarn',
    icon: './icons/win-icon.png'
  }).then((pathFiles) => console.info(`Create Pack: ${pathFiles[0]}`))
})

gulp.task('dist:linux64', ['pack:linux64'], (done) => {
  if (process.platform !== 'linux') {
    return false
  }

  debInstall({
    productName: manifest.name,
    name: manifest.name,
    genericName: manifest.name,
    bin: manifest.productName,
    src: './build/' + manifest.productName + '-linux-x64/',
    dest: './build/',
    arch: 'amd64',
    categories: ['GNOME', 'GTK', 'Utility', 'Social'],
    icon: './icons/win-icon.png',
    mimeType: ['text/plain'],
    homepage: 'https://github.com/EdgarVaguencia/WhatsWrap'
  }).then(() => console.info('Linux Succeess')).catch(err => { console.error(err, err.stack); process.exit(1) })
})

gulp.task('default', ['watch'])
