# encoding: UTF-8

# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

module TwitterCldr
  module Js
    module Renderers
      module Implementation
        module Numbers

          class NumbersRenderer < TwitterCldr::Js::Renderers::Base
            set_template "mustache/implementation/numbers/numbers.coffee"
          end

          module RBNF
            class RBNFRenderer < TwitterCldr::Js::Renderers::Base
              set_template "mustache/implementation/numbers/rbnf/rbnf.coffee"
            end

            class FormattersRenderer < TwitterCldr::Js::Renderers::Base
              set_template "mustache/implementation/numbers/rbnf/formatters.coffee"
            end

            class RuleRenderer < TwitterCldr::Js::Renderers::Base
              set_template "mustache/implementation/numbers/rbnf/rule.coffee"
            end

            class RuleSetRenderer < TwitterCldr::Js::Renderers::Base
              set_template "mustache/implementation/numbers/rbnf/rule_set.coffee"
            end

            class RuleGroupRenderer < TwitterCldr::Js::Renderers::Base
              set_template "mustache/implementation/numbers/rbnf/rule_group.coffee"
            end

            class RuleParserRenderer < TwitterCldr::Js::Renderers::Base
              set_template "mustache/implementation/numbers/rbnf/rule_parser.coffee"
            end

            class SubstitutionRenderer < TwitterCldr::Js::Renderers::Base
              set_template "mustache/implementation/numbers/rbnf/substitution.coffee"
            end

            class PluralRenderer < TwitterCldr::Js::Renderers::Base
              set_template "mustache/implementation/numbers/rbnf/plural.coffee"
            end

            class NumberDataReaderRenderer < TwitterCldr::Js::Renderers::Base
              set_template "mustache/implementation/numbers/rbnf/number_data_reader.coffee"
            end
          end

        end
      end
    end
  end
end
