# encoding: UTF-8

# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

module TwitterCldr
  module Js
    module Renderers
      module DataRenderers
        module Parsers

          class LiteralRenderer < TwitterCldr::Js::Renderers::Base
            set_template "mustache/parsers/unicode_regex/literal.coffee"
          end

        end
      end
    end
  end
end
