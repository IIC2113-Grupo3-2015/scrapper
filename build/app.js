
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
- Emol (API app mobile)
 */
var Assert, Async, Colors, Config, EmolModule, LaTerceraModule, MONGO_URL, MongoClient, Scrapper, TwitterModule, _, scrapper;

TwitterModule = require('./src/twitter_module');

EmolModule = require('./src/emol_module');

LaTerceraModule = require('./src/la_tercera_module');

MongoClient = require('mongodb').MongoClient;

Async = require('async');

Assert = require('assert');

Config = require('./settings.json');

Colors = require('colors');

_ = require('underscore');

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


  /*
  Descripcion: Construye e inicia el scrapper
  PreCondiciones: 
  PostCondiciones: Modulos iniciados
   */

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
        console.log("\t[-] Iniciado modulo Twitter".warn);
        return callback();
      }, function(callback) {
        var emolModule;
        emolModule = new EmolModule(_this.new_data);
        emolModule.start();
        console.log("\t[-] Iniciado modulo Emol".warn);
        return callback();
      }, function(callback) {
        var terceraModule;
        terceraModule = new LaTerceraModule(_this.new_data);
        terceraModule.start();
        console.log("\t[-] Iniciado modulo La Tercera".warn);
        return callback();
      }, function(callback) {
        console.log("[+] Scrapper iniciado".info);
        _this.update_status();
        return callback();
      }
    ]);
  }


  /*
  Descripcion: Inserta un nuevo documento en la base de datos
  PreCondiciones: Nombre del modulo, que sera la coleccion de la base de datos,
  id unico del contenido y data que es contenido
  PostCondiciones: Datos guardados correctamente en Base de Datos.
   */

  Scrapper.prototype.new_data = function(moduleName, id, data) {
    _this.collection = _this.db.collection(moduleName);
    return Async.series([
      function(callback) {
        return _this.collection.count({
          id: id
        }, function(err, count) {
          if (count === 0) {
            return callback();
          } else {
            return callback(true);
          }
        });
      }, function(callback) {
        _this.collection.insertOne(data, function(err, result) {
          return Assert.equal(err, null, "[!] Error al ingresar dato a Mongo".error);
        });
        _this.numeroDocumentos++;
        return _this.update_status();
      }
    ]);
  };


  /*
  Descripcion: Actualiza la informacion en consola del estado del Scrapper
  PreCondiciones: Informacion de consola no esta actualizada
  PostCondiciones: La informacion actualizada en consola del estado del Scrapper
   */

  Scrapper.prototype.update_status = function() {
    return process.stdout.write(("\t[-] Encontrados " + _this.numeroDocumentos + " documentos nuevos\r").info);
  };


  /*
  Descripcion: Detiene el Scrapper y sus modulos
  PreCondiciones: Todos los modulos funcionando
  PostCondiciones: Todos los modulos detenidos y tambien la conexion con la base de datos
   */

  Scrapper.prototype.stop = function() {
    console.log("[+] Deteniendo Scrapper".info);
    return _this.db.close();
  };

  return Scrapper;

})();

scrapper = new Scrapper();
