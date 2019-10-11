import {remote} from 'electron'

export default class notificacion {
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
      },
      useContentSize: true
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
        title: encodeURIComponent(opts.title || ''),
        body: encodeURIComponent(opts.body || ''),
        icon: encodeURIComponent(opts.icon || '')
      }
    })

    this.notifications[ide].loadURL(html)

    if (process.env['isDev'] === 'true') {
      this.notifications[ide].webContents.openDevTools()
    }
  }
}
