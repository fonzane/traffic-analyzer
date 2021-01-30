const si = require('systeminformation');
const { ipcRenderer } = require('electron');

function onReset(type) {
    ipcRenderer.send('reset', type);
}

async function getProcesses() {
    const connections = await si.networkConnections();
    connections.forEach((conn) => {
        console.log(conn.pid);
    })
}

getProcesses();