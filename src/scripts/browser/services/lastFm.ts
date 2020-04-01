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
    apiKey: 'ebb288a9fba45278c0b326b7766f8911',
    delay: 1000 * 60 * 3, // 3 mins
    url: 'http://ws.audioscrobbler.com/2.0/?limit=1&format=json&method=user.getrecenttracks&user='
  }
  private intervalStatus
  isConnected: boolean = false

  constructor() {
    super()
    this.log('init LastFm...')
    this.init()
  }

  private init() {
    this.intervalStatus = setInterval(() => {
      this.updStatus()
    }, this.options.delay)
    this.updStatus()
    // this.updStatus()
    // setTimeout(this.updStatus, this.options.delay)
  }

  updStatus() {
    if (this.options.apiKey.length > 0) {
      this.isConnected = true
      this.getCurrentScrobbling().then((d: lf) => {
        this.updateStatus(`${this.getEmoji('headphone')} ${d.name} By ${d.artist['#text']}`)
      })
    } else {
      this.isConnected = false
    }
  }

  private async getCurrentScrobbling() {
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
        if (err) {
          ipcRenderer.send('newMessage', {tag: 'LastFm', body: err})
          reject()
        }
      })
    })
  }

  stopUpdate() {
    clearInterval(this.intervalStatus)
  }
}
