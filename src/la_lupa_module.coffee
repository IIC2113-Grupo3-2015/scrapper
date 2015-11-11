###
Modulo La Lupa de la Constitución
URLS usadas por feed wordpress
http://www.lalupadelaconstitucion.cl/feed/
###

Notifier = require './notifier'
parseString = require('xml2js').parseString

class LaLupaModule extends Notifier

  _this = LaLupaModule.prototype

  constructor: (notificable) ->
    super notificable

  parse_feed: (body) ->
    parsed_body = parseString body, { trim: true }, (err, result) ->
      console.dir result
      for content in parsed_body.channel.item
        item = {}
        item.id = content.guid
        item.title = content.title
        item.data =  content.associates[0].note
        _this.notify item.id, item


  start: ->
    to_start = () -> _this.http('http://www.lalupadelaconstitucion.cl/feed/', _this.parse_feed)
    to_start()
    setInterval to_start, 1000 * 60 * 5

module.exports = LaLupaModule