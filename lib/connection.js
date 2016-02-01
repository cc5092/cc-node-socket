var net = require('net');
var EventEmitter = require('events');
var util = require('util');
var base64id = require('base64id');
var Server = require('./server');
var Client = require('./client');
console.log("I want Client Ready here");

module.exports = Connection;
console.log("Connection Ready");

function Connection(container, socket, protocol) {
  EventEmitter.call(this);

  this.id = base64id.generateId();
  this.socket = socket;
  this.container = container;
  this.protocol = new protocol(this);
  socket.setNoDelay(true);

  /*if(container instanceof Server) {
    this.type = 'server';
  } else {
    this.type = 'client';
  } */

  this.bindEvent(socket);
}

util.inherits(Connection, EventEmitter);

Connection.prototype.bindEvent = function(socket) {
  var self = this;
  socket.on('data', function(data) {
    self.protocol.put(data);
  });

  socket.on('close', function() {
    self.onClose();
  })
};

Connection.prototype.send = function(data) {
  this.socket.write(self.protocol.encode(data));
};

Connection.prototype.onData = function(data) {
  //send data to connection's container
  this.container.onData(data);
}

Connection.prototype.onClose = function() {
  this.container.onDisconnect(this);
};
