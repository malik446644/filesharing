const electron = require('electron');
const {ipcRenderer} = electron;

export default function init(){

    // selecting loading container
    let loadingContainer = document.querySelector(".loadingContainer");
    let percentage = document.querySelector(".percentage");
    let loadingBar = document.querySelector(".loadingBar");

    // selecting current device information html elements
    let currentDevicePrivateAddress = document.querySelector(".currentDevicePrivateAddress");
    let currentDevicePublicAddress = document.querySelector(".currentDevicePublicAddress");

    // selecting local devices list container
    let devicesContainer = document.querySelectorAll(".container")[1];
    let deviceInformation;

    // selecting request prompts
    let requestPromptBG = document.querySelector(".requestPromptBG");
    let yesButton = document.querySelector(".yes")
    let noButton = document.querySelector(".no")
    let filesInformation = document.querySelector(".filesInformation");

    // selecting wait for accept element
    let waitForAccept = document.querySelector(".waitForAccept")
    let waitForAcceptcancel = document.querySelector(".waitForAccept .cancel")

    // selecting senderip span
    let senderip = document.querySelector(".senderip")
    let senderName = document.querySelector(".senderName")

    // initilizing these DOM elements to use it gloabally
    let form = document.querySelector(".theForm")
    let input = document.querySelector(".fileToUpload")
    let sendImages;

    let currentDeviceName;

    // send a signal to the electron app to give us (front end) the nesseccary data
    // this is sending the data only when the front end is able to read data
    ipcRenderer.send("giveMeData", null);
    setInterval(() => {
        ipcRenderer.send("giveMeData", null);
    }, 5000)
    
    // events from electron
    ipcRenderer.on("neccessaryData", (e, data) => {
        // console.log("data has arrived")
        currentDevicePrivateAddress.innerHTML = data.privateIP;
        currentDevicePrivateAddress.dataset.privateip = data.privateIP;
        currentDevicePublicAddress.innerHTML = data.name;
        if(data.devices.length != 0){
            devicesContainer.innerHTML = ""
            data.devices.forEach((device) => {
                devicesContainer.innerHTML += `<div class="device">
                    <div class="deviceInformation" data-ip="${device.ip}" data-mac="${device.mac}">
                    <div class="containerinnerTitle" ><span class="bold">device name: </span>${device.name}</div>
                    <div class="containerinnerTitle"><span class="bold">private ip address: </span>${device.ip}</div>
                    </div>
                    <img class="sendButton" style="cursor: pointer;" src="https://cdn.iconscout.com/icon/free/png-512/send-forward-arrow-right-direction-import-30559.png" height="35" width="35"></img>
                </div>`;
            })
        }else{
            devicesContainer.innerHTML = "there are no devices in this local network"
        }
        
        // selecting all the send images
        sendImages = document.querySelectorAll(".sendButton")
        
        // adding eventListeners for the send images
        deviceInformation = document.querySelectorAll(".deviceInformation");
        sendImages.forEach((sendImage, i) => {
            sendImage.addEventListener("click", () => {
                form.setAttribute("action", `http://${deviceInformation[i].dataset.ip}:8080/uploadFile`)
                input.dataset.deviceip = deviceInformation[i].dataset.ip;
                input.click();
            });
        });
    });

    ipcRenderer.on("request", (e, data) => {
        data = JSON.parse(data);
        let html = "";
        data.files.forEach((item) => {
            html += `<div>name: ${item.name}, size: ${item.size}</div>`
        })
        filesInformation.innerHTML = html;
        senderip.innerHTML = data.sender
        senderName.innerHTML = data.senderName
        requestPromptBG.style.display = "flex";
    })

    // adding eventListeners for the inputs
    waitForAcceptcancel.addEventListener("click", () => {
        ipcRenderer.send("resetData", null)
        waitForAccept.style.display = "none"
    })

    input.addEventListener("change", () => {
        let files = Array.from(input.files);
        let array = {sender: currentDevicePrivateAddress.dataset.privateip, senderName: currentDevicePublicAddress.innerHTML, files: []};
        files.forEach((file) => {
            array.files.push({
                name: file.name,
                size: file.size
            });
        });
        fetch(`http://${input.dataset.deviceip}:8080/canISendTheseFiles`, {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(array)
        }).then((r) => {
            // console.log(r.body)
        }).catch((err) => {
            console.log("fetch error: " + err)
        });
        waitForAccept.style.display = "flex"
        ipcRenderer.send("reciever", input.dataset.deviceip)
    });

    ipcRenderer.on("send", (e, data) => {
        waitForAccept.style.display = "none"
        form.submit();
        form.reset();
        askProgressLoop()
    })

    ipcRenderer.on("progress", (e, data) => {
        loadingContainer.style.display = "block";
        if(data == "100.00"){
            // console.log("finished with uploading the file");
            loadingContainer.style.display = "none";
            percentage.innerHTML = "0";
            loadingBar.removeAttribute("style")
        }else{
            percentage.innerHTML = data;
            loadingBar.setAttribute("style", `width: ${data}%;`)
        }
    })
    
    // adding event listeners for yes and no button
    yesButton.addEventListener("click", () => {
        requestPromptBG.style.display = "none";
        ipcRenderer.send("sender", senderip.innerHTML);
    })
    
    noButton.addEventListener("click", () => {
        requestPromptBG.style.display = "none";
        form.reset();
    })
    
    // function to ask the server every 150 millisecond about the progress
    function askProgressLoop(){
        loadingContainer.style.display = "block";
        let ID = setInterval(() => {
            fetch(`http://${input.dataset.deviceip}:8080/progress`).then((r) => {
                r.text().then((text) => {
                    if(text == "null"){
                        // console.log("finished with uploading the file");
                        loadingContainer.style.display = "none";
                        percentage.innerHTML = "0";
                        loadingBar.removeAttribute("style")
                        clearInterval(ID);
                    }else{
                        percentage.innerHTML = text;
                        loadingBar.setAttribute("style", `width: ${text}%;`)
                    }
                })
            }).catch((error) => {
                console.log("fetch error: " + error)
            });
        }, 150);
    }
}
