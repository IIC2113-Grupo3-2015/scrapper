var Notifier, Request;

Notifier = require('./notifier');

Request = require('request');

Notifier = (function() {
  var _this;

  _this = Notifier.prototype;

  function Notifier(notificable_function) {
    _this.notificable_function = notificable_function;
  }

  Notifier.prototype.http = function(url, callback) {
    return Request(url, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        return callback(body);
      }
    });
  };

  Notifier.prototype.notify = function(id, data) {
    return _this.notificable_function(this.constructor.name, id, data);
  };

  return Notifier;

})();

module.exports = Notifier;
