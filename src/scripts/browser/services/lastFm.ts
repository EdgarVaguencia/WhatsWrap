import * as request from 'request'
import util from '../../manager/utils'

class lf {
  name: string
  artist: {
    '#text': string
  }
}

class LastFm {
  private options = {
    user: '',
    apiKey: '',
    delay: 1000 * 60 * 3, // 3 mins
    url: 'http://ws.audioscrobbler.com/2.0/?limit=1&format=json&method=user.getrecenttracks&user='
  }
  utils: util

  constructor() {
    this.utils = new util()
  }

  init() {
    this.utils.log('init LastFm...')
    setInterval(() => {
      this.updateStatus()
    }, this.options.delay)
    this.updateStatus()
  }

  updateStatus() {
    this.getCurrentScrobbling().then((d:lf) => {
      this.utils.updateStatus(`${this.utils.getEmoji('headphone')} ${d.name} By ${d.artist['#text']}`)
    })
  }

  async getCurrentScrobbling() {
    this.utils.log('getCurrentScrobbling...')
    return await new Promise((resolve, reject) => {
      var url = `${this.options.url}${this.options.user}&api_key=${this.options.apiKey}`
      request.get(url, (err, resp, body) => {
        if (resp.statusCode === 200) {
          var data = JSON.parse(body)
          resolve(data.recenttracks.track[0])
        }else {
          reject(resp.statusCode)
        }
      })
    })
  }
}

export default LastFm
