const electron = require("electron");
const path = require('path')
const find = require('local-devices');
const internalIp = require('internal-ip');
const publicIp = require('public-ip');

const {app} = electron;

app.on("ready", function(){
    // importing the mainwindow 
    let mainWindow = require("./src/backEnd/mainWindow")
    // importing the webServer
    let webServer = require("./src/backEnd/webServer");
});


module.exports = app