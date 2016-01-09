# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.Literal extends TwitterCldr.Component

  constructor : (@text) ->
    @special_characters = {
      s : [32]  # space
      t : [9]   # tab
      r : [13]  # carriage return
      n : [10]  # newline
      f : [12]  # form feed
      d : (char for char in [48..57]) # digits 0-9
      w : (char for char in [97..122].concat([65..90]).concat([48..57]).concat([95])) # lowercase, uppercase, numbers
    }


    super

  ordinalize : (char) ->
    TwitterCldr.Utilities.char_code_at(char, 0)

  to_regexp_str : ->
    @text

  to_set : ->
    if @text.match(/^\\/)
      special_char = @text.slice(1)

      if @special_characters[special_char.toLowerCase()]?
        @set_for_special_char(special_char)

      else
        TwitterCldr.RangeSet.from_array([@ordinalize(special_char)])

    else
      TwitterCldr.RangeSet.from_array([@ordinalize(@text)])

  set_for_special_char : (char) ->
    chars = TwitterCldr.RangeSet.from_array(@special_characters[char.toLowerCase()])
    if char.toUpperCase() == char
      TwitterCldr.UnicodeRegex.get_valid_regexp_chars().subtract(chars)
    else
      chars
