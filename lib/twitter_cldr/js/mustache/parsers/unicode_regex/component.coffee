# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.Component
  to_utf8 : (codepoints) ->
    unless codepoints instanceof Array
      codepoints = [codepoints]

    (@to_hex(cp) for cp in codepoints)

  to_hex : (codepoint) ->
    if (codepoint >= 0 and codepoint <= 0xD7FF or codepoint >= 0xE000 and codepoint <= 0xFFFF)
      return @to_escaped_hex(codepoint)
    else if (codepoint >= 0x10000 and codepoint <= 0x10FFFF)
      codepoint -= 0x10000
      first = ((0xffc00 & codepoint) >> 10) + 0xD800
      second = (0x3ff & codepoint) + 0xDC00
      return @to_escaped_hex(first) + '+' + @to_escaped_hex(second)

  to_escaped_hex : (codepoint) ->
    s = codepoint.toString(16)
    s = "0000".slice(0, 4 - s.length) + s
    return "\\u" + s;

  range_to_regex : (range) ->
    if range.first instanceof Array
      @array_to_regex(range)
    else
      if range.size is 1
        "[" + @to_utf8(range.first) + "]"
      else
        "[" + @to_utf8(range.first) + "-" + @to_utf8(range.last) + "]"

  array_to_regex : (arr) ->
    ("(?:" + @to_utf8(c) + ")" for c in arr).join("")

  set_to_regex : (set) ->
    strs = ((@._set_element_to_regex(element)
    ) for element in TwitterCldr.Utilities.remove_duplicates(
      set.to_array(true))
    )

    ("(?:" + strs.join("|") + ")")

  _set_element_to_regex : (element) ->
    if element instanceof TwitterCldr.Range
      @range_to_regex(element)
    else if element instanceof Array
      @array_to_regex(element)
    else
      @to_utf8(element)
