const webView = document.getElementById('wv')

const manifest = require('../../../package.json')

webView.setAttribute('src', manifest.wvUrl)

export default webView

import './events'
import './listener'
