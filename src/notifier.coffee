Notifier = require './notifier'
Request = require 'request'

class Notifier

  _this = Notifier.prototype
  ###
  Descripcion: Contructor de la clase Notifier
  PreCondiciones: Notificador no construido
  PostCondiciones: Guarda la funcion donde se notifica
  ###
  constructor: (notificable_function) ->
    _this.notificable_function = notificable_function
  ###
  Descripcion: Obtiene datos http de direccion url
  PreCondiciones: callback a donde debo enviar informacion http nueva
  PostCondiciones: Recupera datos http de url y los envia a callback si el request es efectivo
  ###
  http: (url, callback) ->
    Request url , (error, response, body) ->
      callback body if not error and response.statusCode == 200
  ###
  Descripcion: Notifica a funcion sobre los nuevos datos
  PreCondiciones: Informacion recogida no ha sido notificada al Scrapper
  PostCondiciones: Informacion notificada a Scrapper
  ###
  notify: (id, data) ->
    _this.notificable_function @constructor.name, id, data

module.exports = Notifier