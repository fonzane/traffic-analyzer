const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron')
require('electron-reload')(__dirname);
const speedTest = require('./speedtest');

let dspeed = 0;

// ==== Global IPC Handlers ==== //
ipcMain.on('console-log', (event, arg) => {
  console.log(arg);
});


// ==== Functions to create the windows ==== //
function openDownUpFrame() {
  const downUpFrame = new BrowserWindow({
    width: 210,
    height: 104,
    frame: false,
    transparent: true,
    x: 1710,
    y: 2,
    skipTaskbar: false,
    // resizable: false,
    webPreferences: {
      nodeIntegration: true
    },
  });
  downUpFrame.loadFile('downUpFrame/downUpFrame.html');
  console.log('download speed: ', dspeed);
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
  //Create Windows
  const downUpFrame = openDownUpFrame();
  const trafficUI = openTrafficUI();

  //Enable Devtools
  globalShortcut.register("CmdOrCtrl+F12", () => {
    trafficUI.isFocused() && trafficUI.webContents.toggleDevTools();
    downUpFrame.isFocused() && downUpFrame.webContents.toggleDevTools();
  });

  //Listener for Userinput regarding max speed values arg: [type: download/upload, value: number]
  ipcMain.on('max-change', (event, arg) => {
    console.log(arg);
    downUpFrame.webContents.send('max-change', arg);
  })

  ipcMain.on('speed-test', async(event, arg) => {
    dspeed = await speedTest.testDownloadSpeed();
    downUpFrame.webContents.send('speed-test', dspeed);
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