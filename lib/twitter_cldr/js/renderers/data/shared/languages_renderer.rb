# encoding: UTF-8

# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

module TwitterCldr
  module Js
    module Renderers
      module DataRenderers
        module Shared
          class LanguagesRenderer < TwitterCldr::Js::Renderers::Base
            set_template "mustache/data/shared/languages.coffee"

            def language_data
              TwitterCldr.get_locale_resource(@locale, :languages)[@locale][:languages].to_json
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
end
