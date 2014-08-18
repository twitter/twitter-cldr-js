# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.Component
  to_utf8 : (codepoints) ->
    if !(codepoints instanceof Array)
      codepoints = [codepoints]

    codepoints.map(((cp) -> 
          if (cp >= 0 and cp <= 0xD7FF or cp >= 0xE000 and cp <= 0xFFFF)
            return @to_hex(cp)
          else if (cp >= 0x10000 and cp <= 0x10FFFF)
            cp -= 0x10000
            first = ((0xffc00 & cp) >> 10) + 0xD800
            second = (0x3ff & cp) + 0xDC00
            return @to_hex(first) + '+' + @to_hex(second)
        ), @)

  to_hex : (codepoint) ->
    s = codepoint.toString(16)
    s = "0000".slice(0, 4 - s.length) + s
    return "\\u" + s; 

  range_to_regex : (range) ->
    if range.first instanceof Array
      @array_to_regex(range)
    else
      "["+@to_utf8(range.first)+"-"+@to_utf8(range.last)+"]"

  array_to_regex : (arr) ->
    (arr.map(((c) ->
                  return "(?:" + @to_utf8(c) + ")"
                ), @)).join("")

  set_to_regex : (set) ->
    strs = TwitterCldr.Utilities.remove_duplicates(set.to_array(true)).map(((obj) ->
          if obj instanceof TwitterCldr.Range
            @range_to_regex(obj)
          else if obj instanceof Array
            @array_to_regex(obj)
          else
            @to_utf8(obj)
        ), @)
    
    ("(?:" + strs.join("|") + ")")
