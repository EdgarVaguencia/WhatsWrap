const gulp = require('gulp')
const _$ = require('gulp-load-plugins')()
const packager = require('electron-packager')
const manifest = require('./src/package.json')
let winInstall, debInstall

gulp.task('html', () => {
  return gulp.src('src/html/*.html')
    .pipe(gulp.dest('dist/html'))
})

gulp.task('stylus', () => {
  return gulp.src('src/style/*.styl')
    .pipe(_$.stylus())
    .pipe(gulp.dest('dist/style'))
})

gulp.task('node', done => {
  gulp.src(
    [
      'src/node_modules/**/**/**/*',
      '!src/node_modules/**/README*',
      '!src/node_modules/**/example/**',
      '!src/node_modules/**/test/**'
    ]
  )
    .pipe(gulp.dest('dist/node_modules'))
  done()
})

gulp.task('package', () => {
  return gulp.src('src/package.json')
    .pipe(gulp.dest('dist'))
})

gulp.task('md', () => {
  return gulp.src('src/*.md')
    .pipe(gulp.dest('dist'))
})

gulp.task('build', gulp.parallel('html', 'stylus', 'package', 'node', 'md'))

gulp.task('watch', gulp.series('build', done => {
  gulp.watch('src/html/*.html', gulp.series('html'))
  gulp.watch('src/style/*.styl', gulp.series('stylus'))
  gulp.watch('src/package.json', gulp.parallel('package', 'node'))
  done()
}))

gulp.task('pack:win32', gulp.series('build', done => {
  const isDev = manifest.dev ? '_dev' : ''

  return packager({
    dir: './dist',
    arch: 'x64',
    platform: 'win32',
    out: './build',
    overwrite: true,
    asar: true,
    packageManager: 'yarn',
    executableName: '' + manifest.productName + isDev,
    icon: './icons/win-icon.ico'
  }).then((pathFiles) => console.info(`Create Pack: ${pathFiles[0]}`)).catch(err => { console.error(err, err.stack); process.exit(1) })
}))

gulp.task('dist:win32', gulp.series('pack:win32', done => {
  if (process.platform !== 'win32') {
    return false
  }

  winInstall = require('electron-windows-installer')
  const isDev = manifest.dev ? '_dev' : ''

  winInstall({
    appDirectory: './build/' + manifest.productName + '-win32-x64',
    outputDirectory: './build',
    authors: 'Edgar Vaguencia',
    noMsi: true,
    exe: manifest.productName + isDev + '.exe',
    setupExe: 'win32-x64-' + manifest.productName + '-' + manifest.version + isDev + '.exe',
    iconUrl: 'https://raw.githubusercontent.com/EdgarVaguencia/WhatsWrap/master/icons/win-icon.ico',
    arch: 'ia32'
  }).then(() => { console.info('Windows Success'); done() }).catch(err => { console.error(err, err.stack); process.exit(1) })
}))

gulp.task('pack:linux64', gulp.series('build', (done) => {
  return packager({
    dir: './dist',
    arch: 'x64',
    platform: 'linux',
    out: './build',
    overwrite: true,
    asar: false,
    packageManager: 'yarn',
    icon: './icons/win-icon.png'
  }).then((pathFiles) => { console.info(`Create Pack: ${pathFiles[0]}`); done() }).catch(err => { console.error(err, err.stack); process.exit(1) })
}))

gulp.task('dist:linux64', gulp.series('pack:linux64', (done) => {
  if (process.platform !== 'linux') {
    return false
  }

  debInstall = require('electron-installer-debian')
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
  }).then(() => { console.info('Linux Succeess'); done() }).catch(err => { console.error(err, err.stack); process.exit(1) })
}))

gulp.task('default', gulp.series('watch'))
