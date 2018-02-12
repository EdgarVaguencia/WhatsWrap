import emoji from './emoji'

class utils {
  private wv

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
  updateStatus(txt) {
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

}

export default utils
