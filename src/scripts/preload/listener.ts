import {ipcRenderer} from 'electron'
import modulos from './modules'

const timerId = setInterval(() => {
  if (window.localStorage.WABrowserId) {
    clearInterval(timerId)
    getModules()
  }
}, 5000)

function isReady(modulesWebPack): void {
  let moduleFound:number = 0
  let allModules = setInterval(() => {
    // console.info(moduleFound)
    for (let idMod in modulesWebPack) {
      if (modulesWebPack[idMod].exports) {
        modulos.forEach(needModule => {
          if (needModule.module) return
          let exposeModule = needModule.exists(modulesWebPack[idMod].exports)
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
          ipcRenderer.send('isConnected', window['Store'].Contact.models.filter(c => { return c.isMe })[0].id._serialized)
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
  if (typeof window['webpackJsonp'] === 'function') {
    window['webpackJsonp']([],
      {
        [123]: (module, exports, __webpack_require__) => isReady(__webpack_require__.c)
      }, [123])
  } else {
    window['webpackJsonp'].push([
      [123], {
        123: (module, exports, __webpack_require__) => isReady(__webpack_require__.c)
      }, [[123]]
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
