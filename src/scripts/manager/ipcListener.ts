import {ipcMain, shell} from 'electron'
import mainWindow from '../browserWindow'

export default class ipcListener {

  browserWindow:mainWindow

  constructor(browserWindow) {
    this.browserWindow = browserWindow
  }

  listen() {
    /**
     * WhatsApp esta cargado completamente
     */
    ipcMain.on('isConnected', (e:Event, me:string) => {
      this.browserWindow.wb.webContents.send('initServices')
    })

    /**
     * Se recibe Mensaje
     */
    ipcMain.on('newMessage', (event:Event, opts: Object) => {
      this.browserWindow.wb.webContents.send('fireNotification', opts)
    })

    /**
     * Se abre URL
     */
    ipcMain.on('open-url', (e:Event, url: string, opts?: Object) => {
      shell.openExternal(url)
    })
  }

}
