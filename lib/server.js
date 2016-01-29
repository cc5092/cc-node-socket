// 1. create 一个 socket server
// 2. server start后，可以设置执行回调，也可以不设置
// 3. 可以设置 onConnect 回调
// 4. 利用设置的 协议 解包，触发 onMessage 回调
// 5. 设置 onClose 回调
// 6. send Message 时候根据设置的 协议 打包发送

var net = require('net');
var EventEmitter = require('events');
var util = require('util');
var protocols = require('./protocol/');
var Connection  =require('./connection');

module.exports = Server;

function Server(port, host, protocol) {
  if(!(this instanceof Server)) return new Server(port, host, protocol) ;
  if(!port) {
    throw new Error('socket server need port');
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

  this._server = net.createServer();
  this.bindEvents();
  this.listen();
}

util.inherits(Server, EventEmitter);

Server.prototype.listen = function() {
  this._server.listen(this.port, this.host);
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

Server.prototype.onData = function(data) {
  this.emit('data', data);
};

Server.prototype.onDisconnect = function(connection) {
  this.emit('disconnect');
};

Server.prototype.onError = function(err) {
  this.emit('error', err);
};
