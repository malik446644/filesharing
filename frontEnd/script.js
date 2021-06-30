const electron = require('electron');
const {ipcRenderer} = electron;

// selecting the html elements
let currentDevicePrivateAddress = document.querySelector(".currentDevicePrivateAddress");
let currentDevicePublicAddress = document.querySelector(".currentDevicePublicAddress");

// send a signal to the electron app to give us (front end) the nesseccary data
// this is sending the data only when the front end is able to read data
ipcRenderer.send("giveMeData", null);

ipcRenderer.on("neccessaryData", (e, data) => {
    console.log(data);
    currentDevicePrivateAddress.innerHTML = data.privateIP
    currentDevicePublicAddress.innerHTML = data.publicIP
})