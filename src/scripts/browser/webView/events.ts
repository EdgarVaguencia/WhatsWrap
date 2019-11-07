
import {ipcRenderer, remote} from 'electron'
import {notificacion} from '../components'
import {lastFm, theme} from '../services'
import {default as sys} from '../../tools/platform'

let lf:lastFm, not, th:theme
// fu:fileUpload,

/**
 * Iniciamos los servicios
 */
ipcRenderer.on('initServices', () => {
  let menu = remote.require('./menu').default
  menu.updateMenu()
  not = new notificacion()
  lf = new lastFm()
  th = new theme({style: 'dark'})
})

/**
 * "Forzamos" la actualización del Status
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
 * Cambia el tema
 */
ipcRenderer.on('updateTheme', (event, opts) => {
  th.changeTheme(opts.theme)
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
