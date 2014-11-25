# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0
class TwitterCldr.NumberFormatter
	constructor : (@data_reader) ->
    default_symbols = {
        'group'       : ',',
        'decimal'     : '.',
        'plus_sign'   : '+',
        'minus_sign'  : '-'
      }

	format : (tokens, obj, options = {}) ->
    [@["format_" + token.type](token, index, obj, options) for token in tokens]
    if !options['precision']?
      options['precision'] = @precision_from(number)
    if !options[type]?
      options[type] = "decimal"

    partitioned_tokens = @partition_tokens(tokens)
    prefix = partitioned_tokens[0]
    suffix = partitioned_tokens[1]
    integer_format = partitioned_tokens[2]
    fraction_format = partitioned_tokens[3]

    number = @truncate_number(number, integer_format)

    parsed_number = @parse_number(number, options)
    int = parsed_number[0]
    fraction = parsed_number[1]

    result =  integer_format.apply(int, options)
    result << fraction_format.apply(fraction, options) if fraction

    numbering_system(options["type"]).transliterate(
      (prefix + "") + (result + "") + (suffix + "")
    )


  format_plaintext : (token, index, obj, options) ->
    if(match = token.value.match(/([\s]*)'(.*)'([\s]*)/))?
      match.splice(1).join
    else
      token.value

  format_composite : (token, index, obj, options) ->
    format(token.tokens, obj) + ""


  # data readers should encapsulate formatting options, and when they do, this "type"
  # argument will no longer be necessary (accessible via `data_reader.type` instead)
  get_numbering_system : (type) ->
    @numbering_system ||= TwitterCldr.NumberingSystem.for_name(
      @data_reader.number_system_for(type)
    )

  truncate_number : (number, integer_format) ->
    # no-op for base class
    number

  partition_tokens : (tokens) ->
    [
      @token_val_from(tokens[0]),
      @token_val_from(tokens[2]),
      new TwitterCldr.Numbers.Integer(tokens[1], @data_reader.symbols),
      new TwitterCldr.Numbers.Fraction(tokens[1], @data_reader.symbols)
    ]

  token_val_from : (token) ->
    if token then token.value else ""

  parse_number : (number, options = {}) -> # TODO - verify this
  # TODO - alsoverify whether this is needed at all.
  # TODO Also verify that whether `number` will be flaot or string.
    precision = options['precision'] || @precision_from(number)
    rounding = options['rounding'] || 0

    number = Math.abs(parseFloat(number + "").toPrescision(precision)) # Making sure there are never any type errors
    number.split(".")

  precision_from : (number) ->
    parts = (number + "").split('.')
    if parts.length == 2
      return parts[1].length
    else
      return 0
