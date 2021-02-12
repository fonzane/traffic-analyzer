var sudo = require('sudo-prompt');
var options = {
  name: 'Electron',
  //icns: '/Applications/Electron.app/Contents/Resources/Electron.icns', // (optional)
};
sudo.exec('npm start', options,
  function(error, stdout, stderr) {
    if (error) throw error;
    console.log('stdout: ' + stdout);
  }
);