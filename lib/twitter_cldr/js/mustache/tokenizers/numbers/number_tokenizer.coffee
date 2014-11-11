# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.RBNFTokenizer
  constructor : (@data_reader) ->
    @special_symbols_map = {
      '.' : '{DOT}',
      ',' : '{COMMA}',
      '0' : '{ZERO}',
      '#' : '{POUND}',
      '¤' : '{CURRENCY}',
      '%' : '{PERCENT}',
      'E' : '{SCIENTIFIC}'
    }

    @inverse_special_symbols_map = {}
    for k, v of @special_symbols_map
      @inverse_special_symbols_map[v] = k

    @special_symbols_regex = new RegExp("'(?:" + [TwitterCldr.Utilities.regex_escape(k) for k, v of @special_symbols_map].join('|') + ")'")
    @inverse_special_symbols_regex = new RegExp([TwitterCldr.Utilities.regex_escape(k) for k, v of @inverse_special_symbols_map].join('|'))

    recognizers = [
      new TwitterCldr.TokenRecognizer("pattern", new RegExp(/[0?#,\.]+/)),
      new TwitterCldr.TokenRecognizer("plaintext", new RegExp(//)),
    ]
    @tokenizer = new TwitterCldr.Tokenizer(recognizers, new RegExp(/([^0*#,\.]*)([0#,\.]+)([^0*#,\.]*)$/), false)

    splitter_source = (r.regex().source() for r in recognizers).join("|")
    splitter = new RegExp(splitter_source)

  tokenize : (pattern) ->
    escaped_pattern = pattern.replace(@special_symbols_regex,
      (match) ->
        @special_symbols_map[match].slice(1, @special_symbols_map[match].length-1)
    )
    tokens = new TwitterCldr.PatternTokenizer(@data_reader, @tokenizer).tokenize(escaped_pattern)
    for token in tokens
      token.value = token.value.replace(@inverse_special_symbols_regex,
        (match) ->
          @inverse_special_symbols_map[match]
      )

    if tokens[0].value is ""
      tokens.slice(1)
    else tokens
