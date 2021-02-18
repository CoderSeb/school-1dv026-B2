import '../socket.io/socket.io.js'
const baseURL = document.querySelector('base').getAttribute('href')
const socket = window.io.connect({path: `${baseURL}socket`})

socket.emit('join', 'user')

socket.on('update', (data) => {
  console.log('Update!\n' + data)
})
