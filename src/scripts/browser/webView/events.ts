import {ipcRenderer} from 'electron'
const lastFmService = require('services/lastFm').default

/*
  Iniciamos los servicios
*/
ipcRenderer.on('initServices', () => {
  const lf = new lastFmService()
  lf.init()
})
