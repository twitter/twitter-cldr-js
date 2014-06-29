# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.Component
  @to_utf8 : (codepoints) ->
    if !(codepoints instanceof Array)
      codepoints = [codepoints]

    codepoints.map ( (c) -> 
      s = c.toString(16)
      while s.length < 4 
        s = "0" + s 

      return "\\u{" + s + "}"; 
    )

  @range_to_regex : (range) ->
    if range[0] instanceof Array
      array_to_regex(range)
    else
      "["+@to_utf8(range[0])+"-"+range[0]+"]" # todo - check this.

  @array_to_regex : (arr) ->
    arr.map ( (c) ->
      return "(?:" + to_utf8(elem) + ")"
    )


  @set_to_regex : (set) -> # TODO - Figure this out.
    strs = TwitterCldr.Utilities(only_unique(set.to_array(true)).map ( (obj) ->
      if obj instanceof Range #TODO - Check which range this is. Range Set or Ruby Range
        range_to_regex (obj)
      else if obj instanceof Array
        array_to_regex (obj)
      else
        to_utf8 (obj)
    )
    "(?:" + strs.join("|") + ")"
