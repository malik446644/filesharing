const electron = require('electron');
const {ipcRenderer} = electron;

let device = document.querySelector(".device");

device.addEventListener("click", () => {
    console.log("this is working man")
    ipcRenderer.send('items', ["item1", "item2", "item3", "item4", "item5", "item6"]);
})  