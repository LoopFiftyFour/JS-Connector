var express = require('express'),
  app = express(),
  http = require('http');
  
http.Server(app);

app.use(express.static(__dirname + '/lib'));
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.sendfile(__dirname + '/public/index.html');
});
app.listen(3001);

console.log("Test environment loaded at http://localhost:3001");
