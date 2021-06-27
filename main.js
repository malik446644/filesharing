const electron = require("electron");
const url = require("url");
const path =  require("path");

const {app, BrowserWindow} = electron;

let mainWindow;

// listen for the app to be ready
app.on("ready", function(){
    mainWindow = new BrowserWindow({});
    // load html file to window
    mainWindow.loadURL(`file://${path.join(__dirname, "index.html")}`);
})