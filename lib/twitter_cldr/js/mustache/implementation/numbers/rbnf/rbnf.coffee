# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.RBNF
  constructor : (@locale = TwitterCldr.Settings.locale()) ->
    @default_spellout_options = {
      'rule_group' : "SpelloutRules",
      'rule_set' : "spellout-numbering"
    }
    @rule_group_cache = {}
    @rule_set_name_cache = {}

  @data: ->
    TwitterCldr.get_data()[@name]

  resource : ->
    @constructor.data().resource

  get_resource_for_locale : (locale = @locale)->
    @resource()[locale]

  format : (number, rule_group_name, rule_set_name) ->
    if !rule_group_name? and !rule_set_name?
      [rule_group_name, rule_set_name] = [default_cardinal_options['rule_group'], default_cardinal_options['rule_set']]

    if (rule_group = @rule_group_by_name(rule_group_name))?
      if (rule_set = rule_group.rule_set_for(rule_set_name))?
        if rule_set.is_public()
          TwitterCldr.RBNFRuleFormatter.format(number, rule_set, rule_group, @locale)
        else
          throw "#{rule_set_name} is a private rule set and cannot be used directly."
      else
        throw new TwitterCldr.NotImplementedException("rule set - #{rule_set_name} - not implemented")
    else
      throw new TwitterCldr.NotImplementedException("rule group - #{rule_group_name} - not implemented")

  group_names : ->
    group['type'] for group in @get_resource_for_locale()

  rule_set_names_for_group : (group_name) ->
    cache_key = TwitterCldr.Utilities.compute_cache_key([@locale, group_name])
    if @rule_set_name_cache[cache_key]?
      @rule_set_name_cache[cache_key]
    result = []
    if (rule_group = @rule_group_by_name(group_name))?
      for rule_set in rule_group.rule_sets
        if rule_set.is_public
          result.push(rule_set.name)

    @rule_set_name_cache[cache_key] = result

    @rule_set_name_cache[cache_key] || []

  rule_group_by_name : (name) ->
    cache_key = TwitterCldr.Utilities.compute_cache_key([@locale, name])

    if @rule_group_cache[cache_key]?
      @rule_group_cache[cache_key]

    group_data = null
    for group in @get_resource_for_locale()
      if group['type'] is name
        group_data = group
        break

    if group_data?
      @rule_group_from_resource(group_data)

  rule_set_from_resource : (rule_set_data) ->
    rules = (new TwitterCldr.RBNFRule(
      rule['value'], rule['rule'],
      ( if rule['radix']?
          rule['radix']
        else
          null)
      ) for rule in rule_set_data['rules'])
    new TwitterCldr.RBNFRuleSet(
      rules,
      rule_set_data['type'],
      (rule_set_data['access'] || "public")
    )

  rule_group_from_resource : (group_data) ->
    rule_sets = (@rule_set_from_resource(rule_set_data) for rule_set_data in group_data['ruleset'])
    new TwitterCldr.RBNFRuleGroup(
      rule_sets,
      group_data['type']
    )
