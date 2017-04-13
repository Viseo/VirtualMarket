var EventEmitter = require('wolfy87-eventemitter');
var BinaryPack = require('js-binarypack');

var isArray = Array.isArray;

var util = {
  inherits: function(ctor, superCtor) {
    ctor.super_ = superCtor;
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  },
  extend: function(dest, source) {
    for(var key in source) {
      if(source.hasOwnProperty(key)) {
        dest[key] = source[key];
      }
    }
    return dest;
  },
  pack: BinaryPack.pack,
  unpack: BinaryPack.unpack,
  setZeroTimeout: (function(global) {
    var timeouts = [];
    var messageName = 'zero-timeout-message';

    // Like setTimeout, but only takes a function argument.	 There's
    // no time argument (always zero) and no arguments (you have to
    // use a closure).
    function setZeroTimeoutPostMessage(fn) {
      timeouts.push(fn);
      global.postMessage(messageName, '*');
    }

    function handleMessage(event) {
      if (event.source == global && event.data == messageName) {
        if (event.stopPropagation) {
          event.stopPropagation();
        }
        if (timeouts.length) {
          timeouts.shift()();
        }
      }
    }
    if (global.addEventListener) {
      global.addEventListener('message', handleMessage, true);
    } else if (global.attachEvent) {
      global.attachEvent('onmessage', handleMessage);
    }
    return setZeroTimeoutPostMessage;
  }(window))
};

function Stream() {
  EventEmitter.call(this);
}

util.inherits(Stream, EventEmitter);

Stream.prototype.pipe = function(dest, options) {
  var source = this;

  function ondata(chunk) {
    if (dest.writable) {
      if (false === dest.write(chunk) && source.pause) {
        source.pause();
      }
    }
  }

  source.on('data', ondata);

  function ondrain() {
    if (source.readable && source.resume) {
      source.resume();
    }
  }

  dest.on('drain', ondrain);

  // If the 'end' option is not supplied, dest.end() will be called when
  // source gets the 'end' or 'close' events.  Only dest.end() once.
  if (!dest._isStdio && (!options || options.end !== false)) {
    source.on('end', onend);
    source.on('close', onclose);
  }

  var didOnEnd = false;
  function onend() {
    if (didOnEnd) return;
    didOnEnd = true;

    dest.end();
  }


  function onclose() {
    if (didOnEnd) return;
    didOnEnd = true;

    dest.destroy();
  }

  // don't leave dangling pipes when there are errors.
  function onerror(er) {
    cleanup();
    if (this.listeners('error').length === 0) {
      throw er; // Unhandled stream error in pipe.
    }
  }

  source.on('error', onerror);
  dest.on('error', onerror);

  // remove all the event listeners that were added.
  function cleanup() {
    source.removeListener('data', ondata);
    dest.removeListener('drain', ondrain);

    source.removeListener('end', onend);
    source.removeListener('close', onclose);

    source.removeListener('error', onerror);
    dest.removeListener('error', onerror);

    source.removeListener('end', cleanup);
    source.removeListener('close', cleanup);

    dest.removeListener('end', cleanup);
    dest.removeListener('close', cleanup);
  }

  source.on('end', cleanup);
  source.on('close', cleanup);

  dest.on('end', cleanup);
  dest.on('close', cleanup);

  dest.emit('pipe', source);

  // Allow for unix-like usage: A.pipe(B).pipe(C)
  return dest;
};

function BlobReadStream(source, options){
  Stream.call(this);

  options = util.extend({
      readDelay: 0,
      paused: false
  }, options);

  this._source = source;
  this._start = 0;
  this._readChunkSize = options.chunkSize || source.size;
  this._readDelay = options.readDelay;

  this.readable = true;
  this.paused = options.paused;

  this._read();
}

util.inherits(BlobReadStream, Stream);


BlobReadStream.prototype.pause = function(){
  this.paused = true;
};

BlobReadStream.prototype.resume = function(){
  this.paused = false;
  this._read();
};

BlobReadStream.prototype.destroy = function(){
  this.readable = false;
  clearTimeout(this._timeoutId);
};

BlobReadStream.prototype._read = function(){

  var self = this;

  function emitReadChunk(){
    self._emitReadChunk();
  }

  var readDelay = this._readDelay;
  if (readDelay !== 0){
    this._timeoutId = setTimeout(emitReadChunk, readDelay);
  } else {
    util.setZeroTimeout(emitReadChunk);
  }

};

BlobReadStream.prototype._emitReadChunk = function(){

  if(this.paused || !this.readable) return;

  var chunkSize = Math.min(this._source.size - this._start, this._readChunkSize);

  if(chunkSize === 0){
      this.readable = false;
      this.emit("end");
      return;
  }

  var sourceEnd = this._start + chunkSize;
  var chunk = (this._source.slice || this._source.webkitSlice || this._source.mozSlice).call(this._source, this._start, sourceEnd);

  this._start = sourceEnd;
  this._read();

  this.emit("data", chunk);

};

function BinaryStream(socket, id, create, meta) {
  if (!(this instanceof BinaryStream)) return new BinaryStream(options);

  var self = this;

  Stream.call(this);


  this.id = id;
  this._socket = socket;

  this.writable = true;
  this.readable = true;
  this.paused = false;

  this._closed = false;
  this._ended = false;

  if(create) {
    // This is a stream we are creating
    this._write(1, meta, this.id);
  }
}

util.inherits(BinaryStream, Stream);


BinaryStream.prototype._onDrain = function() {
  if(!this.paused) {
    this.emit('drain');
  }
};

BinaryStream.prototype._onClose = function() {
  // Emit close event
  if (this._closed) {
    return;
  }
  this.readable = false;
  this.writable = false;
  this._closed = true;
  this.emit('close');
};

BinaryStream.prototype._onError = function(error){
  this.readable = false;
  this.writable = false;
  this.emit('error', error);
};

// Write stream

BinaryStream.prototype._onPause = function() {
  // Emit pause event
  this.paused = true;
  this.emit('pause');
};

BinaryStream.prototype._onResume = function() {
  // Emit resume event
  this.paused = false;
  this.emit('resume');
  this.emit('drain');
};

BinaryStream.prototype._write = function(code, data, bonus) {
  if (this._socket.readyState !== this._socket.constructor.OPEN) {
    return false;
  }
  var message = util.pack([code, data, bonus]);
  return this._socket.send(message) !== false;
};

BinaryStream.prototype.write = function(data) {
  if(this.writable) {
    var out = this._write(2, data, this.id);
    return !this.paused && out;
  } else {
    this.emit('error', new Error('Stream is not writable'));
    return false;
  }
};

BinaryStream.prototype.end = function() {
  this._ended = true;
  this.readable = false;
  this._write(5, null, this.id);
};

BinaryStream.prototype.destroy = BinaryStream.prototype.destroySoon = function() {
  this._onClose();
  this._write(6, null, this.id);
};


// Read stream

BinaryStream.prototype._onEnd = function() {
  if(this._ended) {
    return;
  }
  this._ended = true;
  this.readable = false;
  this.emit('end');
};

BinaryStream.prototype._onData = function(data) {
  // Dispatch
  this.emit('data', data);
};

BinaryStream.prototype.pause = function() {
  this._onPause();
  this._write(3, null, this.id);
};

BinaryStream.prototype.resume = function() {
  this._onResume();
  this._write(4, null, this.id);
};


function BinaryClient(socket, options) {
  if (!(this instanceof BinaryClient)) return new BinaryClient(socket, options);

  EventEmitter.call(this);

  var self = this;

  this._options = util.extend({
    chunkSize: 40960
  }, options);

  this.streams = {};

  if(typeof socket === 'string') {
    this._nextId = 0;
    this._socket = new WebSocket(socket);
  } else {
    // Use odd numbered ids for server originated streams
    this._nextId = 1;
    this._socket = socket;
  }

  this._socket.binaryType = 'arraybuffer';

  this._socket.addEventListener('open', function(){
    self.emit('open');
  });
  this._socket.addEventListener('error', function(error){
    var ids = Object.keys(self.streams);
    for (var i = 0, ii = ids.length; i < ii; i++) {
      self.streams[ids[i]]._onError(error);
    }
    self.emit('error', error);
  });
  this._socket.addEventListener('close', function(code, message){
    var ids = Object.keys(self.streams);
    for (var i = 0, ii = ids.length; i < ii; i++) {
      self.streams[ids[i]]._onClose();
    }
    self.emit('close', code, message);
  });
  this._socket.addEventListener('message', function(data, flags){
    util.setZeroTimeout(function(){

      // Message format
      // [type, payload, bonus ]
      //
      // Reserved
      // [ 0  , X , X ]
      //
      //
      // New stream
      // [ 1  , Meta , new streamId ]
      //
      //
      // Data
      // [ 2  , Data , streamId ]
      //
      //
      // Pause
      // [ 3  , null , streamId ]
      //
      //
      // Resume
      // [ 4  , null , streamId ]
      //
      //
      // End
      // [ 5  , null , streamId ]
      //
      //
      // Close
      // [ 6  , null , streamId ]
      //

      data = data.data;

      try {
          data = util.unpack(data);
      } catch (ex) {
          return self.emit('error', new Error('Received unparsable message: ' + ex));
      }
      if (!(data instanceof Array))
          return self.emit('error', new Error('Received non-array message'));
      if (data.length != 3)
          return self.emit('error', new Error('Received message with wrong part count: ' + data.length));
      if ('number' != typeof data[0])
          return self.emit('error', new Error('Received message with non-number type: ' + data[0]));

      switch(data[0]) {
        case 0:
          // Reserved
          break;
        case 1:
          var meta = data[1];
          var streamId = data[2];
          var binaryStream = self._receiveStream(streamId);
          self.emit('stream', binaryStream, meta);
          break;
        case 2:
          var payload = data[1];
          var streamId = data[2];
          var binaryStream = self.streams[streamId];
          if(binaryStream) {
            binaryStream._onData(payload);
          } else {
            self.emit('error', new Error('Received `data` message for unknown stream: ' + streamId));
          }
          break;
        case 3:
          var streamId = data[2];
          var binaryStream = self.streams[streamId];
          if(binaryStream) {
            binaryStream._onPause();
          } else {
            self.emit('error', new Error('Received `pause` message for unknown stream: ' + streamId));
          }
          break;
        case 4:
          var streamId = data[2];
          var binaryStream = self.streams[streamId];
          if(binaryStream) {
            binaryStream._onResume();
          } else {
            self.emit('error', new Error('Received `resume` message for unknown stream: ' + streamId));
          }
          break;
        case 5:
          var streamId = data[2];
          var binaryStream = self.streams[streamId];
          if(binaryStream) {
            binaryStream._onEnd();
          } else {
            self.emit('error', new Error('Received `end` message for unknown stream: ' + streamId));
          }
          break;
        case 6:
          var streamId = data[2];
          var binaryStream = self.streams[streamId];
          if(binaryStream) {
            binaryStream._onClose();
          } else {
            self.emit('error', new Error('Received `close` message for unknown stream: ' + streamId));
          }
          break;
        default:
          self.emit('error', new Error('Unrecognized message type received: ' + data[0]));
      }
    });
  });
}

util.inherits(BinaryClient, EventEmitter);

BinaryClient.prototype.send = function(data, meta){
  var stream = this.createStream(meta);
  if(data instanceof Stream) {
    data.pipe(stream);
  } else if (util.isNode === true) {
    if(Buffer.isBuffer(data)) {
      (new BufferReadStream(data, {chunkSize: this._options.chunkSize})).pipe(stream);
    } else {
      stream.write(data);
    }
  } else if (util.isNode !== true) {
    if(data.constructor == Blob || data.constructor == File) {
      (new BlobReadStream(data, {chunkSize: this._options.chunkSize})).pipe(stream);
    } else if (data.constructor == ArrayBuffer) {
      var blob;
      if(binaryFeatures.useArrayBufferView) {
        data = new Uint8Array(data);
      }
      if(binaryFeatures.useBlobBuilder) {
        var builder = new BlobBuilder();
        builder.append(data);
        blob = builder.getBlob()
      } else {
        blob = new Blob([data]);
      }
      (new BlobReadStream(blob, {chunkSize: this._options.chunkSize})).pipe(stream);
    } else if (typeof data === 'object' && 'BYTES_PER_ELEMENT' in data) {
      var blob;
      if(!binaryFeatures.useArrayBufferView) {
        // Warn
        data = data.buffer;
      }
      if(binaryFeatures.useBlobBuilder) {
        var builder = new BlobBuilder();
        builder.append(data);
        blob = builder.getBlob()
      } else {
        blob = new Blob([data]);
      }
      (new BlobReadStream(blob, {chunkSize: this._options.chunkSize})).pipe(stream);
    } else {
      stream.write(data);
    }
  }
  return stream;
};

BinaryClient.prototype._receiveStream = function(streamId){
  var self = this;
  var binaryStream = new BinaryStream(this._socket, streamId, false);
  binaryStream.on('close', function(){
    delete self.streams[streamId];
  });
  this.streams[streamId] = binaryStream;
  return binaryStream;
};

BinaryClient.prototype.createStream = function(meta){
  if(this._socket.readyState !== WebSocket.OPEN) {
    throw new Error('Client is not yet connected or has closed');
    return;
  }
  var self = this;
  var streamId = this._nextId;
  this._nextId += 2;
  var binaryStream = new BinaryStream(this._socket, streamId, true, meta);
  binaryStream.on('close', function(){
    delete self.streams[streamId];
  });
  this.streams[streamId] = binaryStream;
  return binaryStream;
};

BinaryClient.prototype.close = BinaryClient.prototype.destroy = function() {
  this._socket.close();
};

module.exports.BinaryClient = BinaryClient;
