import {app, Menu, webContents} from 'electron'
const mainWindow = require('./browserWindow').default
const ipcListener = require('./manager/ipcListener').default

app.on('ready', () => {
  let browser = new mainWindow()
  browser.initWebBrowser()

  new ipcListener(browser).listen()

  createMenu()
})

function getWebView() {
  return webContents.getAllWebContents()
    .filter(wc => wc.getURL().search('web.whatsapp.com') > -1)
    .pop()
}

function createMenu() {
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
      ]
    }
  ]

  Menu.setApplicationMenu(Menu.buildFromTemplate(menuItmes))
}
