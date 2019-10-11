const webView = document.getElementById('wv')

webView.setAttribute('src', process.env['wvUrl'])
webView.setAttribute('userAgent',window.navigator.userAgent.replace(/(WhatsWrap|Electron)([^\s]+\s)/g, ''))

export default webView

import './events'
import './listener'
