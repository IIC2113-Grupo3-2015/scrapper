Twitter = require 'twitter'
Notifier = require './notifier'
Config = require './../settings.json'

class TwitterModule extends Notifier

  ###
  Descripcion: Constructor del Modulo Twitter
  PreCondiciones: Modulo de Twitter aun no contruido
  PostCondiciones: Modulo de Twitter construido
  ###
  constructor: (notificable) ->
    super notificable
    @client = new Twitter Config.twitter

  ###
  Descripcion: Inicia el modulo de Twitter buscando en el stream
  PreCondiciones: El stream de datos no se analiza aun
  PostCondiciones: Se inicia analisis del stream de tweets que luego es notificado al scrapper
  ###
  start: ->
    @client.stream 'statuses/filter', { track: 'javascript' }, (stream) ->
      stream.on 'data', (tweet) ->
        @notify tweet.text
      stream.on 'error', (error) ->
        throw error;

module.exports = TwitterModule