# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.Token

  constructor : (@value, @type) ->
  
  @to_hash : ->
    { value => @value, type => @type }
