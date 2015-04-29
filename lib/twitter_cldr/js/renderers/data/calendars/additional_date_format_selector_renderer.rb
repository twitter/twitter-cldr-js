# encoding: UTF-8

# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

module TwitterCldr
  module Js
    module Renderers
      module DataRenderers
        module Calendars

          class AdditionalDateFormatSelectorRenderer < TwitterCldr::Js::Renderers::Base
            set_template "mustache/data/calendars/additional_date_format_selector.coffee"
          end

        end
      end
    end
  end
end
