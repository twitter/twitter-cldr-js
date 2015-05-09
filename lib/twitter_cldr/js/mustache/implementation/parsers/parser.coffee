# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.Parser

  constructor : (@tokens) ->
    @token_index = 0

  parse : (tokens, options = {}) ->
    @tokens = tokens
    @reset()
    @do_parse(options)

  reset : ->
    @token_index = 0

  next_token : (type) ->
    throw "Unexpected token" unless @current_token().type == type

    @token_index += 1

    while @current_token()? and @is_empty(@current_token())
      @token_index += 1

    @current_token()

  is_empty : (token) ->
    token.type == "plaintext" and token.value == ""

  current_token : ->
    @tokens[@token_index]

