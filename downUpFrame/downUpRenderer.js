const si = require('systeminformation');
const p5 = require('p5');
const { ipcRenderer } = require('electron');

// Listen for Userinput Events from another Window
ipcRenderer.on('max-change', (event, arg) => {
    userInput = true;
    if (arg[1] === '' || arg[1] === '0') {
        userInput = false;
        maxDownSpeed = 0;
        maxDownloads.clear();
        maxUpSpeed = 0;
        maxUploads.clear();
    } else {
        if(arg[0] === "download") {
            maxDownSpeed = arg[1];
        } else if (arg[0] === "upload") {
            maxUpSpeed = arg[1];
        }
    }
});

ipcRenderer.on('speed-test', (event, arg) => {
    speedTest = true;
    maxDownSpeed = arg;
    console.log(event);
    console.log(arg);
})

let speedTest = false;
let userInput = false;
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
        const interfaces = await si.networkStats();
        let dspeed = +(interfaces[0].rx_sec / 1000000).toFixed(2);
        let uspeed = +(interfaces[0].tx_sec / 1000000).toFixed(2);

        // try {
        //     activeInterfaces.forEach(interface => {
        //         dspeed += +(interface.rx_sec / 1000000).toFixed(2);
        //         uspeed += +(interface.tx_sec / 1000000).toFixed(2);
        //     })
        // } catch {
        //     console.log("Interfaces not initialized");
        // }

        if (!userInput || !speedTest) {
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