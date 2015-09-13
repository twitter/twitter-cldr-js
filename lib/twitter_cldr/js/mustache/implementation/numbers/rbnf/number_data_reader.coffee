# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.NumberDataReader
  constructor : (@locale, options = {}) ->
    @default_number_system = "latn"
    @abbreviated_min_power = 3
    @abbreviated_max_power = 14

    @number_min = 10 ** @abbreviated_min_power
    @number_max = 10 ** (@abbreviated_max_power + 1)

    @base_path   = [@locale, @locale, "numbers", "formats"]
    @symbol_path = [@locale, @locale, "numbers", "symbols"]
    @symbols = @traverse(@symbol_path)

    @type_paths = {
      "default"       : ["decimal", "patterns"],
      "decimal"       : ["decimal", "patterns"],
      "long_decimal"  : ["decimal", "patterns", "long"],
      "short_decimal" : ["decimal", "patterns", "short"],
      "currency"      : ["currency", "patterns"],
      "percent"       : ["percent", "patterns"]
    }
    @types = [k for k, v of @type_paths]

    @abbreviated_types = ["long_decimal", "short_decimal"]

    @default_type = "decimal"
    @default_format = "default"
    @default_sign = "positive"

    @type = options["type"] || @default_type

    if not (@type? and @type_paths[@type]?)
      throw "Type " + @type + " is not supported"

    @format = options["format"] || @default_format
    @tokenizer = new TwitterCldr.NumberTokenizer(@)
    @formatter = null
    switch @type
      when "decimal"
        @formatter = new TwitterCldr.DecimalFormatter(options)
      when "long_decimal"
        @formatter = new TwitterCldr.LongDecimalFormatter(options)
      when "short_decimal"
        @formatter = new TwitterCldr.ShortDecimalFormatter(options)
      when "currency"
        @formatter = new TwitterCldr.CurrencyFormatter(options)
      when "percent"
        @formatter = new TwitterCldr.PercentFormatter(options)

    @number_data = {}

  @data: ->
    TwitterCldr.get_data()[@name]

  resource : ->
    @constructor.data().resource

  traverse : (path, obj = @resource()) ->
    TwitterCldr.Utilities.traverse_object(obj, path)

  pattern_at_path : (path) ->
    @traverse(path)

  get_resource : (locale = @locale) ->
    @resource()[locale]

  pattern : (number) ->
    sign = if number < 0 then "negative" else "positive"
    path = @base_path + if @is_valid_type_for(number, type) then @type_paths[type] else type_paths["default"]

    pattern = @traverse[path]

    if pattern[@format]?
      pattern = pattern[@format]

    if number?
      pattern = pattern_for_number(pattern, number)

    if pattern instanceof String
      pattern_for_sign(pattern, sign)
    else
      pattern

  number_system_for : (type) ->
    (@traverse(@base_path.concat(type)) || {})["number_system"] || @default_number_system

  is_abbreviated : (type) ->
    @abbreviated_types[type]?

  is_valid_type_for : (number, type) ->
    if @is_abbreviated(type)
      @is_within_abbreviation_range(number)
    else
      @type_paths[type]?

  get_key_for : (number) ->
    10 ** ((number + "").length - 1)

  pattern_for_number : (pattern, number) ->
    if pattern instanceof Object
      pattern[@get_key_for(number)] || [pattern]
    else
      pattern

  pattern_for_sign : (pattern, sign) ->
    if pattern.indexOf(";") != 0
      positive = pattern.split(';')[0]
      negative = pattern.split(';')[1]
      if sign is "positive"
        return positive
      else
        return negative
    else
      if sign is "negative"
        (@symbols["minus"] || '-') + pattern
      else
        pattern

  is_within_abbreviation_range : (number) ->
    @number_min <= number and number < @number_max
