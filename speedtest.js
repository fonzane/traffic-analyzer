const net = require('net');
const fs = require('fs');

const speedtest = {
    dspeed: 0,
    testDownloadSpeed: () => {
        return new Promise(resolve => {
            try {
                fs.unlinkSync('speedfile.dat');
                console.log('file deleted');
            } catch {
                console.log('file not found');
            }
            const stream = fs.createWriteStream('speedfile.dat');
          
            let startTime = 0;
            const tcpConn = net.createConnection({
                host: 'freedom-of-mind.de',
                port: 5432
            }, () => {
                startTime = Date.now();
                console.log('connected to server');
                console.log('File transfer started.');
            });
            tcpConn.on('data', (data) => {
                stream.write(data);
            });
            tcpConn.on('end', () => {
                stream.close();
                const endTime = Date.now();
                console.log('File transfer ended.');
                const fileSize = fs.statSync('speedfile.dat').size;
                console.log('Filesize: ', fileSize);
                this.dspeed = (fileSize / ((endTime - startTime)/1000))/1000000;
                console.log('Downloadspeed: ', this.dspeed);
                resolve(this.dspeed);
            })
            tcpConn.on('error', () => {
                stream.close();
                console.log('an error occurred.');
            })
        })
    }
        
}

module.exports = speedtest;