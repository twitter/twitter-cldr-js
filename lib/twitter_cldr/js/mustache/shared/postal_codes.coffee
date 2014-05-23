# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.PostalCodes
  
  postal_codes = `{{{postal_codes}}}`

  find_regex = (territory) ->
    for territory_code, regex of postal_codes
      return regex if territory_code == territory
  
  @territories: ->
    @codes ||= (data for data, _ of postal_codes)

  @regex_for_territory: (territory) ->
    regex = find_regex(territory)
    if regex? then new RegExp(regex) else null

  @is_valid: (territory, postal_code) ->
    regex = @regex_for_territory(territory)
    regex.test (postal_code)

