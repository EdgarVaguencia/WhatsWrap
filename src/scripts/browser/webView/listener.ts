import {ipcRenderer} from 'electron'
import webView from './webViewElement'

webView.addEventListener('dom-ready', () => {
  /*
  En modo Debug abrimos consola de WhatsApp
  */
  if (process.env['isDev'] === 'true') {
   (webView as any).openDevTools()
  }
})

webView.addEventListener('new-window', (e) => {
  ipcRenderer.send('open-url', e['url'])
})
