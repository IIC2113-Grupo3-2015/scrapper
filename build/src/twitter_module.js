var Config, Notifier, Twitter, TwitterModule,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Twitter = require('twitter');

Notifier = require('./notifier');

Config = require('./../settings.json');

TwitterModule = (function(superClass) {
  extend(TwitterModule, superClass);


  /*
  Descripcion: Constructor del Modulo Twitter
  PreCondiciones: Modulo de Twitter aun no contruido
  PostCondiciones: Modulo de Twitter construido
   */

  function TwitterModule(notificable) {
    TwitterModule.__super__.constructor.call(this, notificable);
    this.client = new Twitter(Config.twitter);
  }


  /*
  Descripcion: Inicia el modulo de Twitter buscando en el stream
  PreCondiciones: El stream de datos no se analiza aun
  PostCondiciones: Se inicia analisis del stream de tweets que luego es notificado al scrapper
   */

  TwitterModule.prototype.start = function() {
    return this.client.stream('statuses/filter', {
      track: 'javascript'
    }, function(stream) {
      stream.on('data', function(tweet) {
        return this.notify(tweet.text);
      });
      return stream.on('error', function(error) {
        throw error;
      });
    });
  };

  return TwitterModule;

})(Notifier);

module.exports = TwitterModule;
