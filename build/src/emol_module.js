
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

  function EmolModule(notificable) {
    EmolModule.__super__.constructor.call(this, notificable);
  }

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

  EmolModule.prototype.start = function() {
    return setInterval(function() {
      return _this.http('http://www.emol.com/XMLtoJSON/?App=Android&Seccion=Nacional', _this.parse_section);
    }, 1000 * 60 * 5);
  };

  return EmolModule;

})(Notifier);

module.exports = EmolModule;
