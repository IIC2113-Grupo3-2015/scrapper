Twitter = require 'twitter'
Notifier = require './notifier'
Config = require './../settings.json'

class TwitterModule extends Notifier

  _this = TwitterModule.prototype

  ###
  Descripcion: Constructor del Modulo Twitter
  PreCondiciones: Modulo de Twitter aun no contruido
  PostCondiciones: Modulo de Twitter construido
  ###
  constructor: (notificable, candidates) ->
    super notificable
    _this.client = new Twitter Config.twitter
    #_this.candidates = candidates
    _this.candidates = ["piñera", "bachelet"]

  ###
  Descripcion: Inicia el modulo de Twitter buscando en el stream
  PreCondiciones: El stream de datos no se analiza aun
  PostCondiciones: Se inicia analisis del stream de tweets que luego es notificado al scrapper
  ###
  start: ->
    _this.client.stream 'statuses/filter', { track: _this.candidates.join(",") }, (stream) ->
      stream.on 'data', (tweet) ->
        data = {}
        data.id = tweet.id
        data.candidato = _this.who_is_inside(tweet.text, _this.candidates)
        data.tweet =  tweet.text
        _this.notify data.id, data
      stream.on 'error', (error) ->
        throw error;

  who_is_inside: (text, candidates) ->
    for candidate in candidates
      if text.indexOf candidate > -1
        return candidate
    return ""

module.exports = TwitterModule