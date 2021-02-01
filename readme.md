# Network Traffic Analyzer

### General Information
This app is supposed to give detailed and beautiful visual feedback and information regarding a computers network traffic. Since it is build with **Electron**, it is supposed to be cross-platform comaptible.
So far the download- and upload speed is presented on the upper right corner of the screen (it should only work on 1080p monitors at the moment) in digits as well as in a blue and a green circle. Max download and upload speed (which represent 360° of the circles) can also be set manually via two input fields below. But in a future version this is most likely to be replaced by a speedtest feature.

### Usage
This app is under construction. It's not guaranteed that it will work. So far there seems to be an issue when the computer uses a non default network interface for communication and so the down- and upload speed capturing will not work.

### Setup
1. Clone or download this repository
2. Change into its dir `cd traffic-analyzer`
3. Install dependencies `npm install`
4. Run the app `npm start`
