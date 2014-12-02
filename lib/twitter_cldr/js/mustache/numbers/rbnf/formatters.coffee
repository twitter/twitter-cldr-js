# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.RBNFRuleFormatter
  @keep_soft_hyphens = true # default value

  @format : (number, rule_set, rule_group, locale) ->
    rule = rule_set.rule_for(number)
    formatter = @formatter_for(rule, rule_set, rule_group, locale)
    result = formatter.format(number, rule)
    if @keep_soft_hyphens then result else remove_soft_hyphens(result)

  @formatter_for : (rule, rule_set, rule_group, locale) ->
    if rule.is_master()
      new TwitterCldr.RBNFMasterRuleFormatter(rule_set, rule_group, locale)
    if rule.is_improper_fraction()
      new TwitterCldr.RBNFImproperFractionRuleFormatter(rule_set, rule_group, locale)
    if rule.is_proper_fraction()
      new TwitterCldr.RBNFProperFractionRuleFormatter(rule_set, rule_group, locale)
    if rule.is_negative()
      new TwitterCldr.RBNFNegativeRuleFormatter(rule_set, rule_group, locale)
    new TwitterCldr.RBNFNormalRuleFormatter(rule_set, rule_group, locale)

  @remove_soft_hyphens : (result) ->
    result.replace(TwitterCldr.Utilities.pack_array([173]), "")

class TwitterCldr.RBNFNormalRuleFormatter
  constructor : (@rule_set, @rule_group, @locale) ->
    @is_fractional = false

  format : (number, rule) ->
    results = []
    for token in rule.get_tokens()
      result = @[token.type](number, rule, token)
      results.push(if (@omit? and @omit) then "" else result)
    results.join("")

  right_arrow : (number, rule, token) ->
    # this seems to break things even though the docs require it:
    # rule = rule_set.previous_rule_for(rule) if token.length == 3
    remainder = Math.abs(number) % rule.divisor
    @generate_replacement(remainder, rule, token)

  left_arrow : (number, rule, token) ->
    quotient = Math.abs(number) / rule.divisor
    @generate_replacement(quotient, rule, token)

  equals : (number, rule, token) ->
    @generate_replacement(number, rule, token)

  generate_replacement : (number, rule, token) ->
    if (rule_set_name = token.rule_set_reference())?
      TwitterCldr.RBNFRuleFormatter.format(
        number,
        @rule_group.rule_set_for(rule_set_name),
        @rule_group,
        @locale
      )
    else if (decimal_format = token.decimal_format())?
      @data_reader ||= new TwitterCldr.NumberDataReader(@locale)
      @decimal_tokenizer ||= new TwitterCldr.NumberTokenizer(@data_reader)
      decimal_tokens = @decimal_tokenizer.tokenize(decimal_format)
      @decimal_formatter ||= new TwitterCldr.DecimalFormatter(@data_reader)
      @decimal_formatter.format(decimal_tokens, number, {"type" : "decimal"})
    else
      TwitterCldr.RBNFRuleFormatter.format(number, @rule_set, @rule_group, @locale)

  open_bracket : (number, rule, token) ->
    @omit = rule.is_even_multiple_of(number)
    ""
  close_bracket : (number, rule, token) ->
    @omit = false
    ""
  plaintext : (number, rule, token) ->
    token.value

  semicolon : (number, rule, token) ->
    ""

  throw_invalid_token_error : (token) ->
    throw "'" + token.value + "' not allowed in negative number rules."

  fractional_part : (number) ->
    parseFloat((number + "").split(".")[1] || 0)

  integral_part : (number) ->
    parseInt((number + "").split(".")[0])


class TwitterCldr.RBNFNegativeRuleFormatter extends TwitterCldr.RBNFNormalRuleFormatter
  right_arrow : (number, rule, token) ->
    @generate_replacement(Math.abs(number), rule, token)

  left_arrow : (number, rule, token) ->
    @throw_invalid_token_error(token)

  open_bracket : (number, rule, token) ->
    @throw_invalid_token_error(token)

  close_bracket : (number, rule, token) ->
    @throw_invalid_token_error(token)

class TwitterCldr.RBNFMasterRuleFormatter extends TwitterCldr.RBNFNormalRuleFormatter
  right_arrow : (number, rule, token) ->
    # Format by digits. This is not explained in the main doc. See:
    # http://grepcode.com/file/repo1.maven.org/maven2/com.ibm.icu/icu4j/51.2/com/ibm/icu/text/NFSubstitution.java#FractionalPartSubstitution.%3Cinit%3E%28int%2Ccom.ibm.icu.text.NFRuleSet%2Ccom.ibm.icu.text.RuleBasedNumberFormat%2Cjava.lang.String%29

    # doesn't seem to matter if the descriptor is two or three arrows, although three seems to indicate
    # we should or should not be inserting spaces somewhere (not sure where)
    @is_fractional = true
    fractional_part = @fractional_part(number)
    (TwitterCldr.RBNFRuleFormatter.format(
      parseInt(digit), @rule_set, @rule_group, @locale
    ) for digit in fractional_part.split("")).join(" ")

  left_arrow : (number, rule, token) ->
    if @is_fractional
      # is this necessary?
      TwitterCldr.RBNFRuleFormatter.format(parseInt(digit), @rule_set, @rule_group, @locale)
    else
      @generate_replacement(@integral_part(number), rule, token)

  open_bracket : (number, rule, token) ->
    # Omit the optional text if the number is an integer (same as specifying both an x.x rule and an x.0 rule)
    @omit = if @is_fractional then (number * @get_fractional_rule(number).base_value) is 1 else (number+"").indexOf('.') is -1

  close_bracket : (number, rule, token) ->
    @omit = false
    ""
  get_fractional_rule : (number) ->
    @fractional_rule ||= @rule_set.rule_for(number, true)

class TwitterCldr.RBNFProperFractionRuleFormatter extends TwitterCldr.RBNFMasterRuleFormatter
  open_bracket : (number, rule, token) ->
    @throw_invalid_token_error(token)

  close_bracket : (number, rule, token) ->
    @throw_invalid_token_error(token)

class TwitterCldr.RBNFImproperFractionRuleFormatter extends TwitterCldr.RBNFMasterRuleFormatter
  open_bracket : (number, rule, token) ->
    # Omit the optional text if the number is between 0 and 1 (same as specifying both an x.x rule and a 0.x rule)
    @omit = number > 0 and number < 1
    ""
