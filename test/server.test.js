var should = require('should');
var Server = require('../lib/server');
var net = require('net');
var ExBuffer = require('ExBuffer');
var ByteBuffer = require('ByteBuffer');

describe('server', function() {

  var port = 3000;


  it('must listen', function(done) {
    var server = new Server(port);
    var msg = 'abcdefg';
    var buf = new ByteBuffer();
    var ret = buf.string(JSON.stringify(msg)).packWithHead();
    var client = net.connect(port, function() {
      client.write(ret);
    });

    server.on('data', function(data) {
      data.should.equal(msg);
      done();
    });

  });

  /*
  server.onClose = function() {
    console.log('server close');
  }
  server.onError = function(err) {
    console.err(err);
  }*/

  //server.listen();

});
