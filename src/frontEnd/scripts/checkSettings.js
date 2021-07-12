const electron = require('electron');
const {ipcRenderer} = electron;

export default function checkSettings() {
    ipcRenderer.send("checkSettings", null)
}