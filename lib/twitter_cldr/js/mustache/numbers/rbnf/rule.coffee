# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.RBNFRule
  @master = "x.0"
  @improper_fraction = "x.x"
  @proper_fraction = "0.x"
  @negative = "-x"

  constructor : (@base_value, @rule_text, @radix) ->
    val = parseInt(base_value)
    exp = if val > 0 then Math.ceil(Math.log(val) / Math.log(radix || 10)) else 1
    div = if exp >= 0 then Math.pow((radix || 10), exp) else 1

    # if result is too big, subtract one from exponent and try again
    @divisor = if div > val then Math.pow((radix || 10), exp - 1) else div
    @substitution_types = ["equals", "left_arrow", "right_arrow"]

    @master = TwitterCldr.RBNFRule.master
    @improper_fraction = TwitterCldr.RBNFRule.improper_fraction
    @proper_fraction = TwitterCldr.RBNFRule.proper_fraction
    @negative = TwitterCldr.RBNFRule.negative

    @parser = new TwitterCldr.RBNFRuleParser
    @tokenizer = new Twitter.RBNFTokenizer

  get_substitution_count : ->
    if @substitution_count? then @substitution_count

    @substitution_count = 0

    for token in @tokens
      if token instanceof TwitterCldr.RBNFSubstitution
        @substitution_count += 1

    @substitution_count

  is_even_multiple_of : (num) ->
    num % divisor == 0

  is_normal : ->
    not (is_master or is_improper_fraction or is_proper_fraction or is_negative)

  is_master : ->
    @base_value is @master

  is_improper_fraction : ->
    @base_value is @improper_fraction

  is_proper_fraction : ->
    @base_value is @proper_fraction

  is_negative : ->
    @base_value is @negative

  get_tokens : ->
    @tokens ||= @inline_substitutions(
        @tokenizer.tokenize(@rule_text)
      )

  inline_substitutions : (tokens) ->
    @parser.parse(tokens)
