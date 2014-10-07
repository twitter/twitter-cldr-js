# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class RBNFRuleGroup
  constructor : (@rule_sets, @rule_name) ->

  rule_set_for : (rule_set_name) ->
    for rule_set in rule_sets
      if rule_set.name is rule_set_name
        return rule_set
    null
