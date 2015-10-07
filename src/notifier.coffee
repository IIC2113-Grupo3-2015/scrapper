class Notifier
	
	constructor: (notificable_function) ->
		@notificable_function = notificable_function

	notify: (data) ->
		@notificable_function this.constructor.name, data

module.exports = Notifier