import {BrowserWindow, webContents, Menu} from 'electron'

export default class mainWindow {

  private optionsMw:Object = {
    minWidth: 1200,
    minHeight: 355,
    title: process.env['productName'],
    icon: require('path').join(__dirname, '../Icons/win-icon.png')
  }
  private url:string = require('url').format({
    protocol: 'file',
    slashes: true,
    pathname: require('path').join(__dirname, '../html/index.html')
  })
  public wb:BrowserWindow

  initWebBrowser() {
    this.createMenu()

    this.wb = new BrowserWindow(this.optionsMw)
    this.wb.center()
    this.wb.loadURL(this.url)

    if (process.env['isDev'] === 'true'){
      this.wb.webContents.openDevTools()
      this.wb.maximize()
    }

    this.generalEvents()
  }

  private generalEvents() {
    this.wb.on('closed', () => {
      this.wb = null
    })
  }

  private getWebView() {
    return webContents.getAllWebContents()
      .filter(wc => wc.getURL().search('web.whatsapp.com') > -1)
      .pop()
  }

  private createMenu(): void {
    let self = this
    const menuItmes = [
      /*
      * ** OBSOLETO
      * Esta función ya no es soportada debido a que no se
      * permite el envio de mensajes de manera fácil o mediante
      * la "API"
      */
      // {
      //   label: 'Mensages',
      //   submenu: [
      //     {
      //       id: 'chatMe',
      //       label: 'Saludandome',
      //       enabled: false,
      //       click() {
      //         const wc = self.getWebView()
      //         if (wc){
      //           wc.send('sos')
      //         } else {
      //           log.info('No se que paso')
      //         }
      //       }
      //     },
      //     {
      //       enabled: false,
      //       label: 'Abrir archivo',
      //       click() {
      //         self.wb.webContents.send('uploadFile')
      //       }
      //     }
      //   ],
      // },
      {
        label: 'Servicios',
        submenu: [
          {
            label: 'Last-Fm',
            submenu: [
              {
                id: 'lastfm',
                enabled: false,
                label: 'Actualizar Status',
                click() {
                  self.wb.webContents.send('statusUpdate')
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
            label: 'V ' + (process.env['isDev'] === 'true') ? process.env['version'] + ' - dev': process.env['version']
          }
        ]
      }
    ]

    Menu.setApplicationMenu(Menu.buildFromTemplate(menuItmes))
  }

  updateMenu():void {
    let menu = Menu.getApplicationMenu()
    menu.getMenuItemById('lastfm').enabled = true
  }
}
