# encoding: UTF-8

# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

require 'cldr-plurals'
require 'cldr-plurals/javascript_runtime'

module TwitterCldr
  module Js
    module Renderers
      module PluralRules

        class PluralRulesRenderer < TwitterCldr::Js::Renderers::Base
          set_template "mustache/plurals/rules.coffee"

          def rules
            rule_list = CldrPlurals::Compiler::RuleList.new(locale)

            resource.each_pair do |name, rule_text|
              unless name == :other
                rule_list.add_rule(name, rule_text)
              end
            end

            rule_list.to_code(:javascript)
          end

          def runtime
            CldrPlurals::JavascriptRuntime.source
          end

          def names
            resource.keys.map(&:to_s).inspect
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
