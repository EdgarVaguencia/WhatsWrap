import {ipcRenderer} from 'electron'

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
        window['Store'] = requireId(modules[m].i.replace(/"/g, '"')).default
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

window.addEventListener('load', async () => {
  const title = document.querySelector('.version-title')
  if (title && title.innerHTML.includes('Google Chrome 49+')) {
    window.location.reload()
  }
})

window.addEventListener('beforeunload', async () => {
  try {
    const regs = await window.navigator.serviceWorker.getRegistrations()

    regs.forEach(r => {
      r.unregister()
      console.info('Unregister Service Worker')
    })
  } catch (er) {
    console.error(er)
  }
})
