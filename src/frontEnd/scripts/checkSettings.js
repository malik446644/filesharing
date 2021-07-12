const electron = require('electron');
const {ipcRenderer} = electron;
let dialog = electron.remote.dialog

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
                settings.style.display = "flex";
                let nameInput = document.querySelectorAll(".nameInput")[0];
                let locationInput = document.querySelectorAll(".nameInput")[1];
                document.querySelector(".confirm").addEventListener("click", () => {
                    if(nameInput.value == "" || locationInput.value == "") dialog.showMessageBox(null, {message: "you need to fill all fields", title: "message"});
                })
                // taking information from the user and then resolve
            }
        });
    });
}