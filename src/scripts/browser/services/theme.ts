import * as path from 'path'
import util from "../../manager/utils"

export default class theme extends util {

  customCss() {
    var pathFile = path.join(__dirname, '../../../style/main.css')
    this.updateTheme(pathFile)
  }

}
