# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.BreakIterator
	constructor : (locale = TwitterCldr.locale, options = {}) ->
		@locale = locale
		@use_uli_exceptions = (if options["use_uli_exceptions"] then options["use_uli_exceptions"] else true)

	@each_sentence : (str) ->
		@each_boundary (str, "sentence")

	@each_word : (str) ->
		throw "Word segmentation is not currently supported."
	
	@each_line : (str) ->
		throw "Line segmentation is not currently supported."	

	boundary_name_for: (str) ->
		str.replace /(?:^|\_)([A-Za-z])/, (match) ->
			match.toUpperCase()
