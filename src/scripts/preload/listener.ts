import {ipcRenderer} from 'electron'
declare var Store: any

(() => {
  const timerId = setInterval(() => {
    isReady()
  }, 1000)

  function isReady() {
    if (Store.Conn.connected) {
      clearInterval(timerId)
      ipcRenderer.send('isConnected', Store.Conn.me)
    }
  }

})()
