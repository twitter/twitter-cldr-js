# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.Token

  constructor : (@value, @type) -> #TODO - Options is not wokring. Add that. 
  #TODO fix all the plaecs this is messed up in.
  
  @to_hash : ->
    { value => @value, type => @type }
