# encoding: UTF-8

# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

module TwitterCldr
  module Js
    module Renderers
      module ImplementationRenderers
        module Shared

          class CalendarRenderer < TwitterCldr::Js::Renderers::Base
            set_template "mustache/implementation/shared/calendar.coffee"
          end

        end
      end
    end
  end
end
