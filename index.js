var express = require('express');
var app = express();
var http = require('https');


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
  
app.get('/', function (req, res) {
  getUSD(function(data){
    res.send(data.toString());
  });
});


var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);
});
