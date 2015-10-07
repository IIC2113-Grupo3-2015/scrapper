Twitter = require 'twitter'
Notifier = require './notifier'
Config = require './../settings.json'

class TwitterModule extends Notifier

  constructor: (notificable) ->
    super notificable
    @client = new Twitter Config.twitter

  start: ->
    @client.stream 'statuses/filter', { track: 'javascript' }, (stream) ->
      stream.on 'data', (tweet) ->
        @notify tweet.text
        
      stream.on 'error', (error) ->
        throw error;

module.exports = TwitterModule