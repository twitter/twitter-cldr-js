# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.NumberFormatter
  constructor: ->
    @tokens = []

    @default_symbols =
      'group': ','
      'decimal': '.'
      'plus_sign': '+'
      'minus_sign': '-'

  @data: ->
    TwitterCldr.get_data().NumberFormatter

  all_tokens : ->
    @constructor.data().all_tokens

  symbols : ->
    @constructor.data().symbols

  format: (number, options = {}) ->
    opts = @default_format_options_for(number)

    for key, val of options
      opts[key] = if options[key]? then options[key] else opts[key]

    number = @round_to(number, opts.precision || 0)

    tokens = @get_tokens(number, opts)

    if tokens?
      if tokens not instanceof Array
        tokens_sample = tokens[Object.keys(tokens)[0]]
        truncated_number = @truncate_number(number, tokens_sample[1].length)

        rounded_num = Number(@parse_number(truncated_number, opts)[0]) * Number(@get_key(number)) / (10 ** (tokens_sample[1].length - 1))

        # Checking _stack_depth should be a redundant condition, as
        # @get_key(rounded_num) should always equal @get_key(number) the second
        # time around. We only check it to prevent infinite loops in case of
        # bugs
        if !opts._stack_depth && @get_key(rounded_num) != @get_key(number)
          return @format(rounded_num, Object.assign(opts, { _stack_depth: 1 }))

        truncated_number = Math.floor(truncated_number) if opts.precision == 0
        tokens = tokens[TwitterCldr.PluralRules.rule_for(truncated_number)]

      [prefix, suffix, integer_format, fraction_format] = @partition_tokens(tokens)
      number_part = @truncate_number(number, integer_format.format.length)
      [intg, fraction] = @parse_number(number_part, opts)
      result = integer_format.apply(parseFloat(intg), opts)
      result += fraction_format.apply(fraction, opts) if fraction
      sign = if number_part < 0 && prefix != "-" then @symbols().minus_sign || @default_symbols.minus_sign else ""
      "#{prefix}#{result}#{suffix}"
    else
      unless @ instanceof TwitterCldr.DecimalFormatter
        # No specific formatting pattern for this number in current locale, so
        # we fall back to DecimalFormatter
        new TwitterCldr.DecimalFormatter().format(number, opts)
      else
        # Use default toString if current instance is already a DecimalFormatter
        number.toString()

  truncate_number: (number, decimal_digits) ->
    number  # noop for base class

  partition_tokens: (tokens) ->
    [
      tokens[0] || "",
      tokens[2] || "",
      new TwitterCldr.NumberFormatter.IntegerHelper(tokens[1], @symbols()),
      new TwitterCldr.NumberFormatter.FractionHelper(tokens[1], @symbols())
    ]

  parse_number: (number, options = {}) ->
    if options.precision?
      precision = options.precision
    else
      precision = this.precision_from(number)

    number = this.round_to(number, precision)
    Math.abs(number).toFixed(precision).split(".")

  precision_from: (num) ->
    parts = num.toString().split(".")
    if parts.length == 2 then parts[1].length else 0

  round_to: (number, precision) ->
    factor = Math.pow(10, precision)
    Math.round(number * factor) / factor

  get_tokens: ->
    throw new Error("get_tokens() not implemented - use a derived class like PercentFormatter.")

class TwitterCldr.PercentFormatter extends TwitterCldr.NumberFormatter
  constructor: (options = {}) ->
    @default_percent_sign = "%"
    super

  format: (number, options = {}) ->
    super(number, options).replace('¤', @symbols().percent_sign || @default_percent_sign)

  default_format_options_for: (number) ->
    precision: 0

  get_tokens: (number, options) ->
    if number < 0 then @all_tokens().percent.negative else @all_tokens().percent.positive

class TwitterCldr.DecimalFormatter extends TwitterCldr.NumberFormatter
  constructor: (@data_reader) ->
    super

  format: (number, options = {}) ->
    try
      result = super(number, options)
      if @data_reader? and options["type"]?
        transliterator = TwitterCldr.NumberingSystems.for_name(
          @data_reader.number_system_for(options["type"])
        )
        if transliterator?
          result = transliterator.transliterate(result)
      result
    catch error
      number.toString()

  default_format_options_for: (number) ->
    precision: this.precision_from(number)

  get_tokens: (number, options = {}) ->
    if number < 0 then @all_tokens().decimal.negative else @all_tokens().decimal.positive


class TwitterCldr.CurrencyFormatter extends TwitterCldr.NumberFormatter
  constructor: (options = {}) ->
    @default_currency_symbol = "$"
    @default_precision = @currencies_data().DEFAULT.digits
    super

  currencies_data: ->
    TwitterCldr.get_data().CurrencyFormatter.currencies_data

  format: (number, options = {}) ->
    if options.currency
      if TwitterCldr.Currencies?
        currency = TwitterCldr.Currencies.for_code(options.currency)
        currency ||= symbol: options.currency
      else
        currency = symbol: options.currency

      unless options.precision?
        options.precision = @defaults_for_currency(options.currency).digits
    else
      currency = symbol: @default_currency_symbol

    symbol = if options.use_cldr_symbol then currency.cldr_symbol else currency.symbol

    super(number, options).replace('¤', symbol)

  default_format_options_for: (number) ->
    precision = this.precision_from(number)
    if precision == 0 then precision = @default_precision
    precision: precision

  get_tokens: (number, options = {}) ->
    if number < 0 then @all_tokens().currency.negative else @all_tokens().currency.positive

  defaults_for_currency: (currency) ->
    @currencies_data()[currency] || @currencies_data().DEFAULT

class TwitterCldr.AbbreviatedNumberFormatter extends TwitterCldr.NumberFormatter
  NUMBER_MAX: Math.pow(10, 15)
  NUMBER_MIN: 1000

  default_format_options_for: (number) ->
    precision: this.precision_from(number)

  get_type: ->
    "decimal"

  get_key: (number) ->
    zeroes = ("0" for i in [0...(Math.floor(number).toString().length - 1)]).join("")
    "1#{zeroes}"

  get_tokens: (number, options = {}) ->
    # TODO: should this work for negative numbers?
    type = if (number < @NUMBER_MAX) && (number >= @NUMBER_MIN) then this.get_type() else "decimal"
    format = if type == this.get_type() then this.get_key(number) else null
    tokens = @all_tokens()[type]
    tokens = if number < 0 then tokens.negative else tokens.positive
    tokens = tokens[format] if format?
    tokens

  truncate_number: (number, decimal_digits) ->
    if @NUMBER_MIN <= number and number < @NUMBER_MAX
      factor = Math.max(0, Math.floor(number).toString().length - decimal_digits)
      number / Math.pow(10, factor)
    else
      number

class TwitterCldr.ShortDecimalFormatter extends TwitterCldr.AbbreviatedNumberFormatter
  get_type: ->
    "short_decimal"

class TwitterCldr.LongDecimalFormatter extends TwitterCldr.AbbreviatedNumberFormatter
  get_type: ->
    "long_decimal"

class TwitterCldr.NumberFormatter.BaseHelper
  interpolate: (string, value, orientation = "right") ->
    value = value.toString()
    length = value.length
    start = if orientation == "left" then 0 else -length
    string = (("#" for i in [0...length]).join("") + string).slice(-length) if string.length < length

    if start < 0
      string = string[0...(start + string.length)] + value
    else
      string = string[0...start] + value + string[(length)..-1]

    string.replace(/#/g, "")

class TwitterCldr.NumberFormatter.IntegerHelper extends TwitterCldr.NumberFormatter.BaseHelper
  constructor: (token, symbols = {}) ->
    format     = token.split('.')[0]
    @format    = this.prepare_format(format, symbols)
    @groups    = this.parse_groups(format)
    @separator = symbols.group || ','

  apply: (number, options = {}) ->
    this.format_groups(this.interpolate(@format, parseInt(number)))

  format_groups: (string) ->
    return string if @groups.length == 0
    tokens = []

    primary_group = @groups[@groups.length - 1]
    secondary_group = @groups[0]

    [string, token] = @chop_group(string, secondary_group)
    tokens.push(token)

    while string.length
      [string, token] = @chop_group(string, primary_group)
      tokens.push(token)

    (token for token in tokens when token != null).reverse().join(@separator)

  parse_groups: (format) ->
    index = format.lastIndexOf(',')
    return [] unless index > 0
    rest = format[0...index]
    widths = [format.length - index - 1]
    widths.push(rest.length - rest.lastIndexOf(',') - 1) if rest.lastIndexOf(',') > -1
    widths = (width for width in widths when width != null) # compact
    widths.reverse() # uniq
    (widths[index] for index in [0...widths.length] when widths.indexOf(widths[index], index + 1) == -1).reverse()

  chop_group: (string, size) ->
    start = Math.max(string.length - size, 0)
    [string.slice(0, start), string.slice(start)]

  prepare_format: (format, symbols) ->
    format.replace /[,+-]/g, (match) ->
      switch match
        when ',' then ''
        when '+' then symbols.plus_sign
        when '-' then symbols.minus_sign

class TwitterCldr.NumberFormatter.FractionHelper extends TwitterCldr.NumberFormatter.BaseHelper
  constructor: (token, symbols = {}) ->
    @format = if token then token.split('.').pop() else ""
    @decimal = symbols.decimal || "."
    @precision = @format.length

  apply: (fraction, options = {}) ->
    precision = if options.precision? then options.precision else @precision
    if precision > 0
      @decimal + this.interpolate(this.format_for(options), fraction, "left")
    else
      ""

  format_for: (options) ->
    precision = if options.precision? then options.precision else @precision
    if precision then ("0" for i in [0...precision]).join("") else @format
