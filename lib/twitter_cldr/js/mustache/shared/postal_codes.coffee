# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.PostalCodes
  
  postal_codes = `{{{postal_codes}}}`
  regex_cache = {}

  find_regex = (territory) ->
    result = regex_cache[territory]
    return result if result? 

    
    for territory_code, regex of postal_codes
      if territory_code == territory
        regex_cache[territory] = regex
        return regex 
  
  @territories: ->
    @codes ||= (data for data, _ of postal_codes)

  @regex_for_territory: (territory) ->
    regex = find_regex(territory)
    if regex? then new RegExp(regex) else null

  @is_valid: (territory, postal_code) ->
    regex = @regex_for_territory(territory)
    regex.test (postal_code)

