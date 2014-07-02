# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.BreakIterator
	constructor : (locale = TwitterCldr.locale, options = {}) ->
		@locale = locale
		@use_uli_exceptions = (if options["use_uli_exceptions"] then options["use_uli_exceptions"] else true)
		@exceptions_cache = {}
		@rule_cache = {}
		@segmentation_tokenizer = new TwitterCldr.SegmentationTokenizer ()
		@segmentation_parser = new TwitterCldr.SegmentationParser () # try putting this outside with the ||= operator thing
		@tailoring_resource_cache = {}


	each_sentence : (str, block) ->
		@each_boundary (str, "sentence")

	each_word : (str, block) ->
		throw "Word segmentation is not currently supported."
	
	each_line : (str, block) ->
		throw "Line segmentation is not currently supported."	

	boundary_name_for: (str) ->
		str.replace /(?:^|\_)([A-Za-z])/, (match) ->
			match.toUpperCase()

def each_boundary(str, boundary_type) #TODO do this block thingy
				if block_given?
					rules = compile_rules_for(locale, boundary_type)
					match = nil
					last_offset = 0
					current_position = 0
					search_str = str.dup

					until search_str.size == 0
						rule = rules.find { |rule| match = rule.match(search_str) }

						if rule.boundary_symbol == :break
							break_offset = current_position + match.boundary_offset
							yield str[last_offset...break_offset]
							last_offset = break_offset
						end

						search_str = search_str[match.boundary_offset..-1]
						current_position += match.boundary_offset
					end

					if last_offset < (str.size - 1)
						yield str[last_offset..-1]
					end
				else
					to_enum(__method__, str, boundary_type)
				end
			end


	compile_exception_rule_for : (locale, boundary_type, boundary_name) ->
		if boundary_type is "sentence"
			cache_key = TwitterCldr.Utilities.compute_cache_key (locale, boundary_type)
			
			result = null
			exceptions = exceptions_for (locale, boundary_name)
			regex_contents = exceptions.map((exception) ->
				TwitterCldr.Utilities.regex_escape exception
			)
			@exceptions_cache [cache_key] ||=  @segmentation_parser.parse (
				@segmentation_tokenizer.tokenize("(?:+"+regex_contents+" x")
			)

	# Grabs rules from segment_root, applies custom tailorings (our own, NOT from CLDR),
	# and optionally integrates ULI exceptions.
	compile_rules_for : (locale, boundary_type) ->
		boundary_name = boundary_name_for(boundary_type)
		boundary_data = resource_for(boundary_name)
		symbol_table = symbol_table_for(boundary_data)
		root_rules = rules_for(boundary_data, symbol_table)
		tailoring_boundary_data = tailoring_resource_for(locale, boundary_name)
		tailoring_rules = rules_for(tailoring_boundary_data, symbol_table)
		rules = merge_rules(root_rules, tailoring_rules)

		if use_uli_exceptions
			exception_rule = compile_exception_rule_for(locale, boundary_type, boundary_name)
			rules.unshift (exception_rule)

		rules

	# replaces ruleset1's rules with rules with the same id from ruleset2      
	merge_rules : (ruleset1, ruleset2) ->
		result = []
		TwitterCldr.Utilities.arraycopy ruleset1, 0, result, 0, ruleset1.length
		
		for i in [0...ruleset2.length]
			for j in [0...result.length]
				if ruleset2[i].id == result[j].id
					result[j] = ruleset2[i]

		result


	symbol_table_for : (boundary_data) ->
		table = new TwitterCldr.SymbolTable()
		
		for i in [0...boundary_data.variables.length]
			variable = boundary_data.variables[i]
			id = variable.id.toString()
			tokens = @segmentation_tokenizer.tokenize(variable.value)
			# note: variables can be redefined (add replaces if key already exists)
			table.add (id, resolve_symbols(tokens, table))

		table


	resolve_symbols : (tokens, symbol_table) ->
		result = []
		
		for i in [0...tokens.length]
			token = tokens[i]
			if token.type == "variable"
				result = result.concat @symbol_table.fetch(token.value)
			else 
				result.push(token)

		result

	rules_for : (boundary_name, symbol_table) ->
		boundary_data.rules.map ((rule) ->
			r = @segmentation_parser.parse (
				segmentation_tokenizer.tokenize (rule.value), {"symbol_table" : symbol_table}
				)
					
			r.string = rule.value
			r.id = rule.id
			r
		)









			

			

			def resource_for(boundary_name)
				self.class.root_resource[:segments][boundary_name.to_sym]
			end

			def tailoring_resource_for(locale, boundary_name)
				cache_key = TwitterCldr::Utils.compute_cache_key(locale, boundary_name)
				self.class.tailoring_resource_cache[cache_key] ||= begin
					res = TwitterCldr.get_resource("shared", "segments", "tailorings", locale)
					res[locale][:segments][boundary_name.to_sym]
				end
			end

			def self.tailoring_resource_cache
				@tailoring_resource_cache ||= {}
			end

			def self.root_resource
				@root_resource ||= TwitterCldr.get_resource("shared", "segments", "segments_root")
			end

			# The boundary_name param is not currently used since the ULI JSON resource that
			# exceptions are generated from does not distinguish between boundary types. The
			# XML version does, however, so the JSON will hopefully catch up at some point and
			# we can make use of this second parameter. For the time being, compile_exception_rule_for
			# (which calls this function) assumes a "sentence" boundary type.
			def exceptions_for(locale, boundary_name)
				self.class.exceptions_resource_cache[locale] ||= begin
					TwitterCldr.get_resource("uli", "segments", locale)[locale][:exceptions]
				rescue ArgumentError
					[]
				end
			end

			def self.exceptions_resource_cache
				@exceptions_resource_cache ||= {}
			end

		end
	end
end
