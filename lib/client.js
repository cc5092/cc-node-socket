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

    this.connect();

  }

  connect() {
    let socket = net.connect(this.port);
    let connection = new Connection(this, socket, this.protocol);
    socket.on('connect', () => {
      this.emit('connection', connection);
    });
    this.connection = connection;
    this.socket = socket;
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

  send(data) {
    this.connection.send(data);
  }

  end() {
    this.socket.end();
  }

  destroy() {
    this.socket.destroy();
  }

}

module.exports = Client;
