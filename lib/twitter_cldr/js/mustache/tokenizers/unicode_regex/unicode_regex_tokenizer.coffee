# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.UnicodeRegexTokenizer
  constructor : ->
    recognizers = [
      # The variable name can contain letters and digits, but must start with a letter.
      new TwitterCldr.TokenRecognizer("variable", new RegExp(/\$\w[\w\d]*/)),
      new TwitterCldr.TokenRecognizer("character_set", new RegExp(/\[:\w+:\]|\\p\{[\w=]+\}/)),  # [:Lu:] or \p{Lu} or \p{Sentence_Break=CF}
      new TwitterCldr.TokenRecognizer("negated_character_set", new RegExp(/\[:\^\w+:\]|\\P\{[\w=]+\}/)),  #[:^Lu:] or \P{Lu}
      new TwitterCldr.TokenRecognizer("unicode_char", new RegExp(/\\u\{?[a-fA-F0-9]{1,6}\}?/)),
      new TwitterCldr.TokenRecognizer("multichar_string", new RegExp(/\{\w+\}/)),

      new TwitterCldr.TokenRecognizer("escaped_character", new RegExp(/\\./)),
      new TwitterCldr.TokenRecognizer("negate", new RegExp(/\^/)),
      new TwitterCldr.TokenRecognizer("ampersand", new RegExp(/&/)),
      new TwitterCldr.TokenRecognizer("pipe", new RegExp(/\|/)),
      new TwitterCldr.TokenRecognizer("dash", new RegExp(/-/)),

      # stuff that shouldn't be converted to codepoints
      new TwitterCldr.TokenRecognizer("special_char", new RegExp(/\{\d,?\d?\}|[$?:{}()*+\.,\/\\]/)),

      new TwitterCldr.TokenRecognizer("open_bracket", new RegExp(/\[/)),
      new TwitterCldr.TokenRecognizer("close_bracket", new RegExp(/\]/)),

      new TwitterCldr.TokenRecognizer("string", new RegExp(/[\s\S]/), ((val) ->
          if val is " " 
            val
          else
            TwitterCldr.Utilities.trim_string(val)
        ))
    ]
    @tokenizer = new TwitterCldr.Tokenizer(recognizers)

  insert_before : (token_type, new_recognizers) ->
    @tokenizer.insert_before(token_type, new_recognizers)

  tokenize : (pattern) ->
    @tokenizer.tokenize(pattern)