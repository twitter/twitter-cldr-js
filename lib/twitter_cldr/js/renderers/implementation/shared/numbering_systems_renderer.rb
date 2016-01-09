# encoding: UTF-8

# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

module TwitterCldr
  module Js
    module Renderers
      module Implementation
        module Shared
          class NumberingSystemsRenderer < TwitterCldr::Js::Renderers::Base
            set_template "mustache/implementation/shared/numbering_systems.coffee"

            def resource
              TwitterCldr.get_resource(:shared, :numbering_systems)[:numbering_systems].to_json
            end
          end
        end
      end
    end
  end
end
