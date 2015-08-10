# encoding: UTF-8

# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

require 'cldr-plurals'
require 'cldr-plurals/javascript_runtime'

module TwitterCldr
  module Js
    module Renderers
      module Data
        module PluralRules

          class PluralRulesRenderer < TwitterCldr::Js::Renderers::Base

            def rules
              plurals = resource.map do |plural_type, plural_data|
                rule_list = CldrPlurals::Compiler::RuleList.new(locale)

                plural_data.each_pair do |name, rule_text|
                  unless name == :other
                    rule_list.add_rule(name, rule_text)
                  end
                end

                "#{plural_type}: #{rule_list.to_code(:javascript)}"
              end

              "{#{plurals.join(', ')}}"
            end

            def rules
              resource.inject({}) do |ret, (plural_type, plural_data)|
                rule_list = CldrPlurals::Compiler::RuleList.new(locale)
                plural_data.each_pair do |name, rule_text|
                  unless name == :other
                    rule_list.add_rule(name, rule_text)
                  end
                end

                ret[plural_type] = rule_list.to_code(:javascript)
                ret
              end
            end

            def names
              resource.inject({}) do |ret, (plural_type, plural_data)|
                ret[plural_type] = plural_data.keys
                ret
              end
            end

            def get_data
              {
                :PluralRules => {
                  :rules => rules(),
                  :names => names()
                }
              }
            end

            private

            def resource
              TwitterCldr.get_locale_resource(locale, "plural_rules")[locale]
            end
          end

        end
      end
    end
  end
end
