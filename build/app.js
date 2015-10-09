
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
- Emol
 */
var Assert, Async, Colors, Config, EmolModule, MONGO_URL, MongoClient, Scrapper, TwitterModule, scrapper;

TwitterModule = require('./src/twitter_module');

EmolModule = require('./src/emol_module');

MongoClient = require('mongodb').MongoClient;

Async = require('async');

Assert = require('assert');

Config = require('./settings.json');

Colors = require('colors');

Colors.setTheme({
  info: 'green',
  data: 'grey',
  warn: 'yellow',
  debug: 'blue',
  error: 'red'
});

MONGO_URL = "mongodb://" + Config.mongodb.host + ":" + Config.mongodb.port + "/" + Config.mongodb.database;

console.log("\ ___  ___ _ __ __ _ _ __  _ __   ___ _ __\n\/ __|\/ __| \'__\/ _` | \'_ \\| \'_ \\ \/ _ \\ \'__|\n\\__ \\ (__| | | (_| | |_) | |_) |  __\/ |\n|___\/\\___|_|  \\__,_| .__\/| .__\/ \\___|_|\n                   | |   | |\n                   |_|   |_|".rainbow);

Scrapper = (function() {
  var _this;

  _this = Scrapper.prototype;

  function Scrapper() {
    _this.numeroDocumentos = 0;
    console.log("[+] Iniciando Scrapper".info);
    Async.series([
      function(callback) {
        return MongoClient.connect(MONGO_URL, function(err, db) {
          Assert.equal(err, null, "[!] Error al conectarse a MongoDB".error);
          _this.db = db;
          console.log("[+] Conectado correctamente a MongoDB".info);
          return callback();
        });
      }, function(callback) {
        var twitterModule;
        twitterModule = new TwitterModule(_this.new_data);
        twitterModule.start();
        console.log("\t[-] Iniciado modulo Twitter".info);
        return callback();
      }, function(callback) {
        var emolModule;
        emolModule = new EmolModule(_this.new_data);
        emolModule.start();
        console.log("\t[-] Iniciado modulo Emol".info);
        return callback();
      }, function(callback) {
        console.log("[+] Scrapper iniciado".info);
        return callback();
      }
    ]);
  }

  Scrapper.prototype.new_data = function(moduleName, id, data) {

    /*
    		Falta check por id para no repetir
    		collection = _this.db.collection moduleName
    		collection.insert data, (err, result) ->
    			Assert.equal err, null, "[!] Error al ingresar dato a Mongo".error
     */
    _this.numeroDocumentos++;
    return _this.update_status();
  };

  Scrapper.prototype.update_status = function() {
    return process.stdout.write(("\t[-] Encontrados " + _this.numeroDocumentos + " documentos\r").info);
  };

  Scrapper.prototype.stop = function() {
    console.log("[+] Deteniendo Scrapper".info);
    return _this.db.close();
  };

  return Scrapper;

})();

scrapper = new Scrapper();
