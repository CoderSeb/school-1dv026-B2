import '../socket.io/socket.io.js'
const baseURL = document.querySelector('base').getAttribute('href')
const socket = window.io({ path: `${baseURL}socket.io` })

socket.on('update', (data) => {
  const nodeList = document.getElementById(data.id).children
  console.log(nodeList)
  nodeList[0].innerText = `Author: ${data.creator}<br>Created: ${data.created}`
  nodeList[1].innerText = `#${data.id} - ${data.title}`
  nodeList[2].innerText = data.state
  nodeList[3].innerText = data.description
  if (data.labels.length > 0) {
    nodeList[4].innerHTML = ''
    for (let i = 0; i < data.labels.length; i++) {
      if (i < 1) {
        const listTitle = document.createElement('p')
        listTitle.classList.add('card-title')
        listTitle.classList.add('list-title')
        listTitle.classList.add('h5')
        listTitle.classList.add('text-warning')
        listTitle.innerText = 'Labels'
        nodeList[4].appendChild(listTitle)
      }
      const newItem = document.createElement('li')
      newItem.classList.add('card-list')
      newItem.classList.add('list-item')
      newItem.classList.add('issue-labels')
      newItem.innerText = `${data.labels[i].title}`
      nodeList[4].appendChild(newItem)
    }
  } else if (nodeList[4].tagName === 'UL' && data.labels.length < 1) {
    nodeList[4].innerHTML = ''
  }
  nodeList[nodeList.length - 1].innerText = `Last changed: ${data.updated}.`
})
