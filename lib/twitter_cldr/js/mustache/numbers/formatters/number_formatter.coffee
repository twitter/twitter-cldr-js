# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0
class TwitterCldr.NumberFormatter
	constructor : (@data_reader) ->

	format : (tokens, obj, options = {}) ->
    [@["format_" + token.type](token, index, obj, options) for token in tokens]

  format_plaintext : (token, index, obj, options) ->
    if(match = token.value.match(/([\s]*)'(.*)'([\s]*)/))?
      match.splice(1).join
    else
      token.value

  format_composite : (token, index, obj, options) ->
    format(token.tokens, obj) + ""