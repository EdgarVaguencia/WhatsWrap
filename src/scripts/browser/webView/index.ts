const webView = document.getElementById('wv')
const manifest = require("../../../package.json")

webView.setAttribute('src', manifest.wvUrl)
webView.setAttribute('userAgent',window.navigator.userAgent.replace(/(WhatsWrap|Electron)([^\s]+\s)/g, ''))

export default webView

import './events'
import './listener'
