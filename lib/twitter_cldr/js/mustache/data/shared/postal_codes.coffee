# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.PostalCodes

  postal_codes = `{{{postal_codes}}}`

  find_regex = (territory) ->
    regex_str = postal_codes[territory]
    if regex_str? then regex_str else null

  @territories: ->
    @codes ||= (data for data, _ of postal_codes)

  @regex_for_territory: (territory) ->
    regex = find_regex(territory)
    if regex? then new RegExp(regex) else null

  @is_valid: (territory, postal_code) ->
    regex = @regex_for_territory(territory)
    regex.test (postal_code)

