
/*

 ___  ___ _ __ __ _ _ __  _ __   ___ _ __
/ __|/ __| '__/ _` | '_ \| '_ \ / _ \ '__|
\__ \ (__| | | (_| | |_) | |_) |  __/ |
|___/\___|_|  \__,_| .__/| .__/ \___|_|
                   | |   | |
                   |_|   |_|
Sitios de donde sacar información de distintos sitios de noticias
- Twitter (Stream de algunas palabras)
- SoyChile.cl (RSS)
 */
var Config, MongoClient, Scrapper, TwitterModule, scrapper;

TwitterModule = require('./src/twitter_module');

Config = require('./settings.json');

MongoClient = require('mongodb').MongoClient;

Scrapper = (function() {
  function Scrapper() {
    this.isRunning = false;
  }

  Scrapper.prototype.start = function() {
    var twitter_module;
    console.log("[+] Iniciando Scrapper");
    this.isRunning = true;
    twitter_module = new TwitterModule(this.new_data);
    return twitter_module.start();
  };

  Scrapper.prototype.new_data = function(module_name, data) {
    return console.log(module_name + " - " + data);
  };

  Scrapper.prototype.stop = function() {
    console.log("[+] Deteniendo Scrapper");
    return this.isRunning = false;
  };

  return Scrapper;

})();

scrapper = new Scrapper();

scrapper.start();
