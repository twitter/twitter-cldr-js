# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.RBNFTokenizer
  constructor : ->
    word_regex_components = [
      TwitterCldr.CodePoint.code_points_for_property("category", "Ll") # Lower case letter
      TwitterCldr.CodePoint.code_points_for_property("category", "Lm") # Modifier letter
      TwitterCldr.CodePoint.code_points_for_property("category", "Lo") # Other letter
      TwitterCldr.CodePoint.code_points_for_property("category", "Lt") # Title case letter
      TwitterCldr.CodePoint.code_points_for_property("category", "Lu") # Upper case letter
      TwitterCldr.CodePoint.code_points_for_property("category", "Mc") # Spacing mark
      TwitterCldr.CodePoint.code_points_for_property("category", "Me") # Enclosing mark
      TwitterCldr.CodePoint.code_points_for_property("category", "Mu") # Non-spacing mark
      TwitterCldr.CodePoint.code_points_for_property("category", "Nd") # Decimal number
      TwitterCldr.CodePoint.code_points_for_property("category", "Nl") # Letter number
      TwitterCldr.CodePoint.code_points_for_property("category", "No") # Other number
      TwitterCldr.CodePoint.code_points_for_property("category", "Pc") # Connector punctuation
      TwitterCldr.CodePoint.code_points_for_property("category", "Pd") # Dash punctuation
    ]
    word_regex = "(" + ((component for component in word_regex_components).join("|")) + ")+"
    recognizers = [
      # special rule descriptors
      new TwitterCldr.TokenRecognizer("negative", new RegExp(/-x/)),
      new TwitterCldr.TokenRecognizer("improper_fraction", new RegExp(/x\.x/)),
      new TwitterCldr.TokenRecognizer("proper_fraction", new RegExp(/0\.x/)),
      new TwitterCldr.TokenRecognizer("master", new RegExp(/x\.0/)),

      # normal rule descriptors
      new TwitterCldr.TokenRecognizer("equals", new RegExp(/\=/)),
      new TwitterCldr.TokenRecognizer("rule", new RegExp("%%?" + word_regex)),

      new TwitterCldr.TokenRecognizer("right_arrow", new RegExp(/>/)),
      new TwitterCldr.TokenRecognizer("left_arrow", new RegExp(/</)),
      new TwitterCldr.TokenRecognizer("open_bracket", new RegExp(/\[/)),
      new TwitterCldr.TokenRecognizer("close_bracket", new RegExp(/\]/)),
      new TwitterCldr.TokenRecognizer("decimal", new RegExp(/[0#][0#,\.]+/)),
      new TwitterCldr.TokenRecognizer("plural", new RegExp(/\$\(.*\)\$/)),

      # ending
      new TwitterCldr.TokenRecognizer("semicolon", new RegExp(/;/))
    ]

    #  Special note about the "rule" token recognizer.
    #  It needs to match the ruby equivalent of %%?[[:word:]\-]+, i.e., %%? followed by
    #  any number of '-'s  or characters in one of the following Unicode general categories Letter,
    #  Mark, Number, Connector_Punctuation. The Javascript version of that has been derived using
    #  an existing tool available here: http://apps.timwhitlock.info/js/regex

    splitter_source = "(" + ((r.regex.source for r in recognizers).join("|")) + ")"
    splitter = new RegExp(splitter_source)

    @tokenizer = new TwitterCldr.Tokenizer(
      recognizers.concat(new TwitterCldr.TokenRecognizer("plaintext", new RegExp(/[\s\S]*/))),
      splitter
    )

  tokenize : (pattern) ->
    tokenizer = new TwitterCldr.PatternTokenizer(null, @tokenizer)
    tokenizer.tokenize(pattern)