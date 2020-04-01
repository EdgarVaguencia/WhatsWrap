import {ipcRenderer} from 'electron'

ipcRenderer.on('sos', () => {
  var me = getMe()
  if (window['Store'].Chat.get(me) === undefined){
    window['Store'].Chat.add({cmd: 'action', id: me}, {merge: !0})
  }
  window['ChatMe'].sendTextMsgToChat(window['Store'].Chat.get(me), 'Hola...')
})

ipcRenderer.on('updateStatus', (evt, data) => {
  var currentStatus = window['Store'].Status.get(`${getMe()}`).status
  if (data.txt !== currentStatus) {
    window['Status'].setMyStatus(data.txt)
  } else {
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
    me = window['Store'].Contact.models.filter(c => { return c.isMe })[0].id._serialized
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
