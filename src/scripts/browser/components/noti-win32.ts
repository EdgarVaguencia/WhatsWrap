import { remote } from 'electron'
const manifest = require('../../../package.json')

class notificacion {
  private notifications

  constructor() {
    this.notifications = {}
  }

  fireNotification(opts) {
    const ide = opts.tag + ':::' + Date.now()

    this.notifications[ide] = new remote.BrowserWindow({
      width: 300,
      height: 80,
      title: opts.title,
      frame: false,
      resizable: true,
      alwaysOnTop: true,
      webPreferences: {
        webSecurity: false
      }
    })

    this.notifications[ide].on('closed', () => {
      delete this.notifications[ide]
    })

    const display = remote.screen.getPrimaryDisplay().workAreaSize
    this.notifications[ide].setPosition(display.width - 300, display.height - 80)

    const html = require('url').format({
      protocol: 'file',
      slashes: true,
      pathname: require('path').join(remote.app.getAppPath(), 'html','notification.html'),
      query: {
        title: encodeURIComponent(opts.tag || ''),
        body: encodeURIComponent(opts.body || ''),
        icon: encodeURIComponent(opts.icon || '')
      }
    })

    this.notifications[ide].loadURL(html)

    if (manifest.dev) {
      this.notifications[ide].webContents.openDevTools()
    }
  }
}

export default notificacion
