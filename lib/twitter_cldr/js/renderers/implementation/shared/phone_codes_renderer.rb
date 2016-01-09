# encoding: UTF-8

# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

module TwitterCldr
  module Js
    module Renderers
      module Implementation
        module Shared
          class PhoneCodesRenderer < TwitterCldr::Js::Renderers::Base
            set_template "mustache/implementation/shared/phone_codes.coffee"

            def phone_codes
              TwitterCldr::Shared::PhoneCodes.territories.inject({}) do |ret, country_code|
                ret[country_code] = TwitterCldr::Shared::PhoneCodes.code_for_territory(country_code)
                ret
              end.to_json
            end
          end
        end
      end
    end
  end
end
