###
URLS usadas por app mobile
www.emol.com/XMLtoJSON/?App=Android&Seccion=Detalle&Id=753521
www.emol.com/XMLtoJSON/?App=Android&Seccion=main
###

Notifier = require './notifier'

class EmolModule extends Notifier

	_this = EmolModule.prototype

	constructor: (notificable) ->
		super notificable

	parse_section: (body) ->
		parsed_body = JSON.parse body
		for item in parsed_body.items
			_this.http "http://www.emol.com/XMLtoJSON/?App=Android&Seccion=Detalle&Id=#{item.id}", _this.parse_detail

	parse_detail: (body) ->
		parsed_body = JSON.parse body
		for item in parsed_body.items
			_this.notify item.id item

	start: ->
		setInterval () -> 
			_this.http('http://www.emol.com/XMLtoJSON/?App=Android&Seccion=Nacional', _this.parse_section)
		, 500

module.exports = EmolModule