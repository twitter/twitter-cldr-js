# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.Languages

  @data: ->
    TwitterCldr.get_data()[@name]

  @all: ->
  	@data().all

  @from_code: (code) ->
    @data().all[code] or null

  @is_rtl: (locale) ->
    result = @data().rtl_data[locale]
    if result? then result else null
