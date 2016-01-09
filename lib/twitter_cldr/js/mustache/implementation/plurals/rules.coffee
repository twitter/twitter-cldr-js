# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.PluralRules
  @runtime = `{{{runtime}}}`

  @data: ->
    TwitterCldr.get_data()[@name]

  @all: (type = 'cardinal') ->
    return @data().names[type]

  @rule_for: (number, type = 'cardinal') ->
    try
      return eval(@data().rules[type])(number.toString(), @runtime)
    catch error
      return "other"
