const electron = require("electron");
const find = require('local-devices');
const internalIp = require('internal-ip');
const publicIp = require('public-ip');

const {BrowserWindow, Menu, ipcMain} = electron;
// importing menu template
let mainMenuTemplate = require("./menuTemplate");

let app = require("./main")
let neccessaryData = {};

mainWindow = new BrowserWindow({
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true
    }
});
mainWindow.loadFile("frontEnd/index.html");

mainWindow.on('closed', function(){
    app.quit();
});

const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
Menu.setApplicationMenu(mainMenu);

ipcMain.on("giveMeData", (e, data) => {
    find().then(devices => {
        devices.push({ name: '?', ip: 'localhost', mac: '00:00:00:00:00:00' })
        neccessaryData.devices = devices;
        return internalIp.v4();
    }).then((ip) => {
        neccessaryData.privateIP = ip;
        return publicIp.v4();
    }).then((ip) => {
        neccessaryData.publicIP = ip;
        mainWindow.webContents.send("neccessaryData", neccessaryData);
    });
});

module.exports = mainWindow