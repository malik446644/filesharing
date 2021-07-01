var http = require('http');

//create a server object:
module.exports = http.createServer(function (req, res) {
    console.log("recieved a request")
    req.on("data", (data) => {
        console.log(data);
    })
    res.write('Hello World!');
    res.end();
}).listen(8080);

console.log("webServer is listening on port 8080")