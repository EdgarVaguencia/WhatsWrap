/**
 * ** OBSOLETO
 * Esta función ya no es soportada debido a que no se
 * permite el envio de mensajes de manera fácil o mediante
 * la "API"
 *
 */
import {dialog} from 'electron'
const csvParse = require('csv-to-array')
import utils from '../../manager/utils'

class data {
  telefono: string
  mensaje: string
}

export default class fileUpload extends utils{
  openFile() {
    dialog.showOpenDialog(null, {
      title: 'Selecciona un archivo',
      properties: ['openFile'],
      filters: [{name: 'CSV', extensions: ['csv']}]
    })
    .then(files => {
      if (files.filePaths){
        csvParse({
          file: files[0],
          columns: ['telefono', 'mensaje']
        }, (err, read:data[]) => {
          if (err) {
            this.log(err)
          } else {
            read.forEach(element => {
              var newMsj = this.parseMsg(element.mensaje)
              element.mensaje = newMsj
              this.sendMenssage(element)
            })
          }
        })
      }
    })
  }
}
