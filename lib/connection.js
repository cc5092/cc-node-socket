var net = require('net');
var EventEmitter = require('events');
var util = require('util');
var base64id = require('base64id');

module.exports = Connection;

function Connection(server, socket, protocol) {
  if(!protocol) {
    protocol = socket;
    socket = server;
    server = null;
  }

  EventEmitter.call(this);

  this.id = base64id.generateId();
  this.socket = socket;
  this.server = server;
  this.protocol = new protocol(this);
  socket.setNoDelay(true);

  this.bindEvent(socket);
}

util.inherits(Connection, EventEmitter);

Connection.prototype.bindEvent = function(socket) {

  var self = this;
  socket.on('data', function(data) {
    self.protocol.emit('data', data);
  });

  socket.on('close', function() {
    self.emit('disconnect', socket);
  })
};
