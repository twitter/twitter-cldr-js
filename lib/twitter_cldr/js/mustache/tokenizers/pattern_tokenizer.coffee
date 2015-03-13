# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.PatternTokenizer
  constructor : (@data_reader, @tokenizer) ->

  tokenize : (pattern) ->
    @tokenizer.tokenize(@expand(pattern))

  expand : (pattern) ->
    if pattern instanceof Object
      result = {}
      for key, value of pattern
        result[key] = expand(value)
      result
    else
      pattern
