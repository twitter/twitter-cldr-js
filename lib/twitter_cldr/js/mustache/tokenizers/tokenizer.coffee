# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.TokenRecognizer
  constructor : (@token_type, @regex, @cleaner, @content = null) -> 

  recognizes : (text) ->
    @regex.test text

  clean : (val) ->
    if @cleaner? then @cleaner(val) else val

class TwitterCldr.Tokenizer
  constructor : (@recognizers, @custom_splitter = null, @remove_empty_entries = true) ->
    @splitter = (@custom_splitter || new RegExp("(" + @recognizers.map((recognizer) ->
      recognizer.regex.source
    ).join("|") + ")"))

  @union : (tokenizers, block) ->
    recognizers = []
    for tokenizer in tokenizers
      recog_ret = []
      for recognizer in tokenizer.recognizers
        if block? and block(recognizer) || !block?
          recog_ret.push recognizer
      recognizer.concat(recog_ret)

    flag = true
    for tokenizer in tokenizers
      if (custom_splitter? and !(@custom_splitter(tokenizer)))
        flag = false
    splitter = null
    if flag 
      splitter = new Regexp(
        tokenizers.map ((tokenizer) ->
          tokenizer.custom_splitter.source
        ).join("|")
      )
    new TwitterCldr.Tokenizer(recognizers, splitter)

  recognizer_at : (token_type) ->
    recognizer for recognizer in @recognizers when recognizer.token_type is token_type

  insert_before : (token_type, new_recognizers) ->

    idx = 0
    for i in [0...@recognizers.length]
      recognizer = @recognizers[i]
      if recognizer.token_type is token_type
        idx = i
    for recognizer in new_recognizers
      @recognizers.splice(idx, 0, recognizer)
      idx += 1
    @clear_splitter()
    null

  tokenize : (text) ->
    pieces = text.match(new RegExp(@get_splitter().source, "g"))
    result = []
    for piece in pieces
      recognizer = null
      for r in @recognizers
        if r.recognizes(piece)
          recognizer = r
          break
      
      if recognizer.token_type is "composite"
        content = piece.match(recognizer.content)[0]
        result.push new TwitterCldr.CompositeToken(@tokenize(content))

      else
        cleaned_text = recognizer.clean(piece)
        if ((@remove_empty_entries and cleaned_text.length > 0) or !@remove_empty_entries)
          result.push new TwitterCldr.Token({"value" : cleaned_text, "type" : recognizer.token_type})

    result

  clear_splitter : ->
    @splitter = null

  get_splitter : -> 
    @splitter = (@custom_splitter || new RegExp("(" + @recognizers.map((recognizer) ->
      recognizer.regex.source
    ).join("|") + ")"))