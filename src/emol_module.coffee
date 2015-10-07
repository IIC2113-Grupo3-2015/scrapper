Notifier = require './notifier'

class EmolModule extends Notifier
  
  constructor: (notificable) ->
    super notificable

  start: ->
  	console.log("Emol")

module.exports = EmolModule