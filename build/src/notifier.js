var Notifier;

Notifier = (function() {
  function Notifier(notificable_function) {
    this.notificable_function = notificable_function;
  }

  Notifier.prototype.notify = function(data) {
    return this.notificable_function(this.constructor.name, data);
  };

  return Notifier;

})();

module.exports = Notifier;
