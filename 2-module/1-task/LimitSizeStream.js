const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.options = options;
  }

  string = '';
  options = {};

  _transform(chunk, encoding, callback) {
    this.string += chunk.toString();

    if (this.string.length > this.options.limit) {
      callback(new LimitExceededError(), null);
      return;
    }
    callback(null, chunk);
  }
}

module.exports = LimitSizeStream;
