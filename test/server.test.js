var should = require('should');
var Server = require('../lib/server');
var Client = require('../lib/client');
var net = require('net');
var ExBuffer = require('ExBuffer');
var ByteBuffer = require('ByteBuffer');
var Connection = require('../lib/connection');

describe('server', function() {
  var port = 3000;
  it('server must listen', function(done) {
    var server = new Server(port);
    server.on('listening', function() {
      done();
    });
  });

  it('client must connect', function(done) {
    var server = new Server(port);
    var client = new Client(port);
    done();
  });
});
/*
describe('connection', function() {
  it('connection function', function() {
    var s = {};
    var c = new Connection(s, s)
    c.should.be.an.instanceof('Connection');
  });
})*/
