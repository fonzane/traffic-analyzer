const si = require('systeminformation');

async function main() {
    const connections = await si.networkConnections()
    connections.forEach(connection => {
        console.log(connection.process);
    })
}

main();