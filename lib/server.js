// 1. create 一个 socket server
// 2. server start后，可以设置执行回调，也可以不设置
// 3. 可以设置 onConnect 回调
// 4. 利用设置的 协议 解包，触发 onMessage 回调
// 5. 设置 onClose 回调
// 6. send Message 时候根据设置的 协议 打包发送
'use strict';

const net = require('net');
const EventEmitter = require('events');
const protocols = require('./protocol/');
const Connection = require('./connection');

class Server extends EventEmitter {
  constructor(port, host, protocol, name) {
    if(!port) {
      throw new Error('socket server need port');
    }

    super();
    if(!protocol) {
      protocol = host;
      host = null;
    }
    this.name = name;
    this.port = port;
    this.host = host || '0.0.0.0';
    this.protocol = protocols[protocol] ? protocols[protocol] : protocols['json'];
    this.connections = {};

    this._server = net.createServer();
    this.bindEvents();
    this.listen();
  }

  listen() {
    this._server.listen(this.port, this.host);
  }

  bindEvents() {
    this._server.on('listening', () => {
      this.emit('listening');
    });
    this._server.on('connection', socket => {
      let connection = new Connection(this, socket, this.protocol, this.name);
      this.connections[connection.id] = connection;
      this.emit('connection', connection);
    });

    this._server.on('error', err => {
      this.emit('error', err);
    });
    this._server.on('close', () => {
      this.emit('close');
    });
  }

  close() {
    this._server.close();
  }

  onData(data, connection) {
    this.emit('data', data, connection);
  }

  onDisconnect() {
    this.emit('disconnect');
  }

  onError(err) {
    this.emit('error', err);
  }
}

module.exports = Server;
