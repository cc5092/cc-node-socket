'use strict';
const should = require('should');
const Server = require('../lib/server');
const Client = require('../lib/client');
const net = require('net');
const ExBuffer = require('ExBuffer');
const ByteBuffer = require('ByteBuffer');
const Connection = require('../lib/connection');

describe('server', function() {
  const port = 3000;

  it('server must listen', done => {
    let server = new Server(port);
    server.on('listening', () => {
      server.close();
      done();
    });
  });

  it('client must connect', done => {
    let server = new Server(port);
    let client = new Client(port);
    client.on('connection', connection => {
      connection.should.be.a.instanceof(Connection);
      client.end();
      server.close();
      done();
    });

  });

  it('client must send', done => {
    let server = new Server(port);
    let client = new Client(port);
    let msg = {
      cmd: 'cmd',
      data: 'abcd'
    }
    client.send(msg)
    server.on('data', data => {
      console.log(data);
      client.end();
      server.close();
      done();
    });

  });
});
