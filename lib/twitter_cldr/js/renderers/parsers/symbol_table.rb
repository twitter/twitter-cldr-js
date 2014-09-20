# encoding: UTF-8

# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

module TwitterCldr
  module Js
    module Renderers
      module Parsers

        class SymbolTableRenderer < TwitterCldr::Js::Renderers::Base
          set_template "mustache/parsers/symbol_table.coffee"
        end

      end
    end
  end
end