const { app, BrowserWindow } = require('electron')
require('electron-reload')(__dirname);

function createWindows () {
    const downUpFrame = new BrowserWindow({
      width: 210,
      height: 104,
      frame: false,
      transparent: true,
      x: 1710,
      y: 2,
      skipTaskbar: true,
      resizable: false,
      webPreferences: {
        nodeIntegration: true
      },
    })
    downUpFrame.loadFile('downUpFrame/index.html');
  }
  
  app.whenReady().then(createWindows)
  
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })