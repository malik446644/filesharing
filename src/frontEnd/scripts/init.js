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

    // selecting senderip span
    let senderip = document.querySelector(".senderip")

    // initilizing these DOM elements to use it gloabally
    let form;
    let input;
    let sendImages;

    // send a signal to the electron app to give us (front end) the nesseccary data
    // this is sending the data only when the front end is able to read data
    ipcRenderer.send("giveMeData", null);

    // events from electron
    ipcRenderer.on("request", (e, data) => {
        data = JSON.parse(data);
        let html = "";
        data.files.forEach((item) => {
            html += `<div>name: ${item.name}, size: ${item.size}</div>`
        })
        filesInformation.innerHTML = html;
        senderip.innerHTML = data.sender
        requestPromptBG.style.display = "flex";
    })

    ipcRenderer.on("neccessaryData", (e, data) => {
        currentDevicePrivateAddress.innerHTML = data.privateIP;
        currentDevicePrivateAddress.dataset.privateip = data.privateIP;
        currentDevicePublicAddress.innerHTML = data.publicIP;
        let devicesHTML = "";
        data.devices.forEach((device) => {
            devicesHTML += `<div class="device">
                <div class="deviceInformation" data-ip="${device.ip}" data-mac="${device.mac}">
                    <div class="containerinnerTitle"><span class="bold">private ip address: </span>${device.ip}</div>
                    <div class="containerinnerTitle" ><span class="bold">private mac: </span>${device.mac}</div>
                </div>
                <img class="sendButton" style="cursor: pointer;" src="https://cdn.iconscout.com/icon/free/png-512/send-forward-arrow-right-direction-import-30559.png" height="35" width="35"></img>
            </div>`;
        })
        devicesContainer.innerHTML = devicesHTML;
        deviceInformation = document.querySelectorAll(".deviceInformation");

        // selecting all the forms and the send images
        form = document.querySelector(".theForm")
        input = document.querySelector(".fileToUpload")
        sendImages = document.querySelectorAll(".sendButton")

        // adding eventListeners for the send images
        sendImages.forEach((sendImage, i) => {
            sendImage.addEventListener("click", () => {
                form.setAttribute("action", `http://${deviceInformation[i].dataset.ip}:8080/uploadFile`)
                input.dataset.deviceip = deviceInformation[i].dataset.ip;
                input.click();
            });
        });

        // adding eventListeners for the inputs
        input.addEventListener("change", () => {
            let files = Array.from(input.files);
            let array = {sender: currentDevicePrivateAddress.dataset.privateip, files: []};
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
                console.log(r.body)
            }).catch((err) => {
                console.log(err)
            });
            ipcRenderer.send("reciever", input.dataset.deviceip)
        });
    });

    ipcRenderer.on("send", (e, data) => {
        form.submit();
        form.reset();
        askProgressLoop()
    })

    ipcRenderer.on("progress", (e, data) => {
        loadingContainer.style.display = "block";
        if(data == "100.00"){
            console.log("finished with uploading the file");
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
        ipcRenderer.send("sender", input.dataset.deviceip);
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
                        console.log("finished with uploading the file");
                        loadingContainer.style.display = "none";
                        percentage.innerHTML = "0";
                        loadingBar.removeAttribute("style")
                        clearInterval(ID);
                    }else{
                        percentage.innerHTML = text;
                        loadingBar.setAttribute("style", `width: ${text}%;`)
                    }
                })
            })
        }, 150);
    }
}
