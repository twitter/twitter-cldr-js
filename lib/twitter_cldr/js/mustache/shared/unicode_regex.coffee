# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.UnicodeRegex
  constructor : (@elements, @modifiers = "") ->
    # @modifiers = null # TODO - Verify is this is needed.

  @compile : (str, modifiers = "", symbol_table = null) ->
    new TwitterCldr.UnicodeRegex(@get_parser().parse(
        @get_tokenizer().tokenize(str), {"symbol_table" : symbol_table}
      ), modifiers)
    
  @get_all_unicode : ->
    @all_unicode ||= new TwitterCldr.RangeSet([new TwitterCldr.Range(0, 0xFFFF)])

  # A few <control> characters (i.e. 2..7) and public/private surrogates (i.e. 55296..57343).
  # These don't play nicely with Ruby's regular expression engine, and I think we
  # can safely disregard them.
  @get_invalid_regexp_chars : ->
    @invalid_regexp_chars ||= new TwitterCldr.RangeSet([(new TwitterCldr.Range(2, 7)), (new TwitterCldr.Range(55296, 57343))])
  
  @get_valid_regexp_chars : ->
    @valid_regexp_chars ||= @get_all_unicode().subtract(@get_invalid_regexp_chars())

  @get_unsupported_chars : ->
    @unsupported_chars ||= new TwitterCldr.RangeSet([new TwitterCldr.Range(0x10000, 0x10FFFF)])
  
  @get_tokenizer : ->
    @tokenizer = new TwitterCldr.UnicodeRegexTokenizer()

  @get_parser : ->
    @parser = new TwitterCldr.UnicodeRegexParser()


  # TODO - Figure this out

  # @all_unicode ||= new TwitterCldr.RangeSet([new TwitterCldr.Range(0, 0x10FFFF)])

  # # A few <control> characters (i.e. 2..7) and public/private surrogates (i.e. 55296..57343).
  # # These don't play nicely with Ruby's regular expression engine, and I think we
  # # can safely disregard them.
  # @invalid_regexp_chars ||= new TwitterCldr.RangeSet ([(new TwitterCldr.Range(2, 7)), (new TwitterCldr.Range(55296, 57343))])
  
  # @valid_regexp_chars ||= @all_unicode.subtract(@invalid_regexp_chars)
  
  # @tokenizer ||= new TwitterCldr.UnicodeRegexTokenizer()

  # @parser ||= new TwitterCldr.UnicodeRegexParser()

  
  to_regexp_str : ->
    @regexp_str ||= @elements.map(((element) ->
          element.to_regexp_str()
        ), @).join("")

  to_regexp : ->
    new RegExp(@to_regexp_str(), @modifiers)

  match : (str) ->
    str.match(@to_regexp())