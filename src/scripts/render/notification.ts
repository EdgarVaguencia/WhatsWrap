const params = require('url').parse(window.location.href, true).query

function closeWindow() {
  window.close()
}

function onClick() {
  closeWindow()
}

function onLoad() {
  window.setTimeout(closeWindow, 6000)
  document.addEventListener('click', onClick)
}

document.getElementById('title').innerHTML = decodeURIComponent(params.title || 'Titulo')
document.getElementById('body').innerHTML = decodeURIComponent( params.body || 'Saludos!')
document.getElementById('icon-img').setAttribute('src', decodeURIComponent(params.icon) || '')
window.addEventListener('load', onLoad, false)
