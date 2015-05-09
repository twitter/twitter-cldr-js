# encoding: UTF-8

# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

module TwitterCldr
  module Js
    module Renderers
      module ImplementationRenderers
        module Utils

          class CodePointsRenderer < TwitterCldr::Js::Renderers::Base
            set_template "mustache/implementation/utils/code_points.coffee"
          end

          class RangeRenderer < TwitterCldr::Js::Renderers::Base
            set_template "mustache/implementation/utils/range.coffee"
          end

          class RangeSetRenderer < TwitterCldr::Js::Renderers::Base
            set_template "mustache/implementation/utils/range_set.coffee"
          end

        end
      end
    end
  end
end
