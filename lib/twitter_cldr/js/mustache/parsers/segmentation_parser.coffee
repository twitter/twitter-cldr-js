# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.SegmentationParser extends TwitterCldr.Parser
	constructor : ->
		@begin_token ||= new TwitterCldr.Token({type : "special_char", value: "\\A"})
		@regex_parser ||= new TwitterCldr.UnicodeRegexParser

	class @.RuleMatchData
		constructor : (@text, @boundary_offset) ->

	class @.Rule
		constructor : ->

	class @.BreakRule extends @.Rule
		constructor : (@left, @right) ->
			@boundary_symbol = "break"		
			super

		match : (str) ->
			left_match = @left.match(str)

			if @left? and left_match?
				match_pos = str.indexOf(left_match[0]) + left_match[0].length

				if @right?
					right_match = @right.match(str.slice(str.length - match_pos, str.length))

					if right_match?
						return new TwitterCldr.SegmentationParser.RuleMatchData((left_match[0] + right_match [0]), match_pos)

					else
						return new TwitterCldr.SegmentationParser.RuleMatchData(str, str.length)
			return null

	class @.NoBreakRule extends @.Rule
		constructor : (@regex) ->
			@boundary_symbol = "no_break"
			super

		match : (str) ->
			match = str.match(@regex)
			if match? 
				new TwitterCldr.SegmentationParser.RuleMatchData(match[0], str.indexOf(match[0]) + match[0].length) 
			else 
				null # TODO check this. There should be a position counter thing.

	do_parse: (options = {}) ->
		regex_token_lists = []
		current_regex_tokens = []
		boundary_symbol = null

		while @current_token()?
			switch @current_token().type
				when "break", "no_break"
					boundary_symbol = @current_token().type
					regex_token_lists.push(current_regex_tokens)
					current_regex_tokens = []
				else
					current_regex_tokens.push(@current_token())

			@next_token(@current_token().type)

		regex_token_lists.push(current_regex_tokens)

		result = null

		switch boundary_symbol
			when "break"
				result = new TwitterCldr.SegmentationParser.BreakRule(@parse_regex(@add_anchors(regex_token_lists[0]), options), @parse_regex(@add_anchors(regex_token_lists[1]), options))
			when "no_break"
				result = new TwitterCldr.SegmentationParser.NoBreakRule(@parse_regex(@add_anchors([].concat(regex_token_lists...)), options))
		
		result

	add_anchors : (token_list) ->
		# token_list.splice(0, 0, @begin_token)
		[@begin_token].concat(token_list)

	parse_regex : (tokens, options = {}) ->
		if tokens? and tokens.length != 0 then new TwitterCldr.UnicodeRegex(@regex_parser.parse(tokens, options)) else null
