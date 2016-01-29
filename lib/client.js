var net = require('net');
var EventEmitter = require('events');
var util = require('util');
var protocols = require('./protocol/');
var Connection  =require('./connection');

module.exports = Client;

function Client(port, host, protocol) {
  if(!(this instanceof Client)) return new Client(port, host, protocol) ;
  if(!port) {
    throw new Error('socket client need port');
  }

  EventEmitter.call(this);

  this.port = port;
  this.host = host || '0.0.0.0';
  this.connections = {};

  this.connect();
}

util.inherits(Server, EventEmitter);

Server.prototype.connect = function() {
  this._server.listen(this.port, this.host);

  var socket = net.connect(port, function() {
    client.write(ret);
  });
}

Server.prototype.bindEvents = function() {
  var self = this;
  this._server.on('listening', function() {
    self.emit('listening');
  });
  this._server.on('connection', function(socket) {
    var connection = new Connection(self, socket, self.protocol);
    self.connections[connection.id] = connection;

    self.emit('connection', connection);
  });
  this._server.on('error', function(err) {
    self.emit('error', err);
  });
  this._server.on('close', function() {
    self.emit('close');
  });
}

Server.prototype.protocol = function(protocol) {
  this.protocol = protocols[protocol] ? protocols[protocol] : protocols['json'];
};

Server.prototype.onData = function(data) {
  this.emit('data', data);
};
