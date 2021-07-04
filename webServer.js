var http = require('http');
var formidable = require('formidable');
let fs = require("fs");
let customFunctions = require("./customFunctions")
let mainWindow = require("./mainWindow")

//create a server object:
http.createServer(function (req, res) {
    if (req.url == '/canISendTheseFiles') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString(); // convert Buffer to string
        });
        req.on('end', () => {
            console.log(body);
            mainWindow.webContents.send("request", "im just testing man .. dont worry");
        });
    }
    else if (req.url == '/uploadFile') {
        var form = new formidable.IncomingForm({multiples: true});
        form.maxFileSize = 50 * 1024 * 1024 * 1024 * 1024;                  // the maximum files size to transfer in 50 terabytes
        form.parse(req, function (err, fields, files) {
            if(err) return console.log(err);
            if(Array.isArray(files.fileToUpload)){                          // if it's mutiple files
                files.fileToUpload.forEach((file) => {
                    var oldpath = file.path;
                    var newpath = __dirname + "\\storage\\" + file.name;
                    fs.rename(oldpath, newpath, function (err) {
                        if (err) throw err;
                        // res.write('File uploaded and moved!');
                        // res.end();
                    });
                })
            }
            else {                                                          // if it's one file
                var oldpath = files.fileToUpload.path;
                var newpath = __dirname + "\\storage\\" + files.fileToUpload.name;
                fs.rename(oldpath, newpath, function (err) {
                    if (err) throw err;
                    // res.write('File uploaded and moved!');
                    // res.end();
                });
            }
        });
        form.on('progress', function(bytesReceived, bytesExpected) {
            let progress = customFunctions.map_range(bytesReceived, 0, bytesExpected, 0, 100).toFixed(2) == 100.00 ? 100 : customFunctions.map_range(bytesReceived, 0, bytesExpected, 0, 100).toFixed(2);
            console.log(progress);
        });
    }
}).listen(8080);

console.log("webServer is listening on port 8080")