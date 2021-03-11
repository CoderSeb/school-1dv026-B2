import '../socket.io/socket.io.js'
const baseURL = document.querySelector('base').getAttribute('href')
const socket = window.io({ path: `${baseURL}socket.io` })

const allBtns = document.querySelectorAll('.btn')

allBtns.forEach(button => {
  button.addEventListener('click', event => {
    let newState = 'close'
    if (event.target.value.substring(0, 2) === 'op') {
      newState = 'open'
    }
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `./issues/${event.target.value.substring(2)}/${newState}`, true)
    xhr.send()
  })
})

/**
 * Updates the closed/reopened issue.
 *
 * @param {*} data as the changed issue data.
 * @param {*} nodeList as the node list.
 */
function updateIssue (data, nodeList) {
  nodeList[0].innerText = `Author: ${data.creator}\nCreated: ${data.created}`
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
  nodeList[nodeList.length - 2].innerText = `Last changed: ${data.updated}.`
  if (data.isOpen) {
    nodeList[nodeList.length - 1].innerText = 'Close'
    nodeList[nodeList.length - 1].value = 'cl' + data.id
    nodeList[nodeList.length - 1].classList.replace('btn-success', 'btn-warning')
  } else {
    nodeList[nodeList.length - 1].innerText = 'Open'
    nodeList[nodeList.length - 1].value = 'op' + data.id
    nodeList[nodeList.length - 1].classList.replace('btn-warning', 'btn-success')
  }
}

socket.on('update', (data) => {
  const issueDiv = document.getElementById(data.id)
  if (issueDiv !== null) {
    const nodeList = issueDiv.children
    updateIssue(data, nodeList)
  } else {
    const newDiv = document.createElement('div')
    const template = document.getElementById('issue-template').innerHTML
    const renderIssue = window.Handlebars.compile(template)
    const newIssue = renderIssue(data)
    newDiv.innerHTML = newIssue
    console.log(newDiv)
    document.getElementById('deckOfCards').appendChild(newDiv)
  }
})
