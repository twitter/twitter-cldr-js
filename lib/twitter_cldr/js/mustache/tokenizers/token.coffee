# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.Token

  constructor : (options = {}) ->
    for k, v of options
      @[k] = v
      #TODO fix all the plaecs this is messed up in.
  
  to_hash : ->
    { "value" : @value, "type" : @type }

  to_string : ->
    @value