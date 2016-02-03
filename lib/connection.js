'use strict';
const net = require('net');
const EventEmitter = require('events');
const base64id = require('base64id');

class Connection extends EventEmitter {
  constructor(container, socket, protocol, name) {
    super();
    this.name = name;
    this.id = base64id.generateId();
    this.socket = socket;
    this.container = container;
    this.protocol = new protocol(this);
    socket.setNoDelay(true);

    this.bindEvent(socket);
  }

  bindEvent(socket) {
    socket.on('data', data => {
      this.protocol.put(data);
    });

    socket.on('close', () => {
      this.onClose();
    });
  }

  send(data) {
    this.socket.write(this.protocol.encode(data));
  }

  onData(data) {
    this.container.onData(data, this);
  }

  onClose() {
    this.container.onDisconnect(this);
  }

  setName(name) {
    this.name = name;
  }

}

module.exports = Connection;
