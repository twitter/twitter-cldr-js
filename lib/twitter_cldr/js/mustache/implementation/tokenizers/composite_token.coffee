# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.CompositeToken
  constructor : (@tokens) ->
    @type = "composite"

  to_string : ->
    unless @tokens?
      return null
    (token.to_string() for token in @tokens).join("")
