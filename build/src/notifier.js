var Notifier, Request;

Notifier = require('./notifier');

Request = require('request');

Notifier = (function() {
  var _this;

  _this = Notifier.prototype;


  /*
  Descripcion: Contructor de la clase Notifier
  PreCondiciones: Notificador no construido
  PostCondiciones: Guarda la funcion donde se notifica
   */

  function Notifier(notificable_function) {
    _this.notificable_function = notificable_function;
  }


  /*
  Descripcion: Obtiene datos http de direccion url
  PreCondiciones: callback a donde debo enviar informacion http nueva
  PostCondiciones: Recupera datos http de url y los envia a callback si el request es efectivo
   */

  Notifier.prototype.http = function(url, callback) {
    return Request(url, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        return callback(body);
      }
    });
  };


  /*
  Descripcion: Notifica a funcion sobre los nuevos datos
  PreCondiciones: Informacion recogida no ha sido notificada al Scrapper
  PostCondiciones: Informacion notificada a Scrapper
   */

  Notifier.prototype.notify = function(id, data) {
    return _this.notificable_function(this.constructor.name, id, data);
  };

  return Notifier;

})();

module.exports = Notifier;
