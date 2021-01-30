const si = require('systeminformation');
const p5 = require('p5');
const { ipcRenderer } = require('electron');

ipcRenderer.on('reset', (event, arg) => {
    if(arg === "download") {
        maxDownSpeed = 0;
    } else if (arg === "upload") {
        maxUpSpeed = 0;
    }
});

let maxDownloads = new Set();
let maxUploads = new Set();
let maxDownSpeed = 0;
let maxUpSpeed = 0;

function removeOutlier(set, variable) {
    let lastVal = [...set][set.size-1];
    if(set.size >= 2) {
        if (variable > lastVal + 4* Math.pow(0.55, lastVal)) {
            console.log('not added', variable, lastVal);
            return lastVal;
        } else {
            console.log('added', variable, lastVal);
            set.add(variable);
            return variable;
        }
    } else {
        set.add(variable);
        return variable;
    }
}

const sketch = (s)=> {
    ipcRenderer.send('console-log', 'sketch called');
    // Function wide variables
    const width = window.innerWidth;
    const height = window.innerHeight;

    s.setup = () => {
        s.createCanvas(width, height);
    }

    s.draw = async () => {
        // Set up variables
        const interface = await si.networkStats();
        let dspeed = +(interface[0].rx_sec / 1000000).toFixed(2);
        let uspeed = +(interface[0].tx_sec / 1000000).toFixed(2);

        // Set max upload and download speed
        if (/*!isNaN(dspeed) && */ dspeed !== Infinity && dspeed >= maxDownSpeed) {
            maxDownSpeed = dspeed;
            maxDownSpeed = removeOutlier(maxDownloads, maxDownSpeed);
            ipcRenderer.send('console-log', 'New Download ' + +maxDownSpeed);
            ipcRenderer.send('console-log', maxDownloads);
        }
        if (/*!isNaN(uspeed) && */ uspeed !== Infinity && uspeed >= maxUpSpeed) {
            maxUpSpeed = uspeed;
            maxUpSpeed = removeOutlier(maxUploads, maxUpSpeed);
            ipcRenderer.send('console-log', 'New Upload ' + +maxUpSpeed);
            ipcRenderer.send('console-log', maxUploads);
        }

        // Smoothing -> Durchschnittliche Werte rendern (die letzten 5/10/15)!
        let downAngle = s.map(dspeed, 0, maxDownSpeed, -Math.PI/2, 1.5*Math.PI);
        let upAngle = s.map(uspeed, 0, maxUpSpeed, -Math.PI/2, 1.5*Math.PI);

        s.clear()

        // Text
        s.fill(255);
        s.noStroke()
        s.textSize(10)
        s.textAlign(s.CENTER);
        s.text(`${dspeed}MB/s\nDownload\nMax: ${maxDownSpeed}MB/s`, 3.92, 37, 100.08, 67);
        s.text(`${uspeed}MB/s\nUpload\nMax: ${maxUpSpeed}MB/s`, 109.92, 37, 100.08, 37)

        // Circles
        s.noFill();
        s.strokeWeight(4);
        s.stroke(0,0,255);
        s.arc(52, 52, 100, 100, -Math.PI/2, downAngle);

        s.stroke(0,255 ,0);
        s.arc(158, 52, 100, 100, -Math.PI/2, upAngle);
    }
}

const sketchInstance = new p5(sketch);

function getSizeCalc(bytes) {
    var i = -1;
    var units = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
    do {
        bytes = bytes / 1024; i++;
    } while (bytes > 1024);
    return Math.max(bytes, 0.1).toFixed(1) + units[i];
};