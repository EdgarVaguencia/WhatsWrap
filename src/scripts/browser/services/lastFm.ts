import {ipcRenderer} from 'electron'
// import * as request from 'request'
import axios from 'axios'
import util from '../../manager/utils'

interface lf {
  name: string
  artist: {
    '#text': string
  }
}

export default class LastFm extends util {
  private options = {
    user: '',
    apiKey: '',
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
      this.getCurrentScrobbling()
        .then((d:lf) => {
          if (d) {
            this.updateStatus(`${this.getEmoji('headphone')} ${d.name} By ${d.artist['#text']}`)
          }
        })
    } else {
      this.isConnected = false
    }
  }

  private getCurrentScrobbling() {
    this.log('getCurrentScrobbling...')
    var url = `${this.options.url}${this.options.user}&api_key=${this.options.apiKey}`
    return axios.get(url)
      .then(resp => {
        if (resp.status === 200) {
          this.isConnected = this.isConnected ? this.isConnected : true
          return resp.data['recenttracks']['track'][0];
        }
        ipcRenderer.send('newMessage',{tag: 'WatsWrap', body: 'Error al intentar conectarse', 'icon': ''})
        this.isConnected = false
        return
      })
      .catch(err => {
        ipcRenderer.send('newMessage', {tag: 'LastFm', body: err})
        return
      })
  }

  stopUpdate() {
    clearInterval(this.intervalStatus)
  }
}
