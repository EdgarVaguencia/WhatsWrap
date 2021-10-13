import './webView'
import { remote } from 'electron'
import { addPath } from 'app-module-path'
const appPath = remote.app.getAppPath()
const mypath = require('path').join(appPath, 'scripts', 'browser')

addPath(mypath)
