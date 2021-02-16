import '../socket.io/socket.io.js'
const baseURL = document.querySelector('base').getAttribute('href')
const socket = window.io({path: `${baseURL}`})