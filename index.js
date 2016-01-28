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

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);



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

var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);
});
