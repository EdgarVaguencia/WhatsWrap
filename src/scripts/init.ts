import {app, Menu, webContents} from 'electron'
const mainWindow = require('./browserWindow').default
const ipcListener = require('./manager/ipcListener').default
const manifest = require('../package.json')

app.on('ready', () => {
  let browser = new mainWindow()
  browser.initWebBrowser()

  new ipcListener(browser).listen()

  createMenu(browser)
})

function getWebView() {
  return webContents.getAllWebContents()
    .filter(wc => wc.getURL().search('web.whatsapp.com') > -1)
    .pop()
}

function createMenu(browserWindow) {
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
              console.info('No se que paso')
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
