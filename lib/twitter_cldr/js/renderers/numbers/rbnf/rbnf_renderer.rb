# encoding: UTF-8

# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

module TwitterCldr
  module Js
    module Renderers
      module Numbers

        class RBNFRenderer < TwitterCldr::Js::Renderers::Base
          set_template "mustache/numbers/rbnf/rbnf.coffee"

          def resource
            TwitterCldr.supported_locales.inject({}) do |result, locale|
              result[locale] = TwitterCldr.resources.get_locale_resource(locale, "rbnf")[locale][:rbnf][:grouping]
              result
            end.to_json
          end

        end
      end
    end
  end
end