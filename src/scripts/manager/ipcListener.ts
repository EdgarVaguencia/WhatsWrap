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
  }

}

export default ipcListener
