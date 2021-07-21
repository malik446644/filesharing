var http = require('http');
let fs = require("fs");

var formidable = require('formidable');
let customFunctions = require("./customFunctions");
let mainWindow = require("./mainWindow");
let path = require("path");
let settings = require("./Settings")

let sender = null;
let reciever = null;
let progress = null;

//create a server object:
http.createServer(function (req, res) {
    if (req.url == '/canISendTheseFiles') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString(); // convert Buffer to string
        });
        req.on('end', () => {
            mainWindow.window.webContents.send("request", body);
        });
    }
    else if (req.url == '/name'){
        res.end(settings.getSettings().name);
    }
    else if (req.url == '/progress'){
        res.end(progress == null ? "null" : progress);
    }
    else if (req.url == '/send'){
        reqSender = req.socket.remoteAddress;
        console.log("request sender ip is: " + reqSender);
        if (reqSender != reciever) return res.end("you dont have permission to make this device send the files");
        mainWindow.window.webContents.send("send", null);
    }
    else if (req.url == '/uploadFile') {
        reqSender = req.socket.remoteAddress;
        console.log("request sender ip is: " + reqSender);
        if (reqSender != sender) return res.end("you dont have permission to send files to this device");
        let form = new formidable.IncomingForm({
            multiples: true,
        });
        form.maxFileSize = 50 * 1024 * 1024 * 1024 * 1024;                  // the maximum files size to transfer in 50 terabytes
        form.parse(req, function (err, fields, files) {
            if(err) return console.log(err);
            let folderName = Date.now().toString();
            let dirPath = settings.getSettings().location
            fs.mkdirSync(path.join(dirPath, folderName));
            if(Array.isArray(files.fileToUpload)){                          // if it's mutiple files
                files.fileToUpload.forEach((file) => {
                    let oldpath = file.path;
                    let newpath = path.join(dirPath, folderName, file.name);
                    fs.rename(oldpath, newpath, function (err) {
                        if (err) throw err;
                    });
                })
            }
            else {                                                          // if it's one file
                let oldpath = files.fileToUpload.path;
                let newpath = path.join(dirPath, folderName, files.fileToUpload.name);
                fs.rename(oldpath, newpath, function (err) {
                    if (err) throw err;
                });
            }
            sender = null;
            reciever = null;
            progress = null
        });
        form.on('progress', function(bytesReceived, bytesExpected) {
            progress = customFunctions.map_range(bytesReceived, 0, bytesExpected, 0, 100).toFixed(2);
            mainWindow.window.webContents.send("progress", progress);
            console.log(progress);
        });
    }
}).listen(8080, '0.0.0.0');

mainWindow.ipcMain.on("sender", (e, data) => {
    console.log(data)
    sender = data
    http.get(`http://${data}:8080/send`)
})

mainWindow.ipcMain.on("reciever", (e, data) => {
    reciever = data;
})

mainWindow.ipcMain.on("resetData", (e, data) => {
    console.log("done resentting data")
    sender = null;
    reciever = null;
    progress = null
})

console.log("webServer is listening on port 8080")