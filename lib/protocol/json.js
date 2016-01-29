var ExBuffer = require('ExBuffer');
var ByteBuffer = require('ByteBuffer');
var util = require('util');
var EventEmitter = require('events');

module.exports = Json;

function Json(connection) {
  this.connection = connection;

  EventEmitter.call(this);
  this.init();
}

util.inherits(Json, EventEmitter);

Json.prototype.init = function() {
  var self = this;
  this.exBuffer = new ExBuffer();
  this.exBuffer.on('data', function(buffer) {
    var data = self.decode(buffer);
    //send unpacked data to connection obj;
    self.connection.onData(data);
  });
};

Json.prototype.put = function(buffer) {
  this.exBuffer.put(buffer);
};

Json.prototype.encode = function(buffer) {
  var buf = new ByteBuffer();
  var ret = buf.string(JSON.stringify(buffer)).packWithHead();
  return ret;
};

Json.prototype.decode = function(buffer) {
  var buf = new ByteBuffer(buffer);
  var arr = buf.string().unpack();
  var ret = JSON.parse(arr[0]);
  return ret;
}
