var net = require('net');
var EventEmitter = require('events');
var util = require('util');
var protocols = require('./protocol/');
var Connection = require('./connection');

module.exports = Client;

function Client(port, host, protocol) {
  if(!(this instanceof Client)) return new Client(port, host, protocol) ;
  if(!port) {
    throw new Error('socket client need port');
  }

  if(!protocol) {
    protocol = host;
    host = null;
  }

  EventEmitter.call(this);

  this.port = port;
  this.host = host || '0.0.0.0';
  this.protocol = protocols[protocol] ? protocols[protocol] : protocols['json'];
  this.connections = {};

  this.connect();
}

util.inherits(Client, EventEmitter);

Client.prototype.connect = function() {
  var socket = net.connect(this.port);
  this.bindEvents(socket);
}

Client.prototype.bindEvents = function(socket) {
  var self = this;
  var connection = new Connection(this, socket, this.protocol);
  socket.on('connect', function() {
    self.connections[connection.id] = connection;
    self.emit('connection', connection);
  });

}

Client.prototype.onData = function(data) {
  this.emit('data', data);
};

Client.prototype.onDisconnect = function(connection) {
  this.emit('disconnect');
}

Client.prototype.onError = function(err) {
  this.emit('error', err);
};
