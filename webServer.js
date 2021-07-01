var http = require('http');
var formidable = require('formidable');
let fs = require("fs");

//create a server object:
module.exports = http.createServer(function (req, res) {
    if (req.url == '/uploadFile') {
        console.log("this is working fine man");
        var form = new formidable.IncomingForm({multiples: true});
        form.parse(req, function (err, fields, files) {
            files.fileToUpload.forEach((file) => {
                var oldpath = file.path;
                var newpath = __dirname + "\\storage\\" + file.name;
                fs.rename(oldpath, newpath, function (err) {
                    if (err) throw err;
                    // res.write('File uploaded and moved!');
                    // res.end();
                });
            })
        });
    }
}).listen(8080);

console.log("webServer is listening on port 8080")