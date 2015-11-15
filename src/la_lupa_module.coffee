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
      items = result.rss.channel[0].item
      for content in items
        item = {}
        item.id = content.guid[0]._
        item.title = content.title
        item.data =  content['content:encoded']
        _this.notify item.id, item

  start: ->
    to_start = () -> _this.http('http://www.lalupadelaconstitucion.cl/feed/', _this.parse_feed)
    to_start()
    setInterval to_start, 1000 * 60 * 5

module.exports = LaLupaModule