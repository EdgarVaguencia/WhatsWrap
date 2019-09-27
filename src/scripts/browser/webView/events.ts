
import {ipcRenderer} from 'electron'
import {notificacion} from '../components'
import {lastFm, fileUpload, theme} from '../services'
import {default as sys} from '../../tools/platform'

let lf:lastFm, not, fu:fileUpload, th:theme

/*
  Iniciamos los servicios
*/
ipcRenderer.on('initServices', () => {
  not = new notificacion()
  lf = new lastFm()
  lf.init()
  fu = new fileUpload()
  th = new theme()
  th.customCss()
})

/*
  "Forzamos" la actualización del Status
*/
ipcRenderer.on('statusUpdate', () => {
  if (lf && lf.isConnected) {
    lf.updStatus()
  }
})

/**
 * Se muestra notificación de nuevo mensaje
 */
ipcRenderer.on('fireNotification', (event, opts) => {
  if (!sys.isLinux) {
    not.fireNotification(opts)
  }
})

/**
 * Abre un archivo .csv para envio masivo
 */
ipcRenderer.on('uploadFile', () => {
  if (fu) {
    fu.openFile()
  }
  else {
    console.log('something is wrong!')
  }
})
