# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.CodePoints

  @to_char : (code_point) ->
    TwitterCldr.Utilities.pack_array([code_point])

  @from_char : (char) ->
    TwitterCldr.Utilities.unpack_string(char[0])[0]

  @from_chars : (chars) ->
    (@from_char(char) for char in chars)

  @to_chars : (code_points) ->
    (@to_char(code_point) for code_point in code_points)

  @from_string : (str) ->
    TwitterCldr.Utilities.unpack_string(str)

  @to_string : (code_points) ->
    @to_chars(code_points).join("")

