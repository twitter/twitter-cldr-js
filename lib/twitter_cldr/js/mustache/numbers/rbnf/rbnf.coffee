# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.RBNF
  constructor : (@locale) ->
    @default_spellout_options = {
      'rule_group' : "SpelloutRules",
      'rule_set' : "spellout-numbering"
    }
    @rule_group_cache = {}
    @rule_set_name_cache = {}
    @resource = {} # TODO

  format : (number, options = {}) ->
    rule_group_name = null
    rule_set_name = null
    if (options['rule_group']? and options['rule_set']?)
      [rule_group_name, rule_set_name] = [default_cardinal_options['rule_group'], default_cardinal_options['rule_set']]
    else
      [rule_group_name, rule_set_name] = [options['rule_group'], options['rule_set']]

    if (rule_group = rule_group_by_name(rule_group_name))?
      if (rule_set = rule_group.rule_set_for(rule_set_name))?
        if rule_set.is_public
          TwitterCldr.RBNFRuleFormatter.format(number, rule_set, rule_group, @locale)
        else
          throw rule_set_name + " is a private rule set and cannot be used directly."

  group_names = {}

  rule_set_names_for_group : (group_name) ->
    cache_key = TwitterCldr.Utilities.compute_cache_key(locale, group_name)
    if rule_set_name_cache[cache_key]?
      rule_set_name_cache[cache_key]

    result = []
    if (rule_group = rule_group_by_name(group_name))?
      for rule_set in rule_group.rule_sets
        if rule_set.is_public
          result = result.append(rule_set)

    rule_set_name_cache[cache_key] = result

    rule_set_name_cache[cache_key] || []

  rule_group_by_name : (name) ->
    cache_key = TwitterCldr.Utilities.compute_cache_key(locale, name)

    if rule_group_cache[cache_key]?
      rule_group_cache[cache_key]

    group_data = null
    for group in @resource
      if group['type'] == name
        group_data = group
        break

    if group_data?
      rule_group_from_resource(group_data)

  rule_set_from_resource : (rule_set_data) ->
    new TwitterCldr.RuleSet(
      [new TwitterCldr.Rule(rule['value'], rule['rule'], rule['radix']) for rule in rule_set_data['rules']],
      rule_set_data['type'],
      (rule_set_data['access'] || "public")
    )

  rule_group_from_resource : (group_data) ->
    new TwitterCldr.RuleGroup(
      [rule_set_from_resource(rule_set_data) for rule_set_data in group_data['rule_set']],
      group_data['type']
    )
