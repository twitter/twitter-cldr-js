# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.RBNFSubstition
  constructor : (@type, @contents, @length) ->

  rule_set_reference : ->
    if contents? and (item = contents[0])?
      item.value.replace("%", "") if item.type is rule

  decimal_format : ->
    if contents? and (item = contents[0])?
      item.value if item.type is decimal
