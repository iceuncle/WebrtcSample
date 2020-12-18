'use strict'

var http = require('http');

var serveIndex = require('serve-index');

var express = require('express');
var app = express();

app.use(serveIndex('./public'));
app.use(express.static('./public'));

var http_server = http.createServer(app);
http_server.listen(8080, '0.0.0.0');


