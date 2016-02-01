var Server = require('./server');
var Client = require('./client');

var port = 3000;
var server = new Server(port);
var client = new Client(port);
