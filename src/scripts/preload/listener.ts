import {ipcRenderer} from 'electron'

var modules : any
const timerId = setInterval(() => {
  if (window['Debug']) {
    clearInterval(timerId)
    getModules()
  }
}, 5000)

function isReady(): void {
  // bhggeigghg => Conn

  // for (var m in modules) {
  //   if (modules[m].exports) {
  //     if (m === 'cbcjhabjci') {
  //       window['Sabes'] = requireId(modules[m].i.replace(/"/g, '"')).default
  //     }
  //     if (modules[m].exports.default && modules[m].exports.default.Chat) {
  //       window['Store'] = requireId(modules[m].i.replace(/"/g, '"')).default
  //       const timeConn = setInterval(() => {
  //         clearInterval(timeConn)
  //         ipcRenderer.send('isConnected', window['Store'].Contact.models.filter(c => { return c.isMe })[0].id._serialized)
  //       }, 1000)
  //     }
  //   }
  // }
  if (modules['bhggeigghg'] && modules['dbbhhgjjbg'] && modules['bijjheifie']) {
    // console.info(modules['bhggeigghg'])
    // console.info(modules['dbbhhgjjbg'])
    // console.info(modules['bijjheifie'])
    if (modules['bhggeigghg'].exports.default.Chat) {
      window['Store'] = requireId(modules['bhggeigghg'].i.replace(/"/g, '"')).default
    }
    if (modules['dbbhhgjjbg'].exports.sendTextMsgToChat) {
      window['ChatMe'] = requireId(modules['dbbhhgjjbg'].i.replace(/"/g, '"'))
    }
    if (modules['bijjheifie'].exports.setMyStatus) {
      window['Status'] = requireId(modules['bijjheifie'].i.replace(/"/g, '"'))
    }
    const timeModules = setInterval(() => {
      if (window['Store']) {
        clearInterval(timeModules)
        ipcRenderer.send('isConnected', window['Store'].Contact.models.filter(c => { return c.isMe })[0].id._serialized)
      }
    }, 3000)
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
