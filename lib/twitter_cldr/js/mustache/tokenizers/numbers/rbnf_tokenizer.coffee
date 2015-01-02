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
      new TwitterCldr.TokenRecognizer("rule", new RegExp("%%?[\\w\-]+")),
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