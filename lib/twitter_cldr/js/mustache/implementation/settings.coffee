# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.Settings
  @is_rtl: ->
    TwitterCldr.get_data().Settings.is_rtl

  @locale: ->
  	TwitterCldr.get_data().Settings.locale
