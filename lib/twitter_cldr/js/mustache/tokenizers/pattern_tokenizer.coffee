# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.PatternTokenizer
  constructor : (@data_reader, @tokenizer) ->

  tokenize : (pattern) ->
    @tokenizer.tokenize(@expand(pattern))

  expand : (pattern) ->
    # if typeof(pattern) is "string"
    #   path = (pattern + "").split(".")
    #   data = (if @data_reader? then @data_reader.pattern_at_path(path) else null)
    #   next_pattern = (if data["pattern"]? then data["pattern"] else data)
    #   expand_pattern(next_pattern)
    # else
    # TODO - figure thsi out.
    if pattern instanceof Object
      result = {}
      for key, value of pattern
        result[key] = expand(value)
      result
    else
      pattern
