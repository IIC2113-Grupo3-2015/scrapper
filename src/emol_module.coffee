###
Modulo EMOL
URLS usadas por app mobile
www.emol.com/XMLtoJSON/?App=Android&Seccion=Detalle&Id=753521
www.emol.com/XMLtoJSON/?App=Android&Seccion=main
###

Notifier = require './notifier'

class EmolModule extends Notifier

  _this = EmolModule.prototype

  ###
  Descripcion: Constructor del Modulo Emol
  PreCondiciones: Modulo de Emol aun no contruido
  PostCondiciones: Modulo de Emol construido
  ###
  constructor: (notificable) ->
    super notificable
  
  ###
  Descripcion: Parsea una seccion en emol
  PreCondiciones: El cuerpo (body) del HTML de la seccion de Emol
  PostCondiciones: Se parsean todos las noticias de esa seccion
  ###
  parse_section: (body) ->
    parsed_body = JSON.parse body
    for item in parsed_body.items
      _this.http "http://www.emol.com/XMLtoJSON/?App=Android&Seccion=Detalle&Id=#{item.id}", _this.parse_detail
  
  ###
  Descripcion: Parseo de una noticia
  PreCondiciones: El cuerpo (body) del HTML de la noticia en Emol
  PostCondiciones: El cuerpo parseado notificado al Scrapper
  ###
  parse_detail: (body) ->
    parsed_body = JSON.parse body
    for item in parsed_body.items
      _this.notify item.id, item

  ###
  Descripcion: Inicia el modulo de Emol
  PreCondiciones: Modulo de emol no iniciado
  PostCondiciones: Modulo de emol inicia intervalor de request
  ###
  start: ->
    to_start = () -> _this.http('http://www.emol.com/XMLtoJSON/?App=Android&Seccion=Nacional', _this.parse_section)
    to_start()
    setInterval to_start, 1000 * 60 * 5

module.exports = EmolModule