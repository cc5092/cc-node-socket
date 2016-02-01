'use strict';
const net = require('net');
const EventEmitter = require('events');
const protocols = require('./protocol/');
const Connection = require('./connection');

class Client extends EventEmitter {
  constructor(port, host, protocol) {
    if(!port) {
      throw new Error('socket client need port');
    }

    super();
    if(!protocol) {
      protocol = host;
      host = null;
    }
    this.port = port;
    this.host = host || '0.0.0.0';
    this.protocol = protocols[protocol] ? protocols[protocol] : protocols['json'];
    this.connections = {};

    this.connect();

  }

  connect() {
    let socket = net.connect(this.port);
    this.bindEvents(socket);
  }

  bindEvents(socket) {
    let connection = new Connection(this, socket, this.protocol);
    socket.on('connect', () => {
      this.connections[connection.id] = connection;
      this.emit('connection', connection);
    });
  }

  onData(data) {
    this.emit('data', data);
  }

  onDisconnect(connection) {
    this.emit('disconnect', connection);
  }

  onError(err) {
    this.emit('error', err);
  }
}

module.exports = Client;
