# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.PhoneCodes
  @phone_codes = `{{{phone_codes}}}`

  @territories: ->
    @codes ||= (data for _, data of @phone_codes)

  @code_for_territory: (territory) ->
    result = null
    for territory_code, phone_code of @phone_codes
      if territory_code == territory
        result = phone_code
        break
    result