import {ipcRenderer} from 'electron'

ipcRenderer.on('sos', () => {
  var me = getMe()
  if (window['Store'].Chat.get(me) === undefined){
    window['Store'].Chat.add({cmd: 'action', id: me}, {merge: !0})
  }
  window['Store'].Chat.get(me).sendMessage('Hola...')
})

ipcRenderer.on('updateStatus', (evt, data) => {
  var currentStatus = window['Store'].Status.get(`${getMe()}`).status
  if (data.txt !== currentStatus) {
    window['Store'].Wap.sendSetStatus(data.txt)
  }else {
    log('No es posible actualizar status...')
  }
})

ipcRenderer.on('changeStyle', (evt, data) => {
  var tagElement = getCustomCss()
  tagElement.innerHTML = data
})

function getMe(): string {
  let me:string = ""
  if (me.length === 0) {
    me = window['Store'].Conn.me
  }
  return me
}

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
