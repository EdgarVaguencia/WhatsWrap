import {app, Menu, webContents, autoUpdater} from 'electron'
const mainWindow = require('./browserWindow').default
const ipcListener = require('./manager/ipcListener').default
const manifest = require('../package.json')
const log = require('electron-log')

app.on('ready', () => {
  let browser = new mainWindow()
  browser.initWebBrowser()

  checkUpdate()

  new ipcListener(browser).listen()

  createMenu(browser)
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
          label: 'V ' + manifest.version
        }
      ]
    }
  ]

  Menu.setApplicationMenu(Menu.buildFromTemplate(menuItmes))
}

function checkUpdate() {
  let feedUrl = 'https://update.electronjs.org/EdgarVaguencia/WhatsWrap/win32/'
  if (process.platform === 'win32') {
    feedUrl += manifest.version
    log.info(feedUrl)

    autoUpdater.setFeedURL(feedUrl)

    autoUpdater.checkForUpdates()

    autoUpdater.on('error', er => {
      log.info('Error Update: ',er)
    })

    autoUpdater.on('checking-for-update', ch => {
      log.info('Check Update: ',ch)
    })

    autoUpdater.on('update-available', d => {
      log.info('New update: ',d)
    })

    autoUpdater.on('update-downloaded', dow => {
      log.info('Is Downloaded: ',dow)
      setTimeout(autoUpdater.quitAndInstall(), 3000)
    })
  }
}
