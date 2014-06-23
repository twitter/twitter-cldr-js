# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.CharacterRange extends TwitterCldr.Component

  constructor : (@initial, @final) ->
    

    # Unfortunately, due to the ambiguity of having both character
    # ranges and set operations in the same syntax (which both use
    # the "-" operator and square brackets), we have to treat
    # CharacterRange as both a token and an operand. This type method
    # helps it behave like a token.
    @type = "character_range"
    super

  to_set : ->

    i = initial.to_set().to_full_array()[0]
    arr = [i];
    while i < final.to_set().to_full_array()[0]
      i += 1
      arr.push (i)

    new TwitterCldr.Utils.RangeSet(arr)
