let http = require("http");

const electron = require("electron");
const find = require('local-devices');
const internalIp = require('internal-ip');
const publicIp = require('public-ip');
let Settings = require("./Settings");

const {BrowserWindow, Menu, ipcMain} = electron;
// importing menu template
let mainMenuTemplate = require("./menuTemplate");

let app = require("../../main");
const { resolve } = require("path");
let neccessaryData = {};

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
        let promises = [];
        for (let i = 0; i < neccessaryData.devices.length; i++) {
            promises.push(new Promise((resolve, reject) => {
                var options = {
                    host: neccessaryData.devices[i].ip,
                    path: '/name',
                    port: 8080,
                    method: "GET",
                    timeout: 4000,
                };
                let request = http.request(options, (res) => {
                    res.on("data", (chunk) => {
                        console.log(chunk.toString());
                        neccessaryData.devices[i].name = chunk.toString();
                    });
                    resolve();
                });
                request.on("error", (e) => {
                    console.log("no name for " + neccessaryData.devices[i].ip);
                    resolve();
                });
                request.on("timeout", () => {
                    request.destroy();
                });
                request.end()
            }))
        }
        Promise.all(promises).then(() => {
            console.log(neccessaryData);
            mainWindow.webContents.send("neccessaryData", neccessaryData);
        })
    });
});

// checking if the user has set up the settings
ipcMain.on("checkSettings", (e, data) => {
    mainWindow.webContents.send("isSettingSet", Settings.isSettingsSet())
})

// taking name and location from the frontend side
ipcMain.on("userSettings", (e, data) => {
    Settings.changeSettings(data);
})

module.exports = {"window": mainWindow, "ipcMain": ipcMain}