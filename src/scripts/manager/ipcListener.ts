import {ipcMain, shell, ipcRenderer} from 'electron'

export default class ipcListener {

  browserWindow

  constructor(browserWindow) {
    this.browserWindow = browserWindow
  }



  listen() {
    /**
     * WhatsApp esta cargado completamente
     */
    ipcMain.on('isConnected', (me:string) => {
      this.browserWindow.wb.webContents.send('initServices')
    })

    /**
     * Se recibe Mensaje
     */
    ipcMain.on('newMessage', (event:string, opts: Object) => {
      this.browserWindow.wb.webContents.send('fireNotification', opts)
    })

    /**
     * Se abre URL
     */
    ipcMain.on('open-url', (e:string, url: string, opts?: Object) => {
      shell.openExternal(url)
    })
  }

}
