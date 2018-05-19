const params = require('url').parse(window.location.href, true).query

function closeWindow() {
    window.close()
}

function onLoad() {
    window.setTimeout(closeWindow, 6500)
}

document.getElementById('title').innerHTML = decodeURIComponent(params.title || 'Titulo')
document.getElementById('body').innerHTML = decodeURIComponent( params.body || 'Saludos!')
document.getElementById('icon-img').setAttribute('src', decodeURIComponent(params.icon) || '')
window.addEventListener('load', onLoad, false)
