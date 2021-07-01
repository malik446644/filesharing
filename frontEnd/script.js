const electron = require('electron');
const {ipcRenderer} = electron;

// selecting current device information html elements
let currentDevicePrivateAddress = document.querySelector(".currentDevicePrivateAddress");
let currentDevicePublicAddress = document.querySelector(".currentDevicePublicAddress");

// selecting local devices list container
let devicesContainer = document.querySelectorAll(".container")[1]

// send a signal to the electron app to give us (front end) the nesseccary data
// this is sending the data only when the front end is able to read data
ipcRenderer.send("giveMeData", null);

ipcRenderer.on("neccessaryData", (e, data) => {
    currentDevicePrivateAddress.innerHTML = data.privateIP
    currentDevicePublicAddress.innerHTML = data.publicIP
    let devicesHTML = "";
    data.devices.forEach((device) => {
        devicesHTML += `<div class="device">
            <div class="containerinnerTitle"><span class="bold">private ip address: </span>${device.ip}</div>
            <div class="containerinnerTitle"><span class="bold">private mac: </span>${device.mac}</div>
        </div>`;
    })
    devicesContainer.innerHTML = devicesHTML;
})