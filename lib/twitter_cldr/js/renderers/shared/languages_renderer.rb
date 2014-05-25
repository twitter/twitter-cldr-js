# encoding: UTF-8

# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

module TwitterCldr
  module Js
    module Renderers
      module Shared
        class LanguagesRenderer < TwitterCldr::Js::Renderers::Base
          self.template_file = File.expand_path(File.join(File.dirname(__FILE__), "../..", "mustache/shared/languages.coffee"))

          def language_data
            TwitterCldr.supported_locales.inject({}) do |ret, country_code|
              ret[country_code] = TwitterCldr.get_locale_resource(country_code, :languages)[country_code][:languages]
              ret
            end.to_json
          end
          def rtl_data
            TwitterCldr.supported_locales.inject({}) do |ret, locale|
              ret[locale] = TwitterCldr.get_locale_resource(locale, :layout)[locale][:layout][:orientation][:character_order] == "right-to-left"
              ret
            end.to_json
          end
        end
      end
    end
  end
end