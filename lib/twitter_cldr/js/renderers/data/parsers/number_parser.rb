# encoding: UTF-8

# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

module TwitterCldr
  module Js
    module Renderers
      module DataRenderers
        module Parsers

          class NumberParser < TwitterCldr::Js::Renderers::Base
            set_template "mustache/data/parsers/number_parser.coffee"

            def group_separator
              parser.send(:group_separator)
            end

            def decimal_separator
              parser.send(:decimal_separator)
            end

            def get_data
              {
                :NumberParser => {
                  :group_separator => group_separator(),
                  :decimal_separator => decimal_separator()
                }
              }
            end

            private

            def parser
              @parser = TwitterCldr::Parsers::NumberParser.new(locale)
            end
          end

        end
      end
    end
  end
end
