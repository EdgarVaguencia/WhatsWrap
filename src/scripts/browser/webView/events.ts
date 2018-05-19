import {ipcRenderer} from 'electron'
import notificacion from '../components'
import LastFm from '../services'
import {default as sys} from '../../tools/platform'

let lf, not

/*
  Iniciamos los servicios
*/
ipcRenderer.on('initServices', () => {
  not = new notificacion()
  lf = new LastFm()
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

/**
 * Se muestra notificación de nuevo mensaje
 */
ipcRenderer.on('fireNotification', (event, opts) => {
  if (!sys.isLinux) {
    not.fireNotification(opts)
  }
})
