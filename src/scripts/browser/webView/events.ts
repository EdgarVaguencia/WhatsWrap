import {ipcRenderer} from 'electron'
const lastFmService = require('services/lastFm').default

let lf

/*
  Iniciamos los servicios
*/
ipcRenderer.on('initServices', () => {
  lf = new lastFmService()
  lf.init()
})

/*
  "Forzamos" la actualización del Status
*/
ipcRenderer.on('statusUpdate', () => {
  if (lf && lf.isConnected) {
    lf.updateStatus()
  }
})
