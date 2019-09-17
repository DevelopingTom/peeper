import { app, BrowserWindow } from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080/`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    webPreferences: {
      nodeIntegration: true
    }
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

const ipcMain = require('electron').ipcMain
ipcMain.on('capture-zone', () => {
  let captureWindow = new BrowserWindow({
    height: 500,
    width: 500,
    minWidth: 150,
    minHeight: 100,
    useContentSize: false,
    show: false,
    frame: false,
    transparent: true,
    vibrancy: 'ultra-dark',
    devtools: false,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true
    }
  })

  captureWindow.loadURL(`http://localhost:9080/#/capture`)

  captureWindow.once('ready-to-show', () => {
    captureWindow.show()
  })

  captureWindow.on('move', (e) =>{
    captureWindow.webContents.send('window-move')
  })

  function computeRects(){
    let rect = captureWindow.webContents.getOwnerBrowserWindow().getBounds()
    return [
      {x: 0, y: 0, width: 1920, height: 30},
      {x: 0, y: 0, width: 3, height: rect.height},
      {x: 0, y: rect.height - 3, width: rect.width, height: 3},
      {x: rect.width - 3, y: 0, width: 3, height: rect.height}
    ]
  }
})


ipcMain.on('maximize-window', (event, data) => {
  console.log(data)
  let eventWindow = event.sender.getOwnerBrowserWindow()
  if (!data['maximized']) {
    eventWindow.unmaximize()
  } else {
    eventWindow.maximize()
  }
})
ipcMain.on('resize-window', (event, data) =>{
  let eventWindow = event.sender.getOwnerBrowserWindow()
  let windowX = eventWindow.getPosition()[0]
  let windowY = eventWindow.getPosition()[1]
  let windowWidth = eventWindow.getSize()[0]
  let windowHeight = eventWindow.getSize()[1]
  console.log(windowWidth - data.pageX)
  eventWindow.setSize(windowWidth + (windowWidth - data.pageX), windowHeight + (windowHeight - data.pageY))
})



ipcMain.on('reduce-window', (event) => {
    event.sender.getOwnerBrowserWindow().minimize()
})
ipcMain.on('close-window', (event) => {
   event.sender.getOwnerBrowserWindow().close()
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
