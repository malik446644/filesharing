const electron = require('electron');
const {ipcRenderer} = electron;

let device = document.querySelector(".device");

device.addEventListener("click", () => {
    console.log("this is working man")
    ipcRenderer.send('item:add', item);
})