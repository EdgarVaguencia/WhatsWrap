import * as fs from 'fs'
import emoji from './emoji'

export default class utils {
  private wv
  private expRegEmoji: RegExp = new RegExp(':([a-z]*(\\s)*[a-z]*)+:','g')

  constructor() {}

  private getWebView() {
    if (this.wv === undefined) {
      this.wv = document.getElementById('wv')
    }
  }

  log(txt: string) {
    console.info(`${this.getTime()} => ` + txt)
  }

  private getTime() {
    var t = new Date()
    return `${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}`
  }

  /*
    Actualiza el status de tu perfil
  */
  updateStatus(txt:string) {
    this.getWebView()
    this.wv.send('updateStatus', {txt: txt})
  }

  /*
    Obtiene emoji según el nombre con la posibilidad de indicar si existe más de uno.
    Nota: Los nombres son en ingles (puedes darte una idea en: https://unicode.org/emoji/charts/full-emoji-list.html) y con orden segun busqueda de la misma WhatsApp.
  */
  getEmoji(name:string, position?:number): string {
    var pos = position ? position : 0
    if (emoji[name]){
      return emoji[name][pos]
    }
  }

  /**
   * @param txt Mensaje con emoji
   */
  parseMsg(txt: string): string {
    var emojis = txt.match(this.expRegEmoji)

    if (emojis) {
      emojis.forEach((v, i) => {
        txt = txt.replace(v, this.getEmoji(v.replace(/:/g, '')))
      })
    }
    return txt
  }

  /**
   * @param data Objeto de datos que contiene le teléfono y mensaje a enviar
   */
  sendMenssage(data: any): void {
    this.getWebView()
    this.wv.send('sendMessage', data)
  }

  updateTheme(pathFile) {
    this.getWebView()
    this.wv.send('changeStyle', fs.readFileSync(pathFile, 'utf-8'))
  }

}
