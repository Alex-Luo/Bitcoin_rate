var express = require('express');
var app = express();
var http = require('https');
var fs = require('fs');

function getUSD(callback) {
	http.get('https://blockchain.info/ticker', function(res) {
    var body = '';
    res.setEncoding('utf8');

    res.on('data', function(data) {
      body += data;
    });

    res.on('end', function() {
      body = JSON.parse(body);
      callback(body.USD.last);
    });

  }).on('error', function(e) {
    console.log('Got error: ' + e.message);
  });
}

app.get('/calculate', function (req, res) {

  getUSD(function(data){
    res.send(data.toString());
  });
});

app.get('/', function (req, res) {
  fs.readFile('HTML/index.html', function(err, text){
    res.setHeader('Content-Type', 'text/html');
    res.end(text);
  });
  return;
});

var server = app.listen(process.env.PORT || 3000, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);
});
