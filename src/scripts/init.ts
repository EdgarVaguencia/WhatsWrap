import {app} from 'electron'
import mainWindow from './browserWindow'
import ipcListener from './manager/ipcListener'
import manifest from '../package.json'
let browser:mainWindow = null

const isOnlyBlock = app.requestSingleInstanceLock()

if (!isOnlyBlock && !manifest.dev) {
  app.quit()
}

app.on('second-instance', () => {
  if (browser){
    if (browser.wb.isMinimized()) {
      browser.wb.restore()
    }
    browser.wb.focus()
    browser.wb.show()
  }
})

app.on('ready', () => {
  process.env['isDev'] = manifest.dev.toString()
  process.env['webViewUrl'] = manifest.wvUrl
  process.env['productName'] = manifest.wvUrl
  process.env['version'] = manifest.version
  process.env['wvUrl'] = manifest.wvUrl

  browser = new mainWindow()
  browser.initWebBrowser()

  new ipcListener(browser).listen()
})

app.on('window-all-closed', () => {
  app.quit()
})
