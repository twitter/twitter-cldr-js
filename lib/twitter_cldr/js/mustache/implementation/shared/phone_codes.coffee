# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.PhoneCodes
  @phone_codes = `{{{phone_codes}}}`

  @territories: ->
    @codes ||= (data for data, _ of @phone_codes)

  @code_for_territory: (territory) ->
    result = @phone_codes[territory]
    if result? then result else null
