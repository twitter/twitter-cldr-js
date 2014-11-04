# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.PatternTokenizer
  constructor : (@data_reader, @tokenizer) ->

  tokenize : (pattern) ->
    @tokenizer.tokenize(pattern)

  expand : (pattern) ->
    if pattern instanceof Symbol
      path = patter.to_string.split(".")
      data = @data_reader.pattern_at_path(path)
      next_pattern = (if data["pattern"]? then data["pattern"] else data)
      expand_pattern(next_pattern)
    else if pattern instanceof Object
      result = {}
      for key, value of pattern
        result[key] = expand(value)
      result
    else
      pattern