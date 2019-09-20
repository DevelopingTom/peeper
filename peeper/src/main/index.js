import { app, BrowserWindow } from 'electron'

const dgram = require('dgram');
const UdpHolePuncher = require('udp-hole-puncher');



import ioClient from 'socket.io-client'
const socket = ioClient("http://95.85.46.198");

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
let myId = null;
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
    title: "Capture",
    vibrancy: 'ultra-dark',
    devtools: false,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true
    }
  })  
  captureWindow.loadURL(`http://localhost:9080/#/capture`)
  let punchersave;
  let portsave;
 
  captureWindow.once('ready-to-show', () => {
    captureWindow.show()
    findPort(function(port) {
      portsave = port;
      registerPort(port, "server", null);
      socket.on("client video", function(data) {
        console.log("someone wants video", data)
        updHole(port, {addr: data.ip, port: data.port}, function(puncher) {
          punchersave = puncher;
        });
      });    
    });
  })
  captureWindow.on('move', (e) =>{
    captureWindow.webContents.send('window-move')
  })
  captureWindow.on('closed', () => {
    if (punchersave) {
      punchersave.close()
    }
    socket.emit("unregister me", {type: "server", id: myId, port: portsave});
  })
})

ipcMain.on('socketId', (event, socketId) => {
  myId = socketId;
})

ipcMain.on('read-video', (event, dataid) => {
  let videoWindow = new BrowserWindow({
    height: 500,
    width: 500,
    useContentSize: true,
    show: false,
    frame: true,
    devtools: false,
    webPreferences: {
      nodeIntegration: true
    }
  })
  let portsave;
  let punchersave;
  videoWindow.once('ready-to-show', () => {
    videoWindow.show();
    findPort(function(port) {
      portsave = port;
      registerPort(port, "client", dataid);
      socket.on("server address", function(data) {
        console.log("got a server", data)
        updHole(port, {addr: data.ip, port: data.port}, function(puncher) {
          punchersave = puncher;
        });
      });    
    });
  })
  
  videoWindow.on('closed', () => {
    if (punchersave) {
      punchersave.close()
    }
    socket.emit("unregister me", {type: "client", id: myId, port: portsave});
  })
  
  videoWindow.loadURL(`http://localhost:9080/#/video`);
})


function registerPort(port, type, src) {
  socket.emit("register me", {type: type, id: myId, port: port, src: src});
}

function updHole(myport, peer, callback) {
  console.log("punching ", peer)
  const socketUdp = dgram.createSocket('udp4');
  socketUdp.on('error', (error) => {
    console.error(error)
  } );
  socketUdp.on('message', (message, rinfo) => {
    console.log(message)
  });
  socketUdp.on('listening', () => {
    // puncher config
    const puncher = new UdpHolePuncher(socketUdp);
    // when connection is established, send dummy message
    puncher.on('connected', () => {
      const message = new Buffer('hello');
      socketUdp.send(message, 0, message.length, peer.port, peer.addr);
    });
    // error handling code
    puncher.on('error', (error) => {
      console.error("punch error", error)
    });
    // connect to peer (using its public address and port)
    puncher.connect(peer.addr, peer.port);
    callback(puncher);
  });
  // bind socketUdp
  socketUdp.bind(parseInt(myport));
}
let firstPort = 3000
function findPort(callback) {
  var portscanner = require('portscanner')
  portscanner.findAPortNotInUse(firstPort, 4000, '127.0.0.1', function(error, portAvailable) {
    callback(portAvailable)
  })
  firstPort ++;
}


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
