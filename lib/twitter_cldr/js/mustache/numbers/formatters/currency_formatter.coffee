# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.NumberFormatter extends TwitterCldr.NumberFormatter
  format : (tokens, number, options = {}) ->
    if !options["currency"]?
      options["currency"] = "USD"
    currency = Twitter.Currencies.for_code(options["currency"])
    currency ||= {
      'currency'    : options['currency'],
      'symbol'      : options['currency'],
      'cldr_symbol' : options['currency']
    }

    # overwrite with explicit symbol if given
    currency['symbol'] = options['symbol'] if options['symbol']

    digits_and_rounding = @get_resource(options['currency'])
    options['precision'] ||= @digits_and_rounding['digits']
    options['rounding'] ||= @digits_and_rounding['rounding']

    symbol = options['use_cldr_symbol'] ? currency['cldr_symbol'] : currency['symbol']
    symbol ||= (currency['currency'] + "")
    super.gsub('¤', symbol) # TODO verify this

  resource = {}

  get_resource (code) ->
    @resource[code + ""] || @resource["DEFAULT"]