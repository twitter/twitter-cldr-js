# encoding: UTF-8

# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

module TwitterCldr
  module Js
    module Renderers
      module ImplementationRenderers
        module Calendars

          class AdditionalDateFormatSelectorRenderer < TwitterCldr::Js::Renderers::Base
            set_template "mustache/implementation/calendars/additional_date_format_selector.coffee"
          end

          class DateTimeRenderer < TwitterCldr::Js::Renderers::Base
            set_template "mustache/implementation/calendars/datetime.coffee"
          end

          class TimespanRenderer < TwitterCldr::Js::Renderers::Base
            set_template "mustache/implementation/calendars/timespan.coffee"
          end

        end
      end
    end
  end
end
