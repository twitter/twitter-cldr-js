# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.RBNFTokenizer
  constructor : ->
    recognizers = [
      # special rule descriptors
      new TwitterCldr.TokenRecognizer("negative", new RegExp(/-x/)),
      new TwitterCldr.TokenRecognizer("improper_fraction", new RegExp(/x\.x/)),
      new TwitterCldr.TokenRecognizer("proper_fraction", new RegExp(/0\.x/)),
      new TwitterCldr.TokenRecognizer("master", new RegExp(/x\.0/)),

      # normal rule descriptors
      new TwitterCldr.TokenRecognizer("equals", new RegExp(/\=/)),
      new TwitterCldr.TokenRecognizer("rule", TwitterCldr.RBNFTokenizer.get_rule_regexp()),

      new TwitterCldr.TokenRecognizer("right_arrow", new RegExp(/>/)),
      new TwitterCldr.TokenRecognizer("left_arrow", new RegExp(/</)),
      new TwitterCldr.TokenRecognizer("open_bracket", new RegExp(/\[/)),
      new TwitterCldr.TokenRecognizer("close_bracket", new RegExp(/\]/)),
      new TwitterCldr.TokenRecognizer("decimal", new RegExp(/[0#][0#,\.]+/)),
      new TwitterCldr.TokenRecognizer("plural", new RegExp(/\$\(.*\)\$/)),

      # ending
      new TwitterCldr.TokenRecognizer("semicolon", new RegExp(/;/))
    ]

    splitter_source = "(" + ((r.regex.source for r in recognizers).join("|")) + ")"
    splitter = new RegExp(splitter_source)

    @tokenizer = new TwitterCldr.Tokenizer(
      recognizers.concat(new TwitterCldr.TokenRecognizer("plaintext", new RegExp(/[\s\S]*/))),
      splitter
    )

  tokenize : (pattern) ->
    tokenizer = new TwitterCldr.PatternTokenizer(null, @tokenizer)
    tokenizer.tokenize(pattern)

  @get_rule_regexp : ->
    #  Special note about the "rule" token recognizer.
    #  It needs to match the ruby equivalent of %%?[[:word:]\-]+, i.e., %%? followed by
    #  any number of '-'s  or characters in one of the following Unicode general categories Letter,
    #  Mark, Number, Connector_Punctuation. The Javascript version of that has been derived using
    #  an existing tool available here: http://apps.timwhitlock.info/js/regex

    if @rule_regexp?
      return @rule_regexp

    word_regexp_components = [
      "Ll" # Lower case letter
      "Lm" # Modifier letter
      "Lo" # Other letter
      "Lt" # Title case letter
      "Lu" # Upper case letter
      "Mc" # Spacing mark
      "Me" # Enclosing mark
      "Mu" # Non-spacing mark
      "Nd" # Decimal number
      "Nl" # Letter number
      "No" # Other number
      "Pc" # Connector punctuation
      "Pd" # Dash punctuation
    ]
    @rule_regexp = TwitterCldr.UnicodeRegex.compile(
      "%%?[" + ("[:" + component + ":]" for component in word_regexp_components).join("") + "]*",
    ).to_regexp()
