# encoding: UTF-8

# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

module TwitterCldr
  module Js
    module Renderers
      module Implementation
        module Clone

          class CloneRenderer < TwitterCldr::Js::Renderers::Base
            set_template "mustache/implementation/clone/clone.coffee"
          end

        end
      end
    end
  end
end
