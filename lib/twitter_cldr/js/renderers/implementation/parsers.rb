# encoding: UTF-8

# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

module TwitterCldr
  module Js
    module Renderers
      module ImplementationRenderers
        module Parsers

          class ParserRenderer < TwitterCldr::Js::Renderers::Base
            set_template "mustache/implementation/parsers/parser.coffee"
          end

          class NumberParser < TwitterCldr::Js::Renderers::Base
            set_template "mustache/implementation/parsers/number_parser.coffee"
          end

          class SegmentationParserRenderer < TwitterCldr::Js::Renderers::Base
            set_template "mustache/implementation/parsers/segmentation_parser.coffee"
          end

          class SymbolTableRenderer < TwitterCldr::Js::Renderers::Base
            set_template "mustache/implementation/parsers/symbol_table.coffee"
          end

          class UnicodeRegexParserRenderer < TwitterCldr::Js::Renderers::Base
            set_template "mustache/implementation/parsers/unicode_regex_parser.coffee"
          end

          module UnicodeRegex
            class CharacterClassRenderer < TwitterCldr::Js::Renderers::Base
              set_template "mustache/implementation/parsers/unicode_regex/character_class.coffee"
            end

            class CharacterRangeRenderer < TwitterCldr::Js::Renderers::Base
              set_template "mustache/implementation/parsers/unicode_regex/character_range.coffee"
            end

            class CharacterSetRenderer < TwitterCldr::Js::Renderers::Base
              set_template "mustache/implementation/parsers/unicode_regex/character_set.coffee"
            end

            class ComponentRenderer < TwitterCldr::Js::Renderers::Base
              set_template "mustache/implementation/parsers/unicode_regex/component.coffee"
            end

            class LiteralRenderer < TwitterCldr::Js::Renderers::Base
              set_template "mustache/implementation/parsers/unicode_regex/literal.coffee"
            end

            class UnicodeStringRenderer < TwitterCldr::Js::Renderers::Base
              set_template "mustache/implementation/parsers/unicode_regex/unicode_string.coffee"
            end
          end

        end
      end
    end
  end
end
