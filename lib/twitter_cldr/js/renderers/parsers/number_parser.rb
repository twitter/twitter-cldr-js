# encoding: UTF-8

# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

module TwitterCldr
  module Js
    module Renderers
      module Parsers

        class NumberParser < TwitterCldr::Js::Renderers::Base
          self.template_file = File.expand_path(
            File.join(File.dirname(__FILE__), "../..", "mustache/parsers/number_parser.coffee")
          )

          def group_separator
            Regexp.escape(parser.send(:group_separator))
          end

          def decimal_separator
            Regexp.escape(parser.send(:decimal_separator))
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