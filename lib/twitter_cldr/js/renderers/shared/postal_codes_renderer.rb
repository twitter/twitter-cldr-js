# encoding: UTF-8

# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

module TwitterCldr
  module Js
    module Renderers
      module Shared
        class PostalCodesRenderer < TwitterCldr::Js::Renderers::Base
          self.template_file = File.expand_path(File.join(File.dirname(__FILE__), "../..", "mustache/shared/postal_codes.coffee"))

          def postal_codes
            TwitterCldr::Shared::PostalCodes.territories.inject({}) do |ret, country_code|
              ret[country_code] = TwitterCldr::Shared::PostalCodes.regex_for_territory(country_code).source
              ret
            end.to_json
          end
        end
      end
    end
  end
end