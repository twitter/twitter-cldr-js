# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.SymbolTable
  # This is really just a thin layer on top of Hash.
  # Nice to have it abstracted in case we have to add custom behavior.

  constructor : (@symbols = {}) ->

  fetch : (symbol) ->
    @symbols[symbol]

  add : (symbol, value) ->
    @symbols[symbol] = value