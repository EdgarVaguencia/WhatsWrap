import * as path from 'path'
import util from "../../manager/utils"

export default class theme extends util {

  constructor({style} = {style:''}) {
    super()
    this.changeTheme(style)
  }

  changeTheme(style:string) {
    switch (style) {
      case 'dark':
        this.darkTheme()
        break
      case 'light':
      default:
        this.removeTheme()
        break
    }
  }

  private removeTheme() {
    this.updateTheme()
  }

  private darkTheme() {
    var pathFile = path.join(__dirname, '../../../style/main.css')
    this.updateTheme(pathFile)
  }

}
