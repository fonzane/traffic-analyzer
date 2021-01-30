const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron')
require('electron-reload')(__dirname);

ipcMain.on('console-log', (event, arg) => {
  console.log(arg);
})

function openDownUpFrame() {
  const downUpFrame = new BrowserWindow({
    width: 210,
    height: 104,
    // frame: false,
    // transparent: true,
    x: 1710,
    y: 2,
    skipTaskbar: false,
    // resizable: false,
    webPreferences: {
      nodeIntegration: true
    },
  });
  downUpFrame.loadFile('downUpFrame/downUpFrame.html');
  return downUpFrame;
}

function openTrafficUI() {
  const bandwidthAnalyzer = new BrowserWindow({
    height: 200,
    width: 210,
    x: 1710,
    y: 106,
    frame: false,
    // transparent: true,
    webPreferences: {
      nodeIntegration: true
    }
  })
  // bandwidthAnalyzer.setMenu(null);
  bandwidthAnalyzer.loadFile('trafficUI/trafficUI.html');
  return bandwidthAnalyzer;
}
  
app.whenReady().then(() => {
  const downUpFrame = openDownUpFrame();
  const trafficUI = openTrafficUI();
  globalShortcut.register("CmdOrCtrl+F12", () => {
    trafficUI.isFocused() && trafficUI.webContents.toggleDevTools();
    downUpFrame.isFocused() && downUpFrame.webContents.toggleDevTools();
  });
  ipcMain.on('reset', (event, arg) => {
    downUpFrame.webContents.send('reset', arg);
  })
})
  
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