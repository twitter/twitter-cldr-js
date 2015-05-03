# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.PluralRules
  @rules = {}
  @runtime = `{{{runtime}}}`
  @names = {}

  @all: (type = 'cardinal') ->
    return @names[type]

  @rule_for: (number, type = 'cardinal') ->
    try
      return @rules[type](number.toString(), @runtime)
    catch error
      return "other"
