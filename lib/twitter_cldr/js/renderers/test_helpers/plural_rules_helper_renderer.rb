# encoding: UTF-8

# Copyright 2012 Twitter, Inc
# http://www.apache.org/licenses/LICENSE-2.0

require 'cldr-plurals'
require 'cldr-plurals/javascript_runtime'

module TwitterCldr
  module Js
    module Renderers
      module TestRenderers
        module TestHelpers

          class PluralRulesHelperRenderer < TwitterCldr::Js::Renderers::Base
            set_template "mustache/test_helpers/plural_rules_helper.coffee"
            def global_rules
              all_plurals = TwitterCldr.supported_locales.map do |locale|
                plurals = resource(locale).map do |plural_type, plural_data|

                  rule_list = CldrPlurals::Compiler::RuleList.new(locale)

                  plural_data.each_pair do |name, rule_text|
                    unless name == :other
                      rule_list.add_rule(name, rule_text)
                    end
                  end

                  "#{plural_type}: #{rule_list.to_code(:javascript)}"
                end

                "'#{locale}': {#{plurals.join(', ')}}"
              end
              "{#{all_plurals.join(', ')}}"
            end

            def global_names
              all_names = TwitterCldr.supported_locales.map do |locale|
                names = resource(locale).map do |plural_type, plural_data|
                  sub_names = plural_data.keys.map(&:to_s).inspect
                  "#{plural_type}: #{sub_names}"
                end

                "'#{locale}': {#{names.join(', ')}}"
              end
              "{#{all_names.join(', ')}}"
            end

            private

            def resource(locale)
              TwitterCldr.get_locale_resource(locale, "plural_rules")[locale]
            end
          end

        end
      end
    end
  end
end
