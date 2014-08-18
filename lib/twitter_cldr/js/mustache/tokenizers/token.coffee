# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.Token

  constructor : (options = {}) ->
    for k, v of options
      @[k] = v
  
  to_hash : ->
    { "value" : @value, "type" : @type }

  to_string : ->
    @value