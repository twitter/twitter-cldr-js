# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.BreakIterator
  constructor : (locale = TwitterCldr.Settings.locale, options = {}) ->
    @locale = locale
    @use_uli_exceptions = (if options["use_uli_exceptions"]? then options["use_uli_exceptions"] else true)
    @exceptions_cache = {}
    @segmentation_tokenizer = new TwitterCldr.SegmentationTokenizer()
    @segmentation_parser = new TwitterCldr.SegmentationParser()

  @tailoring_resource_data = {}
  @exceptions_resource_data = {}
  @root_resource = {}

  each_sentence : (str, block) ->
    @each_boundary(str, "sentence", block)

  each_word : (str, block) ->
    throw "Word segmentation is not currently supported."

  each_line : (str, block) ->
    throw "Line segmentation is not currently supported."

  boundary_name_for: (str) ->
    str.replace(/(?:^|\_)([A-Za-z])/, (match) ->
      match.toUpperCase()
      ) + "Break"

  each_boundary : (str, boundary_type, block) ->
    rules = @compile_rules_for(@locale, boundary_type)
    match = null
    last_offset = 0
    current_position = 0
    search_str = str
    result = []

    while(search_str.length isnt 0)
      rule = null
      for r in rules
        match = r.match(search_str)
        if match?
          rule = r
          break
      if rule.boundary_symbol is "break"
        break_offset = current_position + match.boundary_offset
        result.push(str.slice(last_offset, break_offset))
        if block?
          block(result[result.length-1])

        last_offset = break_offset

      search_str = search_str.slice(match.boundary_offset)
      current_position += match.boundary_offset

    if last_offset < str.length - 1
      result.push(str.slice(last_offset))
      if block?
        block(str.slice(last_offset))


    result

  compile_exception_rule_for : (locale, boundary_type, boundary_name) ->
    if boundary_type is "sentence"
      cache_key = TwitterCldr.Utilities.compute_cache_key([locale, boundary_type])

      result = null
      exceptions = @exceptions_for(locale, boundary_name)
      regex_contents = (TwitterCldr.Utilities.regex_escape(exception) for exception in exceptions).join("|")
      @exceptions_cache[cache_key] ||=  @segmentation_parser.parse (
        @segmentation_tokenizer.tokenize("(?:"+regex_contents+") \u00D7")
      )

  # Grabs rules from segment_root, applies custom tailorings (our own, NOT from CLDR),
  # and optionally integrates ULI exceptions.
  compile_rules_for : (locale, boundary_type) ->
    boundary_name = @boundary_name_for(boundary_type)
    boundary_data = @resource_for(boundary_name)
    symbol_table = @symbol_table_for(boundary_data)
    root_rules = @rules_for(boundary_data, symbol_table)
    tailoring_boundary_data = @tailoring_resource_for(locale, boundary_name)
    tailoring_rules = @rules_for(tailoring_boundary_data, symbol_table)
    rules = @merge_rules(root_rules, tailoring_rules)

    if @use_uli_exceptions is true
      exception_rule = @compile_exception_rule_for(locale, boundary_type, boundary_name)
      rules.unshift(exception_rule)

    rules

  # replaces ruleset1's rules with rules with the same id from ruleset2
  merge_rules : (ruleset1, ruleset2) ->
    result = []
    TwitterCldr.Utilities.arraycopy ruleset1, 0, result, 0, ruleset1.length

    for i in [0...ruleset2.length] by 1
      for j in [0...result.length] by 1
        if ruleset2[i].id == result[j].id
          result[j] = ruleset2[i]

    result

  symbol_table_for : (boundary_data) ->
    table = new TwitterCldr.SymbolTable()

    for i in [0...boundary_data.variables.length] by 1
      variable = boundary_data.variables[i]
      id = variable.id.toString()
      tokens = @segmentation_tokenizer.tokenize(variable.value)
      # note: variables can be redefined (add replaces if key already exists)
      table.add(id, @resolve_symbols(tokens, table))

    table

  resolve_symbols : (tokens, symbol_table) ->
    result = []

    for i in [0...tokens.length]
      token = tokens[i]
      if token.type == "variable"
        result = result.concat(symbol_table.fetch(token.value))
      else
        result.push(token)

    result

  rules_for : (boundary_data, symbol_table) ->
    results = []
    for rule in boundary_data.rules
      r = @segmentation_parser.parse(
        @segmentation_tokenizer.tokenize(rule.value), {"symbol_table" : symbol_table}
      )
      r.string = rule.value
      r.id = rule.id
      results.push(r)

    results


  resource_for : (boundary_name) ->
    TwitterCldr.BreakIterator.root_resource["segments"][boundary_name]

  tailoring_resource_for : (locale, boundary_name) ->
    TwitterCldr.BreakIterator.tailoring_resource_data[locale][locale]["segments"][boundary_name]

  exceptions_for : (locale, boundary_name) ->
    result = TwitterCldr.BreakIterator.exceptions_resource_data[locale][locale]["exceptions"]
    if result? then result else []