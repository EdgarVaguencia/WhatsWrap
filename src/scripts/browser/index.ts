import {remote} from 'electron'
const appPath = remote.app.getAppPath()
const mypath = require('path').join(appPath, 'scripts', 'browser')
import {addPath} from 'app-module-path'

addPath(mypath)

require('webView')
