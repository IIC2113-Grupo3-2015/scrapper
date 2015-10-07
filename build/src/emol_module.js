var EmolModule, Notifier,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Notifier = require('./notifier');

EmolModule = (function(superClass) {
  extend(EmolModule, superClass);

  function EmolModule(notificable) {
    EmolModule.__super__.constructor.call(this, notificable);
  }

  EmolModule.prototype.start = function() {
    return console.log("Emol");
  };

  return EmolModule;

})(Notifier);

module.exports = EmolModule;
