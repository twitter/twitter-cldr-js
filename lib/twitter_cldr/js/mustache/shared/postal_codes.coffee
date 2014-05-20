# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.PostalCodes
  @postal_codes = `{{{postal_codes}}}`

  @territories: ->
    @codes ||= (data for data, _ of @postal_codes)

  @regex_for_territory: (territory) ->
    result = null
    for territory_code, regex of @postal_codes
      if territory_code == territory
        result = regex
        break
    if result? then result = new RegExp(result) 
    result

  @is_valid: (territory, postal_code) ->
    regex = PostalCodes.regex_for_territory(territory)
    regex.test (postal_code)

