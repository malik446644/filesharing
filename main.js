const electron = require("electron");

const {app, BrowserWindow, Menu} = electron;

let mainWindow;

app.on("ready", function(){
    mainWindow = new BrowserWindow({});
    mainWindow.loadFile("frontEnd/index.html");

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