'use strict';

const ExBuffer = require('ExBuffer');
const ByteBuffer = require('ByteBuffer');
const EventEmitter = require('events');

class Json extends EventEmitter {
  constructor(connection) {
    super();

    this.connection = connection;
    this.init();
  }

  init() {
    this.exBuffer = new ExBuffer();
    this.exBuffer.on('data', buffer => {
      let data = this.decode(buffer);
      this.connection.onData(data);
    });
  }

  put(buffer) {
    this.exBuffer.put(buffer);
  }

  encode(buffer) {
    let buf = new ByteBuffer();
    let ret = buf.string(JSON.stringify(buffer)).packWithHead();
    return ret;
  }

  decode(buffer) {
    let buf = new ByteBuffer(buffer);
    let arr = buf.string().unpack();
    let ret = JSON.parse(arr[0]);
    return ret;
  }
}

module.exports = Json;
