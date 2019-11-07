import {app} from 'electron'
import mainWindow from './browserWindow'
import ipcListener from './manager/ipcListener'
import manifest from '../package.json'
import menus from './menu'
let browser:mainWindow = null

const isOnlyBlock = app.requestSingleInstanceLock()
if (!isOnlyBlock && !manifest.dev) {
  app.quit()
}

app.on('second-instance', () => {
  if (browser) {
    if (browser.wb.isMinimized()) {
      browser.wb.restore()
    }
    if (!manifest.dev) {
      browser.wb.focus()
      browser.wb.show()
    }
  }
})

app.on('ready', () => {
  process.env['isDev'] = `${manifest.dev}`
  process.env['webViewUrl'] = manifest.wvUrl
  process.env['productName'] = manifest.wvUrl
  process.env['version'] = manifest.version
  process.env['wvUrl'] = manifest.wvUrl

  browser = new mainWindow()
  browser.initWebBrowser()

  menus.createMenu(browser.wb)

  new ipcListener(browser).listen()
})

app.on('window-all-closed', () => {
  app.quit()
})
