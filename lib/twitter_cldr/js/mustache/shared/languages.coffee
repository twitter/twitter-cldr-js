# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

class TwitterCldr.Languages
  @language_data = `{{{language_data}}}`

  @all_for: (locale) ->
    result = @language_data[locale]
    result    

  @from_code_for_locale: (code, locale) ->
    result = null
    locale_resource = @all_for(locale)
    for locale_code, language_code of locale_resource
      if locale_code == code
        result = language_code
        break
    result

  # @translate_language(language, source_locale, dest_locale)
    