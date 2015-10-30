###
Modulo La Tercera
URLS usadas por app mobile
http://data.copesa.cl/gcdata/manager?action=GetContentByCategory&alt=json&category=674&limit=30&sitecode=latercera
###

Notifier = require './notifier'

class LaTerceraModule extends Notifier

  _this = LaTerceraModule.prototype

  ###
  Descripcion: Constructor del Modulo La Tercera
  PreCondiciones: Modulo de La Tercera aun no contruido
  PostCondiciones: Modulo de La Tercera construido
  ###
  constructor: (notificable) ->
    super notificable
  
  ###
  Descripcion: Parsea una seccion en La Tercera
  PreCondiciones: El cuerpo (body) del HTML de la seccion de La Tercera
  PostCondiciones: Se parsean todos las noticias de esa seccion
  ###
  parse_section: (body) ->
    parsed_body = (JSON.parse(body)).data
    for content in parsed_body
      item = {}
      item.id = content.id
      item.title = content.title
      item.date = content.date
      item.note =  content.associates[0].note
      _this.notify item.id, item
    
  ###
  Descripcion: Inicia el modulo de La Tercera
  PreCondiciones: Modulo de emol no iniciado
  PostCondiciones: Modulo de emol inicia intervalor de request
  ###
  start: ->
    to_start = () -> _this.http('http://data.copesa.cl/gcdata/manager?action=GetContentByCategory&alt=json&category=674&limit=30&sitecode=latercera', _this.parse_section)
    to_start()
    setInterval to_start, 1000 * 60 * 5

module.exports = LaTerceraModule