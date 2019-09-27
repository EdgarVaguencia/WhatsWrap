import {ipcRenderer} from 'electron'
import webView from './index'

const manifest = require('../../../package.json')

webView.addEventListener('dom-ready',  () => {
  /*
  En modo Debug abrimos consola de WhatsApp
  */
 if (manifest.dev) {
    (webView as any).openDevTools()
  }
})

webView.addEventListener('new-window', (e) => {
  ipcRenderer.send('open-url', e['url'])
})
