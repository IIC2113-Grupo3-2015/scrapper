###

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
###

TwitterModule     = require './src/twitter_module'
EmolModule        = require './src/emol_module'
LaTerceraModule   = require './src/la_tercera_module'
MongoClient       = require('mongodb').MongoClient
MongoClient       = require 'pg'
Async             = require 'async'
Assert            = require 'assert' 
Config            = require './settings.json'
Colors            = require 'colors'
_                 = require 'underscore'

Colors.setTheme
  info: 'green',
  data: 'grey',
  warn: 'yellow',
  debug: 'blue',
  error: 'red'

MONGO_URL = "mongodb://#{Config.mongodb.host}:#{Config.mongodb.port}/#{Config.mongodb.database}"
POSTGRE_URL = "postgres://#{Config.postgredb.username}:#{Config.postgredb.password}@#{Config.postgredb.host}/#{Config.postgredb.database}";

console.log """
\ ___  ___ _ __ __ _ _ __  _ __   ___ _ __
\/ __|\/ __| \'__\/ _` | \'_ \\| \'_ \\ \/ _ \\ \'__|
\\__ \\ (__| | | (_| | |_) | |_) |  __\/ |
|___\/\\___|_|  \\__,_| .__\/| .__\/ \\___|_|
                   | |   | |
                   |_|   |_|""".rainbow

class Scrapper

  _this = Scrapper.prototype
  ###
  Descripcion: Construye e inicia el scrapper
  PreCondiciones: 
  PostCondiciones: Modulos iniciados
  ###
  constructor: ->
    _this.numeroDocumentos = 0
    console.log "[+] Iniciando Scrapper".info
    Async.series([
      (callback) -> 
        MongoClient.connect MONGO_URL, (err, db) ->
          Assert.equal err, null, "[!] Error al conectarse a MongoDB".error
          _this.db = db
          console.log "[+] Conectado correctamente a MongoDB".info
          callback()
      (callback) ->
        twitterModule = new TwitterModule _this.new_data
        twitterModule.start()
        console.log "\t[-] Iniciado modulo Twitter".warn
        callback()
      (callback) ->
        emolModule = new EmolModule _this.new_data
        emolModule.start()
        console.log "\t[-] Iniciado modulo Emol".warn
        callback()
      (callback) ->
        terceraModule = new LaTerceraModule _this.new_data
        terceraModule.start()
        console.log "\t[-] Iniciado modulo La Tercera".warn
        callback()
      (callback) ->
        console.log "[+] Scrapper iniciado".info
        _this.update_status()
        callback()
    ])
  ###
  Descripcion: Inserta un nuevo documento en la base de datos
  PreCondiciones: Nombre del modulo, que sera la coleccion de la base de datos,
  id unico del contenido y data que es contenido
  PostCondiciones: Datos guardados correctamente en Base de Datos.
  ###
  new_data: (moduleName, id, data) ->
    _this.collection = _this.db.collection moduleName
    Async.series([
      (callback) ->
        _this.collection.count( { id: id } , (err, count) -> 
          if count == 0
            callback() 
          else
            callback(true) 
        )
      (callback) ->
        _this.collection.insertOne data, (err, result) ->
          Assert.equal err, null, "[!] Error al ingresar dato a Mongo".error
        _this.numeroDocumentos++
        _this.update_status()
    ])
  ###
  Descripcion: Actualiza la informacion en consola del estado del Scrapper
  PreCondiciones: Informacion de consola no esta actualizada
  PostCondiciones: La informacion actualizada en consola del estado del Scrapper
  ###
  update_status: ->
    process.stdout.write "\t[-] Encontrados #{_this.numeroDocumentos} documentos nuevos\r".info
  ###
  Descripcion: Detiene el Scrapper y sus modulos
  PreCondiciones: Todos los modulos funcionando
  PostCondiciones: Todos los modulos detenidos y tambien la conexion con la base de datos
  ###
  stop: ->
    console.log "[+] Deteniendo Scrapper".info
    _this.db.close()

scrapper = new Scrapper()