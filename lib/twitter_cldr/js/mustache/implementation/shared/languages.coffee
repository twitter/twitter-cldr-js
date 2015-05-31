# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.Languages

  @all = {};

  @rtl_data = {};

  @from_code: (code) ->
    @all[code] or null

  @is_rtl: (locale) ->
    result = @rtl_data[locale]
    if result? then result else null
