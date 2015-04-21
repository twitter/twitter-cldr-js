# encoding: UTF-8

# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

module TwitterCldr
  module Js
    module Renderers
      module Shared

        class ListRenderer < TwitterCldr::Js::Renderers::Base
          set_template "mustache/shared/lists.coffee"

          def formats
            TwitterCldr.get_locale_resource(@locale, :lists)[@locale][:lists][:default].to_json
          end
        end

      end
    end
  end
end