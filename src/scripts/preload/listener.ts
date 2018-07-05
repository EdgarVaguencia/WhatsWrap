import {ipcRenderer} from 'electron'

(() => {
  var modules : any
  const timerId = setInterval(() => {
    if (window['Debug']) {
      clearInterval(timerId)
      getModules()
    }
  }, 5000)

  function isReady(): void {
    for (var m in modules) {
      if (modules[m].exports) {
        if (modules[m].exports.default && modules[m].exports.default.Wap) {
          window['Store'] = requireId(modules[m].id.replace(/"/g, '"')).default
          const timeConn = setInterval(() => {
            if (window['Store'].Conn.me !== undefined) {
              clearInterval(timeConn)
              ipcRenderer.send('isConnected', window['Store'].Conn.me)
            }
          }, 1000)
        }
      }
    }
  }

  function requireId(id) {
    return window['webpackJsonp']([], null, [id])
  }

  function getModules(): void {
    window['webpackJsonp']([],
      {
        [123]: function(module, exports, __webpack_require__) {
          modules = __webpack_require__.c
          isReady()
        }
      }, [123])
  }

})()
