import { Menu, webContents, BrowserWindow } from "electron";


function createMenu(browser:BrowserWindow) {
  const menuItems: Object[] = [
    {
      label: 'Mensages',
      submenu: [
        {
          id: 'chatMe',
          label: 'Saludandome',
          enabled: false,
          click() {
            const wc = getWebView()
            if (wc){
              wc.send('sos')
            } else {
              console.log('No se que paso')
            }
          }
        },
    //     {
    //       enabled: false,
    //       label: 'Abrir archivo',
    //       click() {
    //         self.wb.webContents.send('uploadFile')
    //       }
    //     }
      ],
    },
    {
      label: 'Servicios',
      submenu: [
        {
          label: 'Last-Fm',
          submenu: [
            {
              id: 'lastfm',
              enabled: false,
              label: 'Actualizar Status',
              click() {
                browser.webContents.send('statusUpdate')
                // self.wb.webContents.send('statusUpdate')
              }
            }
          ]
        }
      ]
    },
    {
      label: 'Estilo',
      submenu: [
        {
          id: 'darkTheme',
          label: 'Obscuro',
          enabled: false,
          click() {
            browser.webContents.send('updateTheme', {theme: 'dark'})
          }
        },
        {
          id: 'lightTheme',
          label: 'Original',
          enabled: false,
          click() {
            browser.webContents.send('updateTheme', {theme: 'light'})
          }
        }
      ]
    },
    {
      label: 'Ayuda',
      submenu: [
        {
          label: getVersion()
        }
      ]
    }
  ]

  if (process.env['isDev'] === 'true') {
    menuItems.push({
      label: 'Desarrollo',
      submenu: [
        {
          label: 'Recargar',
          role: 'forceReload'
        }
      ]
    })
  }

  Menu.setApplicationMenu(Menu.buildFromTemplate(menuItems))
}

function updateMenu() {
  let menu = Menu.getApplicationMenu()
  menu.getMenuItemById('lastfm').enabled = true
  menu.getMenuItemById('chatMe').enabled = true
  menu.getMenuItemById('lightTheme').enabled = true
  menu.getMenuItemById('darkTheme').enabled = true
}

function getVersion(): string {
  let version = `V ${process.env['version']}`
  if (process.env['isDev'] === 'true') {
    version += ' - Beta'
  }
  return version
}

function getWebView() {
  return webContents.getAllWebContents()
    .filter(wc => wc.getURL().search('web.whatsapp.com') > -1)
    .pop()
}

export default {
  createMenu,
  updateMenu
}
