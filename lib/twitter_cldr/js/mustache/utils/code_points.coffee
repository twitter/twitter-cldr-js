# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.CodePoints
  
  @to_char : (code_point) ->
    TwitterCldr.Utilities.pack_array([code_point])

  @from_char : (char) ->
    TwitterCldr.Utilities.unpack_string(char[0])[0]

  @from_chars : (chars) ->
    chars.map ( (char) ->
      @from_char(char)
    ), @

  @to_chars : (code_points) ->
    code_points.map ( (code_point) ->
      @to_char(code_point)
    ), @

  @from_string : (str) ->
    TwitterCldr.Utilities.unpack_string(str)

  @to_string : (code_points) ->
    @to_chars(code_points).join("")

