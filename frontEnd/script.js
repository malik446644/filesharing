const electron = require('electron');
const {ipcRenderer} = electron;

// selecting current device information html elements
let currentDevicePrivateAddress = document.querySelector(".currentDevicePrivateAddress");
let currentDevicePublicAddress = document.querySelector(".currentDevicePublicAddress");

// selecting local devices list container
let devicesContainer = document.querySelectorAll(".container")[1];

// initilizing these DOM elements to use it gloabally
let forms;
let inputs;
let sendImages;

// send a signal to the electron app to give us (front end) the nesseccary data
// this is sending the data only when the front end is able to read data
ipcRenderer.send("giveMeData", null);

ipcRenderer.on("neccessaryData", (e, data) => {
    currentDevicePrivateAddress.innerHTML = data.privateIP;
    currentDevicePublicAddress.innerHTML = data.publicIP;
    let devicesHTML = "";
    data.devices.forEach((device) => {
        devicesHTML += `<div class="device">
            <div>
                <div class="containerinnerTitle"><span class="bold">private ip address: </span>${device.ip}</div>
                <div class="containerinnerTitle"><span class="bold">private mac: </span>${device.mac}</div>
            </div>
            <form style="display: none;" class="theForm" action="http://${device.ip}:8080/uploadFile" method="post" enctype="multipart/form-data">
                <input type="file" name="fileToUpload" class="fileToUpload" multiple>
            </form>
            <img class="sendButton" style="cursor: pointer;" src="https://cdn.iconscout.com/icon/free/png-512/send-forward-arrow-right-direction-import-30559.png" height="35" width="35"></img>
        </div>`;
    })
    devicesContainer.innerHTML = devicesHTML;

    // selecting all the forms and the send images
    forms = document.querySelectorAll(".theForm")
    inputs = document.querySelectorAll(".fileToUpload")
    sendImages = document.querySelectorAll(".sendButton")

    // adding eventListeners for the send images
    sendImages.forEach((sendImage, i) => {
        sendImage.addEventListener("click", () => {
            inputs[i].click();
        });
    });

    // adding eventListeners for the inputs
    inputs.forEach((input, i) => {
        input.addEventListener("change", () => {
            forms[i].submit();
        });
    });
});