# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.NumberingSystems
  @for_name : (name) ->
    @system_cache[name] || (
      if (system = @resource[name])?
        if system["type"] isnt "numeric"
          throw "#{system[type]} numbering systems not supported."
        else
          new @(system["name"], system["digits"])
      else
        null
    )

  @system_cache = {}
  @resource = `{{{resource}}}`

  constructor : (@name, digits) ->
    @digits = @split_digits(digits)

  split_digits : (str) ->
    str.split('')

  transliterate : (number) ->
    (number + "").replace(/\d/g, ((digit, position) ->
        @digits[parseInt(digit)]
      ).bind(@)
    )
