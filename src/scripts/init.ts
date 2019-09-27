import {app, Menu, webContents} from 'electron'
import mainWindow from './browserWindow'
import ipcListener from './manager/ipcListener'
const manifest = require('../package.json')
const log = require('electron-log')
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
  browser = new mainWindow()
  browser.initWebBrowser()

  new ipcListener(browser).listen()

  createMenu(browser)
})

app.on('window-all-closed', () => {
  app.quit()
})

function getWebView() {
  return webContents.getAllWebContents()
    .filter(wc => wc.getURL().search('web.whatsapp.com') > -1)
    .pop()
}

function createMenu(browserWindow): void {
  const menuItmes = [
    {
      label: 'Mensages',
      submenu: [
        {
          label: 'Saludandome',
          click() {
            const wc = getWebView()
            if (wc){
              wc.send('sos')
            } else {
              log.info('No se que paso')
            }
          }
        },
        {
          label: 'Abrir archivo',
          click() {
            browserWindow.wb.webContents.send('uploadFile')
          }
        }
      ],
    },
    {
      label: 'Servicios',
      submenu: [
        {
          label: 'Last-Fm',
          submenu: [
            {
              label: 'Actualizar Status',
              click() {
                browserWindow.wb.webContents.send('statusUpdate')
              }
            }
          ]
        }
      ]
    },
    {
      label: 'Ayuda',
      submenu: [
        {
          label: 'V ' + manifest.dev ? manifest.version + ' - dev': manifest.version
        }
      ]
    }
  ]

  Menu.setApplicationMenu(Menu.buildFromTemplate(menuItmes))
}
