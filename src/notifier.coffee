Notifier = require './notifier'
Request = require 'request'

class Notifier

	_this = Notifier.prototype
	
	constructor: (notificable_function) ->
		_this.notificable_function = notificable_function

	http: (url, callback) ->
		Request url , (error, response, body) ->
			callback body if not error and response.statusCode == 200

	notify: (id, data) ->
		_this.notificable_function @constructor.name, id, data

module.exports = Notifier