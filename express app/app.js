var http = require('http');
var express = require('express');

var app = express();

app.use(function(request, response){
    console.log("Request URL: " + request.url);
    console.log("Request Time: " + new Date());
});

var server = http.createServer(app);
server.listen(3000, () => {
    console.log("Server listening on Port 3000");
});