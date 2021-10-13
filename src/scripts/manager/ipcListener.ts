import {ipcMain, shell, BrowserWindow} from 'electron'

export default class ipcListener {

  private browserWindow:BrowserWindow

  constructor(browserWindow: BrowserWindow) {
    this.browserWindow = browserWindow
  }

  listen() {
    /**
     * WhatsApp esta cargado completamente
     */
    ipcMain.on('isConnected', (e:Event) => {
      this.browserWindow.webContents.send('initServices')
    })

    /**
     * Se recibe Mensaje
     */
    ipcMain.on('newMessage', (event:Event, opts: Object) => {
      this.browserWindow.webContents.send('fireNotification', opts)
    })

    /**
     * Se abre URL
     */
    ipcMain.on('open-url', (e:Event, url: string, opts?: Object) => {
      shell.openExternal(url)
    })
  }

}
