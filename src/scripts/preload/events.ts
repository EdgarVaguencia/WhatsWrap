import {ipcRenderer} from 'electron'
declare var Store: any

(() => {
  ipcRenderer.on('sos', () => {
    var me = getMe()
    if (Store.Chat.get(me) === undefined){
      Store.Chat.add({cmd: 'action', id: me}, {merge: !0})
    }
    Store.Chat.get(me).sendMessage('Hola...')
  })

  ipcRenderer.on('updateStatus', (evt, data) => {
    var currentStatus = Store.Status.get(`${getMe()}`).status
    if (Store.Status.canSetMyStatus() && data.txt !== currentStatus) {
      Store.Status.setMyStatus(data.txt)
    }else {
      log('No es posible actualizar status...')
    }
  })

  function getMe():string {
    let me:string = ""
    if (me.length === 0) {
      me = Store.Conn.me
    }
    return me
  }

  function log(txt) {
    console.info(`${getTime()} => ` + txt)
  }

  function getTime() {
    var t = new Date()
    return `${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}`
  }
})()
