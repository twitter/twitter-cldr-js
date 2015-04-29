# encoding: UTF-8

# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

module TwitterCldr
  module Js
    module Renderers
      module DataRenderers
        module Shared
          class CalendarRenderer < TwitterCldr::Js::Renderers::Base
            set_template "mustache/data/shared/calendar.coffee"

            def calendar
              TwitterCldr::DataReaders::CalendarDataReader.new(@locale).calendar.calendar_data.to_json
            end
          end
        end
      end
    end
  end
end
