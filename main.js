const electron = require("electron");
const path = require('path')
const find = require('local-devices');
const internalIp = require('internal-ip');
const publicIp = require('public-ip');

const {app} = electron;

// Enable live reload for Electron too 
require('electron-reload')(__dirname, {
  electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
});

let mainWindow;

app.on("ready", function(){
    let mainWindow = require("./src/backEnd/mainWindow")
    // importing the webServer
    let webServer = require("./src/backEnd/webServer");
});


module.exports = app