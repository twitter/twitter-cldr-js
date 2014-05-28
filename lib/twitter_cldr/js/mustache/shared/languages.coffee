# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.Languages
  
  language_data = `{{{language_data}}}`
  rtl_data = `{{{rtl_data}}}`

  data_for_locale = (locale) ->
    result = language_data[locale]
    if result? then result else null
  
  code_for_language = (language, locale) ->
    result = null
    language = language.toLowerCase()
    locale_data = data_for_locale(locale)
    for locale_code, language_name of locale_data
      if language_name.toLowerCase() == language
        result = locale_code
        break
    result

  @all: ->
    data_for_locale(TwitterCldr.locale)

  @all_for: (locale) ->
    data_for_locale(locale)

  @from_code: (code) ->
    @from_code_for_locale(code, TwitterCldr.locale)

  @from_code_for_locale: (code, locale) ->
    result = null
    locale_data = @all_for(locale)
    for locale_code, language_name of locale_data
      if locale_code == code
        result = language_name
        break
    result

  @translate_language: (language, source_locale, dest_locale) ->
    language_code = code_for_language(language, source_locale)
    dest_locale_data = @all_for(dest_locale)
    if language_code? then dest_locale_data[language_code] else null

  @is_rtl: (locale) ->
    result = rtl_data[locale]
    if result? then result else null
