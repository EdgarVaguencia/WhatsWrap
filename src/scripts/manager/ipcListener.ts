import {ipcMain} from 'electron'
class ipcListener {

  browserWindow

  constructor(browserWindow) {
    this.browserWindow = browserWindow
  }

  listen(){
    /*
    WhatsApp esta cargado completamente
    */
    ipcMain.on('isConnected', (me:string) => {
      this.browserWindow.wb.webContents.send('initServices')
    })
    /*
      Se recibe Mensaje
    */
    ipcMain.on('newMessage', (event:string, opts: Object) => {
      this.browserWindow.wb.webContents.send('fireNotification', opts)
    })
  }

}

export default ipcListener
