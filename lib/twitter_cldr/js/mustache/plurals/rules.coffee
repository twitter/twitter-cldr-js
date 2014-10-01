# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.PluralRules
  @rule = `{{{rules}}}`
  @runtime = `{{{runtime}}}`
  @names = {{{names}}}

  @all: ->
    return @names

  @rule_for: (number) ->
    try
      return @rule(number.toString(), @runtime)
    catch error
      return "other"
