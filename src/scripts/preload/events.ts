import {ipcRenderer} from 'electron'
declare var Store: any

(() => {
  ipcRenderer.on('sos', () => {
    var me = Store.Conn.me
    if (Store.Chat.get(me) === undefined){
      Store.Chat.add({cmd: 'action', id: me}, {merge: !0})
    }
    Store.Chat.get(me).sendMessage('Hola...')
  })

  ipcRenderer.on('updateStatus', (evt, data) => {
    log('updateStatus...')
    if (Store.Status.canSetMyStatus()) {
      Store.Status.setMyStatus(data.txt)
    }else {
      log('No es posible actualizar status...')
    }
  })

  function log(txt) {
    console.info(`${getTime()} => ` + txt)
  }

  function getTime() {
    var t = new Date()
    return `${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}`
  }
})()
