require('./server/server')
const { app, BrowserWindow, ipcMain, shell } = require('electron')

const path = require('path')

const fs = require('fs')
const os = require('os')
const ipc = ipcMain

let win

function createWindow() {
  win = new BrowserWindow({
    width: 1080,
    height: 720,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile('client/pages/index.html')
  win.on('closed', () => {
    win = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win == null) {
    createWindow()
  }
})

ipc.on('print-to-pdf', event => {
  const pdfPath = path.join(os.tmpdir(), 'print.pdf')
  const win2 = BrowserWindow.fromWebContents(event.sender)

  win2.webContents.printToPDF({}, (error, data) => {
    if (error) return console.log(error.message)

    fs.writeFile(pdfPath, data, err => {
      if (err) return console.log(err)
      shell.openExternal('file://' + pdfPath)
      event.sender.send('wrote-pdf', pdfPath)
    })
  })
})