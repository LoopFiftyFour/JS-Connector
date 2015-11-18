
var host = '127.0.0.1';
var port = 5001;
var express = require("express");

var app = express();
app.use(express.static(__dirname + "/bin"));

app.listen(port, host);
