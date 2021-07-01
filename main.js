const electron = require("electron");
const path = require('path')
const find = require('local-devices');
const internalIp = require('internal-ip');
const publicIp = require('public-ip');

const {app, BrowserWindow, Menu, ipcMain} = electron;

// Enable live reload for Electron too 
require('electron-reload')(__dirname, {
  electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
});

let mainWindow;
let neccessaryData = {};

app.on("ready", function(){
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
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
            console.log(devices);
            neccessaryData.devices = devices;
            return internalIp.v4();
        }).then((ip) => {
            neccessaryData.privateIP = ip;
            console.log(neccessaryData.privateIP)
            return publicIp.v4();
        }).then((ip) => {
            neccessaryData.publicIP = ip;
            console.log(neccessaryData.publicIP)
            mainWindow.webContents.send("neccessaryData", neccessaryData);
        });
    });
});

// importing menu template
let mainMenuTemplate = require("./menuTemplate")