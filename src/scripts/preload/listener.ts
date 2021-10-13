import {ipcRenderer} from 'electron'
import modulos from './modules'

const timerId = setInterval(() => {
  if (window.localStorage['last-wid-md'] || window.localStorage['last-wid']) {
    clearInterval(timerId)
    getModules()
  }
}, 5000)

function isReady(modulesWebPack): void {
  let moduleFound:number = 0
  let allModules = setInterval(() => {
    for (let idMod in modulesWebPack) {
      if (typeof modulesWebPack[idMod] === 'object') {
        modulos.forEach(needModule => {
          if (needModule.module) return
          let exposeModule = needModule.exists(modulesWebPack[idMod])
          if (exposeModule !== null) {
            moduleFound ++
            needModule.module = exposeModule
          }
        })
        if (moduleFound === modulos.length) {
          console.info('Todo encontrado')
          let storeModule = modulos.find(m => m.id === 'Store')
          window['Store'] = storeModule.module ? storeModule.module : {}
          modulos.splice(modulos.indexOf(storeModule), 1)
          modulos.forEach(mod => {
            window['Store'][mod.id] = mod.module
          })
          ipcRenderer.send('isConnected') //, window['Store'].Contact.models.filter(c => { return c.isMe })[0].id._serialized)
          clearInterval(allModules)
          break
        }
      }
    }
  }, 2000)
}

function requireId(id) {
  return window['webpackJsonp']([], null, [id])
}

function getModules(): void {
  let jsonModules = 'webpackChunkwhatsapp_web_client'

  if (typeof window[jsonModules] === 'function') {
    window[jsonModules]([],
      {
        [123]: (module, exports, __webpack_require__) => isReady(__webpack_require__.c)
      }, [123])
  } else {
    window[jsonModules].push([
      [123],
      {
        123: (module, exports, __webpack_require__) => {
          let modules = []
          for (let ind in __webpack_require__.m) {
            modules.push(__webpack_require__(ind))
          }
          isReady(modules)
        }
      },
      e => { e(e.s=123) }
    ])
  }
}

window.addEventListener('load', async () => {
  const title = document.querySelector('.version-title')
  if (title && title.innerHTML.includes('Google Chrome 60+')) {
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
