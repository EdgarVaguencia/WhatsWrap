import webView from './index'
const manifest = require('../../../package.json')

/*
  En modo Debug abrimos consola de WhatsApp
*/
if (manifest.dev) {
  webView.addEventListener('dom-ready',  () => {
    (webView as any).openDevTools()
  })
}
