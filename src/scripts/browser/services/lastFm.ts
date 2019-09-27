import {ipcRenderer} from 'electron'
import * as request from 'request'
import util from '../../manager/utils'

interface lf {
  name: string
  artist: {
    '#text': string
  }
}

export default class LastFm extends util {
  private options = {
    user: 'EdgarKmarita',
    apiKey: '',
    delay: 1000 * 60 * 3, // 3 mins
    url: 'http://ws.audioscrobbler.com/2.0/?limit=1&format=json&method=user.getrecenttracks&user='
  }
  // private utils: util
  isConnected: boolean = false

  // constructor() {this.utils = new util() }

  init() {
    this.log('init LastFm...')
    setInterval(() => {
      this.updStatus()
    }, this.options.delay)
    this.updStatus()
    this.isConnected = true
  }

  updStatus() {
    this.getCurrentScrobbling().then((d:lf) => {
      this.updateStatus(`${this.getEmoji('headphone')} ${d.name} By ${d.artist['#text']}`)
    })
  }

  async getCurrentScrobbling() {
    this.log('getCurrentScrobbling...')
    return await new Promise((resolve, reject) => {
      var url = `${this.options.url}${this.options.user}&api_key=${this.options.apiKey}`
      request.get(url, (err, resp, body) => {
        if (resp.statusCode === 200) {
          var data = JSON.parse(body)
          this.isConnected = this.isConnected ? this.isConnected : true
          resolve(data.recenttracks.track[0])
        }else {
          ipcRenderer.send('newMessage',{tag: 'WatsWrap', body: 'Error al intentar conectarse', 'icon': ''})
          this.isConnected = false
          reject(resp.statusCode)
        }
      })
    })
  }
}
