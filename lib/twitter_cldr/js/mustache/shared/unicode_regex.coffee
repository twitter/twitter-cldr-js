# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.UnicodeRegex
  @compile : (str, modifiers = "", symbol_table = null) ->
    new TwitterCldr.UnicodeRegex (
      @parser.parse(
        @tokenizer.tokenize(str), {"symbol_table" : symbol_table}
      ), modifiers
    )

  # All unicode characters
  @all_unicode ||= new TwitterCldr.RangeSet([new TwitterCldr.Range 0, 0x10FFFF])

  # A few <control> characters (i.e. 2..7) and public/private surrogates (i.e. 55296..57343).
  # These don't play nicely with Ruby's regular expression engine, and I think we
  # can safely disregard them.
  @invalid_regexp_chars ||= new TwitterCldr.RangeSet ([(new TwitterCldr.Range 2, 7), (new TwitterCldr.Range 55296, 57343)])
  
  @valid_regexp_chars ||= @all_unicode.subtract(@invalid_regexp_chars)
  
  @tokenizer ||= new TwitterCldr.UnicodeRegexTokenizer()

  @parser ||= new TwitterCldr.UnicodeRegexParser ()

  constructor : (@elements, @modifiers = null)
    @modifiers = null # TODO - Verify is this is needed.

  to_regexp_str : ->
    @regexp_str ||= @elements.map((element) ->
      element.to_regexp_str()
    ).join("")

  to_regexp : ->
    new Regexp (@to_regexp_str(), @modifiers)

  match : (str) ->
    str.match (@to_regexp)