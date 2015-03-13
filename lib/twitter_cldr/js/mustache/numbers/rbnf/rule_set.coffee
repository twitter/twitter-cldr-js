# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.RBNFRuleSet
  constructor : (@rules, @name, @access) ->

  rule_for_value : (value) ->
    if (index = @rule_index_for(value))?
      @rules[index]

  previous_rule_for : (rule) ->
    if (index = @rule_index_for(rule.base_value))?
      @rules[index - 1] if index > 0

  master_rule : ->
    @rule_for_value(TwitterCldr.RBNFRule.master)

  proper_fraction_rule : ->
    @rule_for_value(TwitterCldr.RBNFRule.proper_fraction)

  improper_fraction_rule : ->
    @rule_for_value(TwitterCldr.RBNFRule.improper_fraction)

  negative_rule : ->
    @rule_for_value(TwitterCldr.RBNFRule.negative)

  is_private : ->
    @access is "private"

  is_public : ->
    @access is "public"

  numeric_rules : ->
    rule for rule in [@get_search_start_index()...rules.size] by 1

  # fractional: i.e. whether or not to consider the rule set a "fractional" rule set (special rules apply)
  rule_for : (number, fractional = false) ->
    if fractional
      @fractional_rule_for(number)
    else
      @normal_rule_for(number)

  # Adapted from: http://grepcode.com/file/repo1.maven.org/maven2/com.ibm.icu/icu4j/51.2/com/ibm/icu/text/NFRuleSet.java#NFRuleSet.findFractionRuleSetRule%28double%29
  fractional_rule_for : (number) ->
    # the obvious way to do this (multiply the value being formatted
    # by each rule's base value until you get an integral result)
    # doesn't work because of rounding error.  This method is more
    # accurate

    # find the least common multiple of the rules' base values
    # and multiply this by the number being formatted.  This is
    # all the precision we need, and we can do all of the rest
    # of the math using integer arithmetic
    index = @get_search_start_index()
    index += 1 while @rules[index].base_value is 0
    least_common_multiple = @rules[index].base_value

    for i in [index+1...@rules.size] by 1
      least_common_multiple = @lcm(least_common_multiple, @rules[i].base_value)

    numerator = Math.round(number * least_common_multiple)

    difference = 10 ** 30
    winner = 0

    for i in [index...@rules.size]
      # "numerator" is the numerator of the fraction is the
      # denominator is the LCD.  The numerator if the the rule's
      # base value is the denomiator is "numerator" times the
      # base value divided bythe LCD.  Here we check to see if
      # that's an integer, and if not, how close it is to being
      # an integer.
      temp_difference = (numerator * @rules[i].base_value) % least_common_multiple

      # normalize the result of the above calculation: we want
      # the numerator's distance from the CLOSEST multiple
      # of the LCD
      if (least_common_multiple - temp_difference) < temp_difference
        temp_difference = least_common_multiple - temp_difference

      # if this is as close as we've come, keep track of how close
      # that is, and the line number of the rule that did it.  If
      # we've scored a direct hit, we don't have to look at any more
      # rules
      if temp_difference < difference
        difference = temp_difference
        winner = i

        break if difference is 0

    # if we have two successive rules that both have the winning base
    # value, then the first one (the one we found above) is used if
    # the numerator of the fraction is 1 and the second one is used if
    # the numerator of the fraction is anything else (this lets us
    # do things like "one third"/"two thirds" without haveing to define
    # a whole bunch of extra rule sets)
    if (winner + 1) < @rules.length and @rules[winner + 1].base_value is @rules[winner].base_value
      if Math.round(number * @rules[winner].base_value) < 1 or Math.round(number * @rules[winner].base_value) >= 2
        winner += 1

    # finally, return the winning rule
    @rules[winner]

  # Adapted from: http://grepcode.com/file/repo1.maven.org/maven2/com.ibm.icu/icu4j/51.2/com/ibm/icu/text/NFRuleSet.java#NFRuleSet.lcm%28long%2Clong%29
  lcm : (x, y) ->
    # binary gcd algorithm from Knuth, "The Art of Computer Programming,"
    # vol. 2, 1st ed., pp. 298-299
    x1 = x
    y1 = y
    p2 = 0

    while (x1 & 1) is 0 and (y1 & 1) is 0
      p2 += 1
      x1 >>= 1
      y1 >>= 1

    t = (if (x1 & 1) is 1 then -y1 else x1)

    while t isnt 0
      t >>= 1 while (t & 1) is 0
      if t > 0
        x1 = t
      else
        y1 = -t
      t = x1 - y1

    gcd = x1 << p2
    x / gcd * y

  # If the rule set is a regular rule set, do the following:
  #
  # If the rule set includes a master rule (and the number was passed in as a double), use the master rule.  (If the number being formatted was passed in as a long, the master rule is ignored.)
  # If the number is negative, use the negative-number rule.
  # If the number has a fractional part and is greater than 1, use the improper fraction rule.
  # If the number has a fractional part and is between 0 and 1, use the proper fraction rule.
  # Binary-search the rule list for the rule with the highest base value less than or equal to the number. If that rule has two substitutions, its base value is not an even multiple of its divisor, and the number is an even multiple of the rule's divisor, use the rule that precedes it in the rule list. Otherwise, use the rule itself.
  normal_rule_for : (number) ->
    if (rule = @master_rule())?
      rule
    else if number < 0 and (rule = @negative_rule())?
      rule
    else if @contains_fraction(number) and number > 1 and (rule = @improper_fraction_rule())?
      rule
    else if @contains_fraction(number) and number > 0 and number < 1 and (rule = @proper_fraction_rule())?
      rule
    else
      if (rule = @rule_for_value(Math.abs(number)))?
        use_prev_rule = rule.get_substitution_count() is 2 and
            not rule.is_even_multiple_of(rule.base_value) and
            rule.is_even_multiple_of(number)
        if use_prev_rule
          @previous_rule_for(rule)
        else
          rule
      else
        @rules[@get_search_start_index()] or @rules[0]

  contains_fraction : (number) ->
    number isnt Math.floor(number)

  rule_index_for : (base_value) ->
    if (rule_index = @special_rule_index_for(base_value))?
      return rule_index

    if @is_numeric(base_value)
      # binary search (base_value must be a number for this to work)
      low = @get_search_start_index()
      high = @rules.length - 1

      while low <= high
        mid = Math.floor((low + high) / 2)
        if @rules[mid].base_value > base_value
          high = mid - 1
        else if @rules[mid].base_value < base_value
          low = mid + 1
        else break

      # Binary-search the rule list for the rule with the highest base value less than or equal to the number.
      if @rules[mid].base_value <= base_value
        mid
      else
        if mid > 0 then mid - 1 else mid

  special_rule_index_for : (base_value) ->
    for i in [0...@get_search_start_index()] by 1
      if @rules[i].base_value is base_value
        return i
    null

  get_search_start_index : ->
    if @search_start_index?
      return @search_start_index
    @search_start_index = 0
    for i in [0...@rules.length] by 1
      if @is_numeric(@rules[i].base_value)
        @search_start_index = i
        break

    @search_start_index

  is_numeric : (val) ->
    ((val + "").match(/^[\d]+(\.\d)?[\d]*$/))?
