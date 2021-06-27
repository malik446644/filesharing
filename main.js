const electron = require("electron");
const url = require("url");
const path =  require("path");

const {app, BrowserWindow, Menu} = electron;

let mainWindow;

// listen for the app to be ready
app.on("ready", function(){
    mainWindow = new BrowserWindow({});
    // load html file 
    // mainWindow.loadURL(`file://${path.join(__dirname, "index.html")}`);
    mainWindow.loadURL(`https://facebook.com`);

    // build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    // insert menu
    Menu.setApplicationMenu(mainMenu)
})

// create menu temolate
const mainMenuTemplate = [
    {
        label: 'file'
    }
]