const electron = require('electron');
const {ipcRenderer} = electron;

export default function checkSettings() {
    return new Promise((resolve, reject) => {
        let settings = document.querySelector(".settings");

        ipcRenderer.send("checkSettings", null);

        ipcRenderer.on("isSettingSet", (e, data) => {
            if(data){
                console.log("settings are set");
                resolve();
            }else{
                console.log("settings are not set");
                settings.style.display = "flex"
                // taking information from the user and then resolve
            }
        });
    });
}