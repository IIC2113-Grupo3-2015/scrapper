
/*
Modulo EMOL
URLS usadas por app mobile
www.emol.com/XMLtoJSON/?App=Android&Seccion=Detalle&Id=753521
www.emol.com/XMLtoJSON/?App=Android&Seccion=main
 */
var EmolModule, Notifier,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Notifier = require('./notifier');

EmolModule = (function(superClass) {
  var _this;

  extend(EmolModule, superClass);

  _this = EmolModule.prototype;


  /*
  Descripcion: Constructor del Modulo Emol
  PreCondiciones: Modulo de Emol aun no contruido
  PostCondiciones: Modulo de Emol construido
   */

  function EmolModule(notificable) {
    EmolModule.__super__.constructor.call(this, notificable);
  }


  /*
  Descripcion: Parsea una seccion en emol
  PreCondiciones: El cuerpo (body) del HTML de la seccion de Emol
  PostCondiciones: Se parsean todos las noticias de esa seccion
   */

  EmolModule.prototype.parse_section = function(body) {
    var i, item, len, parsed_body, ref, results;
    parsed_body = JSON.parse(body);
    ref = parsed_body.items;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      item = ref[i];
      results.push(_this.http("http://www.emol.com/XMLtoJSON/?App=Android&Seccion=Detalle&Id=" + item.id, _this.parse_detail));
    }
    return results;
  };


  /*
  Descripcion: Parseo de una noticia
  PreCondiciones: El cuerpo (body) del HTML de la noticia en Emol
  PostCondiciones: El cuerpo parseado notificado al Scrapper
   */

  EmolModule.prototype.parse_detail = function(body) {
    var i, item, len, parsed_body, ref, results;
    parsed_body = JSON.parse(body);
    ref = parsed_body.items;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      item = ref[i];
      results.push(_this.notify(item.id, item));
    }
    return results;
  };


  /*
  Descripcion: Inicia el modulo de Emol
  PreCondiciones: Modulo de emol no iniciado
  PostCondiciones: Modulo de emol inicia intervalor de request
   */

  EmolModule.prototype.start = function() {
    var to_start;
    to_start = function() {
      return _this.http('http://www.emol.com/XMLtoJSON/?App=Android&Seccion=Nacional', _this.parse_section);
    };
    to_start();
    return setInterval(to_start, 1000 * 60 * 5);
  };

  return EmolModule;

})(Notifier);

module.exports = EmolModule;
