const si = require('systeminformation');
const p5 = require('p5');

// async function networkSpeed() {
//     try {
//         const interface = await si.networkStats();
//         let dspeed = (interface[0].rx_sec / 1000000).toFixed(2);
//         let uspeed = (interface[0].tx_sec / 1000000).toFixed(2);
//         document.getElementById('download-speed').innerHTML = dspeed;
//         document.getElementById('upload-speed').innerHTML = uspeed;
//         // console.log('Download Speed:', (interface[0].rx_sec / 1000000).toFixed(2));
//         // console.log('Upload Speed:', (interface[0].tx_sec / 1000000).toFixed(2));
//     } catch (e) {
//         console.log(e)
//     }
// }

const sketch = (s)=> {
    // Function wide variables
    const width = window.innerWidth;
    const height = window.innerHeight;

    s.setup = () => {
        s.createCanvas(width, height);
    }

    s.draw = async () => {
        // Set up variables
        const interface = await si.networkStats();
        let dspeed = (interface[0].rx_sec / 1000000).toFixed(2);
        let uspeed = (interface[0].tx_sec / 1000000).toFixed(2);

        let downAngle = s.map(dspeed, 0, 5, -Math.PI/2, 1.5*Math.PI);
        let upAngle = s.map(uspeed, 0, 3, -Math.PI/2, 1.5*Math.PI);

        // s.background('rgba(0,0,0,0)');
        s.clear()

        s.fill(255);
        s.noStroke()
        s.textSize(14)
        s.textAlign(s.CENTER);
        s.text(`${dspeed}MB\nDownload`, 3.92, 40, 100.08, 64);
        s.text(`${uspeed}MB\nUpload`, 109.92, 40, 100.08, 64)

        // Circles
        s.noFill();
        s.strokeWeight(4);
        s.stroke(0,0,255);
        s.arc(52, 52, 100, 100, -Math.PI/2, downAngle);

        s.stroke(0,255 ,0);
        s.arc(158, 52, 100, 100, -Math.PI/2, upAngle);

        // s.stroke(0, 0, 255);
        // s.arc(width/2+150, height/2, 200, 200, -90, 0, upAngle);
    }

    // let angle = Math.PI*2;

    // s.draw = async () => {

    //     s.background(0);
    //     s.noFill();
    //     s.strokeWeight(4);
    //     s.stroke(255,0 ,0);
    //     s.arc(50, 55, 50, 50, 0, Math.PI*2);
    // }
}

const sketchInstance = new p5(sketch);

// let intervall = setInterval(networkSpeed, 100);

function getSizeCalc(bytes) {
    var i = -1;
    var units = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
    do {
        bytes = bytes / 1024; i++;
    } while (bytes > 1024);
    return Math.max(bytes, 0.1).toFixed(1) + units[i];
};