const ipc = require('electron').ipcRenderer

const printBtn = document.querySelector('#print')

printBtn.addEventListener('click', () => {
  document.querySelector('.btn--print-page-back').style.display = 'none'
  printBtn.style.display = 'none'

  ipc.send('print-to-pdf')

  setTimeout(() => {
    document.querySelector('.btn--print-page-back').style.display = 'block'
    printBtn.style.display = 'block'
  }, 2000)
})

ipc.on('wrote-pdf', (event, path) => {
  console.log(`Wrote PDF to: ${path}`)
})