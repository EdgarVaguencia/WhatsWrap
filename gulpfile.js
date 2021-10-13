const gulp = require('gulp')
const _$ = require('gulp-load-plugins')()
const packager = require('electron-packager')
const manifest = require('./src/package.json')
const cp = require('child_process')
let debInstall, electronInstaller

function html (done) {
  gulp.src('src/html/*.html')
    .pipe(gulp.dest('dist/html'))
  done()
}

function stylus (done) {
  gulp.src('src/style/*.styl')
    .pipe(_$.stylus())
    .pipe(gulp.dest('dist/style'))
  done()
}

function node (done) {
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
}

function packages (done) {
  gulp.src('src/package.json')
    .pipe(gulp.dest('dist'))
  done()
}

function md (done) {
  gulp.src('src/*.md')
    .pipe(gulp.dest('dist'))
  done()
}

function watch (done) {
  gulp.watch('src/html/*.html', { ignoreInitial: false }, gulp.series(html))
  gulp.watch('src/style/*.styl', { ignoreInitial: false }, gulp.series(stylus))
  gulp.watch('src/package.json', { ignoreInitial: false }, gulp.parallel(packages, node))
  gulp.watch('src/scripts/**/*.ts', { ignoreInitial: false }, gulp.series(tsFiles))
  done()
}

function tsFiles (done) {
  const args = []
  let cmd = 'tsc'

  if (process.platform === 'win32') {
    cmd += '.cmd'
  }

  const ts = cp.spawnSync(cmd, args)
  let str = ts.stdout.toString()

  if (str.indexOf('error')) {
    console.error(str)
  }

  done()
}

gulp.task('build', gulp.parallel(html, stylus, packages, node, md, tsFiles))

gulp.task('pack:win32', gulp.series('build', function interPackWin (done) {
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
  }).then((pathFiles) => { console.info(`Create Pack: ${pathFiles[0]}`); done() }).catch(err => { console.error(err, err.stack); process.exit(1) })
}))

gulp.task('dist:win32', gulp.series('pack:win32', async function interDistWin (done) {
  if (process.platform !== 'win32') {
    return false
  }

  electronInstaller = require('electron-winstaller')
  const isDev = manifest.dev ? '_dev' : ''

  // winInstall
  await electronInstaller.createWindowsInstaller({
    appDirectory: './build/' + manifest.productName + '-win32-x64',
    outputDirectory: './build',
    authors: 'Edgar Vaguencia',
    noMsi: true,
    exe: manifest.productName + isDev + '.exe',
    setupExe: 'win32-x64-' + manifest.productName + '-' + manifest.version + isDev + '.exe',
    iconUrl: 'https://raw.githubusercontent.com/EdgarVaguencia/WhatsWrap/master/icons/win-icon.ico'
    // arch: 'ia32'
  })
  // .then(() => { console.info('Windows Success'); done() }).catch(err => { console.error(err, err.stack); process.exit(1) })
  console.info('Windows Success')
  done()
}))

gulp.task('pack:linux64', gulp.series('build', function interPackLin (done) {
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

gulp.task('dist:linux64', gulp.series('pack:linux64', function interDistLin (done) {
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

gulp.task('starDev', gulp.series('build', done => {
  let args = ['./dist']
  let cmd = './src/node_modules/.bin/electron'

  if (process.platform === 'win32') {
    cmd = '.\\src\\node_modules\\.bin\\electron.cmd'
  }

  const elec = cp.spawn(cmd, args)
  elec.stdout.on('data', d => {
    let str = String(d)
    console.log(str)
  })
  elec.stderr.on('data', e => {
    let str = String(e)
    console.log(str)
  })
  elec.on('close', () => { done() })
}))

exports.default = gulp.series(watch)
