import {ipcRenderer} from 'electron'
import whatsApi from './whatsApi'

ipcRenderer.on('sos', () => {
  whatsApi.textMe('Hola...')
})

ipcRenderer.on('updateStatus', (evt, data) => {
  whatsApi.updateStatus(data.txt)
})

ipcRenderer.on('changeStyle', (evt, data) => {
  var tagElement = getCustomCss()
  tagElement.innerHTML = data
})

function log(txt): void {
  console.info(`${getTime()} => ` + txt)
}

function getTime(): string {
  var t = new Date()
  return `${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}`
}

function getCustomCss(): HTMLElement {
  if (document.getElementById('customCss')) {
    return document.getElementById('customCss')
  }

  var tagStyle = document.createElement('style')
  tagStyle.setAttribute('id', 'customCss')
  document.body.appendChild(tagStyle)

  return tagStyle
}

/**
 * Obtenemos los mensajes recibidos de tipo multimedia desde el inicio de la Expo
 */
ipcRenderer.on('allMedia', (evt: Event) => {
  getInboxMediaMsg().then(d => {
    console.info(d)
    // ipcRenderer.send('msgToCrm', d)
  })
})

function getInboxMediaMsg() {
  let msgInbox: Array<any> = new Array()
  let starDate: number = new Date(2019,10,12).setHours(0)
  return new Promise(res => {
    window['Store'].Msg.models.filter(m => {
      return (m.isMedia && !m.isSentByMe && !m.isStatusV3)
    }).forEach(msgs => {
      let msgDate: number = msgs.t * 1000
      if (msgDate >= starDate) {
        msgInbox.push({
          numero: msgs.from.toString().split('@')[0],
          img: msgs.body
        })
      }
    })
    res(msgInbox)
  })
}
