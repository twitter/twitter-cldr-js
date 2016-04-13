  # Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.Currencies
  @currencies = `{{{currencies}}}`

  @currency_codes: ->
    @codes ||= (code for code, _ of @currencies)

  @for_code: (currency_code) ->
    result = null
    for country_name, data of @currencies
      if data.currency == currency_code
        result =
          country: country_name
          cldr_symbol: data.cldr_symbol
          symbol: data.symbol
          currency: data.currency
          name: data.name
          code_points: data.code_points
        break

    result
