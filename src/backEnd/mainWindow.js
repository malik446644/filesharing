let fs = require("fs")
let path = require("path")

const electron = require("electron");
const find = require('local-devices');
const internalIp = require('internal-ip');
const publicIp = require('public-ip');
let Settings = require("./Settings");

const {BrowserWindow, Menu, ipcMain} = electron;
// importing menu template
let mainMenuTemplate = require("./menuTemplate");

let app = require("../../main")
let neccessaryData = {};
let settingsPath = path.join(__dirname, "../../settings.json");

mainWindow = new BrowserWindow({
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true
    }
});
mainWindow.loadFile("src/frontEnd/index.html");

mainWindow.on('closed', function(){
    app.quit();
});

const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
Menu.setApplicationMenu(mainMenu);

ipcMain.on("giveMeData", (e, data) => {
    find().then(devices => {
        devices.push({ name: '?', ip: '192.168.1.40', mac: '00:00:00:00:00:00' })
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

// checking if the user has set up the settings
ipcMain.on("checkSettings", (e, data) => {
    mainWindow.webContents.send("isSettingSet", Settings.isSettingsSet())
})

// taking name and location from the frontend side
ipcMain.on("userSettings", (e, data) => {
    console.log(data);
    Settings.changeSettings(data);
})

module.exports = {"window": mainWindow, "ipcMain": ipcMain}