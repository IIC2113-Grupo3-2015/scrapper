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
- Emol
###

TwitterModule = require './src/twitter_module'
EmolModule = require './src/emol_module'
MongoClient = require('mongodb').MongoClient
Async = require 'async'
Assert = require 'assert' 
Config = require './settings.json'
Colors = require 'colors'

Colors.setTheme
	info: 'green',
	data: 'grey',
	warn: 'yellow',
	debug: 'blue',
	error: 'red'

MONGO_URL = "mongodb://#{Config.mongodb.host}:#{Config.mongodb.port}/#{Config.mongodb.database}"

console.log """
\ ___  ___ _ __ __ _ _ __  _ __   ___ _ __
\/ __|\/ __| \'__\/ _` | \'_ \\| \'_ \\ \/ _ \\ \'__|
\\__ \\ (__| | | (_| | |_) | |_) |  __\/ |
|___\/\\___|_|  \\__,_| .__\/| .__\/ \\___|_|
                   | |   | |
                   |_|   |_|""".rainbow

class Scrapper

	_this = Scrapper.prototype

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
				console.log "\t[-] Iniciado modulo Twitter".info
				callback()
			(callback) ->
				emolModule = new EmolModule _this.new_data
				emolModule.start()
				console.log "\t[-] Iniciado modulo Emol".info
				callback()
			(callback) ->
				console.log "[+] Scrapper iniciado".info
				callback()
		])

	new_data: (moduleName, id, data) ->
		###
		Falta check por id para no repetir
		collection = _this.db.collection moduleName
		collection.insert data, (err, result) ->
			Assert.equal err, null, "[!] Error al ingresar dato a Mongo".error
		###
		_this.numeroDocumentos++
		_this.update_status()

	update_status: ->
		process.stdout.write "\t[-] Encontrados #{_this.numeroDocumentos} documentos\r".info

	stop: ->
		console.log "[+] Deteniendo Scrapper".info
		_this.db.close()

scrapper = new Scrapper()