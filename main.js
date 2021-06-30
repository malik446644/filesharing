const electron = require("electron");

// Enable live reload for Electron too
require('electron-reload')(__dirname, {
    // Note that the path to electron may vary according to the main file
    electron: require(`${__dirname}/node_modules/electron`)
});

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;

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

    ipcMain.on("items", (e, items) => {
        console.log(items)
        app.quit();
    })

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu)
})

// create menu temolate
const mainMenuTemplate = [
    {
        label: 'file'
    }
]

if(process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
      label: 'Developer Tools',
      submenu:[
        {
          role: 'reload'
        },
        {
          label: 'Toggle DevTools',
          accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
          click(item, focusedWindow){
            focusedWindow.toggleDevTools();
          }
        }
      ]
    });
  }