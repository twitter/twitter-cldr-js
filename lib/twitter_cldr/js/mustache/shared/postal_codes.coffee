# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.PostalCodes
  
  postal_codes = `{{{postal_codes}}}`
  regex_cache = {}

  find_regex = (territory) ->
    regex = regex_cache[territory]
    return regex if regex? 

    regex = postal_codes[territory]
    if regex?
      regex_cache[territory] = regex
      return regex

    return null
  
  @territories: ->
    @codes ||= (data for data, _ of postal_codes)

  @regex_for_territory: (territory) ->
    regex = find_regex(territory)
    if regex? then new RegExp(regex) else null

  @is_valid: (territory, postal_code) ->
    regex = @regex_for_territory(territory)
    regex.test (postal_code)

