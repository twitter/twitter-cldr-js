# encoding: UTF-8

# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

module TwitterCldr
  module Js
    module Renderers
      module DataRenderers
        module Shared
          class CurrenciesRenderer < TwitterCldr::Js::Renderers::Base
            set_template "mustache/data/shared/currencies.coffee"

            def currencies
              TwitterCldr::Shared::Currencies.currency_codes.inject({}) do |ret, currency_code|
                ret[currency_code] = TwitterCldr::Shared::Currencies.for_code(currency_code)
                ret
              end.to_json
            end
          end
        end
      end
    end
  end
end
