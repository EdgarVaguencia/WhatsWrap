import {BrowserWindow} from 'electron'
const manifest = require('../package.json')

export default class mainWindow {

  private optionsMw = {
    minWidth: 1200,
    minHeight: 355,
    title: manifest.productName,
    icon: require('path').join(__dirname, '../Icons/win-icon.png')
  }
  private url = require('url').format({
    protocol: 'file',
    slashes: true,
    pathname: require('path').join(__dirname, '../html/index.html')
  })
  public wb:BrowserWindow

  constructor () {}

  initWebBrowser() {
    this.wb = new BrowserWindow(this.optionsMw)
    this.wb.center()
    this.wb.loadURL(this.url)

    if (manifest.dev){
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
