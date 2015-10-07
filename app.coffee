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
Config = require './settings.json'
MongoClient = require('mongodb').MongoClient;

class Scrapper

  constructor: ->
    @isRunning = false

  start: ->
    console.log "[+] Iniciando Scrapper"
    @isRunning = true

    twitter_module = new TwitterModule @new_data
    twitter_module.start()

  new_data: (module_name, data) ->
    console.log module_name + " - " + data

  stop: ->
    console.log "[+] Deteniendo Scrapper"
    @isRunning = false

scrapper = new Scrapper()
scrapper.start()
