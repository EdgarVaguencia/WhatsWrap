import {ipcRenderer} from 'electron'
import * as platform from '../tools/platform'

(<any>window).Notification = ((Html5Notification) => {

  const Notification = (title, opts) => {
    if (platform.default.isLinux) {
      const notification = new Html5Notification(title, opts)
      return notification
    }

    ipcRenderer.send('newMessage', opts)
  }

  return Object.assign(Notification, Html5Notification)
})((<any>window).Notification)
