const { ipcRenderer } = require('electron');

function onDownloadSpeedTest() {
    ipcRenderer.send('speed-test', 'download');
}

function onChangeMax(type) {
    let id = 'max' + type.charAt(0).toUpperCase() + type.slice(1);
    const value = document.getElementById(id).value;
    ipcRenderer.send('max-change', [type, value]);
}