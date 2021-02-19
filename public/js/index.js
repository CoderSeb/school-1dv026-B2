import '../socket.io/socket.io.js'
const baseURL = document.querySelector('base').getAttribute('href')
const socket = window.io({ path: `${baseURL}socket.io` })

socket.on('update', (data) => {
  const nodeList = document.getElementById(data.id).children
  nodeList[0].innerText = `Author: ${data.creator}<br>Created: ${data.created}`
  nodeList[2].innerText = `#${data.id} - ${data.title}`
  nodeList[3].innerText = data.state
  nodeList[4].innerText = data.description
  if (data.labels.length > 0) {
    nodeList[5].innerHTML = ''
    for (let i = 0; i < data.labels.length; i++) {
      if (i < 1) {
        const listTitle = document.createElement('p')
        listTitle.classList.add('card-title')
        listTitle.classList.add('list-title')
        listTitle.classList.add('h5')
        listTitle.classList.add('text-warning')
        listTitle.innerText = 'Labels'
        nodeList[5].appendChild(listTitle)
      }
      const newItem = document.createElement('li')
      newItem.classList.add('card-list')
      newItem.classList.add('list-item')
      newItem.classList.add('issue-labels')
      newItem.innerText = `${data.labels[i].title}`
      nodeList[5].appendChild(newItem)
    }
  } else if (nodeList[5].tagName === 'UL' && data.labels.length < 1) {
    nodeList[5].innerHTML = ''
  }
  nodeList[nodeList.length - 1].innerText = `Last changed: ${data.updated}.`
})
