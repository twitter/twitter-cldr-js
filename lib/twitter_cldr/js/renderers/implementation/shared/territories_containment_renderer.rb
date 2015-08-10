# encoding: UTF-8

# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

module TwitterCldr
  module Js
    module Renderers
      module Implementation
        module Shared
          class TerritoriesContainmentRenderer < TwitterCldr::Js::Renderers::Base
            set_template 'mustache/implementation/shared/territories_containment.coffee'

            def territories_data
              TwitterCldr::Shared::TerritoriesContainment.containment_map.to_json
            end
          end
        end
      end
    end
  end
end
