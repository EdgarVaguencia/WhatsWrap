import {BrowserWindow} from 'electron'

export default class mainWindow {

  private optionsMw:object = {
    minWidth: 1200,
    minHeight: 355,
    title: process.env['productName'],
    icon: require('path').join(__dirname, '../icons/win-icon.png'),
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true
    },
    autoHideMenuBar: true
  }
  private url:string = require('url').format({
    protocol: 'file',
    slashes: true,
    pathname: require('path').join(__dirname, '../html/index.html')
  })
  public wb:BrowserWindow

  initWebBrowser() {
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
}
