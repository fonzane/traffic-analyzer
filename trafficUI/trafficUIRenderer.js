const si = require('systeminformation');
const { ipcRenderer } = require('electron');

function onChangeMax(type) {
    let id = 'max' + type.charAt(0).toUpperCase() + type.slice(1);
    const value = document.getElementById(id).value;
    ipcRenderer.send('max-change', [type, value]);
}