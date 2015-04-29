# encoding: UTF-8

# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

module TwitterCldr
  module Js
    module Renderers
      module DataRenderers
        module Numbers
          module RBNF

            class RBNFRenderer < TwitterCldr::Js::Renderers::Base
              set_template "mustache/data/numbers/rbnf/rbnf.coffee"

              def resource
                {
                  locale.to_sym => TwitterCldr.resources.get_locale_resource(locale, "rbnf")[locale][:rbnf][:grouping]
                }.to_json
              end
            end

            class FormattersRenderer < TwitterCldr::Js::Renderers::Base
              set_template "mustache/data/numbers/rbnf/formatters.coffee"
            end

            class RuleRenderer < TwitterCldr::Js::Renderers::Base
              set_template "mustache/data/numbers/rbnf/rule.coffee"
            end

            class RuleSetRenderer < TwitterCldr::Js::Renderers::Base
              set_template "mustache/data/numbers/rbnf/rule_set.coffee"
            end

            class RuleGroupRenderer < TwitterCldr::Js::Renderers::Base
              set_template "mustache/data/numbers/rbnf/rule_group.coffee"
            end

            class RuleParserRenderer < TwitterCldr::Js::Renderers::Base
              set_template "mustache/data/numbers/rbnf/rule_parser.coffee"
            end

            class SubstitutionRenderer < TwitterCldr::Js::Renderers::Base
              set_template "mustache/data/numbers/rbnf/substitution.coffee"
            end

            class PluralRenderer < TwitterCldr::Js::Renderers::Base
              set_template "mustache/data/numbers/rbnf/plural.coffee"
            end

            autoload :NumberDataReaderRenderer, 'twitter_cldr/js/renderers/data/numbers/rbnf/number_data_reader_renderer'
          end
        end
      end
    end
  end
end
