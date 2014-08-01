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
			d : [0..9].map ((c) ->
					@ordinalize(c.toString())), @
			w : "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_".split("").map ((c) ->
					@ordinalize(c)), @
		}
		super

	ordinalize : (char) ->
		TwitterCldr.Utilities.char_code_at char, 0
	
	to_regex_str : ->
		@text

	to_set : ->
		if @text.match(/^\\/) 
			special_char = @text.slice(1)

			if @special_characters[special_char.toLowerCase()]?
				@set_for_special_char (special_char)

			else
				TwitterCldr.RangeSet.from_array ([@ordinalize(special_char)])	
		
		else
			TwitterCldr.RangeSet.from_array ([@ordinalize(@text)])

	set_for_special_char : (char) -> 
		chars = TwitterCldr.RangeSet.from_array(@special_characters[char.toLowerCase()])
		if char.toUpperCase() == char
			TwitterCldr.UnicodeRegex.get_valid_regexp_chars().subtract(chars)
		else
			chars			
