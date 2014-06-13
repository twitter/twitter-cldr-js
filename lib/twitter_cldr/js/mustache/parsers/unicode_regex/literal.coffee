# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.Literal extends TwitterCldr.Component
	
	constructor : (@text) ->
		super

	@ordinalize : (char) ->
		char.charCodeAt(0)

	@special_characters = {
		s : [32]  # space
		t : [9]   # tab
		r : [13]  # carriage return
		n : [10]  # newline
		f : [12]  # form feed
		d : "0123456789".split("").map (c) ->
				@ordinalize(c)
		w : "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_".split("").map (c) ->
				@ordinalize(c)
	}

	@to_regex_str : ->
		@text

	@to_set : ->
		if text.match(/^\\/) 
			special_char = text.slice(1)

			if @special_characters[special_char]?
				set_for_special_char (special_char)

			else
				TwitterCldr.Utils.RangeSet.from_array ([@ordinalize(special_char)])	
		
		else
			TwitterCldr.Utils.RangeSet.from_array ([@ordinalize(text)])

	set_for_special_char : (char) -> 
		chars = TwitterCldr.Utils.RangeSet.from_array(@special_characters[char.toLowerCase()])
		if char.toUpperCase() == char
			UnicodeRegex.valid_regexp_chars.subtract(chars)
		else
			chars			
