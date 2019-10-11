
import {ipcRenderer} from 'electron'
import {notificacion} from '../components'
import {lastFm, theme} from '../services'
import {default as sys} from '../../tools/platform'

let lf:lastFm, not, th:theme
// fu:fileUpload,

/*
  Iniciamos los servicios
*/
ipcRenderer.on('initServices', () => {
  not = new notificacion()
  lf = new lastFm()
  lf.init()
  // fu = new fileUpload()
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
 * ** OBSOLETO
 * Esta función ya no es soportada debido a que no se
 * permite el envio de mensajes de manera fácil o mediante
 * la "API"
 *
 * Abre un archivo .csv para envio masivo
 */
// ipcRenderer.on('uploadFile', () => {
//   if (fu) {
//     fu.openFile()
//   }
//   else {
//     console.log('something is wrong!')
//   }
// })
